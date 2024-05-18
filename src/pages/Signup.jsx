import React from 'react'
import { useFormik } from 'formik'
import { Grid } from '@mui/material'
import CustomInput from '../components/CustomInput'
import * as yup from 'yup'
import CustomButton from '../components/CustomButton'
import { useAuth } from '../context/AuthContext'
import { postData } from '../api'
import { useNavigate } from 'react-router-dom'
const Signup = () => {
  const { updateUser } = useAuth()
  const navigate = useNavigate()
  const formSchema = yup.object().shape({
    name: yup.string().matches(/^[a-z ]+$/i, 'Only alphabetic characters allowed').required("Must enter a name").min(3),
    username: yup.string().matches(/^[a-z ]+$/i, 'Only alphabetic characters allowed').required('Must enter username'),
    email: yup.string().email("Invalid email").required('Must enter email'),
    password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required')
  })
  const formik = useFormik({
    initialValues: {
      name: '',
      username: '',
      email: '',
      password: ''
    },
    validationSchema: formSchema,
    onSubmit: async (values, { resetForm }) => {
      //post values to api
      const responseUser = await postData('signup', values)
      if (responseUser) {
        updateUser(responseUser)
        resetForm()
        navigate('/')
      } else {
        console.log('Something went wrong in signup.jsx submit function')
      }
    }
  })

  const fields = [
    {
      label: 'Full Name',
      name: 'name',
      type: 'text',
      value: formik.values.name
    },
    {
      label: 'Username',
      name: 'username',
      type: 'text',
      value: formik.values.username
    },
    {
      label: 'Email',
      name: 'email',
      type: 'email',
      value: formik.values.email
    },
    {
      label: 'Password',
      name: 'password',
      type: 'password',
      value: formik.values.password
    }
  ]

  return (
    <Grid container sx={{ display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
      <h1>Sign Up</h1>
      <form onSubmit={formik.handleSubmit}>
        {fields.map(({ label, name, type, value }) =>
          <div key={name} style={{ paddingBottom: '12px' }}>
            <CustomInput
              label={label}
              name={name}
              type={type}
              onChange={formik.handleChange}
              value={value}
            />
            {formik.touched[name] && formik.errors[name] && (
              <div style={{ color: 'red', paddingTop: '7px' }}>{formik.errors[name]}</div>
            )}
          </div>

        )}
        <CustomButton />
      </form>
    </Grid>
  )
}

export default Signup
