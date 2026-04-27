import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomePage } from "./features/Home/HomePage.tsx";
import { OnlinePage } from "./features/Online/OnlinePage.tsx";
import { CreateRoomPage } from "./features/Online/CreateRoomPage.tsx";
import { JoinRoomPage } from "./features/Online/JoinRoomPage.tsx";
import { LobbyPage } from "./features/Online/LobbyPage.tsx";
import { PlayerSelectPage } from "./features/PassAndPlay/PlayerSelectPage.tsx";
import Game from "./features/ludoGame/Game.tsx";
import SocketProvider from "./contexts/socket.tsx";
import Login from "./features/auth/Login.tsx";
import Signup from "./features/auth/Signup.tsx";
import AuthProvider from "./contexts/AuthContext.tsx";
import { Profile } from "./features/Profile/Profile.tsx";
import PublicOnlyRoute from "./features/auth/PublicOnlyRoute.tsx";
import GameStateProvider from "./contexts/GameStateContext.tsx";
import OnlineGame from "./features/Online/OnlineGame.tsx";

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <BrowserRouter>
          <GameStateProvider>
            <Routes>
              <Route path="/" element={<HomePage />} />

              <Route element={<PublicOnlyRoute />}>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
              </Route>
              <Route path="/online" element={<OnlinePage />}>
                <Route path="create" element={<CreateRoomPage />} />
                <Route path="join" element={<JoinRoomPage />} />
                <Route path="lobby" element={<LobbyPage />} />
                <Route path="game" element={<OnlineGame />} />
              </Route>
              <Route path="/profile" element={<Profile />} />
              <Route path="/player-select" element={<PlayerSelectPage />} />
              <Route path="/game-play" element={<Game />} />
            </Routes>
          </GameStateProvider>
        </BrowserRouter>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
