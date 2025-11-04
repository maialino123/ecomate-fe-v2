import { useQuery } from '@tanstack/react-query'
import { VideoStatusResponse } from '../../api/sdk/video-dubbing.api'

interface UseVideoDubbingStatusOptions {
    api: {
        videoDubbing: {
            getStatus: (product1688Id: string) => Promise<VideoStatusResponse>
        }
    }
    product1688Id: string
    enabled?: boolean
    refetchInterval?: number | false
}

export function useVideoDubbingStatus({
    api,
    product1688Id,
    enabled = true,
    refetchInterval = false,
}: UseVideoDubbingStatusOptions) {
    return useQuery({
        queryKey: ['video-dubbing', 'status', product1688Id],
        queryFn: () => api.videoDubbing.getStatus(product1688Id),
        enabled: enabled && !!product1688Id,
        staleTime: 0, // Always fetch fresh data
        refetchInterval, // For polling when processing
        retry: 3,
    })
}
