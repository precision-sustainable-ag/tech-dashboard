import React from "react";
import FlareComponent from "flare-react";

const Login = () => {
  return (
    <div>
      <div>LOGIN</div>
      <FlareComponent
        width={200}
        height={200}
        animationName="check"
        file="success-check.flr"
      />
    </div>
  );
};

export default Login;
