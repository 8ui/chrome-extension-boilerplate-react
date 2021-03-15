import React from "react"
import { useMst } from './core/store';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';



const LicenseForm = () => {
  const Store = useMst();
  const [license, setLicense] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const handleSubmit = async(e) => {
    e.preventDefault()
    try {
      setLoading(true);
      const data = await Store.registerDevice(license);
      console.log('data', data);
    } catch (e) {
      setError(String(e.message));
    }
    setLoading(false);
  }
  const handleChange = ({target}) => {
    setLicense(target.value)
    if (error) setError(false);
  }
  return (
    <form autoComplete="off" onSubmit={handleSubmit} className="license-form">
      <div>
        <TextField
          id="license"
          label="Введите лицензию"
          variant="outlined"
          onChange={handleChange}
          disabled={loading}
          error={Boolean(error)}
          helperText={error}
          InputProps={{
            style: {width: 300}
          }}
        />
      </div>
      <Button
        type="submit"
        color="primary"
        variant="contained"
        disabled={loading}
      >
        {loading ? 'Загрузка' : 'Применить'}
      </Button>
    </form>
  )
}

export default LicenseForm;
