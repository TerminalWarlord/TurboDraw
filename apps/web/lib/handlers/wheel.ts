import { DrawCanvas } from "../canvas-helper";

export const wheelHandler = (instance: DrawCanvas) => (ev: WheelEvent) => {
    ev.preventDefault();

    const oldScale = instance.getScale();
    const oldOffsetX = instance.getPanOffsets().x;
    const oldOffsetY = instance.getPanOffsets().y;

    // Get the Actual coords without scaling
    const worldX = (ev.clientX - oldOffsetX) / oldScale;
    const worldY = (ev.clientY - oldOffsetY) / oldScale;

    const zoomFactor = 1.015; 

    if ((ev.metaKey || ev.ctrlKey) && ev.deltaY < 0) {
        instance.setScale(oldScale * zoomFactor);
    } else if ((ev.metaKey || ev.ctrlKey) && ev.deltaY > 0) {
        instance.setScale(oldScale / zoomFactor);
    } else {
        return;
    }

    const newScale = instance.getScale();

    const scaleEvent = new CustomEvent("onScaleChange", {
        detail: { scale: newScale }
    });

    // This is for the Canvas() component to render the scale change
    document.dispatchEvent(scaleEvent);


    // Adjusting the view based on new panOffset
    const newOffsetX = ev.clientX - worldX * newScale;
    const newOffsetY = ev.clientY - worldY * newScale;

    instance.setPanOffsetX(newOffsetX);
    instance.setPanOffsetY(newOffsetY);

    instance.clearCanvas();
}