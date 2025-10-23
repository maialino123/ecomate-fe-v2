/**
 * usePermission Hook
 *
 * Provides permission checking utilities based on user's role
 */

import { useMemo } from 'react'
import { useAuthStore, UserRole, User } from '../../stores/auth.store'
import {
    hasPermission,
    canAccessRoute,
    hasRoleLevel,
    FeatureCategory,
    PermissionAction,
    ROLE_LEVELS,
} from '../../constants/permissions'

export interface PermissionHookResult {
    // User info
    user: User | null
    role: UserRole | null
    isAuthenticated: boolean

    // Role checks
    isOwner: boolean
    isAdmin: boolean
    isStaff: boolean
    isViewer: boolean

    // Generic permission checks
    hasRole: (role: UserRole) => boolean
    hasAnyRole: (roles: UserRole[]) => boolean
    hasRoleOrHigher: (role: UserRole) => boolean

    // Feature-based permission checks
    can: (feature: FeatureCategory, action: PermissionAction) => boolean
    canView: (feature: FeatureCategory) => boolean
    canCreate: (feature: FeatureCategory) => boolean
    canEdit: (feature: FeatureCategory) => boolean
    canDelete: (feature: FeatureCategory) => boolean
    canApprove: (feature: FeatureCategory) => boolean
    canReject: (feature: FeatureCategory) => boolean
    canExport: (feature: FeatureCategory) => boolean
    canImport: (feature: FeatureCategory) => boolean
    canAdmin: (feature: FeatureCategory) => boolean

    // Route access
    canAccessRoute: (route: string) => boolean

    // Quick permission checks
    isSuperUser: boolean
    canManageUsers: boolean
    canApproveUsers: boolean
    canManageProducts: boolean
    canManageOrders: boolean
    canViewReports: boolean
    canManageSettings: boolean
}

/**
 * Hook to check user permissions
 *
 * @example
 * const { can, isOwner, canEdit } = usePermission()
 *
 * if (can('USERS', 'DELETE')) {
 *   // Show delete button
 * }
 *
 * if (canEdit('PRODUCTS')) {
 *   // Show edit form
 * }
 */
export function usePermission(): PermissionHookResult {
    const { user, isAuthenticated } = useAuthStore()
    const role = user?.role || null

    return useMemo(() => {
        // Role checks
        const isOwner = role === 'OWNER'
        const isAdmin = role === 'ADMIN'
        const isStaff = role === 'STAFF'
        const isViewer = role === 'VIEWER'

        // Generic role checks
        const hasRoleFn = (requiredRole: UserRole): boolean => {
            return role === requiredRole
        }

        const hasAnyRoleFn = (roles: UserRole[]): boolean => {
            return role !== null && roles.includes(role)
        }

        const hasRoleOrHigherFn = (requiredRole: UserRole): boolean => {
            return hasRoleLevel(role, requiredRole)
        }

        // Feature-based permission checks
        const can = (feature: FeatureCategory, action: PermissionAction): boolean => {
            return hasPermission(role, feature, action)
        }

        const canView = (feature: FeatureCategory): boolean => {
            return can(feature, 'VIEW')
        }

        const canCreate = (feature: FeatureCategory): boolean => {
            return can(feature, 'CREATE')
        }

        const canEdit = (feature: FeatureCategory): boolean => {
            return can(feature, 'EDIT')
        }

        const canDelete = (feature: FeatureCategory): boolean => {
            return can(feature, 'DELETE')
        }

        const canApprove = (feature: FeatureCategory): boolean => {
            return can(feature, 'APPROVE')
        }

        const canReject = (feature: FeatureCategory): boolean => {
            return can(feature, 'REJECT')
        }

        const canExport = (feature: FeatureCategory): boolean => {
            return can(feature, 'EXPORT')
        }

        const canImport = (feature: FeatureCategory): boolean => {
            return can(feature, 'IMPORT')
        }

        const canAdmin = (feature: FeatureCategory): boolean => {
            return can(feature, 'ADMIN')
        }

        const canAccessRouteFn = (route: string): boolean => {
            return canAccessRoute(role, route)
        }

        // Quick permission checks
        const isSuperUser = isOwner
        const canManageUsers = can('USERS', 'ADMIN')
        const canApproveUsers = can('REGISTRATION_REQUESTS', 'APPROVE')
        const canManageProducts = can('PRODUCTS', 'ADMIN')
        const canManageOrders = can('ORDERS', 'ADMIN')
        const canViewReports = can('REPORTS', 'VIEW')
        const canManageSettings = can('SETTINGS', 'ADMIN')

        return {
            // User info
            user,
            role,
            isAuthenticated,

            // Role checks
            isOwner,
            isAdmin,
            isStaff,
            isViewer,

            // Generic checks
            hasRole: hasRoleFn,
            hasAnyRole: hasAnyRoleFn,
            hasRoleOrHigher: hasRoleOrHigherFn,

            // Feature checks
            can,
            canView,
            canCreate,
            canEdit,
            canDelete,
            canApprove,
            canReject,
            canExport,
            canImport,
            canAdmin,

            // Route access
            canAccessRoute: canAccessRouteFn,

            // Quick checks
            isSuperUser,
            canManageUsers,
            canApproveUsers,
            canManageProducts,
            canManageOrders,
            canViewReports,
            canManageSettings,
        }
    }, [user, role, isAuthenticated])
}

/**
 * Hook variant for checking specific permission
 * Returns boolean directly
 *
 * @example
 * const canDeleteUser = useHasPermission('USERS', 'DELETE')
 * {canDeleteUser && <DeleteButton />}
 */
export function useHasPermission(
    feature: FeatureCategory,
    action: PermissionAction,
): boolean {
    const { user } = useAuthStore()
    const role = user?.role || null
    return useMemo(() => hasPermission(role, feature, action), [role, feature, action])
}

/**
 * Hook variant for checking role
 * Returns boolean directly
 *
 * @example
 * const isOwner = useHasRole('OWNER')
 * {isOwner && <AdminPanel />}
 */
export function useHasRole(requiredRole: UserRole): boolean {
    const { user } = useAuthStore()
    return useMemo(() => user?.role === requiredRole, [user?.role, requiredRole])
}

/**
 * Hook variant for checking any of multiple roles
 * Returns boolean directly
 *
 * @example
 * const canManage = useHasAnyRole(['OWNER', 'ADMIN'])
 * {canManage && <ManagementPanel />}
 */
export function useHasAnyRole(roles: UserRole[]): boolean {
    const { user } = useAuthStore()
    return useMemo(
        () => user?.role !== undefined && roles.includes(user.role),
        [user?.role, roles],
    )
}
