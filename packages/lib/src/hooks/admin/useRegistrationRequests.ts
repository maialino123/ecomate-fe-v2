import { useQuery } from '@tanstack/react-query'
import { RegistrationRequestsResponse } from '../../api'

interface UseRegistrationRequestsOptions {
    api: {
        admin: {
            getRegistrationRequests: () => Promise<RegistrationRequestsResponse>
        }
    }
    enabled?: boolean
}

export function useRegistrationRequests({ api, enabled = true }: UseRegistrationRequestsOptions) {
    return useQuery({
        queryKey: ['admin', 'registration-requests'],
        queryFn: () => api.admin.getRegistrationRequests(),
        enabled,
        staleTime: 1000 * 30, // 30 seconds
    })
}
