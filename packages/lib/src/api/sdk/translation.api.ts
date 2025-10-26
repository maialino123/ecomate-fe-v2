import { AxiosInstance } from 'axios';

/**
 * Translation API SDK
 *
 * Provides methods to translate products using Cloudflare Worker AI
 */

export interface TranslateProductRequest {
  sourceLang?: string;
  targetLang?: string;
  forceRefresh?: boolean;
}

export interface TranslationResult {
  name?: {
    original: string;
    translated: string;
  };
  description?: {
    original: string;
    translated: string;
  };
  metadata?: Record<string, any>;
}

export interface TranslateProductResponse {
  productId: string;
  sku: string;
  translations: TranslationResult;
  translatedAt: string;
  cached: boolean;
}

export interface BatchTranslateRequest {
  productIds: string[];
  sourceLang?: string;
  targetLang?: string;
  forceRefresh?: boolean;
}

export interface BatchTranslateResponse {
  total: number;
  successful: number;
  failed: number;
  results: TranslateProductResponse[];
  errors: Array<{
    productId: string;
    error: string;
  }>;
}

export interface TranslationStats {
  cacheHits: number;
  cacheMisses: number;
  totalRequests: number;
  hitRate: number;
}

export class TranslationApi {
  constructor(private client: AxiosInstance) {}

  /**
   * Translate a single product from Chinese to Vietnamese
   *
   * @param productId - Product ID to translate
   * @param options - Translation options (source/target language, force refresh)
   * @returns Translation result with original and translated text
   */
  async translateProduct(
    productId: string,
    options?: TranslateProductRequest,
  ): Promise<TranslateProductResponse> {
    const { data } = await this.client.post<TranslateProductResponse>(
      `/v1/translation/translate-product/${productId}`,
      options || {},
    );
    return data;
  }

  /**
   * Batch translate multiple products
   *
   * @param request - Batch translation request with product IDs
   * @returns Batch translation results
   */
  async batchTranslate(request: BatchTranslateRequest): Promise<BatchTranslateResponse> {
    const { data } = await this.client.post<BatchTranslateResponse>(
      '/v1/translation/batch-translate',
      request,
    );
    return data;
  }

  /**
   * Get translation cache statistics
   *
   * @returns Cache hit/miss rates and total requests
   */
  async getCacheStats(): Promise<TranslationStats> {
    const { data } = await this.client.get<TranslationStats>('/v1/translation/cache-stats');
    return data;
  }
}
