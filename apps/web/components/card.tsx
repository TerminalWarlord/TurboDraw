import { ReactNode } from "react"

const Card = ({ icon, title, subtitle }: { icon: ReactNode, title: string, subtitle: string }) => {
    return (
        <div className="w-full bg-white rounded-lg flex flex-col justify-start items-start p-6 space-y-2" style={{
            boxShadow: "0 0 20px 8px rgba(0, 0, 0, 0.05)"
        }}>
            <div className="p-2 bg-blue-200 w-fit rounded-md text-blue-600" style={{
                boxShadow: "0 0px 10px 4px rgb(200,220,252)"
            }}>
                {icon}
            </div>
            <h6 className="text-base md:text-md lg:text-lg font-semibold">{title}</h6>
            <p className="text-slate-700 text-xs md:text-sm">{subtitle}</p>
        </div>
    )
}

export default Card