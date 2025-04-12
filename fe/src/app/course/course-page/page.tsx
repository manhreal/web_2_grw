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

// Content animations - Adjusted for smoother transitions
const contentVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.4 }
    },
    exit: {
        opacity: 0,
        transition: { duration: 0.2 }
    }
};

// Section animation variants - Reduced y value for mobile
const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 }
    }
};

// Interface definitions
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

// Animation wrapper component - Adjusted threshold for better mobile experience
const AnimatedSection = ({ children, threshold = 0.1 }) => {
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

// CoursesPage Component
const CoursesPage: React.FC = () => {
    const { isDarkMode } = useTheme();
    const [activeTab, setActiveTab] = useState<string>("four-skills");
    const [isExpanded, setIsExpanded] = useState<boolean>(false);

    // Method for toggling expanded content
    const toggleExpanded = (): void => {
        setIsExpanded(!isExpanded);
    };

    // Reset expanded state when changing tabs
    useEffect(() => {
        setIsExpanded(false);
    }, [activeTab]);

    // Course tabs data
    const courseTabs: CourseTab[] = [
        { id: "four-skills", title: "Tiếng Anh Mất Gốc" },
        { id: "communication", title: "Tiếng Anh Giao Tiếp" },
        { id: "toeic-450", title: "TOEIC 450+" },
        { id: "toeic-650", title: "TOEIC 650+" },
        { id: "ielts-v1", title: "IELTS 0-3.0" },
        { id: "ielts-v2", title: "IELTS 3.0-5.0" },
        { id: "ielts-v3", title: "IELTS 5.0-6.5" },
    ];

    // Course data
    const coursesData: Record<string, CourseData> = {
        "four-skills": {
            id: "four-skills",
            title: "4 SKILLS",
            subtitle: "Đặt nền móng vững chắc cho hành trình chinh phục tiếng Anh của bạn",
            tagline: "Khóa học nền tảng",
            heroImage: "/images/detail/top.jpg",
            contentImage: "/images/detail/e.jpg",
            duration: {
                total: "25 buổi (37.5 giờ)",
                frequency: "2 buổi/tuần",
                perSession: "1.5 giờ/buổi"
            },
            target: "Học viên chưa có nền tảng tiếng Anh, đang yếu cả về ngữ pháp, ngữ âm và nghe nói",
            methods: [
                { text: "Sử dụng slides kết hợp giáo trình chi tiết, nhiều hình ảnh do chính giảng viên trung tâm biên soạn" },
                { text: 'Được học và thực hành luyện tập phát âm chuẩn âm Anh-Mỹ dựa trên bảng phiên âm quốc tế IPA cùng với dàn giảng viên phát âm cực "Tây"' },
                { text: "Hệ thống toàn bộ ngữ pháp căn bản một cách tinh gọn, dễ nhớ, ứng dụng trong giao tiếp căn bản" },
                { text: "Cung cấp 500+ từ vựng theo các chủ đề cùng hình ảnh minh họa và 1000+ từ vựng thông qua các bài nghe" }
            ],
            extendedMethods: [
                { text: "Luyện tập khả năng nghe từ cơ bản đến nâng cao thông qua phương thức luyện tập đa dạng, hiệu quả, không gây nhàm chán" },
                { text: "Kết hợp 4 kĩ năng: Ngữ Âm - Ngữ Pháp - Nghe nói ứng dụng vào các chủ điểm giao tiếp căn bản" }
            ],
            goals: [
                {
                    title: "Nắm vững ngữ pháp",
                    description: 'Nắm vững tất cả hiện tượng ngữ pháp thường gặp nhất, vượt qua nỗi sợ "Mất gốc Tiếng Anh"',
                    icon: <BookOpen className="w-6 h-6 text-blue-700" />
                },
                {
                    title: "Phát âm chuẩn",
                    description: 'Xoá bỏ nỗi e dè, tạo sự tự tin trong việc phát âm "Chuẩn Tây"',
                    icon: <MessageCircle className="w-6 h-6 text-blue-700" />
                },
                {
                    title: "Vốn từ vựng phong phú",
                    description: 'Nắm vững hơn 1500 Từ vựng căn bản, không lo "bí từ" khi giao tiếp',
                    icon: <BookOpen className="w-6 h-6 text-blue-700" />
                },
                {
                    title: "Kỹ năng giao tiếp",
                    description: "Ứng dụng Nghe - Nói các chủ đề cơ bản trong cuộc sống với những mẫu câu đơn giản nhưng thực tế",
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
            subtitle: "Tự tin giao tiếp tiếng Anh trong mọi tình huống",
            tagline: "Khóa học giao tiếp",
            heroImage: "/images/detail/top1.jpg",
            contentImage: "/images/detail/e1.jpg",
            duration: {
                total: "25 buổi (37,5 giờ)",
                frequency: "2 buổi/tuần",
                perSession: "1.5 giờ/buổi"
            },
            target: "Học viên đã có nền tảng Ngữ pháp, chưa đủ kĩ năng để nói chuyện lưu loát, tự tin với người nước ngoài",
            methods: [
                {
                    text: "Thực hành giao tiếp với phòng học chuyên biệt, môi trường hiện đại, năng động đáp ứng đủ 3 tiêu chí"
                },
                {
                    text: "Casting: Nhập vai, trải nghiệm vào các tình huống thực tế trong cuộc sống hàng ngày ngay tại lớp học"
                },
                {
                    text: "Multi- sense: Hệ thống học và ghi nhớ đa giác quan, kết hợp nghe, nói và sử dụng hành động để mô tả các mẫu câu, cụm từ giúp khắc sâu vào tiềm thức một cách tự động mà không cần cố gắng ghi nhớ"
                },
                { text: "Sử dụng công nghệ AI trong việc phân tích và cải thiện kỹ năng phát âm" }
            ],
            extendedMethods: [
                {
                    text: "Short- story: Hệ thống các bài học ngắn, minigame, nghe và trả lời câu hỏi tự động với tốc độ cao rèn luyện khả năng tư duy và phản xạ bằng Tiếng Anh"
                },
                {
                    text: "4 buổi học và trải nghiệm thực tế cùng giảng viên Nước Ngoài với sự hỗ trợ của giảng viên chính và trợ giảng, tạo không khí gần gũi, thoải mái và thân thiện"
                }
            ],
            goals: [
                {
                    title: "Phát âm & phản xạ nhanh",
                    description: "Nắm vững kỹ thuật nuốt âm, nối âm và phát triển phản xạ tự nhiên khi giao tiếp thực tế.",
                    icon: <BookOpen className="w-6 h-6 text-blue-700" />
                },
                {
                    title: "Vốn từ & cấu trúc câu",
                    description: "Sở hữu 1500 từ vựng, 300 cấu trúc câu thông dụng giúp giao tiếp lưu loát và tự tin hơn.",
                    icon: <BookOpen className="w-6 h-6 text-blue-700" />
                },
                {
                    title: "Thành ngữ & tiếng lóng",
                    description: "Học và áp dụng thành ngữ, tục ngữ, tiếng lóng bắt kịp xu hướng hiện đại và phù hợp ngữ cảnh.",
                    icon: <MessageCircle className="w-6 h-6 text-blue-700" />
                },
                {
                    title: "Giao tiếp mở rộng",
                    description: "Mở rộng ý tưởng, không chỉ trả lời ngắn mà có thể trò chuyện sâu hơn trong các tình huống thực tế.",
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
            subtitle: "Chinh phục chứng chỉ TOEIC từ con số 0",
            tagline: "Khóa học TOEIC cơ bản",
            heroImage: "/images/detail/top2.jpg",
            contentImage: "/images/detail/e2.jpg",
            duration: {
                total: "25 buổi (37.5 giờ)",
                frequency: "2 buổi/tuần",
                perSession: "1.5 giờ/buổi"
            },
            target: "Học viên có nền tảng Ngữ pháp, chưa từng tiếp xúc với Đề thi TOEIC",
            methods: [
                { text: "Sở hữu các MẸO khi làm bài thi TOEIC 2 Kỹ năng: NGHE - ĐỌC" },
                { text: "Toàn bộ giáo trình luôn được giảng viên chuyên môn của trung tâm với kinh nghiệm luyện thi TOEIC nhiều năm biên soạn và cập nhật chuẩn form đề mới nhất của hội đồng IIG theo định kỳ 3 tháng/lần" },
                { text: "Học viên luôn luôn được tiếp cận với đề thi thử sát với đề TOEIC hàng tháng và trải nghiệm môi trường thi thật" },
                { text: "Trong quá trình học luôn được giám sát và đánh gía trình độ khách quan nhất với phương châm HỌC THẬT, THI THẬT" }
            ],
            extendedMethods: [
                { text: "Luyện tập định kỳ với các bài thi thử hàng tháng, giúp học viên tự đánh giá khả năng và điều chỉnh phương pháp học" },
                { text: "Kết hợp học trực tiếp và trực tuyến với hệ thống bài tập online đa dạng, giúp ôn luyện mọi lúc mọi nơi" }
            ],
            goals: [
                {
                    title: "Nắm vững cấu trúc đề thi",
                    description: "Làm quen và thành thạo với format đề thi TOEIC mới nhất của IIG Việt Nam",
                    icon: <BookOpen className="w-6 h-6 text-blue-700" />
                },
                {
                    title: "Mẹo làm bài hiệu quả",
                    description: "Sở hữu các chiến thuật và mẹo làm bài cho từng phần thi, tiết kiệm thời gian và nâng cao độ chính xác",
                    icon: <MessageCircle className="w-6 h-6 text-blue-700" />
                },
                {
                    title: "Từ vựng TOEIC chuyên sâu",
                    description: "Nắm vững 500+ từ vựng thường xuất hiện trong đề thi TOEIC, phân loại theo chủ đề",
                    icon: <BookOpen className="w-6 h-6 text-blue-700" />
                },
                {
                    title: "Cam kết đầu ra",
                    description: "Cam kết đạt từ 450-550 điểm TOEIC khi đi thi tại Hội đồng IIG Việt Nam",
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
            subtitle: "Nâng cao điểm số TOEIC đáp ứng nhu cầu công việc và học tập",
            tagline: "Khóa học TOEIC nâng cao",
            heroImage: "/images/detail/top3.jpg",
            contentImage: "/images/detail/e3.jpg",
            duration: {
                total: "25 buổi (37.5 giờ)",
                frequency: "2 buổi/tuần",
                perSession: "1.5 giờ/buổi"
            },
            target: "Học viên có mức điểm từ 450- 500 TOEIC, đã nắm bắt cấu trúc đề TOEIC 2 kỹ năng",
            methods: [
                { text: "Tổ chức những buổi giải đề và học theo lộ trình chuẩn nhất, sát nhất, NÓI KHÔNG với việc cho đề dễ hơn với đề thi thật tạo sự chủ quan cho học viên" },
                { text: "Cập nhật các thay đổi mới nhất từng quý của hội đồng thi TOEIC IIG" },
                { text: "Giảng dạy bởi đội ngũ giảng viên có kinh nghiệm nhiều năm trong lĩnh vực luyện thi TOEIC với số điểm cá nhân từ 900+" },
                { text: "Áp dụng phương pháp học tập chuyên sâu với các bài tập được thiết kế riêng cho điểm số mục tiêu 650+" }
            ],
            extendedMethods: [
                { text: "Tổ chức các buổi mock test định kỳ trong môi trường thi thật, giúp học viên làm quen với áp lực thi cử" },
                { text: "Phân tích chi tiết các lỗi sai thường gặp và đưa ra phương pháp khắc phục hiệu quả" }
            ],
            goals: [
                {
                    title: "Chiến lược làm bài nâng cao",
                    description: "Nắm vững các chiến lược phân bổ thời gian và xử lý các dạng câu hỏi khó trong đề thi",
                    icon: <BookOpen className="w-6 h-6 text-blue-700" />
                },
                {
                    title: "Từ vựng chuyên ngành",
                    description: "Mở rộng vốn từ chuyên ngành như kinh tế, nhân sự, marketing, IT thường xuất hiện trong TOEIC",
                    icon: <BookOpen className="w-6 h-6 text-blue-700" />
                },
                {
                    title: "Kỹ năng nghe nâng cao",
                    description: "Phát triển khả năng nghe với tốc độ nhanh, nhiều accent khác nhau và nội dung phức tạp",
                    icon: <MessageCircle className="w-6 h-6 text-blue-700" />
                },
                {
                    title: "Cam kết đầu ra",
                    description: "Cam kết đạt được trên 650 điểm TOEIC, sử dụng chứng chỉ phục vụ cho công việc và tương lai",
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
            subtitle: "Xây dựng nền tảng vững chắc cho hành trình chinh phục IELTS",
            tagline: "Khóa học IELTS cơ bản",
            heroImage: "/images/detail/top4.jpg",
            contentImage: "/images/detail/e4.jpg",
            duration: {
                total: "25 buổi (37.5 giờ)",
                frequency: "2 buổi/tuần",
                perSession: "1.5 giờ/buổi"
            },
            target: "Học viên có nền tảng ngữ pháp và Nghe-Nói, chưa từng tiếp xúc với chứng chỉ IELTS",
            methods: [
                { text: "Nắm vững cấu trúc đề thi IELTS" },
                { text: "Làm quen với những dạng đề trong đề thi IELTS Reading & Listening" },
                { text: "Nắm vững trọng tâm SPEAKING Part 1 với phương pháp phát triển ý kết hợp vận dụng từ vựng và giới thiệu sơ lược Part 2" },
                { text: "Ôn tập, củng cố chủ điểm ngữ pháp quan trọng cho phần thi IELTS WRITING" }
            ],
            extendedMethods: [
                { text: "Thực hành kĩ năng viết đi từ các mệnh đề, câu đơn câu phức nâng cao tới hoàn thành 1 đoạn văn học thuật" },
                { text: "Làm chủ những kiến thức sơ lược nhất về kì thi IELTS, làm bước đệm nâng lên những band điểm cao hơn" }
            ],
            goals: [
                {
                    title: "Cấu trúc ngữ pháp",
                    description: "Học chuyên sâu các cấu trúc ngữ pháp từ dễ đến khó và luyện tập thường xuyên để biết cách vận dụng nhuần nhuyễn",
                    icon: <BookOpen className="w-6 h-6 text-blue-700" />
                },
                {
                    title: "Từ vựng học thuật",
                    description: "Mở rộng vốn từ Academic căn bản nhất, thường xuất hiện trong bài thi IELTS",
                    icon: <BookOpen className="w-6 h-6 text-blue-700" />
                },
                {
                    title: "Làm quen format đề thi",
                    description: "Xây dựng nền tảng của cả 4 kỹ năng trong kỳ thi IELTS dựa trên việc tiếp xúc với đề thi thật",
                    icon: <FileText className="w-6 h-6 text-blue-700" />
                },
                {
                    title: "Kỹ năng làm bài cơ bản",
                    description: "Nắm vững các kỹ thuật làm bài thi IELTS ở mức cơ bản, tạo nền tảng cho các khóa học nâng cao",
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
            subtitle: "Nâng cao trình độ IELTS với phương pháp học tập toàn diện",
            tagline: "Khóa học IELTS trung cấp",
            heroImage: "/images/detail/top5.jpg",
            contentImage: "/images/detail/e5.jpg",
            duration: {
                total: "35 buổi (52.5 giờ)",
                frequency: "2 buổi/tuần",
                perSession: "1.5 giờ/buổi"
            },
            target: "Học viên có điểm thi IELTS ít nhất 3.0 hoặc đã hoàn thành khoá học IELTS Preparation",
            methods: [
                { text: "4 kĩ năng Nghe-Nói-Đọc-Viết được luyện tập đan xen 1-2 kĩ năng/buổi học tạo cảm giác thoải mái, không gây áp lực" },
                { text: "Speaking: Đưa ra từ vựng và cách paraphrase cùng form trả lời để câu trả lời hay và đạt band điểm cao trong phần thi Nói part 1" },
                { text: "Học cách phân bổ thời gian nói cho từng đoạn trong Part 2 áp dụng cho các chủ đề nói căn bản của đề thi IELTS" },
                { text: "Luôn đưa tới tay học viên những chủ đề và các dạng câu hỏi thường gặp và mới nhất sẽ ra trong kì thi IELTS cập nhật hàng quý" }
            ],
            extendedMethods: [
                { text: "Listening + Reading: Tiếp cận và luyện tập các dạng câu hỏi kinh điển trong đề thi (T/F/NG, Form completion, Matching Heading,..) và mẹo làm bài tập" },
                { text: "Writing: Áp dụng ngữ pháp và nâng cao để hoàn thành đoạn văn hoàn chỉnh sử dụng những từ ngữ chuyên ngành, đa dạng để 'ăn điểm' tuyệt đối, xoá bỏ nỗi lo sợ phần thi khó nhất trong kì thi IELTS" }
            ],
            goals: [
                {
                    title: "Kỹ năng Speaking chuyên sâu",
                    description: "Nắm vững các phương pháp trả lời và ôn luyện kĩ năng nói đạt band 5.0",
                    icon: <MessageCircle className="w-6 h-6 text-blue-700" />
                },
                {
                    title: "Chiến lược Reading & Listening",
                    description: "Thành thạo các dạng câu hỏi kinh điển và mẹo làm bài hiệu quả trong thời gian giới hạn",
                    icon: <BookOpen className="w-6 h-6 text-blue-700" />
                },
                {
                    title: "Kỹ năng Writing đa dạng",
                    description: "Phát triển khả năng viết với từ vựng học thuật và cấu trúc câu đa dạng",
                    icon: <FileText className="w-6 h-6 text-blue-700" />
                },
                {
                    title: "Cam kết đầu ra",
                    description: "CAM KẾT ĐẦU RA 5.0+ sau khi hoàn thành khóa học",
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
            title: "IELTS 5.0-6.5",
            subtitle: "Chinh phục band điểm IELTS cao với phương pháp chuyên sâu",
            tagline: "Khóa học IELTS cao cấp",
            heroImage: "/images/detail/top6.jpg",
            contentImage: "/images/detail/top6.jpg",
            duration: {
                total: "35 buổi (52.5 giờ)",
                frequency: "2 buổi/tuần",
                perSession: "1.5 giờ/buổi"
            },
            target: "Học viên có điểm thi IELTS ít nhất 5.0 hoặc đã hoàn thành khoá học IELTS Intermediate",
            methods: [
                { text: "Tập trung giải các đề thi IELTS với cường độ cao, hoàn tất các kĩ năng để sẵn sàng làm bài thi IELTS tại các hội đồng quốc tế BC, IDP" },
                { text: "Các bài giảng sử dụng slide và giáo trình chuyên sâu do giảng viên IELTS dày kinh nghiệm (8.5 IELTS) biên soạn và cập nhật các dạng đề mới nhất" },
                { text: "Liên kết với IDP hỗ trợ đăng kí thi trên máy tính và làm thủ tục thi tại hội đồng" },
                { text: "Áp dụng các kỹ thuật nâng cao cho từng phần thi, đặc biệt là các chiến lược cho Speaking và Writing" }
            ],
            extendedMethods: [
                { text: "Thực hành thường xuyên với các bài thi thử đúng format và thời gian, được đánh giá và phản hồi chi tiết từ giảng viên" },
                { text: "Cung cấp các tài liệu bổ trợ chuyên sâu và các bài mẫu được đánh giá cao từ 7.0+ cho học viên tham khảo" }
            ],
            goals: [
                {
                    title: "Speaking & Writing nâng cao",
                    description: "Phát triển kỹ năng trình bày ý kiến một cách logic, thuyết phục với từ vựng học thuật đa dạng và cấu trúc phức tạp",
                    icon: <MessageCircle className="w-6 h-6 text-blue-700" />
                },
                {
                    title: "Chiến lược làm bài chuyên sâu",
                    description: "Nắm vững các chiến lược làm bài hiệu quả cho từng dạng câu hỏi, đặc biệt là các dạng khó trong Reading và Listening",
                    icon: <BookOpen className="w-6 h-6 text-blue-700" />
                },
                {
                    title: "Từ vựng & ngữ pháp học thuật",
                    description: "Mở rộng vốn từ vựng học thuật và các cấu trúc ngữ pháp phức tạp giúp nâng band điểm Writing và Speaking",
                    icon: <FileText className="w-6 h-6 text-blue-700" />
                },
                {
                    title: "Cam kết đầu ra",
                    description: "CAM KẾT ĐẦU RA 6.5+, luôn tự hào mang về nhiều chứng chỉ vượt chỉ tiêu khoá học (7.0-7.5) của học viên",
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

    // Intersection observers for CTA buttons - Adjusted threshold for mobile
    const [ctaRef, ctaInView] = useInView({
        triggerOnce: true,
        threshold: 0.2,
        delay: 300
    });

    // Intersection observer for hero content - Lower threshold for better mobile experience
    const [heroRef, heroInView] = useInView({
        triggerOnce: true,
        threshold: 0.05
    });

    // Tạo một component riêng cho Goal Item - Improved with smaller animation values for mobile
    const GoalItem = ({ goal, index, isDarkMode }: { goal: GoalItem; index: number; isDarkMode: boolean }) => {
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

    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-b from-gray-900 to-gray-800' : 'bg-gradient-to-b from-blue-50 to-white'}`}>
            {/* Hero Section - Improved responsive spacing */}
            <div className="relative overflow-hidden">
                {/* Background Image */}
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
                            <motion.div
                                ref={ctaRef}
                                initial={{ opacity: 0, y: 20 }}
                                animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                transition={{ duration: 0.6, delay: 0.5 }}
                                className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 w-full sm:w-auto"
                            >
                                <Link href="/advise" passHref>
                                    <button className={`${isDarkMode ? 'bg-red-700 hover:bg-red-800' : 'bg-red-600 hover:bg-red-700'} text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-lg transition duration-300 transform hover:scale-105 flex items-center justify-center text-sm sm:text-base`}>
                                        Đăng ký ngay hôm nay <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                                    </button>
                                </Link>
                                <Link href="/advise" passHref>
                                    <button className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-blue-700'} font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-lg transition duration-300 hover:bg-opacity-90 text-sm sm:text-base`}>
                                        Nhận tư vấn miễn phí
                                    </button>
                                </Link>
                            </motion.div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Course Tabs - Improved scroll experience on mobile */}
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

            {/* Main Content - Improved spacing for mobile */}
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
                            {/* Course Overview Section - Improved grid layout for mobile */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 mb-10 sm:mb-16">
                                <AnimatedSection>
                                    <div className="flex flex-col justify-center">
                                        <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                            Tổng quan về khóa học
                                        </h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                                            <AnimatedSection threshold={0.2}>
                                                <div className={`flex items-start p-4 sm:p-5 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-blue-50'}`}>
                                                    <Clock className={`w-5 h-5 sm:w-6 sm:h-6 mr-3 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                                                    <div>
                                                        <h3 className="font-semibold mb-1">Thời lượng</h3>
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
                                                        <h3 className="font-semibold mb-1">Đối tượng</h3>
                                                        <p className="text-sm sm:text-base">{currentCourse.target}</p>
                                                    </div>
                                                </div>
                                            </AnimatedSection>
                                        </div>
                                        <AnimatedSection threshold={0.3}>
                                            <div className={`p-4 sm:p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-blue-50'} mb-6 sm:mb-8`}>
                                                <h3 className="font-semibold mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
                                                    <Trophy className={`w-4 h-4 sm:w-5 sm:h-5 mr-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                                                    Phương pháp giảng dạy
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
                                                        {isExpanded ? 'Thu gọn' : 'Xem thêm'}
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
                                        {/* Stats card - Hidden on mobile, visible on tablet and above */}
                                        <motion.div
                                            initial={{ opacity: 0, x: 20, y: 20 }}
                                            animate={{ opacity: 1, x: 0, y: 0 }}
                                            transition={{ delay: 0.6, duration: 0.5 }}
                                            className={`absolute -bottom-8 md:-bottom-12 lg:-bottom-32 -right-4 md:-right-6 lg:-right-10 ${isDarkMode ? 'bg-blue-800' : 'bg-blue-600'} text-white p-3 sm:p-4 md:p-6 rounded-lg shadow-lg max-w-xs hidden md:block`}
                                        >
                                            <div className="flex items-center mb-1 sm:mb-2">
                                                <Star className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 text-yellow-300" />
                                                <span className="font-medium text-sm sm:text-base">Khóa học được đánh giá cao</span>
                                            </div>
                                            <p className="text-xs sm:text-sm">Hơn {currentCourse.stats.students} học viên đã tham gia với tỷ lệ hài lòng {currentCourse.stats.satisfaction}</p>
                                        </motion.div>

                                        {/* Mobile stats card - Only visible on mobile */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.6, duration: 0.5 }}
                                            className={`mt-4 ${isDarkMode ? 'bg-blue-800' : 'bg-blue-600'} text-white p-4 rounded-lg shadow-lg md:hidden`}
                                        >
                                            <div className="flex items-center mb-1">
                                                <Star className="w-4 h-4 mr-2 text-yellow-300" />
                                                <span className="font-medium text-sm">Khóa học được đánh giá cao</span>
                                            </div>
                                            <p className="text-xs">Hơn {currentCourse.stats.students} học viên đã tham gia với tỷ lệ hài lòng {currentCourse.stats.satisfaction}</p>
                                        </motion.div>
                                    </div>
                                </AnimatedSection>
                            </div>

                            {/* Goals Section - Improved grid for mobile */}
                            <AnimatedSection>
                                <div className="mb-8 sm:mb-12 md:mb-16">
                                    <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 md:mb-10 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        Bạn sẽ đạt được gì sau khóa học?
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