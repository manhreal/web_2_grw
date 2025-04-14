// app/page.tsx
"use client";

import { useTheme } from '@/context/ThemeContext';
import VideoIntro from '@/components/home/VideoIntro';
import StudentSlide from '@/components/home/StudentSlide';
import TeacherSlide from '@/components/home/TeacherSlide';
import CourseSlide from '@/components/home/CourseSlide';
import NewsSlide from '@/components/home/NewsSlide';
import PartnerShowcase from '@/components/home/PartnerShowcase';
import BannerSlide from '@/components/home/BannerSlide';
import Review from '@/components/home/Review';

import ScrollToSectionButton from '@/components/navigation/ScrollToSectionButton';

export default function Home() {
  // Initialize state and refs
  const { isDarkMode } = useTheme();
  const myVideoId = 'FuPc4iPdI3U';

  return (
    <main className={`w-full flex-row overflow-hidden ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
      {/* Image Slider */}
      <section id="banner">
        <BannerSlide />
      </section>

      {/* Video Introduction */}
      <section id="video">
        <VideoIntro
          isDarkMode={isDarkMode}
          youtubeVideoId={myVideoId}
        />
      </section>

      {/* Review */}
      <section id="reviews">
        <Review />
      </section>

      {/* Teacher Slide */}
      <section id="teachers">
        <TeacherSlide />
      </section>

      {/* Course Slide */}
      <section id="courses">
        <CourseSlide />
      </section>

      {/* Student Slide */}
      <section id="students">
        <StudentSlide />
      </section>

      {/* News Slide */}
      <section id="news">
        <NewsSlide />
      </section>

      {/* Partner Showcase */}
      <section id="partners">
        <PartnerShowcase />
      </section>

      {/* Navigation Button */}
      <ScrollToSectionButton />

      {/* Add this CSS for hiding scrollbars */}
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </main>
  );
}