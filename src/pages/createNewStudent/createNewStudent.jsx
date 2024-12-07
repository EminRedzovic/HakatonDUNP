import React from "react";
import "./createNewStudent.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import { db, auth } from "../../firebase";
import { Navigate, useNavigate } from "react-router-dom";
import { addDoc, collection } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import Sidebar from "../../components/Sidebar/Sidebar";

const CreateNewStudent = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const studentCollection = collection(db, "students");
  const userCollection = collection(db, "users");

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      username: "",
      odeljenje: "",
    },

    validationSchema: Yup.object({
      username: Yup.string().required("obavezno"),
      odeljenje: Yup.string().required("obavezno"),
      email: Yup.string().email("nevalidan e-mail").required("obavezno"),
      password: Yup.string()
        .required("obavezno")
        .min(6, "minimalna duzina je 6 karaktera")
        .max(20, "maksimalna duzina je 20 karaktera"),
    }),

    onSubmit: async (values) => {
      try {
        if (auth.currentUser) {
          const data = {
            fullName: values.username,
            email: values.email,
            odeljenje: values.odeljenje,
            razredni: auth.currentUser.email,
            homework: [],
            isTeacher: false,
          };

          await addDoc(userCollection, data);
          alert("Učenik je uspešno dodat!");
        } else {
          alert("Niste prijavljeni");
        }
      } catch (err) {
        console.error("Greška prilikom kreiranja učenika: ", err);
        alert("Došlo je do greške prilikom kreiranja učenika.");
      }
    },
  });

  if (!token) {
    return <Navigate to={"/"} replace={true} />;
  }

  return (
    <div className="cns">
      <div className="sidebar-div">
        <Sidebar />
      </div>

      <div className="cns-page">
        <div className="cns-container">
          <h1>Dodaj Novog Učenika</h1>

          <form onSubmit={formik.handleSubmit} className="cns-form">
            <div className="cns-input-group">
              <input
                name="username"
                placeholder="Naziv Učenika"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.username && formik.errors.username && (
                <div className="cns-error">{formik.errors.username}</div>
              )}
            </div>

            <div className="cns-input-group">
              <input
                name="password"
                placeholder="Šifra za učenika"
                type="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.password && formik.errors.password && (
                <div className="cns-error">{formik.errors.password}</div>
              )}
            </div>

            <div className="cns-input-group">
              <input
                name="email"
                placeholder="Email za učenika"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email && (
                <div className="cns-error">{formik.errors.email}</div>
              )}
            </div>

            <div className="cns-input-group">
              <input
                list="department"
                name="odeljenje"
                placeholder="Odeljenje učenika"
                value={formik.values.odeljenje}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <datalist id="department">
                <option value="III-1" />
                <option value="IV-1" />
                <option value="V-1" />
                <option value="VI-1" />
                <option value="VII-1" />
              </datalist>
              {formik.touched.odeljenje && formik.errors.odeljenje && (
                <div className="cns-error">{formik.errors.odeljenje}</div>
              )}
            </div>

            <div className="cns-button-div">
              <button type="submit" className="cns-register-button">
                Dodaj Učenika
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateNewStudent;
