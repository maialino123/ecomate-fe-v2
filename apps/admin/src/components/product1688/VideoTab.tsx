'use client'

import { useState, useEffect } from 'react'
import { useApi } from '@workspace/shared/providers'
import { Product1688Entity } from '@workspace/lib'
import {
    useVideoDubbingProcess,
    useVideoDubbingStatus,
    useVideoDubbingRegenerate,
    useVideoDubbingDelete,
} from '@workspace/lib'
import { Button } from '@workspace/ui/components/Button'
import { Progress } from '@workspace/ui/components/Progress'
import { Badge } from '@workspace/ui/components/Badge'
import { downloadVideoWithFallback } from '@workspace/ui/lib/file'
import { Video, Play, Download, RefreshCw, Loader2, AlertCircle, CheckCircle2, X } from 'lucide-react'

interface VideoTabProps {
    product: Product1688Entity
    onRefetch?: () => void
}

export function VideoTab({ product, onRefetch }: VideoTabProps) {
    const api = useApi()
    const [selectedVoice, setSelectedVoice] = useState<'vi-female-1' | 'vi-female-2' | 'vi-male-1' | 'vi-male-2'>(
        'vi-female-1',
    )
    const [selectedQuality, setSelectedQuality] = useState<'480p' | '720p' | '1080p'>('720p')
    const [isDownloadingOriginal, setIsDownloadingOriginal] = useState(false)

    // Hooks for mutations
    const processMutation = useVideoDubbingProcess({
        api,
        onSuccess: () => {
            onRefetch?.()
        },
    })

    const regenerateMutation = useVideoDubbingRegenerate({
        api,
        onSuccess: () => {
            onRefetch?.()
        },
    })

    const deleteMutation = useVideoDubbingDelete({
        api,
        onSuccess: () => {
            onRefetch?.()
        },
    })

    // Poll status when video is processing
    const isProcessing = product.videoStatus === 'PROCESSING' || product.videoStatus === 'QUEUED'
    const { data: statusData, refetch: refetchStatus } = useVideoDubbingStatus({
        api,
        product1688Id: product.id,
        enabled: isProcessing,
        refetchInterval: isProcessing ? 3000 : false, // Poll every 3 seconds
    })

    // Refetch product when status changes to completed or failed
    useEffect(() => {
        if (statusData?.status === 'COMPLETED' || statusData?.status === 'FAILED') {
            onRefetch?.()
        }
    }, [statusData?.status, onRefetch])

    const handleProcess = () => {
        processMutation.mutate({
            product1688Id: product.id,
            options: {
                ttsVoice: selectedVoice,
                quality: selectedQuality,
            },
        })
    }

    const handleRegenerate = () => {
        regenerateMutation.mutate({
            product1688Id: product.id,
            options: {
                ttsVoice: selectedVoice,
                quality: selectedQuality,
            },
        })
    }

    const handleCancel = () => {
        if (confirm('Bạn có chắc muốn hủy xử lý video này? Hành động này không thể hoàn tác.')) {
            deleteMutation.mutate(product.id)
        }
    }

    const handleDownloadOriginalVideo = async () => {
        if (!product.originalVideoUrl) return

        try {
            setIsDownloadingOriginal(true)
            await downloadVideoWithFallback(product.originalVideoUrl, `1688-original-${product.id}.mp4`)
        } catch (error) {
            console.error('Download failed:', error)
            // Error already handled by utility (fallback to window.open)
        } finally {
            setIsDownloadingOriginal(false)
        }
    }

    const getStatusBadge = () => {
        if (!statusData) return null

        switch (statusData.status) {
            case 'QUEUED':
                return <Badge variant="secondary">Đang chờ xử lý</Badge>
            case 'DOWNLOADING':
                return <Badge variant="secondary">Đang tải video</Badge>
            case 'TRANSCRIBING':
                return <Badge variant="secondary">Đang nhận dạng giọng nói</Badge>
            case 'TRANSLATING':
                return <Badge variant="secondary">Đang dịch</Badge>
            case 'GENERATING_TTS':
                return <Badge variant="secondary">Đang tạo giọng nói</Badge>
            case 'ENCODING_VIDEO':
                return <Badge variant="secondary">Đang mã hóa video</Badge>
            case 'UPLOADING':
                return <Badge variant="secondary">Đang tải lên</Badge>
            case 'COMPLETED':
                return (
                    <Badge variant="default" className="bg-green-500">
                        Hoàn thành
                    </Badge>
                )
            case 'FAILED':
                return <Badge variant="destructive">Thất bại</Badge>
            case 'CANCELLED':
                return <Badge variant="secondary">Đã hủy</Badge>
            default:
                return null
        }
    }

    return (
        <div className="space-y-6">
            {/* Original Video */}
            {product.originalVideoUrl && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Video 1688 Gốc</h3>
                        <Video className="w-5 h-5 text-gray-400" />
                    </div>
                    <video
                        src={product.originalVideoUrl}
                        controls
                        className="w-full max-w-2xl rounded-lg"
                        controlsList="nodownload"
                    />
                    <div className="mt-4 flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleDownloadOriginalVideo}
                            isDisabled={isDownloadingOriginal}
                        >
                            {isDownloadingOriginal ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Đang tải...
                                </>
                            ) : (
                                <>
                                    <Download className="w-4 h-4 mr-2" />
                                    Tải xuống video gốc
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            )}

            {/* No Video Available */}
            {!product.originalVideoUrl && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Video className="w-12 h-12 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Không có video</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Sản phẩm này chưa có video từ 1688</p>
                    </div>
                </div>
            )}

            {/* Processing Status */}
            {isProcessing && statusData && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Đang xử lý</h3>
                        {getStatusBadge()}
                    </div>

                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-600 dark:text-gray-400">{statusData.currentStep}</span>
                                <span className="font-medium">{statusData.progress}%</span>
                            </div>
                            <Progress value={statusData.progress} className="w-full" />
                        </div>

                        {statusData.estimatedCompletion && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Dự kiến hoàn thành:{' '}
                                {new Date(statusData.estimatedCompletion).toLocaleTimeString('vi-VN')}
                            </p>
                        )}

                        {statusData.retryCount > 0 && (
                            <p className="text-sm text-amber-600">Số lần thử lại: {statusData.retryCount}</p>
                        )}

                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={handleCancel}
                                isDisabled={deleteMutation.isPending}
                            >
                                {deleteMutation.isPending ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Đang hủy...
                                    </>
                                ) : (
                                    <>
                                        <X className="w-4 h-4 mr-2" />
                                        Hủy xử lý
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Error Status */}
            {product.videoStatus === 'FAILED' && statusData?.errorMessage && (
                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg shadow p-6">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">
                                Xử lý thất bại
                            </h3>
                            <p className="text-sm text-red-800 dark:text-red-200">{statusData.errorMessage}</p>
                            {statusData.retryCount >= 3 && (
                                <p className="text-sm text-red-700 dark:text-red-300 mt-2">
                                    Đã thử lại {statusData.retryCount} lần. Vui lòng kiểm tra video gốc hoặc liên hệ hỗ
                                    trợ.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Cancelled Status */}
            {product.videoStatus === 'CANCELLED' && (
                <div className="bg-gray-50 dark:bg-gray-900/20 rounded-lg shadow p-6">
                    <div className="flex items-start gap-3">
                        <X className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                Đã hủy xử lý
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Bạn đã hủy xử lý video này. Bạn có thể bắt đầu lại bất cứ lúc nào.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Dubbed Video */}
            {product.dubbedVideoUrl && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold">Video Tiếng Việt</h3>
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                        </div>
                        {getStatusBadge()}
                    </div>

                    <video src={product.dubbedVideoUrl} controls className="w-full max-w-2xl rounded-lg mb-4" />

                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(product.dubbedVideoUrl, '_blank')}
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Tải xuống
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleRegenerate}
                            isDisabled={regenerateMutation.isPending || isProcessing}
                        >
                            {regenerateMutation.isPending ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <RefreshCw className="w-4 h-4 mr-2" />
                            )}
                            Tạo lại
                        </Button>
                    </div>

                    {statusData?.completedAt && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                            Hoàn thành lúc: {new Date(statusData.completedAt).toLocaleString('vi-VN')}
                        </p>
                    )}
                </div>
            )}

            {/* Processing Options & Button */}
            {product.originalVideoUrl && !isProcessing && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold mb-4">
                        {product.dubbedVideoUrl ? 'Tùy chọn tạo lại' : 'Dịch Video sang Tiếng Việt'}
                    </h3>

                    <div className="space-y-4 mb-6">
                        {/* Voice Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Giọng đọc
                            </label>
                            <select
                                value={selectedVoice}
                                onChange={e => setSelectedVoice(e.target.value as any)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            >
                                <option value="vi-female-1">Nữ 1 (Mặc định)</option>
                                <option value="vi-female-2">Nữ 2</option>
                                <option value="vi-male-1">Nam 1</option>
                                <option value="vi-male-2">Nam 2</option>
                            </select>
                        </div>

                        {/* Quality Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Chất lượng video
                            </label>
                            <select
                                value={selectedQuality}
                                onChange={e => setSelectedQuality(e.target.value as any)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            >
                                <option value="480p">480p (Nhanh, dung lượng nhỏ)</option>
                                <option value="720p">720p (Khuyến nghị)</option>
                                <option value="1080p">1080p (Chất lượng cao)</option>
                            </select>
                        </div>
                    </div>

                    <Button
                        onClick={product.dubbedVideoUrl ? handleRegenerate : handleProcess}
                        isDisabled={processMutation.isPending || regenerateMutation.isPending}
                        size="lg"
                        className="w-full"
                    >
                        {processMutation.isPending || regenerateMutation.isPending ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Đang xử lý...
                            </>
                        ) : (
                            <>
                                <Play className="w-4 h-4 mr-2" />
                                {product.dubbedVideoUrl ? 'Tạo lại video' : 'Bắt đầu dịch video'}
                            </>
                        )}
                    </Button>

                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
                        Thời gian xử lý: 5-15 phút tùy theo độ dài video
                    </p>
                </div>
            )}

            {/* HLS Playlist (if available) */}
            {product.hlsPlaylistUrl && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold mb-4">HLS Streaming</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">HLS Playlist URL:</p>
                    <code className="block text-xs bg-gray-100 dark:bg-gray-900 p-2 rounded break-all">
                        {product.hlsPlaylistUrl}
                    </code>
                </div>
            )}

            {/* Subtitles (if available) */}
            {product.subtitlesUrl && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold mb-4">Phụ đề</h3>
                    <Button variant="outline" size="sm" onClick={() => window.open(product.subtitlesUrl, '_blank')}>
                        <Download className="w-4 h-4 mr-2" />
                        Tải phụ đề (.vtt)
                    </Button>
                </div>
            )}
        </div>
    )
}
