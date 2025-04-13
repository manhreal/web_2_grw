// components/common/notifications/SuccessToast.tsx
import Swal from 'sweetalert2';

interface SuccessToastProps {
    message: string;
    type?: 'success' | 'error';
}

export const showSuccessToast = ({ message, type = 'success' }: SuccessToastProps) => {
    Swal.fire({
        position: 'top-end',
        icon: type,
        title: type === 'success' ? 'Success' : 'Error',
        text: message,
        showConfirmButton: false,
        timer: 1500,
        toast: true
    });
};