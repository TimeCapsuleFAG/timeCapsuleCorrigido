import * as React from "react";
import Toast from 'react-native-toast-message';

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 4000; // Reduzido para mobile

// Tipos adaptados para React Native
type ToastType = 'success' | 'error' | 'info' | 'warning';

type ToasterToast = {
  id: string;
  type?: ToastType;
  title?: string;
  description?: string;
  duration?: number;
  position?: 'top' | 'bottom';
  onPress?: () => void;
  onHide?: () => void;
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

type ActionType = typeof actionTypes;

type Action =
  | {
      type: ActionType["ADD_TOAST"];
      toast: ToasterToast;
    }
  | {
      type: ActionType["UPDATE_TOAST"];
      toast: Partial<ToasterToast>;
    }
  | {
      type: ActionType["DISMISS_TOAST"];
      toastId?: ToasterToast["id"];
    }
  | {
      type: ActionType["REMOVE_TOAST"];
      toastId?: ToasterToast["id"];
    };

interface State {
  toasts: ToasterToast[];
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    case "DISMISS_TOAST": {
      const { toastId } = action;

      if (toastId) {
        addToRemoveQueue(toastId);
        Toast.hide();
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id);
        });
        Toast.hide();
      }

      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== toastId),
      };
    }

    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
  }
};

const listeners: Array<(state: State) => void> = [];

let memoryState: State = { toasts: [] };

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

type ToastInput = Omit<ToasterToast, "id">;

function toast({ type = 'info', title, description, duration, position = 'top', onPress, onHide }: ToastInput) {
  const id = genId();

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    });

  const dismiss = () => {
    dispatch({ type: "DISMISS_TOAST", toastId: id });
  };

  // Mostrar o toast usando react-native-toast-message
  Toast.show({
    type: type,
    text1: title,
    text2: description,
    position: position,
    visibilityTime: duration || TOAST_REMOVE_DELAY,
    onPress: onPress,
    onHide: () => {
      onHide?.();
      dismiss();
    },
  });

  dispatch({
    type: "ADD_TOAST",
    toast: {
      id,
      type,
      title,
      description,
      duration,
      position,
      onPress,
      onHide,
    },
  });

  return {
    id: id,
    dismiss,
    update,
  };
}

// Funções de conveniência
toast.success = (title: string, description?: string) => 
  toast({ type: 'success', title, description });

toast.error = (title: string, description?: string) => 
  toast({ type: 'error', title, description });

toast.info = (title: string, description?: string) => 
  toast({ type: 'info', title, description });

toast.warning = (title: string, description?: string) => 
  toast({ type: 'warning', title, description });

function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  };
}

export { useToast, toast };