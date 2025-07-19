// components/SkillsGrid.tsx
import { useState, useMemo, useCallback, memo } from 'react';

interface Skill {
    name: string;
    skillLevel?: string;
    category: string;
    icon: string;
    description: string;
    experience: string;
    projects: string[];
}

interface SkillsGridProps {
    skills: Skill[];
    onSkillClick: (skill: Skill) => void;
    viewMode: 'showcase' | 'detailed';
    title?: string;
    subtitle?: string;
    isLoading?: boolean;
}

// Move DESIGN constants outside component to prevent recreation
const DESIGN = {
    colors: {
        primary: {
            from: 'from-blue-500',
            to: 'to-indigo-500',
            text: 'text-blue-600',
            hover: 'group-hover:text-blue-700',
            light: {
                from: 'from-blue-50',
                to: 'to-indigo-50',
                hover: {
                    from: 'hover:from-blue-100',
                    to: 'hover:to-indigo-100'
                }
            }
        },
        secondary: {
            emerald: {
                from: 'from-emerald-50',
                to: 'to-teal-50',
                text: 'text-emerald-700',
                border: 'border-emerald-200',
                hover: {
                    from: 'group-hover:from-emerald-100',
                    to: 'group-hover:to-teal-100'
                }
            },
            violet: {
                from: 'from-violet-50',
                to: 'to-purple-50',
                text: 'text-violet-700',
                border: 'border-violet-200',
                hover: {
                    from: 'group-hover:from-violet-100',
                    to: 'group-hover:to-purple-100'
                }
            }
        },
        text: {
            primary: 'text-gray-800',
            secondary: 'text-gray-600',
            light: 'text-gray-500',
            gradient: {
                dark: 'from-gray-900 to-gray-700',
                blue: 'from-blue-700 to-indigo-700'
            }
        }
    },
    spacing: {
        card: 'p-6',
        cardMobile: 'p-5',
        section: 'mb-6',
        sectionMobile: 'mb-4'
    },
    borders: {
        radius: 'rounded-xl',
        width: 'border',
        color: 'border-blue-200/40',
        hover: 'hover:border-blue-400'
    },
    shadows: {
        default: 'shadow-lg',
        hover: 'hover:shadow-xl'
    },
    animation: {
        transition: 'transition-all duration-300',
        hover: 'transform hover:scale-[1.01]',
        shimmer: 'animate-[shimmer_2s_infinite]'
    }
} as const;

// Pre-computed className strings to avoid repeated concatenation
const COMPUTED_CLASSES = {
    skeletonCard: `bg-white/80 backdrop-blur-sm ${DESIGN.borders.radius} ${DESIGN.shadows.default} ${DESIGN.spacing.cardMobile} sm:${DESIGN.spacing.card} ${DESIGN.borders.width} ${DESIGN.borders.color} relative overflow-hidden`,
    shimmerEffect: `absolute inset-0 -translate-x-full ${DESIGN.animation.shimmer} bg-gradient-to-r from-transparent via-blue-200/30 to-transparent`,
    detailedCard: `group bg-white/90 backdrop-blur-sm ${DESIGN.borders.radius} ${DESIGN.shadows.default} ${DESIGN.spacing.cardMobile} sm:${DESIGN.spacing.card} ${DESIGN.animation.transition} cursor-pointer relative overflow-hidden ${DESIGN.animation.hover} ${DESIGN.borders.width} ${DESIGN.borders.color} ${DESIGN.borders.hover} ${DESIGN.shadows.hover}`,
    experienceBadge: `inline-flex items-center gap-2 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold bg-gradient-to-r ${DESIGN.colors.secondary.emerald.from} ${DESIGN.colors.secondary.emerald.to} ${DESIGN.colors.secondary.emerald.text} ${DESIGN.borders.width} ${DESIGN.colors.secondary.emerald.border} shadow-sm ${DESIGN.animation.transition} ${DESIGN.colors.secondary.emerald.hover.from} ${DESIGN.colors.secondary.emerald.hover.to}`,
    skillLevelBadge: `inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-gradient-to-r ${DESIGN.colors.secondary.violet.from} ${DESIGN.colors.secondary.violet.to} ${DESIGN.borders.width} ${DESIGN.colors.secondary.violet.border} shadow-sm ${DESIGN.animation.transition} ${DESIGN.colors.secondary.violet.hover.from} ${DESIGN.colors.secondary.violet.hover.to}`,
    projectTag: `px-2 sm:px-3 py-1 bg-gradient-to-r ${DESIGN.colors.primary.light.from} ${DESIGN.colors.primary.light.to} ${DESIGN.colors.primary.text} rounded-full text-xs font-semibold ${DESIGN.borders.width} ${DESIGN.borders.color} truncate max-w-full ${DESIGN.animation.transition} ${DESIGN.colors.primary.light.hover.from} ${DESIGN.colors.primary.light.hover.to} ${DESIGN.borders.hover}`
} as const;

// Memoized Skeleton Card Component
const SkeletonCard = memo(({ index }: { index: number }) => (
    <div className={COMPUTED_CLASSES.skeletonCard}>
        <div className={COMPUTED_CLASSES.shimmerEffect}></div>
        
        <div className="relative">
            <div className={`flex items-center space-x-3 ${DESIGN.spacing.sectionMobile} sm:${DESIGN.spacing.section}`}>
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-100 to-sky-200 rounded-lg animate-pulse flex-shrink-0"></div>
                <div className="min-w-0 flex-1">
                    <div className="h-5 sm:h-6 bg-gradient-to-r from-blue-100 to-sky-200 rounded animate-pulse mb-2"></div>
                    <div className="h-3 sm:h-4 bg-gradient-to-r from-cyan-100 to-blue-100 rounded animate-pulse w-3/4"></div>
                </div>
            </div>

            <div className={`flex items-center justify-between ${DESIGN.spacing.sectionMobile} sm:${DESIGN.spacing.section} gap-3`}>
                <div className="h-7 sm:h-8 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full animate-pulse w-24 sm:w-32 border border-emerald-200/50"></div>
                <div className="h-7 sm:h-8 bg-gradient-to-r from-violet-100 to-purple-100 rounded-full animate-pulse w-20 sm:w-28 border border-violet-200/50"></div>
            </div>

            <div className={`space-y-2 ${DESIGN.spacing.sectionMobile}`}>
                <div className="h-3 sm:h-4 bg-gradient-to-r from-slate-100 to-blue-100 rounded animate-pulse"></div>
                <div className="h-3 sm:h-4 bg-gradient-to-r from-slate-100 to-blue-100 rounded animate-pulse w-4/5"></div>
                <div className="h-3 sm:h-4 bg-gradient-to-r from-slate-100 to-blue-100 rounded animate-pulse w-3/5"></div>
            </div>

            <div className="space-y-2">
                <div className="h-3 bg-gradient-to-r from-blue-100 to-indigo-100 rounded animate-pulse w-16"></div>
                <div className="flex flex-wrap gap-1.5">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-6 bg-gradient-to-r from-blue-50 to-sky-100 rounded-full animate-pulse w-16 border border-blue-200/30"></div>
                    ))}
                </div>
            </div>
        </div>
    </div>
));

SkeletonCard.displayName = 'SkeletonCard';

// Memoized Project Tags Component
const ProjectTags = memo(({ projects }: { projects: string[] }) => {
    const visibleProjects = useMemo(() => projects.slice(0, 3), [projects]);
    const remainingCount = useMemo(() => Math.max(0, projects.length - 3), [projects.length]);

    return (
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {visibleProjects.map((project, idx) => (
                <span key={`${project}-${idx}`} className={COMPUTED_CLASSES.projectTag}>
                    {project}
                </span>
            ))}
            {remainingCount > 0 && (
                <span className="px-2 sm:px-3 py-1 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-600 rounded-full text-xs font-semibold border border-gray-200 whitespace-nowrap transition-all duration-300 hover:from-gray-100 hover:to-gray-200 hover:border-gray-300">
                    +{remainingCount} more
                </span>
            )}
        </div>
    );
});

ProjectTags.displayName = 'ProjectTags';

// Memoized Detailed Card Component
const DetailedCard = memo(({ 
    skill, 
    index, 
    isHovered, 
    onHover, 
    onLeave, 
    onClick 
}: { 
    skill: Skill; 
    index: number; 
    isHovered: boolean;
    onHover: () => void;
    onLeave: () => void;
    onClick: () => void;
}) => {
    const titleGradient = useMemo(() => 
        isHovered ? DESIGN.colors.text.gradient.blue : DESIGN.colors.text.gradient.dark,
        [isHovered]
    );

    return (
        <div
            className={COMPUTED_CLASSES.detailedCard}
            onClick={onClick}
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
            tabIndex={0}
            role="button"
            aria-label={`View details for ${skill.name}`}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 via-transparent to-indigo-50/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>

            <div className="relative z-10">
                <div className={`flex items-center space-x-3 ${DESIGN.spacing.sectionMobile} sm:${DESIGN.spacing.section}`}>
                    <div className={`text-3xl sm:text-4xl flex-shrink-0 ${DESIGN.animation.transition} ${DESIGN.colors.primary.text} ${DESIGN.colors.primary.hover}`}>
                        {skill.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                        <h3 className={`text-lg sm:text-xl font-bold bg-gradient-to-r ${titleGradient} bg-clip-text text-transparent truncate`}>
                            {skill.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-indigo-600 font-semibold tracking-wide uppercase truncate">
                            {skill.category}
                        </p>
                    </div>
                </div>

                <div className={`flex items-center justify-between ${DESIGN.spacing.sectionMobile} sm:${DESIGN.spacing.section} gap-3`}>
                    <div className="flex-shrink-0">
                        <span className={COMPUTED_CLASSES.experienceBadge}>
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                            {skill.experience}
                        </span>
                    </div>

                    <div className="flex-shrink-0 text-right">
                        <div className={COMPUTED_CLASSES.skillLevelBadge}>
                            <div className={`text-xs sm:text-sm font-bold ${DESIGN.colors.secondary.violet.text} whitespace-nowrap`}>
                                {skill.skillLevel || "Professional"}
                            </div>
                            <div className="w-1 h-1 bg-violet-500 rounded-full animate-pulse"></div>
                        </div>
                    </div>
                </div>

                <div className={`${DESIGN.spacing.sectionMobile} sm:${DESIGN.spacing.section}`}>
                    <p className={`text-sm sm:text-base ${DESIGN.colors.text.secondary} leading-relaxed line-clamp-2 sm:line-clamp-3 ${DESIGN.animation.transition} group-hover:${DESIGN.colors.text.primary}`}>
                        {skill.description}
                    </p>
                </div>

                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className={`w-1 h-4 bg-gradient-to-b ${DESIGN.colors.primary.from} ${DESIGN.colors.primary.to} rounded-full`}></div>
                        <h4 className={`font-bold ${DESIGN.colors.text.primary} text-sm sm:text-base`}>Highlights</h4>
                    </div>
                    <ProjectTags projects={skill.projects} />
                </div>
            </div>

            <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${DESIGN.colors.primary.from} ${DESIGN.colors.primary.to} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}></div>
        </div>
    );
});

DetailedCard.displayName = 'DetailedCard';

const SkillsGrid: React.FC<SkillsGridProps> = ({
    skills,
    onSkillClick,
    viewMode,
    title,
    subtitle,
    isLoading = false
}) => {
    const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

    // Memoize skill click handlers to prevent recreating functions
    const handleSkillClick = useCallback((skill: Skill) => {
        onSkillClick(skill);
    }, [onSkillClick]);

    const handleSkillHover = useCallback((skillName: string) => {
        setHoveredSkill(skillName);
    }, []);

    const handleSkillLeave = useCallback(() => {
        setHoveredSkill(null);
    }, []);

    // Memoize skeleton array to prevent recreation
    const skeletonItems = useMemo(() => 
        Array.from({ length: 6 }, (_, index) => index),
        []
    );

    return (
        <div className="w-full py-6 sm:py-8 px-4 bg-transparent">
            <div className="max-w-7xl mx-auto">
                {(title || subtitle) && (
                    <div className="text-center mb-8 sm:mb-12">
                        {title && (
                            <div className="mb-4">
                                <div className="inline-flex items-center gap-3 mb-2">
                                    <div className={`w-2 h-8 bg-gradient-to-b ${DESIGN.colors.primary.from} ${DESIGN.colors.primary.to} rounded-full`}></div>
                                    <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r ${DESIGN.colors.text.gradient.dark} bg-clip-text text-transparent`}>
                                        {title}
                                    </h2>
                                    <div className={`w-2 h-8 bg-gradient-to-b ${DESIGN.colors.primary.from} ${DESIGN.colors.primary.to} rounded-full`}></div>
                                </div>
                            </div>
                        )}
                        {subtitle && (
                            <p className={`text-base sm:text-lg lg:text-xl ${DESIGN.colors.text.secondary} max-w-3xl mx-auto leading-relaxed`}>
                                {subtitle}
                            </p>
                        )}
                    </div>
                )}

                <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                    {isLoading ? (
                        skeletonItems.map((index) => (
                            <div
                                key={`skeleton-${index}`}
                                className="transition-all duration-500 translate-y-4 opacity-0 animate-[slideUp_0.6s_ease-out_forwards]"
                                style={{ animationDelay: `${index * 150}ms` }}
                            >
                                <SkeletonCard index={index} />
                            </div>
                        ))
                    ) : (
                        skills.map((skill, index) => (
                            <div
                                key={`${skill.name}-${index}`}
                                className="transition-all duration-500 translate-y-4 opacity-0 animate-[slideUp_0.6s_ease-out_forwards]"
                                style={{ animationDelay: `${index * 150}ms` }}
                            >
                                <DetailedCard 
                                    skill={skill} 
                                    index={index}
                                    isHovered={hoveredSkill === skill.name}
                                    onHover={() => handleSkillHover(skill.name)}
                                    onLeave={handleSkillLeave}
                                    onClick={() => handleSkillClick(skill)}
                                />
                            </div>
                        ))
                    )}
                </div>

                {!isLoading && skills.length === 0 && (
                    <div className="text-center py-12 sm:py-16">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        </div>
                        <h3 className={`text-lg font-semibold ${DESIGN.colors.text.secondary} mb-2`}>No skills found</h3>
                        <p className={DESIGN.colors.text.light}>Skills will appear here when available.</p>
                    </div>
                )}
            </div>

            <style jsx>{`
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                .line-clamp-3 {
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                @keyframes shimmer {
                    100% {
                        transform: translateX(100%);
                    }
                }
                @keyframes slideUp {
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    );
};

export default SkillsGrid;
