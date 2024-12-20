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
    "istorija",
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
        if (predmeti.includes(values.object.toLowerCase())) {
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
              isTeacher: true,
            };

            await addDoc(userCollection, data);

            navigate("/login");
          } catch (err) {
            console.log(err);
          }
        } else {
          alert(
            `Unesite postojeci predmet ${predmeti.map((predmet) => predmet)}`
          );
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
    <div className="register-form">
      <div className="sidebar-div">
        {/* You can add your Sidebar component here if needed */}
      </div>
      <div className="create-homework-page">
        <div className="create-homework-container">
          <img className="logo-register" src={logoPhoto} alt="" />
          <h1>Registrujte se kao učitelj</h1>

          <form onSubmit={formik.handleSubmit} className="create-homework-form">
            <div className="create-homework-input-group">
              <input
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Ime..."
              />
              {formik.errors.name && formik.touched.name ? (
                <div className="create-homework-error">
                  {formik.errors.name}
                </div>
              ) : null}
            </div>

            <div className="create-homework-input-group">
              <input
                name="lastName"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Prezime..."
              />
              {formik.errors.lastName && formik.touched.lastName ? (
                <div className="create-homework-error">
                  {formik.errors.lastName}
                </div>
              ) : null}
            </div>

            <div className="create-homework-input-group">
              <input
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Email..."
              />
              {formik.errors.email && formik.touched.email ? (
                <div className="create-homework-error">
                  {formik.errors.email}
                </div>
              ) : null}
            </div>

            <div className="create-homework-input-group">
              <input
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Password..."
                type="password"
              />
              {formik.errors.password && formik.touched.password ? (
                <div className="create-homework-error">
                  {formik.errors.password}
                </div>
              ) : null}
            </div>

            <div className="create-homework-input-group">
              <input
                name="object"
                value={formik.values.object}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Predmet..."
              />
              {formik.errors.object && formik.touched.object ? (
                <div className="create-homework-error">
                  {formik.errors.object}
                </div>
              ) : null}
            </div>

            <div className="create-homework-button-div">
              <button type="submit" className="create-homework-button">
                Registracija
              </button>
            </div>
            <p className="vin" onClick={() => navigate("/login")}>
              Imate nalog?
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TeacherRegister;
