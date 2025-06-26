import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./component/Home";
import Google from "./component/Google";
import GoogleData from "./component/GoogleData/GoogleData";

// Pages


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/files" element={<Google />} />
        <Route path="/googleData" element={<GoogleData />} />

        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
