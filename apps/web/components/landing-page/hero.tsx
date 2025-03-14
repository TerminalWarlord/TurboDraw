import React from 'react'
import { Button } from '../ui/button'
import { Archive, ArrowRight, Server, UsersRound, Zap } from 'lucide-react'
import Link from 'next/link'
import { SLIDEDOWN, SLIDEUP } from '../animations'




const Hero = () => {
    return (
        <section className='flex flex-col items-center mt-24'>
            <div>
                <div className='flex items-center space-x-1 outline rounded-2xl px-2 py-0.5 my-6' style={SLIDEDOWN}>
                    <span className='text-xs px-2 py-0.5 rounded-2xl text-blue-600 font-medium bg-blue-50'>NEW</span>
                    <p className='text-gray-600'>Introducing real-time collaboration</p>
                </div>
            </div>
            <div className='w-11/12 md:w-8/12 lg:w-7/12 mt-6 mb-4'  style={SLIDEUP} >
                <h1 className='text-3xl md:text-5xl lg:text-7xl font-bold text-center'><span className='underline decoration-blue-200 decoration-4 underline-offset-8'>Collaborative</span> whiteboard for modern teams</h1>
            </div>
            <div className='w-10/12 md:w-7/12 lg:w-6/12 text-center text-md my-4'  style={SLIDEUP} >
                <h3>Create, share, and collaborate on digital whiteboards in real-time. TurboDraw connects your team's ideas with powerful drawing tools and instant synchronization.</h3>
            </div>
            <div className='my-8' style={SLIDEDOWN}>
                <Link href={"/auth/signup"} className='md:text-lg px-6 py-3 bg-black text-white flex justify-center items-center rounded-2xl'>
                    <span>Start Drawing</span>
                    <ArrowRight />
                </Link>
            </div>
            
        </section >
    )
}

export default Hero