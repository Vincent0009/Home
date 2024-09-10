'use client';
import Image from "next/image";
import Intro from "./components/Intro";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
    const [isNarrow, setIsNarrow] = useState(false);

    useEffect(() => {
        const adjustLayout = () => {
            const container = document.getElementById('responsive-container');
            if (container) {
                setIsNarrow(container.offsetWidth < 400);
            }
        };

        // Initial check
        adjustLayout();

        // Add event listener
        window.addEventListener('resize', adjustLayout);

        // Cleanup
        return () => window.removeEventListener('resize', adjustLayout);
    }, []);

    

    return (
        <div className="flex flex-col items-center lg:flex-row lg:px-20 lg:items-stretch">

            <div className="w-full max-w-2xl px-10 pt-5
            lg:max-w-none lg:w-1/2 lg:px-20 lg:py-8">
                <Intro />
                <hr className="block my-8 border-t border-slate-400 lg:hidden " />
            </div>

            <div className="w-full max-w-2xl px-10 pt-0
            lg:max-w-none lg:w-1/2 lg:pr-20 lg:py-8">
                <div className="flex flex-col max-w-2xl">
                    <p className="text-left font-serif text-4xl custom-word-spacing lg:text-justify">
                        Passionate in Integrating AI into Real-Life Applications and Creating Comfortable Digital Experiences.
                    </p>

                    <Button className="mt-8 px-8 py-6 rounded-3xl text-base font-extralight max-w-40"><Link href="/projects">View Projects</Link></Button>

                    <hr className="my-8 border-t border-slate-400" />

                    <h3 className="text-left font-serif font-light text-3xl custom-word-spacing lg:text-justify pb-5">
                        Education
                    </h3>

                    <div id="responsive-container" className="space-y-4">
                        <div className={`responsive-item bg-white rounded-full shadow-md p-4 flex items-center ${isNarrow ? 'flex-col text-center' : 'flex-row text-left'}`}>
                            <div className={`responsive-item w-12 h-12 bg-gray-200 rounded-full flex-shrink-0 overflow-hidden ${isNarrow ? 'mb-2 mr-0': 'mb-0 mr-4'}`}>
                                <div className={`w-full h-full bg-gray-50`}>
                                    <Image className="rounded-3xl" src="/Images/NTU ICON.png" alt="Logo" width={300} height={300} />
                                </div>
                            </div>
                            <div className={`flex-grow ${isNarrow ? 'mb-2 mr-0 text-center' : 'w-3/5 mb-0 mr-4 text-left'}`}>
                                <h3 className={`font-semibold truncate ${isNarrow ? 'text-base': 'text-lg'}`}>National Taiwan University</h3>
                                <p className={`text-gray-600 font-medium ${isNarrow ? 'text-sm': 'text-base'}`}>MEng, Computer Aided Engineering, Civil Engineering</p>
                            </div>
                            <div className={`text-gray-500 text-sm ${isNarrow ? 'mb-2 mr-0 text-center' : 'w-2/5 text-right'} `}>
                                Sep 2023 - Present
                            </div>
                        </div>

                        <div className={`responsive-item bg-white rounded-full shadow-md p-4 flex items-center ${isNarrow ? 'flex-col text-center' : 'flex-row text-left'}`}>
                            <div className={`responsive-item w-12 h-12 bg-gray-200 rounded-full flex-shrink-0 overflow-hidden ${isNarrow ? 'mb-2 mr-0': 'mb-0 mr-4'}`}>
                                <div className={`w-full h-full bg-gray-50`}>
                                    <Image className="rounded-3xl" src="/Images/NTU ICON.png" alt="Logo" width={300} height={300} />
                                </div>
                            </div>
                            <div className={`flex-grow ${isNarrow ? 'mb-2 mr-0 text-center' : 'w-3/5 mb-0 mr-4 text-left'}`}>
                                <h3 className={`font-semibold truncate ${isNarrow ? 'text-base': 'text-lg'}`}>National Taiwan University</h3>
                                <p className={`text-gray-600 font-medium ${isNarrow ? 'text-sm': 'text-base'}`}>BE, Civil Engineering</p>
                            </div>
                            <div className={`text-gray-500 text-sm ${isNarrow ? 'mb-2 mr-0 text-center' : 'w-2/5 text-right'} `}>
                                Sep 2019 - Jun 2023
                            </div>
                        </div>
                    </div>
                </div>


            </div>
        </div>


    );
}
