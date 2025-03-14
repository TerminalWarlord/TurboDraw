import { Shape, SelectedTool, tools, Rectangle, Circle, PencilPath, Line, Pencil, Text } from "types/types";
import { getExisitingShapes } from "./http";
import { mouseUpHandler } from "./handlers/mouseup";
import { mouseDownHandler } from "./handlers/mousedown";
import { mouseMoveHandler } from "./handlers/mousemove";
import { clickHandler } from "./handlers/click";
import { wheelHandler } from "./handlers/wheel";

// TODO: 
// 1. Add undo/redo
// 2. Add zoom in/out using wheel action
// 3. Add Text Shape    

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
    private scale: number = 1;
    private panOffsets: { x: number, y: number } = { x: 0, y: 0 };
    private lastMousePosition: { x: number, y: number } = { x: 0, y: 0 };
    private pencilPaths: { x: number, y: number }[] = [];
    private selectedElement: Shape | null = null;
    private timer: NodeJS.Timeout | null = null;
    private textInput: HTMLInputElement | null = null;
    private currentText: Text | null = null;
    private textEditMode: boolean = false;

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
    getPanOffsets() {
        return this.panOffsets
    }
    getTimer() {
        return this.timer;
    }
    getLastMousePosition() {
        return this.lastMousePosition;
    }

    getSelectedElement() {
        return this.selectedElement;
    }

    getScale() {
        return this.scale;
    }

    getTextInput() {
        return this.textInput;
    }
    getCurrentText() {
        return this.currentText;
    }

    setCurrentText(text: Text) {
        this.currentText = text;
    }

    setTextInput(text: HTMLInputElement) {
        this.textInput = text;
    }


    setPanOffsetX(offset: number) {
        this.panOffsets.x = offset;
    }
    setPanOffsetY(offset: number) {
        this.panOffsets.y = offset;
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
    setSelectedElement(shape: Shape | null) {
        this.selectedElement = shape;
    }
    setTimer(timer: NodeJS.Timeout) {
        this.timer = timer;
    }
    setLastMousePosition(x: number, y: number) {
        this.lastMousePosition = { x, y };
    }

    setScale(val: number) {
        this.scale = val;
    }

    updateSelectedTool = (tool: tools) => {
        this.selectedTool = tool;
        this.selectedElement = null;
    }


    zoomIn = () => {
        this.scale *= 1.1;
        this.clearCanvas();
    }
    zoomOut = () => {
        this.scale /= 1.1;
        this.clearCanvas();
    }

    transformMouseCoordinates(clientX: number, clientY: number) {
        const rect = this.canvas.getBoundingClientRect();
        const x = (clientX - rect.left - this.panOffsets.x) / this.scale;
        const y = (clientY - rect.top - this.panOffsets.y) / this.scale;
        return { x, y };
    }


    clearEditMode = () => {

        if (this.textInput && this.textInput.parentNode) {
            console.log("removing input")
            document.body.removeChild(this.textInput);
            this.textInput = null;
        }
        this.textEditMode = false;
        this.currentText = null;

    }

    clearCanvas = () => {
        const ctx = this.canvas.getContext("2d");
        if (!ctx) {
            return;
        }

        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.fillStyle = "rgb(0,0,0)";
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        ctx.translate(this.panOffsets.x, this.panOffsets.y);
        ctx.scale(this.scale, this.scale);

        this.existingShapes.map((shape: Shape) => {
            // console.log(typeof shape);
            ctx.strokeStyle = "rgb(255, 255, 255)";
            ctx.fillStyle = "rgb(255, 255, 255)";
            if (shape.shape === tools.Rect) {
                // ctx.strokeStyle = "rgb(255, 255, 255)";
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
                // this.ctx.arc(circle.centerX, circle.centerY, circle.radius, 0, 2 * Math.PI);
                this.ctx.ellipse(circle.centerX, circle.centerY, circle.radiusX, circle.radiusY, 0, 0, 2 * Math.PI);
                // this.ctx.ellipse(circle.centerX)
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

            else if (shape.shape === tools.Text) {
                const txt = shape as Text;
                ctx.font = `${txt.fontSize}px ${txt.fontFamily}`;
                ctx.fillText(txt.text, txt.x, txt.y);

            }
        });
        ctx.restore();
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
            else if (parsedData.shape) {
                this.existingShapes.push(parsedData);
                console.log(this.existingShapes.length);
                this.clearCanvas();
            }
            // else if (parsedData.shape === 'rect') {
            //     this.existingShapes.push(parsedData);
            //     this.clearCanvas();
            // }
            // else if (parsedData.shape === 'circle') {
            //     console.log("received circle", this.existingShapes.length);
            //     this.existingShapes.push(parsedData);
            //     console.log(this.existingShapes.length);
            //     this.clearCanvas();
            // }

        }
    }



    private mouseHandlers = () => {
        this.canvas.addEventListener("mousedown", mouseDownHandler(this));
        this.canvas.addEventListener("mouseup", mouseUpHandler(this));
        this.canvas.addEventListener("mousemove", mouseMoveHandler(this));
        this.canvas.addEventListener("click", clickHandler(this));
        this.canvas.addEventListener("wheel", wheelHandler(this));
    }

    destroy = () => {
        this.canvas.removeEventListener("mousedown", mouseDownHandler(this));
        this.canvas.removeEventListener("mouseup", mouseUpHandler(this));
        this.canvas.removeEventListener("mousemove", mouseMoveHandler(this));
        this.canvas.removeEventListener("click", clickHandler(this));
        this.canvas.removeEventListener("wheel", wheelHandler(this));
    }


}
