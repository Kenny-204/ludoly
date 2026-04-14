import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HomePage } from "./features/Home/HomePage.tsx";
import { OnlinePage } from "./features/Online/OnlinePage.tsx";
import { PlayerSelectPage } from "./features/PassAndPlay/PlayerSelectPage.tsx";
import Game from "./features/ludoGame/game.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <div>Error page not found </div>,
  },
  {
    path: "/online",
    element: <OnlinePage />,
  },
  {
    path: "/player-select",
    element: <PlayerSelectPage />,
  },
  {
    path: "/game-play/",
    element: <Game />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
