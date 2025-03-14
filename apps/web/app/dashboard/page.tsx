import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { buttonVariants } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import Rooms from "@/components/dashboard/rooms";
import Header from "@/components/landing-page/header";

const Dashboard = async () => {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/auth/login");
    }
    return (
        <>
            <Header session={session}/>
            <div className="my-6">
                {/* {JSON.stringify(session)} */}
                <div className="flex flex-col justify-center items-center">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold my-2 text-center">Your Drawing Boards</h1>
                    <p className="text-gray-700 text-center">Create a new collaborative drawing room or join one of your existing rooms</p>
                    <div className={`${buttonVariants({ size: "lg" })} py-6 px-2 my-6 cursor-pointer`} ><CirclePlus /><p className="text-md">Create New Drawing Room</p></div>
                </div>
                <Rooms />
            </div>
        </>
    )
}

export default Dashboard