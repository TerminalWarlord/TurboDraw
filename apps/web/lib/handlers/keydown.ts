import { tools } from "types/types";
import { DrawCanvas } from "../canvas-helper";

export const keyDownHandler = (instance: DrawCanvas) => (ev: KeyboardEvent) => {
    if (ev.key === "Enter") {
        console.log("enter")
    }
    else if (ev.key === "Escape") {
        console.log(ev.key)
        instance.clearEditMode();
    }
}