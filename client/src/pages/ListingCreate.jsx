import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";



const ListingCreate = () => {
  const navigate = useNavigate();
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
  });

  const hasRedirected = useRef(false);
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user && !hasRedirected.current) {
      hasRedirected.current = true;
      alert("Please login to create a listing.");
      navigate("/login");
    } else {
      setIsAuthorized(true);
    }
  }, [navigate]);

  if (!isAuthorized) return null;

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    
    const validFiles = selectedFiles.filter(file => 
      file.type === "image/jpeg" && file.size <= 10 * 1024 * 1024
    );

    if (files.length + validFiles.length > 10) {
      alert("Maximum of 10 images allowed.");
      return;
    }

    setFiles(prevFiles => [...prevFiles, ...validFiles]);
    setPreviewUrls(prevUrls => [...prevUrls, ...validFiles.map(file => URL.createObjectURL(file))]);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpload = async () => {

    if (files.length === 0) return;
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    if (!user || !token) {
      alert("Login required");
      navigate("/login");
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
      await axios.post("http://localhost:5001/upload", uploadData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Upload successful");
    } catch (error) {
      console.error("Upload failed", error);
      alert("Upload failed");
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
      {files.length < 10 && (
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