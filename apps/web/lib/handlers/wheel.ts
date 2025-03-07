import { DrawCanvas } from "../canvas-helper";

export const handleWheel = (instance: DrawCanvas) => (ev: WheelEvent) => {
    ev.preventDefault();
    const mouseX = ev.clientX;
    const mouseY = ev.clientY;
    if(ev.deltaX){
    }
}