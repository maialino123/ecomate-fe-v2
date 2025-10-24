import { toast as sonnerToast } from 'sonner';

export function useToast() {
  return {
    toast: (props: {
      title?: string;
      description?: string;
      variant?: 'default' | 'success' | 'error' | 'warning';
    }) => {
      const { title, description, variant = 'default' } = props;

      const message = title || description || '';

      switch (variant) {
        case 'success':
          return sonnerToast.success(title, { description });
        case 'error':
          return sonnerToast.error(title, { description });
        case 'warning':
          return sonnerToast.warning(title, { description });
        default:
          return sonnerToast(title, { description });
      }
    },
    success: (title: string, description?: string) => {
      return sonnerToast.success(title, { description });
    },
    error: (title: string, description?: string) => {
      return sonnerToast.error(title, { description });
    },
    warning: (title: string, description?: string) => {
      return sonnerToast.warning(title, { description });
    },
    info: (title: string, description?: string) => {
      return sonnerToast(title, { description });
    },
  };
}
