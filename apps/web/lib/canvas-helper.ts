

interface Circle {
    type: "circle";
    centerX: number;
    centerY: number;
    radius: number;
}

interface Rectangle {
    type: "rect";
    x: number;
    y: number;
    width: number;
    height: number;
}




type Shape = Circle | Rectangle;


export async function drawCanvas(canvas: HTMLCanvasElement, socket: WebSocket, roomId: number) {
    const ctx = canvas.getContext("2d");
    const existingShapes: Shape[] = await getExisitingShapes(roomId);


    if (!ctx) {
        return;
    }

    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);


    let clicked = false;
    let startX: number, startY: number;

    canvas.addEventListener("mousedown", (ev1) => {
        startX = ev1.clientX;
        startY = ev1.clientY;
        clicked = true;



    })
    canvas.addEventListener("mouseup", (ev) => {
        clicked = false;
        const width = ev.clientX - startX;
        const height = ev.clientY - startY;
        existingShapes.push({
            type: "rect",
            x: startX,
            y: startY,
            width,
            height
        });

        socket.send(JSON.stringify({
            type: "shape",
            shape: "rect",
            x: startX,
            y: startY,
            width,
            height,
            roomId
        }));
    })
    canvas.addEventListener("mousemove", (ev) => {
        if (clicked) {
            const width = ev.clientX - startX;
            const height = ev.clientY - startY;

            clearCanvas(canvas, existingShapes);
            ctx.strokeRect(startX, startY, width, height);


        }
    })
}


function clearCanvas(canvas: HTMLCanvasElement, existingShapes: Shape[]) {
    const ctx = canvas.getContext("2d");
    if (!ctx) {
        return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "rgb(255, 255, 255)";
    existingShapes.map(shape => {
        if (shape.type == "rect") {
            ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
        }
    })
}


async function getExisitingShapes(roomId: number) {
    const res = await fetch("http://localhost:3001/canvas/" + roomId);

    if (!res.ok) {
        console.log(await res.json());
    }
    else {
        return await res.json();
    }
}