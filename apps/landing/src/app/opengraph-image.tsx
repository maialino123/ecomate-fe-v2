import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OG() {
    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    background: 'linear-gradient(135deg, #10b981, #0ea5e9)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                }}
            >
                <div
                    style={{
                        fontSize: 72,
                        fontWeight: 800,
                        color: '#fff',
                        letterSpacing: -1,
                    }}
                >
                    Ecomate
                </div>
                <div style={{ fontSize: 36, color: '#e2e8f0', marginTop: 8 }}>
                    Tiện ích mỗi ngày cho gia đình hiện đại
                </div>
            </div>
        ),
        { ...size },
    )
}
