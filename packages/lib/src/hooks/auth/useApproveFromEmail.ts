import { useMutation, UseMutationOptions } from '@tanstack/react-query'
import { ApproveFromEmailDto, ApprovalResponse } from '../../api'

interface UseApproveFromEmailParams {
    api: {
        auth: {
            approveFromEmail: (dto: ApproveFromEmailDto) => Promise<ApprovalResponse>
        }
    }
    onSuccess?: (data: ApprovalResponse) => void
    onError?: (error: Error) => void
}

export function useApproveFromEmail({ api, onSuccess, onError }: UseApproveFromEmailParams) {
    return useMutation({
        mutationFn: (dto: ApproveFromEmailDto) => api.auth.approveFromEmail(dto),
        onSuccess,
        onError,
    })
}
