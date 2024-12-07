import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";

import SubmitedForm from "./pages/submitForm/submitedForm";

import TeacherRegister from "./pages/TeacherRegister/TeacherRegister";
import TeacherLogin from "./pages/TeacherRegister/TeacherLogin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/submitedForm" element={<SubmitedForm />} />

        <Route path="/register" element={<TeacherRegister />} />
        <Route path="/login" element={<TeacherLogin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
