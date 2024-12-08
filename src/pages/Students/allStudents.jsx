import React, { useEffect, useState } from "react";
import StarRating from "../../assets/StarRating";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./allStudents.css";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useFormik } from "formik";
import * as Yup from "yup";
import "../../components/modal.css";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const usersCollections = collection(db, "users");

  const handleRatingChange = (rating) => {
    console.log("Selected Rating: ", rating);
  };

  const getStudents = async () => {
    const data = await getDocs(usersCollections);
    const filteredData = data.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter((doc) => !doc.isTeacher)
      .map(({ password, ...rest }) => rest);
    setStudents(filteredData);
  };

  useEffect(() => {
    getStudents();
  }, []);

  const openModal = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
    setImagePreview(null); // Reset image preview when closing modal
  };

  const validationSchema = Yup.object({
    activityDescription: Yup.string()
      .required("Opis aktivnosti je obavezan")
      .min(10, "Opis aktivnosti mora imati najmanje 10 karaktera"),
    activityTitle: Yup.string()
      .required("Naziv aktivnosti je obavezan")
      .min(10, "Naziv aktivnosti mora imati najmanje 10 karaktera"),
    activityImage: Yup.mixed().required("Slika aktivnosti je obavezna"),
  });

  const formik = useFormik({
    initialValues: {
      activityDescription: "",
      activityImage: null,
      activityTitle: "",
      studentData: selectedStudent,
    },
    validationSchema,
    onSubmit: async (values) => {
      if (selectedStudent) {
        const studentDocRef = doc(db, "activities", selectedStudent.id);
        try {
          console.log(selectedStudent.id);
          // Create an object to store the activity data
          const activityData = {
            title: values.activityTitle,
            description: values.activityDescription,
            image: values.activityImage, // Base64 encoded image
            email: selectedStudent.email,
            timestamp: new Date().toISOString(),
          };

          // Add the activity to the student's document
          await setDoc(
            studentDocRef,
            {
              activities: {
                [new Date().getTime()]: activityData, // Use timestamp as unique key
              },
            },
            { merge: true } // Merge new activity data with existing document
          );

          console.log("Activity added to Firebase:", activityData);
          closeModal();
        } catch (error) {
          console.error("Error adding activity to Firebase:", error);
        }
      }
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result;
        formik.setFieldValue("activityImage", base64Image);
        setImagePreview(base64Image); // Show image preview in the UI
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="students-page">
      <div className="sidebar-div">
        <Sidebar />
      </div>
      <div className="students-side">
        <h1 className="text">Svi učenici</h1>
        <div className="all-students">
          {students.map((student) => {
            return (
              <div className="student" key={student.id}>
                <div className="name-and-recension">
                  <div className="student-header">
                    <h1>{student.fullName}</h1>
                  </div>
                  <div className="student-bottom">
                    <h2>Recenzija: 4.7</h2>
                    <StarRating
                      initialRating={4}
                      totalStars={5}
                      isEditable={true}
                      onRatingChange={handleRatingChange}
                    />
                  </div>
                </div>
                <div className="activity-button">
                  <button onClick={() => openModal(student)}>
                    Dodaj Vannastavnu aktivnost
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {isModalOpen && selectedStudent && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-header">Dodajte Vannastavnu Aktivnost</h2>
            <form onSubmit={formik.handleSubmit}>
              <div className="form-group">
                <label htmlFor="studentName">Ime učenika</label>
                <input
                  type="text"
                  id="studentName"
                  value={selectedStudent.fullName}
                  disabled
                  className="input-field"
                />
              </div>
              <div className="form-group">
                <label htmlFor="activityTitle">Naziv aktivnosti</label>
                <input
                  type="text"
                  id="activityTitle"
                  name="activityTitle"
                  value={formik.values.activityTitle}
                  onChange={formik.handleChange}
                  placeholder="Unesite naziv aktivnosti..."
                  className="input-field"
                />
              </div>
              <div className="form-group">
                <label htmlFor="activityDescription">Opis aktivnosti</label>
                <textarea
                  id="activityDescription"
                  name="activityDescription"
                  value={formik.values.activityDescription}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Unesite opis vannastavne aktivnosti..."
                  className="textarea-field"
                />
                {formik.touched.activityDescription &&
                formik.errors.activityDescription ? (
                  <div className="errorModal">
                    {formik.errors.activityDescription}
                  </div>
                ) : null}
              </div>
              <div className="form-group">
                <label htmlFor="activityImage">
                  Priložite sliku aktivnosti
                </label>
                <input
                  type="file"
                  id="activityImage"
                  name="activityImage"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="file-input"
                />
                {formik.touched.activityImage && formik.errors.activityImage ? (
                  <div className="errorModal">
                    {formik.errors.activityImage}
                  </div>
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
              <div className="modal-buttons">
                <button type="submit" className="submit-button">
                  Dodajte Aktivnost
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={closeModal}
                >
                  Zatvori
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
