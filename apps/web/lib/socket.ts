import { Shape } from "types/types";
import { debouncer } from "./debouncer";

export function eraseShape(socket: WebSocket, id: string, roomId: number) {
    socket.send(JSON.stringify({
        id,
        roomId,
        type: "erase",
    }));
}



export async function updateShapeCoordinates(
    socket: WebSocket,
    oldShapeId: string,
    roomId: number,
    newShape: string,
    timer: NodeJS.Timeout | null,
    setTimerFn: (timer: NodeJS.Timeout) => void
) {
    console.log("shape id", oldShapeId)
    debouncer(timer, setTimerFn, () => {
        console.log("debouncing");
        eraseShape(socket, oldShapeId, roomId);
        socket.send(newShape);
    }, 300);
}

export function sendToSocket(socket: WebSocket, msg: string) {
    socket.send(msg);
}