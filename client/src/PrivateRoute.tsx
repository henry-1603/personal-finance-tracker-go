// import { useCookies } from 'react-cookie';
// import { Navigate, Outlet } from 'react-router-dom';

// export const PrivateRoutes: React.FC = () => {
//     const [cookiesHome] = useCookies(["userData"]);
//     console.log("cookiesHome",cookiesHome)
//     let auth = !!cookiesHome.userData;     
//     console.log("auth",auth)

      
//   return auth ? <Outlet /> : <Navigate to='/login' />;
// };

// export const AdminPrivateRoute: React.FC = () => {
//   const [cookiesHome] = useCookies(["userData"]);
//   let adminCriteria = !!cookiesHome?.userData?.user?.isAdmin;
//   return adminCriteria ? <Outlet /> : <Navigate to='*'/>
// }

// export const PublicRoutes = () => {
//   const [cookies] = useCookies(['userData']);
//   const isAuthenticated = !!cookies.userData;

//   return isAuthenticated ? <Navigate to="/" /> : <Outlet />;
// };
