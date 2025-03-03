import { type ServerWebSocket } from "bun";
import { prismaClient } from "db/db";

interface Users {
    roomId: number,
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
        async message(ws, message) {
            const parsedData = JSON.parse(message as unknown as string);
            console.log(parsedData);
            if (parsedData.type === "join") {
                const { roomId } = parsedData;
                console.log(roomId);
                console.log(typeof roomId);
                const user = users.find(u => u.roomId === parseInt(roomId));
                if (!user) {
                    users.push({
                        roomId: parseInt(roomId),
                        socket: [ws]
                    });
                }
                else {
                    user.socket.push(ws);
                }
                await prismaClient.chat.upsert({
                    where: { id: parseInt(roomId) },
                    update: {},
                    create: { id: parseInt(roomId) }
                });

            }
            else if (parsedData.type === "shape") {
                // console.log("adding", parsedData)
                const { roomId } = parsedData;
                const user = users.find(u => u.roomId === parseInt(roomId));
                if (!user) {
                    return;
                }
                user.socket.map(soc => {
                    soc.send(JSON.stringify(parsedData));
                })

                await prismaClient.message.create({
                    data: {
                        content: JSON.stringify(parsedData),
                        chatId: parseInt(roomId),
                    }
                })
            }
        },
    }
})