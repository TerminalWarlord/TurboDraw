import { tools } from "types/types";
import { DrawCanvas } from "../canvas-helper";
import { getSelectedElement } from "../get-selected-element";


export const mouseDownHandler = (instance: DrawCanvas) => (ev: MouseEvent) => {
    instance.setStartX(ev.clientX);
    instance.setStartY(ev.clientY);
    instance.setClicked(true);
    const { offsetX, offsetY } = instance.getOffsets();
    const ctx = instance.getCtx();

    if (instance.getSelectedTool() === tools.Pencil) {
        ctx.beginPath();
        ctx.moveTo(instance.getStartX() + offsetX, instance.getStartY() + offsetY);
    }
    else if (instance.getSelectedTool() === tools.Selection) {
        console.log(ev.clientX, ev.clientY);
        getSelectedElement(instance)(ev.clientX, ev.clientY);
    }




}