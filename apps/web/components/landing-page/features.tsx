import { Lock, PencilLine, Server, Square, UsersRound, Zap } from "lucide-react"
import Card from "../card"
import { SLIDEDOWN, SLIDELEFT, SLIDEUP } from "../animations"


const FEATURES = [
    {
        icon: <PencilLine />,
        title: "Precise Drawing Tools",
        subtitle: "Create detailed diagrams with our pencil tool that offers pressure sensitivity and smooth curves for natural drawing."
    },
    {
        icon: <Square />,
        title: "Shapes & Connectors",
        subtitle: "Quickly add rectangles, circles, and other shapes with perfect proportions. Connect ideas with smart lines that adapt as you move elements."
    },
    {
        icon: <UsersRound />,
        title: "Real-time Collaboration",
        subtitle: "See your teammates' cursors and changes instantly as they happen. Multiple users can work on the same board simultaneously."
    },
    {
        icon: <Zap />,
        title: "WebSocket Powered",
        subtitle: "Experience lightning-fast updates with our WebSocket technology that ensures changes sync with zero perceptible delay."
    },
    {
        icon: <Server />,
        title: "Backend Synchronization",
        subtitle: "All your work is automatically saved to our secure servers, allowing you to access your boards from any device."
    },
    {
        icon: <Lock />,
        title: "Enterprise Security",
        subtitle: "Keep your data secure with end-to-end encryption, single sign-on options, and compliance with industry standards."
    }

]



const Features = () => {
    return (
        <div className="w-full" id="features">
            <div className="flex items-center justify-center my-6 w-full" style={SLIDELEFT}>
                <div className="flex flex-col w-full px-4 md:flex-row justify-evenly space-y-4 md:px-0 md:space-x-4 md:w-7/12 items-center">
                    <div className="flex justify-center items-center space-x-1 w-full p-3 rounded-lg shadow">
                        <UsersRound className="p-2 w-8 h-8 rounded-full bg-blue-100 text-blue-500" />
                        <p className="">Real-time collaboration</p>
                    </div>
                    <div className="flex justify-center items-center space-x-1 w-full p-3 rounded-lg shadow">
                        <Zap className="p-2 w-8 h-8 rounded-full bg-blue-100 text-blue-500" />
                        <p className="">WebSocket powered</p>
                    </div>
                    <div className="flex justify-center items-center space-x-1 w-full p-3 rounded-lg shadow">
                        <Server className="p-2 w-8 h-8 rounded-full bg-blue-100 text-blue-500" />
                        <p className="">Backend synchronized</p>
                    </div>
                </div>
            </div>
            <div className=" my-6 flex items-center justify-center">
                <div className="w-11/12 md:w-8/12 lg:w-7/12">
                    <div className="flex justify-center my-2" style={SLIDELEFT}>
                        <span className="py-1 px-3 rounded-2xl bg-blue-100 text-sm text-blue-500 text-center">Powerful features</span>

                    </div>
                    <div className="flex flex-col items-center">
                        <h2 className="text-xl md:text-3xl lg:text-5xl font-bold text-center my-2" style={SLIDELEFT}>Everything you need for visual collaboration</h2>
                        <p className="w-10/12 md:w-7/12 lg:w-6/12  text-md text-center my-2" style={SLIDELEFT}>TurboDraw combines intuitive drawing tools with powerful collaboration features to transform how your team works together.</p>
                    </div>
                </div>
            </div>


            <div className="flex justify-center items-center my-6" style={SLIDELEFT}>
                <div className="w-11/12 md:w-9/12 lg:w-10/12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 my-6">
                    {FEATURES.map(ft => {
                        return <Card key={ft.title} {...ft} />
                    })}
                </div>
            </div>
        </div>
    )
}

export default Features