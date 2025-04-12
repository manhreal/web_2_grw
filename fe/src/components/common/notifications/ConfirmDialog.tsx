// components/common/notifications/ConfirmDialog.tsx
import Swal from 'sweetalert2';

interface ConfirmDialogProps {
    itemName: string;
    onConfirm: () => void;
}

export const confirmDelete = async ({ itemName, onConfirm }: ConfirmDialogProps) => {
    const result = await Swal.fire({
        title: 'Xác nhận xóa',
        text: `Bạn có chắc chắn muốn xóa "${itemName}"?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy'
    });

    if (result.isConfirmed) {
        onConfirm();
    }
};