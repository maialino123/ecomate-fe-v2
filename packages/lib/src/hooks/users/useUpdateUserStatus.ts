import { useMutation, useQueryClient } from '@tanstack/react-query'
import { UpdateUserStatusDto, MessageResponse } from '../../api'
import { useNotificationStore } from '../../stores'
import { handleApiError } from '../../api/interceptors'

interface UseUpdateUserStatusOptions {
    api: {
        admin: {
            updateUserStatus: (id: string, dto: UpdateUserStatusDto) => Promise<MessageResponse>
        }
    }
    onSuccess?: (data: MessageResponse) => void
    onError?: (error: unknown) => void
}

export function useUpdateUserStatus({ api, onSuccess, onError }: UseUpdateUserStatusOptions) {
    const queryClient = useQueryClient()
    const { success, error: showError } = useNotificationStore()

    return useMutation({
        mutationFn: ({ id, dto }: { id: string; dto: UpdateUserStatusDto }) => api.admin.updateUserStatus(id, dto),
        onSuccess: data => {
            success(data.message, 'Status Updated')
            queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
            onSuccess?.(data)
        },
        onError: error => {
            const apiError = handleApiError(error)
            showError(apiError.message, 'Update Failed')
            onError?.(error)
        },
    })
}
