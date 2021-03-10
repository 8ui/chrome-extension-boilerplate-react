import React from "react"
import { useMst } from './core/store';

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
      setError(String(e));
    }
    setLoading(false);
  }
  return (
    <form onSubmit={handleSubmit} className="license-form">
      <div><label htmlFor='license'>Введите лицензию</label></div>
      {error ? <div className="error">{error}</div> : null}
      <div>
        <input
          id="license"
          type="text"
          onChange={({target}) => setLicense(target.value)}
          placeholder=""
          disabled={loading}
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Загрузка' : 'Применить'}
      </button>
    </form>
  )
}

export default LicenseForm;