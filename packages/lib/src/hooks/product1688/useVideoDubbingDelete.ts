import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNotificationStore } from '../../stores'
import { handleApiError } from '../../api/interceptors'

interface UseVideoDubbingDeleteOptions {
    api: {
        videoDubbing: {
            deleteVideo: (product1688Id: string) => Promise<{ success: boolean; message: string }>
        }
    }
    onSuccess?: (data: { success: boolean; message: string }) => void
    onError?: (error: unknown) => void
}

export function useVideoDubbingDelete({ api, onSuccess, onError }: UseVideoDubbingDeleteOptions) {
    const queryClient = useQueryClient()
    const { success, error: showError } = useNotificationStore()

    return useMutation({
        mutationFn: (product1688Id: string) => api.videoDubbing.deleteVideo(product1688Id),
        onSuccess: data => {
            success('Video deleted successfully', 'Deleted')
            queryClient.invalidateQueries({ queryKey: ['product1688'] })
            queryClient.invalidateQueries({ queryKey: ['video-dubbing'] })
            onSuccess?.(data)
        },
        onError: error => {
            const apiError = handleApiError(error)
            showError(apiError.message, 'Delete Failed')
            onError?.(error)
        },
    })
}
