"use client";

import { DrawCanvas } from "@/lib/canvas-helper";
import { useEffect, useRef, useState } from "react";
import { tools } from "types/types";
import Tools from "./tools";


const Canvas = ({ roomId }: { roomId: number }) => {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [currentCanvas, setCurrentCanvas] = useState<DrawCanvas | null>(null);
    const [selectedTool, setSelectedTool] = useState<tools>(tools.Rect);
    const [windowSize, setWindowSize] = useState<{ height: number, width: number }>({ width: window.innerWidth, height: window.innerHeight });



    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const handleResize = () => {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        };

        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, [])


    useEffect(() => {
        const ws = new WebSocket("ws://localhost:8080");

        ws.onopen = (ev) => {
            setSocket(ws);

            ws.send(JSON.stringify({
                roomId,
                type: "join",
            }));
        }

        return () => ws.close();
    }, []);


    useEffect(() => {
        if (!canvasRef.current) {
            return;
        }
        if (!socket) {
            return;
        }
        // drawCanvas(canvasRef.current, socket, roomId);
        const drawCanvas = new DrawCanvas(canvasRef.current, socket, roomId);
        setCurrentCanvas(drawCanvas);


    }, [socket, roomId]);

    function changeTool(tool: tools) {
        console.log(tool);
        setSelectedTool(tool);
        currentCanvas?.updateSelectedTool(tool);
    }

    return (
        <div className="relative flex justify-center">
            <canvas width={windowSize.width} height={windowSize.height} className=" bg-amber-50" ref={canvasRef}>
            </canvas>

            <Tools changeTool={changeTool} selectedTool={selectedTool} />
        </div>
    )
}

export default Canvas