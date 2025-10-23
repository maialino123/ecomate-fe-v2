import { useMutation, useQueryClient } from '@tanstack/react-query'
import { RejectRegistrationDto, MessageResponse } from '../../api'
import { useNotificationStore } from '../../stores'
import { handleApiError } from '../../api/interceptors'

interface UseRejectRequestOptions {
    api: {
        admin: {
            rejectRegistrationRequest: (id: string, dto: RejectRegistrationDto) => Promise<MessageResponse>
        }
    }
    onSuccess?: (data: MessageResponse) => void
    onError?: (error: unknown) => void
}

export function useRejectRequest({ api, onSuccess, onError }: UseRejectRequestOptions) {
    const queryClient = useQueryClient()
    const { success, error: showError } = useNotificationStore()

    return useMutation({
        mutationFn: ({ id, dto }: { id: string; dto: RejectRegistrationDto }) =>
            api.admin.rejectRegistrationRequest(id, dto),
        onSuccess: data => {
            success(data.message, 'Request Rejected')
            queryClient.invalidateQueries({ queryKey: ['admin', 'registration-requests'] })
            onSuccess?.(data)
        },
        onError: error => {
            const apiError = handleApiError(error)
            showError(apiError.message, 'Rejection Failed')
            onError?.(error)
        },
    })
}
