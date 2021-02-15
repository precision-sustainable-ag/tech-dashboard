import { useContext, useState, useEffect } from "react";
import { Context } from "../Store/Store";

export const UserIsEditor = () => {
  const [state] = useContext(Context);
  if (
    state.userInfo.permissions.split(",").includes("all") ||
    state.userInfo.permissions.split(",").includes("edit") ||
    state.userInfo.permissions.split(",").includes("update")
  )
    return true;
  else return false;
};

// hook to fetch window size with no debounce 
// unused 
export function useWindowResize() {
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  const listener = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  };

  useEffect(() => {
    window.addEventListener("resize", listener);
    return () => {
      window.removeEventListener("resize", listener);
    };
  }, []);

  return {
    width,
    height,
  };
}

// debounce function delays function call 
// called by useWindowDimensions hook
function debounce(fn, ms) {
  let timer
  return _ => {
    clearTimeout(timer)
    timer = setTimeout(_ => {
      timer = null
      fn.apply(this, arguments)
    }, ms)
  };
}

// hook to fetch window dimensions using debounce, called in AllDataTable
// unused
export function useWindowDimensions() {
  const [dimensions, setDimensions] = useState({ 
    height: window.innerHeight,
    width: window.innerWidth
  });

  useEffect(() => {
    const debouncedHandleResize = debounce(function handleResize() {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth
      })
    }, 1500)

    window.addEventListener('resize', debouncedHandleResize)


    return _ => {
      window.removeEventListener('resize', debouncedHandleResize)
    }
  });

  return dimensions;
}