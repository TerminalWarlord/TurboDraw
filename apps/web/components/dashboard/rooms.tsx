import { Grid3x3 } from "lucide-react"
import RoomCard from "./room-card"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prismaClient } from "db/db"


const ROOMS = [
    {
        title: "Room 1",
        createdAt: Date.now().toString(),
        roomId: "abcd"
    },
    {
        title: "Room 2",
        createdAt: Date.now().toString(),
        roomId: "abcd"
    },
    {
        title: "Room 3",
        createdAt: Date.now().toString(),
        roomId: "abcd"
    },
    {
        title: "Room 4",
        createdAt: Date.now().toString(),
        roomId: "abcd"
    }
]

async function getUserRooms() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
        return;
    }
    const rooms = await prismaClient.chat.findMany({
        where: {
            userChats: {
                some: {
                    userId: parseInt(session.user.id)
                }
            }
        },
        select: {
            id: true,
            chatName: true,
            userChats: {
                select: {
                    user: {
                        select: {
                            id: true,
                            username: true,
                        }
                    }
                }
            },
            messages: {
                orderBy: { sentAt: "desc" },
                take: 1,
                select: {
                    content: true,
                    sentAt: true
                }
            }
        }
    })
}

const Rooms = async () => {
    const rooms = await getUserRooms();
    console.log(rooms)
    return (
        <div className="flex flex-col w-full">
            <div className="flex flex-col justify-center items-center w-full px-4  ">
                <div className="md:w-10/12 md:px-0 my-4">
                    <div className="flex items-center justify-start space-x-1"><Grid3x3 className="text-gray-500" size={20} /><h2 className="text-xl font-semibold">Your Rooms</h2></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center justify-center w-full px-4  md:w-10/12 md:px-0">
                    {ROOMS.map(room => {
                        return <RoomCard key={room.title} {...room} />
                    })}
                </div>
            </div>
        </div>
    )
}

export default Rooms