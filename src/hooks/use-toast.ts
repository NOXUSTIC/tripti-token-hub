import React from 'react'
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { type ToasterToast } from '@/components/ui/sonner'

type ToastAction = {
  type: 'ADD_TOAST'
  toast: ToasterToast
} | {
  type: 'UPDATE_TOAST'
  toast: Partial<ToasterToast>
} | {
  type: 'DISMISS_TOAST'
  toastId?: string
} | {
  type: 'REMOVE_TOAST'
  toastId?: string
}

interface State {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  toastTimeouts.set(
    toastId,
    setTimeout(() => {
      useToast.dispatch({
        type: 'REMOVE_TOAST',
        toastId: toastId,
      })
    }, 800)
  )
}

export const reducer = (state: State, action: ToastAction): State => {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [action.toast, ...state.toasts],
      }

    case 'UPDATE_TOAST':
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case 'DISMISS_TOAST': {
      const { toastId } = action

      // ! Side effects ! - This could be improved
      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
              ...t,
              open: false,
            }
            : t
        ),
      }
    }
    case 'REMOVE_TOAST':
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

const generateId = () => {
  return Math.random().toString(36).substring(2)
}

export const useToast = () => {
  const [state, dispatch] = React.useReducer(reducer, {
    toasts: [],
  } as State)

  const { toasts } = state

  React.useEffect(() => {
    return () => {
      toasts.forEach((t) => {
        clearTimeout(toastTimeouts.get(t.id))
      })
    }
  }, [toasts])

  const toast = React.useCallback(
    ({ ...props }: Omit<ToasterToast, 'id'>) => {
      const id = generateId()

      dispatch({
        type: 'ADD_TOAST',
        toast: {
          ...props,
          id,
        },
      })
    },
    [dispatch]
  )

  const dismiss = React.useCallback(
    (toastId?: string) => {
      dispatch({
        type: 'DISMISS_TOAST',
        toastId: toastId,
      })
    },
    [dispatch]
  )

  return {
    toast,
    dismiss,
    toasts,
  }
}

export const { Toaster } = Sonner
