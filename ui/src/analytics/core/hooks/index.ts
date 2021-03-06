import {useEffect, useRef, useMemo} from "react";
import { getTokenIconFromID } from "../format";

export function useInterval(callback, delay) {
  const ref = useRef<Function>();

  useEffect(() => {
    ref.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      ref.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
