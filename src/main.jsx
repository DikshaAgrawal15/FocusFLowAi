import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import App from "./App.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { TaskProvider } from "./context/TaskContext";

import { ScreenTimeProvider } from "./context/ScreenTimeContext";

import { ThemeProvider } from "./context/ThemeContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <TaskProvider>
      <ScreenTimeProvider>
        <ThemeProvider>
          <>
            <App />

            <ToastContainer
              position="top-right"
              autoClose={2500}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              pauseOnHover
              draggable
              theme="dark"
            />
          </>
        </ThemeProvider>
      </ScreenTimeProvider>
    </TaskProvider>
  </StrictMode>,
);
