import { Circle, Line, Pencil, Rectangle, Shape, Text, tools } from "types/types";
import { DrawCanvas } from "./canvas-helper";
import { updateShapeCoordinates } from "./socket";
import { v4 as uuidv4 } from "uuid";


export const dragItem = (instance: DrawCanvas) => (ev: MouseEvent, selectedElement: Shape): Shape => {
    const canvas = instance.getCanvas();
    const socket = instance.getSocket();
    const roomId = instance.getRoomId();

    const timer = instance.getTimer();
    const setTimerFn = (timer: NodeJS.Timeout) => instance.setTimer(timer);
    const newId = uuidv4();
    const { x: panOffsetX, y: panOffsetY } = instance.getPanOffsets();

    if (selectedElement.shape === tools.Rect) {
        const rect = selectedElement as Rectangle;
        canvas.style.cursor = "move";
        rect.x = ev.clientX - (rect.initialX || 0);
        rect.y = ev.clientY - (rect.initialY || 0);
        updateShapeCoordinates(socket,
            rect.id,
            roomId,
            JSON.stringify({
                roomId,
                id: newId,
                type: "shape",
                shape: rect.shape,
                x: rect.x,
                y: rect.y,
                width: rect.width,
                height: rect.height
            }),
            timer,
            setTimerFn
        );
        instance.clearCanvas();
        return rect;
    }
    else if (selectedElement.shape === tools.Circle) {
        const circle = selectedElement as Circle;
        canvas.style.cursor = "move";
        circle.centerX = ev.clientX - (circle.initialX || 0);
        circle.centerY = ev.clientY - (circle.initialY || 0);
        console.log("dragging")
        updateShapeCoordinates(socket,
            circle.id,
            roomId,
            JSON.stringify({
                roomId,
                id: newId,
                type: "shape",
                shape: circle.shape,
                centerX: circle.centerX,
                centerY: circle.centerY,
                radiusX: circle.radiusX,
                radiusY: circle.radiusY,
            }),
            timer,
            setTimerFn
        );
        instance.clearCanvas();
        return circle;
    }

        else if (selectedElement.shape === tools.Line) {
            const line = selectedElement as Line;

            const deltaX = ev.clientX - (line.initialX || 0);
            const deltaY = ev.clientY - (line.initialY || 0);
            const width = line.endX - line.startX;
            const height = line.endY - line.startY;

            line.startX = deltaX;
            line.startY = deltaY;
            line.endX = line.startX + width;
            line.endY = line.startY + height;


            updateShapeCoordinates(socket,
                line.id,
                roomId,
                JSON.stringify({
                    roomId,
                    id: newId,
                    type: "shape",
                    shape: line.shape,
                    startX: line.startX,
                    startY: line.startY,
                    endX: line.endX,
                    endY: line.endY
                }),
                timer,
                setTimerFn
            );
            instance.clearCanvas();
            return line;
        }

    else if (selectedElement.shape === tools.Pencil) {
        const pencilPaths = selectedElement as Pencil;
        const deltaX = ev.clientX - (pencilPaths.initialX || 0);
        const deltaY = ev.clientY - (pencilPaths.initialY || 0);

        pencilPaths.path.forEach(p => {
            console.log(p);
            p.x += deltaX;
            p.y += deltaY;
        });
        updateShapeCoordinates(socket,
            pencilPaths.id,
            roomId,
            JSON.stringify({
                roomId,
                id: newId,
                type: "shape",
                shape: pencilPaths.shape,
                path: pencilPaths.path
            }),
            timer,
            setTimerFn
        );
        pencilPaths.initialX = ev.clientX;
        pencilPaths.initialY = ev.clientY;
        instance.clearCanvas();
        return pencilPaths;
    }
    else if (selectedElement.shape === tools.Text) {
        const textShape = selectedElement as Text;

        const deltaX = ev.clientX - (textShape.initialX || 0);
        const deltaY = ev.clientY - (textShape.initialY || 0);


        textShape.x = deltaX;
        textShape.y = deltaY;

        updateShapeCoordinates(socket, textShape.id, roomId, JSON.stringify({
            roomId,
            id: textShape.id,
            type: "shape",
            shape: tools.Text,
            x: deltaX,
            y: deltaY,
            text: textShape.text,
            fontFamily: textShape.fontFamily,
            fontSize: textShape.fontSize
        }),
            timer,
            setTimerFn
        );

    }


    return selectedElement;
} 