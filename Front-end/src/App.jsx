// 3-td party modules
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuth0 } from "@auth0/auth0-react";

// my components
import AppLayout from "./AppLayout";
import Home from "./components/Home/Home";
import Transits from "./components/Transits/Transits.jsx";
import Profile from "./components/Profile/Profile.jsx";
import Refresh from "./components/Refresh/Refresh.jsx";

const queryClient = new QueryClient(); // Create a client

function App() {
  const { isAuthenticated } = useAuth0();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Navigate replace to="/home" />} />
            <Route path="/home" element={<Home />} />
            <Route path="/transits" element={<Transits />} />

            {!isAuthenticated && (
              <>
                <Route path="/profile" element={<Profile />} />
                <Route path="/refresh" element={<Refresh />} />
              </>
            )}
          </Route>
        </Routes>
      </BrowserRouter>

      <Toaster
        position="top-center" // where on the screen the notification will be
        gutter={12} // space between the notificaion windows
        containerStyle={{ margin: "8px" }} // custom css
        toastOptions={{
          // Succesess options
          success: {
            duration: 3000, // How long successes stays on screen
          },

          // Error options
          error: {
            duration: 5000, // How long error stays on screen
          },

          // Custom CSS
          style: {
            fontSize: "16px",
            maxWidth: "500px",
            padding: "16px 24px",
          },
        }}
      />
    </QueryClientProvider>
  );
}

export default App;
