import { AxiosInstance } from 'axios'
import { ExampleApi } from './sdk/example.api'
import { AuthApi } from './sdk/auth.api'
import { AdminApi } from './sdk/admin.api'
import { CostApi } from './sdk/cost.api'
import { TranslationApi } from './sdk/translation.api'
import { Product1688Api } from './sdk/product1688.api'
import { VideoDubbingApi } from './sdk/video-dubbing.api'

/**
 * API class for the application
 * @example
 * const api = new Api(
 * axios.create({
        baseURL: 'http://localhost:8080',
    }),
 * )
 * api.example.hello()
 * api.auth.signIn({ email: '...', password: '...' })
 */
export class Api {
    example: ExampleApi
    auth: AuthApi
    admin: AdminApi
    cost: CostApi
    translation: TranslationApi
    product1688: Product1688Api
    videoDubbing: VideoDubbingApi

    constructor(private readonly client: AxiosInstance) {
        this.example = new ExampleApi(this.client)
        this.auth = new AuthApi(this.client)
        this.admin = new AdminApi(this.client)
        this.cost = new CostApi(this.client)
        this.translation = new TranslationApi(this.client)
        this.product1688 = new Product1688Api(this.client)
        this.videoDubbing = new VideoDubbingApi(this.client)
    }
}

// Re-export types
export * from './sdk/auth.types'
export * from './sdk/admin.types'
export * from './sdk/example.type'
export * from './sdk/cost.types'
export * from './sdk/translation.api'
export * from './sdk/video-dubbing.api'
export * from '../types/product1688.types'
export * from './client'
export * from './interceptors'
