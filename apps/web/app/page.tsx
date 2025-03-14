import Features from "@/components/landing-page/features";
import Footer from "@/components/landing-page/footer";
import Header from "@/components/landing-page/header";
import Hero from "@/components/landing-page/hero";
import WindowMockup from "@/components/landing-page/window-mockup";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  return <div className="flex flex-col justify-center items-center">
    <div className="fixed w-full top-0 z-10">
      <Header session={session}/>
    </div>
    <Hero />
    <WindowMockup/>
    <Features />
    <Footer/>
  </div>
}