import { AxiosInstance } from 'axios';
import {
  Product1688Entity,
  CreateProduct1688Request,
  CreateProduct1688Response,
  UpdateProduct1688Request,
  TranslateProduct1688Request,
  TranslateProduct1688Response,
  ApproveProduct1688Request,
  ApproveProduct1688Response,
  RejectProduct1688Request,
  QueryProduct1688Request,
  Product1688ListResponse,
  DuplicateCheckResponse,
} from '../../types/product1688.types';

/**
 * Product1688 API SDK
 * Handles all API calls for 1688 product management
 */
export class Product1688Api {
  constructor(private readonly client: AxiosInstance) {}

  /**
   * Create Product1688 from extension
   */
  async create(data: CreateProduct1688Request): Promise<CreateProduct1688Response> {
    const response = await this.client.post<CreateProduct1688Response>('/v1/1688-products', data);
    return response.data;
  }

  /**
   * Check if product already exists
   */
  async checkDuplicate(originalUrl: string): Promise<DuplicateCheckResponse> {
    const response = await this.client.post<DuplicateCheckResponse>(
      '/v1/1688-products/check-duplicate',
      { originalUrl }
    );
    return response.data;
  }

  /**
   * List products with filters and pagination
   */
  async list(query?: QueryProduct1688Request): Promise<Product1688ListResponse> {
    const response = await this.client.get<Product1688ListResponse>('/v1/1688-products', {
      params: query,
    });
    return response.data;
  }

  /**
   * Get single product by ID
   */
  async getById(id: string): Promise<Product1688Entity> {
    const response = await this.client.get<Product1688Entity>(`/v1/1688-products/${id}`);
    return response.data;
  }

  /**
   * Update product (manual edits)
   */
  async update(id: string, data: UpdateProduct1688Request): Promise<Product1688Entity> {
    const response = await this.client.patch<Product1688Entity>(`/v1/1688-products/${id}`, data);
    return response.data;
  }

  /**
   * Translate product (name, description, variants)
   */
  async translate(
    id: string,
    options?: TranslateProduct1688Request
  ): Promise<TranslateProduct1688Response> {
    const response = await this.client.post<TranslateProduct1688Response>(
      `/v1/1688-products/${id}/translate`,
      options || {}
    );
    return response.data;
  }

  /**
   * Approve and import to Product
   */
  async approve(id: string, data: ApproveProduct1688Request): Promise<ApproveProduct1688Response> {
    const response = await this.client.post<ApproveProduct1688Response>(
      `/v1/1688-products/${id}/approve`,
      data
    );
    return response.data;
  }

  /**
   * Reject product
   */
  async reject(id: string, data: RejectProduct1688Request): Promise<Product1688Entity> {
    const response = await this.client.post<Product1688Entity>(`/v1/1688-products/${id}/reject`, data);
    return response.data;
  }

  /**
   * Delete product
   */
  async delete(id: string): Promise<{ success: boolean }> {
    const response = await this.client.delete<{ success: boolean }>(`/v1/1688-products/${id}`);
    return response.data;
  }
}
