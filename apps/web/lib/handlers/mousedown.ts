import { tools } from "types/types";
import { DrawCanvas } from "../canvas-helper";


export const mouseDownHandler = (instance: DrawCanvas) => (ev: MouseEvent) => {
    instance.setStartX(ev.clientX);
    instance.setStartY(ev.clientY);
    instance.setClicked(true);
    const ctx = instance.getCtx();

    if (instance.getSelectedTool() === tools.Pencil) {
        ctx.beginPath();
        ctx.moveTo(instance.getStartX(), instance.getStartY());
    }
    



}