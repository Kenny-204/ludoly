import { createContext, useContext, useEffect, useState } from "react";
import type { gameStateType } from "../types/game.t";
import { useSocket } from "./socket";
import { useNavigate } from "react-router-dom";

const gameStateContext = createContext<gameStateType | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export function useGameState() {
  const context = useContext(gameStateContext);
  if (!context) {
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

  const [gameState, setGameState] = useState<gameStateType | null>(null);

  useEffect(
    function () {
      if (!socket) return;

      socket.on(
        "room-created",
        (data: { roomCode: string; state: gameStateType }) => {
          setGameState(data.state);
          navigate("/online/lobby");
        },
      );

      return () => {
        socket.off("room-created", (roomCode: string, state: gameStateType) => {
          console.log(roomCode, state);
        });
      };
    },
    [socket, navigate],
  );

  return (
    <gameStateContext.Provider value={gameState}>
      {children}
    </gameStateContext.Provider>
  );
}
