import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import createRoutes from "./routes/index";
import ErrorBoundary from "./ErrorBoundary";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const App: React.FC = () => {
  const routes = createRoutes();
  const router = createBrowserRouter(routes);
  const queryClient = new QueryClient();

  return (
    <ErrorBoundary>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="light"
      />
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
