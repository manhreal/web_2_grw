
export interface NavItem {
    name: string;
    path: string;
    key?: string;
    children?: NavItem[];
}

export const NAV_ITEMS: NavItem[] = [
    { name: 'Trang chủ', path: '/' },
    { name: 'Khóa học', path: '/course/course-page' },
    { name: 'Test miễn phí', path: '/free-test' },
    { name: 'Tư vấn', path: '/advise' },

] as const;

export function getNavItems(): NavItem[] {
    return [...NAV_ITEMS]; 
}