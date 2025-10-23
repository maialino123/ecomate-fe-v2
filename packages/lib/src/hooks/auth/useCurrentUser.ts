import { useQuery } from '@tanstack/react-query'
import { MeResponse } from '../../api'
import { useAuthStore } from '../../stores'

interface UseCurrentUserOptions {
    api: {
        auth: {
            me: () => Promise<MeResponse>
        }
    }
    enabled?: boolean
}

export function useCurrentUser({ api, enabled = true }: UseCurrentUserOptions) {
    const { isAuthenticated, setUser } = useAuthStore()

    return useQuery({
        queryKey: ['auth', 'me'],
        queryFn: async () => {
            const data = await api.auth.me()
            setUser(data.user)
            return data
        },
        enabled: enabled && isAuthenticated,
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 1,
    })
}
