import { Circle, Image, Pencil, PencilIcon, RectangleHorizontal, Slash } from "lucide-react"
import IconButton from "./icon-button"
import { tools } from "types/types"

const Tools = ({ selectedTool, changeTool }: {
    selectedTool: tools,
    changeTool: (tool: tools) => void
}) => {

    return (
        <div className="fixed border-1 border-gray-800 rounded-md px-8 py-1 bg-gray-950 my-2 flex space-x-2">
            <IconButton
                icon={<Circle size={18} onClick={() => { changeTool(tools.Circle) }} />}
                selected={selectedTool === tools.Circle}
            />
            <IconButton
                icon={<RectangleHorizontal size={18} onClick={() => { changeTool(tools.Rect) }} />}
                selected={selectedTool === tools.Rect}
            />
            <IconButton
                icon={<PencilIcon size={18} onClick={() => { changeTool(tools.Pencil) }} />}
                selected={selectedTool === tools.Pencil}
            />
            <IconButton
                icon={<Slash size={18} onClick={() => { changeTool(tools.Line) }} />}
                selected={selectedTool === tools.Line}
            />
            <IconButton
                icon={<Image size={18} onClick={() => { changeTool(tools.Image) }} />}
                selected={selectedTool === tools.Image}
            />
        </div>
    )
}

export default Tools