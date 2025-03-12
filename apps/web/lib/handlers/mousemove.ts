import { Rectangle, tools } from "types/types";
import { DrawCanvas } from "../canvas-helper";
import { dragItem } from "../drag-item";
import { getSelectedElement } from "../get-selected-element";
import { resize } from "../resize";
import { eraseShape } from "../socket";


export const mouseMoveHandler = (instance: DrawCanvas) => (ev: MouseEvent) => {
    const clicked = instance.getClicked();
    const startX = instance.getStartX();
    const startY = instance.getStartY();
    const selectedTool = instance.getSelectedTool();
    const ctx = instance.getCtx();
    const socket = instance.getSocket();
    const roomId = instance.getRoomId();
    const { x: panOffsetX, y: panOffsetY } = instance.getPanOffsets();
    const scale = instance.getScale();
    const { x: transformedX, y: transformedY } = instance.transformMouseCoordinates(ev.clientX, ev.clientY);

    if (clicked) {
        if (selectedTool === tools.Hand) {
            console.log("grabbing")
            const canvas = instance.getCanvas();
            canvas.style.cursor = "grabbing";
            const { x: lastMouseX, y: lastMouseY } = instance.getLastMousePosition();

            const dx = ev.clientX - lastMouseX;
            const dy = ev.clientY - lastMouseY;
            instance.setPanOffsetX(panOffsetX + dx);
            instance.setPanOffsetY(panOffsetY + dy);
            instance.setLastMousePosition(ev.clientX, ev.clientY);
            instance.clearCanvas();
        }
        else {
            const width = transformedX - startX;
            const height = transformedY - startY;
            if (selectedTool !== tools.Pencil) {
                instance.clearCanvas();
            }
            ctx.save();
            ctx.translate(panOffsetX, panOffsetY);
            ctx.scale(scale, scale);

            ctx.strokeStyle = "rgb(255, 255, 255)";
            if (selectedTool === tools.Rect) {
                ctx.strokeRect(startX, startY, width, height);
            }
            else if (selectedTool === tools.Circle) {
                // const radius = Math.abs(Math.max(width, height) / 2);

                const radiusX = Math.abs(startX - transformedX) / 2;
                const radiusY = Math.abs(startY - transformedY) / 2;
                console.log({
                    radiusX,
                    radiusY,
                    transformedX,
                    transformedY,
                    ...ev,
                })
                ctx.beginPath();
                // ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
                ctx.ellipse(transformedX-radiusX, transformedY-radiusY, radiusX, radiusY, 0, 0, 2 * Math.PI);
                ctx.stroke();
            }
            else if (selectedTool === tools.Line) {
                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.lineTo(transformedX, transformedY);
                ctx.stroke();
            }
            else if (selectedTool === tools.Pencil) {
                if (!instance.getPencilPaths().length) {
                    ctx.moveTo(transformedX, transformedY);  // Ensure correct starting point
                }
                ctx.lineTo(transformedX, transformedY);
                ctx.stroke();
                const newPencilPaths = [...instance.getPencilPaths(), { x: transformedX, y: transformedY }];
                instance.setPencilPaths(newPencilPaths);
            }
            else if (selectedTool === tools.Selection) {
                const canvas = instance.getCanvas();
                canvas.style.cursor = "move";


                // TODO: ADD RESIZE LOGIC HERE
                // resize(instance)(transformedX, transformedY);


                const selectedElement = instance.getSelectedElement();
                if (!selectedElement) {
                    console.log("nothing selected");
                    return;
                }
                console.log("moving");

                const newShapes = instance.getExistingShapes().filter(shape => shape !== selectedElement);
                const updatedShape = dragItem(instance)({
                    ...ev,
                    clientX: transformedX,
                    clientY: transformedY
                }, selectedElement);
                if (updatedShape) {
                    console.log("moved", updatedShape);
                    newShapes.push(updatedShape);
                    instance.setExisitingShapes(newShapes);
                    instance.clearCanvas();
                }
            }
            else if (selectedTool === tools.Eraser) {
                getSelectedElement(instance)(transformedX, transformedY);
                const selectedElement = instance.getSelectedElement();
                if (!selectedElement) {
                    console.log("nothing selected");
                    return;
                }
                console.log("removing");
                eraseShape(socket, selectedElement.id, roomId);
                const newShapes = instance.getExistingShapes().filter(shape => shape !== selectedElement);
                instance.setExisitingShapes(newShapes)
                instance.clearCanvas();

            }

        }
        ctx.restore();

    }

    else {
        if (selectedTool === tools.Selection) {
            resize(instance)(transformedX, transformedY);
        }
    }
}