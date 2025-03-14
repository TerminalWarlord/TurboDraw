"use client";

import Link from "next/link"
import { Button } from "../ui/button"
import Image from "next/image"
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
    const [hash, setHash] = useState("");


    useEffect(() => {
        const updateHash = () => {
            setHash(window.location.hash.substring(1));
        };

        updateHash();
        window.addEventListener("hashchange", updateHash);

        const interval = setInterval(updateHash, 100);
        return () => {
            window.removeEventListener("hashchange", updateHash);
            clearInterval(interval);
        };
    }, []);


    function handleNavBarClick() {
        setIsMobileMenuOpen(prevState => !prevState);
    }

    return (
        <>
            <div className='hidden md:flex justify-between px-28 py-4 items-center backdrop-blur-xs bg-slate-200/20 md:visible'>
                <div>
                    <Link href={"/"} className="text-xl font-bold"><Image src={"/turbodraw-logo.png"} alt="TurboDraw Logo" width={250} height={40} className="w-auto h-auto max-w-[120px] max-h-[100px]" /></Link>
                </div>
                <div>
                    <ul className="flex space-x-2 text-md justify-end items-end font-medium">
                        <li><Link href={"/#features"} className={`hover:border-b-3 hover:pb-1 transition-all ease-in duration-200 hover:border-slate-600 ${hash === "features" ? "border-slate-600 pb-1 border-b-3" : ""}`}>Features</Link></li>
                        <li><Link href={"/#how-it-works"} className={`hover:border-b-3 hover:pb-1 transition-all ease-in duration-200 hover:border-slate-600 ${hash === "how-it-works" ? "border-slate-600 pb-1 border-b-3" : ""}`}>How it works</Link></li>
                    </ul>
                </div>
                <div className="flex space-x-2">
                    <Button variant={'outline'}>Sign in</Button>
                    <Button>Get Started</Button>
                </div>

            </div>
            {/* mobile navbar */}
            <div className="bg-slate-200/10 backdrop-blur-xs flex justify-between items-center relative md:hidden transition-all ease-in-out duration-300">

                <div className={`w-screen h-screen bg-slate-200 backdrop-blur-4xl absolute top-0 left-0 py-12 px-8 flex justify-start items-center flex-col space-y-4
        transition-all ease-in-out duration-300 transform ${isMobileMenuOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-5 pointer-events-none"}
    `}>
                    <ul className="flex flex-col text-md justify-center items-center font-medium space-y-4">
                        <li><Link href={"/#features"} className={`hover:border-b-3 hover:pb-1 transition-all ease-in duration-200 hover:border-slate-600 ${hash === "features" ? "border-slate-600 pb-1 border-b-3" : ""}`}>Features</Link></li>
                        <li><Link href={"/#how-it-works"} className={`hover:border-b-3 hover:pb-1 transition-all ease-in duration-200 hover:border-slate-600 ${hash === "how-it-works" ? "border-slate-600 pb-1 border-b-3" : ""}`}>How it works</Link></li>
                    </ul>
                    <div className="flex space-x-2">
                        <Button variant={'outline'}>Sign in</Button>
                        <Button>Get Started</Button>
                    </div>
                </div>

                <div className="pl-4 py-2">
                    <Link href={"/"} className="text-xl font-bold"><Image src={"/turbodraw-logo.png"} alt="TurboDraw Logo" width={250} height={40} className="w-auto h-auto max-w-[120px] max-h-[100px]" /></Link>
                </div>
                <div className="transition-all duration-200 ease-in relative pr-4 cursor-pointer" onClick={handleNavBarClick}>
                    {isMobileMenuOpen ? <div className="flex justify-center items-center">
                        <div className="w-4 h-0.5 bg-black rotate-45 absolute transition-all duration-300 ease-in-out"></div>
                        <div className="w-4 h-0.5 bg-black -rotate-45 transition-all duration-300 ease-in-out"></div>
                    </div> : <div className="flex flex-col space-y-1 justify-start items-start">
                        <div className="w-4 h-0.5 bg-black transition-all duration-300 ease-in-out"></div>
                        <div className="w-4 h-0.5 bg-black transition-all duration-300 ease-in-out"></div>
                        <div className="w-4 h-0.5 bg-black transition-all duration-300 ease-in-out"></div>
                    </div>}
                </div>

            </div>

        </>
    )
}

export default Header