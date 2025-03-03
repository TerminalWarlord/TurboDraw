import { Shape, SelectedTool, tools, Rectangle, Circle, PencilPath, Line, Pencil } from "types/types";
import { getExisitingShapes } from "./http";



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
    private pencilPaths: { x: number, y: number }[] = [];
    constructor(canvas: HTMLCanvasElement, socket: WebSocket, roomId: number) {
        this.canvas = canvas;
        this.socket = socket;
        this.roomId = roomId;
        this.init();
        this.clearCanvas();
        this.handleSocket();
        this.mouseHandlers();
    };


    init = async () => {
        const ctx = this.canvas.getContext("2d");
        if (ctx) {
            this.ctx = ctx;
        }
        this.existingShapes = await getExisitingShapes(this.roomId);
        this.clearCanvas();
    }


    updateSelectedTool = (tool: tools) => {
        this.selectedTool = tool;
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
            console.log(typeof shape);
            if (shape.shape === tools.Rect) {
                ctx.strokeStyle = "rgb(255, 255, 255)";
                const rect = shape as Rectangle;
                // console.log("writing rect",shape);
                console.log(rect.x, rect.y, rect.width, rect.height);
                ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
            }
            else if (shape.shape === tools.Circle) {
                console.log("writing circle", shape);
                const circle = shape as Circle;
                // const radius = Math.abs(Math.max(shape.width, shape.height) / 2);
                this.ctx.beginPath();
                this.ctx.arc(circle.centerX, circle.centerY, circle.radius, 0, 2 * Math.PI);
                this.ctx.stroke();
            }
            else if (shape.shape === tools.Line) {
                console.log("writing line", shape);
                const line = shape as Line;
                this.ctx.beginPath();
                this.ctx.moveTo(line.startX, line.startY);
                this.ctx.lineTo(line.endX, line.endY);
                this.ctx.stroke();
            }
            else if (shape.shape === tools.Pencil) {
                console.log("writing Pencil", shape);
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

            if (parsedData.shape === 'rect') {
                this.existingShapes.push(parsedData);
                this.clearCanvas();
            }

        }
    }

    mouseHandlers = () => {
        this.canvas.addEventListener("mousedown", (ev) => {
            this.startX = ev.clientX;
            this.startY = ev.clientY;
            this.clicked = true;

            if (this.selectedTool === tools.Pencil) {
                this.ctx.beginPath();
                this.ctx.moveTo(this.startX, this.startY);
            }



        })
        this.canvas.addEventListener("mouseup", async (ev) => {
            this.clicked = false;

            if (this.selectedTool === tools.Pencil) {
                this.ctx.beginPath();
            }

            const width = ev.clientX - this.startX;
            const height = ev.clientY - this.startY;
            let obj: Shape | null = null;
            const shapeType = this.selectedTool.toString();
            console.log("creating " + shapeType);
            if (this.selectedTool === tools.Rect) {
                obj = {
                    type: "shape",
                    shape: this.selectedTool,
                    x: this.startX,
                    y: this.startY,
                    width,
                    height
                }
            }
            else if (this.selectedTool === tools.Circle) {
                const radius = Math.abs(Math.max(width, height) / 2);
                obj = {
                    type: "shape",
                    shape: this.selectedTool,
                    centerX: this.startX,
                    centerY: this.startY,
                    radius
                }
            }
            else if (this.selectedTool === tools.Line) {
                obj = {
                    type: "shape",
                    shape: this.selectedTool,
                    startX: this.startX,
                    startY: this.startY,
                    endX: ev.clientX,
                    endY: ev.clientY
                }
            }
            else if (this.selectedTool === tools.Pencil) {
                obj = {
                    type: "shape",
                    shape: this.selectedTool,
                    path: this.pencilPaths
                };
                this.pencilPaths = [];
            }
            if (!obj) {
                return;
            }
            this.existingShapes.push(obj);
            this.socket.send(JSON.stringify({
                ...obj,
                shape: shapeType,
                roomId: this.roomId
            }));
            this.clearCanvas();
        })
        this.canvas.addEventListener("mousemove", (ev) => {
            if (this.clicked) {
                const width = ev.clientX - this.startX;
                const height = ev.clientY - this.startY;
                if (this.selectedTool !== tools.Pencil) {
                    this.clearCanvas();
                }
                this.ctx.strokeStyle = "rgb(255, 255, 255)";
                if (this.selectedTool === tools.Rect) {
                    this.ctx.strokeRect(this.startX, this.startY, width, height);
                }
                else if (this.selectedTool === tools.Circle) {
                    const radius = Math.abs(Math.max(width, height) / 2);
                    this.ctx.beginPath();
                    this.ctx.arc(this.startX, this.startY, radius, 0, 2 * Math.PI);
                    this.ctx.stroke();
                }
                else if (this.selectedTool === tools.Line) {
                    const radius = Math.abs(Math.max(width, height) / 2);
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.startX, this.startY);
                    this.ctx.lineTo(this.startX + width, this.startY + height);
                    this.ctx.stroke();
                }
                else if (this.selectedTool === tools.Pencil) {
                    this.ctx.lineTo(ev.clientX, ev.clientY);
                    this.ctx.stroke();
                    this.pencilPaths.push({ x: ev.clientX, y: ev.clientY });
                }


            }
        })
    }



}
