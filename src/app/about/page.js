'use client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

export default function About() {
  const [isNarrow, setIsNarrow] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const adjustLayout = () => {
      const container = document.getElementById('responsive-container');
      if (container) {
        setIsNarrow(container.offsetWidth < 400);
      }
    };

    // Initial check
    adjustLayout();

    // Trigger animations with a slight delay to ensure smooth loading
    setIsVisible(true);

    // Simulate loading like in skills page
    setTimeout(() => setIsLoading(false), 800);

    // Add event listener
    window.addEventListener('resize', adjustLayout);

    // Cleanup
    return () => window.removeEventListener('resize', adjustLayout);
  }, []);

  return (
    <div className="relative overflow-hidden">

      {/* Hero Section - Minimalist Version */}
      <div className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-20 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-light mb-6 bg-gradient-to-r from-gray-800 to-blue-700 bg-clip-text text-transparent">
            About <span className="font-bold">Me</span>
          </h1>
          <p className={`text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            Engineering Excellence with a Passion for Innovation
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className={`flex flex-col space-y-16 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {/* Row 1 - Who am I? */}
          <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}>
            <div className="flex flex-col lg:flex-row lg:items-start">
              {/* Col 1 - Title */}
              <div className="w-full lg:w-1/4 px-4 lg:px-8 mb-6 lg:mb-0">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></div>
                  <h3 className="text-left font-light text-3xl bg-gradient-to-r from-gray-800 to-blue-700 bg-clip-text text-transparent">
                    Who am I?
                  </h3>
                </div>
              </div>

              {/* Col 2 - Content */}
              <div className="w-full lg:w-3/4 px-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100/50 hover:shadow-2xl transition-all duration-300">
                  <p className="text-justify lg:text-justify text-lg text-gray-700 leading-relaxed">
                    Hi, I&apos;m Vincent, a graduate student at National Taiwan University specializing in Computer Aided Engineering with a primary focus on
                    <span className='font-bold'> AI and Deep Learning</span> for acoustic metamaterials design. My research has led to a published paper demonstrating how
                    <span className='font-bold'> neural networks</span> can revolutionize metamaterial engineering. Through this work, I&apos;ve developed expertise in
                    <span className='font-bold'> model performance evaluation, data visualization, and advanced analytics</span>, enabling me to extract meaningful insights from complex datasets.

                    My strong foundation in <span className='font-bold'>Data Science</span> complements my engineering background, allowing me to approach problems from both analytical and computational perspectives. I&apos;m skilled in developing
                    <span className='font-bold'> predictive models</span> and implementing
                    <span className='font-bold'> statistical analysis techniques</span> to drive data-informed decisions.

                    Beyond my academic focus, I&apos;m passionate about
                    <span className='font-bold'> Web Development and Web3 technologies</span>. I&apos;ve built this website using
                    <span className='font-bold'> Node.js</span> and am currently exploring
                    <span className='font-bold'> Smart contract programming with Solidity</span>. My goal is to bridge cutting-edge AI research with practical digital solutions, always eager to innovate at the intersection of emerging technologies.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className='px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium'>#Deep Learning</span>
                    <span className='px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium'>#AI</span>
                    <span className='px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium'>#Data Science</span>
                    <span className='px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-sm font-medium'>#Pytorch</span>
                    <span className='px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-sm font-medium'>#Data Visualization</span>
                    <span className='px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-sm font-medium'>#Web Development</span>
                    <span className='px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-sm font-medium'>#Node.js</span>
                    <span className='px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-sm font-medium'>#Solidity</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Row 2 - Projects */}
          <div className={`transition-all duration-1000 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}>
            <div className="flex flex-col lg:flex-row lg:items-start">
              {/* Col 1 - Title */}
              <div className="w-full lg:w-1/4 px-4 lg:px-8 mb-6 lg:mb-0">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></div>
                  <h3 className="text-left font-light text-3xl bg-gradient-to-r from-gray-800 to-blue-700 bg-clip-text text-transparent">
                    Projects
                  </h3>
                </div>
              </div>

              {/* Col 2 - Content */}
              <div className="w-full lg:w-3/4 px-4">
                <div id="responsive-container" className="space-y-6">
                  {/* Project 1 */}
                  <div className={`bg-white rounded-2xl shadow-xl p-6 border border-blue-100/50 hover:shadow-2xl transition-all duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="w-16 h-16 bg-blue-50 rounded-full flex-shrink-0 overflow-hidden flex items-center justify-center">
                        <Image
                          className="object-contain"
                          src="/Images/GENAISTARS.png"
                          alt="GenAI Stars Logo"
                          width={300}
                          height={300}
                          style={{ maxWidth: '70%', maxHeight: '70%' }}
                        />
                      </div>
                      <div className="flex-grow">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                          <h3 className="text-xl font-semibold text-gray-800">2024 GenAI Stars Hackathon</h3>
                          <span className="text-gray-500 text-sm mt-1 md:mt-0">Feb 2024 - Jul 2024</span>
                        </div>
                        <p className="text-blue-600 font-medium mb-3">
                          <a href="/api/pdf/6825bfc15580c5bd28042512" target="_blank" className="flex items-center gap-1 hover:underline">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                              <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                            </svg>
                            View Certificate
                          </a>
                        </p>
                        <ul className='list-disc list-inside text-gray-600 space-y-2'>
                          <li>Audio Processing Pipeline: Implemented OpenAI&apos;s Whisper model to generate time-stamped transcriptions, then applied semantic filtering via OpenAI API to remove non-competitive segments.</li>
                          <li>Signal Analysis: Engineered a frequency-domain processing system using Fourier transforms and Butterworth filters to isolate commentator and crowd reactions.</li>
                          <li>Highlight Detection Algorithm: Created a frequency-domain peak detection system to identify potential highlight moments based on audience and commentator audio patterns.</li>
                          <li>Content Analysis: Utilized OpenAI&apos;s vision capabilities to generate contextual descriptions of highlight frames.</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Project 2 */}
                  <div className={`bg-white rounded-2xl shadow-xl p-6 border border-blue-100/50 hover:shadow-2xl transition-all duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="w-16 h-16 bg-blue-50 rounded-full flex-shrink-0 overflow-hidden flex items-center justify-center">
                        <Image
                          className="object-contain"
                          src="/Images/NTU ICON.png"
                          alt="NTU Logo"
                          width={300}
                          height={300}
                          style={{ maxWidth: '70%', maxHeight: '70%' }}
                        />
                      </div>
                      <div className="flex-grow">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                          <h3 className="text-xl font-semibold text-gray-800">Eyes on the Water (CAE Seminar - Hackathon)</h3>
                          <span className="text-gray-500 text-sm mt-1 md:mt-0">Feb 2023 - Jul 2023</span>
                        </div>
                        <p className="text-blue-600 font-medium mb-3">University Course Hackathon</p>
                        <ul className='list-disc list-inside text-gray-600 space-y-2'>
                          <li>Computer Vision Integration: Engineered the core vision analysis component by implementing and optimizing OpenAI&apos;s image recognition API.</li>
                          <li>Prompt Engineering: Designed specialized prompts for the vision model to accurately distinguish between natural elements and pollution/debris.</li>
                          <li>Highlight Detection Algorithm: Created a time-domain peak detection system to identify potential highlight moments.</li>
                          <li>Structured Output System: Developed a standardized response framework for environmental monitoring databases.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Row 3 - Experience */}
          <div className={`transition-all duration-1000 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}>
            <div className="flex flex-col lg:flex-row lg:items-start">
              {/* Col 1 - Title */}
              <div className="w-full lg:w-1/4 px-4 lg:px-8 mb-6 lg:mb-0">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></div>
                  <h3 className="text-left font-light text-3xl bg-gradient-to-r from-gray-800 to-blue-700 bg-clip-text text-transparent">
                    Experience
                  </h3>
                </div>
              </div>

              {/* Col 2 - Content */}
              <div className="w-full lg:w-3/4 px-4">
                <div id="responsive-container" className="space-y-6">
                  {/* Experience 1 */}
                  <div className={`bg-white rounded-2xl shadow-xl p-6 border border-blue-100/50 hover:shadow-2xl transition-all duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="w-16 h-16 bg-blue-50 rounded-full flex-shrink-0 overflow-hidden flex items-center justify-center">
                        <Image
                          className="object-contain"
                          src="/Images/NTU ICON.png"
                          alt="NTU Logo"
                          width={300}
                          height={300}
                          style={{ maxWidth: '70%', maxHeight: '70%' }}
                        />
                      </div>
                      <div className="flex-grow">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                          <h3 className="text-xl font-semibold text-gray-800">Computer Technician</h3>
                          <span className="text-gray-500 text-sm mt-1 md:mt-0">Sep 2020 - Present</span>
                        </div>
                        <p className="text-gray-600 font-medium mb-3">Computer and Information Networking Center(NTU) · Part-time</p>
                        <ul className='list-disc list-inside text-gray-600 space-y-2'>
                          <li>Assisted in web development, enhancing both front-end user interfaces and back-end functionalities.</li>
                          <li>Provided critical technical support for remote educational classes and activities.</li>
                          <li>Conducted comprehensive hardware maintenance, optimizing computing resources.</li>
                          <li>Edited engaging video content for academic and promotional purposes.</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Experience 2 */}
                  <div className={`bg-white rounded-2xl shadow-xl p-6 border border-blue-100/50 hover:shadow-2xl transition-all duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="w-16 h-16 bg-blue-50 rounded-full flex-shrink-0 overflow-hidden flex items-center justify-center">
                        <Image
                          className="object-contain"
                          src="/Images/REIJU.png"
                          alt="REIJU Logo"
                          width={300}
                          height={300}
                          style={{ maxWidth: '60%', maxHeight: '60%' }}
                        />
                      </div>
                      <div className="flex-grow">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                          <h3 className="text-xl font-semibold text-gray-800">Civil Engineering Intern</h3>
                          <span className="text-gray-500 text-sm mt-1 md:mt-0">Jul 2022 - Aug 2022</span>
                        </div>
                        <p className="text-gray-600 font-medium mb-3">REIJU Construction Co., Ltd. · Internship</p>
                        <ul className='list-disc list-inside text-gray-600 space-y-2'>
                          <li>Contributed to the preparation of engineering documents, including clarifications, drawings, and contract pricing.</li>
                          <li>Employed AutoCAD to update and refine construction plans, enhancing project clarity.</li>
                          <li>Performed meticulous on-site inspections of structural elements such as rebar and waterproofing materials.</li>
                          <li>Verified the mechanical properties of construction materials, such as rebar tensile strength and bending resistance.</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Experience 3 */}
                  <div className={`bg-white rounded-2xl shadow-xl p-6 border border-blue-100/50 hover:shadow-2xl transition-all duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="w-16 h-16 bg-blue-50 rounded-full flex-shrink-0 overflow-hidden flex items-center justify-center">
                        <Image
                          className="object-contain"
                          src="/Images/NTU ICON.png"
                          alt="NTU Logo"
                          width={300}
                          height={300}
                          style={{ maxWidth: '70%', maxHeight: '70%' }}
                        />
                      </div>
                      <div className="flex-grow">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                          <h3 className="text-xl font-semibold text-gray-800">Teaching Assistant</h3>
                          <span className="text-gray-500 text-sm mt-1 md:mt-0">Feb 2022 - Jun 2022</span>
                        </div>
                        <p className="text-gray-600 font-medium mb-3">National Taiwan University · Part-time</p>
                        <ul className='list-disc list-inside text-gray-600 space-y-2'>
                          <li>Decided the grading scheme for model assignments and evaluations.</li>
                          <li>Conducted comprehensive model testing to ensure accuracy and functionality.</li>
                          <li>Assisted with preparation before class, including setting up equipment and organizing materials.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Row 4 - Education */}
          <div className={`transition-all duration-1000 delay-800 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}>
            <div className="flex flex-col lg:flex-row lg:items-start">
              {/* Col 1 - Title */}
              <div className="w-full lg:w-1/4 px-4 lg:px-8 mb-6 lg:mb-0">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></div>
                  <h3 className="text-left font-light text-3xl bg-gradient-to-r from-gray-800 to-blue-700 bg-clip-text text-transparent">
                    Education
                  </h3>
                </div>
              </div>

              {/* Col 2 - Content */}
              <div className="w-full lg:w-3/4 px-4 mb-16">
                <div id="responsive-container" className="space-y-6">
                  {/* Education 1 */}
                  <div className={`bg-white rounded-2xl shadow-xl p-6 border border-blue-100/50 hover:shadow-2xl transition-all duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="w-16 h-16 bg-blue-50 rounded-full flex-shrink-0 overflow-hidden flex items-center justify-center">
                        <Image
                          className="object-contain"
                          src="/Images/NTU ICON.png"
                          alt="NTU Logo"
                          width={300}
                          height={300}
                          style={{ maxWidth: '70%', maxHeight: '70%' }}
                        />
                      </div>
                      <div className="flex-grow">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                          <h3 className="text-xl font-semibold text-gray-800">Master of Engineering - MEng, Computer Aided Engineering</h3>
                          <span className="text-gray-500 text-sm mt-1 md:mt-0">Aug 2023 - Present</span>
                        </div>
                        <p className="text-gray-600 font-medium mb-3">National Taiwan University</p>
                        <ul className='list-disc list-inside text-gray-600 space-y-2'>
                          <li>Specializing in the integration of Al with acoustic metamaterials to innovate tailored applications.</li>
                          <li>Employing FEM(COMSOL) to build and simulate metamaterials model, generating novel data.</li>
                          <li>Developed multiple machine learning models, including SVR, RFR, XGB, KNN.</li>
                          <li>Developed a deep learning model from scratch. Familiar with PyTorch and Keras.</li>
                          <li>Studying generative AI technologies, including GANs, VAE and Transformers.</li>
                          <li>Contributing to academic research, co-authoring papers with faculty and doctoral students.</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Education 2 */}
                  <div className={`bg-white rounded-2xl shadow-xl p-6 border border-blue-100/50 hover:shadow-2xl transition-all duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="w-16 h-16 bg-blue-50 rounded-full flex-shrink-0 overflow-hidden flex items-center justify-center">
                        <Image
                          className="object-contain"
                          src="/Images/NTU ICON.png"
                          alt="NTU Logo"
                          width={300}
                          height={300}
                          style={{ maxWidth: '70%', maxHeight: '70%' }}
                        />
                      </div>
                      <div className="flex-grow">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                          <h3 className="text-xl font-semibold text-gray-800">Bachelor of Engineering - BE, Civil Engineering</h3>
                          <span className="text-gray-500 text-sm mt-1 md:mt-0">Sep 2019 - Jul 2023</span>
                        </div>
                        <p className="text-gray-600 font-medium mb-3">National Taiwan University</p>
                        <ul className='list-disc list-inside text-gray-600 space-y-2'>
                          <li>Acquired a solid foundation in engineering principles, emphasizing a problem-solving mindset.</li>
                          <li>Participated in practical projects and coursework that laid the groundwork for advanced studies in computer-aided engineering.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
