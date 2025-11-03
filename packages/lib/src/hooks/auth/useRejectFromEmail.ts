import { useMutation } from '@tanstack/react-query'
import { RejectFromEmailDto, ApprovalResponse } from '../../api'

// Unused import for future feature
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { UseMutationOptions } from '@tanstack/react-query'

interface UseRejectFromEmailParams {
    api: {
        auth: {
            rejectFromEmail: (dto: RejectFromEmailDto) => Promise<ApprovalResponse>
        }
    }
    onSuccess?: (data: ApprovalResponse) => void
    onError?: (error: Error) => void
}

export function useRejectFromEmail({ api, onSuccess, onError }: UseRejectFromEmailParams) {
    return useMutation({
        mutationFn: (dto: RejectFromEmailDto) => api.auth.rejectFromEmail(dto),
        onSuccess,
        onError,
    })
}
