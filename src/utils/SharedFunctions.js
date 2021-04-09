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

export const createGithubIssue = async (
  issueTitle,
  body,
  labels,
  assignees,
  nickname,
  token
  ) => {
    const data = {
      action: 'create',
      user: nickname,
      title: issueTitle,
      assignees: assignees,
      labels: labels,
      body: body,
      token: token,
    };

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
      mode: 'cors', // no-cors, *cors, same-origin
    }

    let res = await fetch(`https://githubissues.azurewebsites.us/api/githubissues`, options)
    .then(response => {
      console.log(response)
      return response;
    })
    .catch(err => {
      console.log("error reading data " + err)
    })
    
    // console.log(res.status)

    return res;
}
export const createGithubComment = async (
  nickname,
  newComment,
  number,
  token
  ) => {
    const data = {
      action: 'comment',
      user: nickname,
      comment: newComment,
      number: number,
      token: token,
    };

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
      mode: 'cors', // no-cors, *cors, same-origin
    }

    let res = await fetch(`https://githubissues.azurewebsites.us/api/githubissues`, options)
    .then(response => {
      console.log(response)
      return response;
    })
    .catch(err => {
      console.log("error reading data " + err)
    })

    return res;
}