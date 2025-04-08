//listingcreate component

"use client"

import { useState, useEffect, useRef } from "react"
import "./ListingCreate.css"
import axios from "axios"

const ListingCreate = ({ setCurrentPage }) => {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const [errors, setErrors] = useState({})
  const [files, setFiles] = useState([])
  const [previewUrls, setPreviewUrls] = useState([])
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
  })

  const hasRedirected = useRef(false)

  useEffect(() => {
    const user = localStorage.getItem("user")
    const token = localStorage.getItem("token")

    if (!user || !token) {
      if (!hasRedirected.current) {
        hasRedirected.current = true
        alert("Login required")
        setCurrentPage("login")
      }
    } else {
      setIsAuthorized(true)
    }
  }, [setCurrentPage])

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [previewUrls])

  const validateForm = () => {
    const newErrors = {}
    const requiredFields = [
      "title",
      "description",
      "price",
      "bed",
      "bath",
      "street_name",
      "street_number",
      "city",
      "province",
      "postal_code",
    ]

    //Check required fields
    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = "This field is required"
      }
    })

    //Validate numeric fields
    if (formData.price && (isNaN(formData.price) || formData.price <= 0)) {
      newErrors.price = "Price must be a number greater than 0"
    }

    if (formData.bed && (isNaN(formData.bed) || formData.bed <= 0 || !Number.isInteger(Number(formData.bed)))) {
      newErrors.bed = "Bedrooms must be a whole number greater than 0"
    }

    if (formData.bath && (isNaN(formData.bath) || formData.bath <= 0 || !Number.isInteger(Number(formData.bath)))) {
      newErrors.bath = "Bathrooms must be a whole number greater than 0"
    }

    //validate postal code format (basic Canadian format)
    if (formData.postal_code && !/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/.test(formData.postal_code)) {
      newErrors.postal_code = "Please enter a valid postal code (e.g. A1A 1A1)"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleUpload = async () => {
    //First validate the form
    if (!validateForm()) {
      alert("Please fix the errors in the form before submitting")
      return
    }

    const user = JSON.parse(localStorage.getItem("user"))
    const token = localStorage.getItem("token")
    if (!user || !token) {
      alert("Login required")
      setCurrentPage("login")
      return
    }

    try {
      setIsUploading(true)

      //create FormData object
      const uploadData = new FormData()

      //Add all form fields
      Object.keys(formData).forEach((key) => {
        // Convert boolean values to 0/1 for the server
        if (typeof formData[key] === "boolean") {
          uploadData.append(key, formData[key] ? 1 : 0)
        } else {
          uploadData.append(key, formData[key])
        }
      })

      //add all image filess
      files.forEach((file) => {
        uploadData.append("images", file)
      })


      const token = localStorage.getItem("token")


      const response = await axios.post("http://localhost:5001/upload", uploadData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })

      console.log("Upload response:", response.data)
      alert("Upload successful")
      setCurrentPage("listings")
    } catch (error) {
      console.error("Upload failed", error)
      if (error.response) {
        console.error("Error response:", error.response.data)
        alert(`Upload failed: ${error.response.data.error || "Server error"}`)
      } else if (error.request) {
        alert("Upload failed: No response from server")
      } else {
        alert(`Upload failed: ${error.message}`)
      }
    } finally {
      setIsUploading(false)
    }
  }

  if (!isAuthorized) return null

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files)

    const validFiles = selectedFiles.filter((file) => file.type === "image/jpeg" && file.size <= 1 * 1024 * 1024)

    if (files.length + validFiles.length > 10) {
      alert("Maximum of 10 images allowed. You can add " + (10 - files.length) + " more.")
      return
    }

    setFiles((prevFiles) => [...prevFiles, ...validFiles])
    const newPreviewUrls = validFiles.map((file) => URL.createObjectURL(file))
    setPreviewUrls((prevUrls) => [...prevUrls, ...newPreviewUrls])
  }

  const removeImage = (index) => {
    URL.revokeObjectURL(previewUrls[index])
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
    setPreviewUrls((prevUrls) => prevUrls.filter((_, i) => i !== index))
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target
    setFormData({ ...formData, [name]: checked })
  }

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
              className={errors.title ? "form-control error" : "form-control"}
            />
            {errors.title && <div className="error-text">{errors.title}</div>}
          </div>

          <div className="form-row">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              className={errors.description ? "form-control error" : "form-control"}
            />
            {errors.description && <div className="error-text">{errors.description}</div>}
          </div>

          <div className="form-row">
            <label>Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className={errors.price ? "form-control error" : "form-control"}
            />
            {errors.price && <div className="error-text">{errors.price}</div>}
          </div>

          <div className="form-row">
            <label>Bedrooms</label>
            <input
              type="number"
              name="bed"
              value={formData.bed}
              onChange={handleInputChange}
              className={errors.bed ? "form-control error" : "form-control"}
            />
            {errors.bed && <div className="error-text">{errors.bed}</div>}
          </div>

          <div className="form-row">
            <label>Bathrooms</label>
            <input
              type="number"
              name="bath"
              value={formData.bath}
              onChange={handleInputChange}
              className={errors.bath ? "form-control error" : "form-control"}
            />
            {errors.bath && <div className="error-text">{errors.bath}</div>}
          </div>

          <div className="form-row">
            <label>Street Number</label>
            <input
              type="text"
              name="street_number"
              value={formData.street_number}
              onChange={handleInputChange}
              className={errors.street_number ? "form-control error" : "form-control"}
            />
            {errors.street_number && <div className="error-text">{errors.street_number}</div>}
          </div>

          <div className="form-row">
            <label>Street Name</label>
            <input
              type="text"
              name="street_name"
              value={formData.street_name}
              onChange={handleInputChange}
              className={errors.street_name ? "form-control error" : "form-control"}
            />
            {errors.street_name && <div className="error-text">{errors.street_name}</div>}
          </div>

          <div className="form-row">
            <label>City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className={errors.city ? "form-control error" : "form-control"}
            />
            {errors.city && <div className="error-text">{errors.city}</div>}
          </div>

          <div className="form-row">
            <label>Province</label>
            <input
              type="text"
              name="province"
              value={formData.province}
              onChange={handleInputChange}
              className={errors.province ? "form-control error" : "form-control"}
            />
            {errors.province && <div className="error-text">{errors.province}</div>}
          </div>

          <div className="form-row">
            <label>Postal Code</label>
            <input
              type="text"
              name="postal_code"
              value={formData.postal_code}
              onChange={handleInputChange}
              className={errors.postal_code ? "form-control error" : "form-control"}
            />
            {errors.postal_code && <div className="error-text">{errors.postal_code}</div>}
          </div>

          <div className="form-row">
            <label>Listing URL</label>
            <input type="text" name="url" value={formData.url} onChange={handleInputChange} className="form-control" />
          </div>

          <h3 className="section-title">Amenities</h3>

          <div className="amenities-grid">
            <div className="checkbox-row">
              <input
                type="checkbox"
                id="has_laundry"
                name="has_laundry"
                checked={formData.has_laundry}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="has_laundry">Laundry</label>
            </div>

            <div className="checkbox-row">
              <input
                type="checkbox"
                id="has_parking"
                name="has_parking"
                checked={formData.has_parking}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="has_parking">Parking</label>
            </div>

            <div className="checkbox-row">
              <input
                type="checkbox"
                id="has_gym"
                name="has_gym"
                checked={formData.has_gym}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="has_gym">Gym</label>
            </div>

            <div className="checkbox-row">
              <input
                type="checkbox"
                id="has_hvac"
                name="has_hvac"
                checked={formData.has_hvac}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="has_hvac">HVAC</label>
            </div>

            <div className="checkbox-row">
              <input
                type="checkbox"
                id="has_wifi"
                name="has_wifi"
                checked={formData.has_wifi}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="has_wifi">WiFi</label>
            </div>

            <div className="checkbox-row">
              <input
                type="checkbox"
                id="has_game_room"
                name="has_game_room"
                checked={formData.has_game_room}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="has_game_room">Game Room</label>
            </div>

            <div className="checkbox-row">
              <input
                type="checkbox"
                id="is_pet_friendly"
                name="is_pet_friendly"
                checked={formData.is_pet_friendly}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="is_pet_friendly">Pet Friendly</label>
            </div>

            <div className="checkbox-row">
              <input
                type="checkbox"
                id="is_accessible"
                name="is_accessible"
                checked={formData.is_accessible}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="is_accessible">Accessible</label>
            </div>
          </div>

          <div className="form-row image-upload-row">
            <label>Images (Max 10)</label>
            <div className="file-upload-container">
              <input type="file" accept="image/jpeg" onChange={handleFileChange} multiple className="file-input" />
              <p className="file-count">{files.length} / 10 images selected</p>
            </div>
          </div>

          <div className="image-preview">
            {previewUrls.map((url, index) => (
              <div key={index} className="image-preview-item">
                <img src={url || "/placeholder.svg"} alt="Preview" />
                <button onClick={() => removeImage(index)} className="remove-image-btn">
                  ×
                </button>
              </div>
            ))}
          </div>

          <button onClick={handleUpload} disabled={isUploading} className="submit-button">
            {isUploading ? "Uploading..." : "Create Listing"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ListingCreate
