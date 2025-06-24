'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

const AddCarPage = () => {
  // const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('accessToken='))
      ?.split('=')[1];

    if (token) {
      setAccessToken(token);
    } else {
      router.replace('/login');
    }
  }, [router]);

  const [formData, setFormData] = useState({
    brand: '',
    carModel: '',
    vin: '',
    registrationNumber: '',
    cc: '',
    year: new Date().getFullYear(),
    price: '',
    mileage: '',
    cylinders: '',
    transmissionType: 'Manual',
    maxSpeed: '',
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    horsepower: '',
    location: '',
    description: '',
    condition: 'used' as const,
    bodyType: 'Sedan',
    exteriorColor: '',
    image: '',
    trimType: '',
  });

  const [submitLoading, setSubmitLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      const response = await fetch('https://car-list-863m.onrender.com/api/v1/cars', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          ...formData,
          price: parseInt(formData.price),
          mileage: parseInt(formData.mileage),
          horsepower: formData.horsepower ? parseInt(formData.horsepower) : undefined,
        }),
      });

      const data = await response.json();
      console.log({ data });

      if (response.ok) {
        alert('Car added successfully!');
        router.push('/');
      } else {
        alert('Error adding car');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error adding car');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (!accessToken) {
    return null;
  }

  return (
    <div className='container'>
      <div className={styles.addCarPage}>
        <div className={styles.header}>
          <h1>Add New Car</h1>
          <p>Fill in the details to add a new car to the marketplace</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGrid}>
            <div className='form-group'>
              <label className='label' htmlFor='brand'>
                Brand *
              </label>
              <input
                type='text'
                id='brand'
                name='brand'
                value={formData.brand}
                onChange={handleInputChange}
                className='input'
                required
              />
            </div>

            <div className='form-group'>
              <label className='label' htmlFor='carModel'>
                Model *
              </label>
              <input
                type='text'
                id='carModel'
                name='carModel'
                value={formData.carModel}
                onChange={handleInputChange}
                className='input'
                required
              />
            </div>

            <div className='form-group'>
              <label className='label' htmlFor='vin'>
                VIN *
              </label>
              <input
                type='text'
                id='vin'
                name='vin'
                value={formData.vin}
                onChange={handleInputChange}
                className='input'
                required
              />
            </div>

            <div className='form-group'>
              <label className='label' htmlFor='registrationNumber'>
                Reg No *
              </label>
              <input
                type='text'
                id='registrationNumber'
                name='registrationNumber'
                value={formData.registrationNumber}
                onChange={handleInputChange}
                className='input'
                required
              />
            </div>

            <div className='form-group'>
              <label className='label' htmlFor='cc'>
                CC *
              </label>
              <input
                type='text'
                id='cc'
                name='cc'
                value={formData.cc}
                onChange={handleInputChange}
                className='input'
                required
              />
            </div>

            <div className='form-group'>
              <label className='label' htmlFor='cylinders'>
                Cylinders *
              </label>
              <select
                id='cylinders'
                name='cylinders'
                value={formData.cylinders}
                onChange={handleInputChange}
                className='input'
                required
              >
                <option value='3'>3 Cylinders</option>
                <option value='4'>4 Cylinders</option>
                <option value='5'>5 Cylinders</option>
                <option value='6'>6 Cylinders</option>
                <option value='8'>8 Cylinders</option>
                <option value='10'>10 Cylinders</option>
                <option value='12'>12 Cylinders</option>
              </select>
            </div>

            <div className='form-group'>
              <label className='label' htmlFor='transmissionType'>
                Transmission Type *
              </label>
              <select
                id='transmissionType'
                name='transmissionType'
                value={formData.transmissionType}
                onChange={handleInputChange}
                className='input'
                required
              >
                <option value='Manual'>Manual</option>
                <option value='Automatic'>Automatic</option>
                <option value='CVT'>CVT (Continuously Variable)</option>
                <option value='Dual-Clutch'>Dual-Clutch (DCT)</option>
                <option value='Semi-Automatic'>Semi-Automatic</option>
                <option value='Tiptronic'>Tiptronic</option>
                <option value='Electric'>Electric (Single-speed)</option>
              </select>
            </div>

            <div className='form-group'>
              <label className='label' htmlFor='year'>
                Year *
              </label>
              <input
                type='number'
                id='year'
                name='year'
                value={formData.year}
                onChange={handleInputChange}
                className='input'
                min='1900'
                max={new Date().getFullYear() + 1}
                required
              />
            </div>

            <div className='form-group'>
              <label className='label' htmlFor='price'>
                Price ($) *
              </label>
              <input
                type='number'
                id='price'
                name='price'
                value={formData.price}
                onChange={handleInputChange}
                className='input'
                min='0'
                required
              />
            </div>

            <div className='form-group'>
              <label className='label' htmlFor='mileage'>
                Mileage *
              </label>
              <input
                type='number'
                id='mileage'
                name='mileage'
                value={formData.mileage}
                onChange={handleInputChange}
                className='input'
                min='0'
                required
              />
            </div>

            <div className='form-group'>
              <label className='label' htmlFor='trimType'>
                Trim Type *
              </label>
              <select
                id='trimType'
                name='trimType'
                value={formData.trimType}
                onChange={handleInputChange}
                className='input'
                required
              >
                <option value='Base'>Base</option>
                <option value='Standard'>Standard</option>
                <option value='Sport'>Sport</option>
                <option value='Touring'>Touring</option>
                <option value='Luxury'>Luxury</option>
                <option value='Premium'>Premium</option>
                <option value='Limited'>Limited</option>
                <option value='Platinum'>Platinum</option>
                <option value='Off-Road'>Off-Road</option>
                <option value='Performance'>Performance</option>
                <option value='Custom'>Custom</option>
                <option value='Other'>Other</option>
              </select>
            </div>

            <div className='form-group'>
              <label className='label' htmlFor='maxSpeed'>
                Mileage *
              </label>
              <input
                type='number'
                id='maxSpeed'
                name='maxSpeed'
                value={formData.maxSpeed}
                onChange={handleInputChange}
                className='input'
                min='0'
                required
              />
            </div>

            <div className='form-group'>
              <label className='label' htmlFor='horsepower'>
                Horsepower
              </label>
              <input
                type='number'
                id='horsepower'
                name='horsepower'
                value={formData.horsepower}
                onChange={handleInputChange}
                className='input'
                min='0'
              />
            </div>

            <div className='form-group'>
              <label className='label' htmlFor='fuelType'>
                Fuel Type *
              </label>
              <select
                id='fuelType'
                name='fuelType'
                value={formData.fuelType}
                onChange={handleInputChange}
                className='input'
                required
              >
                <option value='Gasoline'>Gasoline</option>
                <option value='Diesel'>Diesel</option>
                <option value='Hybrid'>Hybrid</option>
                <option value='Electric'>Electric</option>
                <option value='Plug-in Hybrid'>Plug-in Hybrid</option>
              </select>
            </div>

            <div className='form-group'>
              <label className='label' htmlFor='transmission'>
                Transmission *
              </label>
              <select
                id='transmission'
                name='transmission'
                value={formData.transmission}
                onChange={handleInputChange}
                className='input'
                required
              >
                <option value='Automatic'>Automatic</option>
                <option value='Manual'>Manual</option>
                <option value='CVT'>CVT</option>
              </select>
            </div>

            <div className='form-group'>
              <label className='label' htmlFor='condition'>
                Condition *
              </label>
              <select
                id='condition'
                name='condition'
                value={formData.condition}
                onChange={handleInputChange}
                className='input'
                required
              >
                <option value='new'>New</option>
                <option value='used'>Used</option>
                <option value='certified'>Certified Pre-Owned</option>
              </select>
            </div>

            <div className='form-group'>
              <label className='label' htmlFor='bodyType'>
                Body Type *
              </label>
              <select
                id='bodyType'
                name='bodyType'
                value={formData.bodyType}
                onChange={handleInputChange}
                className='input'
                required
              >
                <option value='Sedan'>Sedan</option>
                <option value='SUV'>SUV</option>
                <option value='Hatchback'>Hatchback</option>
                <option value='Coupe'>Coupe</option>
                <option value='Convertible'>Convertible</option>
                <option value='Truck'>Truck</option>
                <option value='Van'>Van</option>
                <option value='Wagon'>Wagon</option>
              </select>
            </div>

            <div className='form-group'>
              <label className='label' htmlFor='exteriorColor'>
                Exterior Color *
              </label>
              <input
                type='text'
                id='exteriorColor'
                name='exteriorColor'
                value={formData.exteriorColor}
                onChange={handleInputChange}
                className='input'
                required
              />
            </div>

            <div className='form-group'>
              <label className='label' htmlFor='location'>
                Location *
              </label>
              <input
                type='text'
                id='location'
                name='location'
                value={formData.location}
                onChange={handleInputChange}
                className='input'
                placeholder='City, State'
                required
              />
            </div>
          </div>

          <div className='form-group'>
            <label className='label' htmlFor='description'>
              Description
            </label>
            <textarea
              id='description'
              name='description'
              value={formData.description}
              onChange={handleInputChange}
              className={styles.textarea}
              rows={4}
              placeholder="Describe the vehicle's condition, features, and selling points..."
            />
          </div>

          <div className={styles.formActions}>
            <button type='button' onClick={() => router.push('/')} className='btn btn-secondary'>
              Cancel
            </button>
            <button type='submit' disabled={submitLoading} className='btn btn-primary'>
              {submitLoading ? 'Adding Car...' : 'Add Car'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCarPage;
