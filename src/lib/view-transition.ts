type Listener = (active: boolean) => void;

type TransitionDocument = Document & {
  startViewTransition?: (
    callback: () => void | Promise<void>,
  ) => { finished: Promise<void> };
};

const listeners = new Set<Listener>();
let patched = false;

function notify(active: boolean) {
  for (const listener of listeners) listener(active);
}

function patchOnce() {
  if (patched || typeof document === "undefined") return;
  patched = true;

  const doc = document as TransitionDocument;
  const native = doc.startViewTransition?.bind(doc);
  if (!native) return;

  doc.startViewTransition = (callback) => {
    notify(true);
    const transition = native(callback);
    transition.finished.finally(() => notify(false));
    return transition;
  };
}

export function onTransitionChange(listener: Listener): () => void {
  patchOnce();
  listeners.add(listener);
  return () => listeners.delete(listener);
}
