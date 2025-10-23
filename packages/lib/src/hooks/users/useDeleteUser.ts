import { useMutation, useQueryClient } from '@tanstack/react-query'
import { MessageResponse } from '../../api'
import { useNotificationStore } from '../../stores'
import { handleApiError } from '../../api/interceptors'

interface UseDeleteUserOptions {
    api: {
        admin: {
            deleteUser: (id: string) => Promise<MessageResponse>
        }
    }
    onSuccess?: (data: MessageResponse) => void
    onError?: (error: unknown) => void
}

export function useDeleteUser({ api, onSuccess, onError }: UseDeleteUserOptions) {
    const queryClient = useQueryClient()
    const { success, error: showError } = useNotificationStore()

    return useMutation({
        mutationFn: (id: string) => api.admin.deleteUser(id),
        onSuccess: data => {
            success(data.message, 'User Deleted')
            queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
            onSuccess?.(data)
        },
        onError: error => {
            const apiError = handleApiError(error)
            showError(apiError.message, 'Delete Failed')
            onError?.(error)
        },
    })
}
