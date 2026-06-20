import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import store from "./store/store.js";
import { AppRouter } from "./router/Router";
import { Provider } from "react-redux";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <AppRouter />
  </Provider>,
);
