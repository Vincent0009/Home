import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const Footer = () => {
    return (
        <footer className="w-full px-16 py-8 mt-auto">
            <div className='border border-blue-950 border-solid  p-8 rounded-full bg-[#4d616c] text-slate-100'>
                <div className='flex flex-row items-center justify-between px-5'>
                    <div className='flex flex-col items-start px-4'>
                        <div className=''>
                            <h3 className='font-serif text-2xl'>I&apos;m Vincent Chan</h3>
                        </div>
                        <div className=''>
                            <p className=' text-lg'>A Master Student in the Field of Engineering.</p>
                            {/* <Button className="mt-2 px-8 py-6 rounded-3xl text-base font-extralight max-w-64">
                                <Link href="/about">Know More About Me</Link>
                            </Button> */}
                        </div>
                    </div>

                    <div className='flex items-center'>
                        <ul className="lg:flex lg:flex-row lg:ml-14 font-extralight text-lg">
                            <li className='lg:w-36 lg:text-center'><Link href="/about" className="duration-300 text-slate-50 hover:font-light hover:underline">About</Link></li>
                            <li className='lg:w-36 lg:text-center'><Link href="/projects" className="duration-300 text-slate-50 hover:font-light hover:underline">Projects</Link></li>
                            <li className='lg:w-36 lg:text-center'><Link href="/contact" className="duration-300 text-slate-50 hover:font-light hover:underline">Contact me</Link></li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer