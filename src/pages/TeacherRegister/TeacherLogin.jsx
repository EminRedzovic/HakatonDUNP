import React, { useEffect, useState } from "react";
import "./TeacherLogin.css"; 
import { useFormik } from "formik";
import * as Yup from "yup";
import logoPhoto from "../../photos/download-removebg-preview.png";
import { auth } from "../../firebase";
import { Navigate, useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";

const TeacherLogin = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userCollection = collection(db, "users");
  const [allUsers, setAllUsers] = useState(null);
  const [emails, setEmails] = useState(null);
  const [passwords, setPasswords] = useState(null);

  const getAllUsers = async () => {
    const data = await getDocs(userCollection);
    const filteredData = data.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    const emails = filteredData.map((user) => user.email);
    const passwords = filteredData.map((user) => user.password);

    setEmails(emails);
    setPasswords(passwords);
    setAllUsers(filteredData);
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  console.log(allUsers);
  console.log(emails);
  console.log(passwords);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },

    validationSchema: Yup.object({
      email: Yup.string().email("Nevalidan e-mail").required("Obavezno"),
      password: Yup.string()
        .required("Obavezno")
        .min(6, "Minimalna duzina je 6 karaktera")
        .max(20, "Maksimalna duzina je 20 karaktera"),
    }),

    onSubmit: async (values) => {
      if (!token) {
        try {
          const userCredential = await signInWithEmailAndPassword(
            auth,
            values.email,
            values.password
          );
          localStorage.setItem("token", values.email);
          navigate("/");
        } catch (err) {
          if (
            emails.includes(values.email) &&
            passwords.includes(values.password)
          ) {
            localStorage.setItem("token", values.email);
            navigate("/");
          } else {
            alert("Unesti nalog ne postoji!");
          }
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
    <div className="login-page">
      <div className="login-page-content">
        <div className="login-container">
          <img className="logo-login" src={logoPhoto} alt="Logo" />
          <h1>Prijavite se</h1>

          <form onSubmit={formik.handleSubmit} className="login-form">
            <div className="login-input-group">
              <input
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Email..."
              />
              {formik.errors.email && formik.touched.email ? (
                <div className="login-error">{formik.errors.email}</div>
              ) : null}
            </div>

            <div className="login-input-group">
              <input
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Password..."
                type="password"
              />
              {formik.errors.password && formik.touched.password ? (
                <div className="login-error">{formik.errors.password}</div>
              ) : null}
            </div>

            <div className="login-button-div">
              <button type="submit" className="login-button">
                Prijavi se
              </button>
            </div>
          </form>

          <div className="forgot-password">
            <p onClick={() => navigate("/register")}>Nemate nalog?</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherLogin;
