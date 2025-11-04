export function shortenFilename(filename: string, maxLength = 25) {
    try {
        const dotIndex = filename.lastIndexOf('.')
        const name = dotIndex !== -1 ? filename.slice(0, dotIndex) : filename
        const ext = dotIndex !== -1 ? filename.slice(dotIndex) : ''

        // If name is already short enough, return as is
        if (name.length <= maxLength) return filename

        const keepStart = Math.ceil(maxLength * 0.6)
        const keepEnd = Math.floor(maxLength * 0.2)

        const shortened = `${name.slice(0, keepStart)}...${name.slice(-keepEnd)}`
        return shortened + ext
    } catch (error) {
        console.error(error)
        return filename
    }
}

export function formatFileSize(bytes: number, decimals = 1) {
    try {
        if (bytes === 0) return '0 B'

        const k = 1024
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))

        const value = bytes / Math.pow(k, i)
        return `${parseFloat(value.toFixed(decimals))} ${sizes[i] || ''}`
    } catch (error) {
        console.error(error)
        return '0 B'
    }
}

export const validateFileExtension = (file: File, extensions: Array<string>) => {
    const fileName = file.name.toLowerCase()
    const extension = fileName.split('.').pop() ?? ''
    return extensions.includes(extension)
}

export const validateFileSize = (file: File, maxFileSize: number) => {
    return file.size <= maxFileSize
}

export const downloadFile = (url: string) => {
    const a = document.createElement('a')
    a.href = url
    a.download = url.split('/').pop() ?? ''
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
}

/**
 * Download video with CORS fallback strategy
 * Tries blob download first, falls back to window.open if CORS fails
 * @param url - Video URL to download
 * @param filename - Desired filename for the download
 * @throws Error if download fails (after fallback attempt)
 */
export const downloadVideoWithFallback = async (url: string, filename: string): Promise<void> => {
    try {
        // Try blob download (better UX, filename control)
        const response = await fetch(url)
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

        const blob = await response.blob()
        const blobUrl = URL.createObjectURL(blob)

        const a = document.createElement('a')
        a.href = blobUrl
        a.download = filename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)

        // Cleanup blob URL after a delay
        setTimeout(() => URL.revokeObjectURL(blobUrl), 1000)
    } catch (error) {
        // Fallback to window.open (works even with CORS restrictions)
        console.warn('Blob download failed, falling back to window.open:', error)
        window.open(url, '_blank')

        // Re-throw to let caller know fallback was used
        throw new Error('Blob download failed, opened in new tab')
    }
}
