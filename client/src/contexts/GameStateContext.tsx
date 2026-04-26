import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { gameStateType, player } from "../types/game.t";
import { useSocket } from "./socket";
import { useNavigate } from "react-router-dom";

type GameStateContextType = {
  setPlayerId: React.Dispatch<React.SetStateAction<string>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
  gameState: gameStateType | null;
  playerId: string;
  error: string;
  currentPlayer: player | undefined;
};

const gameStateContext = createContext<GameStateContextType | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export function useGameState() {
  const context = useContext(gameStateContext);
  if (context === null) {
    throw new Error("Game context used outside of provider");
  }
  return context;
}

export default function GameStateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { socket } = useSocket();
  const navigate = useNavigate();

  const [error, setError] = useState<string>("");

  const [gameState, setGameState] = useState<gameStateType | null>(() => {
    const saved = JSON.parse(localStorage.getItem("ludoly-game") || "null");
    return saved?.state || null;
  });

  const [playerId, setPlayerId] = useState<string>(() => {
    const saved = JSON.parse(localStorage.getItem("ludoly-game") || "null");
    return saved?.playerId || null;
  });

  const updateGameLocally = useCallback(
    (state: gameStateType) => {
      const game = { state, playerId };
      localStorage.setItem("ludoly-game", JSON.stringify(game));
    },
    [playerId],
  );

  useEffect(
    function () {
      if (!socket) return;

      const handleCreatedRoom = (data: {
        roomCode: string;
        state: gameStateType;
      }) => {
        setGameState(data.state);
        updateGameLocally(data.state);
        navigate("/online/lobby");
      };

      const handleJoinedRoom = (data: {
        roomCode: string;
        state: gameStateType;
      }) => {
        setGameState(data.state);
        updateGameLocally(data.state);
        navigate("/online/lobby");
      };
      const handleStartGame = (state: gameStateType) => {
        setGameState(state);
        updateGameLocally(state);
        navigate("/online/game");
      };
      const handleStateSync = (state: gameStateType) => {
        setGameState(state);
        updateGameLocally(state);
      };

      const handleError = (error: { message: string }) => {
        console.log(error.message);
        setError(error.message);
      };

      socket.on("room-created", handleCreatedRoom);
      socket.on("player-joined", handleJoinedRoom);
      socket.on("start-game", handleStartGame);
      socket.on("state", handleStateSync);
      socket.on("error", handleError);

      return () => {
        socket.off("room-created", handleCreatedRoom);
        socket.off("player-joined", handleJoinedRoom);
        socket.off("start-game", handleStartGame);
        socket.off("state", handleStateSync);
        socket.off("error", handleError);
      };
    },
    [socket, navigate, updateGameLocally],
  );

  const currentPlayer = gameState?.players.find(
    (player) => player.id === playerId,
  );

  const value = {
    setPlayerId,
    setError,
    gameState,
    playerId,
    error,
    currentPlayer,
  };
  return (
    <gameStateContext.Provider value={value}>
      {children}
    </gameStateContext.Provider>
  );
}
