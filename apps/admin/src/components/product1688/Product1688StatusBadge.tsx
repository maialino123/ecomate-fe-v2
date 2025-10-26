import { Product1688Status } from '@workspace/lib'

interface Product1688StatusBadgeProps {
  status: Product1688Status
}

export function Product1688StatusBadge({ status }: Product1688StatusBadgeProps) {
  const config = {
    [Product1688Status.PENDING_REVIEW]: {
      bg: 'bg-yellow-100 dark:bg-yellow-900/20',
      text: 'text-yellow-800 dark:text-yellow-400',
      label: 'Pending Review',
    },
    [Product1688Status.TRANSLATED]: {
      bg: 'bg-blue-100 dark:bg-blue-900/20',
      text: 'text-blue-800 dark:text-blue-400',
      label: 'Translated',
    },
    [Product1688Status.APPROVED]: {
      bg: 'bg-green-100 dark:bg-green-900/20',
      text: 'text-green-800 dark:text-green-400',
      label: 'Approved',
    },
    [Product1688Status.REJECTED]: {
      bg: 'bg-red-100 dark:bg-red-900/20',
      text: 'text-red-800 dark:text-red-400',
      label: 'Rejected',
    },
  }

  const { bg, text, label } = config[status] || config[Product1688Status.PENDING_REVIEW]

  return (
    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${bg} ${text}`}>{label}</span>
  )
}
