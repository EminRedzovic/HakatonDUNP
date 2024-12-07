import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../../firebase";
import { addDoc, collection, getDocs } from "firebase/firestore";
import Sidebar from "../../components/Sidebar/Sidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./createHomeWork.css";
import { MdMapsHomeWork } from "react-icons/md";

const CreateHomeWork = () => {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const homeworkCollection = collection(db, "homework");

  // Funkcija za dobijanje korisničkog profila
  const fetchProfile = async () => {
    try {
      const data = await getDocs(collection(db, "users"));
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      const userProfile = filteredData.find(
        (user) => user.email === auth.currentUser.email
      );
      setProfile(userProfile || {});
      setLoading(false);
    } catch (error) {
      console.error("Greška prilikom učitavanja profila:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      dueDate: "",
      predmet: "",
      image: null,
      ocena: null,
    },
    enableReinitialize: true, // Omogućava ažuriranje inicijalnih vrednosti
    validationSchema: Yup.object({
      title: Yup.string().required("Naziv domaćeg zadatka je obavezan"),
      description: Yup.string().required("Opis domaćeg zadatka je obavezan"),
      dueDate: Yup.date().required("Rok je obavezan"),
    }),
    onSubmit: async (values) => {
      try {
        const data = {
          ...values,
          image: imageFile ? URL.createObjectURL(imageFile) : null,
        };

        await addDoc(homeworkCollection, data);

        toast.success("Uspešno ste dodali domaći zadatak!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
        });
        navigate("/");
      } catch (err) {
        console.error("Greška:", err);
        toast.error("Dodavanje domaćeg zadatka nije uspelo.", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
        });
      }
    },
  });

  useEffect(() => {
    if (profile.object) {
      formik.setFieldValue("predmet", profile.object);
    }
  }, [profile]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) return <div>Učitavanje...</div>;

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
              <label htmlFor="predmet">Predmet</label>
              <input
                type="text"
                id="predmet"
                name="predmet"
                value={formik.values.predmet}
                disabled
              />
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

            <div className="cns-input-group">
              <label htmlFor="predmet">Odeljenje ucenika</label>

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
            <div className="create-homework-input-group">
              <label htmlFor="image">Dodaj Sliku</label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ width: "200px", height: "auto" }}
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
      <ToastContainer />
    </div>
  );
};

export default CreateHomeWork;
