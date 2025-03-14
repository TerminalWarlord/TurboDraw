
interface BasicShape {
    id: string;
    type: "shape";
    initialX?: number;
    initialY?: number;
}

export interface Circle extends BasicShape {
    shape: tools;
    centerX: number;
    centerY: number;
    radiusX: number;
    radiusY: number;
}

export interface Rectangle extends BasicShape {
    shape: tools;
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface Line extends BasicShape {
    shape: tools;
    startX: number;
    startY: number;
    endX: number;
    endY: number;
}
export interface Pencil extends BasicShape {
    shape: tools;
    path: { x: number, y: number }[];
};

export interface Text  extends BasicShape  {
    shape: tools;
    fontSize: number;
    fontFamily: string;
    text: string;
    x: number;
    y: number;
};




export type Shape = Circle | Rectangle | Line | Text | Pencil;

export enum tools {
    Rect = "rect",
    Circle = "circle",
    Pencil = "pencil",
    Line = "line",
    Text = "text",
    Image = "image",
    Selection = "selection",
    Eraser = "eraser",
    Hand = "hand"
}

export type SelectedTool = tools;


export interface PencilPath {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
}


export enum Providers{
    google = "google",
    credentials = "crendentials",
}