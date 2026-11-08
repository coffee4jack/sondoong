import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "@fontsource/pt-sans/400.css";
import "@fontsource/pt-sans/700.css";
import "./index.css";
import router from "./router";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
