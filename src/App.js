import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import SubmitedForm from "./pages/submitForm/submitedForm";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/submitedForm" element={<SubmitedForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
