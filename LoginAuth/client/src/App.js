import React from 'react'
import { createBrowserRouter,RouterProvider} from 'react-router-dom';

/**importing all components */
import Username from './components/Username';
import Password from'./components/Password';
import Profile from './components/Profile';
import Register from './components/Register';
import Recovery from './components/Recovery';
import Reset from './components/Reset';
import PageNotFound from './components/PageNotFound';
import SignupPoliciesPage from './components/SignupPoliciesPage';

import { AuthorizeUser } from './middleware/auth';
import { ProtectRoute } from './middleware/auth';
/**root routes */
const router =createBrowserRouter([
  {
    path:'/',
    element : <Username></Username>
  },
  {
    path:'/register',
    element : <Register></Register>
  },
  {
    path:'/password',
    element : <Password></Password>
  },
  {
    path:'/password',
    element : <ProtectRoute><Password/></ProtectRoute>
  },
  {
    path:'/profile',
    element : <AuthorizeUser><Profile/></AuthorizeUser>
  },
  {
    path:'/recovery',
    element : <Recovery></Recovery>
  },
  {
    path:'/reset',
    element : <Reset></Reset>
  },
  {
    path:'/policy',
    element : <SignupPoliciesPage></SignupPoliciesPage>
  },
  {
    path:'*',
    element : <PageNotFound></PageNotFound>
  },

 
 
])


export default function App() {
  return (
    <main>
      <RouterProvider router={router}></RouterProvider>
  </main>
  )
}
