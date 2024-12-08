import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./modal.css";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";

const validationSchema = Yup.object({
  description: Yup.string()
    .required("Opis zadatka je obavezan")
    .min(10, "Opis zadatka mora imati najmanje 10 karaktera"),
  homeworkImage: Yup.mixed().required("Priložite sliku domaćeg zadatka"),
});

const SubmitHomeworkModal = ({
  isOpen,
  onClose,
  homework,
  taskTitle,
  homeworkId,
  getAllHomeWorks,
}) => {
  const [myProfile, setMyProfile] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialValues, setInitialValues] = useState({
    title: homework,
    homeworkImage: null,
    description: "",
    email: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
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

      console.log(filteredData);
      const profile = filteredData.filter((user) => user.email === token);
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
        email: myProfile[0]?.email || "",
      }));
      console.log(myProfile[0]);
    }
  }, [myProfile]);
  useEffect(() => {
    if (homework) {
      setInitialValues((prevValues) => ({
        ...prevValues,
        title: homework,
      }));
    }
  }, [homework]);

  const studentCollection = collection(db, "homework");

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      try {
        const newWork = {
          image: values.homeworkImage,
          autor: myProfile[0]?.email || "",
          ocena: null,
          poslato: new Date().toISOString(),
          opis: values.description,
          opisNastavnik: "",
          status: "waiting",
        };

        const homeworkRef = doc(db, "homework", homeworkId);

        await updateDoc(homeworkRef, {
          work: arrayUnion(newWork),
        });
        getAllHomeWorks();
        onClose();

        console.log("Homework uspešno ažuriran!");
      } catch (err) {
        console.error("Greška prilikom ažuriranja:", err);
      }
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result;
        formik.setFieldValue("homeworkImage", base64Image);
        setImagePreview(base64Image); // Za prikaz u UI-ju
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen || loading) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-header">Zavrsite domaći zadatak</h2>
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
            <label htmlFor="homeworkImage">
              Priložite sliku domaćeg zadatka
            </label>
            <input
              type="file"
              id="homeworkImage"
              name="homeworkImage"
              onChange={handleImageChange}
              accept="image/*"
              className="file-input"
            />
            {formik.touched.homeworkImage && formik.errors.homeworkImage ? (
              <div className="errorModal">{formik.errors.homeworkImage}</div>
            ) : null}
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                style={{
                  width: "200px",
                  height: "auto",
                  maxHeight: "250px",
                  marginTop: "10px",
                }}
              />
            )}
          </div>
          <div className="form-group">
            <label htmlFor="email">Korisničk email</label>
            <input
              type="text"
              id="email"
              value={formik.values.email}
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
