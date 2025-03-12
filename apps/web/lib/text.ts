import { Text, tools } from "types/types";
import { DrawCanvas } from "./canvas-helper";
import { v4 as uuidv4 } from "uuid";


export const createTextInput = (instance: DrawCanvas) => (x: number, y: number, initialText: string) => {
    const input = document.createElement("input");
    const ctx = instance.getCtx();
    input.type = "text";
    input.value = initialText;

    const scale = instance.getScale();

    const { x: transformedX, y: transformedY } = instance.transformMouseCoordinates(x, y);

    
    const updateWidth = () => {
        // Set temporary font to measure text accurately
        ctx.font = `${20}px Arial`; // Remove scale from the font measurement
        const textWidth = ctx.measureText(input.value || " ").width;
        // Add some padding but don't multiply by scale again here
        input.style.width = `${textWidth+10}px`;
    };

    // Initial width set
    updateWidth();


    Object.assign(input.style, {
        position: "absolute",
        left: `${x}px`,
        top: `${y}px`,
        font: `${20 * scale}px Arial`,
        background: "transparent",
        color: "white",
        border: "1px dashed white",
        outline: "none",
        padding: "5px"
    });


    input.select();

    input.addEventListener("keydown", (ev: KeyboardEvent) => {
        if (ev.key === "Enter") {
            inputToCanvas(instance)(transformedX, transformedY);
            console.log(instance.getExistingShapes());
        }
        else if (ev.key === "Escape") {
            instance.clearEditMode();
        }
    });


    input.addEventListener("input", updateWidth);

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

    const id = uuidv4();
    const newText: Text = {
        x,
        y,
        id,
        text,
        type: "shape",
        shape: tools.Text,
        fontFamily: "Arial",
        fontSize: 20,
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





export const clearInputs = (instance: DrawCanvas) => () => {
    const input = document.getElementsByTagName('input');
    if (input.length) {
        const position = input[0].getBoundingClientRect();
        const { x, y } = instance.transformMouseCoordinates(position.left, position.top);
        inputToCanvas(instance)(x, y);
    }
}