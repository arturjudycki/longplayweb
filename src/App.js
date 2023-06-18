import "./sass/App.sass";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import Navigation from "./layouts/Navigation";
import Page from "./layouts/Page";
import Footer from "./layouts/Footer";

function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <Page />
      <Footer />
    </BrowserRouter>
  );
}

export default App;
