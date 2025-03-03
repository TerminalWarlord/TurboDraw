import { Shape, Circle, Rectangle, SelectedTool, tools } from "types/types";
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
    private ctx: CanvasRenderingContext2D;
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


    clearCanvas = () => {
        const ctx = this.canvas.getContext("2d");
        if (!ctx) {
            return;
        }
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.fillStyle = "rgb(0,0,0)";
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.existingShapes.map((shape: Shape) => {
            console.log(shape)
            if (shape.shape == "rect") {
                console.log(shape.x, shape.y, shape.width, shape.height);
                ctx.strokeStyle = "rgb(255, 255, 255)";
                ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
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



        })
        this.canvas.addEventListener("mouseup", async (ev) => {
            this.clicked = false;
            const width = ev.clientX - this.startX;
            const height = ev.clientY - this.startY;
            this.existingShapes.push({
                type: "shape",
                shape: "rect",
                x: this.startX,
                y: this.startY,
                width,
                height
            });

            this.socket.send(JSON.stringify({
                width,
                height,
                type: "shape",
                shape: "rect",
                x: this.startX,
                y: this.startY,
                roomId: this.roomId
            }));
            this.clearCanvas();
        })
        this.canvas.addEventListener("mousemove", (ev) => {
            if (this.clicked) {
                const width = ev.clientX - this.startX;
                const height = ev.clientY - this.startY;
                // ctx.clearRect(0, 0, canvas.width, canvas.height);
                // ctx.fillStyle = "rgb(0,0,0)";
                // ctx.fillRect(0, 0, canvas.width, canvas.height);
                this.clearCanvas();
                this.ctx.strokeStyle = "rgb(255, 255, 255)";
                this.ctx.strokeRect(this.startX, this.startY, width, height);


            }
        })
    }



}

// export async function drawCanvas(canvas: HTMLCanvasElement, socket: WebSocket, roomId: number) {
//     const ctx = canvas.getContext("2d");
//     let existingShapes: Shape[] = await getExisitingShapes(roomId);

//     if (!ctx) {
//         return;
//     }

//     clearCanvas(canvas, existingShapes, roomId)

//     socket.onmessage = (ev) => {
//         const parsedData = JSON.parse(ev.data);

//         if (parsedData.shape === 'rect') {
//             existingShapes.push(parsedData);
//             clearCanvas(canvas, existingShapes, roomId);
//         }

//     }

//     // ctx.fillStyle = "rgb(0,0,0)";
//     // ctx.fillRect(0, 0, canvas.width, canvas.height);


//     let clicked = false;
//     let startX: number, startY: number;

//     canvas.addEventListener("mousedown", (ev1) => {
//         startX = ev1.clientX;
//         startY = ev1.clientY;
//         clicked = true;



//     })
//     canvas.addEventListener("mouseup", async (ev) => {
//         clicked = false;
//         const width = ev.clientX - startX;
//         const height = ev.clientY - startY;
//         existingShapes.push({
//             type: "shape",
//             shape: "rect",
//             x: startX,
//             y: startY,
//             width,
//             height
//         });

//         socket.send(JSON.stringify({
//             type: "shape",
//             shape: "rect",
//             x: startX,
//             y: startY,
//             width,
//             height,
//             roomId
//         }));
//         clearCanvas(canvas, existingShapes, roomId);
//         // existingShapes.length = 0;
//         // const res: Shape[] = (await getExisitingShapes(roomId));
//         // // existingShapes.push(...res);
//         // existingShapes = res;
//     })
//     canvas.addEventListener("mousemove", (ev) => {
//         if (clicked) {
//             const width = ev.clientX - startX;
//             const height = ev.clientY - startY;
//             // ctx.clearRect(0, 0, canvas.width, canvas.height);
//             // ctx.fillStyle = "rgb(0,0,0)";
//             // ctx.fillRect(0, 0, canvas.width, canvas.height);
//             clearCanvas(canvas, existingShapes, roomId);
//             ctx.strokeStyle = "rgb(255, 255, 255)";
//             ctx.strokeRect(startX, startY, width, height);


//         }
//     })
// }


// async function clearCanvas(canvas: HTMLCanvasElement, existingShapes: Shape[], roomId: number) {
//     const ctx = canvas.getContext("2d");
//     if (!ctx) {
//         return;
//     }
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     ctx.fillStyle = "rgb(0,0,0)";
//     ctx.fillRect(0, 0, canvas.width, canvas.height);
//     existingShapes.map((shape: Shape) => {
//         // const parsedShape = JSON.parse(shape);
//         console.log(shape)
//         if (shape.shape == "rect") {
//             console.log(shape.x, shape.y, shape.width, shape.height);
//             ctx.strokeStyle = "rgb(255, 255, 255)";
//             ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
//         }
//     })
// }

