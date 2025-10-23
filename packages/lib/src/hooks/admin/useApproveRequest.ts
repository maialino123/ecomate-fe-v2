import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ApproveRegistrationDto, MessageResponse } from '../../api'
import { useNotificationStore } from '../../stores'
import { handleApiError } from '../../api/interceptors'

interface UseApproveRequestOptions {
    api: {
        admin: {
            approveRegistrationRequest: (id: string, dto: ApproveRegistrationDto) => Promise<MessageResponse>
        }
    }
    onSuccess?: (data: MessageResponse) => void
    onError?: (error: unknown) => void
}

export function useApproveRequest({ api, onSuccess, onError }: UseApproveRequestOptions) {
    const queryClient = useQueryClient()
    const { success, error: showError } = useNotificationStore()

    return useMutation({
        mutationFn: ({ id, dto }: { id: string; dto: ApproveRegistrationDto }) =>
            api.admin.approveRegistrationRequest(id, dto),
        onSuccess: data => {
            success(data.message, 'Request Approved')
            queryClient.invalidateQueries({ queryKey: ['admin', 'registration-requests'] })
            queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
            onSuccess?.(data)
        },
        onError: error => {
            const apiError = handleApiError(error)
            showError(apiError.message, 'Approval Failed')
            onError?.(error)
        },
    })
}
