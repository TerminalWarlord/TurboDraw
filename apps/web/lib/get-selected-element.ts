import { Circle, Line, Rectangle, Shape, tools } from "types/types";
import { DrawCanvas } from "./canvas-helper";


export const distance = (x1: number, x2: number, y1: number, y2: number) => Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));


const isRect = (instance: DrawCanvas) => (shape: Shape, x: number, y: number): Shape | null => {
    const rect = shape as Rectangle;
    const minX = Math.min(rect.x, rect.x + rect.width);
    const maxX = Math.max(rect.x, rect.x + rect.width);
    const minY = Math.min(rect.y, rect.y + rect.height);
    const maxY = Math.max(rect.y, rect.y + rect.height);

    if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
        console.log("matched")
        rect.initialX = x-rect.x;
        rect.initialY = y-rect.y;
        instance.setSelectedElement(rect);
        console.log(rect);
        return rect;
    }

    return null;
}


const isCircle = (instance: DrawCanvas) => (shape: Shape, x: number, y: number): Shape | null => {
    const circle = shape as Circle;
    const centerX = circle.centerX;
    const centerY = circle.centerY;
    const radius = circle.radius;
    const distanceFromCenter = distance(centerX, x, centerY, y);
    console.log("sniffing circle", distanceFromCenter, radius);

    if (distanceFromCenter <= radius) {
        circle.initialX = x-circle.centerX;
        circle.initialY = y-circle.centerY;
        instance.setSelectedElement(circle);
        return circle;
    }


    return null;
}


const isLine = (instance: DrawCanvas) => (shape: Shape, x: number, y: number): Shape | null => {
    const line = shape as Line;
    // formule ab = ac+bc 
    const distanceOfAB = distance(line.startX, line.endX, line.startY, line.endY);
    const distanceOfAC = distance(line.startX, x, line.startY, y);
    const distanceOfBC = distance(line.endX, x, line.endY, y);
    if (Math.abs(distanceOfAB - distanceOfAC - distanceOfBC) < 1) {
        instance.setSelectedElement(shape);
        return line;
    }

    return null;
}



export const getSelectedElement = (instance: DrawCanvas) => (x: number, y: number): Shape | null => {
    const existingShapes = instance.getExistingShapes();
    existingShapes.forEach(shape => {

        if (shape.shape === tools.Rect) {
            const rect = isRect(instance)(shape, x, y);
            if (rect) {
                return rect;
            }
        }
        else if (shape.shape === tools.Circle) {
            const circle = isCircle(instance)(shape, x, y);
            if (circle) {
                return circle;
            }
        }
        else if (shape.shape === tools.Line) {
            const line = isLine(instance)(shape, x, y);
            if (line) {
                return line;
            }

        }

    })
    return null;
}