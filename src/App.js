import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import SubmitedForm from "./pages/submitForm/submitedForm";
import TeacherRegister from "./pages/TeacherRegister/TeacherRegister";
import TeacherLogin from "./pages/TeacherRegister/TeacherLogin";
import CreateHomeWork from "./pages/createHomeWork/createHomeWork";
import CreateNewStudent from "./pages/createNewStudent/createNewStudent";
import Students from "./pages/Students/allStudents";
import Psychologist from "./pages/psychologist/psychologist";
import OtherActivities from "./pages/otherActivities/otherActivities";
import SubjectHomeworks from "./pages/SubjectHomeworks/SubjectHomeworks";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/submitedForm/:homeworkid" element={<SubmitedForm />} />
        <Route path="/teacher/createHomeWork" element={<CreateHomeWork />} />
        <Route
          path="/teacher/createNewStudent"
          element={<CreateNewStudent />}
        />
        <Route path="/teacher/students" element={<Students />} />
        <Route path="/activities" element={<OtherActivities />} />
        <Route path="/register" element={<TeacherRegister />} />
        <Route path="/psychologist" element={<Psychologist />} />
        <Route path="/login" element={<TeacherLogin />} />
        <Route path="/homeworks/:subject" element={<SubjectHomeworks />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
