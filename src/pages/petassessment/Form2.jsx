import React, { useEffect, useState, useRef } from 'react'
import { usePetAssessment } from '../../context/PetAssessmentContext'
import { getData } from '../../api'
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormGroup from '@mui/material/FormGroup';
import { Grid, setRef } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useFormik } from 'formik'
import * as yup from 'yup'
import { useNavigate } from 'react-router-dom';
import { Checkbox } from '@mui/material';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Box from '@mui/material/Box';
import CustomButton from '../../components/form/CustomButton'
import CustomFormFields from '../../components/form/CustomFormFields';
/*
IMPORTANT NOTE: 
  Formik doesn't have an internal way of handling updating nested arrays in inital values. In this case, for symptoms array.
  Therefore, a work around has been implemented. A custom handleChange called 'handleSymptomsChange' was created to be passed to the FormControlLabel components. 
  In the handleSymptomsChange, any of the symptoms selected will be added to the sypmtoms array in formik.values manuelly

  YUP library NOT used in this form for the following reasons:
  When checking one boxe the error fires before user can check another symptom. As a work around, an isError state is created 
  and a condition is set in the onSubmit function. If is formik.values.sypmtoms.length is less than or equal to 1, it'll set the error 
  to true and display an error message. 
*/
const Form2 = () => {
  const { petInfo, updatePetInfo } = usePetAssessment()
  const [symptoms, setSymptoms] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const navigate = useNavigate()
  const form = useRef()

  //animation for this page is in useGSAP
  //refer to gsap docs for more info on dependencies https://gsap.com/resources/React/
  useGSAP(() => {
    if (form && form.current && !isLoading) {
      gsap.from(form.current, {
        duration: 1,
        opacity: 0,
        y: -40,
        stagger: 0.1,
        ease: "back.in"
      })
    }
  }, { dependencies: [form, isLoading] }) //these dependencies are needed for when form and isLoading state changes

  useEffect(() => {
    const getSymptoms = async () => {
      if (petInfo.type) {
        const symptomsData = await getData(`/api/species/${petInfo.type}`)
        if (symptomsData) {
          setSymptoms(symptomsData.symptoms)
          setIsLoading(false)
        } else {
          console.log('Fetched Data returned false')
        }
      } else {
        navigate('/pet-assessment')
      }
    }
    getSymptoms()
  }, [])

  const formSchema = yup.object().shape({
    symptoms: yup.array().min(2, 'At least 2 symptoms must be selected')
  })

  const formik = useFormik({
    initialValues: {
      symptoms: []
    },
    validationSchema: formSchema,
    onSubmit: async (values, { resetForm }) => {
      updatePetInfo({ ...petInfo, symptoms: values.symptoms })
      console.log('petInfo', petInfo)
      if (values.symptoms.length <= 1) {
        setIsError(true)
      } else {
        //POST PETINFO TO DATABASE
        setIsError(false)
        resetForm()
      }
    },
  })

  //This only requires an object to be passed to CustomFormFields because the 
  //CustomCheckboxGroup component is iterating through options and creating 
  //a checkboxe for each option 

  const field =
  {
    options: symptoms,
    name: 'symptoms',
    labelPlacement: 'end',
    type: 'checkbox'
  }

  if (isLoading) return <p>Loading...</p>

  return (
    <form onSubmit={formik.handleSubmit} ref={form} style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
      <FormLabel component="legend" sx={{ textAlign: 'center' }}>SYMPTOMS</FormLabel>
      {/* <div style={{ color: isError ? 'red' : 'rgba(0,0,0,0)', textAlign: 'center' }}>At least 2 checkboxes must be selected</div> */}
      <FormControl sx={{ paddingTop: '15px', paddingLeft: '20%' }}>
        <FormGroup>
          <CustomFormFields field={field} formik={formik} />
        </FormGroup>
      </FormControl >
      <div>
        <CustomButton>Submit</CustomButton>
      </div>
    </form >

  )
}

export default Form2
