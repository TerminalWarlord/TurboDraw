import React, { ReactNode } from 'react'
import { Circle } from "lucide-react"

const IconButton = ({ icon, selected }: { icon: ReactNode, selected: boolean }) => {
    return (
        <div className={`p-1 rounded text-white cursor-pointer  ${selected?'bg-gray-800 bg-opacity-50':''}`}>
            {icon}
        </div>
    )
}

export default IconButton