import React from 'react';

export type UndoAction = {
  label: string;
  undo: () => void;
};

export const useUndoWindow = (durationMs = 5000) => {
  const [undoAction, setUndoAction] = React.useState<UndoAction | null>(null);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const startUndoWindow = (action: UndoAction) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setUndoAction(action);
    timerRef.current = setTimeout(() => {
      setUndoAction(null);
      timerRef.current = null;
    }, durationMs);
  };

  const consumeUndo = () => {
    if (!undoAction) {
      return false;
    }

    undoAction.undo();
    setUndoAction(null);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    return true;
  };

  return {
    undoAction,
    startUndoWindow,
    consumeUndo,
  };
};