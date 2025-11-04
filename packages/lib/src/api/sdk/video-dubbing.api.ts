import { AxiosInstance } from 'axios'

/**
 * Video Processing Options
 */
export interface VideoProcessingOptions {
    keepBGM?: boolean
    ttsVoice?: 'vi-female-1' | 'vi-female-2' | 'vi-male-1' | 'vi-male-2'
    quality?: '480p' | '720p' | '1080p'
    generateSubtitles?: boolean
    generateHLS?: boolean
    targetLang?: string
}

/**
 * Job Status Type
 */
export type JobStatus =
    | 'QUEUED'
    | 'DOWNLOADING'
    | 'EXTRACTING_AUDIO'
    | 'SEPARATING_AUDIO'
    | 'TRANSCRIBING'
    | 'TRANSLATING'
    | 'GENERATING_VOICE'
    | 'MIXING_AUDIO'
    | 'ENCODING_VIDEO'
    | 'UPLOADING'
    | 'COMPLETED'
    | 'FAILED'

/**
 * Video Status Response (Full)
 */
export interface VideoStatusResponse {
    status: JobStatus
    progress: number
    currentStep: string
    startedAt?: string
    completedAt?: string
    estimatedCompletion?: string
    dubbedVideoUrl?: string
    hlsPlaylistUrl?: string
    subtitlesUrl?: string
    errorMessage?: string
    retryCount: number
}

/**
 * Lightweight Status Response (Optimized for Polling)
 * Smaller payload size, used for frequent status checks
 */
export interface LightweightStatusResponse {
    status: JobStatus
    progress: number
    currentStep: string
    dubbedVideoUrl?: string
    errorMessage?: string
    updatedAt: string
}

/**
 * Process Video Response
 */
export interface ProcessVideoResponse {
    success: boolean
    message: string
    jobId: string
}

/**
 * Video Job (Admin)
 */
export interface VideoJob {
    id: string
    product1688Id: string
    status: string
    progress: number
    currentStep: string
    startedAt: string
    completedAt?: string
    errorMessage?: string
    retryCount: number
}

/**
 * List Jobs Response (Admin)
 */
export interface ListJobsResponse {
    data: VideoJob[]
    total: number
    page: number
    limit: number
}

/**
 * List Jobs Query Params
 */
export interface ListJobsParams {
    status?: string
    limit?: number
    offset?: number
}

/**
 * Video Dubbing API SDK
 * Handles all API calls for video dubbing/translation
 */
export class VideoDubbingApi {
    constructor(private readonly client: AxiosInstance) {}

    /**
     * Queue video processing job
     */
    async processVideo(product1688Id: string, options?: VideoProcessingOptions): Promise<ProcessVideoResponse> {
        const response = await this.client.post<ProcessVideoResponse>(`/v1/video-dubbing/process/${product1688Id}`, {
            options,
        })
        return response.data
    }

    /**
     * Get processing status (full details)
     */
    async getStatus(product1688Id: string): Promise<VideoStatusResponse> {
        const response = await this.client.get<VideoStatusResponse>(`/v1/video-dubbing/status/${product1688Id}`)
        return response.data
    }

    /**
     * Get lightweight processing status (optimized for polling)
     * Use this for frequent status checks instead of getStatus()
     */
    async getLightweightStatus(product1688Id: string): Promise<LightweightStatusResponse> {
        const response = await this.client.get<LightweightStatusResponse>(
            `/v1/video-dubbing/status/${product1688Id}/quick`,
        )
        return response.data
    }

    /**
     * Cancel/delete video processing
     */
    async deleteVideo(product1688Id: string): Promise<{ success: boolean; message: string }> {
        const response = await this.client.delete<{ success: boolean; message: string }>(
            `/v1/video-dubbing/${product1688Id}`,
        )
        return response.data
    }

    /**
     * Regenerate video with different settings
     */
    async regenerateVideo(product1688Id: string, options?: VideoProcessingOptions): Promise<ProcessVideoResponse> {
        const response = await this.client.post<ProcessVideoResponse>(`/v1/video-dubbing/regenerate/${product1688Id}`, {
            options,
        })
        return response.data
    }

    /**
     * List all video processing jobs (admin only)
     */
    async listJobs(params?: ListJobsParams): Promise<ListJobsResponse> {
        const response = await this.client.get<ListJobsResponse>('/v1/video-dubbing/jobs', {
            params,
        })
        return response.data
    }
}
