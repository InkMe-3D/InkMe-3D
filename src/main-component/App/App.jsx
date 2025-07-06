import React, { useContext } from "react";
import AllRoute from "../router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MyContext, MyProvider } from "../../context/MyContext";
import { Alert, Snackbar } from "@mui/material";

// import CustomCursor from '../../components/CustomCursor/CustomCursor';

const AppContent = () => {
  const { alterBox, handleClose } = useContext(MyContext);
  return (
    <div className="App" id="scrool">
      <AllRoute />

      {/* Snackbar + Alert */}
      <Snackbar
        open={alterBox.open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleClose}
          severity={alterBox.error ? "error" : "success"} // true -> error
          variant="filled"
          sx={{ width: "100%" }}
        >
          {alterBox.message}
        </Alert>
      </Snackbar>
      {/* <CustomCursor/> */}
      <ToastContainer />
    </div>
  );
};

const App = () => {
  return (
    <MyProvider>
      <AppContent />
    </MyProvider>
  );
};

export default App;
