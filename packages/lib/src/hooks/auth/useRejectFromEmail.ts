import { useMutation, UseMutationOptions } from '@tanstack/react-query'
import { RejectFromEmailDto, ApprovalResponse } from '../../api'

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
