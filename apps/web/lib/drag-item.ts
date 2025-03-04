import { Circle, Line, Rectangle, Shape, tools } from "types/types";
import { DrawCanvas } from "./canvas-helper";
import { distance } from "./get-selected-element";

export const dragItem = (instance: DrawCanvas) => (ev: MouseEvent, selectedElement: Shape): Shape => {
    if (selectedElement.shape === tools.Rect) {
        const rect = selectedElement as Rectangle;
        rect.x = ev.clientX;
        rect.y = ev.clientY;
        return rect;
    }
    else if (selectedElement.shape === tools.Circle) {
        const circle = selectedElement as Circle;
        circle.centerX = ev.clientX;
        circle.centerY = ev.clientY;
        return circle;
    }

    else if (selectedElement.shape === tools.Line) {
        const line = selectedElement as Line;

        const deltaX = ev.clientX - line.startX;
        const deltaY = ev.clientY - line.startY;


        line.startX = ev.clientX;
        line.startY = ev.clientY;
        line.endX += deltaX;
        line.endY += deltaY;
        return line;
    }
    return selectedElement;
} 