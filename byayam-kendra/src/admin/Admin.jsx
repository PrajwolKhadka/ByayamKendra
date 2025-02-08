import React, { Suspense, lazy } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const Dash = lazy(() => import("./AdminDashboard.jsx"));
const Sidebar= lazy(()=>import("./Sidebar.jsx"))
const Accounts= lazy(()=>import("./AccManagement.jsx"))
const Admin = () => {
    const location = useLocation();
    const navigate = useNavigate();
   const routeComponents = {
       '/admindash': <Dash/>,
    //    '/tracker': <Tracker />,
    //    '/suggest': <Suggest />,
       '/accounts': <Accounts/>,
     };
   
     return (
       <Suspense fallback={<div>Loading...</div>}>
         <Sidebar />
         {routeComponents[location.pathname] || <div>404 Page Not Found</div>}
       </Suspense>
     );
   };

export default Admin;
