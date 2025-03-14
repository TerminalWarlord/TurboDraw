
import { LoginForm } from "@/components/login-form"
import Image from "next/image"

export default async function LoginPage({ params }: { params: { mode: string } }) {
  const currentMode = (await params).mode;
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">

          <Image src={"/turbodraw-logo.png"} width={180} height={30} alt="TurboDraw Logo" />
        </a>
        <LoginForm mode={currentMode} />
      </div>
    </div>
  )
}
