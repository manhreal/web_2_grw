// components/common/notifications/ConfirmDialog.tsx
import Swal from 'sweetalert2';

interface ConfirmDialogProps {
    itemName: string;
    onConfirm: () => void;
}

export const confirmDelete = async ({ itemName, onConfirm }: ConfirmDialogProps) => {
    const result = await Swal.fire({
        title: 'Confirm Delete',
        text: `Are you sure you want to delete: "${itemName}"?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
        onConfirm();
    }
};