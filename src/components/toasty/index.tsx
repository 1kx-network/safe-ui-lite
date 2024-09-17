import toast, { ToastOptions } from 'react-hot-toast';

import { styledToaster } from './toasty.styles';

type ToastType = 'loading' | 'success' | 'error';

export const customToasty = (title: string, type?: ToastType, opt?: ToastOptions) => {
  const toastType = type ? toast[type] : toast;

  toastType(
    t => (
      <div suppressHydrationWarning onClick={() => toast.dismiss(t.id)}>
        {title}
      </div>
    ),
    {
      duration: Infinity,
      position: 'top-right',
      style: styledToaster,
      ...opt,
    }
  );
};
