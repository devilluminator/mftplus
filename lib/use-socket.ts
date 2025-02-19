import { io, Socket } from "socket.io-client";

const useSocket = (): Socket | null => {
  const socket = io("/");

  return socket;
};

export default useSocket;
