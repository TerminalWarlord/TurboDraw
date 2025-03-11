import { type ServerWebSocket } from "bun";
import { prismaClient } from "db/db";
import { tools } from "types/types";

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
        async message(ws:ServerWebSocket, message) {
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
            else if (parsedData.type === "erase") {
                const { id, roomId } = parsedData;
                console.log("Erasing", id, roomId);
                try {
                    
                    
                    const user = users.find(u => u.roomId === parseInt(roomId));
                    if (!user) return;
                    
                    user.socket.forEach(soc => {
                        soc.send(JSON.stringify({ type: "erase", id }));
                    });


                    // TODO: add queue (SQS)
                    const deletedItem = await prismaClient.message.delete({
                        where: { id }
                    });

                    console.log("Deleted", deletedItem);
                } catch (error) {
                    console.log("Failed to erase", id);
                }
            }
            else if (parsedData.type === "shape") {
                console.log("adding", parsedData)
                const { id, roomId } = parsedData;
                const user = users.find(u => u.roomId === parseInt(roomId));
                if (!user) {
                    return;
                }
                user.socket.map(soc => {
                    soc.send(JSON.stringify(parsedData));
                })
                try{
                    // await prismaClient.message.create({
                    //     data: {
                    //         id,
                    //         content: JSON.stringify(parsedData),
                    //         chatId: parseInt(roomId),
                    //     }
                    // });
                    await prismaClient.message.upsert({
                        where: {id},
                        update: {},
                        create: {
                            id,
                            content: JSON.stringify(parsedData),
                            chatId: parseInt(roomId)
                        }
                    });
                }
                catch(err){
                    console.log("Failed to save shape")
                }

            }
        },
    }
})