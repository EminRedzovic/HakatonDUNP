import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./modal.css";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";

const validationSchema = Yup.object({
  description: Yup.string()
    .required("Opis zadatka je obavezan")
    .min(10, "Opis zadatka mora imati najmanje 10 karaktera"),
  homeworkFile: Yup.mixed()
    .required("Priložite domaći PDF")
    .test("fileSize", "Datoteka je prevelika", (value) => {
      return value && value.size <= 5000000;
    })
    .test("fileFormat", "Format mora biti PDF", (value) => {
      return value && value.type === "application/pdf";
    }),
});

const SubmitHomeworkModal = ({ isOpen, onClose, username, taskTitle }) => {
  const [myProfile, setMyProfile] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialValues, setInitialValues] = useState({
    title: taskTitle,
    homeworkFile: null,
    description: "",
    username: "",
  });
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const userCollection = collection(db, "users");

  const getMyProfile = async () => {
    try {
      const data = await getDocs(userCollection);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      const profile = filteredData.filter(
        (user) => user.email === auth.currentUser.email
      );
      setMyProfile(profile);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    getMyProfile();
  }, [token]);

  useEffect(() => {
    if (myProfile.length > 0) {
      setInitialValues((prevValues) => ({
        ...prevValues,
        username: myProfile[0]?.name || "",
      }));
    }
  }, [myProfile]);

  const studentCollection = collection(db, "homework");

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      try {
        const data = { ...values };
        await addDoc(studentCollection, data);
        console.log("Podaci uspešno dodati!");
      } catch (err) {
        console.error("Greška:", err);
      }
    },
  });

  if (!isOpen || loading) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-header">Postavite domaći zadatak</h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Naslov zadatka</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              disabled
              className="input-field"
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Opis zadatka</label>
            <textarea
              id="description"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Unesite opis zadatka..."
              className="textarea-field"
            />
            {formik.touched.description && formik.errors.description ? (
              <div className="errorModal">{formik.errors.description}</div>
            ) : null}
          </div>
          <div className="form-group">
            <label htmlFor="homeworkFile">Priložite domaći PDF</label>
            <input
              type="file"
              id="homeworkFile"
              name="homeworkFile"
              onChange={(event) => {
                formik.setFieldValue(
                  "homeworkFile",
                  event.currentTarget.files[0]
                );
              }}
              accept=".pdf"
              className="file-input"
            />
            {formik.touched.homeworkFile && formik.errors.homeworkFile ? (
              <div className="errorModal">{formik.errors.homeworkFile}</div>
            ) : null}
          </div>
          <div className="form-group">
            <label htmlFor="username">Korisničko ime</label>
            <input
              type="text"
              id="username"
              value={formik.values.username}
              disabled
              className="input-field"
            />
          </div>
          <div className="modal-buttons">
            <button type="submit" className="submit-button">
              Pošaljite domaći
            </button>
            <button type="button" className="cancel-button" onClick={onClose}>
              Zatvori
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitHomeworkModal;
