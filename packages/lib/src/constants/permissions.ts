/**
 * Role-Based Access Control (RBAC) Permission System
 *
 * Defines permissions for each role across different features
 */

import { UserRole } from '../stores/auth.store'

// Permission actions
export type PermissionAction =
    | 'VIEW'
    | 'CREATE'
    | 'EDIT'
    | 'DELETE'
    | 'APPROVE'
    | 'REJECT'
    | 'EXPORT'
    | 'IMPORT'
    | 'ADMIN'

// Feature categories
export type FeatureCategory =
    | 'DASHBOARD'
    | 'USERS'
    | 'REGISTRATION_REQUESTS'
    | 'PRODUCTS'
    | 'ORDERS'
    | 'REPORTS'
    | 'SETTINGS'

/**
 * Permission Matrix
 * Maps each role to its allowed actions for each feature
 */
export const PERMISSION_MATRIX: Record<
    FeatureCategory,
    Record<PermissionAction, UserRole[]>
> = {
    DASHBOARD: {
        VIEW: ['OWNER', 'ADMIN', 'STAFF', 'VIEWER'],
        CREATE: [],
        EDIT: [],
        DELETE: [],
        APPROVE: [],
        REJECT: [],
        EXPORT: ['OWNER', 'ADMIN'],
        IMPORT: [],
        ADMIN: [],
    },

    USERS: {
        VIEW: ['OWNER'],
        CREATE: ['OWNER'],
        EDIT: ['OWNER'], // Can edit role, status
        DELETE: ['OWNER'], // Cannot delete OWNER users
        APPROVE: [],
        REJECT: [],
        EXPORT: ['OWNER'],
        IMPORT: ['OWNER'],
        ADMIN: ['OWNER'],
    },

    REGISTRATION_REQUESTS: {
        VIEW: ['OWNER'],
        CREATE: [], // Users create via public endpoint
        EDIT: [],
        DELETE: [],
        APPROVE: ['OWNER'],
        REJECT: ['OWNER'],
        EXPORT: ['OWNER'],
        IMPORT: ['OWNER'],
        ADMIN: ['OWNER'],
    },

    PRODUCTS: {
        VIEW: ['OWNER', 'ADMIN', 'STAFF', 'VIEWER'], // STAFF/VIEWER see own only
        CREATE: ['OWNER', 'ADMIN', 'STAFF'],
        EDIT: ['OWNER', 'ADMIN', 'STAFF'], // STAFF can edit own only
        DELETE: ['OWNER', 'ADMIN'],
        APPROVE: [],
        REJECT: [],
        EXPORT: ['OWNER', 'ADMIN'],
        IMPORT: ['OWNER', 'ADMIN'],
        ADMIN: ['OWNER', 'ADMIN'],
    },

    ORDERS: {
        VIEW: ['OWNER', 'ADMIN', 'STAFF', 'VIEWER'],
        CREATE: ['OWNER', 'ADMIN', 'STAFF'],
        EDIT: ['OWNER', 'ADMIN', 'STAFF'],
        DELETE: ['OWNER', 'ADMIN'],
        APPROVE: ['OWNER', 'ADMIN'],
        REJECT: ['OWNER', 'ADMIN'],
        EXPORT: ['OWNER', 'ADMIN'],
        IMPORT: [],
        ADMIN: ['OWNER', 'ADMIN'],
    },

    REPORTS: {
        VIEW: ['OWNER', 'ADMIN', 'STAFF'],
        CREATE: [],
        EDIT: [],
        DELETE: [],
        APPROVE: [],
        REJECT: [],
        EXPORT: ['OWNER', 'ADMIN'],
        IMPORT: [],
        ADMIN: ['OWNER'],
    },

    SETTINGS: {
        VIEW: ['OWNER', 'ADMIN'],
        CREATE: [],
        EDIT: ['OWNER'],
        DELETE: [],
        APPROVE: [],
        REJECT: [],
        EXPORT: [],
        IMPORT: [],
        ADMIN: ['OWNER'],
    },
}

/**
 * Route access control
 * Maps routes to required roles
 */
export const ROUTE_PERMISSIONS: Record<string, UserRole[]> = {
    '/dashboard': ['OWNER', 'ADMIN', 'STAFF', 'VIEWER'],
    '/dashboard/users': ['OWNER'],
    '/dashboard/registration-requests': ['OWNER'],
    '/dashboard/products': ['OWNER', 'ADMIN', 'STAFF', 'VIEWER'],
    '/dashboard/orders': ['OWNER', 'ADMIN', 'STAFF', 'VIEWER'],
    '/dashboard/reports': ['OWNER', 'ADMIN', 'STAFF'],
    '/dashboard/settings': ['OWNER', 'ADMIN'],
}

/**
 * Helper function to check if role has permission
 */
export function hasPermission(
    userRole: UserRole | null | undefined,
    feature: FeatureCategory,
    action: PermissionAction,
): boolean {
    if (!userRole) return false

    const allowedRoles = PERMISSION_MATRIX[feature]?.[action] || []
    return allowedRoles.includes(userRole)
}

/**
 * Helper function to check if role can access route
 */
export function canAccessRoute(
    userRole: UserRole | null | undefined,
    route: string,
): boolean {
    if (!userRole) return false

    // Exact match
    if (ROUTE_PERMISSIONS[route]) {
        return ROUTE_PERMISSIONS[route].includes(userRole)
    }

    // Partial match (e.g., /dashboard/products/123 matches /dashboard/products)
    const matchingRoute = Object.keys(ROUTE_PERMISSIONS).find(r => route.startsWith(r))
    if (matchingRoute && ROUTE_PERMISSIONS[matchingRoute]) {
        return ROUTE_PERMISSIONS[matchingRoute].includes(userRole)
    }

    // Default: deny access if route not found
    return false
}

/**
 * Get all permissions for a specific role
 */
export function getRolePermissions(role: UserRole): {
    feature: FeatureCategory
    actions: PermissionAction[]
}[] {
    return Object.entries(PERMISSION_MATRIX).map(([feature, permissions]) => ({
        feature: feature as FeatureCategory,
        actions: Object.entries(permissions)
            .filter(([_, roles]) => roles.includes(role))
            .map(([action]) => action as PermissionAction),
    }))
}

/**
 * Role hierarchy levels
 * Higher number = more permissions
 */
export const ROLE_LEVELS: Record<UserRole, number> = {
    VIEWER: 1,
    STAFF: 2,
    ADMIN: 3,
    OWNER: 4,
}

/**
 * Check if user role is higher or equal to required role
 */
export function hasRoleLevel(userRole: UserRole | null | undefined, requiredRole: UserRole): boolean {
    if (!userRole) return false
    return ROLE_LEVELS[userRole] >= ROLE_LEVELS[requiredRole]
}
