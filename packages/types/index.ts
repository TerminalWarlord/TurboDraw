


export interface Circle {
    type: "shape";
    shape: tools;
    centerX: number;
    centerY: number;
    radius: number;
}

export interface Rectangle {
    type: "shape";
    shape: tools;
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface Line {
    type: "shape",
    shape: tools;
    startX: number,
    startY: number,
    endX: number,
    endY: number,
}
export interface Pencil {
    shape: tools;
    path: { x: number, y: number }[]
};

export interface Text {
    type: "shape",
    shape: tools;
    font: string,
    x: number,
    y: number,
};




export type Shape = Circle | Rectangle | Line | Text | Pencil;

export enum tools {
    Rect = "rect",
    Circle = "circle",
    Pencil = "pencil",
    Line = "line",
    Text = "text",
    Image = "image"
}

export type SelectedTool = tools;


export interface PencilPath {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
}