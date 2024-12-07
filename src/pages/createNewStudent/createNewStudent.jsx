import React from "react";
import "./createNewStudent.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import logoPhoto from "../../photos/download-removebg-preview.png";
import { db, auth } from "../../firebase";
import { Navigate, useNavigate } from "react-router-dom";
import { collection } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";


const CreateNewStudent = () => {
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
    <div className="cns-page">
      <div className="teacher-register">
        <h1>Dodaj Domaci Zadatak</h1>

        <form onSubmit={formik.handleSubmit} className="register-form">
          <div className="email-div">
            <input name="username" placeholder="Naziv Ucenika" />
          </div>

          <div className="password-div">
            <input
              name="password"
              placeholder="Sifra za ucenika."
              type="text"
            />
          </div>

          <div className="department">
            <input list="department" name="department" placeholder="Odeljenje ucenika"/>
            <datalist id="department">
              <option value="III-1" />
              <option value="IV-1" />
              <option value="V-1" />
              <option value="VI-1" />
              <option value="VII-1" />
            </datalist>
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

export default CreateNewStudent;
