import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import SubmitForm from "./pages/submitForm/submitForm";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/submitForm" element={<SubmitForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
