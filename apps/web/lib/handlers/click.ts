import { Text, tools } from "types/types";
import { DrawCanvas } from "../canvas-helper";
import { createTextInput} from "../text";
import { getSelectedElement} from "../get-selected-element";

export const clickHandler = (instance: DrawCanvas) => (ev: MouseEvent) => {
    const selectedTool = instance.getSelectedTool();
    if (selectedTool !== tools.Text) {
        return;
    }
    const { x: transformedX, y: transformedY } = instance.transformMouseCoordinates(ev.clientX, ev.clientY);
    getSelectedElement(instance)(transformedX, transformedY);
    const shape = instance.getSelectedElement();
    console.log(shape)
    if (shape?.shape === tools.Text) {
        // User is trying to edit
        const filteredShapes = instance.getExistingShapes().filter(s => s != shape);
        instance.setExisitingShapes(filteredShapes);
        instance.clearCanvas();
        const textShape = shape as Text;
        createTextInput(instance)(ev.clientX, ev.clientY, textShape.text);
        instance.setSelectedElement(null);
    }
    else {
        createTextInput(instance)(ev.clientX, ev.clientY, "Click to edit");
    }
}