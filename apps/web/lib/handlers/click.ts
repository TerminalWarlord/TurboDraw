import { tools } from "types/types";
import { DrawCanvas } from "../canvas-helper";
import { createTextInput } from "../text";

export const clickHandler = (instance: DrawCanvas) => (ev: MouseEvent)=>{
    const selectedTool = instance.getSelectedTool();
    const ctx = instance.getCtx();
    if(selectedTool!==tools.Text){
        return;
    }

    createTextInput(instance)(ev.clientX, ev.clientY, "Hello World");
}