"use client"


import { useState, useEffect, useRef } from "react"
import listingService from "../services/ListingService"
import "./ListingCreate.css"


class FormValidator {
 static validate(formData) {
   const errors = {}
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


   requiredFields.forEach((field) => {
     if (!formData[field]) {
       errors[field] = "This field is required"
     }
   })


   if (formData.price && (isNaN(formData.price) || formData.price <= 0)) {
     errors.price = "Price must be a number greater than 0"
   }


   if (formData.bed && (isNaN(formData.bed) || formData.bed <= 0 || !Number.isInteger(Number(formData.bed)))) {
     errors.bed = "Bedrooms must be a whole number greater than 0"
   }


   if (formData.bath && (isNaN(formData.bath) || formData.bath <= 0 || !Number.isInteger(Number(formData.bath)))) {
     errors.bath = "Bathrooms must be a whole number greater than 0"
   }


   if (formData.postal_code && !/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/.test(formData.postal_code)) {
     errors.postal_code = "Please enter a valid postal code (e.g. A1A 1A1)"
   }


   return errors
 }
}


class ListingData {
 constructor() {
   this.title = ""
   this.description = ""
   this.price = ""
   this.bed = ""
   this.bath = ""
   this.street_name = ""
   this.street_number = ""
   this.city = ""
   this.province = ""
   this.postal_code = ""
   this.url = ""
   this.has_laundry = false
   this.has_parking = false
   this.has_gym = false
   this.has_hvac = false
   this.has_wifi = false
   this.has_game_room = false
   this.is_pet_friendly = false
   this.is_accessible = false
 }
}


class ImageManager {
 constructor() {
   this.files = []
   this.previewUrls = []
 }


 addFiles(newFiles) {
   const validFiles = newFiles.filter(
     (file) => file.type === "image/jpeg" && file.size <= 1 * 1024 * 1024
   )
  
   if (this.files.length + validFiles.length > 10) {
     throw new Error(`Maximum of 10 images allowed. You can add ${10 - this.files.length} more.`)
   }
  
   this.files = [...this.files, ...validFiles]
   this.previewUrls = [...this.previewUrls, ...validFiles.map((file) => URL.createObjectURL(file))]
 }


 removeImage(index) {
   URL.revokeObjectURL(this.previewUrls[index])
   this.files = this.files.filter((_, i) => i !== index)
   this.previewUrls = this.previewUrls.filter((_, i) => i !== index)
 }


 clear() {
   this.previewUrls.forEach((url) => URL.revokeObjectURL(url))
   this.files = []
   this.previewUrls = []
 }
}


const ListingCreate = ({ setCurrentPage }) => {
 const [isAuthorized, setIsAuthorized] = useState(false)
 const [isUploading, setIsUploading] = useState(false)
 const [errors, setErrors] = useState({})
 const [listingData, setListingData] = useState(new ListingData())
 const imageManagerRef = useRef(new ImageManager())
 const hasRedirected = useRef(false)
 const fileInputRef = useRef(null)


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
   //Store the current imageManager in a variable
   const imageManager = imageManagerRef.current


   return () => {
     //Use the stored variable in cleanup
     if (imageManager) {
       imageManager.clear()
     }
   }
 }, [])


 const validateForm = () => {
   const errors = FormValidator.validate(listingData)
   setErrors(errors)
   return Object.keys(errors).length === 0
 }


 const handleUpload = async () => {
   if (!validateForm()) {
     alert("Please fix the errors in the form before submitting")
     return
   }


   try {
     setIsUploading(true)
     await listingService.createListing(listingData, imageManagerRef.current.files)
     alert("Listing created successfully")
     setCurrentPage("listings")
   } catch (error) {
     alert(error.message)
     if (error.message.includes("Login")) {
       setCurrentPage("login")
     }
   } finally {
     setIsUploading(false)
   }
 }


 const handleFileChange = (event) => {
   try {
     imageManagerRef.current.addFiles(Array.from(event.target.files))
     //Force re-render by updating state
     setListingData({...listingData})
   } catch (error) {
     alert(error.message)
   }
 }


 const removeImage = (index) => {
   imageManagerRef.current.removeImage(index)
   //force re-render by updating state
   setListingData({...listingData})
 }


 const handleInputChange = (event) => {
   const { name, value } = event.target
   setListingData({
     ...listingData,
     [name]: value
   })
 }


 const handleCheckboxChange = (event) => {
   const { name, checked } = event.target
   setListingData({
     ...listingData,
     [name]: checked
   })
 }


 const triggerFileInput = () => {
   fileInputRef.current?.click()
 }


 if (!isAuthorized) return null


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
             value={listingData.title}
             onChange={handleInputChange}
             className={errors.title ? "form-control error" : "form-control"}
           />
           {errors.title && <div className="error-text">{errors.title}</div>}
         </div>


         <div className="form-row">
           <label>Description</label>
           <textarea
             name="description"
             value={listingData.description}
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
             value={listingData.price}
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
             value={listingData.bed}
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
             value={listingData.bath}
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
             value={listingData.street_number}
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
             value={listingData.street_name}
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
             value={listingData.city}
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
             value={listingData.province}
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
             value={listingData.postal_code}
             onChange={handleInputChange}
             className={errors.postal_code ? "form-control error" : "form-control"}
           />
           {errors.postal_code && <div className="error-text">{errors.postal_code}</div>}
         </div>


         <div className="form-row">
           <label>Listing URL</label>
           <input
             type="text"
             name="url"
             value={listingData.url}
             onChange={handleInputChange}
             className="form-control"
           />
         </div>


         <h3 className="section-title">Amenities</h3>


         <div className="amenities-grid">
           <div className="checkbox-row">
             <input
               type="checkbox"
               id="has_laundry"
               name="has_laundry"
               checked={listingData.has_laundry}
               onChange={handleCheckboxChange}
             />
             <label htmlFor="has_laundry">Laundry</label>
           </div>


           <div className="checkbox-row">
             <input
               type="checkbox"
               id="has_parking"
               name="has_parking"
               checked={listingData.has_parking}
               onChange={handleCheckboxChange}
             />
             <label htmlFor="has_parking">Parking</label>
           </div>


           <div className="checkbox-row">
             <input
               type="checkbox"
               id="has_gym"
               name="has_gym"
               checked={listingData.has_gym}
               onChange={handleCheckboxChange}
             />
             <label htmlFor="has_gym">Gym</label>
           </div>


           <div className="checkbox-row">
             <input
               type="checkbox"
               id="has_hvac"
               name="has_hvac"
               checked={listingData.has_hvac}
               onChange={handleCheckboxChange}
             />
             <label htmlFor="has_hvac">HVAC</label>
           </div>


           <div className="checkbox-row">
             <input
               type="checkbox"
               id="has_wifi"
               name="has_wifi"
               checked={listingData.has_wifi}
               onChange={handleCheckboxChange}
             />
             <label htmlFor="has_wifi">WiFi</label>
           </div>


           <div className="checkbox-row">
             <input
               type="checkbox"
               id="has_game_room"
               name="has_game_room"
               checked={listingData.has_game_room}
               onChange={handleCheckboxChange}
             />
             <label htmlFor="has_game_room">Game Room</label>
           </div>


           <div className="checkbox-row">
             <input
               type="checkbox"
               id="is_pet_friendly"
               name="is_pet_friendly"
               checked={listingData.is_pet_friendly}
               onChange={handleCheckboxChange}
             />
             <label htmlFor="is_pet_friendly">Pet Friendly</label>
           </div>


           <div className="checkbox-row">
             <input
               type="checkbox"
               id="is_accessible"
               name="is_accessible"
               checked={listingData.is_accessible}
               onChange={handleCheckboxChange}
             />
             <label htmlFor="is_accessible">Accessible</label>
           </div>
         </div>


         <div className="form-row image-upload-row">
           <label>Images (Max 10)</label>
           <div className="file-upload-container">
             <input
               type="file"
               ref={fileInputRef}
               accept="image/jpeg"
               onChange={handleFileChange}
               multiple
               className="file-input"
               style={{ display: 'none' }}
             />
             <button
               type="button"
               onClick={triggerFileInput}
               className="upload-button"
             >
               Select Images
             </button>
             <p className="file-count">{imageManagerRef.current.files.length} / 10 images selected</p>
           </div>
         </div>


         <div className="image-preview">
           {imageManagerRef.current.previewUrls.map((url, index) => (
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
