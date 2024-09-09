import { useCookies } from 'react-cookie';
import { Navigate, Outlet } from 'react-router-dom';

export const AdminPrivateRoutes: React.FC = () => {
    const [cookiesAdmin] = useCookies(["adminData"]);
    let auth = !!cookiesAdmin.adminData;

    return auth ? <Outlet /> : <Navigate to='/admin/login' />;
};
