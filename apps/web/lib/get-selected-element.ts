import { Circle, Line, Pencil, Rectangle, Shape, Text, tools } from "types/types";
import { DrawCanvas } from "./canvas-helper";
import { MARGIN_OF_ERROR } from "./resize";


export const distance = (x1: number, x2: number, y1: number, y2: number) => Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));


const isRect = (instance: DrawCanvas) => (shape: Shape, x: number, y: number): Shape | null => {
    const rect = shape as Rectangle;
    const minX = Math.min(rect.x, rect.x + rect.width);
    const maxX = Math.max(rect.x, rect.x + rect.width);
    const minY = Math.min(rect.y, rect.y + rect.height);
    const maxY = Math.max(rect.y, rect.y + rect.height);

    if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
        console.log("matched")
        rect.initialX = x - rect.x;
        rect.initialY = y - rect.y;
        instance.setSelectedElement(rect);
        console.log(rect);
        return rect;
    }

    return null;
}


const isCircle = (instance: DrawCanvas) => (shape: Shape, x: number, y: number): Shape | null => {
    const circle = shape as Circle;
    const { centerX, centerY, radiusX, radiusY } = circle;
    const distanceFromCenter = distance(centerX, x, centerY, y);

    if (distanceFromCenter <= Math.max(radiusX, radiusY)) {
        console.log("sniffing circle", distanceFromCenter, radiusX, radiusY);
        circle.initialX = x - circle.centerX;
        circle.initialY = y - circle.centerY;
        instance.setSelectedElement(circle);
        return circle;
    }


    return null;
}


export const isText = (instance: DrawCanvas) => (shape: Shape, x: number, y: number): Shape | null => {
    const ctx = instance.getCtx();
    const textShape = shape as Text;
    const width = ctx.measureText(textShape.text).width;
    const height = textShape.fontSize;

    const { x: x1, y: y1 } = textShape;
    const x2 = x1 + width;
    const y2 = y1 + height;
    console.log({ x1, x2, y1, y2, x, y });


    if (x >= x1 - MARGIN_OF_ERROR * 5 && x <= x2 + MARGIN_OF_ERROR * 5 && y >= y1 - MARGIN_OF_ERROR * 5 && y <= y2 + MARGIN_OF_ERROR * 5) {
        instance.setSelectedElement(textShape);
        return textShape;
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
        shape.initialX = x - line.startX;
        shape.initialY = y - line.startY;
        instance.setSelectedElement(shape);
        return line;
    }

    return null;
}






const isPencil = (instance: DrawCanvas) => (shape: Shape, x: number, y: number): Shape | null => {
    const pencilPaths = shape as Pencil;
    const minX = Math.min(...pencilPaths.path.map(p => p.x));
    const maxX = Math.max(...pencilPaths.path.map(p => p.x));
    const minY = Math.min(...pencilPaths.path.map(p => p.y));
    const maxY = Math.max(...pencilPaths.path.map(p => p.y));
    // pencilPaths.path.forEach(p => {
    //     if (Math.abs(p.x - x) < 2 && Math.abs(p.y - y)) {
    // shape.initialX = x;
    // shape.initialY = y;
    // instance.setSelectedElement(shape);
    // return shape;
    //     }
    // })
    if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
        shape.initialX = x;
        shape.initialY = y;
        instance.setSelectedElement(shape);
        return shape;
    }

    return null;

}


export const getSelectedElement = (instance: DrawCanvas) => (x: number, y: number): Shape | null => {
    const existingShapes = instance.getExistingShapes();
    existingShapes.forEach(shape => {

        if (shape.shape === tools.Rect) {
            const rect = isRect(instance)(shape, x, y);
            return rect;
        }
        else if (shape.shape === tools.Circle) {
            const circle = isCircle(instance)(shape, x, y);
            return circle;
        }
        else if (shape.shape === tools.Line) {
            const line = isLine(instance)(shape, x, y);
            return line;
        }
        else if (shape.shape === tools.Pencil) {
            const pencilPath = isPencil(instance)(shape, x, y);
            return pencilPath;
        }
        else if (shape.shape === tools.Text) {
            const textShape = isText(instance)(shape, x, y);
            return textShape;
        }

    })
    return null;
}