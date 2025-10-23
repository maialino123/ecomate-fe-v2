import { AxiosInstance } from 'axios'
import { ExampleApi } from './sdk/example.api'
import { AuthApi } from './sdk/auth.api'
import { AdminApi } from './sdk/admin.api'

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

    constructor(private readonly client: AxiosInstance) {
        this.example = new ExampleApi(this.client)
        this.auth = new AuthApi(this.client)
        this.admin = new AdminApi(this.client)
    }
}

// Re-export types
export * from './sdk/auth.types'
export * from './sdk/admin.types'
export * from './sdk/example.type'
export * from './client'
export * from './interceptors'
