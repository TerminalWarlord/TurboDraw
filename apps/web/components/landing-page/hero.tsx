import React from 'react'
import { Button } from '../ui/button'
import { Archive, ArrowRight, Server, UsersRound, Zap } from 'lucide-react'
import Link from 'next/link'

const SLIDEUP = {
    animation: 'slideUp 1s ease-out forwards',
    transform: 'translateY(4rem)',
    opacity: 0,
}

const SLIDELEFT = {
    animation: "slideLeft 1s ease-out forwards",
    transform: 'translateX(4rem)',
    opacity: 1
}

const Hero = () => {
    return (
        <section className='flex flex-col items-center mt-24' style={SLIDEUP} >
            <div>
                <div className='flex items-center space-x-1 outline rounded-2xl px-2 py-0.5 my-6'>
                    <span className='text-xs px-2 py-0.5 rounded-2xl text-blue-600 font-medium bg-blue-50'>NEW</span>
                    <p>Introducing real-time collaboration</p>
                </div>
            </div>
            <div className='w-11/12 md:w-8/12 lg:w-7/12 mt-6'>
                <h1 className='text-3xl md:text-5xl lg:text-7xl font-bold text-center'><span className='underline decoration-blue-200 decoration-4 underline-offset-8'>Collaborative</span> whiteboard for modern teams</h1>
            </div>
            <div className='w-10/12 md:w-7/12 lg:w-6/12 text-center text-md'>
                <h3>Create, share, and collaborate on digital whiteboards in real-time. TurboDraw connects your team's ideas with powerful drawing tools and instant synchronization.</h3>
            </div>
            <div className='my-4' style={SLIDELEFT}>
                <Link href={"/signin"} className='md:text-lg px-6 py-3 bg-black text-white flex justify-center items-center rounded-2xl'>
                    <span>Start Drawing</span>
                    <ArrowRight />
                </Link>
            </div>
            
        </section >
    )
}

export default Hero