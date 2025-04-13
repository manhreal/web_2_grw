import { motion } from 'framer-motion';
import { BookOpenCheck, HandHeart, Users } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';

// Type definition for feature items
interface ReviewFeature {
    icon: React.ReactNode;
    title: string;
    description: string;
    image: string;
}

const Review: React.FC = () => {
    // Feature data with English translations
    const [features] = useState<ReviewFeature[]>([
        {
            icon: <Users className="w-6 h-6 text-white" />,
            title: "EFFECTIVE LEARNING METHODOLOGY",
            description: "Uni English Center develops methods that equip learners with comprehensive reflexes, passive memory, and language thinking skills.",
            image: "/images/review/t1.jpg"
        },
        {
            icon: <Users className="w-6 h-6 text-white" />,
            title: "PROFESSIONAL TEACHING STAFF",
            description: "Our teaching style is defined by experienced and highly qualified instructors who guide you to achieve IELTS certification in the easiest way possible. This is clearly demonstrated through our dedicated and talented teaching team.",
            image: "/images/review/t2.jpg"
        },
        {
            icon: <HandHeart className="w-6 h-6 text-white" />,
            title: "FRIENDLY LEARNING ENVIRONMENT",
            description: "With the desire to provide students with a comfortable and friendly learning environment, we regularly collect feedback to continuously improve and meet the needs of our students.",
            image: "/images/review/t3.jpg"
        },
        {
            icon: <BookOpenCheck className="w-6 h-6 text-white" />,
            title: "BEST LEARNING CONSULTATION",
            description: "Every customer experiences the privileges of being a Uni English Center student completely free of charge. After interacting with our teaching staff through free trial classes, you can make objective and appropriate choices.",
            image: "/images/review/t4.jpg"
        }
    ]);

    // Animation variants
    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.3
            }
        }
    };

    const leftCardVariants = {
        hidden: { opacity: 0, x: -100 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.7 } }
    };

    const centerCardVariants = {
        hidden: { opacity: 0, y: 100 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.7 } }
    };

    const rightCardVariants = {
        hidden: { opacity: 0, x: 100 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.7 } }
    };

    // Helper function to determine animation variant based on index
    const getVariant = (index: number) => {
        if (index === 0) return leftCardVariants;
        if (index === 1) return centerCardVariants;
        return rightCardVariants;
    };

    return (
        <section className="pb-20">
            <div className="container mx-auto px-4">
                {/* Title section with animation */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl font-bold mb-4">
                        <span className="text-blue-600">LEARN ENGLISH</span>{" "}
                        <span className="text-rose-500">MORE EASILY,</span>{" "}
                        <span className="text-blue-500">WITH US</span>
                    </h2>
                </motion.div>

                {/* Features grid with staggered animations */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10"
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            variants={getVariant(index)}
                            className="relative overflow-hidden group rounded-lg shadow-lg"
                        >
                            <div className="relative w-full h-full">
                                {/* Feature image with fixed dimensions */}
                                <div className="relative w-full h-80 overflow-hidden">
                                    <Image
                                        src={feature.image}
                                        alt={feature.title}
                                        width={350}
                                        height={350}
                                        className="object-cover w-full h-full"
                                        placeholder="blur"
                                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
                                    />
                                    {/* Title overlay at the bottom of the image */}
                                    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4 z-20">
                                        <div className="flex items-center">
                                            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center mr-4">
                                                {feature.icon}
                                            </div>
                                            <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                                        </div>
                                    </div>
                                </div>

                                {/* Description overlay that appears on hover */}
                                <motion.div
                                    className="absolute bottom-0 left-0 w-full bg-blue-600 text-white p-6 transform translate-y-full transition-transform duration-300 group-hover:translate-y-0 z-30"
                                    initial={false}
                                >
                                    <p className="text-lg">{feature.description}</p>
                                </motion.div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Review;