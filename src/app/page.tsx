'use client';
import Image from "next/image";
import Intro from "./components/Intro";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
    const [isNarrow, setIsNarrow] = useState(false);
    const [isVeryNarrow, setIsVeryNarrow] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const adjustLayout = () => {
            const container = document.getElementById('responsive-container');
            if (container) {
                setIsNarrow(container.offsetWidth < 500);
                setIsVeryNarrow(container.offsetWidth < 350);
            }
        };

        // Initial check
        adjustLayout();
        
        // Trigger animations
        setIsVisible(true);

        // Add event listener
        window.addEventListener('resize', adjustLayout);

        // Cleanup
        return () => window.removeEventListener('resize', adjustLayout);
    }, []);

    return (
        <div className="relative overflow-hidden">
            {/* Background decorative elements - matching skills page */}
            <div className="absolute inset-0 overflow-hidden z-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-100/30 to-indigo-100/30 rounded-full opacity-40 animate-pulse delay-500"></div>
            </div>

            <div className={`flex flex-col items-center lg:flex-row px-5 lg:px-20 lg:items-stretch relative z-10 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>

                {/* Left Section - Intro */}
                <div className={`w-full max-w-2xl px-3 pt-5 lg:max-w-none lg:w-1/2 lg:px-20 lg:py-8 transition-all duration-1000 delay-200 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
                    <Intro />
                    <hr className="block my-8 border-t border-blue-200/50 lg:hidden transition-all duration-500" />
                </div>

                {/* Right Section - Main Content */}
                <div className={`w-full max-w-2xl px-3 pt-0 lg:max-w-none lg:w-1/2 lg:pr-20 lg:py-8 transition-all duration-1000 delay-400 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
                    <div className="flex flex-col max-w-2xl">
                        
                        {/* Main Headline with normal text (removed gradient) */}
                        <p className={`text-justify font-serif text-2xl sm:text-3xl md:text-4xl tracking-tighter lg:tracking-normal lg:text-justify text-gray-800 leading-tight transition-all duration-1000 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}>
                            Passionate in Integrating AI into Real-Life Applications and Creating Comfortable Digital Experiences.
                        </p>

                        {/* CTA Button with reduced hover effect - FIXED */}
                        <div className={`transition-all duration-1000 delay-800 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}>
                            <Link href="/skills" className="inline-block">
                                <Button className="mt-6 sm:mt-7 md:mt-8 px-6 sm:px-7 md:px-8 py-5 sm:py-5 md:py-6 rounded-3xl text-sm sm:text-base font-light max-w-40 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover:shadow-md hover:shadow-blue-200/30 transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] border border-blue-300/20">
                                    <span className="flex items-center gap-2">
                                        View Skills
                                        <svg className="w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </span>
                                </Button>
                            </Link>
                        </div>

                        <hr className={`my-6 sm:my-7 md:my-8 border-t border-blue-200/50 transition-all duration-1000 delay-1000 ${isVisible ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'}`} />

                        {/* Education Section Header */}
                        <div className={`transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}>
                            <div className="flex items-center gap-3 mb-4 sm:mb-5 md:mb-6">
                                <div className="w-1 h-6 sm:h-7 md:h-8 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></div>
                                <h3 className="text-left font-serif font-light text-xl sm:text-2xl md:text-3xl bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                                    Education
                                </h3>
                            </div>
                        </div>

                        {/* Education Cards */}
                        <div id="responsive-container" className="space-y-4 mb-8 w-full">
                            {/* NTU Card */}
                            <div className={`responsive-item bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 border border-blue-200/30 transition-all duration-1000 ${isNarrow ? 'flex flex-col' : 'flex flex-row items-center'} ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}>
                                
                                {/* Logo */}
                                <div className={`w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-gray-200 rounded-full flex-shrink-0 overflow-hidden ${isNarrow ? 'mx-auto mb-3' : 'mr-4'}`}>
                                    <div className="w-full h-full bg-gray-50">
                                        <Image className="rounded-full object-cover" src="/Images/NTU ICON.png" alt="NTU Logo" width={300} height={300} />
                                    </div>
                                </div>
                                
                                {/* School & Degree */}
                                <div className={`${isNarrow ? 'w-full text-center mb-3' : 'flex-1 min-w-0 mr-4'}`}>
                                    <h3 className={`font-semibold text-gray-800 text-sm sm:text-base md:text-lg ${isVeryNarrow ? '' : 'truncate'}`}>
                                        National Taiwan University
                                    </h3>
                                    <p className={`text-gray-600 font-medium text-xs sm:text-sm md:text-base break-words`}>
                                        {isVeryNarrow ? (
                                            <>
                                                MEng, Computer Aided<br />Engineering, Civil Engineering
                                            </>
                                        ) : (
                                            "MEng, Computer Aided Engineering, Civil Engineering"
                                        )}
                                    </p>
                                </div>
                                
                                {/* Year */}
                                <div className={`text-gray-500 text-xs sm:text-sm ${isNarrow ? 'w-full text-center' : 'text-right flex-shrink-0'}`}>
                                    <div className="font-semibold">2023 - 2025</div>
                                    <div className="text-xs">Expected</div>
                                </div>
                            </div>

                            {/* NTUST Card */}
                            <div className={`responsive-item bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 border border-blue-200/30 transition-all duration-1000 ${isNarrow ? 'flex flex-col' : 'flex flex-row items-center'} ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}>
                                
                                {/* Logo */}
                                <div className={`w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-gray-200 rounded-full flex-shrink-0 overflow-hidden ${isNarrow ? 'mx-auto mb-3' : 'mr-4'}`}>
                                    <div className="w-full h-full bg-gray-50">
                                        <Image className="rounded-full object-cover" src="/Images/NTU ICON.png" alt="NTUST Logo" width={300} height={300} />
                                    </div>
                                </div>
                                
                                {/* School & Degree */}
                                <div className={`${isNarrow ? 'w-full text-center mb-3' : 'flex-1 min-w-0 mr-4'}`}>
                                    <h3 className={`font-semibold text-gray-800 text-sm sm:text-base md:text-lg ${isVeryNarrow ? '' : 'truncate'}`}>
                                        National Taiwan University
                                    </h3>
                                    <p className={`text-gray-600 font-medium text-xs sm:text-sm md:text-base`}>
                                        BEng, Civil Engineering
                                    </p>
                                </div>
                                
                                {/* Year */}
                                <div className={`text-gray-500 text-xs sm:text-sm ${isNarrow ? 'w-full text-center' : 'text-right flex-shrink-0'}`}>
                                    <div className="font-semibold">2019 - 2023</div>
                                    <div className="text-xs">Graduated</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}