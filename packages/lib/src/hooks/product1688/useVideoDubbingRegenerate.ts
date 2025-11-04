import { useMutation, useQueryClient } from '@tanstack/react-query'
import { VideoProcessingOptions, ProcessVideoResponse } from '../../api/sdk/video-dubbing.api'
import { useNotificationStore } from '../../stores'
import { handleApiError } from '../../api/interceptors'

interface UseVideoDubbingRegenerateOptions {
    api: {
        videoDubbing: {
            regenerateVideo: (product1688Id: string, options?: VideoProcessingOptions) => Promise<ProcessVideoResponse>
        }
    }
    onSuccess?: (data: ProcessVideoResponse) => void
    onError?: (error: unknown) => void
}

export function useVideoDubbingRegenerate({ api, onSuccess, onError }: UseVideoDubbingRegenerateOptions) {
    const queryClient = useQueryClient()
    const { success, error: showError } = useNotificationStore()

    return useMutation({
        mutationFn: ({ product1688Id, options }: { product1688Id: string; options?: VideoProcessingOptions }) =>
            api.videoDubbing.regenerateVideo(product1688Id, options),
        onSuccess: data => {
            success('Video regeneration has been queued', 'Regenerating')
            queryClient.invalidateQueries({ queryKey: ['product1688'] })
            queryClient.invalidateQueries({ queryKey: ['video-dubbing'] })
            onSuccess?.(data)
        },
        onError: error => {
            const apiError = handleApiError(error)
            showError(apiError.message, 'Regeneration Failed')
            onError?.(error)
        },
    })
}
