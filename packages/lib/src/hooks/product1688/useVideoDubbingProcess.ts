import { useMutation, useQueryClient } from '@tanstack/react-query'
import { VideoProcessingOptions, ProcessVideoResponse } from '../../api/sdk/video-dubbing.api'
import { useNotificationStore } from '../../stores'
import { handleApiError } from '../../api/interceptors'

interface UseVideoDubbingProcessOptions {
    api: {
        videoDubbing: {
            processVideo: (product1688Id: string, options?: VideoProcessingOptions) => Promise<ProcessVideoResponse>
        }
    }
    onSuccess?: (data: ProcessVideoResponse) => void
    onError?: (error: unknown) => void
}

export function useVideoDubbingProcess({ api, onSuccess, onError }: UseVideoDubbingProcessOptions) {
    const queryClient = useQueryClient()
    const { success, error: showError } = useNotificationStore()

    return useMutation({
        mutationFn: ({ product1688Id, options }: { product1688Id: string; options?: VideoProcessingOptions }) =>
            api.videoDubbing.processVideo(product1688Id, options),
        onSuccess: data => {
            success('Video processing has been queued successfully', 'Processing Started')
            queryClient.invalidateQueries({ queryKey: ['product1688'] })
            queryClient.invalidateQueries({ queryKey: ['video-dubbing'] })
            onSuccess?.(data)
        },
        onError: error => {
            const apiError = handleApiError(error)
            showError(apiError.message, 'Processing Failed')
            onError?.(error)
        },
    })
}
