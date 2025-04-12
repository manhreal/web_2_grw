import { SERVER_URL } from "../server_url";

// Generic GET functions
export const getEntities = async (entityType: string) => {
    try {
        const response = await fetch(`${SERVER_URL}/${entityType}`);
        if (!response.ok) {
            throw new Error(`Cannot fetch ${entityType}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching ${entityType}:`, error);
        throw error;
    }
};

export const getEntityById = async (entityType: string, id: string) => {
    try {
        const response = await fetch(`${SERVER_URL}/${entityType}/${id}`);
        if (!response.ok) {
            throw new Error(`Cannot fetch ${entityType} with ID: ${id}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching ${entityType} ${id}:`, error);
        throw error;
    }
};

// Student API (GET)
export const getStudents = () => getEntities('students');
export const getStudentById = (id: string) => getEntityById('students', id);

// Partner API (GET)
export const getPartners = () => getEntities('partners');
export const getPartnerById = (id: string) => getEntityById('partners', id);

// News API (GET)
export const getAllNews = () => getEntities('news');
export const getNewsById = (id: string) => getEntityById('news', id);

// Course API (GET)
export const getCourses = () => getEntities('courses');
export const getCourseById = (id: string) => getEntityById('courses', id);

// Teacher API (GET)
export const getTeachers = () => getEntities('teachers');
export const getTeacherById = (id: string) => getEntityById('teachers', id);

// Banner API (GET)
export const getBanners = () => getEntities('banners');
export const getBannerById = (id: string) => getEntityById('banners', id);