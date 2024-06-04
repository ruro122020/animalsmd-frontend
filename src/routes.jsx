import App from './App'
import Home from './pages/Home'
import Login from './pages/login/Login'
import Form1 from './pages/petassessment/forms/Form1'
import Form2 from './pages/petassessment/forms/Form2'
import PetAssessmentLayer from './pages/petassessment/PetAssessmentLayer'
import Products from './pages/Products'
import Signup from './pages/signup/Signup'

const routes = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/signup',
        element: <Signup />
      },
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/pet-assessment',
        element: <PetAssessmentLayer />,
        children: [
          {
            path: '/pet-assessment/',
            element: <Form1 />
          },
          {
            path: '/pet-assessment/form2',
            element: <Form2 />
          }
        ]
      },
      {
        path: '/products',
        element: <Products />
      }
    ]
  },
]

export default routes