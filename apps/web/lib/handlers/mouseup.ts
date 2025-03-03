import { Shape, tools } from "types/types";
import { DrawCanvas } from "../canvas-helper"

export const mouseUpHandler = (instance: DrawCanvas) => (ev: MouseEvent) => {
    instance.setClicked(false);
    const selectedTool = instance.getSelectedTool();
    const ctx = instance.getCtx();
    const startX = instance.getStartX();
    const startY = instance.getStartY();
    const roomId = instance.getRoomId();
    const socket = instance.getSocket();
    const pencilPaths = instance.getPencilPaths();

    if (instance.getSelectedTool() === tools.Pencil) {
        ctx.beginPath();
    }

    const width = ev.clientX - startX;
    const height = ev.clientY - startY;
    let obj: Shape | null = null;
    const shapeType = selectedTool.toString();
    console.log("creating " + shapeType);
    if (selectedTool === tools.Rect) {
        obj = {
            type: "shape",
            shape: selectedTool,
            x: startX,
            y: startY,
            width,
            height
        }
    }
    else if (instance.getSelectedTool() === tools.Circle) {
        const radius = Math.abs(Math.max(width, height) / 2);
        obj = {
            type: "shape",
            shape: instance.getSelectedTool(),
            centerX: startX,
            centerY: startY,
            radius
        }
    }
    else if (selectedTool === tools.Line) {
        obj = {
            type: "shape",
            shape: selectedTool,
            startX: startX,
            startY: startY,
            endX: ev.clientX,
            endY: ev.clientY
        }
    }
    else if (selectedTool === tools.Pencil) {
        obj = {
            type: "shape",
            shape: selectedTool,
            path: pencilPaths
        };
        instance.setPencilPaths([])
    }
    if (!obj) {
        return;
    }
    instance.setExisitingShapes(obj);
    socket.send(JSON.stringify({
        ...obj,
        roomId,
        shape: shapeType,
    }));
    instance.clearCanvas();
};