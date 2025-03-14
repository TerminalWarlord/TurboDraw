
const WindowMockup = () => {
    return (
        <div className="w-11/12 md:w-8/12 lg:w-7/12 min-h-88 bg-white rounded relative flex flex-col space-y-4 justify-center items-center my-6" style={{
            boxShadow: "0 4px 8px 2px rgba(0, 0, 0, 0.1)",
            transform: "scale(0.5)",
            animation: "popUp 1s ease-out forwards"
        }}>
            <div className="absolute flex space-x-1 top-0 left-0 h-8 bg-slate-100 w-full items-center">
                <div className="flex space-x-1 pl-4 ">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-300 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>


            </div>
            <div className="flex space-x-2">
                <div className="w-14 h-14 md:w-20 mdh-20 lg:w-26 lg:h-26 rounded-md border-2 border-blue-500 rotate-12"></div>
                <div className="w-14 h-14 md:w-20 md:h-20 lg:w-26 lg:h-26 rounded-full border-2 border-blue-300"></div>
            </div>
            <div className="w-44 h-0.5 md:w-56 lg:w-72 md:h-1 bg-amber-300 rotate-6"></div>
        </div>
    )
}

export default WindowMockup