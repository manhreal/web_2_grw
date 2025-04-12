export interface Student {
    _id: string;
    image: string;
    name: string;
    achievement: string;
    description: string;
    createdAt: string;
}

export interface Partner {
    _id: string;
    image: string;
    name: string;
    createdAt: string;
}

export interface Banner {
    _id: string;
    image: string;
    name: string;
    createdAt: string;
}

export interface News {
    _id: string;
    image: string;
    title: string;
    summary: string;
    link: string;
    publishedAt: string;
    createdAt: string;
}

export interface Course {
    _id: string;
    image: string;
    title: string;
    link: string;
    createdAt: string;
}

export interface Teacher {
    _id: string;
    name: string;
    experience: string; 
    image: string;  
    graduate: string;
    achievements: string;
    createdAt: string;  
}