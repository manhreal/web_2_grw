import { motion } from 'framer-motion';
import { BookOpenCheck, HandHeart, Users } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';

interface ReviewFeature {
    icon: React.ReactNode;
    title: string;
    description: string;
    image: string;
}

const Review: React.FC = () => {
    const [features] = useState<ReviewFeature[]>([
        {
            icon: <Users className="w-6 h-6 text-white" />,
            title: "PHƯƠNG PHÁP HỌC TẬP HIỆU QUẢ",
            description: "Uni EngLish Center phát triển phương pháp trang bị cho người học khả năng phản xạ toàn diện, ghi nhớ thụ động, và xây dựng tư duy ngôn ngữ.",
            image: "/images/review/t1.jpg"
        },
        {
            icon: <Users className="w-6 h-6 text-white" />,
            title: "ĐỘI NGŨ GIẢNG VIÊN CHUYÊN NGHIỆP",
            description: "Luôn định vị phong cách giảng dạy của mình là người có kinh nghiệm dày dặn và chuyên môn cao, dẫn đường chỉ lối giúp bạn đạt được chứng chỉ IELTS dễ dàng nhất. Điều đó được thể hiện rõ qua đội ngũ giảng viên có tâm và có tầm",
            image: "/images/review/t2.jpg"
        },
        {
            icon: <HandHeart className="w-6 h-6 text-white" />,
            title: "MÔI TRƯỜNG HỌC TẬP THÂN THIỆN",
            description: "Với mong muốn đem lại cho học viên một môi trường học tập thoải mái, thân thiện, chúng tôi thường xuyên ghi nhận ý kiến phản hồi để liên tục cải tiến phù hợp với nhu cầu của học viên.",
            image: "/images/review/t3.jpg"
        },
        {
            icon: <BookOpenCheck className="w-6 h-6 text-white" />,
            title: "TƯ VẤN HỌC TẬP TỐT NHẤT",
            description: "Mỗi khách hàng đều được trải nghiệm các đặc quyền của học viên Uni English Center hoàn toàn miễn phí. Sau khi tiếp xúc đội ngũ giảng viên qua các buổi học thử miễn phí, các bạn có thể đưa ra lựa chọn khách quan và phù hợp nhất.",
            image: "/images/review/t4.jpg"
        }
    ]);

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

    const getVariant = (index: number) => {
        if (index === 0) return leftCardVariants;
        if (index === 1) return centerCardVariants;
        return rightCardVariants;
    };

    return (
        <section className="pb-20">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl font-bold mb-4">
                        <span className="text-blue-600">HỌC TIẾNH ANH</span>{" "}
                        <span className="text-rose-500">DỄ DÀNG HƠN,</span>{" "}
                        <span className="text-blue-500"> NHỜ CÓ</span>
                    </h2>
                </motion.div>

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
                                {/* Image container with fixed dimensions */}
                                <div className="relative w-250 h-300 overflow-hidden">

                                    <Image
                                        src={feature.image}
                                        alt={feature.title}
                                        width={350}
                                        height={350}
                                        className="object-cover w-full"
                                        placeholder="blur"
                                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
                                    />
                                    {/* Title overlaid at the bottom of the image */}
                                    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4 z-20">
                                        <div className="flex items-center">
                                            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center mr-4">
                                                {feature.icon}
                                            </div>
                                            <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                                        </div>
                                    </div>
                                </div>

                                {/* Description that appears on hover */}
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