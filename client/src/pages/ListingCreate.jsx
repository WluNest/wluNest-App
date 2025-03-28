import React, { useState, useEffect, useRef } from "react";
import axios from "axios";



const ListingCreate = ({ setCurrentPage }) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

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
  

  if (!isAuthorized) return null;

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    
    const validFiles = selectedFiles.filter(file => 
      file.type === "image/jpeg" && file.size <= 1 * 1024 * 1024
    );

    if (files.length + validFiles.length > 1) {
      alert("Maximum of 1 images allowed.");
      return;
    }

    setFiles(prevFiles => [...prevFiles, ...validFiles]);
    setPreviewUrls(prevUrls => [...prevUrls, ...validFiles.map(file => URL.createObjectURL(file))]);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setFormData({ ...formData, [name]: checked });
  };
  
  const handleUpload = async () => {

    if (files.length === 0) return;
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
    }  catch (error) {
      console.error("Upload failed", error);
      alert("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={formData.title}
        onChange={handleInputChange}
      />
      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleInputChange}
      />
      <input
        type="number"
        name="price"
        placeholder="Price"
        value={formData.price}
        onChange={handleInputChange}
      />
      <input
        type="number"
        name="bed"
        placeholder="Bedrooms"
        value={formData.bed}
        onChange={handleInputChange}
      />
      <input
        type="number"
        name="bath"
        placeholder="Bathrooms"
        value={formData.bath}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="street_name"
        placeholder="Street Name"
        value={formData.street_name}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="street_number"
        placeholder="Street Number"
        value={formData.street_number}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="city"
        placeholder="City"
        value={formData.city}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="province"
        placeholder="Province"
        value={formData.province}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="postal_code"
        placeholder="Postal Code"
        value={formData.postal_code}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="url"
        placeholder="Listing URL"
        value={formData.url}
        onChange={handleInputChange}
      />

      <label>
        <input type="checkbox" name="has_laundry" checked={formData.has_laundry} onChange={handleCheckboxChange} />
        Laundry
      </label>
      <label>
        <input type="checkbox" name="has_parking" checked={formData.has_parking} onChange={handleCheckboxChange} />
        Parking
      </label>
      <label>
        <input type="checkbox" name="has_gym" checked={formData.has_gym} onChange={handleCheckboxChange} />
        Gym
      </label>
      <label>
        <input type="checkbox" name="has_hvac" checked={formData.has_hvac} onChange={handleCheckboxChange} />
        HVAC
      </label>
      <label>
        <input type="checkbox" name="has_wifi" checked={formData.has_wifi} onChange={handleCheckboxChange} />
        WiFi
      </label>
      <label>
        <input type="checkbox" name="has_game_room" checked={formData.has_game_room} onChange={handleCheckboxChange} />
        Game Room
      </label>
      <label>
        <input type="checkbox" name="is_pet_friendly" checked={formData.is_pet_friendly} onChange={handleCheckboxChange} />
        Pet Friendly
      </label>
      <label>
        <input type="checkbox" name="is_accessible" checked={formData.is_accessible} onChange={handleCheckboxChange} />
        Accessible
      </label>


      {files.length < 1 && (
        <input type="file" accept="image/jpeg" onChange={handleFileChange} />
      )}
      <div>
        {previewUrls.map((url, index) => (
          <img key={index} src={url} alt="Preview" />
        ))}
      </div>
      <button onClick={handleUpload}>Upload</button>
      {isUploading ? "Uploading..." : "Upload"}
    </div>
  );
};

export default ListingCreate;
