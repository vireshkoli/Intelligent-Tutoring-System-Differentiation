import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./DifferentiationProblems.css";
import { GenerateProblem } from "./GenerateProblem.jsx";

function DifferentiationProblems() {
  const [level, setLevel] = useState(1.1);
  const [problemStatement, setProblemStatement] = useState("");
  const [canMarkSolved, setCanMarkSolved] = useState(true);
  const [showIntro, setShowIntro] = useState(true);

  const levelGroups = [
    { name: "Level 1: Polynomial Differentiation", levels: [1.1, 1.2, 1.3] },
    {
      name: "Level 2: Trigonometric, Logarithmic, and Exponential Differentiation",
      levels: [2.1, 2.2, 2.3, 2.4],
    },
    {
      name: "Level 3: Power Rule Differentiation",
      levels: [3.1, 3.2, 3.3],
    },
    { name: "Level 4: Nested Functions", levels: [4.1, 4.2, 4.3, 4.4] },
    { name: "Level 5: Multi-Nested Functions", levels: [5.1, 5.2] },
  ];

  const [levelProgress, setLevelProgress] = useState({
    1.1: 0,
    1.2: 0,
    1.3: 0,
    2.1: 0,
    2.2: 0,
    2.3: 0,
    2.4: 0,
    3.1: 0,
    3.2: 0,
    3.3: 0,
    4.1: 0,
    4.2: 0,
    4.3: 0,
    4.4: 0,
    5.1: 0,
    5.2: 0,
  });

  const handleIntroReady = () => {
    setShowIntro(false);
    generateNewProblem();
  };
  const getLevelTitle = (level) => {
    switch (level) {
      case 1.1:
        return "Introduction to Polynomial Differentiation";
      case 2.1:
        return "Introduction to Trigonometric, Logarithmic, and Exponential Differentiation";
      case 3.1:
        return "Introduction to Power Function Differentiation";
      case 4.1:
        return "Introduction to One-Level Nested Differentiation";
      case 5.1:
        return "Introduction to Multi-Level Nested Differentiation";
      default:
        return "Differentiation";
    }
  };
  const getLevelDescription = (level) => {
    switch (level) {
      case 1.1:
        return "In this level, you will practice differentiating simple polynomials. This foundational stage will introduce you to the basic rules of differentiation, including the constant, power, and sum rules. Through a series of guided examples and exercises, you will develop a solid understanding of how to identify and differentiate polynomial functions, setting the groundwork for more complex topics in calculus.";

      case 2.1:
        return "In this level, you will learn how to differentiate trigonometric, logarithmic, and exponential functions. You will explore the unique properties of these functions, such as their periodic nature and growth rates. This level will provide you with the necessary techniques to handle derivatives of sine, cosine, tangent, logarithmic, and exponential functions, complete with real-world applications to demonstrate their significance in calculus.";

      case 3.1:
        return "In this level, you will delve into the differentiation of power functions. You will focus on mastering the power rule, which is essential for finding derivatives of functions in the form of ( f(x) = x^n ). This level will include practical exercises that reinforce your understanding of how the power rule can simplify the differentiation process, along with applications of power functions in various mathematical contexts.";

      case 4.1:
        return "In this level, you will tackle one-level nested differentiation, which involves differentiating expressions that contain functions within functions, such as ( f(g(x)) ). You will learn techniques for applying the chain rule effectively and practice with various nested functions to enhance your problem-solving skills. This level will challenge you to think critically about the relationships between different functions and their derivatives.";

      case 5.1:
        return "In this level, you will engage with multi-level nested differentiation, where you will differentiate expressions with multiple layers of nested functions. This advanced level will build on your previous knowledge of the chain rule, requiring you to apply it iteratively across several levels of nesting. You will tackle complex expressions, honing your skills to manage and simplify derivatives in intricate scenarios, preparing you for more challenging calculus problems.";
      default:
        return "";
    }
  };
  // const getVideoUrl = (level) => {
  //   switch(level) {
  //     case 1.1: return "path/to/polynomial-intro.mp4";
  //     case 2.1: return "path/to/trigonometric-intro.mp4";
  //     // Add other video URLs for more levels
  //     default: return "";
  //   }
  // };

  const [steps, setSteps] = useState([
    { value: "", expected: "", feedback: "", nestedSteps: [] },
  ]);
  const [allCorrect, setAllCorrect] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [feedbackFinal, setFeedbackFinal] = useState("");
  const [incorrectCounts, setIncorrectCounts] = useState({});
  const [expectedStatus, setExpectedStatus] = useState([[false, []]]); 
  const [combinedExpression, setCombinedExpression] = useState("");
  const [simplifiedExpression, setSimplifiedExpression] = useState("");

  const generateNewProblem = useCallback(() => {
    setProblemStatement(GenerateProblem(level));
    setSteps([{ value: "", expected: "", feedback: "", nestedSteps: [] }]);
    setAllCorrect(false);
    setCanMarkSolved(true); 
    setFeedbackFinal("");
    setExpectedStatus([[false, []]]); 
  }, [level]);


  // Call generateNewProblem when the component first renders to display the first problem
  useEffect(() => {
    generateNewProblem(); 
  }, [level, generateNewProblem]); 

  const isFirstSubLevel = (lvl) => {
    return lvl === Math.floor(lvl) + 0.1; 
  };

  const handleNextLevel = () => {
    if (levelProgress[level] >= 3) {
      const nextLevel = getNextLevel(level);
      setLevel(nextLevel);
      generateNewProblem();
      setShowIntro(isFirstSubLevel(nextLevel)); // Show intro only for the first sub-level of a new main level
    }
  };
  const handlePreviousLevel = () => {
    const previousLevel = getPreviousLevel(level);
    setLevel(previousLevel);
    generateNewProblem();
    setShowIntro(isFirstSubLevel(previousLevel)); // Show intro when going back to the first sub-level of a main level
  };

  const handleProblemSolved = () => {
    if (allCorrect && canMarkSolved) {
      // Only increment if the user hasn't solved it 3 times yet
      setLevelProgress((prevProgress) => {
        if (prevProgress[level] < 3) {
          return {
            ...prevProgress,
            [level]: prevProgress[level] + 1, // Increment the count for the current level
          };
        }
        return prevProgress; 
      });
      setCanMarkSolved(false); // Disable the button after marking the problem as solved
    } else {
      alert(
        "You must solve the problem correctly before marking it as solved."
      );
    }
  };
  
  const getNextLevel = (currentLevel) => {
    const levelList = [
      1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3, 4.1, 4.2, 4.3, 4.4, 5.1,
      5.2,
    ];
    // OR
    // const levelList = levelGroups.flatMap(group => group.levels);
    const currentIndex = levelList.indexOf(currentLevel);
    return currentIndex < levelList.length - 1
      ? levelList[currentIndex + 1]
      : currentLevel;
  };

  const getPreviousLevel = (currentLevel) => {
    const levelList = [
      1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3, 4.1, 4.2, 4.3, 4.4, 5.1,
      5.2,
    ];
    // OR
    // const levelList = levelGroups.flatMap(group => group.levels);
    const currentIndex = levelList.indexOf(currentLevel);
    return currentIndex > 0 ? levelList[currentIndex - 1] : currentLevel;
  };
  
  const renderTicks = (solvedCount) => {
    const ticks = [];
    for (let i = 1; i <= 3; i++) {
      ticks.push(
        <span key={i} style={{ marginRight: "5px" }}>
          {i <= solvedCount ? "✔️" : "◻️"} {/* Filled tick or empty tick */}
        </span>
      );
    }
    return ticks;
  };

  const handleStepChange = (index, event) => {
    const newSteps = steps.map((step, stepIndex) => {
      if (index !== stepIndex) return step;
      return { ...step, value: event.target.value };
    });
    setSteps(newSteps);
  };

  const handleNestedStepChange = (mainIndex, nestedIndex, event) => {
    const newSteps = steps.map((step, stepIndex) => {
      if (mainIndex !== stepIndex) return step;
      const newNestedSteps = step.nestedSteps.map((nestedStep, nIndex) => {
        if (nestedIndex !== nIndex) return nestedStep;
        return { ...nestedStep, value: event.target.value };
      });
      return { ...step, nestedSteps: newNestedSteps };
    });
    setSteps(newSteps);
  };

  const handleAddStep = () => {
    setSteps([
      ...steps,
      { value: "", expected: "", feedback: "", nestedSteps: [] },
    ]);
    setExpectedStatus([...expectedStatus, [false, []]]); 
  };

  const handleRemoveStep = (index) => {
    setSteps(steps.filter((_, stepIndex) => index !== stepIndex));
    setExpectedStatus(expectedStatus.filter((_, i) => i !== index)); 
  };

  const handleAddNestedStep = (index) => {
    const newSteps = steps.map((step, stepIndex) => {
      if (index !== stepIndex) return step;
      return {
        ...step,
        nestedSteps: [
          ...step.nestedSteps,
          { value: "", expected: "", feedback: "" },
        ],
      };
    });
    setSteps(newSteps);

    
    const newExpectedStatus = expectedStatus.map((status, statusIndex) => {
      if (index !== statusIndex) return status;
      return [status[0], [...status[1], false]]; 
    });
    setExpectedStatus(newExpectedStatus);
  };

  const handleRemoveNestedStep = (mainIndex, nestedIndex) => {
    const newSteps = steps.map((step, stepIndex) => {
      if (mainIndex !== stepIndex) return step;
      return {
        ...step,
        nestedSteps: step.nestedSteps.filter(
          (_, nIndex) => nestedIndex !== nIndex
        ),
      };
    });
    setSteps(newSteps);

    const newExpectedStatus = expectedStatus.map((status, statusIndex) => {
      if (mainIndex !== statusIndex) return status;
      return [
        status[0],
        status[1].filter((_, nIndex) => nIndex !== nestedIndex),
      ];
    });
    setExpectedStatus(newExpectedStatus);
  };

  const showHint = (e, index) => {
    e.preventDefault();
    const updatedSteps = [...steps];
    updatedSteps[index].feedback = updatedSteps[index].hint; 
    updatedSteps[index].hintAvailableMain = false; 
    setSteps(updatedSteps);
  };

  const showHintNested = (e, index, nestedIndex) => {
    e.preventDefault(); 
    const updatedSteps = [...steps];
    const updatedNestedSteps = [...updatedSteps[index].nestedSteps];
    updatedNestedSteps[nestedIndex].feedback =
      updatedNestedSteps[nestedIndex].hint;
    updatedNestedSteps[nestedIndex].hintAvailableNested = false; 
    updatedSteps[index].nestedSteps = updatedNestedSteps;
    setSteps(updatedSteps);
  };

  
  const showSolution = (e, index) => {
    e.preventDefault(); 
    const updatedSteps = [...steps];
    updatedSteps[index].feedback = updatedSteps[index].originalFeedback; 
    updatedSteps[index].solutionAvailableMain = false; // Hide the solution button after it's clicked

    const newExpectedStatus = [...expectedStatus];
    newExpectedStatus[index][0] = true; 
    setExpectedStatus(newExpectedStatus); // Update the expectedStatus state

    setSteps(updatedSteps);
  };

  const showSolutionNested = (e, index, nestedIndex) => {
    e.preventDefault(); 

    const updatedSteps = [...steps];
    const updatedNestedSteps = [...updatedSteps[index].nestedSteps];
    updatedNestedSteps[nestedIndex].feedback =
      updatedNestedSteps[nestedIndex].originalFeedbackNested;
    updatedNestedSteps[nestedIndex].solutionAvailableNested = false; 

    updatedSteps[index].nestedSteps = updatedNestedSteps;

    const newExpectedStatus = [...expectedStatus];
    newExpectedStatus[index][1][nestedIndex] = true; 
    setExpectedStatus(newExpectedStatus); 

    setSteps(updatedSteps);
  };

  // Function to get the combined expression with brackets
  const getCombinedExpression = useCallback(() => {
    return steps
      .map((step) => {
        const nestedExpression = step.nestedSteps
          .map((nested) => `${nested.value}`)
          .join("*"); 
        return nestedExpression
          ? `(${step.value})*(${nestedExpression})`
          : `(${step.value})`; 
      })
      .join(" + ");
  }, [steps]);

  useEffect(() => {
    const combined = getCombinedExpression();
    setCombinedExpression(combined);
  }, [getCombinedExpression]); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (steps.every((step) => step.value.trim() === "")) {
      setErrorMessage("Please enter all the required steps.");
      return;
    } else {
      setErrorMessage("");
    }

    try {
      const response = await axios.post("http://localhost:5000/differentiate", {
        function: problemStatement,
        steps: steps.map((step, index) => ({
          index,
          value: step.value,
          nestedSteps: step.nestedSteps.map((nestedStep) => nestedStep.value),
          incorrect_count: incorrectCounts[index] || [0],
        })),
        combined: combinedExpression,
      });

      const feedback_final = response.data.feedback_final;
      const all_steps_entered = response.data.all_steps_entered;
      const expected_steps = response.data.expected_steps;
      const incorrect_counts = response.data.incorrect_counts;
      const feedback = response.data.feedback;
      const hint = response.data.hint;
      const simplified_exp = response.data.simplified_exp;
      setSimplifiedExpression(simplified_exp);

      if (!all_steps_entered) {
        setErrorMessage("Please enter all the required steps.");
        return;
      } else {
        setErrorMessage("");
      }

      setIncorrectCounts(incorrect_counts);

      const newSteps = steps.map((step, index) => {
        const nestedSteps = step.nestedSteps.map((nestedStep, nestedIndex) => {
          const nestedStepIncorrectCount =
            incorrect_counts[index]?.[nestedIndex + 1] || 0; // Second value and onwards for nested steps
          let feedbackMessageNested = "";
          let hintMessageNested = "";
          let hintAvailableNested = false; 
          let solutionAvailableNested = false; 

          if (nestedStepIncorrectCount === 0) {
            feedbackMessageNested = feedback[index][1][nestedIndex];
            const newExpectedStatus = [...expectedStatus];
            newExpectedStatus[index][1][nestedIndex] = false;
            setExpectedStatus(newExpectedStatus);
          } else if (nestedStepIncorrectCount === 1) {
            feedbackMessageNested = "Nested Step Incorrect. Please try again.";
          } else if (nestedStepIncorrectCount === 2) {
            feedbackMessageNested = "Nested Step Incorrect. Please try again.";

            hintMessageNested = hint[index]?.[1]?.[nestedIndex] || "";
            hintAvailableNested = true; 
          } else if (nestedStepIncorrectCount >= 3) {
            solutionAvailableNested = true; 
            feedbackMessageNested =
              "Nested Step Incorrect. Please try again or See solution."; // Don't show detailed feedback directly
          }

          return {
            ...nestedStep,
            expected: expected_steps[index][1][nestedIndex],
            feedback: feedbackMessageNested,
            hint: hintMessageNested,
            hintAvailableNested: hintAvailableNested,
            solutionAvailableNested: solutionAvailableNested,
            originalFeedbackNested: feedback[index][1][nestedIndex] || "", 
          };
        });

        const incorrectCount = incorrect_counts[index] || [0, 0]; 
        const mainStepIncorrectCount = incorrectCount[0]; 
        let feedbackMessage = "";
        let hintMessage = "";
        let hintAvailableMain = false; 
        let solutionAvailableMain = false; 

        if (mainStepIncorrectCount === 0) {
          feedbackMessage = feedback[index]?.[0] || "";
          const newExpectedStatus = [...expectedStatus];
          newExpectedStatus[index][0] = false;
          setExpectedStatus(newExpectedStatus);
        } else if (mainStepIncorrectCount === 1) {
          feedbackMessage = "Incorrect. Please try again.";
        } else if (mainStepIncorrectCount === 2) {
          feedbackMessage = "Incorrect. Please try again.";

          hintMessage = hint[index]?.[0] || "";
          hintAvailableMain = true; 
        } else if (mainStepIncorrectCount >= 3) {
          solutionAvailableMain = true; 
          feedbackMessage = "Incorrect. Please try again or See solution."; // Don't show detailed feedback directly
        }

        return {
          ...step,
          expected: expected_steps[index] || "",
          feedback: feedbackMessage,
          hint: hintMessage,
          hintAvailableMain: hintAvailableMain,
          solutionAvailableMain: solutionAvailableMain,
          originalFeedback: feedback[index]?.[0] || "", // Store original feedback for main step
          nestedSteps: nestedSteps, // Attach updated nestedSteps with all nested parameters
          mainStepIncorrectCount: mainStepIncorrectCount, 
        };
      });

      setSteps(newSteps);
      console.log(steps);

      setAllCorrect(response.data.all_correct);
      setFeedbackFinal(feedback_final);
    } catch (error) {
      console.error("Error fetching data: ", error);
      setErrorMessage("An error occurred while processing your request.");
    }
  };

  return (
    <div className="container-fluid d-flex">
      {showIntro ? (
        <div className="intro-section d-flex flex-column align-items-center text-center w-75 m-2 bg-primary bg-opacity-50 p-4">
          <h2 className="fw-bold">
            Level {level}: {getLevelTitle(level)}
          </h2>
          <p className="fw-semibold fs-5 mt-3">{getLevelDescription(level)}</p>

          {/* Include an introductory video */}
          {/* <video width="600" controls>
          <source src={getVideoUrl(level)} type="video/mp4" />
          Your browser does not support the video tag.
        </video> */}

          <button className="btn btn-primary mt-3" onClick={handleIntroReady}>
            I'm Ready!
          </button>
        </div>
      ) : (
        <div className="container w-75 m-2 bg-primary bg-opacity-50">
          <div className="input-rules bg-info bg-opacity-25 border border-dark mt-4 mx-3 p-4 d-flex align-items-center">
            <p className="m-0">
              <strong>Input Rules: </strong>
              Each input step must contain part of the problem separated by '+'
              or '-'. Use '*' and '^' operators as required.
            </p>
          </div>
          <div className="problem-statement d-flex align-items-center p-3 my-3">
            <p className="my-0 fs-5">
              <strong>Problem for Level {level} : </strong>
              Differentiate {problemStatement}
            </p>
          </div>
          <div className="problem-solution">
            <form onSubmit={handleSubmit}>
              {steps.map((step, index) => (
                <div key={index}>
                  <div className="input-group flex-nowrap d-flex align-items-center mb-3 mt-3">
                    <label
                      className="input-group-text w-75 me-3 p-3 rounded-4"
                      id="addon-wrapping"
                    >
                      Step {index + 1}:
                      <input
                        className="form-control p-3 ms-2"
                        placeholder="Enter Step"
                        aria-label="Enter Step"
                        aria-describedby="addon-wrapping"
                        type="text"
                        value={step.value}
                        onChange={(e) => handleStepChange(index, e)}
                      />
                    </label>
                    <button
                      className="btn btn-light border border-black w-25 h-75 mx-5 p-3 rounded"
                      type="button"
                      onClick={() => handleRemoveStep(index)}
                    >
                      Remove Step
                    </button>
                  </div>
                  {expectedStatus[index][0] && (
                    <p className="text-success fs-4 fw-semibold mb-2">
                      Expected:{" "}
                      {Array.isArray(step.expected)
                        ? step.expected[0] || ""
                        : step.expected || ""}
                    </p>
                  )}
                  <div className="step-feedback d-flex gap-3 align-items-center">
                    {step.feedback && (
                      <p className="fw-semibold m-0">{step.feedback}</p>
                    )}
                    {step.hintAvailableMain && (
                      <button
                        className="btn btn-dark border-black me-3"
                        onClick={(e) => showHint(e, index)}
                      >
                        Show Hint
                      </button>
                    )}
                    {step.solutionAvailableMain && (
                      <button
                        className="btn btn-dark border-black me-3"
                        onClick={(e) => showSolution(e, index)}
                      >
                        See Solution
                      </button>
                    )}
                  </div>
                  <br />
                  {step.nestedSteps.map((nestedStep, nestedIndex) => (
                    <div key={nestedIndex} className="ms-5 d-flex flex-column">
                      <div className="input-group flex-nowrap d-flex mb-3 align-items-center">
                        <label
                          className="input-group-text w-75 me-3 p-3 rounded-4"
                          id="addon-wrapping"
                        >
                          Nested Step {nestedIndex + 1}:
                          <input
                            className="form-control p-3 ms-2"
                            placeholder="Enter Nested Step"
                            aria-label="Enter Nested Step"
                            aria-describedby="addon-wrapping"
                            type="text"
                            value={nestedStep.value}
                            onChange={(e) =>
                              handleNestedStepChange(index, nestedIndex, e)
                            }
                          />
                        </label>
                        <button
                          className="btn btn-light border border-black w-25 h-75 mx-5 p-3 rounded"
                          type="button"
                          onClick={() =>
                            handleRemoveNestedStep(index, nestedIndex)
                          }
                        >
                          Remove Nested Step
                        </button>
                      </div>
                      {expectedStatus[index][1][nestedIndex] && (
                        <p className="text-success fs-4 fw-semibold mb-2">
                          Expected: {nestedStep.expected}
                        </p>
                      )}
                      <div className="d-flex gap-3 align-items-center">
                        {nestedStep.feedback && (
                          <p className="fw-semibold m-0">
                            {nestedStep.feedback}
                          </p>
                        )}
                        {nestedStep.hintAvailableNested && (
                          <button
                            className="btn btn-dark border-black me-3"
                            onClick={(e) =>
                              showHintNested(e, index, nestedIndex)
                            }
                          >
                            Show Hint
                          </button>
                        )}
                        {nestedStep.solutionAvailableNested && (
                          <button
                            className="btn btn-dark border-black me-3"
                            onClick={(e) =>
                              showSolutionNested(e, index, nestedIndex)
                            }
                          >
                            See Solution
                          </button>
                        )}
                      </div>
                      <br />
                    </div>
                  ))}
                  <button
                    className="btn btn-light border-black mb-3"
                    type="button"
                    onClick={() => handleAddNestedStep(index)}
                    disabled={allCorrect}
                  >
                    Add Nested Step
                  </button>
                </div>
              ))}
              <div className="d-flex justify-content-center mb-3 form-floating flex-column align-items-center">
                <textarea
                  className="rounded-2 form-control p-2 text-center text-nowrap align-middle pt-3"
                  value={getCombinedExpression()} // Update text area with combined expression
                  readOnly
                  style={{
                    width: `${Math.max(
                      50,
                      getCombinedExpression().length * 1
                    )}ch`,
                  }} // Dynamically adjust width
                />
                {allCorrect ? (
                  <p className="mt-3 text-center fs-5">
                    <strong>Simplified Expression : </strong>
                    {simplifiedExpression}
                  </p>
                ) : (
                  ""
                )}
              </div>
              <div className="mainbtns d-flex justify-content-center">
                <button
                  className="btn btn-dark border-black me-3 mb-3"
                  type="button"
                  onClick={handleAddStep}
                  disabled={allCorrect}
                >
                  Add Step
                </button>
                <button
                  className="btn btn-dark border-black mb-3"
                  type="submit"
                >
                  Submit
                </button>
              </div>
              {errorMessage && (
                <p className="text-danger fw-semibold fs-5">{errorMessage}</p>
              )}
            </form>
            {feedbackFinal && (
              <div className="feedback-final p-3 m-3 bg-light d-flex rounded-2 border border-black d-flex flex-column mb-5">
                <p className="fs-4 m-0">{feedbackFinal}</p>
                {allCorrect && (
                  <p className="text-success fw-bold m-0">
                    Very good! All your steps are correct.
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="problem-section mb-4 position-relative border rounded p-4 shadow-sm bg-light mt-3">
            {/* Track when a problem is solved */}
            <div className="d-flex justify-content-between mb-3">
              <button
                className="btn btn-secondary"
                onClick={generateNewProblem}
              >
                Generate New Problem
              </button>
              <button
                className="btn btn-success"
                onClick={handleProblemSolved}
                disabled={!canMarkSolved || levelProgress[level] >= 3} // Disable if already solved 3 times
              >
                {canMarkSolved ? "Mark Problem as Solved" : "Solved!"}
              </button>
            </div>
            <p className="mt-2">Problems Solved: {levelProgress[level]}/3</p>

            {/* Next and Previous buttons */}
            <div className="d-flex justify-content-between bottom-0 start-0 end-0">
              <button
                className="btn btn-outline-dark"
                onClick={handlePreviousLevel}
                disabled={level === 1.1}
              >
                Previous Level
              </button>
              <button
                className="btn btn-outline-dark"
                onClick={handleNextLevel}
                disabled={levelProgress[level] < 3}
              >
                Next Level
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container progress-container bg-info bg-opacity-10 w-25 m-2 pb-3">
        <h2 className="text-align-center mt-2 mb-0 p-0">Level Progress</h2>
        <ul className="list-group">
          {levelGroups.map((group) => (
            <React.Fragment key={group.name}>
              <li className="list-group-item list-group-item-info my-2 mt-3">
                <strong>{group.name}</strong>
              </li>
              {group.levels.map((lvl) => (
                <li
                  key={lvl}
                  className={`list-group-item d-flex justify-content-between align-items-center 
                    ${
                      lvl === level ? "fw-bold bg-info text-white rounded" : ""
                    }`} 
                >
                  <span>Level {lvl}</span>
                  <span>{renderTicks(levelProgress[lvl])}</span>{" "}
                  {/* Persist ticks for previous levels */}
                </li>
              ))}
            </React.Fragment>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default DifferentiationProblems;
