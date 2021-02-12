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

// tried, performance issues
export function useWindowResize() {
  console.log("hi");
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  const listener = () => {
    console.log("hi1");
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  };

  useEffect(() => {
    console.log("hi2");
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

// tried, performance issues
// function getWindowDimensions() {
//   const { innerWidth: width, innerHeight: height } = window;
//   return {
//     width,
//     height
//   };
// }

// export default function useWindowDimensions() {
//   const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

//   useEffect(() => {
//     function handleResize() {
//       setWindowDimensions(getWindowDimensions());
//     }

//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   return windowDimensions;
// }

// trying now
// export function useWindowDimensions() {

//   const hasWindow = typeof window !== 'undefined';

//   function getWindowDimensions() {
//     const width = hasWindow ? window.innerWidth : null;
//     const height = hasWindow ? window.innerHeight : null;
//     return {
//       width,
//       height,
//     };
//   }

//   const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

//   useEffect(() => {
//     if (hasWindow) {
//       function handleResize() {
//         setWindowDimensions(getWindowDimensions());
//       }

//       window.addEventListener('resize', handleResize);
//       return () => window.removeEventListener('resize', handleResize);
//     }
//   }, [hasWindow]);

//   return windowDimensions;
// }

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

export function useWindowDimensions() {
  const [dimensions, setDimensions] = useState({ 
    height: window.innerHeight,
    width: window.innerWidth
  })

  useEffect(() => {
    const debouncedHandleResize = debounce(function handleResize() {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth
      })
    }, 1000)

    window.addEventListener('resize', debouncedHandleResize)

    return _ => {
      window.removeEventListener('resize', debouncedHandleResize)
    
  }})

  return dimensions;
}
