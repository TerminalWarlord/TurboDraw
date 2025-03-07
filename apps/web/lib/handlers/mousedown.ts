import { tools } from "types/types";
import { DrawCanvas } from "../canvas-helper";
import { getSelectedElement } from "../get-selected-element";


export const mouseDownHandler = (instance: DrawCanvas) => (ev: MouseEvent) => {
    const { x: transformedX, y: transformedY } = instance.transformMouseCoordinates(ev.clientX, ev.clientY);
    instance.setStartX(transformedX);
    instance.setStartY(transformedY);
    instance.setClicked(true);
    const ctx = instance.getCtx();

    if (instance.getSelectedTool() === tools.Pencil) {
        ctx.beginPath();
        ctx.moveTo(transformedX, transformedY);
    }
    else if (instance.getSelectedTool() === tools.Selection || instance.getSelectedTool() === tools.Eraser) {
        console.log(ev.clientX, ev.clientY);
        getSelectedElement(instance)(transformedX, transformedY);
        console.log(instance.getSelectedElement())
    }
    else if (instance.getSelectedTool() === tools.Hand) {
        instance.setLastMousePosition(transformedX, transformedY);
        const canvas = instance.getCanvas();
        canvas.style.cursor = "grabbing";
    }




}