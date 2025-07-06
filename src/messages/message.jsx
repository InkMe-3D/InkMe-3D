import { Alert, Snackbar } from "@mui/material";
import React, { useContext } from "react";
import { useMyContext } from "../context/MyContext";

const Message = () => {
  return (
    <div>
      <Alert severity="error">This is an error Alert.</Alert>
    </div>
  );
};

export default Message;
