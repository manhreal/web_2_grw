'use client';

import { useState, useEffect, useCallback } from 'react';
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
import AdminGuard from '@/components/AdminGuard';

// Main component for managing home page content
export default function HomeManager() {
    // State declarations
    const [students, setStudents] = useState([]);
    const [partners, setPartners] = useState([]);
    const [news, setNews] = useState([]);
    const [courses, setCourses] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('students');

    // Tab definitions for better maintainability
    const tabs = [
        { id: 'students', label: 'Students', icon: Users },
        { id: 'partners', label: 'Partners', icon: Building },
        { id: 'news', label: 'News', icon: Newspaper },
        { id: 'courses', label: 'Courses', icon: Book },
        { id: 'teachers', label: 'Teachers', icon: Users },
        { id: 'banners', label: 'Banners', icon: Book }
    ];

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
            } catch (err) {
                setError('An error occurred while loading data');
                console.error('Error fetching data:', err);
                // Reset all data to empty arrays
                setStudents([]);
                setPartners([]);
                setNews([]);
                setCourses([]);
                setTeachers([]);
                setBanners([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Tab change handler with memoization
    const handleTabChange = useCallback((tabId) => {
        setActiveTab(tabId);
    }, []);

    // Loading state render
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-4">Loading data...</p>
                </div>
            </div>
        );
    }

    // Error state render
    if (error) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center text-red-500">
                    <AlertCircle size={48} className="mx-auto mb-4" />
                    <p>{error}</p>
                    <button
                        className="mt-4 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                        onClick={() => window.location.reload()}
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // Main render with tabs and content
    return (
        <AdminGuard>
            <div className="container mx-auto py-8 px-4">
                <h1 className="text-3xl font-bold mb-8">Home Page Management</h1>

                {/* Tab Navigation */}
                <div className="flex border-b mb-6 overflow-x-auto">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            className={`px-4 py-2 flex items-center whitespace-nowrap ${activeTab === tab.id
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-500'
                                }`}
                            onClick={() => handleTabChange(tab.id)}
                        >
                            <tab.icon className="mr-2 h-4 w-4" /> {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content based on active tab */}
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