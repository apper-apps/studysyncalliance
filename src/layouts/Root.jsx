import React, { useEffect, useState, createContext, useContext } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { setUser, clearUser, setInitialized } from '@/store/userSlice';
import { getRouteConfig, verifyRouteAccess } from '@/router/route.utils';

// Create Auth Context
const AuthContext = createContext(null);

// Custom hook for accessing auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthContext.Provider');
  }
  return context;
};

const Root = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user, isInitialized } = useSelector((state) => state.user);
  
  // Local state for controlling loading spinner
  const [authInitialized, setAuthInitialized] = useState(false);

  // Initialize ApperUI once when the app loads
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { ApperClient, ApperUI } = window.ApperSDK;
        
        const client = new ApperClient({
          apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
          apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
        });
        
        // Initialize ApperUI
        ApperUI.setup(client, {
          target: '#authentication',
          clientId: import.meta.env.VITE_APPER_PROJECT_ID,
          view: 'both',
          onSuccess: function (user) {
            handleNavigation(user);
            if (user) {
              // Store user information in Redux
              dispatch(setUser(JSON.parse(JSON.stringify(user))));
            } else {
              dispatch(clearUser());
            }
            dispatch(setInitialized(true));
            setAuthInitialized(true);
          },
          onError: function(error) {
            console.error("Authentication failed:", error);
            dispatch(clearUser());
            dispatch(setInitialized(true));
            setAuthInitialized(true);
          }
        });
      } catch (error) {
        console.error("Failed to initialize authentication:", error);
        dispatch(setInitialized(true));
        setAuthInitialized(true);
      }
    };

    initializeAuth();
  }, [dispatch]);

  // Route guard - runs after initialization
  useEffect(() => {
    if (!isInitialized) return; // Don't run until initialized
    
    const currentPath = location.pathname;
    const config = getRouteConfig(currentPath);
    
    if (config) {
      const accessCheck = verifyRouteAccess(config, user);
      
      if (!accessCheck.allowed && accessCheck.redirectTo) {
        const redirectUrl = accessCheck.excludeRedirectQuery 
          ? accessCheck.redirectTo
          : `${accessCheck.redirectTo}?redirect=${encodeURIComponent(currentPath + location.search)}`;
        
        navigate(redirectUrl);
      }
    }
  }, [isInitialized, user, location.pathname, location.search, navigate]);

  // Handle navigation after authentication
  const handleNavigation = (user) => {
    const urlParams = new URLSearchParams(window.location.search);
    const redirectPath = urlParams.get("redirect");
    const authPages = ["/login", "/signup", "/callback"];
    const isOnAuthPage = authPages.some(page => window.location.pathname.includes(page));
    
    if (user) {
      // User is authenticated
      if (redirectPath) {
        navigate(redirectPath);
      } else if (isOnAuthPage) {
        navigate("/");
      }
      // If not on auth page, stay on current page
    } else {
      // User is not authenticated - handled by route guards
    }
  };

  // Authentication methods for context
  const authMethods = {
    isInitialized,
    logout: async () => {
      try {
        const { ApperUI } = window.ApperSDK;
        await ApperUI.logout();
        dispatch(clearUser());
        navigate('/login');
      } catch (error) {
        console.error("Logout failed:", error);
      }
    }
  };

  // Show loading until first gate is open
  if (!authInitialized) {
    return (
      <div className="loading flex items-center justify-center p-6 h-screen w-full">
        <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v4"></path><path d="m16.2 7.8 2.9-2.9"></path><path d="M18 12h4"></path><path d="m16.2 16.2 2.9 2.9"></path><path d="M12 18v4"></path><path d="m4.9 19.1 2.9-2.9"></path><path d="M2 12h4"></path><path d="m4.9 4.9 2.9 2.9"></path>
        </svg>
      </div>
    );
  }

  // App-level state to pass to outlet context
  const outletContext = {
    user,
    isAuthenticated: !!user,
    isInitialized
  };

  return (
    <AuthContext.Provider value={authMethods}>
      <div className="min-h-screen bg-gray-50">
        <Outlet context={outletContext} />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </AuthContext.Provider>
  );
};

export default Root;