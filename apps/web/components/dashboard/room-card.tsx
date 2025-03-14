import { ArrowRight } from "lucide-react"
import { Button } from "../ui/button"

const RoomCard = ({ title, createdAt, roomId }: { title: string, createdAt: string, roomId: string }) => {
  return (
    <div className="w-full flex flex-col rounded-lg bg-slate-100/20 p-6" style={{
      boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)"
    }}>
      <h4 className="text-xl font-semibold">{title}</h4>
      <h6 className="my-1">Created at: {createdAt}</h6>
      <Button className="my-2">Join Room <ArrowRight /></Button>
    </div>
  )
}

export default RoomCard