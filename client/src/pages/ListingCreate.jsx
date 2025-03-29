import React, { useState, useEffect, useRef } from "react";
import "./ListingCreate.css"
import axios from "axios";

const ListingCreate = ({ setCurrentPage }) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [errors, setErrors] = useState({})
  const [files, setFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    bed: "",
    bath: "",
    street_name: "",
    street_number: "",
    city: "",
    province: "",
    postal_code: "",
    url: "",
    has_laundry: false,
    has_parking: false,
    has_gym: false,
    has_hvac: false,
    has_wifi: false,
    has_game_room: false,
    is_pet_friendly: false,
    is_accessible: false,
  });

  const hasRedirected = useRef(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!user || !token) {
      if (!hasRedirected.current) {
        hasRedirected.current = true;
        alert("Login required");
        setCurrentPage("login");
      }
    } else {
      setIsAuthorized(true);
    }
  }, [setCurrentPage]);

  useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      'title', 'description', 'price', 'bed', 'bath',
      'street_name', 'street_number', 'city', 'province', 'postal_code'
    ];

    // Check required fields
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = 'This field is required';
      }
    });

    // Validate numeric fields
    if (formData.price && (isNaN(formData.price) || formData.price <= 0)) {
      newErrors.price = 'Price must be a number greater than 0';
    }

    if (formData.bed && (isNaN(formData.bed) || formData.bed <= 0 || !Number.isInteger(Number(formData.bed)))) {
      newErrors.bed = 'Bedrooms must be a whole number greater than 0';
    }

    if (formData.bath && (isNaN(formData.bath) || formData.bath <= 0 || !Number.isInteger(Number(formData.bath)))) {
      newErrors.bath = 'Bathrooms must be a whole number greater than 0';
    }

    // Validate postal code format (basic Canadian format)
    if (formData.postal_code && !/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/.test(formData.postal_code)) {
      newErrors.postal_code = 'Please enter a valid postal code (e.g. A1A 1A1)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpload = async () => {
    // First validate the form
    if (!validateForm()) {
      alert('Please fix the errors in the form before submitting');
      return;
    }
  
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    if (!user || !token) {
      alert("Login required");
      setCurrentPage("login"); 
      return;
    }
    
    const uploadData = new FormData();
    files.forEach((file) => {
      uploadData.append("images", file);
    });

    Object.keys(formData).forEach((key) => {
      uploadData.append(key, formData[key]);
    });

    uploadData.append("users_id", user.users_id);

    try {
      setIsUploading(true);
      await axios.post("http://localhost:5001/upload", uploadData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Upload successful");
      setCurrentPage("listings");
    } catch (error) {
      console.error("Upload failed", error);
      alert("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  if (!isAuthorized) return null;

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    
    const validFiles = selectedFiles.filter(file => 
      file.type === "image/jpeg" && file.size <= 1 * 1024 * 1024
    );

    if (files.length + validFiles.length > 10) {
      alert("Maximum of 10 images allowed. You can add " + (10 - files.length) + " more.");
      return;
    }

    setFiles(prevFiles => [...prevFiles, ...validFiles]);
    const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(prevUrls => [...prevUrls, ...newPreviewUrls]);
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(previewUrls[index]);
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    setPreviewUrls(prevUrls => prevUrls.filter((_, i) => i !== index));
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setFormData({ ...formData, [name]: checked });
  };

  return (
    <div className="page">
      <div className="container">

        <div className="content">
          <h2>Create New Listing</h2>
          
          <div className="form-row">
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-row">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
            />
          </div>

          <div className="form-row">
            <label>Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-row">
            <label>Bedrooms</label>
            <input
              type="number"
              name="bed"
              value={formData.bed}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-row">
            <label>Bathrooms</label>
            <input
              type="number"
              name="bath"
              value={formData.bath}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-row">
            <label>Street Number</label>
            <input
              type="text"
              name="street_number"
              value={formData.street_number}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-row">
            <label>Street Name</label>
            <input
              type="text"
              name="street_name"
              value={formData.street_name}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-row">
            <label>City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-row">
            <label>Province</label>
            <input
              type="text"
              name="province"
              value={formData.province}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-row">
            <label>Postal Code</label>
            <input
              type="text"
              name="postal_code"
              value={formData.postal_code}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-row">
            <label>Listing URL</label>
            <input
              type="text"
              name="url"
              value={formData.url}
              onChange={handleInputChange}
            />
          </div>

          <h3 style={{ margin: "20px 0 10px", color: "#5b088f" }}>Amenities</h3>
          
          <div className="checkbox-row">
            <input type="checkbox" name="has_laundry" checked={formData.has_laundry} onChange={handleCheckboxChange} />
            <label>Laundry</label>
          </div>
          
          <div className="checkbox-row">
            <input type="checkbox" name="has_parking" checked={formData.has_parking} onChange={handleCheckboxChange} />
            <label>Parking</label>
          </div>
          
          <div className="checkbox-row">
            <input type="checkbox" name="has_gym" checked={formData.has_gym} onChange={handleCheckboxChange} />
            <label>Gym</label>
          </div>
          
          <div className="checkbox-row">
            <input type="checkbox" name="has_hvac" checked={formData.has_hvac} onChange={handleCheckboxChange} />
            <label>HVAC</label>
          </div>
          
          <div className="checkbox-row">
            <input type="checkbox" name="has_wifi" checked={formData.has_wifi} onChange={handleCheckboxChange} />
            <label>WiFi</label>
          </div>
          
          <div className="checkbox-row">
            <input type="checkbox" name="has_game_room" checked={formData.has_game_room} onChange={handleCheckboxChange} />
            <label>Game Room</label>
          </div>
          
          <div className="checkbox-row">
            <input type="checkbox" name="is_pet_friendly" checked={formData.is_pet_friendly} onChange={handleCheckboxChange} />
            <label>Pet Friendly</label>
          </div>
          
          <div className="checkbox-row">
            <input type="checkbox" name="is_accessible" checked={formData.is_accessible} onChange={handleCheckboxChange} />
            <label>Accessible</label>
          </div>

          <div className="form-row" style={{ marginTop: "20px" }}>
            <label>Images (Max 10)</label>
            <div style={{ flex: 1 }}>
              <input 
                type="file" 
                accept="image/jpeg" 
                onChange={handleFileChange} 
                multiple
                style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "8px" }}
              />
              <p style={{ margin: "5px 0", color: "#666" }}>{files.length} / 10 images selected</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', margin: "15px 0 25px" }}>
            {previewUrls.map((url, index) => (
              <div key={index} style={{ position: 'relative' }}>
                <img 
                  src={url} 
                  alt="Preview" 
                  style={{ 
                    width: '100px', 
                    height: '100px', 
                    objectFit: 'cover',
                    borderRadius: "8px",
                    border: "1px solid #ddd"
                  }}
                />
                <button 
                  onClick={() => removeImage(index)}
                  style={{ 
                    padding: '0.8rem 0.8rem 0.8rem 0.8rem',
                    position: 'absolute', 
                    top: '5px', 
                    right: '5px', 
                    background: '#5b088f', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '100%',
                    width: '20px',
                    height: '20px',
                    cursor: 'pointer',
                    fontSize: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <button 
            onClick={handleUpload} 
            disabled={isUploading}
            style={{
              padding: "12px 25px",
              background: "linear-gradient(to right, #5b088f, #b94dff)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "1rem",
              transition: "all 0.3s ease-in-out",
              marginTop: "10px"
            }}
            onMouseOver={(e) => {
              e.target.style.transform = "scale(1.05)";
              e.target.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
            }}
            onMouseOut={(e) => {
              e.target.style.transform = "scale(1)";
              e.target.style.boxShadow = "none";
            }}
          >
            {isUploading ? "Uploading..." : "Create Listing"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListingCreate;