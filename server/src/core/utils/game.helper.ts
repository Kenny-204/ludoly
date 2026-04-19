type pieceState = "HOME" | "BOARD" | "HOME_STRETCH" | "FINISHED";

type piece = {
  id: string;
  ownerId: number;
  position: number;
  state: pieceState;
  distance: number;
  hasGoneRound: boolean;
  initialPosition: number;
};

export function getStartPosition(playerIndex: number) {
  if (playerIndex === 0) {
    return 42;
  }
  if (playerIndex === 1) {
    return 3;
  }
  if (playerIndex === 2) {
    return 29;
  }
  if (playerIndex === 3) {
    return 16;
  }
  return 0;
}

export function getNextPlayer(currentPlayerId: number, playing: number[]) {
  const currentPlayerIndex = playing.findIndex(
    (playerId) => playerId === currentPlayerId,
  )!;

  return playing[(currentPlayerIndex + 1) % playing.length];
}

export function getNextPosition(
  currentPosition: number,
  distance: number,
  playerId: number,
  currentMoveNumber: number,
  totalPosition: number = 51,
) {
  const shouldEnterHomeStretch = distance + currentMoveNumber > totalPosition;
  if (playerId === 0 && shouldEnterHomeStretch) {
    return ((distance + currentMoveNumber) % totalPosition) + 7;
  }
  if (playerId === 1 && shouldEnterHomeStretch) {
    return ((distance + currentMoveNumber) % totalPosition) + 2;
  }
  if (playerId === 2 && shouldEnterHomeStretch) {
    return ((distance + currentMoveNumber) % totalPosition) + 12;
  }
  if (playerId === 3 && shouldEnterHomeStretch) {
    return ((distance + currentMoveNumber) % totalPosition) + 17;
  } else return (currentPosition + currentMoveNumber) % totalPosition;
}

export function isPiecePlayable(
  currentPiece: piece,
  dice: number | number[] | null,
  playerId: number,
  gamePhase: "WAITING" | "ROLLING",
): boolean {
  if (gamePhase === "WAITING") {
    console.log("It happened because the game phase was waiting");
    return false;
  }
  if (!dice || playerId !== currentPiece.ownerId) {
    console.log(
      "It happened because there was no dice or the player id was not equal to the current piece",
    );
    return false;
  }
  if (currentPiece.state === "FINISHED") {
    console.log("It happened because the piece was finished");
    return false;
  }

  const diceValues = Array.isArray(dice) ? dice : [dice];
  return diceValues.some((d, i) => {
    if (d <= 0) {
      console.log("It happened because thedie was -");
      return false;
    }
    if (currentPiece.state === "BOARD") {
      if (currentPiece.distance + d > 56) {
        console.log(
          "It happened because the it would have made the distance more than 56",
        );
        return false;
      }
      return d && true;
    } else if (currentPiece.state === "HOME") return i < 2 && d === 6;
    else if (currentPiece.state === "HOME_STRETCH") {
      if (currentPiece.distance + d > 56) {
        console.log(
          "It happened because the distance would have been more than 56",
        );
        return false;
      }

      return true;
    }
  });
}
