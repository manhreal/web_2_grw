
export interface NavItem {
    name: string;
    path: string;
    key?: string;
    children?: NavItem[];
}

export const NAV_ITEMS: NavItem[] = [
    { name: 'Home', path: '/' },
    { name: 'Course', path: '/course/course-page' },
    { name: 'Free Test', path: '/free-test' },
    { name: 'Advising', path: '/advise' },

] as const;

export function getNavItems(): NavItem[] {
    return [...NAV_ITEMS]; 
}