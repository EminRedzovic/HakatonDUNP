import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../../firebase";
import { addDoc, collection } from "firebase/firestore";
import "./createHomeWork.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import { storage } from "../../firebase2";
import { uploadBytes, getDownloadURL, ref } from "firebase/storage";

const CreateHomeWork = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null); // For image preview
  const [imageInput, setImageInput] = useState(null); // For storing image file
  const [imageUrls, setImageUrls] = useState([]); // For storing uploaded image URLs
  const homeworkCollection = collection(db, "homework");
  const token = localStorage.getItem("token");
  const [uploading, setUploading] = useState(false);

  // Handle image file input change
  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Get the file from input
    setImageInput(file); // Store the file for upload
    setImage(URL.createObjectURL(file)); // Set preview image
  };

  useEffect(() => {
    const importImg = async () => {
      if (imageInput) {
        setUploading(true); // Postavite na true dok se slika upload-uje
        try {
          const storageRef = ref(storage, `${token + imageInput.name}`);
          const uploadSnapshot = await uploadBytes(storageRef, imageInput);
          const downloadUrl = await getDownloadURL(uploadSnapshot.ref);
          setImageUrls([downloadUrl]);
          setUploading(false); // Postavite na false kada upload završi
        } catch (error) {
          console.error("Greška prilikom upload-a slike: ", error);
          setUploading(false); // Postavite na false u slučaju greške
        }
      }
    };

    if (imageInput) {
      importImg();
    }
  }, [imageInput, token]);

  // Form validation schema using Yup
  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      dueDate: "",
      image: null,
    },

    validationSchema: Yup.object({
      title: Yup.string().required("Naziv domaćeg zadatka je obavezan"),
      description: Yup.string().required("Opis domaćeg zadatka je obavezan"),
      dueDate: Yup.date().required("Rok je obavezan"),
    }),

    onSubmit: async (values) => {
      try {
        const data = {
          title: values.title,
          description: values.description,
          dueDate: values.dueDate,
          image: imageUrls[0] || "", // If image exists, save URL, otherwise empty string
        };

        await addDoc(homeworkCollection, data); // Add document to Firestore

        alert("Uspesno");
        navigate("/homework"); // Navigate to the homework page after submission
      } catch (err) {
        console.log("Error adding homework: ", err);
      }
    },
  });

  return (
    <div className="create-homework-page1">
      <div className="sidebar-div">
        <Sidebar />
      </div>
      <div className="create-homework-page">
        <div className="create-homework-container">
          <h1>Dodaj Domaći Zadatak</h1>

          <form onSubmit={formik.handleSubmit} className="create-homework-form">
            <div className="create-homework-input-group">
              <label htmlFor="title">Naziv Domaćeg Zadatka</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Unesite naziv domaćeg zadatka"
              />
              {formik.touched.title && formik.errors.title && (
                <div className="create-homework-error">
                  {formik.errors.title}
                </div>
              )}
            </div>

            <div className="create-homework-input-group">
              <label htmlFor="description">Opis Domaćeg Zadatka</label>
              <textarea
                id="description"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Unesite opis domaćeg zadatka"
              />
              {formik.touched.description && formik.errors.description && (
                <div className="create-homework-error">
                  {formik.errors.description}
                </div>
              )}
            </div>

            <div className="create-homework-input-group">
              <label htmlFor="dueDate">Rok</label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formik.values.dueDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.dueDate && formik.errors.dueDate && (
                <div className="create-homework-error">
                  {formik.errors.dueDate}
                </div>
              )}
            </div>

            <div className="create-homework-input-group">
              <label htmlFor="image">Dodaj Sliku</label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
              />
              {image && (
                <img
                  src={image}
                  alt="Preview"
                  className="create-homework-image-preview"
                />
              )}
            </div>

            <div className="create-homework-button-div">
              <button
                type="submit"
                className="create-homework-button"
                disabled={uploading}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateHomeWork;
