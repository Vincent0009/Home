import Image from "next/image";
import Intro from "./components/Intro";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
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

                    <div className="space-y-4">
                        <div className="bg-white rounded-full shadow-md p-4 flex items-center">
                            <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0 mr-4 overflow-hidden">
                                {/* Company logo would go here */}
                                <div className="w-full h-full bg-gray-50">
                                    <Image className="rounded-3xl" src="/Images/NTU ICON.png" alt="Logo" width={300} height={300} />
                                </div>
                            </div>
                            <div className="flex-grow w-3/5 mr-4">
                                <h3 className="text-lg font-semibold truncate">National Taiwan University</h3>
                                <p className="text-gray-600 font-medium">MEng, Computer Aided Engineering, Civil Engineering</p>
                            </div>
                            <div className="text-gray-500 text-sm w-1/4 text-right">
                                Sep 2023 - Present
                            </div>
                        </div>

                        <div className="bg-white rounded-full shadow-md p-4 flex items-center">
                            <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0 mr-4 overflow-hidden">
                                <div className="w-full h-full bg-gray-50">
                                    <Image className="rounded-3xl" src="/Images/NTU ICON.png" alt="Logo" width={300} height={300} />
                                </div>
                            </div>
                            <div className="flex-grow w-3/5 mr-4">
                                <h3 className="text-lg font-semibold truncate">National Taiwan University</h3>
                                <p className="text-gray-600 font-medium">BE, Civil Engineering</p>
                            </div>
                            <div className="text-gray-500 text-sm w-2/5 text-right">
                                Sep 2019 - Jun 2023
                            </div>
                        </div>
                    </div>
                </div>


            </div>
        </div>


    );
}
