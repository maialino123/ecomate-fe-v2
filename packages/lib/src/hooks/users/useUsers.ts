import { useQuery } from '@tanstack/react-query'
import { UsersResponse } from '../../api'

interface UseUsersOptions {
    api: {
        admin: {
            getUsers: () => Promise<UsersResponse>
        }
    }
    enabled?: boolean
}

export function useUsers({ api, enabled = true }: UseUsersOptions) {
    return useQuery({
        queryKey: ['admin', 'users'],
        queryFn: () => api.admin.getUsers(),
        enabled,
        staleTime: 1000 * 30, // 30 seconds
    })
}
