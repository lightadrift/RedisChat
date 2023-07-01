import { useEffect, useRef, useState } from "react";

export const runOnce = (effect: any) => {
  const effectFn = useRef(effect);
  const destroyFn = useRef<(() => void) | undefined>();
  const effectCalled = useRef(false);
  const rendered = useRef(false);
  const [, setVal] = useState(0);
  if (effectCalled.current) {
    rendered.current = true;
  }

  useEffect(() => {
    // only execute the effect first time around
    if (!effectCalled.current) {
      destroyFn.current = effectFn.current();
      effectCalled.current = true;
    }
    // this forces one render after the effect is run
    setVal((val) => val + 1);
    return () => {
      // if the component didn't render since the useEffect was called,
      // we know it's the dummy React cycle
      if (!rendered.current) {
        return;
      }
      // otherwise this is not a dummy destroy, so call the destroy function
      if (destroyFn.current) {
        destroyFn.current();
      }
    };
  }, []);
};
