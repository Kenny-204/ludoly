import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HomePage } from "./features/Home/HomePage.tsx";
import { OnlinePage } from "./features/Online/OnlinePage.tsx";
import { PlayerSelectPage } from "./features/PassAndPlay/PlayerSelectPage.tsx";
import Game from "./features/ludoGame/Game.tsx";
import SocketProvider from "./contexts/socket.tsx";
import Login from "./features/auth/Login.tsx";
import Signup from "./features/auth/Signup.tsx";
import AuthProvider from "./contexts/AuthContext.tsx";
import { Profile } from "./features/Profile/Profile.tsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <div>Error page not found </div>,
  },
  {
    path: "/login",
    element: <Login />,
  },

  {
    path: "/signup",
    element: <Signup />,
  },

  {
    path: "/online",
    element: <OnlinePage />,
  },

  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/player-select",
    element: <PlayerSelectPage />,
  },
  {
    path: "/game-play",
    element: <Game />,
  },
]);

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <RouterProvider router={router} />
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
