"use client";

import { DrawCanvas } from "@/lib/canvas-helper";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { tools } from "types/types";
import Tools from "./tools";
import { ZoomIn, ZoomOut, ZoomOutIcon } from "lucide-react";


const Canvas = ({ roomId }: { roomId: number }) => {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [currentCanvas, setCurrentCanvas] = useState<DrawCanvas | null>(null);
    const [scale, setScale] = useState<number>(1);
    const [selectedTool, setSelectedTool] = useState<tools>(tools.Rect);
    const [windowSize, setWindowSize] = useState<{ height: number, width: number }>({ width: 0, height: 0 });

    console.log(scale.toFixed(2));
    useEffect(() => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }, []);




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


    // This is to handle wheel zoom in/out
    useEffect(() => {
        const handleScaleChange = (ev: CustomEvent) => {
            setScale(ev.detail.scale * 100 / 100);
        };

        document.addEventListener("onScaleChange", handleScaleChange as EventListener);

        return () => {
            document.removeEventListener("onScaleChange", handleScaleChange as EventListener);

        }
    }, [])

    const changeTool = (tool: tools) => {
        console.log(tool);
        setSelectedTool(tool);
        currentCanvas?.updateSelectedTool(tool);
    }
    const handleZoomOut = () => {
        currentCanvas?.zoomOut();
        setScale(currScale => {
            const newScale = currScale / 1.1;
            return Math.round(newScale * 100) / 100;
        });
    };

    const handleZoomIn = () => {
        currentCanvas?.zoomIn();
        setScale(currScale => {
            const newScale = currScale * 1.1;
            return Math.round(newScale * 100) / 100;
        });
    };
    return (
        <div className="relative flex justify-center">
            <canvas width={windowSize.width} height={windowSize.height} className=" bg-amber-50" ref={canvasRef}>
            </canvas>

            <Tools changeTool={changeTool} selectedTool={selectedTool} />
            {currentCanvas && <>
                <div className="fixed bottom-4 right-4 flex space-x-1 items-center justify-center">
                    <button onClick={handleZoomOut} className="p-4 aspect-square bg-cyan-200 rounded-full text-5xl text-black"><ZoomOut size={25} /> </button>
                    <p>{Math.round(scale * 100)}%</p>
                    <button onClick={handleZoomIn} className="p-4 aspect-square bg-cyan-200 rounded-full text-3xl text-black"><ZoomIn size={25} /></button>
                </div>
            </>}
        </div>
    )
}

export default Canvas