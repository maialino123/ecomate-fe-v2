import { AxiosInstance } from 'axios'
import {
    RegistrationRequestsResponse,
    SingleRegistrationRequestResponse,
    ApproveRegistrationDto,
    RejectRegistrationDto,
    ExportFormat,
    ImportUsersDto,
    ImportUsersResponse,
    UsersResponse,
    SingleUserResponse,
    UpdateUserRoleDto,
    UpdateUserStatusDto,
} from './admin.types'
import { MessageResponse } from './auth.types'

export class AdminApi {
    constructor(private readonly client: AxiosInstance) {}

    // ============= Registration Requests =============

    /**
     * Get all registration requests
     */
    async getRegistrationRequests(): Promise<RegistrationRequestsResponse> {
        const response = await this.client.get<RegistrationRequestsResponse>('/v1/admin/registration-requests')
        return response.data
    }

    /**
     * Get single registration request
     */
    async getRegistrationRequest(id: string): Promise<SingleRegistrationRequestResponse> {
        const response = await this.client.get<SingleRegistrationRequestResponse>(
            `/v1/admin/registration-requests/${id}`,
        )
        return response.data
    }

    /**
     * Approve registration request
     */
    async approveRegistrationRequest(id: string, dto: ApproveRegistrationDto): Promise<MessageResponse> {
        const response = await this.client.post<MessageResponse>(`/v1/admin/registration-requests/${id}/approve`, dto)
        return response.data
    }

    /**
     * Reject registration request
     */
    async rejectRegistrationRequest(id: string, dto: RejectRegistrationDto): Promise<MessageResponse> {
        const response = await this.client.post<MessageResponse>(`/v1/admin/registration-requests/${id}/reject`, dto)
        return response.data
    }

    /**
     * Export registration requests
     */
    async exportRegistrationRequests(format: 'json' | 'csv' = 'json'): Promise<Blob> {
        const response = await this.client.get(`/v1/admin/registration-requests/export`, {
            params: { format },
            responseType: 'blob',
        })
        return response.data
    }

    /**
     * Import users (bulk)
     */
    async importUsers(dto: ImportUsersDto): Promise<ImportUsersResponse> {
        const response = await this.client.post<ImportUsersResponse>('/v1/admin/registration-requests/import', dto)
        return response.data
    }

    // ============= User Management =============

    /**
     * Get all users
     */
    async getUsers(): Promise<UsersResponse> {
        const response = await this.client.get<UsersResponse>('/v1/admin/users')
        return response.data
    }

    /**
     * Get single user
     */
    async getUser(id: string): Promise<SingleUserResponse> {
        const response = await this.client.get<SingleUserResponse>(`/v1/admin/users/${id}`)
        return response.data
    }

    /**
     * Update user role
     */
    async updateUserRole(id: string, dto: UpdateUserRoleDto): Promise<MessageResponse> {
        const response = await this.client.patch<MessageResponse>(`/v1/admin/users/${id}/role`, dto)
        return response.data
    }

    /**
     * Update user status
     */
    async updateUserStatus(id: string, dto: UpdateUserStatusDto): Promise<MessageResponse> {
        const response = await this.client.patch<MessageResponse>(`/v1/admin/users/${id}/status`, dto)
        return response.data
    }

    /**
     * Delete user
     */
    async deleteUser(id: string): Promise<MessageResponse> {
        const response = await this.client.delete<MessageResponse>(`/v1/admin/users/${id}`)
        return response.data
    }
}
