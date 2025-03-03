import Canvas from "@/components/canvas";



export const CanvasPage = async ({ params }: { params: { roomId: number } }) => {
    const roomId = (await params).roomId;
    return (
        <Canvas roomId={roomId} />
    )
}

export default CanvasPage