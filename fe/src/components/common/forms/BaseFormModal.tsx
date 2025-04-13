import { SERVER_URL } from '@/api/server_url';
import Swal from 'sweetalert2';

interface FormField {
    id: string;
    label: string;
    type: 'text' | 'textarea' | 'image' | 'date';
    defaultValue?: string;
    required?: boolean;
    maxLength?: number;
}

interface BaseFormModalProps {
    title: string;
    fields: FormField[];
    onSubmit: (data: Record<string, string>) => void;
    onImageUpload?: (file: File) => Promise<string>;
}

const testImageUrl = (url: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        const img = document.createElement('img');
        img.onload = () => resolve(true);
        img.onerror = () => reject(new Error('Ảnh không tồn tại'));
        img.src = url;
    });
};

export const openFormModal = async ({
    title,
    fields,
    onSubmit,
    onImageUpload
}: BaseFormModalProps): Promise<void> => {
    // Lưu trữ file ảnh tạm thời
    const tempImageFiles: Record<string, File> = {};

    const { value: formData } = await Swal.fire({
        title,
        customClass: {
            container: '!z-[99999]',
            popup: '!rounded-lg !shadow-xl !border-b !border-gray-200 !pb-3',
            confirmButton: '!bg-blue-600 !hover:bg-blue-700 !text-white !px-4 !py-2 !rounded-md',
            cancelButton: '!bg-gray-200 !hover:bg-gray-300 !text-gray-800 !px-4 !py-2 !rounded-md'
        },
        html: `
           <form id="dynamicForm" class="text-left space-y-4">
        ${fields.map(field => `
            <div class="mb-4">
                <label for="${field.id}" class="block mb-2 text-sm font-medium text-gray-700">
                    ${field.label}
                    ${field.required ? '<span class="text-red-500">*</span>' : ''}
                </label>
                ${field.type === 'textarea' ? `
                    <textarea
                        id="${field.id}"
                        class="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        ${field.required ? 'required' : ''}
                        ${field.maxLength ? `maxlength="${field.maxLength}"` : ''}
                        rows="3"
                    >${field.defaultValue || ''}</textarea>
                ` : field.type === 'image' ? `
                    <div class="flex items-center space-x-4">
                        <input
                            type="file"
                            id="${field.id}"
                            accept="image/*"
                            class="hidden"
                            ${field.required ? 'required' : ''}
                        />
                        <button
                            type="button"
                            id="${field.id}-button"
                            class="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                        >
                            Chọn ảnh
                        </button>
                        <div id="${field.id}-preview" class="flex-1">
                            ${field.defaultValue ? `
                                <img
                                    src="${field.defaultValue.startsWith('/') ? `${SERVER_URL}${field.defaultValue}` : field.defaultValue}" 
                                    alt="Preview"
                                    class="object-cover rounded-md border border-gray-200 w-full h-full"
                                    onerror="this.onerror=null;this.src='/default-image.png';"
                                />
                            ` : '<span class="text-gray-400 text-sm">Chưa có ảnh</span>'}
                        </div>
                    </div>
                ` : `
                    <input
                        id="${field.id}"
                        type="${field.type}"
                        class="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        value="${field.defaultValue || ''}"
                        ${field.required ? 'required' : ''}
                        ${field.maxLength ? `maxlength="${field.maxLength}"` : ''}
                    />
                `}
            </div>
        `).join('')}
    </form>
        `,
        focusConfirm: false,
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Hủy bỏ',
        showClass: {
            popup: 'animate__animated animate__fadeIn animate__faster'
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOut animate__faster'
        },
        didOpen: () => {
            fields.forEach(field => {
                if (field.type === 'image' && typeof window !== 'undefined') {
                    const input = document.getElementById(field.id) as HTMLInputElement;
                    const button = document.getElementById(`${field.id}-button`) as HTMLButtonElement;
                    const preview = document.getElementById(`${field.id}-preview`) as HTMLDivElement;

                    button.addEventListener('click', () => input.click());

                    input.addEventListener('change', async (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        if (!file) return;

                        try {
                            if (!file.type.startsWith('image/')) {
                                throw new Error('Chỉ chấp nhận file ảnh');
                            }
                            if (file.size > 5 * 1024 * 1024) {
                                throw new Error('Kích thước ảnh tối đa 5MB');
                            }

                            // Chỉ tạo URL preview mà không upload
                            const localPreviewUrl = URL.createObjectURL(file);

                            // Lưu file để upload sau khi submit
                            tempImageFiles[field.id] = file;

                            // Hiển thị preview
                            preview.innerHTML = `
                                <img
                                    src="${localPreviewUrl}" 
                                    alt="Preview"
                                    class="object-cover rounded-md border border-gray-200 w-full h-full"
                                />
                            `;
                        } catch (error) {
                            Swal.fire({
                                icon: 'error',
                                title: 'Lỗi',
                                text: error instanceof Error ? error.message : 'Đã xảy ra lỗi',
                                showConfirmButton: true
                            });
                            input.value = '';
                        }
                    });
                }
            });
        },
        preConfirm: async (): Promise<Record<string, string> | false> => {
            const formValues: Record<string, string> = {};
            let isValid = true;

            try {
                // Hiển thị loading khi bắt đầu xử lý
                Swal.showLoading();

                for (const field of fields) {
                    if (field.type === 'image') {
                        const preview = document.getElementById(`${field.id}-preview`) as HTMLDivElement;
                        const img = preview.querySelector('img');

                        if (field.required && !img?.src) {
                            Swal.showValidationMessage(`Vui lòng upload ${field.label}`);
                            isValid = false;
                            break;
                        }

                        // Kiểm tra xem có phải ảnh mới không
                        if (tempImageFiles[field.id]) {
                            // Upload ảnh khi form submit
                            if (onImageUpload) {
                                try {
                                    const imageUrl = await onImageUpload(tempImageFiles[field.id]);

                                    // Kiểm tra URL ảnh hợp lệ
                                    await testImageUrl(imageUrl);

                                    formValues[field.id] = imageUrl.includes(SERVER_URL)
                                        ? imageUrl.replace(SERVER_URL, '')
                                        : imageUrl;
                                } catch (error) {
                                    Swal.showValidationMessage(`Lỗi khi tải ảnh: ${error instanceof Error ? error.message : 'Đã xảy ra lỗi'}`);
                                    isValid = false;
                                    break;
                                }
                            }
                        } else if (img?.src) {
                            // Giữ lại ảnh cũ nếu có
                            formValues[field.id] = img.src.includes(SERVER_URL)
                                ? img.src.replace(SERVER_URL, '')
                                : img.src;
                        } else {
                            formValues[field.id] = '';
                        }
                    } else {
                        const element = document.getElementById(field.id) as HTMLInputElement | HTMLTextAreaElement;

                        if (field.required && !element?.value) {
                            Swal.showValidationMessage(`Vui lòng nhập ${field.label}`);
                            isValid = false;
                            break;
                        }

                        formValues[field.id] = element?.value || '';
                    }
                }

                // Ẩn loading khi hoàn thành xử lý
                Swal.hideLoading();

                return isValid ? formValues : false;
            } catch (error) {
                Swal.hideLoading();
                Swal.showValidationMessage(`Lỗi: ${error instanceof Error ? error.message : 'Đã xảy ra lỗi'}`);
                return false;
            }
        }
    });

    if (formData) {
        onSubmit(formData);
    }

    // Giải phóng bộ nhớ cho URL objects
    Object.values(tempImageFiles).forEach(file => {
        if (file instanceof File) {
            const preview = document.getElementById(`${file.name}-preview`) as HTMLDivElement;
            const img = preview?.querySelector('img');
            if (img && img.src) {
                URL.revokeObjectURL(img.src);
            }
        }
    });
};