"use client";

import { DrawCanvas } from "@/lib/canvas-helper";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { tools } from "types/types";
import Tools from "./tools";
import { ZoomIn, ZoomOut, ZoomOutIcon } from "lucide-react";


const Canvas = ({ roomId }: { roomId: number }) => {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [currentCanvas, setCurrentCanvas] = useState<DrawCanvas | null>(null);
    const [scale, setScale] = useState(1);
    const [selectedTool, setSelectedTool] = useState<tools>(tools.Rect);
    const [windowSize, setWindowSize] = useState<{ height: number, width: number }>({ width: 0, height: 0 });

    console.log(scale);
    useEffect(() => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }, []);

    // useEffect(() => {
    //     const handleZoom = (event: WheelEvent) => {
    //         console.log(event);
    //         if (!event.ctrlKey && !event.metaKey) {
    //             return;
    //         }
    //         event.preventDefault();
    //         console.log("resizing");

    //         const scaleFactor = 0.001;

    //         if (event.deltaY < 0) {
    //             setScale(prevScale => Math.min(prevScale + scaleFactor, 2));
    //         } else {
    //             setScale(prevScale => Math.max(0.1, prevScale - scaleFactor));
    //         }
    //     };
    //     window.addEventListener("wheel", handleZoom, { passive: false });

    //     return () => {
    //         window.removeEventListener("wheel", handleZoom);
    //     }
    // }, [])



    const canvasRef = useRef<HTMLCanvasElement>(null);
    useLayoutEffect(() => {
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
    }, [roomId]);


    useEffect(() => {
        if (!canvasRef.current) {
            return;
        }
        if (!socket) {
            return;
        }
        const ctx = canvasRef.current.getContext("2d");

        if (!ctx) {
            return;
        }

        const scaledWidth = windowSize.width * scale;
        const scaledHeight = windowSize.height * scale;

        // Reset transformation before applying new scale
        ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transformations
        ctx.clearRect(0, 0, scaledWidth, scaledHeight); // Clear the canvas
        ctx.setTransform(scale, 0, 0, scale, 0, 0); // Apply new scale

        // drawCanvas(canvasRef.current, socket, roomId);
        const drawCanvas = new DrawCanvas(canvasRef.current, socket, roomId);
        drawCanvas.clearCanvas();
        setCurrentCanvas(drawCanvas);



        return () => {
            drawCanvas.destroy();
        }


    }, [socket, roomId]);


    useLayoutEffect(() => {
        if (!canvasRef.current) {
            return;
        }
        const ctx = canvasRef.current.getContext("2d");

        if (!ctx) {
            return;
        }


        // Reset transformation before applying new scale
        ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transformations
        // ctx.clearRect(0, 0, scaledWidth, scaledHeight); // Clear the canvas
        // ctx.setTransform(scale, 0, 0, scale, 0, 0); // Apply new scale
    }, [])

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
            <div className="fixed bottom-4 right-4 flex space-x-1 items-center justify-center">
                <button onClick={currentCanvas?.zoomOut} className="p-4 aspect-square bg-cyan-200 rounded-full text-5xl text-black"><ZoomOut size={25}/> </button>
                <button onClick={currentCanvas?.zoomIn} className="p-4 aspect-square bg-cyan-200 rounded-full text-3xl text-black"><ZoomIn size={25} /></button>
            </div>
        </div>
    )
}

export default Canvas