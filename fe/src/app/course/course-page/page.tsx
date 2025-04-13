"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from 'react-intersection-observer';
import {
    BookOpen, Clock, Users, Trophy, Star,
    CheckSquare, ArrowRight, Target,
    MessageCircle, ChevronDown, Award, FileText,
} from "lucide-react";
import { useTheme } from '@/context/ThemeContext';
import Image from "next/image";
import Link from "next/link";

// Optimized animation variants with smoother transitions
const contentVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.4 } },
    exit: { opacity: 0, transition: { duration: 0.2 } }
};

// Reduced y-value for better mobile experience
const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

// Type definitions
interface CourseTab {
    id: string;
    title: string;
}

interface GoalItem {
    title: string;
    icon: React.ReactNode;
    description: string;
}

interface CourseMethod {
    text: string;
}

interface CourseStats {
    students: number;
    satisfaction: string;
}

interface CourseData {
    id: string;
    title: string;
    subtitle: string;
    tagline: string;
    heroImage: string;
    contentImage: string;
    duration: {
        total: string;
        frequency: string;
        perSession: string;
    };
    target: string;
    methods: CourseMethod[];
    extendedMethods?: CourseMethod[];
    goals: GoalItem[];
    stats: CourseStats;
}

// Reusable animated section component with optimized threshold
const AnimatedSection: React.FC<{
    children: React.ReactNode;
    threshold?: number;
}> = ({ children, threshold = 0.1 }) => {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold,
    });

    return (
        <motion.div
            ref={ref}
            variants={sectionVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
        >
            {children}
        </motion.div>
    );
};

// Goal item component with optimized animations
const GoalItem: React.FC<{
    goal: GoalItem;
    index: number;
    isDarkMode: boolean;
}> = ({ goal, index, isDarkMode }) => {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1
    });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`p-4 sm:p-5 md:p-6 rounded-lg ${isDarkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-blue-50'} shadow-md sm:shadow-lg transition duration-300 hover:shadow-xl border ${isDarkMode ? 'border-gray-700' : 'border-blue-100'}`}
        >
            <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center mb-3 sm:mb-4 ${isDarkMode ? 'bg-blue-900' : 'bg-blue-100'}`}>
                <div className="w-6 h-6 sm:w-7 sm:h-7">{goal.icon}</div>
            </div>
            <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">{goal.title}</h3>
            <p className={`text-sm sm:text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{goal.description}</p>
        </motion.div>
    );
};

// Main course page component
const CoursesPage: React.FC = () => {
    // State management
    const { isDarkMode } = useTheme();
    const [activeTab, setActiveTab] = useState<string>("four-skills");
    const [isExpanded, setIsExpanded] = useState<boolean>(false);

    // Reset expanded state when changing tabs
    useEffect(() => {
        setIsExpanded(false);
    }, [activeTab]);

    // Intersection observers with optimized thresholds
    const [ctaRef, ctaInView] = useInView({
        triggerOnce: true,
        threshold: 0.2,
        delay: 300
    });

    const [heroRef, heroInView] = useInView({
        triggerOnce: true,
        threshold: 0.05
    });

    // Method for toggling expanded content
    const toggleExpanded = (): void => {
        setIsExpanded(!isExpanded);
    };

    // Course tabs data
    const courseTabs: CourseTab[] = [
        { id: "four-skills", title: "Basic English" },
        { id: "communication", title: "Communication English" },
        { id: "toeic-450", title: "TOEIC 450+" },
        { id: "toeic-650", title: "TOEIC 650+" },
        { id: "ielts-v1", title: "IELTS 0-3.0" },
        { id: "ielts-v2", title: "IELTS 3.0-5.0" },
        { id: "ielts-v3", title: "IELTS 5.0-6.5" },
    ];

    // Course data (placeholder - would be populated with actual data)
    const coursesData: Record<string, CourseData> = {
        "four-skills": {
            id: "four-skills",
            title: "4 SKILLS",
            subtitle: "Build a solid foundation for your English learning journey",
            tagline: "Foundation Course",
            heroImage: "/images/detail/top.jpg",
            contentImage: "/images/detail/e.jpg",
            duration: {
                total: "25 sessions (37.5 hours)",
                frequency: "2 sessions/week",
                perSession: "1.5 hours/session"
            },
            target: "Students with no English background, weak in grammar, phonetics, listening and speaking",
            methods: [
                { text: "Utilizes slides combined with detailed, visually rich textbooks compiled by the center's instructors" },
                { text: 'Learn and practice standard American English pronunciation based on the International Phonetic Alphabet (IPA) with instructors who have "native-like" pronunciation' },
                { text: "Systematizes all basic grammar concisely, making it easy to remember and apply in basic communication" },
                { text: "Provides 500+ vocabulary items by topic with illustrations and 1000+ vocabulary items through listening exercises" }
            ],
            extendedMethods: [
                { text: "Practice listening skills from basic to advanced through diverse, effective, and engaging methods" },
                { text: "Integrates 4 skills: Phonetics - Grammar - Listening & Speaking applied to basic communication topics" }
            ],
            goals: [
                {
                    title: "Master Grammar",
                    description: 'Master the most common grammatical phenomena, overcoming the fear of having "lost the basics of English"',
                    icon: <BookOpen className="w-6 h-6 text-blue-700" />
                },
                {
                    title: "Standard Pronunciation",
                    description: 'Eliminate hesitation, build confidence in achieving "native-like" pronunciation',
                    icon: <MessageCircle className="w-6 h-6 text-blue-700" />
                },
                {
                    title: "Rich Vocabulary",
                    description: 'Master over 1500 basic vocabulary words, preventing being "lost for words" during communication',
                    icon: <BookOpen className="w-6 h-6 text-blue-700" />
                },
                {
                    title: "Communication Skills",
                    description: "Apply Listening - Speaking skills to basic everyday topics using simple yet practical sentence patterns",
                    icon: <Users className="w-6 h-6 text-blue-700" />
                }
            ],
            stats: {
                students: 1500,
                satisfaction: "98%"
            }
        },
        "communication": {
            id: "communication",
            title: "COMMUNICATION COURSE",
            subtitle: "Confidently communicate in English in any situation",
            tagline: "Communication Course",
            heroImage: "/images/detail/top1.jpg",
            contentImage: "/images/detail/e1.jpg",
            duration: {
                total: "25 sessions (37.5 hours)",
                frequency: "2 sessions/week",
                perSession: "1.5 hours/session"
            },
            target: "Students with a foundation in Grammar, but lacking the skills to speak fluently and confidently with foreigners",
            methods: [
                {
                    text: "Practice communication in specialized classrooms, with a modern, dynamic environment meeting 3 criteria"
                },
                {
                    text: "Casting: Role-play and experience real-life situations right in the classroom"
                },
                {
                    text: "Multi-sense: A multi-sensory learning and memorization system, combining listening, speaking, and using actions to describe sentence patterns and phrases, helping to embed them subconsciously without effort"
                },
                { text: "Utilizes AI technology to analyze and improve pronunciation skills" }
            ],
            extendedMethods: [
                {
                    text: "Short-story: A system of short lessons, minigames, listening and answering questions automatically at high speed to train thinking and reflex skills in English"
                },
                {
                    text: "4 practical learning and experience sessions with Foreign instructors, supported by the main instructor and teaching assistants, creating a close, comfortable, and friendly atmosphere"
                }
            ],
            goals: [
                {
                    title: "Pronunciation & Quick Reflexes",
                    description: "Master sound linking, elision techniques, and develop natural reflexes in real communication.",
                    icon: <BookOpen className="w-6 h-6 text-blue-700" />
                },
                {
                    title: "Vocabulary & Sentence Structures",
                    description: "Acquire 1500 vocabulary words and 300 common sentence structures for more fluent and confident communication.",
                    icon: <BookOpen className="w-6 h-6 text-blue-700" />
                },
                {
                    title: "Idioms & Slang",
                    description: "Learn and apply idioms, proverbs, and slang to keep up with modern trends and suit the context.",
                    icon: <MessageCircle className="w-6 h-6 text-blue-700" />
                },
                {
                    title: "Expanded Communication",
                    description: "Expand ideas, not just giving short answers but being able to converse more deeply in real situations.",
                    icon: <Users className="w-6 h-6 text-blue-700" />
                }
            ],
            stats: {
                students: 1200,
                satisfaction: "96%"
            }
        },
        "toeic-450": {
            id: "toeic-450",
            title: "TOEIC 450+",
            subtitle: "Conquer the TOEIC certificate from scratch",
            tagline: "Basic TOEIC Course",
            heroImage: "/images/detail/top2.jpg",
            contentImage: "/images/detail/e2.jpg",
            duration: {
                total: "25 sessions (37.5 hours)",
                frequency: "2 sessions/week",
                perSession: "1.5 hours/session"
            },
            target: "Students with a Grammar foundation, but no prior exposure to the TOEIC Test",
            methods: [
                { text: "Acquire TIPS for the TOEIC 2 Skills test: LISTENING - READING" },
                { text: "The entire curriculum is compiled and updated quarterly according to the latest IIG format by the center's specialized instructors with many years of TOEIC preparation experience" },
                { text: "Students always get access to monthly practice tests closely mirroring the real TOEIC test and experience a simulated test environment" },
                { text: "During the learning process, progress is always monitored and evaluated objectively with the motto LEARN REAL, TEST REAL" }
            ],
            extendedMethods: [
                { text: "Regular practice with monthly mock tests helps students self-assess their abilities and adjust learning methods" },
                { text: "Combines in-person and online learning with a diverse system of online exercises, facilitating review anytime, anywhere" }
            ],
            goals: [
                {
                    title: "Master Test Structure",
                    description: "Familiarize and become proficient with the latest TOEIC test format from IIG Vietnam",
                    icon: <BookOpen className="w-6 h-6 text-blue-700" />
                },
                {
                    title: "Effective Test-Taking Tips",
                    description: "Possess strategies and tips for each test section, saving time and increasing accuracy",
                    icon: <MessageCircle className="w-6 h-6 text-blue-700" />
                },
                {
                    title: "In-depth TOEIC Vocabulary",
                    description: "Master 500+ vocabulary words frequently appearing in the TOEIC test, categorized by topic",
                    icon: <BookOpen className="w-6 h-6 text-blue-700" />
                },
                {
                    title: "Guaranteed Outcome",
                    description: "Guaranteed to achieve a TOEIC score of 450-550 when taking the test at IIG Vietnam",
                    icon: <Award className="w-6 h-6 text-blue-700" />
                }
            ],
            stats: {
                students: 1800,
                satisfaction: "97%"
            }
        },
        "toeic-650": {
            id: "toeic-650",
            title: "TOEIC 650+",
            subtitle: "Improve your TOEIC score to meet work and study requirements",
            tagline: "Advanced TOEIC Course",
            heroImage: "/images/detail/top3.jpg",
            contentImage: "/images/detail/e3.jpg",
            duration: {
                total: "25 sessions (37.5 hours)",
                frequency: "2 sessions/week",
                perSession: "1.5 hours/session"
            },
            target: "Students with a TOEIC score between 450-500, familiar with the 2-skill TOEIC test structure",
            methods: [
                { text: "Organize test-solving sessions following the most standard and relevant study path, SAY NO to providing easier tests than the real one, which creates complacency among students" },
                { text: "Update with the latest quarterly changes from the IIG TOEIC test council" },
                { text: "Taught by a team of instructors with many years of experience in TOEIC training and individual scores of 900+" },
                { text: "Apply intensive learning methods with exercises specifically designed for the 650+ target score" }
            ],
            extendedMethods: [
                { text: "Organize periodic mock tests in a real test environment to help students get used to exam pressure" },
                { text: "Provide detailed analysis of common mistakes and offer effective correction methods" }
            ],
            goals: [
                {
                    title: "Advanced Test Strategies",
                    description: "Master time allocation strategies and techniques for handling difficult question types in the test",
                    icon: <BookOpen className="w-6 h-6 text-blue-700" />
                },
                {
                    title: "Specialized Vocabulary",
                    description: "Expand specialized vocabulary in fields like economics, HR, marketing, IT frequently appearing in TOEIC",
                    icon: <BookOpen className="w-6 h-6 text-blue-700" />
                },
                {
                    title: "Advanced Listening Skills",
                    description: "Develop the ability to listen at faster speeds, with different accents, and complex content",
                    icon: <MessageCircle className="w-6 h-6 text-blue-700" />
                },
                {
                    title: "Guaranteed Outcome",
                    description: "Guaranteed to achieve over 650 TOEIC points, using the certificate for work and future prospects",
                    icon: <Award className="w-6 h-6 text-blue-700" />
                }
            ],
            stats: {
                students: 1350,
                satisfaction: "95%"
            }
        },
        "ielts-v1": {
            id: "ielts-v1",
            title: "IELTS 0-3.0",
            subtitle: "Build a solid foundation for your IELTS conquest journey",
            tagline: "Basic IELTS Course",
            heroImage: "/images/detail/top4.jpg",
            contentImage: "/images/detail/e4.jpg",
            duration: {
                total: "25 sessions (37.5 hours)",
                frequency: "2 sessions/week",
                perSession: "1.5 hours/session"
            },
            target: "Students with a foundation in grammar and Listening-Speaking, new to the IELTS certificate",
            methods: [
                { text: "Master the structure of the IELTS test" },
                { text: "Familiarize with question types in the IELTS Reading & Listening tests" },
                { text: "Master the core of SPEAKING Part 1 with idea development methods combined with vocabulary application and a brief introduction to Part 2" },
                { text: "Review and consolidate important grammar points for the IELTS WRITING section" }
            ],
            extendedMethods: [
                { text: "Practice writing skills from clauses, simple and complex sentences to completing an academic paragraph" },
                { text: "Master the most basic knowledge about the IELTS exam, serving as a stepping stone to higher band scores" }
            ],
            goals: [
                {
                    title: "Grammar Structures",
                    description: "Learn grammatical structures from easy to difficult in-depth and practice regularly to apply them fluently",
                    icon: <BookOpen className="w-6 h-6 text-blue-700" />
                },
                {
                    title: "Academic Vocabulary",
                    description: "Expand the most basic Academic vocabulary frequently appearing in the IELTS test",
                    icon: <BookOpen className="w-6 h-6 text-blue-700" />
                },
                {
                    title: "Familiarize with Test Format",
                    description: "Build a foundation for all 4 skills in the IELTS exam by exposure to real test papers",
                    icon: <FileText className="w-6 h-6 text-blue-700" />
                },
                {
                    title: "Basic Test-Taking Skills",
                    description: "Master basic IELTS test-taking techniques, creating a foundation for advanced courses",
                    icon: <Award className="w-6 h-6 text-blue-700" />
                }
            ],
            stats: {
                students: 950,
                satisfaction: "93%"
            }
        },
        "ielts-v2": {
            id: "ielts-v2",
            title: "IELTS 3.0-5.0",
            subtitle: "Improve your IELTS level with a comprehensive learning method",
            tagline: "Intermediate IELTS Course",
            heroImage: "/images/detail/top5.jpg",
            contentImage: "/images/detail/e5.jpg",
            duration: {
                total: "35 sessions (52.5 hours)",
                frequency: "2 sessions/week",
                perSession: "1.5 hours/session"
            },
            target: "Students with an IELTS score of at least 3.0 or who have completed the IELTS Preparation course",
            methods: [
                { text: "The 4 skills Listening-Speaking-Reading-Writing are practiced alternately, 1-2 skills per session, creating a comfortable, pressure-free learning environment" },
                { text: "Speaking: Provide vocabulary, paraphrasing techniques, and answer structures to make answers better and achieve higher band scores in Speaking Part 1" },
                { text: "Learn how to allocate speaking time for each section in Part 2, applied to basic speaking topics of the IELTS test" },
                { text: "Always provide students with the most common and latest topics and question types that will appear in the IELTS exam, updated quarterly" }
            ],
            extendedMethods: [
                { text: "Listening + Reading: Approach and practice classic question types in the test (T/F/NG, Form completion, Matching Headings, etc.) and test-taking tips" },
                { text: "Writing: Apply grammar and advanced techniques to complete paragraphs using specialized, diverse vocabulary to maximize points, overcoming the fear of the most difficult section in the IELTS test" }
            ],
            goals: [
                {
                    title: "In-depth Speaking Skills",
                    description: "Master answering methods and practice speaking skills to achieve band 5.0",
                    icon: <MessageCircle className="w-6 h-6 text-blue-700" />
                },
                {
                    title: "Reading & Listening Strategies",
                    description: "Master classic question types and effective test-taking tips within the time limit",
                    icon: <BookOpen className="w-6 h-6 text-blue-700" />
                },
                {
                    title: "Diverse Writing Skills",
                    description: "Develop writing ability with academic vocabulary and diverse sentence structures",
                    icon: <FileText className="w-6 h-6 text-blue-700" />
                },
                {
                    title: "Guaranteed Outcome",
                    description: "GUARANTEED OUTCOME of 5.0+ upon course completion",
                    icon: <Award className="w-6 h-6 text-blue-700" />
                }
            ],
            stats: {
                students: 780,
                satisfaction: "94%"
            }
        },
        "ielts-v3": {
            id: "ielts-v3",
            title: "IELTS 5.0-6.5+",
            subtitle: "Conquer high IELTS band scores with an intensive method",
            tagline: "Advanced IELTS Course",
            heroImage: "/images/detail/top6.jpg",
            contentImage: "/images/detail/e6.jpg", // Assuming e6.jpg exists, corrected from top6.jpg
            duration: {
                total: "35 sessions (52.5 hours)",
                frequency: "2 sessions/week",
                perSession: "1.5 hours/session"
            },
            target: "Students with an IELTS score of at least 5.0 or who have completed the IELTS Intermediate course",
            methods: [
                { text: "Focus on solving IELTS tests at high intensity, completing all skills to be ready for the IELTS test at international councils like BC, IDP" },
                { text: "Lectures use slides and specialized textbooks compiled by experienced IELTS instructors (8.5 IELTS) and updated with the latest test formats" },
                { text: "Collaborate with IDP to assist with computer-based test registration and test procedures at the council" },
                { text: "Apply advanced techniques for each test section, especially strategies for Speaking and Writing" }
            ],
            extendedMethods: [
                { text: "Regular practice with mock tests matching the real format and timing, with detailed evaluation and feedback from instructors" },
                { text: "Provide specialized supplementary materials and high-scoring sample answers (7.0+) for student reference" }
            ],
            goals: [
                {
                    title: "Advanced Speaking & Writing",
                    description: "Develop the skill of presenting opinions logically and persuasively with diverse academic vocabulary and complex structures",
                    icon: <MessageCircle className="w-6 h-6 text-blue-700" />
                },
                {
                    title: "In-depth Test Strategies",
                    description: "Master effective strategies for each question type, especially difficult ones in Reading and Listening",
                    icon: <BookOpen className="w-6 h-6 text-blue-700" />
                },
                {
                    title: "Academic Vocabulary & Grammar",
                    description: "Expand academic vocabulary and complex grammatical structures to raise Writing and Speaking band scores",
                    icon: <FileText className="w-6 h-6 text-blue-700" />
                },
                {
                    title: "Guaranteed Outcome",
                    description: "GUARANTEED OUTCOME of 6.5+, proud of many students achieving certificates exceeding the course target (7.0-7.5)",
                    icon: <Award className="w-6 h-6 text-blue-700" />
                }
            ],
            stats: {
                students: 620,
                satisfaction: "96%"
            }
        }
    };

    // Get current course data
    const currentCourse = coursesData[activeTab];

    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-b from-gray-900 to-gray-800' : 'bg-gradient-to-b from-blue-50 to-white'}`}>
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                {/* Background Image with Animation */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0"
                    >
                        <Image
                            src={currentCourse.heroImage}
                            alt="Course Background"
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className={`absolute inset-0 ${isDarkMode ? 'bg-blue-900 bg-opacity-70' : 'bg-blue-900 bg-opacity-40'}`}></div>
                    </motion.div>
                </AnimatePresence>

                {/* Hero Content */}
                <div className="container mx-auto px-4 py-16 sm:py-20 md:py-24 relative z-10">
                    <AnimatePresence mode="wait">
                        <motion.div
                            ref={heroRef}
                            key={activeTab}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8 }}
                            className="flex flex-col items-center text-center max-w-3xl mx-auto"
                        >
                            <motion.span
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={heroInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className={`${isDarkMode ? 'bg-red-700' : 'bg-red-600'} text-white px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6 shadow-lg`}
                            >
                                {currentCourse.tagline}
                            </motion.span>

                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-white"
                            >
                                {currentCourse.title}
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="text-lg sm:text-xl md:text-2xl text-white mb-6 sm:mb-10"
                            >
                                {currentCourse.subtitle}
                            </motion.p>

                            {/* CTA Buttons */}
                            <motion.div
                                ref={ctaRef}
                                initial={{ opacity: 0, y: 20 }}
                                animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                transition={{ duration: 0.6, delay: 0.5 }}
                                className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 w-full sm:w-auto"
                            >
                                <Link href="/advise" passHref>
                                    <button className={`${isDarkMode ? 'bg-red-700 hover:bg-red-800' : 'bg-red-600 hover:bg-red-700'} text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-lg transition duration-300 transform hover:scale-105 flex items-center justify-center text-sm sm:text-base`}>
                                        Register Today <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                                    </button>
                                </Link>
                                <Link href="/advise" passHref>
                                    <button className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-blue-700'} font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-lg transition duration-300 hover:bg-opacity-90 text-sm sm:text-base`}>
                                        Get Free Consultation
                                    </button>
                                </Link>
                            </motion.div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Course Tabs - Sticky Navigation */}
            <div className={`sticky top-0 z-30 ${isDarkMode ? 'bg-gray-900 border-b border-gray-700' : 'bg-white border-b border-gray-200'} shadow-sm`}>
                <div className="container mx-auto px-2 sm:px-4">
                    <div className="flex overflow-x-auto hide-scrollbar py-2 sm:py-3 space-x-1 md:space-x-4 justify-start sm:justify-center">
                        {courseTabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-shrink-0 px-3 sm:px-4 py-2 text-xs sm:text-sm md:text-base font-medium rounded-lg transition-all duration-300 whitespace-nowrap ${activeTab === tab.id
                                        ? `${isDarkMode ? 'bg-blue-700 text-white' : 'bg-blue-100 text-blue-700'}`
                                        : `${isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`
                                    }`}
                            >
                                {tab.title}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className={`pb-12 sm:pb-16 md:pb-20 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}>
                <div className="container mx-auto px-4">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            variants={contentVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="pt-8 sm:pt-10 md:pt-12"
                        >
                            {/* Course Overview Section */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 mb-10 sm:mb-16">
                                <AnimatedSection>
                                    <div className="flex flex-col justify-center">
                                        <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                            Course Overview
                                        </h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                                            <AnimatedSection threshold={0.2}>
                                                <div className={`flex items-start p-4 sm:p-5 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-blue-50'}`}>
                                                    <Clock className={`w-5 h-5 sm:w-6 sm:h-6 mr-3 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                                                    <div>
                                                        <h3 className="font-semibold mb-1">Duration</h3>
                                                        <p className="text-sm sm:text-base">{currentCourse.duration.total}</p>
                                                        <p className="text-xs sm:text-sm text-gray-500">{currentCourse.duration.frequency}</p>
                                                        <p className="text-xs sm:text-sm text-gray-500">{currentCourse.duration.perSession}</p>
                                                    </div>
                                                </div>
                                            </AnimatedSection>
                                            <AnimatedSection threshold={0.2}>
                                                <div className={`flex items-start p-4 sm:p-5 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-blue-50'}`}>
                                                    <Target className={`w-5 h-5 sm:w-6 sm:h-6 mr-3 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                                                    <div>
                                                        <h3 className="font-semibold mb-1">Target Audience</h3>
                                                        <p className="text-sm sm:text-base">{currentCourse.target}</p>
                                                    </div>
                                                </div>
                                            </AnimatedSection>
                                        </div>
                                        <AnimatedSection threshold={0.3}>
                                            <div className={`p-4 sm:p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-blue-50'} mb-6 sm:mb-8`}>
                                                <h3 className="font-semibold mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
                                                    <Trophy className={`w-4 h-4 sm:w-5 sm:h-5 mr-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                                                    Teaching Methods
                                                </h3>
                                                <ul className="space-y-2 sm:space-y-3">
                                                    {currentCourse.methods.map((method, index) => (
                                                        <li key={index} className="flex items-start">
                                                            <CheckSquare className={`w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0 mt-0.5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                                                            <span className="text-sm sm:text-base">{method.text}</span>
                                                        </li>
                                                    ))}

                                                    {isExpanded && currentCourse.extendedMethods?.map((method, index) => (
                                                        <motion.li
                                                            key={index}
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ duration: 0.3, delay: index * 0.1 }}
                                                            className="flex items-start"
                                                        >
                                                            <CheckSquare className={`w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0 mt-0.5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                                                            <span className="text-sm sm:text-base">{method.text}</span>
                                                        </motion.li>
                                                    ))}
                                                </ul>
                                                {currentCourse.extendedMethods && currentCourse.extendedMethods.length > 0 && (
                                                    <button
                                                        onClick={toggleExpanded}
                                                        className={`mt-3 sm:mt-4 text-xs sm:text-sm font-medium flex items-center ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}
                                                    >
                                                        {isExpanded ? 'Show Less' : 'Show More'}
                                                        <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 ml-1 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                                                    </button>
                                                )}
                                            </div>
                                        </AnimatedSection>
                                    </div>
                                </AnimatedSection>
                                <AnimatedSection threshold={0.2}>
                                    <div className="relative">
                                        <div className={`rounded-lg overflow-hidden shadow-lg sm:shadow-xl ${isDarkMode ? 'shadow-blue-900/20' : 'shadow-blue-200'}`}>
                                            <div className="relative w-full aspect-video">
                                                <Image
                                                    src={currentCourse.contentImage}
                                                    alt="Course Content"
                                                    fill
                                                    className="object-cover"
                                                    sizes="(max-width: 768px) 100vw, 50vw"
                                                />
                                            </div>
                                        </div>
                                        {/* Stats card - Desktop/Tablet */}
                                        <motion.div
                                            initial={{ opacity: 0, x: 20, y: 20 }}
                                            animate={{ opacity: 1, x: 0, y: 0 }}
                                            transition={{ delay: 0.6, duration: 0.5 }}
                                            className={`absolute -bottom-8 md:-bottom-12 lg:-bottom-32 -right-4 md:-right-6 lg:-right-10 ${isDarkMode ? 'bg-blue-800' : 'bg-blue-600'} text-white p-3 sm:p-4 md:p-6 rounded-lg shadow-lg max-w-xs hidden md:block`}
                                        >
                                            <div className="flex items-center mb-1 sm:mb-2">
                                                <Star className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 text-yellow-300" />
                                                <span className="font-medium text-sm sm:text-base">Highly Rated Course</span>
                                            </div>
                                            <p className="text-xs sm:text-sm">Over {currentCourse.stats.students} students enrolled with {currentCourse.stats.satisfaction} satisfaction rate</p>
                                        </motion.div>

                                        {/* Stats card - Mobile only */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.6, duration: 0.5 }}
                                            className={`mt-4 ${isDarkMode ? 'bg-blue-800' : 'bg-blue-600'} text-white p-4 rounded-lg shadow-lg md:hidden`}
                                        >
                                            <div className="flex items-center mb-1">
                                                <Star className="w-4 h-4 mr-2 text-yellow-300" />
                                                <span className="font-medium text-sm">Highly Rated Course</span>
                                            </div>
                                            <p className="text-xs">Over {currentCourse.stats.students} students enrolled with {currentCourse.stats.satisfaction} satisfaction rate</p>
                                        </motion.div>
                                    </div>
                                </AnimatedSection>
                            </div>

                            {/* Learning Outcomes Section */}
                            <AnimatedSection>
                                <div className="mb-8 sm:mb-12 md:mb-16">
                                    <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 md:mb-10 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        What Will You Achieve After This Course?
                                    </h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                                        {currentCourse.goals.map((goal, index) => (
                                            <GoalItem key={index} goal={goal} index={index} isDarkMode={isDarkMode} />
                                        ))}
                                    </div>
                                </div>
                            </AnimatedSection>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default CoursesPage;