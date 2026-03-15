import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import AlertProvider from "./context/alert/AlertProvider";
import { SnackbarProvider } from "notistack";
import AuthProvider from "./context/auth/AuthProvider";
import ModeProvider from "./context/mode/ModeProvider";
import { Provider } from "react-redux";
import {store} from "./redux/store";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    <AlertProvider>
      <ModeProvider>
        <AuthProvider>
          <SnackbarProvider maxSnack={3}>
            <App />
          </SnackbarProvider>
        </AuthProvider>
      </ModeProvider>
    </AlertProvider>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
