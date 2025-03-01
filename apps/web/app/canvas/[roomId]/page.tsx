import Canvas from "@/components/canvas";



export const CanvasPage = async ({ params }: { params: { roomId: number } }) => {
    const roomId = (await params).roomId;
    return (
        <div className="h-screen w-screen bg-red-400">
            <Canvas roomId={roomId} />
        </div>
    )
}

export default CanvasPage