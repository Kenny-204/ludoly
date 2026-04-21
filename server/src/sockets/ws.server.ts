import type { Redis } from "ioredis";
import { stringify } from "querystring";
import type { Server, Socket } from "socket.io";
import {
  createInitialGameState,
  generateRoomCode,
  getPlayerColor,
  PlayerClass,
  type gameStateType,
} from "../core/utils/game.helper.js";

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
      this.io.on("join-room", this.handleJoinRoom);
      this.io.on("roll-dice", this.handleRollDice);
      this.io.on("move-piece", this.handleMovePiece);
      this.io.on("disconnect", this.handleDisconnect);
    });
  }

  private async handleCreateRoom(
    socket: Socket,
    data: { playerId: string; numPlayers: number },
  ) {
    const { playerId, numPlayers } = data;
    const initialGameState = createInitialGameState(numPlayers);
    const currentNumberOfPlayers = initialGameState.players.length;
    initialGameState.players.push(
      new PlayerClass(
        playerId,
        getPlayerColor(currentNumberOfPlayers + 1),
        currentNumberOfPlayers + 1,
      ),
    );

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
      new PlayerClass(
        playerId,
        getPlayerColor(currentNumberOfPlayers + 1),
        currentNumberOfPlayers + 1,
      ),
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

  private handleRollDice() {}
  private handleMovePiece() {}
  private handleDisconnect(socket) {
    socket.emit("disconnect");
  }
}
