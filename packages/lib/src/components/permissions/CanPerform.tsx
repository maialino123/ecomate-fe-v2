/**
 * CanPerform Component
 *
 * Conditional rendering based on user permissions
 * Wraps children and only renders if user has required permission
 */

import React, { ReactNode } from 'react'
import { UserRole } from '../../stores/auth.store'
import { FeatureCategory, PermissionAction } from '../../constants/permissions'
import { usePermission } from '../../hooks/permissions'

interface CanPerformProps {
    children: ReactNode
    fallback?: ReactNode

    // Option 1: Check specific feature + action
    feature?: FeatureCategory
    action?: PermissionAction

    // Option 2: Check role directly
    requiredRole?: UserRole
    requiredRoles?: UserRole[]

    // Option 3: Custom condition
    when?: boolean
}

/**
 * CanPerform Component
 *
 * @example
 * // Check feature permission
 * <CanPerform feature="USERS" action="DELETE">
 *   <DeleteButton />
 * </CanPerform>
 *
 * @example
 * // Check role
 * <CanPerform requiredRole="OWNER">
 *   <AdminPanel />
 * </CanPerform>
 *
 * @example
 * // Check any of multiple roles
 * <CanPerform requiredRoles={['OWNER', 'ADMIN']}>
 *   <ManagementSection />
 * </CanPerform>
 *
 * @example
 * // Custom condition
 * <CanPerform when={user.id === product.ownerId}>
 *   <EditButton />
 * </CanPerform>
 *
 * @example
 * // With fallback
 * <CanPerform
 *   feature="USERS"
 *   action="DELETE"
 *   fallback={<span>No permission</span>}
 * >
 *   <DeleteButton />
 * </CanPerform>
 */
export function CanPerform({
    children,
    fallback = null,
    feature,
    action,
    requiredRole,
    requiredRoles,
    when,
}: CanPerformProps) {
    const { can, hasRole, hasAnyRole } = usePermission()

    // Determine if user can perform action
    let canPerform = false

    // Option 1: Check feature + action
    if (feature && action) {
        canPerform = can(feature, action)
    }
    // Option 2: Check specific role
    else if (requiredRole) {
        canPerform = hasRole(requiredRole)
    }
    // Option 3: Check any of multiple roles
    else if (requiredRoles && requiredRoles.length > 0) {
        canPerform = hasAnyRole(requiredRoles)
    }
    // Option 4: Custom condition
    else if (when !== undefined) {
        canPerform = when
    }
    // Default: if no conditions specified, allow (fail-open for flexibility)
    else {
        console.warn('CanPerform: No permission criteria specified')
        canPerform = true
    }

    return canPerform ? <>{children}</> : <>{fallback}</>
}

/**
 * CanView Component
 * Shorthand for checking VIEW permission
 */
export function CanView({
    feature,
    children,
    fallback = null,
}: {
    feature: FeatureCategory
    children: ReactNode
    fallback?: ReactNode
}) {
    return (
        <CanPerform feature={feature} action="VIEW" fallback={fallback}>
            {children}
        </CanPerform>
    )
}

/**
 * CanEdit Component
 * Shorthand for checking EDIT permission
 */
export function CanEdit({
    feature,
    children,
    fallback = null,
}: {
    feature: FeatureCategory
    children: ReactNode
    fallback?: ReactNode
}) {
    return (
        <CanPerform feature={feature} action="EDIT" fallback={fallback}>
            {children}
        </CanPerform>
    )
}

/**
 * CanDelete Component
 * Shorthand for checking DELETE permission
 */
export function CanDelete({
    feature,
    children,
    fallback = null,
}: {
    feature: FeatureCategory
    children: ReactNode
    fallback?: ReactNode
}) {
    return (
        <CanPerform feature={feature} action="DELETE" fallback={fallback}>
            {children}
        </CanPerform>
    )
}

/**
 * CanCreate Component
 * Shorthand for checking CREATE permission
 */
export function CanCreate({
    feature,
    children,
    fallback = null,
}: {
    feature: FeatureCategory
    children: ReactNode
    fallback?: ReactNode
}) {
    return (
        <CanPerform feature={feature} action="CREATE" fallback={fallback}>
            {children}
        </CanPerform>
    )
}

/**
 * IsOwner Component
 * Shorthand for checking OWNER role
 */
export function IsOwner({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) {
    return (
        <CanPerform requiredRole="OWNER" fallback={fallback}>
            {children}
        </CanPerform>
    )
}

/**
 * IsAdmin Component
 * Shorthand for checking ADMIN role (or higher)
 */
export function IsAdmin({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) {
    return (
        <CanPerform requiredRoles={['OWNER', 'ADMIN']} fallback={fallback}>
            {children}
        </CanPerform>
    )
}
