
import * as React from 'react'
import type { ToastActionElement, ToastProps } from '@/components/ui/toast'

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
  open: boolean
}

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
      useToast().dismiss(toastId)
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

      // Side effects - This could be improved
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

// Singleton to store state across components
const TOAST_STORE = {
  state: { toasts: [] } as State,
  listeners: new Set<React.Dispatch<React.SetStateAction<State>>>(),
  
  dispatch(action: ToastAction) {
    TOAST_STORE.state = reducer(TOAST_STORE.state, action)
    TOAST_STORE.listeners.forEach(listener => {
      listener(TOAST_STORE.state)
    })
  },

  subscribe(listener: React.Dispatch<React.SetStateAction<State>>) {
    TOAST_STORE.listeners.add(listener)
    return () => {
      TOAST_STORE.listeners.delete(listener)
    }
  }
}

export function useToast() {
  const [state, setState] = React.useState<State>(TOAST_STORE.state)

  React.useEffect(() => {
    const unsubscribe = TOAST_STORE.subscribe(setState)
    return unsubscribe
  }, [])

  const { toasts } = state

  React.useEffect(() => {
    return () => {
      toasts.forEach((t) => {
        clearTimeout(toastTimeouts.get(t.id))
      })
    }
  }, [toasts])

  const toast = React.useCallback(
    ({ ...props }: Omit<ToasterToast, 'id' | 'open'>) => {
      const id = generateId()

      TOAST_STORE.dispatch({
        type: 'ADD_TOAST',
        toast: {
          ...props,
          id,
          open: true,
        },
      })

      // Auto dismiss toast after 0.5 seconds
      setTimeout(() => {
        TOAST_STORE.dispatch({
          type: 'DISMISS_TOAST',
          toastId: id,
        })
      }, 500);

      return id;
    },
    []
  )

  const dismiss = React.useCallback(
    (toastId?: string) => {
      TOAST_STORE.dispatch({
        type: 'DISMISS_TOAST',
        toastId: toastId,
      })
    },
    []
  )

  return {
    toast,
    dismiss,
    toasts,
  }
}

// Helper function to directly call toast
export const toast = (props: Omit<ToasterToast, 'id' | 'open'>) => {
  return useToast().toast(props);
}

// Re-export Toaster from sonner
import { Toaster } from "@/components/ui/sonner"
export { Toaster }
