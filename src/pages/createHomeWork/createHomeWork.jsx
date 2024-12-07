import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../../firebase";
import { addDoc, collection } from "firebase/firestore";
import "./createHomeWork.css";
import Sidebar from "../../components/Sidebar/Sidebar";

const CreateHomeWork = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null); // For image upload
  const homeworkCollection = collection(db, "homework");

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      dueDate: "",
      file: null,
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
          file: values.file,
          image: values.image,
        };

        await addDoc(homeworkCollection, data);

        alert("Uspesno");
      } catch (err) {
        console.log(err);
      }
    },
  });

  const handleImageChange = (e) => {
    setImage(URL.createObjectURL(e.target.files[0]));
  };

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
              <label htmlFor="file">Priloži PDF Domaćeg</label>
              <input
                type="file"
                id="file"
                name="file"
                accept="application/pdf"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.file && formik.errors.file && (
                <div className="create-homework-error">
                  {formik.errors.file}
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
                onChange={formik.handleChange}
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
              <button type="submit" className="create-homework-button">
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
