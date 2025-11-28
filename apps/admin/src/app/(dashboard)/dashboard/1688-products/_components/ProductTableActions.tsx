'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import { useApi } from '@workspace/shared/providers'
import type { Product1688Entity } from '@workspace/lib'
import { Product1688Status, useProduct1688Delete } from '@workspace/lib'
import { Eye, Trash2, Loader2, MoreHorizontal } from 'lucide-react'
import { Button } from '@workspace/ui/components/Button'
import {
  TranslateDialog,
  ApproveDialog,
  RejectDialog,
} from '../../../../../components/product1688'

interface ProductTableActionsProps {
  product: Product1688Entity
  onRefetch?: () => void
}

export const ProductTableActions = ({ product, onRefetch }: ProductTableActionsProps) => {
  const router = useRouter()
  const api = useApi()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const deleteMutation = useProduct1688Delete({
    api,
    onSuccess: () => {
      setShowDeleteConfirm(false)
      onRefetch?.()
    },
  })

  const handleDelete = () => {
    deleteMutation.mutate(product.id)
  }

  // Calculate menu position when opening
  const handleToggleMenu = useCallback(() => {
    if (!showMenu && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setMenuPosition({
        top: rect.bottom + 4,
        right: window.innerWidth - rect.right,
      })
    }
    setShowMenu(!showMenu)
  }, [showMenu])

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <>
      <div className="flex items-center justify-end gap-1">
        {/* Desktop: Show inline actions */}
        <div className="hidden lg:flex items-center gap-1">
          {/* View Details */}
          <button
            onClick={() => router.push(`/dashboard/1688-products/${product.id}`)}
            className="p-1.5 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Xem chi tiết"
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Translate (if not translated) */}
          {product.status === Product1688Status.PENDING_REVIEW && (
            <TranslateDialog
              productId={product.id}
              productName={product.nameVi || product.nameZh}
              onSuccess={onRefetch}
            />
          )}

          {/* Approve (if translated or rejected) */}
          {(product.status === Product1688Status.TRANSLATED ||
            product.status === Product1688Status.REJECTED) && (
            <ApproveDialog product={product} onSuccess={onRefetch} />
          )}

          {/* Reject (if not approved) */}
          {product.status !== Product1688Status.APPROVED && (
            <RejectDialog product={product} onSuccess={onRefetch} />
          )}

          {/* Delete */}
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="p-1.5 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Xóa"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile/Tablet: Show action buttons in compact dropdown */}
        <div className="lg:hidden">
          <button
            ref={buttonRef}
            onClick={handleToggleMenu}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Thao tác"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>

          {/* Portal dropdown menu - rendered outside table to avoid z-index issues */}
          {showMenu && typeof document !== 'undefined' && createPortal(
            <div
              ref={menuRef}
              className="fixed bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-2 z-[9999] min-w-max"
              style={{
                top: menuPosition.top,
                right: menuPosition.right,
              }}
            >
              <div className="flex items-center gap-1">
                {/* View Details */}
                <button
                  onClick={() => {
                    router.push(`/dashboard/1688-products/${product.id}`)
                    setShowMenu(false)
                  }}
                  className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                  title="Xem chi tiết"
                >
                  <Eye className="w-4 h-4" />
                </button>

                {/* Translate */}
                {product.status === Product1688Status.PENDING_REVIEW && (
                  <div onClick={() => setShowMenu(false)}>
                    <TranslateDialog
                      productId={product.id}
                      productName={product.nameVi || product.nameZh}
                      onSuccess={onRefetch}
                    />
                  </div>
                )}

                {/* Approve */}
                {(product.status === Product1688Status.TRANSLATED ||
                  product.status === Product1688Status.REJECTED) && (
                  <div onClick={() => setShowMenu(false)}>
                    <ApproveDialog product={product} onSuccess={onRefetch} />
                  </div>
                )}

                {/* Reject */}
                {product.status !== Product1688Status.APPROVED && (
                  <div onClick={() => setShowMenu(false)}>
                    <RejectDialog product={product} onSuccess={onRefetch} />
                  </div>
                )}

                {/* Delete */}
                <button
                  onClick={() => {
                    setShowDeleteConfirm(true)
                    setShowMenu(false)
                  }}
                  className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                  title="Xóa"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>,
            document.body
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4 text-red-600 dark:text-red-400">
              Xóa sản phẩm
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác.
            </p>
            <div className="flex gap-2">
              <Button
                onClick={handleDelete}
                isDisabled={deleteMutation.isPending}
                variant="destructive"
                className="flex-1"
              >
                {deleteMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Xóa'
                )}
              </Button>
              <Button onClick={() => setShowDeleteConfirm(false)} variant="outline" className="flex-1">
                Hủy
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
