import React, { useState, useEffect } from 'react';

const ListingCreate = () => {
  const [propertyType, setPropertyType] = useState('');
  const [title, setTitle] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [streetNumber, setStreetNumber] = useState('');
  const [streetName, setStreetName] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [errors, setErrors] = useState({});
  const [shakePrice, setShakePrice] = useState(false);

  const postalCodeRegex = /^[A-Za-z]\d[A-Za-z][ ]?\d[A-Za-z]\d$/;

  // Reset shake effect after animation completes
  useEffect(() => {
    if (shakePrice) {
      const timer = setTimeout(() => {
        setShakePrice(false);
      }, 820); // Animation duration + small buffer
      return () => clearTimeout(timer);
    }
  }, [shakePrice]);

  const styles = {
    pageContainer: {
      height: '100vh',
      width: '100vw',
      background: 'linear-gradient(to bottom right, #7C3AED, #F97316)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      margin: 0,
      padding: 0,
      overflow: 'auto'
    },
    formContainer: {
      width: '576px',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderRadius: '19px',
      padding: '43px',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column',
      margin: '20px 0'
    },
    title: {
      fontSize: '34px',
      fontWeight: 'bold',
      color: 'white',
      textAlign: 'center',
      marginBottom: '29px'
    },
    inputGroup: {
      marginBottom: '22px',
      position: 'relative'
    },
    input: {
      width: '100%',
      padding: '14px',
      borderRadius: '12px',
      border: 'none',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      color: 'white',
      boxSizing: 'border-box',
      fontSize: '19px'
    },
    numberInput: {
      width: '100%',
      padding: '14px',
      borderRadius: '12px',
      border: 'none',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      color: 'white',
      boxSizing: 'border-box',
      fontSize: '19px',
      appearance: 'textfield',
      WebkitAppearance: 'textfield',
      MozAppearance: 'textfield'
    },
    shakingInput: {
      animation: 'shake 0.82s cubic-bezier(.36,.07,.19,.97) both'
    },
    numberInputStyle: `
      input[type=number]::-webkit-inner-spin-button, 
      input[type=number]::-webkit-outer-spin-button { 
        -webkit-appearance: none; 
        margin: 0; 
      }
      input[type=number] {
        -moz-appearance: textfield;
      }
      @keyframes shake {
        10%, 90% {
          transform: translate3d(-1px, 0, 0);
        }
        
        20%, 80% {
          transform: translate3d(2px, 0, 0);
        }
      
        30%, 50%, 70% {
          transform: translate3d(-4px, 0, 0);
        }
      
        40%, 60% {
          transform: translate3d(4px, 0, 0);
        }
      }
    `,
    bedroomsBathroomsContainer: {
      display: 'flex',
      gap: '14px',
      marginBottom: '22px'
    },
    selectContainer: {
      flex: 1,
      position: 'relative'
    },
    select: {
      width: '100%',
      padding: '14px',
      borderRadius: '12px',
      border: 'none',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      color: 'white',
      boxSizing: 'border-box',
      fontSize: '19px',
      appearance: 'none',
      WebkitAppearance: 'none',
      MozAppearance: 'none'
    },
    selectArrow: {
      position: 'absolute',
      right: '15px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: 'white',
      pointerEvents: 'none',
      fontSize: '12px'
    },
    addressContainer: {
      marginBottom: '22px'
    },
    addressRow: {
      display: 'flex',
      gap: '14px',
      marginBottom: '14px',
    },
    addressFieldContainer: {
      position: 'relative'
    },
    streetNumberContainer: { 
      flex: 3 
    },
    streetNameContainer: { 
      flex: 7 
    },
    cityContainer: { 
      flex: 5 
    },
    provinceContainer: { 
      flex: 2,
      position: 'relative'
    },
    postalCodeContainer: { 
      flex: 3 
    },
    textarea: {
      width: '100%',
      height: '168px',
      padding: '14px',
      borderRadius: '12px',
      border: 'none',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      color: 'white',
      resize: 'none',
      boxSizing: 'border-box',
      fontSize: '19px',
      marginBottom: '22px'
    },
    photosContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
      marginBottom: '22px'
    },
    photosButton: {
      padding: '14px 24px',
      borderRadius: '12px',
      border: 'none',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      color: 'white',
      cursor: 'pointer',
      fontSize: '19px'
    },
    createListingButton: {
      width: '100%',
      padding: '17px',
      borderRadius: '12px',
      border: 'none',
      backgroundColor: 'white',
      color: '#7C3AED',
      fontWeight: 'bold',
      cursor: 'pointer',
      fontSize: '22px',
      marginTop: '15px'
    },
    errorMessage: {
      color: '#ffcccc',
      fontSize: '14px',
      marginTop: '5px'
    },
    priceErrorMessage: {
      color: '#ffcccc',
      fontSize: '16px',
      fontWeight: 'bold',
      marginTop: '5px',
      animation: 'pulse 0.5s ease-in-out'
    },
    animationStyles: `
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
    `
  };

  const propertyTypes = ['Select Property Type', 'Apartment', 'House', 'Shared Room', 'Studio', 'Basement Suite'];
  const bedroomOptions = ['Select Bedrooms', '1', '2', '3', '4', '5'];
  const bathroomOptions = ['Select Bathrooms', '1', '2', '3+'];
  const provinceOptions = ['Select', 'AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'NT', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT'];

  const validateForm = () => {
    const newErrors = {};
    if (!propertyType || propertyType === 'Select Property Type') newErrors.propertyType = 'Please select a property type';
    if (!title.trim()) newErrors.title = 'Title is required';
    if (price === '') newErrors.price = 'Price is required';
    if (price !== '' && parseFloat(price) <= 0) newErrors.price = 'Price must be greater than 0';
    if (!bedrooms || bedrooms === 'Select Bedrooms') newErrors.bedrooms = 'Please select bedrooms';
    if (!bathrooms || bathrooms === 'Select Bathrooms') newErrors.bathrooms = 'Please select bathrooms';
    if (!streetNumber) newErrors.streetNumber = 'Street number is required';
    if (!streetName.trim()) newErrors.streetName = 'Street name is required';
    if (!city.trim()) newErrors.city = 'City is required';
    if (!province || province === 'Select') newErrors.province = 'Province is required';
    if (!postalCodeRegex.test(postalCode)) newErrors.postalCode = 'Invalid postal code format (A1A 1A1)';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form submitted:', {
        propertyType, title, price, bedrooms, bathrooms,
        streetNumber, streetName, city, province, postalCode, description
      });
    }
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    
    // Allow empty string for clearing the field
    if (value === '') {
      setPrice('');
      return;
    }
    
    // Only accept valid numbers
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      return;
    }
    
    // Show error for negative numbers but don't change the input
    if (numValue < 0) {
      setErrors({...errors, price: 'Price cannot be negative'});
      setShakePrice(true);
      return;
    }
    
    // Clear the error if it exists
    if (errors.price) {
      const newErrors = {...errors};
      delete newErrors.price;
      setErrors(newErrors);
    }
    
    setPrice(value);
  };

  const handlePostalCodeChange = (e) => {
    let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (value.length > 3) value = value.slice(0, 3) + ' ' + value.slice(3);
    setPostalCode(value.slice(0, 7));
  };

  return (
    <div style={styles.pageContainer}>
      <style>{styles.numberInputStyle}</style>
      <style>{styles.animationStyles}</style>
      <style>{`
        option {
          background-color: white;
          color: black;
          padding: 10px;
        }
        input::placeholder, textarea::placeholder, select::placeholder {
          color: rgba(255,255,255,0.7);
        }
        .postal-code::placeholder {
          letter-spacing: 1.5px;
        }
      `}</style>
      
      <div style={styles.formContainer}>
        <h1 style={styles.title}>Create Student Housing Listing</h1>
        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <input
              type="text"
              placeholder="Property Title"
              style={styles.input}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            {errors.title && <div style={styles.errorMessage}>{errors.title}</div>}
          </div>

          <div style={styles.inputGroup}>
            <div style={{ position: 'relative' }}>
              <select
                style={styles.select}
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                required
              >
                {propertyTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <div style={styles.selectArrow}>▼</div>
            </div>
            {errors.propertyType && <div style={styles.errorMessage}>{errors.propertyType}</div>}
          </div>

          <div style={styles.inputGroup}>
            <input
              type="number"
              placeholder="Price Per Month"
              style={{
                ...styles.numberInput,
                ...(shakePrice ? styles.shakingInput : {})
              }}
              value={price}
              onChange={handlePriceChange}
              required
            />
            {errors.price && 
              <div style={errors.price === 'Price cannot be negative' ? styles.priceErrorMessage : styles.errorMessage}>
                {errors.price}
              </div>
            }
          </div>

          <div style={styles.bedroomsBathroomsContainer}>
            <div style={styles.selectContainer}>
              <select
                style={styles.select}
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                required
              >
                {bedroomOptions.map((option) => (
                  <option key={option} value={option === 'Select Bedrooms' ? '' : option}>
                    {option}
                  </option>
                ))}
              </select>
              <div style={styles.selectArrow}>▼</div>
              {errors.bedrooms && <div style={styles.errorMessage}>{errors.bedrooms}</div>}
            </div>
            
            <div style={styles.selectContainer}>
              <select
                style={styles.select}
                value={bathrooms}
                onChange={(e) => setBathrooms(e.target.value)}
                required
              >
                {bathroomOptions.map((option) => (
                  <option key={option} value={option === 'Select Bathrooms' ? '' : option}>
                    {option}
                  </option>
                ))}
              </select>
              <div style={styles.selectArrow}>▼</div>
              {errors.bathrooms && <div style={styles.errorMessage}>{errors.bathrooms}</div>}
            </div>
          </div>

          <div style={styles.addressContainer}>
            <div style={styles.addressRow}>
              <div style={{ ...styles.addressFieldContainer, ...styles.streetNumberContainer }}>
                <input
                  type="number"
                  placeholder="Street Number"
                  style={styles.input}
                  value={streetNumber}
                  onChange={(e) => setStreetNumber(e.target.value)}
                  min="1"
                  required
                />
                {errors.streetNumber && <div style={styles.errorMessage}>{errors.streetNumber}</div>}
              </div>
              <div style={{ ...styles.addressFieldContainer, ...styles.streetNameContainer }}>
                <input
                  type="text"
                  placeholder="Street Name"
                  style={styles.input}
                  value={streetName}
                  onChange={(e) => setStreetName(e.target.value)}
                  required
                />
                {errors.streetName && <div style={styles.errorMessage}>{errors.streetName}</div>}
              </div>
            </div>
            <div style={styles.addressRow}>
              <div style={{ ...styles.addressFieldContainer, ...styles.cityContainer }}>
                <input
                  type="text"
                  placeholder="City"
                  style={styles.input}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
                {errors.city && <div style={styles.errorMessage}>{errors.city}</div>}
              </div>
              <div style={{ ...styles.provinceContainer }}>
                <select
                  style={styles.select}
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  required
                >
                  {provinceOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <div style={styles.selectArrow}>▼</div>
                {errors.province && <div style={styles.errorMessage}>{errors.province}</div>}
              </div>
              <div style={{ ...styles.addressFieldContainer, ...styles.postalCodeContainer }}>
                <input
                  type="text"
                  placeholder="A1A 1A1"
                  className="postal-code"
                  style={styles.input}
                  value={postalCode}
                  onChange={handlePostalCodeChange}
                  maxLength="7"
                  required
                />
                {errors.postalCode && <div style={styles.errorMessage}>{errors.postalCode}</div>}
              </div>
            </div>
          </div>

          <textarea
            placeholder="Describe your property, amenities, nearby campus, etc."
            style={styles.textarea}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div style={styles.photosContainer}>
            <button type="button" style={styles.photosButton}>
              Add Photos
            </button>
            <span style={{ color: 'white' }}>0/10 photos</span>
          </div>

          <button type="submit" style={styles.createListingButton}>
            Create Listing
          </button>
        </form>
      </div>
    </div>
  );
};

export default ListingCreate;