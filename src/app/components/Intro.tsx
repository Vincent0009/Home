import React from 'react'
import Image from 'next/image';

type Props = {}

const Intro = (props: Props) => {
    return (
        <div className="flex flex-col">
            <div className='mb-6'>
                <Image className="rounded-3xl" src="/Images/Selfie.jpg" alt="Logo" width={500} height={500} />
            </div>
            <div className='max-w-2xl'>
                <h3 className='text-justify font-serif text-3xl sm:text-4xl md:text-5xl pt-6 sm:pt-8 md:pt-10 pb-4 sm:pb-5 md:pb-7'>
                    I&apos;m Vincent Chan.
                </h3>
                <p className='text-justify text-xl sm:text-2xl md:text-3xl'>
                    A Master Student in the Field of Engineering.
                </p>
            </div>
        </div>
    )
}

export default Intro