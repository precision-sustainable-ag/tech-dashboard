const Reducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_HELLO_WORLD":
      return updateHelloWorld(state, action);
  }
};

const updateHelloWorld = (state, action) => {
  return { ...state, helloText: "hi world" };
};

export default Reducer;
