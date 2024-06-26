import React from 'react'
import editFormConfig from './editFormConfig'
import CustomFormik from '../../formik/CustomFormik'
import CustomFormFields from '../../components/form/CustomFormFields'
import { updateData } from '../../api'
import CustomButton from '../../components/form/CustomButton'

const EditForm = ({ pet, setShowEditForm, setPet }) => {
  const { formSchema, fields } = editFormConfig
  const initialValues = {
    name: pet.name,
    age: pet.age,
    weight: pet.weight,
  }

  const handleSubmit = async (values, resetForm) => {
    //need to create route to update pets in database
    const updatedPet = await updateData(`/api/user/pets/${pet.id}`, values)
    //update pet in frontend
    if (updatedPet) {
      const { name, age, weight } = updatedPet
      setPet({ ...pet, name: name, age: age, weight: weight })
      resetForm()
      setShowEditForm(false)

    }
  }
  const formik = CustomFormik(initialValues, formSchema, handleSubmit)

  return (
    <form onSubmit={formik.handleSubmit}>
      <div>
        {fields.map(field => <CustomFormFields field={field} formik={formik} />)}
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingBottom: '12px' }}>
        <div style={{ paddingRight: '12px' }}>
          <CustomButton type='Submit'>Submit</CustomButton>
        </div>
        <CustomButton onClick={() => setShowEditForm(false)}>Cancel</CustomButton>
      </div>
    </form>
  )
}

export default EditForm;