import React from "react";
import "./TeacherRegister.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import logoPhoto from "../../photos/download-removebg-preview.png";
import { db, auth } from "../../firebase";
import { Navigate, useNavigate } from "react-router-dom";
import { collection } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";

const TeacherLogin = () => {
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
    <div className="teacher-register">
      <img className="logo-register" src={logoPhoto} alt="" />

      <form onSubmit={formik.handleSubmit} className="register-form">
        <div className="email-div">
          <input
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Email..."
          />
          {formik.errors.email && formik.touched.email ? (
            <p className="error">{formik.errors.email}</p>
          ) : null}
        </div>

        <div className="password-div">
          <input
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Password..."
            type="password"
          />
          {formik.errors.password && formik.touched.password ? (
            <p className="error">{formik.errors.password}</p>
          ) : null}
        </div>

        <div className="register-button-div">
          <button type="submit" className="register-button">
            Prijavi se
          </button>
        </div>
      </form>
    </div>
  );
};

export default TeacherLogin;
