import { Rectangle, tools } from "types/types";
import { DrawCanvas } from "../canvas-helper";
import { dragItem } from "../drag-item";
import { getSelectedElement } from "../get-selected-element";
import { resize } from "../resize";


export const mouseMoveHandler = (instance: DrawCanvas) => (ev: MouseEvent) => {
    const clicked = instance.getClicked();
    const startX = instance.getStartX();
    const startY = instance.getStartY();
    const selectedTool = instance.getSelectedTool();
    const ctx = instance.getCtx();

    if (clicked) {
        const width = ev.clientX - startX;
        const height = ev.clientY - startY;
        if (selectedTool !== tools.Pencil) {
            instance.clearCanvas();
        }
        ctx.strokeStyle = "rgb(255, 255, 255)";
        if (selectedTool === tools.Rect) {
            ctx.strokeRect(startX, startY, width, height);
        }
        else if (selectedTool === tools.Circle) {
            const radius = Math.abs(Math.max(width, height) / 2);
            ctx.beginPath();
            ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
            ctx.stroke();
        }
        else if (selectedTool === tools.Line) {
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(startX + width, startY + height);
            ctx.stroke();
        }
        else if (selectedTool === tools.Pencil) {
            ctx.lineTo(ev.clientX, ev.clientY);
            ctx.stroke();
            const newPencilPaths = [...instance.getPencilPaths(), { x: ev.clientX, y: ev.clientY }];
            instance.setPencilPaths(newPencilPaths);
        }
        else if (selectedTool === tools.Selection) {
            const canvas = instance.getCanvas();
            canvas.style.cursor = "move";


            // TODO: ADD RESIZE LOGIC HERE
            resize(instance)(ev.clientX, ev.clientY);


            const selectedElement = instance.getSelectedElement();
            if (!selectedElement) {
                console.log("nothing selected");
                return;
            }
            console.log("moving");

            const newShapes = instance.getExistingShapes().filter(shape => shape !== selectedElement);
            const updatedShape = dragItem(instance)(ev, selectedElement);
            if (updatedShape) {
                console.log("moved", updatedShape);
                newShapes.push(updatedShape);
                instance.setExisitingShapes(newShapes);
                instance.clearCanvas();
            }
        }
        else if (selectedTool === tools.Eraser) {
            getSelectedElement(instance)(ev.clientX, ev.clientY);
            const selectedElement = instance.getSelectedElement();
            if (!selectedElement) {
                console.log("nothing selected");
                return;
            }
            console.log("removing");
            const newShapes = instance.getExistingShapes().filter(shape => shape !== selectedElement);
            instance.setExisitingShapes(newShapes)
            instance.clearCanvas();

        }


    }

    else {
        if (selectedTool === tools.Selection) {
            resize(instance)(ev.clientX, ev.clientY);
        }
    }
}