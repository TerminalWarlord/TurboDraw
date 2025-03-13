import Link from "next/link"

const Footer = () => {
    return (
        <footer className="w-full flex justify-evenly my-4">
            <div>
               <span className="text-sm"> &copy; 2025 TurboDraw. All rights reserved.</span>
            </div>
            <div className="flex text-sm space-x-2">
                <Link href="privacy">Privacy Policy</Link>
                <Link href="terms-of-service">Terms of Service</Link>
                <Link href="cookie-policy">Cookie Policy</Link>
            </div>
        </footer>
    )
}

export default Footer