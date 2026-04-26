import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";

type SocketContextType = {
  socket: Socket | null;
};

const socketContext = createContext<SocketContextType | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export function useSocket() {
  const context = useContext(socketContext);
  if (!context) {
    throw new Error("Context is being used out of Provider");
  }
  return context;
}
export default function SocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(function () {
    const newSocket = io("https://ludoly.onrender.com");
    newSocket.on("connect", () => setSocket(newSocket));

    return () => {
      newSocket.disconnect();
      setSocket(null);
    };
  }, []);

  return (
    <socketContext.Provider value={{ socket }}>
      {children}
    </socketContext.Provider>
  );
}
