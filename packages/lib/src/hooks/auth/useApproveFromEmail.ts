import { useMutation } from '@tanstack/react-query'
import { ApproveFromEmailDto, ApprovalResponse } from '../../api'

// Unused import for future feature
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { UseMutationOptions } from '@tanstack/react-query'

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
