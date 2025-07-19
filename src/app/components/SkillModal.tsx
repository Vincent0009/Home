// components/SkillModal.tsx
import { useEffect, useState } from 'react';
import Image from 'next/image';

interface Skill {
  name: string;
  skillLevel?: string;
  category: string;
  icon: string;
  description: string;
  experience: string;
  projects: string[];
  photos?: {
    url: string;
    caption: string;
    alt: string;
  }[];
}

interface SkillModalProps {
  skill: Skill | null;
  isOpen: boolean;
  onClose: () => void;
}

const SkillModal: React.FC<SkillModalProps> = ({ skill, isOpen, onClose }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<number>(0);
  // Add state to control image display mode
  const [fitMode, setFitMode] = useState<'contain' | 'cover'>('contain');

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Reset selected photo when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedPhoto(0);
      setFitMode('contain'); // Reset to contain mode when opening
    }
  }, [isOpen, skill]);

  if (!isOpen || !skill) return null;

  const hasPhotos = skill.photos && skill.photos.length > 0;
  const photos = skill.photos || [];

  // Toggle between contain and cover modes
  const toggleFitMode = () => {
    setFitMode(prev => prev === 'contain' ? 'cover' : 'contain');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal Content - Custom Scrollbar */}
      <div className="relative bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto custom-scrollbar">

        {/* Header - Colorful Professional Design */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-50 via-white to-indigo-50 border-b border-blue-100 p-4 sm:p-6 lg:p-8 rounded-t-xl sm:rounded-t-2xl z-10">
          <div className="flex items-start justify-between gap-4">

            {/* Left side - Skill Information */}
            <div className="min-w-0 flex-1">

              {/* Primary Info - Icon, Title, Category */}
              <div className="flex items-center gap-4 mb-6">
                {/* Icon - Height matching text content */}
                <div className="flex-shrink-0 flex items-center justify-center h-[calc(theme(fontSize.xl)*theme(lineHeight.tight)+theme(fontSize.sm)*theme(lineHeight.tight)+0.25rem)] sm:h-[calc(theme(fontSize.2xl)*theme(lineHeight.tight)+theme(fontSize.base)*theme(lineHeight.tight)+0.5rem)]">
                  <span className="text-4xl sm:text-5xl lg:text-6xl leading-none">{skill.icon}</span>
                </div>

                <div className="min-w-0 flex-1">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent leading-tight mb-1 sm:mb-2">
                    {skill.name}
                  </h1>
                  <p className="text-sm sm:text-base lg:text-lg text-indigo-600 font-semibold tracking-wide uppercase letter-spacing-wide leading-tight">
                    {skill.category}
                  </p>
                </div>
              </div>



              {/* Secondary Info - Experience & Skill Level */}
              <div className="flex flex-row flex-wrap items-center gap-2 sm:gap-4">
                {/* Experience Chip - Compact for mobile */}
                <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-xs sm:text-base font-bold text-emerald-700">
                    {skill.experience}
                  </span>
                  <span className="text-xs sm:text-sm text-emerald-600 font-medium hidden sm:inline">
                    experience
                  </span>
                </div>

                {/* Skill Level Chip - Compact for mobile */}
                <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-violet-500 rounded-full animate-pulse"></div>
                  <span className="text-xs sm:text-base font-bold text-violet-700">
                    {skill.skillLevel || "Professional"}
                  </span>
                  <span className="text-xs sm:text-sm text-violet-600 font-medium hidden sm:inline">
                    level
                  </span>
                </div>
              </div>



            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="flex-shrink-0 p-2 hover:bg-red-50 hover:border-red-200 border border-transparent rounded-full transition-all duration-200 group"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6 text-gray-400 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-b from-white to-gray-50/30">

          {/* Photo Gallery */}
          {hasPhotos && (
            <div className="mb-8 sm:mb-10">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></div>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                  Project Gallery
                </h2>
              </div>

              {/* Main Photo Display */}
              <div className="relative mb-4 sm:mb-6">
                <div className="relative h-48 sm:h-64 md:h-72 lg:h-80 xl:h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden shadow-lg ring-1 ring-gray-200">
                  <Image
                    src={photos[selectedPhoto].url}
                    alt={photos[selectedPhoto].alt}
                    fill
                    className={`transition-all duration-300 object-${fitMode}`}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 70vw"
                  />

                  {/* Navigation Arrows - With enhanced hover effects */}
                  {photos.length > 1 && (
                    <>
                      <button
                        onClick={() => setSelectedPhoto(prev => prev === 0 ? photos.length - 1 : prev - 1)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white border border-blue-200 hover:border-blue-400 rounded-full p-2 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 group"
                        title="Previous image"
                      >
                        <svg className="w-5 h-5 text-blue-600 group-hover:text-indigo-700 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setSelectedPhoto(prev => prev === photos.length - 1 ? 0 : prev + 1)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white border border-blue-200 hover:border-blue-400 rounded-full p-2 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 group"
                        title="Next image"
                      >
                        <svg className="w-5 h-5 text-blue-600 group-hover:text-indigo-700 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </>
                  )}

                  {/* Photo Counter */}
                  {photos.length > 1 && (
                    <div className="absolute bottom-4 right-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                      {selectedPhoto + 1} / {photos.length}
                    </div>
                  )}
                </div>

                {/* Photo Caption */}
                {photos[selectedPhoto].caption && (
                  <p className="text-sm sm:text-base text-gray-600 mt-3 text-center italic font-medium">
                    {photos[selectedPhoto].caption}
                  </p>
                )}
              </div>

              {/* Thumbnail Navigation */}
              {photos.length > 1 && (
                <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                  {photos.map((photo, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedPhoto(index)}
                      className={`relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-lg overflow-hidden border-2 transition-all duration-200 ${selectedPhoto === index
                        ? 'border-blue-500 ring-2 ring-blue-200 shadow-lg'
                        : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                        }`}
                    >
                      <Image
                        src={photo.url}
                        alt={photo.alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 64px, (max-width: 1024px) 80px, 96px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Description Section */}
          <div className="mb-8 sm:mb-10">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="w-1 h-6 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full"></div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                About This Skill
              </h2>
            </div>
            <div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border border-blue-100 rounded-xl p-4 sm:p-6">
              <p className="text-base sm:text-lg lg:text-xl text-gray-700 leading-relaxed font-normal">
                {skill.description}
              </p>
            </div>
          </div>

          {/* Projects Section */}
          <div>
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="w-1 h-6 bg-gradient-to-b from-violet-500 to-purple-500 rounded-full"></div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                Highlights
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {skill.projects.map((project, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-4 sm:p-5 hover:from-blue-50 hover:to-indigo-50 hover:border-blue-200 hover:shadow-lg transition-all duration-300 group cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex-shrink-0 mt-2 group-hover:from-indigo-500 group-hover:to-purple-500 transition-all duration-300"></div>
                    <span className="text-sm sm:text-base lg:text-lg font-medium text-gray-800 leading-relaxed group-hover:text-gray-900 transition-colors">
                      {project}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillModal;