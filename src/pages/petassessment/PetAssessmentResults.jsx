import React, { useState, useEffect, useRef } from 'react'
import { deleteData, getData, postData } from '../../api'
import { usePetAssessment } from '../../context/PetAssessmentContext'
import { Alert, Box, Button, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useOutletContext } from 'react-router-dom'
import Results from '../../components/results/Results'

const PetAssessmentResults = () => {
  const { petInfo, setPetInfo } = usePetAssessment()
  const [results, setResults] = useState([])
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useOutletContext()

  //FOR RESULTS TO STAY CONSITANT AFTER PAGE REFRESH RESULTS ARE STORED IN LOCAL STORAGE AFTER FETCH
  useEffect(() => {
    const petResults = localStorage.getItem('petResults')
    if (petResults) {
      setResults(JSON.parse(petResults))
    }
    const petlocalStorageInfo = localStorage.getItem('petInfo')
    if (petlocalStorageInfo) {
      setPetInfo(JSON.parse(petlocalStorageInfo))
    }
  }, [])

  useEffect(() => {
    const getResults = async () => {
      localStorage.setItem('petInfo', JSON.stringify(petInfo))
      const getResults = await getData(`/api/user/pets/${petInfo.id}/results`)

      if (getResults) {
        setResults(getResults)
        setIsLoading(false)
        localStorage.setItem('petResults', JSON.stringify(getResults))
      } else {
        setIsLoading(false)
      }
    }
    getResults()
  }, [])

  //this function serves to communicate to the api
  //this function was created to make it easier to delete petInfo in the database if the results yielded: "No Results Found"
  const deleteDBPetInfo = async () => {
    localStorage.removeItem('petResults')
    return await deleteData(`/api/user/pets/${petInfo.id}`)

  }
  /**PET INFO IS SAVED TO DATABASE IN FORM 2 WHICH IS RENDERED BEFORE PETASSESSMENTRESULTS COMPONENT IS. 
   * THEREFORE WHEN USER CLICKS ON THE START OVER BUTTON, THE SAVED PET INFO NEEDS TO BE DELETED
   * SO THAT IT WON'T APPEAR IN USERS DASHBOARD
   */
  const handleDelete = async () => {
    const deletePetInfo = deleteDBPetInfo()
    if (deletePetInfo) {
      navigate('/pet-assessment')
    }
  }

  if (isLoading) return <p>loading</p>

  if (results.length > 0) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Results results={results} direction='column' />
        <div style={{ display: 'flex' }}>
          <Button onClick={handleDelete}>Start Over</Button>
          <Button onClick={() => navigate('/user/dashboard')}>Save</Button>
        </div>
      </Box>
    )
  } else {
    deleteDBPetInfo()
    return (
      <Box sx={{ textAlign: 'center' }}>
        <Alert severity='error'>No Results Found</Alert>
        <Button onClick={() => navigate('/pet-assessment')}>Start Over</Button>
      </Box>
    )

  }

}

export default PetAssessmentResults
