import App from './App'
import Home from './pages/home/Home'
import Login from './pages/login/Login'
import Form1 from './pages/petassessment/forms/Form1'
import Form2 from './pages/petassessment/forms/Form2'
import PetAssessmentLayer from './pages/petassessment/PetAssessmentLayer'
import Products from './pages/products/Products'
import Signup from './pages/signup/Signup'
import Dashboard from './protectedPages/dashboard/Dashboard'
import Profile from './protectedPages/profile/Profile'
import Account from './protectedPages/account/Account'
import UsersLayer from './protectedPages/UsersLayer'
import PetAssessmentResults from './pages/petassessment/PetAssessmentResults'
import MorePetInfo from './protectedPages/dashboard/MorePetInfo'
import Cart from './protectedPages/cart/Cart'
import CheckoutForm from './components/checkout/CheckoutForm'
import Return from './components/checkout/Return'

const routes = [
  {
    path: "/",
    element: <App />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/signup', element: <Signup /> },
      { path: '/login', element: <Login /> },
      { path: '/products', element: <Products />, },

      {
        path: '/pet-assessment',
        element: <PetAssessmentLayer />,
        children: [
          { path: '/pet-assessment/', element: <Form1 /> },
          { path: '/pet-assessment/form2', element: <Form2 /> },
          { path: '/pet-assessment/results', element: <PetAssessmentResults /> },

        ]
      },
      {
        path: '/user',
        element: <UsersLayer />,
        children: [
          { path: '/user/dashboard', element: <Dashboard />, },
          { path: '/user/dashboard/pets/:id/results', element: <MorePetInfo /> },
          { path: '/user/account', element: <Account /> },
          { path: '/user/profile', element: <Profile /> },
          { path: '/user/cart', element: <Cart /> },
          { path: '/user/checkout', element: <CheckoutForm /> },
          { path: '/user/return', element: <Return /> },


        ]
      },

    ]
  },
]

export default routes