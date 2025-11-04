import { useQuery } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { JobStatus, LightweightStatusResponse } from '../../api/sdk/video-dubbing.api'

interface UseVideoDubbingStatusOptions {
    api: {
        videoDubbing: {
            getLightweightStatus: (product1688Id: string) => Promise<LightweightStatusResponse>
        }
    }
    product1688Id: string
    enabled?: boolean
    onComplete?: (url: string) => void
    onError?: (error: string) => void
}

/**
 * Smart polling intervals based on job status
 * Different phases have different update frequencies
 */
function getOptimalPollingInterval(status: JobStatus, elapsedMinutes: number): number | false {
    // Stop polling on terminal states
    if (status === 'COMPLETED' || status === 'FAILED') {
        return false
    }

    // Base intervals by status (in milliseconds)
    const statusIntervals: Record<JobStatus, number> = {
        QUEUED: 10000, // 10s - job not started yet
        DOWNLOADING: 5000, // 5s - fast phase
        EXTRACTING_AUDIO: 6000, // 6s - fast phase
        SEPARATING_AUDIO: 8000, // 8s - medium phase
        TRANSCRIBING: 12000, // 12s - longest phase
        TRANSLATING: 3000, // 3s - very fast with cache
        GENERATING_VOICE: 8000, // 8s - TTS takes time
        MIXING_AUDIO: 5000, // 5s - fast phase
        ENCODING_VIDEO: 10000, // 10s - second longest phase
        UPLOADING: 7000, // 7s - network dependent
        COMPLETED: Infinity, // Never poll
        FAILED: Infinity, // Never poll
    }

    let baseInterval = statusIntervals[status] || 5000

    // Progressive slowdown for very long jobs (>10 minutes)
    if (elapsedMinutes > 10) {
        baseInterval = Math.min(baseInterval * 1.5, 20000) // Max 20s
    } else if (elapsedMinutes > 15) {
        baseInterval = Math.min(baseInterval * 2, 30000) // Max 30s
    }

    return baseInterval
}

/**
 * Optimized hook for video dubbing status polling
 * Features:
 * - Smart polling intervals based on job phase
 * - Progressive slowdown for long jobs
 * - Automatic stop on completion/failure
 * - No background polling (saves resources)
 * - Lightweight endpoint for reduced payload
 */
export function useVideoDubbingStatus({
    api,
    product1688Id,
    enabled = true,
    onComplete,
    onError,
}: UseVideoDubbingStatusOptions) {
    const [pollingInterval, setPollingInterval] = useState<number | false>(5000)
    const startTime = useRef<number>(Date.now())
    const lastStatus = useRef<JobStatus | null>(null)

    const { data, error, isLoading, refetch } = useQuery({
        queryKey: ['video-dubbing-status-quick', product1688Id],
        queryFn: () => api.videoDubbing.getLightweightStatus(product1688Id),
        enabled: enabled && !!product1688Id,
        staleTime: 0, // Always fetch fresh data
        refetchInterval: pollingInterval,
        refetchIntervalInBackground: false, // Stop polling when tab is backgrounded
        retry: 3,
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 10000),
    })

    // Adjust polling interval based on job status and elapsed time
    useEffect(() => {
        if (!data) return

        const elapsedMs = Date.now() - startTime.current
        const elapsedMinutes = elapsedMs / 60000

        const interval = getOptimalPollingInterval(data.status, elapsedMinutes)
        setPollingInterval(interval)

        // Trigger callbacks on state transitions
        if (lastStatus.current !== data.status) {
            if (data.status === 'COMPLETED' && data.dubbedVideoUrl) {
                onComplete?.(data.dubbedVideoUrl)
            } else if (data.status === 'FAILED') {
                onError?.(data.errorMessage || 'Unknown error')
            }
            lastStatus.current = data.status
        }
    }, [data?.status, data?.dubbedVideoUrl, data?.errorMessage, onComplete, onError])

    return {
        status: data?.status,
        progress: data?.progress || 0,
        currentStep: data?.currentStep,
        dubbedVideoUrl: data?.dubbedVideoUrl,
        errorMessage: data?.errorMessage,
        updatedAt: data?.updatedAt,
        isLoading,
        error,
        refetch,
    }
}
