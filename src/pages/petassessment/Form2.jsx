import React, { useEffect, useState, useRef } from 'react'
import { usePetAssessment } from '../../context/PetAssessmentContext'
import { getData } from '../../api'
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormGroup from '@mui/material/FormGroup';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import CustomButton from '../../components/form/CustomButton'
import CustomFormFields from '../../components/form/CustomFormFields';
import CustomFormik from '../../formik/CustomFormik';
import form2Config from './formConfigs/form2Config';

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
  const { petInfo, setPetInfo } = usePetAssessment()
  const [symptoms, setSymptoms] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const form = useRef()
  const { initialValues, formSchema, field } = form2Config
  const updatedFields = { ...field, options: symptoms }

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

  const handleSubmit = (values, resetForm) => {
    setPetInfo({ ...petInfo, symptoms: values.symptoms })
    //POST PETINFO TO DATABASE
    resetForm()
  }

  const formik = CustomFormik(initialValues, formSchema, handleSubmit)

  if (isLoading) return <p>Loading...</p>

  return (
    <form onSubmit={formik.handleSubmit} ref={form} style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
      <FormLabel component="legend" sx={{ textAlign: 'center' }}>SYMPTOMS</FormLabel>
      <FormControl sx={{ paddingTop: '15px', paddingLeft: '20%' }}>
        <FormGroup>
          <CustomFormFields field={updatedFields} formik={formik} />
        </FormGroup>
      </FormControl >
      <div>
        <CustomButton>Submit</CustomButton>
      </div>
    </form >

  )
}

export default Form2
