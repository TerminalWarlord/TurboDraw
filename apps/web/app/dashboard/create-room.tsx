"use client";

import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { CirclePlus, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react'
import { v4 as uuidv4 } from "uuid"

const CreateRoom = () => {
    const [modelOpen, setModelOpen] = useState(false);
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement | null>(null);


    function handleModal() {
        setModelOpen(prevState => !prevState);
    }

    async function handleRoomCreation() {
        if (!inputRef.current) {
            return;
        }
        const res = await fetch("http://localhost:3001/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ chatName: inputRef.current.value })
        });

        if (!res.ok) {
            console.log("failed!");
            return;
        }
        const resData = await res.json();
        router.push('/canvas/' + resData.roomId);
    }

    return (
        <>
            <Modal
                title='Create New Drawing Room'
                subtitle='Give your drawing room a name to help you identify it later.'
                children={<>
                    <div className='flex w-full justify-center items-center space-x-2'>
                        <label htmlFor="roomName" className='w-fit'>Room Name</label>
                        <Input type='text' placeholder='My Room' className='flex-1' ref={inputRef} />
                    </div>
                    <Button onClick={handleRoomCreation}><Plus />Create </Button>
                </>
                }
                isOpen={modelOpen}
                handleModal={handleModal}
            />
            <div
                className={`${buttonVariants({ size: "lg" })} py-6 px-2 my-6 cursor-pointer`}
                onClick={handleModal}
            >

                <CirclePlus /><p className="text-md">Create New Drawing Room</p>
            </div>
        </>
    )
}

export default CreateRoom