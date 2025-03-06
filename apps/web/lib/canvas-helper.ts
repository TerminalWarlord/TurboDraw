import { Shape, SelectedTool, tools, Rectangle, Circle, PencilPath, Line, Pencil } from "types/types";
import { getExisitingShapes } from "./http";
import { mouseUpHandler } from "./handlers/mouseup";
import { mouseDownHandler } from "./handlers/mousedown";
import { mouseMoveHandler } from "./handlers/mousemove";



export class DrawCanvas {
    private existingShapes: Shape[] = [];
    private canvas: HTMLCanvasElement;
    private roomId: number;
    private socket: WebSocket;
    private selectedTool: SelectedTool = tools.Rect;
    private clicked = false;
    private startX = 0;
    private startY = 0;
    private ctx!: CanvasRenderingContext2D;
    private offsetX: number = 0;
    private offsetY: number = 0;
    private pencilPaths: { x: number, y: number }[] = [];
    private selectedElement: Shape | null = null;
    private timer: NodeJS.Timeout | null = null;
    constructor(canvas: HTMLCanvasElement, socket: WebSocket, roomId: number) {
        this.canvas = canvas;
        this.socket = socket;
        this.roomId = roomId;
        this.timer = null;
        this.init();
        this.clearCanvas();
        this.handleSocket();
        this.mouseHandlers();
    };


    private init = async () => {
        const ctx = this.canvas.getContext("2d");
        if (ctx) {
            this.ctx = ctx;
        }
        this.existingShapes = await getExisitingShapes(this.roomId);
        this.clearCanvas();
    }
    getCanvas() {
        return this.canvas;
    }
    getClicked() {
        return this.clicked;
    }
    getSelectedTool() {
        return this.selectedTool;
    }
    getCtx() {
        return this.ctx;
    }
    getSocket() {
        return this.socket;
    }
    getStartX() {
        return this.startX;
    }
    getStartY() {
        return this.startY;
    }
    getRoomId() {
        return this.roomId;
    }
    getPencilPaths() {
        return this.pencilPaths;
    }
    getExistingShapes() {
        return this.existingShapes;
    }
    getOffsets() {
        return {
            offsetX: this.offsetX,
            offsetY: this.offsetY
        }
    }
    getTimer() {
        return this.timer;
    }


    getSelectedElement() {
        return this.selectedElement;
    }
    setOffsetX(offset: number) {
        this.offsetX = offset;
    }
    setOffsetY(offset: number) {
        this.offsetY = offset;
    }
    setStartX(x: number) {
        this.startX = x;
    }
    setStartY(y: number) {
        this.startY = y;
    }
    setClicked(state: boolean) {
        this.clicked = state;
    }

    setExisitingShapes(obj: Shape[]) {
        this.existingShapes = obj;
    }
    setPencilPaths(paths: { x: number, y: number }[]) {
        this.pencilPaths = paths;
    }
    setSelectedElement(shape: Shape) {
        this.selectedElement = shape;
    }
    setTimer(timer: NodeJS.Timeout) {
        this.timer = timer;
    }

    updateSelectedTool = (tool: tools) => {
        this.selectedTool = tool;
        this.selectedElement = null;
    }

    clearCanvas = () => {
        const ctx = this.canvas.getContext("2d");
        if (!ctx) {
            return;
        }
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.fillStyle = "rgb(0,0,0)";
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.existingShapes.map((shape: Shape) => {
            // console.log(typeof shape);
            if (shape.shape === tools.Rect) {
                ctx.strokeStyle = "rgb(255, 255, 255)";
                const rect = shape as Rectangle;
                // console.log("writing rect",shape);
                // console.log(rect.x, rect.y, rect.width, rect.height);
                ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
            }
            else if (shape.shape === tools.Circle) {
                // console.log("writing circle", shape);
                const circle = shape as Circle;
                // const radius = Math.abs(Math.max(shape.width, shape.height) / 2);
                this.ctx.beginPath();
                this.ctx.arc(circle.centerX, circle.centerY, circle.radius, 0, 2 * Math.PI);
                this.ctx.stroke();
            }
            else if (shape.shape === tools.Line) {
                // console.log("writing line", shape);
                const line = shape as Line;
                this.ctx.beginPath();
                this.ctx.moveTo(line.startX, line.startY);
                this.ctx.lineTo(line.endX, line.endY);
                this.ctx.stroke();
            }
            else if (shape.shape === tools.Pencil) {
                // console.log("writing Pencil", shape);
                const pencilPaths = shape as Pencil;
                if (!pencilPaths.path || pencilPaths.path.length < 1) {
                    return;
                }
                this.ctx.beginPath();
                this.ctx.moveTo(pencilPaths.path[0].x, pencilPaths.path[0].y);
                pencilPaths.path.map(p => {
                    return this.ctx.lineTo(p.x, p.y);
                })
                this.ctx.stroke();
            }
        })
    }


    handleSocket = () => {
        this.socket.onmessage = (ev) => {
            const parsedData = JSON.parse(ev.data);
            console.log(parsedData);

            if (parsedData.type === "erase") {
                const id: string = parsedData.id;
                console.log("ws response", id);
                const newListOfShapes = this.existingShapes.filter(s => s.id !== id);
                console.log(newListOfShapes.length, this.existingShapes.length);
                this.existingShapes = newListOfShapes;
                this.clearCanvas();
            }
            else if (parsedData.shape === 'rect') {
                this.existingShapes.push(parsedData);
                this.clearCanvas();
            }
            else if (parsedData.shape === 'circle') {
                console.log("received circle", this.existingShapes.length);
                this.existingShapes.push(parsedData);
                console.log(this.existingShapes.length);
                this.clearCanvas();
            }

        }
    }



    private mouseHandlers = () => {
        this.canvas.addEventListener("mousedown", mouseDownHandler(this));
        this.canvas.addEventListener("mouseup", mouseUpHandler(this));
        this.canvas.addEventListener("mousemove", mouseMoveHandler(this));
    }

    destroy = () => {
        this.canvas.removeEventListener("mousedown", mouseDownHandler(this));
        this.canvas.removeEventListener("mouseup", mouseUpHandler(this));
        this.canvas.removeEventListener("mousemove", mouseMoveHandler(this));
    }


}
