import { Shape, tools } from "types/types";
import { DrawCanvas } from "../canvas-helper"
import { sendToSocket } from "../socket";
import { v4 as uuidv4 } from "uuid";

export const mouseUpHandler = (instance: DrawCanvas) => (ev: MouseEvent) => {
    instance.setClicked(false);
    const selectedTool = instance.getSelectedTool();
    const ctx = instance.getCtx();
    const startX = instance.getStartX();
    const startY = instance.getStartY();
    const roomId = instance.getRoomId();
    const socket = instance.getSocket();
    const pencilPaths = instance.getPencilPaths();
    const canvas = instance.getCanvas();

    const { x: transformedX, y: transformedY } = instance.transformMouseCoordinates(ev.clientX, ev.clientY);

    if (instance.getSelectedTool() === tools.Pencil) {
        ctx.beginPath();
    }

    const width = transformedX - startX;
    const height = transformedY - startY;
    const id = uuidv4();
    let obj: Shape | null = null;
    const shapeType = selectedTool.toString();
    console.log("creating " + shapeType);

    if (selectedTool === tools.Rect) {
        obj = {
            id,
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
            id,
            type: "shape",
            shape: instance.getSelectedTool(),
            centerX: startX,
            centerY: startY,
            radius
        }
    }
    else if (selectedTool === tools.Line) {
        obj = {
            id,
            type: "shape",
            shape: selectedTool,
            startX: startX,
            startY: startY,
            endX: transformedX,
            endY: transformedY
        }
    }
    else if (selectedTool === tools.Pencil) {
        obj = {
            id,
            type: "shape",
            shape: selectedTool,
            path: pencilPaths
        };
        instance.setPencilPaths([])
    }
    else if (selectedTool === tools.Selection) {
        canvas.style.cursor = "default";
    }
    else if (selectedTool === tools.Hand) {
        canvas.style.cursor = "default";
    }
    instance.setSelectedElement(null);
    if (!obj) {
        return;
    }
    const shapes = instance.getExistingShapes();
    shapes.push(obj);
    instance.setExisitingShapes(shapes);
    // 
    // socket.send(JSON.stringify({
    //     ...obj,
    //     roomId,
    //     shape: shapeType,
    // }));

    sendToSocket(socket, JSON.stringify({
        ...obj,
        roomId,
        shape: shapeType
    }))
    instance.clearCanvas();

};