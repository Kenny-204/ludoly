import { stringify } from "querystring";
import type { Server, Socket } from "socket.io";
import {
  createInitialGameState,
  generateRoomCode,
  getPlayerColor,
  PlayerClass,
} from "../core/utils/game.helper.js";
import type {
  actionType,
  gameStateType,
  player,
} from "../core/types/game.t.js";
import gameReducer from "../application/game/game.reducer.js";
import type { RedisClient } from "ioredis/built/connectors/SentinelConnector/types.js";

export class WebSocketManager {
  constructor(
    private io: Server,
    private redisClient: any,
  ) {
    this.init();
  }

  private init() {
    this.io.on("connection", (socket) => {
      console.log("Player connected", socket.id);

      socket.on("create-room", (data) => this.handleCreateRoom(socket, data));
      socket.on("join-room", (data) => this.handleJoinRoom(socket, data));
      socket.on("start-game", (data) => this.handleStartGame(socket, data));
      socket.on("ready-player", (data) => this.handlePlayerReady(socket, data));
      socket.on("game-action", (data) => this.handleGameAction(socket, data));
      socket.on("disconnect", () => this.handleDisconnect(socket));
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
    data: { playerId: string; username: string; numPlayers: number },
  ) {
    const { playerId, numPlayers, username } = data;
    const initialGameState = createInitialGameState(numPlayers);
    const currentNumberOfPlayers = initialGameState.players.length;
    initialGameState.players.push(
      new PlayerClass({
        playerId,
        username,
        color: getPlayerColor(currentNumberOfPlayers + 1),
        playerIndex: currentNumberOfPlayers,
      }),
    );
    initialGameState.playing.push(playerId);
    initialGameState.currentPlayerId = playerId;

    const roomCode = generateRoomCode();
    initialGameState.roomCode = roomCode;

    await this.redisClient.set(
      `game:${roomCode}`,
      JSON.stringify(initialGameState),
    );

    socket.join(roomCode);
    socket.emit("room-created", { roomCode, state: initialGameState });
  }

  private async handleJoinRoom(
    socket: Socket,
    data: { playerId: string; username: string; roomCode: string },
  ) {
    const { playerId, roomCode, username } = data;

    if (!(await this.redisClient.exists(`game:${roomCode}`))) {
      socket.emit("error", { message: "This room does not exist" });
      return;
    }

    const currentGameState: gameStateType = JSON.parse(
      (await this.redisClient.get(`game:${roomCode}`)) || "",
    );
    const currentNumberOfPlayers = currentGameState.players.length;
    const totalNumberOfPlayers = currentGameState.numPlayers;
    if (currentNumberOfPlayers === currentGameState.numPlayers) {
      socket.emit("error", { message: "This room is already full" });
      return;
    }
    currentGameState.players.push(
      new PlayerClass({
        playerId,
        username,
        color: getPlayerColor(currentNumberOfPlayers + 1),
        playerIndex: totalNumberOfPlayers === 2 ? 3 : currentNumberOfPlayers,
      }),
    );
    currentGameState.playing.push(playerId);

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

    const currentGameState: gameStateType = await this.getGameState(
      socket,
      roomCode,
    );
    if (!currentGameState) return;

    const allReady = currentGameState.players.every(
      (player: player) => player.isReady === true,
    );

    if (!allReady) {
      socket.emit("error", { message: "All Players are not ready" });
      return;
    }

    currentGameState.state = "IN_PROGRESS";
    await this.redisClient.set(
      `game:${roomCode}`,
      JSON.stringify(currentGameState),
    );

    this.io.to(roomCode).emit("state", currentGameState);
  }
  private async handlePlayerReady(
    socket: Socket,
    data: { roomCode: string; playerId: string },
  ) {
    const { roomCode, playerId } = data;
    const currentGameState: gameStateType = await this.getGameState(
      socket,
      roomCode,
    );
    if (!currentGameState) return;

    const currentPlayer = currentGameState.players.find(
      (player) => player.id === playerId,
    );

    if (!currentPlayer) {
      socket.emit("error", { message: "This player does not exist" });
      return;
    }
    currentPlayer.isReady = true;

    await this.redisClient.set(
      `game:${roomCode}`,
      JSON.stringify(currentGameState),
    );

    this.io.to(roomCode).emit("state", currentGameState);
  }
  private async handleGameAction(
    socket: Socket,
    data: { roomCode: string; action: actionType },
  ) {
    const { action, roomCode } = data;
    const currentGameState = await this.getGameState(socket, roomCode);
    if (!currentGameState) return;

    const newState = gameReducer(currentGameState, action);

    await this.redisClient.set(`game:${roomCode}`, JSON.stringify(newState));

    this.io.to(roomCode).emit("state", newState);
  }
  private handleDisconnect(socket: Socket) {
    socket.rooms.forEach((room) => {
      if (room !== socket.id) {
        socket.to(room).emit("player-disconnected", { socketId: socket.id });
      }
    });
  }
}
