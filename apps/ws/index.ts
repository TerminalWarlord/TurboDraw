import type { ServerWebSocket } from "bun";


interface Users {
    socket: ServerWebSocket<unknown>[]
}
const users: Users[] = [];


Bun.serve({
    port: 8080,
    fetch(request, server) {
        if (server.upgrade(request)) {
            return;
        }

        return new Response("Upgrade Failed", { status: 500 });
    },
    websocket: {
        message(ws, message) {
            const parsedData = JSON.parse(message as unknown as string);
            if (parsedData.type === "join") {
                const user = users.find(u=>u.socket.includes(ws));
                if(!user){
                    users.push({
                        socket: [ws]
                    });
                }
                else{
                    user.socket.push(ws);
                }
            }
            else if(parsedData.type==="draw"){
                
            }
            ws.send("hello");
        },
    }
})