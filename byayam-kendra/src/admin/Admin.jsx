import React, { Suspense, lazy } from 'react';

const Dash = lazy(() => import("./AdminDashboard.jsx"));
const Sidebar= lazy(()=>import("./Sidebar.jsx"))
const Admin = () => {
    return (
        <>
            <Suspense fallback={<div>Loading...</div>}>
                <Sidebar/>
                <Dash />
            </Suspense>
        </>
    );
}

export default Admin;
