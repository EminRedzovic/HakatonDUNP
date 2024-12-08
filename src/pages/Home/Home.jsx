import React, { useEffect, useState } from "react";
import "./Home.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import SubmitHomeworkModal from "../../components/modal";
import StarRating from "../../assets/StarRating";

const Home = () => {
  const [unfinishedHomeworks, setUnfinishedHomeworks] = useState([]);
  const [finishedHomeworks, setFinishedHomeworks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHomeworkId, setSelectedHomeworkId] = useState(null);
  const openModal = (id) => {
    setSelectedHomeworkId(id);
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  const navigate = useNavigate();
  const homeworkCollection = collection(db, "homework");
  const userCollection = collection(db, "users");
  const [homeworks, setHomeworks] = useState([]);
  const [homeworkOpis, setHomeworkOpis] = useState("");
  const [myProfile, setMyProfile] = useState(null);
  const [homework, setHomework] = useState("");
  const [homeworkData, setHomeworkData] = useState([]);
  const [rating, setRating] = useState(0);
  const token = localStorage.getItem("token");

  const getMyProfile = async () => {
    try {
      const data = await getDocs(userCollection);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      const userProfile = filteredData.find((user) => user.email === token);

      if (userProfile) {
        setMyProfile(userProfile);
      } else {
        console.error("Korisnik nije pronađen.");
        setMyProfile(null);
      }
    } catch (error) {
      console.error("Greška prilikom učitavanja profila:", error);
    }
  };
  const openImage = (imageUrl) => {
    console.log(imageUrl);
    if (imageUrl) {
      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.write(
          `<img src="${imageUrl}" alt="Homework Image" style="width:50%; height:auto; " />`
        );
      } else {
        alert("Popup blokiran. Omogućite otvaranje popupa u pregledaču.");
      }
    } else {
      alert("URL slike nije dostupan.");
    }
  };

  const getAllHomeWorks = async () => {
    if (myProfile) {
      const data = await getDocs(homeworkCollection);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      const myClassHomeworks = filteredData.filter(
        (homework) => homework.odeljenje === myProfile.odeljenje
      );

      const finishedHomeworks = filteredData.filter(
        (item) =>
          Array.isArray(item.work) &&
          item.work.some((workItem) => workItem.autor === token)
      );

      const unfinishedHomeworks = filteredData.filter(
        (item) =>
          Array.isArray(item.work) &&
          !item.work.some((workItem) => workItem.autor === token)
      );

      setUnfinishedHomeworks(unfinishedHomeworks);
      setFinishedHomeworks(finishedHomeworks);
      setHomeworks(myClassHomeworks);
    }
  };
  const handleRatingChange = (rating) => {
    setRating(rating);
  };

  const oceniHomework = async (homeworkId, rating, teacherDescription) => {
    try {
      // Dohvati referencu na domaći zadatak na osnovu ID-a
      const homeworkRef = doc(db, "homework", homeworkId);
      const homeworkDoc = await getDoc(homeworkRef);

      if (!homeworkDoc.exists()) {
        console.error("Domaći zadatak nije pronađen.");
        return;
      }

      const homeworkData = homeworkDoc.data();

      if (!homeworkData || !homeworkData.work) {
        console.error("Rad nije pronađen.");
        return;
      }

      // Pronađi odgovarajući rad i ažuriraj ga
      const updatedWork = homeworkData.work.map((item) => {
        return {
          ...item,
          ocena: rating,
          opisNastavnik: teacherDescription,
          status: "graded",
        };

        return item; // Ostali radovi ostaju nepromenjeni
      });

      // Ažuriraj dokument u Firestore
      await updateDoc(homeworkRef, {
        work: updatedWork,
      });

      console.log("Domaći zadatak je uspešno ocenjen!");
      getAllHomeWorks(); // Osveži podatke nakon ažuriranja
    } catch (err) {
      console.error("Greška prilikom ocenjivanja:", err);
    }
  };

  useEffect(() => {
    if (!token) {
      return;
    }
    const fetchProfile = async () => {
      try {
        await getMyProfile();
      } catch (err) {
        console.log(err);
      }
    };

    fetchProfile();
  }, [token]);
  const handleOpisChange = (e) => {
    setHomeworkOpis(e.target.value); // Ažurira opis sa unetim tekstom
  };

  useEffect(() => {
    getAllHomeWorks();
  }, [myProfile]);

  return (
    <div className="home">
      <div className="sidebar-div">
        <Sidebar />
      </div>

      <div className="home-main">
        {myProfile ? (
          myProfile.isTeacher ? (
            <div>
              <div className="home-h-div">
                <h1 className="home-h1">Domaci zadaci</h1>
                <h2 className="zdz">Zavrseni domaci zadaci</h2>
              </div>

              <div className="all-homeworks">
                <div className="nezavrseni-domaci">
                  {unfinishedHomeworks.length > 0 ? (
                    unfinishedHomeworks.map((homework) => (
                      <>
                        {homework.work.map(
                          (item) =>
                            item.status !== "graded" ? ( // Prikazivanje samo ako status nije "graded"
                              <div className="homework-home" key={item.id}>
                                <div className="homework-home-header">
                                  <h2 className="homework-home-title">
                                    {homework.title}
                                  </h2>
                                  <p className="homework-home-predmet">
                                    {homework.predmet}
                                  </p>
                                </div>

                                <div className="homework-home-down">
                                  <p className="homework-home-description">
                                    {item.opis}
                                  </p>
                                  <StarRating
                                    initialRating={0}
                                    totalStars={5}
                                    isEditable={true}
                                    onRatingChange={handleRatingChange}
                                  />
                                  <p className="homework-home-date">
                                    Rok: {homework.dueDate}
                                  </p>
                                  <div className="homework-home-rating">
                                    <textarea
                                      className="homework-home-textarea"
                                      placeholder="Unesite komentar ili opis ocene..."
                                      onChange={handleOpisChange}
                                    />
                                  </div>
                                  <div className="homework-home-buttons-div">
                                    <button
                                      className="homework-home-button-resi"
                                      onClick={() => {
                                        oceniHomework(
                                          homework.id,
                                          rating,
                                          homeworkOpis
                                        );
                                      }}
                                    >
                                      Oceni
                                    </button>
                                    <button
                                      className="homework-home-button"
                                      onClick={() => {
                                        openImage(item.image);
                                      }}
                                    >
                                      Otvori
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ) : null // Ako je status "graded", neće se prikazati
                        )}
                      </>
                    ))
                  ) : (
                    <p className="ndz">Nema domacih zadataka :</p>
                  )}
                </div>

                <div className="complited-homeworks">
                  <div className="finished-homeworks-div">
                    {finishedHomeworks.map((homework) => (
                      <div className="homework-home" key={homework.id}>
                        <div className="homework-home-header">
                          <h2 className="homework-home-title">
                            {homework.title}
                          </h2>
                          <p className="homework-home-predmet">
                            {homework.predmet}
                          </p>
                        </div>

                        <div className="homework-home-down">
                          <p className="homework-home-description">
                            {homework.description}
                          </p>
                          <StarRating
                            initialRating={homework.work[0].ocena}
                            totalStars={5}
                            isEditable={false}

                            // Set to true for editable stars
                          />
                          <p className="homework-home-date">
                            Rok: {homework.dueDate}/{homework.work[0].status}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="home-h-div">
                <h1 className="home-h1">Domaci zadaci</h1>
                <h2 className="zdz">Zavrseni domaci zadaci</h2>
              </div>

              <div className="all-homeworks">
                <div className="nezavrseni-domaci">
                  {unfinishedHomeworks.length > 0 ? (
                    unfinishedHomeworks.map((homework) => (
                      <div className="homework-home" key={homework.id}>
                        <div className="homework-home-header">
                          <h2 className="homework-home-title">
                            {homework.title}
                          </h2>
                          <p className="homework-home-predmet">
                            {homework.predmet}
                          </p>
                        </div>

                        <div className="homework-home-down">
                          <p className="homework-home-description">
                            {homework.description}
                          </p>
                          <p className="homework-home-date">
                            Rok: {homework.dueDate}
                          </p>

                          <div className="homework-home-buttons-div">
                            <button className="homework-home-button">
                              Otvori
                            </button>
                            <button
                              className="homework-home-button-resi"
                              onClick={() => {
                                openModal(homework.id);
                                setHomework(homework.title);
                                setHomeworkData(homework);
                              }}
                              // Prosleđujemo ID
                            >
                              Resi
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="ndz">Nema domacih zadataka :</p>
                  )}
                </div>

                <div className="complited-homeworks">
                  <div className="finished-homeworks-div">
                    {finishedHomeworks.map((homework) => (
                      <div
                        style={{ cursor: "pointer" }}
                        className="homework-home"
                        key={homework.id}
                        onClick={() => navigate(`/submitedForm/${homework.id}`)}
                      >
                        <div className="homework-home-header">
                          <h2 className="homework-home-title">
                            {homework.title}
                          </h2>
                          <p className="homework-home-predmet">
                            {homework.predmet}
                          </p>
                        </div>

                        <div className="homework-home-down">
                          <p className="homework-home-description">
                            {homework.description}
                          </p>
                          <StarRating
                            initialRating={homework.work[0].ocena}
                            totalStars={5}
                            isEditable={false}
                          />
                          <p className="homework-home-date">
                            Rok: {homework.dueDate}/{homework.work[0].status}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )
        ) : null}
      </div>
      <SubmitHomeworkModal
        isOpen={isModalOpen}
        onClose={closeModal}
        homework={homework}
        homeworkId={selectedHomeworkId}
        homeworkData={homeworkData}
        getAllHomeWorks={getAllHomeWorks}
      />
    </div>
  );
};

export default Home;
