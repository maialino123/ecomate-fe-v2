'use client'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, ContactShadows, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useMemo, useRef, Suspense, useState, useCallback } from 'react'
import { DebugPanel } from './debug-panel'

gsap.registerPlugin(ScrollTrigger)

// Đặt USE_ORBIT_CONTROLS = true để khám phá model và lấy tọa độ
// Sau khi có tọa độ, đặt lại = false
const USE_ORBIT_CONTROLS = false

// Debug mode - set true để kiểm tra ScrollTrigger
const DEBUG_MODE = false

// Scale model nếu quá lớn/nhỏ (1 = kích thước gốc)
const MODEL_SCALE = 0.5

interface DebugInfo {
    modelSize?: { x: number; y: number; z: number }
    modelCenter?: { x: number; y: number; z: number }
    cameraPosition?: { x: number; y: number; z: number }
}

function ApartmentModel({ onDebugInfo }: { onDebugInfo: (info: DebugInfo) => void }) {
    const { scene } = useGLTF('/models/apartment_floor_plan.glb')

    useEffect(() => {
        // Log bounding box để biết kích thước model
        const box = new THREE.Box3().setFromObject(scene)
        const size = box.getSize(new THREE.Vector3())
        const center = box.getCenter(new THREE.Vector3())

        // Center model về gốc tọa độ (0, 0, 0)
        scene.position.sub(center)

        // Đưa model lên trên grid một chút (nếu cần)
        scene.position.y = 0

        if (DEBUG_MODE) {
            console.log('✅ Model loaded successfully!')
            console.log('- Size:', size)
            console.log('- Center:', center)
            console.log('- Position:', scene.position)
        }

        // Send debug info to UI
        onDebugInfo({
            modelSize: { x: size.x, y: size.y, z: size.z },
            modelCenter: { x: center.x, y: center.y, z: center.z },
        })
    }, [scene, onDebugInfo])

    // Tối ưu rendering
    scene.traverse(obj => {
        obj.frustumCulled = true // Bật frustum culling để tối ưu performance
        if ((obj as THREE.Mesh).isMesh) {
            const m = obj as THREE.Mesh
            m.castShadow = false
            m.receiveShadow = true

            // Optimize materials
            if (m.material) {
                const materials = Array.isArray(m.material) ? m.material : [m.material]
                materials.forEach(mat => {
                    if (mat instanceof THREE.MeshStandardMaterial) {
                        mat.needsUpdate = false
                    }
                })
            }
        }
    })

    return (
        /* eslint-disable-next-line react/no-unknown-property */
        <primitive object={scene} scale={MODEL_SCALE} />
    )
}

// Waypoints: các vị trí camera + điểm nhìn cho từng phòng
// Tọa độ đã được điều chỉnh cho MODEL_SCALE = 0.5
const WAYPOINTS = [
    {
        // Reveal section - Camera position ban đầu (trước khi vào living)
        pos: new THREE.Vector3(-0.02, 5.6, -3.04),
        look: new THREE.Vector3(0, 0.5, 0),
        sec: '#sec-reveal',
    },
    {
        // Phòng khách - View tổng quan từ trên cao
        pos: new THREE.Vector3(-0.02, 5.6, -3.04),
        look: new THREE.Vector3(0, 0.5, 0), // Nhìn về trung tâm model
        sec: '#sec-living',
    },
    {
        // Nhà bếp - View gần, focus vào khu bếp
        pos: new THREE.Vector3(1.26, 0.75, 1.91),
        look: new THREE.Vector3(1.0, 0.5, 1.5), // Nhìn về phía trước khu bếp
        sec: '#sec-kitchen',
    },
    {
        // Phòng tắm - View ở độ cao mắt (CẬP NHẬT MỚI 2024)
        pos: new THREE.Vector3(-0.15, 1.43, -0.48),
        look: new THREE.Vector3(5.59, -6.75, -0.64), // Nhìn sâu vào phòng tắm
        sec: '#sec-bath',
    },
    {
        // Phòng ngủ - View gần, tạo cảm giác ấm cúng (CẬP NHẬT MỚI 2024)
        pos: new THREE.Vector3(0.8, 1.75, -1.21),
        look: new THREE.Vector3(-0.12, -7.86, -3.82), // Nhìn vào giường ngủ
        sec: '#sec-bed',
    },
]

function CameraScrollController({ onDebugInfo }: { onDebugInfo: (info: Partial<DebugInfo>) => void }) {
    const { camera } = useThree()
    const lookAt = useRef(new THREE.Vector3(0, 1, 0))
    const currentWaypointIndex = useRef(0)
    const isAnimating = useRef(false)
    const hasInitialized = useRef(false)

    useFrame(() => {
        // Update camera position in debug panel
        if (USE_ORBIT_CONTROLS) {
            onDebugInfo({
                cameraPosition: {
                    x: camera.position.x,
                    y: camera.position.y,
                    z: camera.position.z,
                },
            })
        } else {
            camera.lookAt(lookAt.current)
        }
    })

    useEffect(() => {
        // Listen for 'P' key to log camera position and target
        const handleKeyPress = async (e: KeyboardEvent) => {
            if (e.key === 'p' || e.key === 'P') {
                // Get OrbitControls target từ scene
                const target = new THREE.Vector3()
                camera.getWorldDirection(target)
                target.multiplyScalar(10) // Extend direction vector
                target.add(camera.position)

                const textToCopy =
                    `Camera Position (pos):\n` +
                    `x: ${camera.position.x.toFixed(2)}\n` +
                    `y: ${camera.position.y.toFixed(2)}\n` +
                    `z: ${camera.position.z.toFixed(2)}\n\n` +
                    `Camera Target (look):\n` +
                    `x: ${target.x.toFixed(2)}\n` +
                    `y: ${target.y.toFixed(2)}\n` +
                    `z: ${target.z.toFixed(2)}`

                // Copy to clipboard
                try {
                    await navigator.clipboard.writeText(textToCopy)
                    console.log('✅ Copied to clipboard!')
                    console.log(textToCopy)
                } catch (err) {
                    console.error('Failed to copy:', err)
                    alert(textToCopy)
                }
            }
        }
        window.addEventListener('keypress', handleKeyPress)
        return () => window.removeEventListener('keypress', handleKeyPress)
    }, [camera])

    useEffect(() => {
        // Skip scroll animation khi đang dùng OrbitControls
        if (USE_ORBIT_CONTROLS) return

        // Set vị trí camera ban đầu
        const firstWaypoint = WAYPOINTS[0]
        if (!firstWaypoint) return

        camera.position.copy(firstWaypoint.pos)
        lookAt.current.copy(firstWaypoint.look)
        camera.lookAt(lookAt.current) // Force update lookAt ngay lập tức

        if (DEBUG_MODE) {
            console.log('🎬 Snap Scroll Setup:')
            console.log('- Initial camera position:', camera.position)
            console.log('- Waypoints count:', WAYPOINTS.length)
        }

        // Delay để đảm bảo camera đã render ổn định trước khi bật observers
        const initTimeout = setTimeout(() => {
            hasInitialized.current = true
        }, 500)

        // Setup IntersectionObserver cho mỗi section
        const observers: IntersectionObserver[] = []

        WAYPOINTS.forEach((waypoint, index) => {
            const section = document.querySelector(waypoint.sec)
            if (!section) return

            const observer = new IntersectionObserver(
                entries => {
                    entries.forEach(entry => {
                        // Bỏ qua tất cả triggers trước khi initialized
                        if (!hasInitialized.current) return

                        // Chỉ animate khi thực sự scroll đến section mới
                        if (entry.isIntersecting && currentWaypointIndex.current !== index) {
                            // Section này đang được view, animate camera đến waypoint tương ứng
                            if (DEBUG_MODE) {
                                console.log(`📍 Snap to ${waypoint.sec} (waypoint ${index})`)
                            }

                            // Cancel ongoing animations trước khi start animation mới
                            gsap.killTweensOf(camera.position)
                            gsap.killTweensOf(lookAt.current)

                            isAnimating.current = true
                            currentWaypointIndex.current = index

                            // Animate camera với GSAP - giảm duration để responsive hơn
                            gsap.to(camera.position, {
                                x: waypoint.pos.x,
                                y: waypoint.pos.y,
                                z: waypoint.pos.z,
                                duration: 0.6,
                                ease: 'power2.inOut',
                                onComplete: () => {
                                    isAnimating.current = false
                                },
                            })

                            // Animate lookAt
                            const tempLookAt = { ...lookAt.current }
                            gsap.to(tempLookAt, {
                                x: waypoint.look.x,
                                y: waypoint.look.y,
                                z: waypoint.look.z,
                                duration: 0.6,
                                ease: 'power2.inOut',
                                onUpdate: () => {
                                    lookAt.current.set(tempLookAt.x, tempLookAt.y, tempLookAt.z)
                                },
                            })
                        }
                    })
                },
                {
                    threshold: 0.6, // Trigger khi 60% section vào viewport - chặt chẽ hơn
                },
            )

            observer.observe(section)
            observers.push(observer)
        })

        return () => {
            clearTimeout(initTimeout)
            observers.forEach(obs => obs.disconnect())
        }
    }, [camera])

    return null
}

function LoadingFallback() {
    return (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950">
            <div className="text-center">
                <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-emerald-500 border-r-transparent"></div>
                <p className="mt-4 text-white/60">Đang tải mô hình 3D...</p>
            </div>
        </div>
    )
}

export default function ScrollStage() {
    const [isLoading, setIsLoading] = useState(true)
    const [debugInfo, setDebugInfo] = useState<DebugInfo>({})

    const handleDebugInfo = useCallback((info: Partial<DebugInfo>) => {
        setDebugInfo(prev => ({ ...prev, ...info }))
    }, [])

    // Fallback cho người dùng bật reduce motion
    const prefersReduced = useMemo(
        () =>
            typeof window !== 'undefined' &&
            window.matchMedia &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        [],
    )

    if (prefersReduced) {
        return (
            <div className="absolute inset-0">
                <img src="/images/hero-poster.jpg" alt="Ecomate Apartment" className="h-full w-full object-cover" />
            </div>
        )
    }

    return (
        <>
            {isLoading && <LoadingFallback />}
            {USE_ORBIT_CONTROLS && <DebugPanel info={debugInfo} />}
            {DEBUG_MODE && (
                <div className="absolute top-4 left-4 z-50 bg-black/80 text-white p-3 rounded text-xs font-mono">
                    Loading: {isLoading ? 'YES' : 'NO'}
                    <br />
                    Camera: ({WAYPOINTS[0]?.pos.x.toFixed(2)}, {WAYPOINTS[0]?.pos.y.toFixed(2)},{' '}
                    {WAYPOINTS[0]?.pos.z.toFixed(2)})<br />
                    Scale: {MODEL_SCALE}
                </div>
            )}
            <Canvas
                className="absolute inset-0"
                style={{ pointerEvents: 'none' }}
                camera={{
                    position: USE_ORBIT_CONTROLS
                        ? [25, 25, 25]
                        : ((WAYPOINTS[0]?.pos.toArray() ?? [-0.02, 5.6, -3.04]) as [number, number, number]),
                    fov: USE_ORBIT_CONTROLS ? 60 : 50,
                }}
                dpr={[1, 1.5]}
                gl={{
                    antialias: false,
                    alpha: true,
                    powerPreference: 'high-performance',
                    stencil: false,
                    depth: true,
                }}
                onCreated={({ gl }) => {
                    if (DEBUG_MODE) {
                        console.log('✅ Canvas created!')
                    }

                    // Handle context loss
                    const canvas = gl.domElement
                    const handleContextLost = (event: Event) => {
                        event.preventDefault()
                        console.warn('⚠️ WebGL context lost, attempting recovery...')
                        setIsLoading(true)
                    }

                    const handleContextRestored = () => {
                        console.log('✅ WebGL context restored!')
                        setIsLoading(false)
                    }

                    canvas.addEventListener('webglcontextlost', handleContextLost)
                    canvas.addEventListener('webglcontextrestored', handleContextRestored)

                    setIsLoading(false)

                    // Cleanup on unmount
                    return () => {
                        canvas.removeEventListener('webglcontextlost', handleContextLost)
                        canvas.removeEventListener('webglcontextrestored', handleContextRestored)
                        gl.dispose()
                    }
                }}
            >
                {/* eslint-disable react/no-unknown-property */}
                <ambientLight intensity={1.0} />
                <directionalLight position={[5, 8, 4]} intensity={1.2} />
                <directionalLight position={[-5, 5, -4]} intensity={0.6} />
                {/* eslint-enable react/no-unknown-property */}

                <Suspense fallback={null}>
                    {/* eslint-disable-next-line react/no-unknown-property */}
                    <group position={[0, 0, 0]}>
                        <ApartmentModel onDebugInfo={handleDebugInfo} />
                        {!USE_ORBIT_CONTROLS && <ContactShadows opacity={0.25} blur={2.5} far={4} />}
                    </group>
                </Suspense>

                <CameraScrollController onDebugInfo={handleDebugInfo} />

                {/* Debug helpers khi đang dùng OrbitControls */}
                {USE_ORBIT_CONTROLS && (
                    <>
                        <OrbitControls makeDefault />
                        {/* eslint-disable react/no-unknown-property */}
                        <gridHelper args={[20, 20]} />
                        <axesHelper args={[5]} />
                        {/* eslint-enable react/no-unknown-property */}
                    </>
                )}
            </Canvas>
        </>
    )
}
