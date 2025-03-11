import { Text, tools } from "types/types";
import { DrawCanvas } from "./canvas-helper";
import { keyDownHandler } from "./handlers/keydown";
import { v4 as uuidv4 } from "uuid";


export const createTextInput = (instance: DrawCanvas) => (x: number, y: number, initialText: string) => {
    const input = document.createElement("input");
    input.type = "text";
    input.value = initialText;

    const canvas = instance.getCanvas();
    const scale = instance.getScale();
    const { x: panOffsetX, y: panOffsetY } = instance.getPanOffsets()

    const canvasRect = canvas.getBoundingClientRect();
    const scaledX = x * scale + panOffsetX + canvasRect.left;
    const scaledY = y * scale + panOffsetY + canvasRect.top;



    Object.assign(input.style, {
        position: "absolute",
        left: `${scaledX}px`,
        top: `${scaledY}px`,
        font: `${20 * scale}px Arial`,
        background: "transparent",
        color: "white",
        border: "1px dashed white",
        outline: "none",
        minWidth: "100px"
    });
    input.addEventListener("keydown", (ev: KeyboardEvent) => {
        if (ev.key === "Enter") {
            inputToCanvas(instance)(x, y);
            console.log(instance.getExistingShapes());
        }
        else if (ev.key === "Escape") {
            instance.clearEditMode();
        }
    });

    document.body.appendChild(input);
    input.focus();
    instance.setTextInput(input);
}



export const inputToCanvas = (instance: DrawCanvas) => (x: number, y: number) => {
    const textInput = instance.getTextInput()
    const socket = instance.getSocket();
    const roomId = instance.getRoomId();

    let text: string | undefined;
    if (textInput) {
        text = textInput.value;
        instance.clearEditMode();
    }

    if (!text) {
        return;
    }

    const { x: transformedX, y: transformedY } = instance.transformMouseCoordinates(x, y);
    const id = uuidv4();
    const newText: Text = {
        id,
        text,
        type: "shape",
        shape: tools.Text,
        fontFamily: "Arial",
        fontSize: 20,
        x: transformedX,
        y: transformedY
    };

    socket.send(JSON.stringify({
        ...newText,
        roomId
    }));
    const prevShapes = instance.getExistingShapes();
    prevShapes.push(newText);
    instance.setExisitingShapes(prevShapes);
    instance.clearCanvas();
}


