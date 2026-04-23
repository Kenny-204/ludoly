// import { createContext, useContext } from "react";
// import type { gameStateType } from "../types/game.t";


// const gameStateContext = createContext<gameStateType | null>(null);

// // eslint-disable-next-line react-refresh/only-export-components
// export function useGameState() {
//   const context = useContext(gameStateContext);
//   if (!context) {
//     throw new Error("Game context used outside of provider");
//   }
//   return context;
// }

// export default function GameStateProvider({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <gameStateContext.Provider value={{}}>{children}</gameStateContext.Provider>
//   );
// }
