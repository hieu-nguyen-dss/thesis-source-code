import * as React from 'react'
import { useTranslation } from 'react-i18next'

import CustomInput from '../../components/customs/Input'

const EditableCell = (props) => {
  const { t } = useTranslation('common')
  const { initialValue, updateTable } = props
  const [value, setValue] = React.useState(initialValue)
  const onBlur = () => {
    if (value !== initialValue) {
      updateTable(value)
    }
  }
  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])
  return (
    <CustomInput
      multiline
      fullWidth
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={onBlur}
      placeholder={t('rubrics.knowledge')}
      sx={{ color: theme => props.topic ? theme.palette.primary.main : 'black' }}
    />
  )
}
export default EditableCell
