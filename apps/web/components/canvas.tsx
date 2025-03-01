"use client";

import { drawCanvas } from "@/lib/canvas-helper";
import { useEffect, useRef, useState } from "react";


const Canvas = ({ roomId }: { roomId: number }) => {
    const [socket, setSocket] = useState<WebSocket | null>(null);



    const canvasRef = useRef<HTMLCanvasElement>(null);


    useEffect(() => {
        const ws = new WebSocket("ws://localhost:8080");

        ws.onopen = (ev) => {
            setSocket(ws);

            ws.send(JSON.stringify({
                roomId,
                type: "join",
            }));
        }
    }, [])


    useEffect(() => {
        if (!canvasRef.current) {
            return;
        }
        if (!socket) {
            return;
        }
        drawCanvas(canvasRef.current, socket, roomId);


    }, [socket]);

    return (
        <canvas width={1080} height={1080} className=" bg-amber-50" ref={canvasRef}>

        </canvas>
    )
}

export default Canvas