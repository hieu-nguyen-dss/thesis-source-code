import * as React from 'react'

import CustomInput from '../../components/customs/Input'
const EditableTreeInput = (props) => {
  const { initialValue, update } = props
  const [value, setValue] = React.useState(initialValue)
  const onBlur = () => {
    if (value !== initialValue) {
      update(value)
    }
  }
  return (
    <CustomInput
      autoFocus
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={onBlur}
      placeholder='Column name'
    />
  )
}
export default EditableTreeInput
