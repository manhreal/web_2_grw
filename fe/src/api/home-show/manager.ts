import { SERVER_URL } from "../server_url";

// Helper function for consistent headers
const getRequestHeaders = () => {
    return {
        'Content-Type': 'application/json'
    };
};

// Generic image upload function
export const uploadImage = async (file: File, entityType: 'students' | 'partners' | 'news' | 'courses' | 'teachers' | 'banners') => {
    try {
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch(`${SERVER_URL}/${entityType}/upload`, {
            method: 'POST',
            body: formData,
            credentials: 'include'
        });

        if (response.status === 401 || response.status === 403) {
            throw new Error('Unauthorized access. Please log in again.');
        }

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Upload failed');
        }

        return {
            ...result,
            fullImageUrl: `${SERVER_URL}${result.imageUrl}`
        };
    } catch (error) {
        console.error(`Error uploading ${entityType} image:`, error);
        throw error;
    }
};

// Use the generic function for specific entity types
export const uploadStudentImage = (file: File) => uploadImage(file, 'students');
export const uploadPartnerImage = (file: File) => uploadImage(file, 'partners');
export const uploadNewImage = (file: File) => uploadImage(file, 'news');
export const uploadCourseImage = (file: File) => uploadImage(file, 'courses');
export const uploadTeacherImage = (file: File) => uploadImage(file, 'teachers');
export const uploadBannerImage = (file: File) => uploadImage(file, 'banners');

// Generic CRUD functions
export const createEntity = async (entityType: string, entityData: unknown) => {
    try {
        const response = await fetch(`${SERVER_URL}/${entityType}`, {
            method: 'POST',
            headers: getRequestHeaders(),
            body: JSON.stringify(entityData),
            credentials: 'include'
        });

        if (response.status === 401 || response.status === 403) {
            console.log('Unauthorized access');
            throw new Error('Unauthorized access. Please log in again.');
        }

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Cannot create ${entityType}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error creating ${entityType}:`, error);
        throw error;
    }
};

export const updateEntity = async (entityType: string, id: string, entityData: unknown) => {
    try {
        const response = await fetch(`${SERVER_URL}/${entityType}/${id}`, {
            method: 'PUT',
            headers: getRequestHeaders(),
            body: JSON.stringify(entityData),
            credentials: 'include'
        });

        if (response.status === 401 || response.status === 403) {
            console.log('Unauthorized access');
            throw new Error('Unauthorized access. Please log in again.');
        }

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Cannot update ${entityType} with ID: ${id}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error updating ${entityType} ${id}:`, error);
        throw error;
    }
};

export const deleteEntity = async (entityType: string, id: string) => {
    try {
        const response = await fetch(`${SERVER_URL}/${entityType}/${id}`, {
            method: 'DELETE',
            headers: getRequestHeaders(),
            credentials: 'include'
        });

        if (response.status === 401 || response.status === 403) {
            console.log('Unauthorized access');
            throw new Error('Unauthorized access. Please log in again.');
        }

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Cannot delete ${entityType} with ID: ${id}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error deleting ${entityType} ${id}:`, error);
        throw error;
    }
};

// Student API
export const createStudent = (studentData: unknown) => createEntity('students', studentData);
export const updateStudent = (id: string, studentData: unknown) => updateEntity('students', id, studentData);
export const deleteStudent = (id: string) => deleteEntity('students', id);

// Partner API
export const createPartner = (partnerData: unknown) => createEntity('partners', partnerData);
export const updatePartner = (id: string, partnerData: unknown) => updateEntity('partners', id, partnerData);
export const deletePartner = (id: string) => deleteEntity('partners', id);

// News API
export const createNews = (newsData: unknown) => createEntity('news', newsData);
export const updateNews = (id: string, newsData: unknown) => updateEntity('news', id, newsData);
export const deleteNews = (id: string) => deleteEntity('news', id);

// Course API
export const createCourse = (courseData: unknown) => createEntity('courses', courseData);
export const updateCourse = (id: string, courseData: unknown) => updateEntity('courses', id, courseData);
export const deleteCourse = (id: string) => deleteEntity('courses', id);

// Teacher API
export const createTeacher = (teacherData: unknown) => createEntity('teachers', teacherData);
export const updateTeacher = (id: string, teacherData: unknown) => updateEntity('teachers', id, teacherData);
export const deleteTeacher = (id: string) => deleteEntity('teachers', id);

// Banner API
export const createBanner = (bannerData: unknown) => createEntity('banners', bannerData);
export const updateBanner = (id: string, bannerData: unknown) => updateEntity('banners', id, bannerData);
export const deleteBanner = (id: string) => deleteEntity('banners', id);