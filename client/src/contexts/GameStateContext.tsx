import { createContext, useContext } from "react";

const gameStateContext = createContext(null);

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
  return (
    <gameStateContext.Provider value={{}}>{children}</gameStateContext.Provider>
  );
}
