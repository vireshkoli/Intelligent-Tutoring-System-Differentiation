import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Nav from "./Navbar/Nav.jsx";
import Header from "./Header/Header.jsx";
import TopicCard from "./Topic Cards/TopicCard.jsx";

import DifferentiationProblems from "./Differentiation/DifferentiationProblems.jsx";

import differentiation from "./Topic Cards/differentiation.png";

function App() {
  return (
    <>
      <Router>
        <Nav />
        <Routes>
          <Route
            exact
            path="/"
            element={
              <>
                <Header />
                <div className=" container-fluid topic-header d-flex justify-content-center py-3 my-2">
                  <h1 className="fs-4 fw-bold">-- Explore Courses --</h1>
                </div>
                <div className="topics d-flex bg-info-subtle bg-gradient p-5">
                  <TopicCard
                    topicimg={differentiation}
                    topictitle="Differentiation"
                    topictext="Differentiation measures how functions change. Learn basics, techniques for derivatives, and real-world applications. Explore to deepen your understanding."
                    topiclink="/differentiationproblems"
                  />
                </div>
              </>
            }
          ></Route>

          <Route exact path="/differentiationproblems" element={<DifferentiationProblems />}></Route>

        </Routes>
      </Router>
    </>
  );
}

export default App;
