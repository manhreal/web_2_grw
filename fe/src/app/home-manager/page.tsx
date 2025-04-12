'use client';

import { useState, useEffect } from 'react';
import {
    getStudents,
    getPartners,
    getAllNews,
    getCourses,
    getTeachers,
    getBanners,
} from '../../api/home-show/view';
import { AlertCircle, Users, Building, Newspaper, Book } from 'lucide-react';
import StudentManager from '../../components/home-manager/StudentManager';
import PartnerManager from '../../components/home-manager/PartnerManager';
import NewsManager from '../../components/home-manager/NewsManager';
import CourseManager from '../../components/home-manager/CourseManager';
import TeacherManager from '@/components/home-manager/TeacherManager';
import BannerManager from '@/components/home-manager/BannerManager';
import { Student, Partner, News, Course, Teacher, Banner } from '../../components/home-manager/types';
import AdminGuard from '@/components/AdminGuard';

export default function HomeManager() {
    // State for each data type
    const [students, setStudents] = useState<Student[]>([]);
    const [partners, setPartners] = useState<Partner[]>([]);
    const [news, setNews] = useState<News[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('students');

    // Load all data when the component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [studentsRes, partnersRes, newsRes, coursesRes, teachersRes, bannersRes] = await Promise.all([
                    getStudents().then(res => res?.data || []),
                    getPartners().then(res => res?.data || []),
                    getAllNews().then(res => res?.data || []),
                    getCourses().then(res => res?.data || []),
                    getTeachers().then(res => res?.data || []),
                    getBanners().then(res => res?.data || []),
                ]);

                setStudents(studentsRes);
                setPartners(partnersRes);
                setNews(newsRes);
                setCourses(coursesRes);
                setTeachers(teachersRes);
                setBanners(bannersRes);
                setLoading(false);
            } catch (err) {
                setError('Đã xảy ra lỗi khi tải dữ liệu');
                setLoading(false);
                console.error('Error fetching data:', err);
                setStudents([]);
                setPartners([]);
                setNews([]);
                setCourses([]);
                setTeachers([]);
                setBanners([]);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-4">Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center text-red-500">
                    <AlertCircle size={48} className="mx-auto mb-4" />
                    <p>{error}</p>
                    <button className="mt-4 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100" onClick={() => window.location.reload()}>
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <AdminGuard>
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-8">Quản lý trang chủ</h1>

            {/* Custom Tab Navigation */}
            <div className="flex border-b mb-6">
                <button
                    className={`px-4 py-2 flex items-center ${activeTab === 'students' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('students')}
                >
                    <Users className="mr-2 h-4 w-4" /> Học viên
                </button>
                <button
                    className={`px-4 py-2 flex items-center ${activeTab === 'partners' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('partners')}
                >
                    <Building className="mr-2 h-4 w-4" /> Đối tác
                </button>
                <button
                    className={`px-4 py-2 flex items-center ${activeTab === 'news' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('news')}
                >
                    <Newspaper className="mr-2 h-4 w-4" /> Tin tức
                </button>
                <button
                    className={`px-4 py-2 flex items-center ${activeTab === 'courses' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('courses')}
                >
                    <Book className="mr-2 h-4 w-4" /> Khóa học
                </button>
                <button
                    className={`px-4 py-2 flex items-center ${activeTab === 'teachers' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('teachers')}
                >
                <Users className="mr-2 h-4 w-4" /> Giảng viên
                </button>
                <button
                    className={`px-4 py-2 flex items-center ${activeTab === 'banners' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('banners')}
                >
                    <Book className="mr-2 h-4 w-4" /> Banner
                    </button>
                    
            </div>

            {/* Render active tab content */}
            {activeTab === 'students' && (
                <StudentManager students={students} setStudents={setStudents} />
            )}

            {activeTab === 'partners' && (
                <PartnerManager partners={partners} setPartners={setPartners} />
            )}

            {activeTab === 'news' && (
                <NewsManager news={news} setNews={setNews} />
            )}

            {activeTab === 'courses' && (
                <CourseManager courses={courses} setCourses={setCourses} />
            )}

            {activeTab === 'teachers' && (
                <TeacherManager teachers={teachers} setTeachers={setTeachers} />
            )}

            {activeTab === 'banners' && (
                <BannerManager banners={banners} setBanners={setBanners} />
            )}
            </div>
        </AdminGuard>
    );
}