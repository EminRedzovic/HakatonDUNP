import React from "react";
import "./TeacherRegister.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import logoPhoto from "../../photos/download-removebg-preview.png";
import { db, auth } from "../../firebase";
import { Navigate, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";

const TeacherRegister = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userCollection = collection(db, "users");

  const predmeti = [
    "matematika",
    "srpski",
    "geografija",
    "istoija",
    "biologija",
    "hemija",
    "fizika",
    "informatika",
  ];

  const formik = useFormik({
    initialValues: {
      name: "",
      lastName: "",
      email: "",
      password: "",
      object: "",
    },

    validationSchema: Yup.object({
      name: Yup.string().required("obavezno"),
      lastName: Yup.string().required("obavezno"),
      email: Yup.string().email("nevalidan e-mail").required("obavezno"),
      password: Yup.string()
        .required("obavezno")
        .min(6, "minimalna duzina je 6 karaktera")
        .max(20, "maksimalna duzina je 20 karaktera"),
    }),

    onSubmit: async (values) => {
      if (!auth.currentUser) {
        if (predmeti.includes(values.object)) {
          try {
            const userCredential = await createUserWithEmailAndPassword(
              auth,
              formik.values.email,
              formik.values.password
            );

            const data = {
              name: values.name,
              lastName: values.lastName,
              email: values.email,
              password: values.password,
              object: values.object,
            };

            await addDoc(userCollection, data);

            navigate("/login");
          } catch (err) {
            console.log(err);
          }
        } else {
          alert("Unesite postojeci predmet");
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
        <div className="name-div">
          <input
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Ime..."
          />
          {formik.errors.name && formik.touched.name ? (
            <p className="error">{formik.errors.name}</p>
          ) : null}
        </div>

        <div className="lastName-div">
          <input
            name="lastName"
            value={formik.values.lastName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Prezime..."
          />
          {formik.errors.lastName && formik.touched.lastName ? (
            <p className="error">{formik.errors.lastName}</p>
          ) : null}
        </div>

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

        <div className="object-div">
          <input
            name="object"
            value={formik.values.object}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Predmet..."
            type="object"
          />
          {formik.errors.object && formik.touched.object ? (
            <p className="error">{formik.errors.object}</p>
          ) : null}
        </div>

        <div className="register-button-div">
          <button className="register-button">Registracija</button>
        </div>
      </form>
    </div>
  );
};

export default TeacherRegister;
