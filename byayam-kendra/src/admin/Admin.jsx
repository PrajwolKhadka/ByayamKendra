import React, { Suspense, lazy } from 'react';

const Dash = lazy(() => import("./AdminDashboard.jsx"));

const Admin = () => {
    return (
        <>
            <Suspense fallback={<div>Loading...</div>}>
                <Dash />
            </Suspense>
        </>
    );
}

export default Admin;
