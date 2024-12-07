import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import SubmitForm from "./pages/submitForm/submitForm";
import TeacherRegister from "./pages/TeacherRegister/TeacherRegister";
import TeacherLogin from "./pages/TeacherRegister/TeacherLogin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/submitForm" element={<SubmitForm />} />
        <Route path="/register" element={<TeacherRegister />} />
        <Route path="/login" element={<TeacherLogin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
