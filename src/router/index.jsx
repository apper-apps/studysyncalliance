import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { getRouteConfig } from './route.utils';
import Root from '@/layouts/Root';

// Lazy load components
const Dashboard = lazy(() => import('@/components/pages/Dashboard'));
const Courses = lazy(() => import('@/components/pages/Courses'));
const Assignments = lazy(() => import('@/components/pages/Assignments'));
const Grades = lazy(() => import('@/components/pages/Grades'));
const Calendar = lazy(() => import('@/components/pages/Calendar'));
const Students = lazy(() => import('@/components/pages/Students'));
const Faculty = lazy(() => import('@/components/pages/Faculty'));
const Login = lazy(() => import('@/components/pages/Login'));
const Signup = lazy(() => import('@/components/pages/Signup'));
const Callback = lazy(() => import('@/components/pages/Callback'));
const ErrorPage = lazy(() => import('@/components/pages/ErrorPage'));
const ResetPassword = lazy(() => import('@/components/pages/ResetPassword'));
const PromptPassword = lazy(() => import('@/components/pages/PromptPassword'));
const NotFound = lazy(() => import('@/components/pages/NotFound'));

// Loading spinner component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full" />
  </div>
);

// createRoute helper
const createRoute = ({ path, index, element, access, children, ...meta }) => {
  const configPath = index ? "/" : (path?.startsWith('/') ? path : `/${path}`);
  const config = getRouteConfig(configPath);
  const finalAccess = access || config?.allow;
  
  return {
    ...(index ? { index: true } : { path }),
    element: element ? <Suspense fallback={<LoadingSpinner />}>{element}</Suspense> : element,
    handle: { access: finalAccess, ...meta },
    ...(children && { children })
  };
};

// Router configuration
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />, // Layout component - NO createRoute wrapper
    children: [
      // Protected routes (access controlled by routes.json)
      createRoute({
        index: true,
        element: <Dashboard />,
        title: 'Dashboard'
      }),
      createRoute({
        path: 'courses',
        element: <Courses />,
        title: 'Courses'
      }),
      createRoute({
        path: 'assignments',
        element: <Assignments />,
        title: 'Assignments'
      }),
      createRoute({
        path: 'grades',
        element: <Grades />,
        title: 'Grades'
      }),
      createRoute({
        path: 'calendar',
        element: <Calendar />,
        title: 'Calendar'
      }),
      createRoute({
        path: 'students',
        element: <Students />,
        title: 'Students'
      }),
      createRoute({
        path: 'faculty',
        element: <Faculty />,
        title: 'Faculty'
      }),
      
      // Public routes
      createRoute({
        path: 'login',
        element: <Login />,
        title: 'Login'
      }),
      createRoute({
        path: 'signup',
        element: <Signup />,
        title: 'Sign Up'
      }),
      
      // Auth callback routes
      createRoute({
        path: 'callback',
        element: <Callback />,
        title: 'Authentication Callback'
      }),
      createRoute({
        path: 'error',
        element: <ErrorPage />,
        title: 'Error'
      }),
      createRoute({
        path: 'prompt-password/:appId/:emailAddress/:provider',
        element: <PromptPassword />,
        title: 'Password Prompt'
      }),
      createRoute({
        path: 'reset-password/:appId/:fields',
        element: <ResetPassword />,
        title: 'Reset Password'
      }),
      
      // Catch all route
      createRoute({
        path: '*',
        element: <NotFound />,
        title: 'Page Not Found'
      })
    ]
  }
]);