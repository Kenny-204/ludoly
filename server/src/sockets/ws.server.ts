import type { Redis } from "ioredis";
import { stringify } from "querystring";
import type { Server, Socket } from "socket.io";
import {
  createInitialGameState,
  generateRoomCode,
  getPlayerColor,
  PlayerClass,
} from "../core/utils/game.helper.js";
import type { actionType, gameStateType, player } from "../core/types/game.t.js";

class WebSocketManager {
  constructor(
    private io: Server,
    private redisClient: Redis,
  ) {
    this.init();
  }

  private init() {
    this.io.on("connection", (socket) => {
      console.log("Player connected", socket.id);

      this.io.on("create-room", (data) => this.handleCreateRoom(socket, data));
      this.io.on("join-room", (data) => this.handleJoinRoom(socket, data));
      this.io.on("start-game", (data) => this.handleStartGame(socket, data));
      this.io.on("roll-dice", this.handleRollDice);
      // this.io.on("select-number", this.handleSelectNumber);
      this.io.on("move-piece", this.handleMovePiece);
      this.io.on("disconnect", this.handleDisconnect);
    });
  }

  private async getGameState(socket: Socket, roomCode: String) {
    if (!(await this.redisClient.exists(`game:${roomCode}`))) {
      socket.emit("error", { message: "This room does not exist" });
      return;
    }
    return JSON.parse((await this.redisClient.get(`game:${roomCode}`)) || "");
  }

  private async handleCreateRoom(
    socket: Socket,
    data: { playerId: string; numPlayers: number },
  ) {
    const { playerId, numPlayers } = data;
    const initialGameState = createInitialGameState(numPlayers);
    const currentNumberOfPlayers = initialGameState.players.length;
    initialGameState.players.push(
      new PlayerClass({
        playerId,
        color: getPlayerColor(currentNumberOfPlayers + 1),
        playerIndex: currentNumberOfPlayers,
        playerNumber: currentNumberOfPlayers,
      }),
    );
    initialGameState.playing.push(playerId);
    initialGameState.currentPlayerId = playerId;

    const roomCode = generateRoomCode();

    await this.redisClient.set(
      `game:${roomCode}`,
      JSON.stringify(initialGameState),
    );

    socket.join(roomCode);
    socket.emit("room-created", { roomCode, state: initialGameState });
  }

  private async handleJoinRoom(
    socket: Socket,
    data: { playerId: string; roomCode: string },
  ) {
    const { playerId, roomCode } = data;

    if (!(await this.redisClient.exists(`game:${roomCode}`))) {
      socket.emit("error", { message: "This room does not exist" });
      return;
    }

    const currentGameState: gameStateType = JSON.parse(
      (await this.redisClient.get(`game:${roomCode}`)) || "",
    );
    const currentNumberOfPlayers = currentGameState.players.length;

    if (currentNumberOfPlayers === currentGameState.numPlayers) {
      socket.emit("error", { message: "This room is already full" });
      return;
    }
    currentGameState.players.push(
      new PlayerClass({
        playerId,
        color: getPlayerColor(currentNumberOfPlayers + 1),
        playerIndex: currentNumberOfPlayers,
        playerNumber: currentNumberOfPlayers,
      }),
    );

    await this.redisClient.set(
      `game:${roomCode}`,
      JSON.stringify(currentGameState),
    );

    socket.join(roomCode);
    this.io
      .to(roomCode)
      .emit("player-joined", { roomCode, state: currentGameState });
  }
  private async handleStartGame(socket: Socket, data: { roomCode: string }) {
    const { roomCode } = data;

    if (!(await this.redisClient.exists(`game:${roomCode}`))) {
      socket.emit("error", { message: "This room does not exist" });
      return;
    }

    const currentGameState: gameStateType = JSON.parse(
      (await this.redisClient.get(`game:${roomCode}`)) || "",
    );
    const allReady = currentGameState.players.every(
      (player: player) => player.isReady === true,
    );

    if (!allReady) {
      socket.emit("error", { message: "All Players are not ready" });
      return;
    }
    // START THE GAME SOMEHOW
  }
  private async handleRollDice(
    socket: Socket,
    data: { roomCode: string; action: actionType },
  ) {
    const { action, roomCode } = data;
    const currentGameState = await this.getGameState(socket, roomCode);
    if (!currentGameState) return;
  }
  private handleMovePiece() {}
  private handleDisconnect(socket: Socket) {
    socket.emit("disconnect");
  }
}
