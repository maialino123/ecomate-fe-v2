/**
 * Product1688 Types
 * Types for 1688 product management system
 */

export enum Product1688Status {
  PENDING_REVIEW = 'PENDING_REVIEW',
  TRANSLATED = 'TRANSLATED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum RejectionReason {
  LOW_QUALITY = 'LOW_QUALITY',
  TOO_EXPENSIVE = 'TOO_EXPENSIVE',
  ALREADY_HAVE = 'ALREADY_HAVE',
  NOT_SUITABLE = 'NOT_SUITABLE',
  SUPPLIER_ISSUES = 'SUPPLIER_ISSUES',
  OTHER = 'OTHER',
}

export interface Product1688Variant {
  sku: string;
  nameZh: string;
  nameVi?: string;
  attributes: Record<string, string>;
  price: number;
  stock?: number;
  image?: string;
}

export interface CostCalculation {
  importPrice: number;
  domesticShippingCN?: number;
  internationalShippingVN?: number;
  handlingFee?: number;
  exchangeRateCNY: number;
  quantity?: number;
  returnRate?: number;
  platformFeeRate?: number;
  profitMarginRate?: number;
  finalPriceVND?: number;
}

export interface Product1688Entity {
  id: string;
  nameZh: string;
  descriptionZh?: string;
  originalUrl: string;
  nameVi?: string;
  descriptionVi?: string;
  priceMinCNY: number;
  priceMaxCNY?: number;
  currency: string;
  costCalculation?: CostCalculation;
  variants?: Product1688Variant[];
  variantCount: number;
  supplierName?: string;
  supplierId1688?: string;
  images: string[];
  selectedImages: string[];
  thumbnail?: string;
  status: Product1688Status;
  rejectionReason?: RejectionReason;
  rejectedAt?: string;
  rejectedBy?: string;
  createdBy?: string;
  reviewedBy?: string;
  createdAt: string;
  updatedAt: string;
  productId?: string;

  // Relations (populated)
  createdByUser?: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
  reviewedByUser?: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
  rejectedByUser?: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
  product?: any; // Product type
}

// Request DTOs
export interface CreateProduct1688Request {
  nameZh: string;
  descriptionZh?: string;
  originalUrl: string;
  priceMinCNY: number;
  priceMaxCNY?: number;
  images: string[];
  thumbnail?: string;
  variants?: Product1688Variant[];
  supplierName?: string;
  supplierId1688?: string;
}

export interface UpdateProduct1688Request {
  nameVi?: string;
  descriptionVi?: string;
  variants?: Product1688Variant[];
  costCalculation?: CostCalculation;
  selectedImages?: string[];
}

export interface TranslateProduct1688Request {
  translateName?: boolean;
  translateDescription?: boolean;
  translateVariants?: boolean;
  forceRefresh?: boolean;
}

export interface ApproveProduct1688Request {
  sku: string;
  categoryId: string;
  supplierId?: string;
  createSupplier?: boolean;
}

export interface RejectProduct1688Request {
  reason: RejectionReason;
  note?: string;
}

export interface QueryProduct1688Request {
  status?: Product1688Status;
  search?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'priceMinCNY' | 'nameZh';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Response types
export interface CreateProduct1688Response {
  success: boolean;
  data?: Product1688Entity;
  error?: string;
  existingId?: string;
  existingType?: 'product1688' | 'product';
}

export interface DuplicateCheckResponse {
  exists: boolean;
  type?: 'product1688' | 'product';
  id?: string;
  name?: string;
}

export interface TranslationProgress {
  total: number;
  completed: number;
  failed: number;
  items: Array<{
    field: string;
    status: 'pending' | 'completed' | 'failed';
    error?: string;
  }>;
}

export interface TranslateProduct1688Response {
  product: Product1688Entity;
  progress: TranslationProgress;
}

export interface ApproveProduct1688Response {
  success: boolean;
  product: any; // Product type
  product1688: Product1688Entity;
}

export interface Product1688ListResponse {
  data: Product1688Entity[];
  total: number;
  page: number;
  limit: number;
}
