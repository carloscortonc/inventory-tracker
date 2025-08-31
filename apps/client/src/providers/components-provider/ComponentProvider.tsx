import React from "react";
import { Toast } from "./types";
import FeedbackToast from "./Toasts";
import "./styles.css";
import { createPortal } from "react-dom";

type ComponentContext = {
  createToast: (t: string | Toast) => void;
};
type ComponentsState = { toast?: Toast };
const ComponentContext = React.createContext({} as ComponentContext);
const providerId = "component-provider";
const ComponentProvider = (props: { children: React.ReactNode }) => {
  const [state, setState] = React.useState<ComponentsState>({});
  const toastTimeoutIdRef = React.useRef(0);

  const value: ComponentContext = React.useMemo(
    () => ({
      createToast: (t) => {
        const toast: Toast = typeof t === "string" ? { text: t } : t;
        window.clearTimeout(toastTimeoutIdRef.current);
        toastTimeoutIdRef.current = window.setTimeout(
          () => setState((curr) => ({ ...curr, toast: undefined })),
          toast.delay || 1000,
        );
        setState((curr) => ({ ...curr, toast }));
      },
    }),
    [setState],
  );

  return (
    <ComponentContext.Provider value={value}>
      {props.children}
      <div id={providerId}>{state.toast && <FeedbackToast text={state.toast.text} />}</div>
    </ComponentContext.Provider>
  );
};

export const useComponents = () => React.useContext(ComponentContext);

export const ComponentWrapper = (props: { children: React.ReactNode }) => {
  return createPortal(props.children, document.getElementById(providerId)!);
};

export default ComponentProvider;
