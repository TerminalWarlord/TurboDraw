import { Circle, Rectangle, Shape, tools } from "types/types";
import { DrawCanvas } from "./canvas-helper";
import { distance } from "./get-selected-element";

const MARGIN_OF_ERROR = 5;


const isOnCorner = (shape: Shape, canvas: HTMLCanvasElement, x: number, y: number) => {
    if (shape.shape === tools.Rect) {
        const rect = shape as Rectangle;
        const topLeft = Math.abs(rect.x - x) < MARGIN_OF_ERROR && Math.abs(rect.y - y) < MARGIN_OF_ERROR;
        const bottomLeft = Math.abs(rect.x - x) < MARGIN_OF_ERROR && Math.abs((rect.y + rect.height) - y) < MARGIN_OF_ERROR;
        const topRight = Math.abs((rect.x + rect.width) - x) < MARGIN_OF_ERROR && Math.abs(rect.y - y) < MARGIN_OF_ERROR;
        const bottomRight = Math.abs((rect.x + rect.width) - x) < MARGIN_OF_ERROR && Math.abs((rect.y + rect.height) - y) < MARGIN_OF_ERROR;
        if (topLeft) {
            canvas.style.cursor = "nw-resize";
        }
        else if (bottomRight) {
            canvas.style.cursor = "se-resize";
        }
        else if (bottomLeft) {
            canvas.style.cursor = "sw-resize";
        }
        else if (topRight) {
            canvas.style.cursor = "ne-resize";
        }
        else {
            canvas.style.cursor = "default";
        }
    }

}

const isOnEdge = (instance: DrawCanvas) => (shape: Shape, canvas: HTMLCanvasElement, x: number, y: number) => {
    if (shape.shape === tools.Rect) {
        const rect = shape as Rectangle;

        // x1==X, y1<=Y<=y2
        const left = Math.abs(rect.x - x) < MARGIN_OF_ERROR &&
            y >= rect.y &&
            y <= rect.y + rect.height;

        // x2==X, y1<=Y<=y2
        const right = Math.abs((rect.x + rect.width) - x) < MARGIN_OF_ERROR &&
            y >= rect.y &&
            y <= rect.y + rect.height;

        // y1==Y, x1<=X<=x2
        const top = Math.abs(rect.y - y) < MARGIN_OF_ERROR &&
            x >= rect.x &&
            x <= rect.x + rect.width;

        // y2==Y, x1<=X<=x2
        const bottom = Math.abs((rect.y + rect.height) - y) < MARGIN_OF_ERROR &&
            x >= rect.x &&
            x <= rect.x + rect.width;



        if (left) {
            canvas.style.cursor = "w-resize";
            if(instance.getClicked()){
                const deltaX = rect.x - x;
                rect.x = x;
                rect.width += deltaX;
                const shapes = instance.getExistingShapes().filter(s => s !== shape);
                shapes.push(rect);
                instance.setExisitingShapes(shapes);
                instance.clearCanvas();
            }
        }
        else if (right) {
            canvas.style.cursor = "e-resize";
        }
        else if (top) {
            canvas.style.cursor = "n-resize";
        }
        else if (bottom) {
            canvas.style.cursor = "s-resize";
        }
        else {
            canvas.style.cursor = "default";
        }
    }
    else if (shape.shape === tools.Circle) {
        const circle = shape as Circle;
        const radius = circle.radius;
        const centerX = circle.centerX;
        const centerY = circle.centerY;
        const distanceFromCenter = distance(centerX, x, centerY, y);


        if (Math.abs(distanceFromCenter - radius) < MARGIN_OF_ERROR) {
            const angle = Math.atan2(y - centerY, x - centerX);
            const degrees = (angle * 180 / Math.PI + 360) % 360;

            console.log(`On edge! Angle: ${degrees}`);

            if (degrees >= 315 || degrees < 45) {
                canvas.style.cursor = "e-resize";
            } else if (degrees >= 45 && degrees < 135) {
                canvas.style.cursor = "s-resize";
            } else if (degrees >= 135 && degrees < 225) {
                canvas.style.cursor = "w-resize";
            } else {
                canvas.style.cursor = "n-resize";
            }
        }
    }

}

export const resize = (instance: DrawCanvas) => (x: number, y: number) => {
    const existingShapes = instance.getExistingShapes();
    const canvas = instance.getCanvas();
    existingShapes.forEach(shape => {
        isOnCorner(shape, canvas, x, y);
        isOnEdge(instance)(shape, canvas, x, y);
    });
}