import Link from "next/link"
import { SLIDELEFT } from "../animations"

const Footer = () => {
    return (
        <footer className="w-full flex flex-col md:flex-row justify-center items-center md:justify-evenly mt-6 md:mt-12 mb-4" style={SLIDELEFT}>
            <div>
               <span className="text-sm"> &copy; 2025 TurboDraw. All rights reserved.</span>
            </div>
            <div className="flex flex-col md:flex-row text-sm space-x-2 justify-center items-center">
                <Link href="privacy">Privacy Policy</Link>
                <Link href="terms-of-service">Terms of Service</Link>
                <Link href="cookie-policy">Cookie Policy</Link>
            </div>
        </footer>
    )
}

export default Footer