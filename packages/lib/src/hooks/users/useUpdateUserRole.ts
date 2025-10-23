import { useMutation, useQueryClient } from '@tanstack/react-query'
import { UpdateUserRoleDto, MessageResponse } from '../../api'
import { useNotificationStore } from '../../stores'
import { handleApiError } from '../../api/interceptors'

interface UseUpdateUserRoleOptions {
    api: {
        admin: {
            updateUserRole: (id: string, dto: UpdateUserRoleDto) => Promise<MessageResponse>
        }
    }
    onSuccess?: (data: MessageResponse) => void
    onError?: (error: unknown) => void
}

export function useUpdateUserRole({ api, onSuccess, onError }: UseUpdateUserRoleOptions) {
    const queryClient = useQueryClient()
    const { success, error: showError } = useNotificationStore()

    return useMutation({
        mutationFn: ({ id, dto }: { id: string; dto: UpdateUserRoleDto }) => api.admin.updateUserRole(id, dto),
        onSuccess: data => {
            success(data.message, 'Role Updated')
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
