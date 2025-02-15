import { useEffect } from "react";
import { io } from "socket.io-client";
import { useSetRecoilState } from "recoil";
import { positionsState } from "./state";

const socket = io(process.env.REACT_APP_SOCKET_URL || "http://localhost:4000");

const SocketHandler = () => {
  const setPositions = useSetRecoilState(positionsState);

  useEffect(() => {
    socket.on("position_update", ({ ts, pos }) => {
      setPositions((prev) => {
        const updated = [...prev];
        updated[pos - 1] = ts; // Store timestamp in correct position
        return updated;
      });
    });

    return () => socket.off("position_update");
  }, [setPositions]);

  return null;
};

export default SocketHandler;
