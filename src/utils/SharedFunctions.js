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
