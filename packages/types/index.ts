


export interface Circle {
    type: "shape";
    shape: "circle";
    centerX: number;
    centerY: number;
    radius: number;
}

export interface Rectangle {
    type: "shape";
    shape: "rect";
    x: number;
    y: number;
    width: number;
    height: number;
}




export type Shape = Circle | Rectangle;

export enum tools {
    Rect,
    Circle,
    Pencil
}

export type SelectedTool = tools;