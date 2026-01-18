import Navigation from "./components/Navigation";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import About from "./page/About";
import Home from "./page/Home";
import Portfolio from "./page/Portfolio";
import Contact from "./page/Contact";

function App() {

  return (
    <BrowserRouter>
      <div className="[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] h-screen overflow-y-scroll">
        <Navigation />

        <Routes>
          <Route path="/" element={
            <Home />
          } />

          <Route path="/about" element={
            <About />
          } />

          <Route path="/portfolio" element={
            <Portfolio />
          } />    

          <Route path="/contact" element={
            <Contact />
          } />          
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
