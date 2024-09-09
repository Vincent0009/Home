import React from 'react'
import Image from 'next/image';

type Props = {}

const Intro = (props: Props) => {
    return (
        <div className="flex flex-col ">
            <div className='mb-6'>
                <Image className="rounded-3xl" src="/Images/Selfie.jpg" alt="Logo" width={300} height={300} />
            </div>
            <div className='max-w-2xl'>
                <h3 className='text-justify font-serif text-5xl pt-10 pb-7'>
                    I&apos;m Vincent Chan.
                </h3>
                <p className='text-justify text-3xl'>
                    A Master Student in the Field of Engineering.
                </p>
            </div>
        </div>
    )
}

export default Intro