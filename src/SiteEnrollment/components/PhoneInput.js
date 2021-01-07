//Dependency Imports
import React from "react";
import TextField from "@material-ui/core/TextField";

const phoneInput = (props, ref) => {
  return (
    <TextField
      {...props}
      inputRef={ref}
      autoComplete="new-phone"
      fullWidth
      size="small"
      label="Phone Number"
      name="phone"
    />
  );
};

export default React.forwardRef(phoneInput);
