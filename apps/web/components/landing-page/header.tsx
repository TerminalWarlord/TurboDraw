import Link from "next/link"
import { Button } from "../ui/button"
import Image from "next/image"

const Header = () => {
    return (
        <div className='flex justify-between px-28 py-4 items-center backdrop:blur-2xl'>
            <div>
                <Link href={"/"} className="text-xl font-bold"><Image src={"/turbodraw-logo.png"} alt="TurboDraw Logo" width={250} height={40} className="w-auto h-auto max-w-[120px] max-h-[100px]"/></Link>
            </div>
            <div>
                <ul className="flex space-x-2 text-md justify-end items-end font-medium">
                    <li><Link href={"/features"} className="hover:border-b-3 hover:pb-1 transition-all ease-in duration-200 hover:border-slate-600">Features</Link></li>
                    <li><Link href={"/how-it-works"} className="hover:border-b-3 hover:pb-1 transition-all ease-in duration-200 hover:border-slate-600">How it works</Link></li>
                </ul>
            </div>
            <div className="flex space-x-2">
                <Button variant={'outline'}>Sign in</Button>
                <Button>Get Started</Button>
            </div>
            
        </div>
    )
}

export default Header