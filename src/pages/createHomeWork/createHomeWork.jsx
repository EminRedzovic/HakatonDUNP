import React from "react";
import "./createHomeWork.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import logoPhoto from "../../photos/download-removebg-preview.png";
import { db, auth } from "../../firebase";
import { Navigate, useNavigate } from "react-router-dom";
import { collection } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";

const CreateHomeWork = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userCollection = collection(db, "users");

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },

    validationSchema: Yup.object({
      email: Yup.string().email("nevalidan e-mail").required("obavezno"),
      password: Yup.string()
        .required("obavezno")
        .min(6, "minimalna duzina je 6 karaktera")
        .max(20, "maksimalna duzina je 20 karaktera"),
    }),

    onSubmit: async (values) => {
      const token = localStorage.getItem("token");
      if (!token) {
        try {
          const userCredential = await signInWithEmailAndPassword(
            auth,
            formik.values.email,
            formik.values.password
          );
          localStorage.setItem("token", userCredential.user.uid);
          navigate("/");
        } catch (err) {
          alert("Uneti nalog ne postoji");
        }
      } else {
        alert("Vec ste prijavljeni!");
      }
    },
  });

  if (token) {
    return <Navigate to={"/"} replace={true} />;
  }

  return (
    <div className="chw-page">
      <div className="teacher-register">
        <h1>Dodaj Domaci Zadatak</h1>

        <form onSubmit={formik.handleSubmit} className="register-form">
          <div className="email-div">
            <input
              name="email"
              placeholder="Naziv Domaceg Zadatka"
            />
          </div>

          <div className="password-div">
            <input
              name="password"
              placeholder="Opis Domaceg Zadatka."
              type="text"
            />
          </div>

          <div className="date">
            <input
              name="date"
              placeholder="Rok"
              type="date"
            />
          </div>
          <div className="file">
            <input
              name="file"
              placeholder="Dodaj fajl"
              type="file"
            />
          </div>

          <div className="register-button-div">
            <button type="submit" className="register-button">
              Dodaj
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateHomeWork;
