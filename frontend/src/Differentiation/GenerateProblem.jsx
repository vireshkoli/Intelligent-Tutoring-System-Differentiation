export const problem_statements = {
  1: "3*x^2 + sin(x) + 2*x + cos(x)",
  2: "x^2 + 2*cos(x) + 1 + x^3 + 6*x^4",
  3: "x^3 - 2*x^4 + 3*x + tan(x) + 3tan(x)",
  4: "2*x^2 + 3*tan(x) - 1 + 10*x",
  5: "3*e^x - 4*x^3 + 7*x^2 + sin(x)",
  6: "log(x) - 4*sec(x) + 4 + sin(x)",
  7: "10*log(x) + 2*x^2 - 7*x + 10*sin(x)",
  8: "x^2 + 2*x - 3 + 4*x + 3*x^6",
  9: "x^3 - 3*x^3 + 2*x + 100*x",
  10: "x^2 - 2*x + 1 + 10*sin(x)",
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomCoefficient(min = 1, max = 5) {
  return getRandomInt(min, max);
}

function getRandomDegree(min = 1, max = 5) {
  return getRandomInt(min, max);
}

function getRandomPolynomial(length, nocoeff = false) {
  let terms = [];
  let degree;
  let coefficient;
  for (let i = 0; i < length; i++) {
    degree = getRandomDegree();
    if (nocoeff === true) {
      coefficient = 1;
    } else {
      coefficient = getRandomCoefficient();
    }
    if (coefficient === 1) {
      if (degree === 1) {
        terms.push(`x`);
      } else {
        terms.push(`x^${degree}`);
      }
    } else {
      if (degree === 1) {
        terms.push(`${coefficient}*x`);
      } else {
        terms.push(`${coefficient}*x^${degree}`);
      }
    }
  }
  return terms.join(" + ");
}

function getRandomTrigFunction(length, nocoeff = false) {
  let terms = [];
  let coefficient;
  for (let i = 0; i < length; i++) {
    if (nocoeff === true) {
      coefficient = 1;
    } else {
      coefficient = getRandomCoefficient();
    }
    const functions = [
      "sin(x)",
      "cos(x)",
      "tan(x)",
      "cosec(x)",
      "sec(x)",
      "cot(x)",
    ];
    const trigfunc = functions[Math.floor(Math.random() * functions.length)];
    if (coefficient === 1) {
      terms.push(`${trigfunc}`);
    } else {
      terms.push(`${coefficient}*${trigfunc}`);
    }
  }
  return terms.join(" + ");
}

function getRandomExponentialFunction(length, nocoeff = false) {
  let terms = [];
  let coefficient;
  for (let i = 0; i < length; i++) {
    if (nocoeff === true) {
      coefficient = 1;
    } else {
      coefficient = getRandomCoefficient();
    }
    if (coefficient === 1) {
      terms.push(`e^x`);
    } else {
      terms.push(`${coefficient}*e^x`);
    }
  }
  return terms.join(" + ");
}

function getRandomLogarithmicFunction(length, nocoeff = false) {
  let terms = [];
  let coefficient;
  for (let i = 0; i < length; i++) {
    if (nocoeff === true) {
      coefficient = 1;
    } else {
      coefficient = getRandomCoefficient();
    }
    if (coefficient === 1) {
      terms.push(`log(x)`);
    } else {
      terms.push(`${coefficient}*log(x)`);
    }
  }
  return terms.join(" + ");
}

function getRandomFunction(length) {
  let terms = [];
  const functions = [
    getRandomPolynomial,
    getRandomTrigFunction,
    getRandomExponentialFunction,
    getRandomLogarithmicFunction,
  ];
  for (let i = 0; i < length; i++) {
    const randomFunc = functions[Math.floor(Math.random() * functions.length)];
    terms.push(randomFunc(1));
  }
  return terms.join(" + ");
}

function getPowerFunction(length, type) {
  // if (type === "poly") {
  //   let terms = [];
  //   for (let i = 0; i < length; i++) {
  //     const coefficient = getRandomCoefficient(1, 5);
  //     const power = getRandomInt(2, 6);
  //     let poly;
  //     do {
  //       poly = getRandomPolynomial(1);
  //     } while (poly.includes("(x)"));

  //     if (coefficient === 1) {
  //       terms.push(`(${poly})^${power}`);
  //     } else {
  //       terms.push(`${coefficient}*(${poly})^${power}`);
  //     }
  //   }
  //   return terms.join(" + ");
  // }
  if (type === "trig") {
    let terms = [];
    for (let i = 0; i < length; i++) {
      const coefficient = getRandomCoefficient(1, 5);
      const power = getRandomInt(2, 5);
      if (coefficient === 1) {
        terms.push(`(${getRandomTrigFunction(1, true)})^${power}`);
      } else {
        terms.push(
          `${coefficient}*(${getRandomTrigFunction(1, true)})^${power}`
        );
      }
    }
    return terms.join(" + ");
  }
  if (type === "log") {
    let terms = [];
    for (let i = 0; i < length; i++) {
      const coefficient = getRandomCoefficient(1, 5);
      const power = getRandomInt(2, 5);
      if (coefficient === 1) {
        terms.push(`(${getRandomLogarithmicFunction(1, true)})^${power}`);
      } else {
        terms.push(
          `${coefficient}*(${getRandomLogarithmicFunction(1, true)})^${power}`
        );
      }
    }
    return terms.join(" + ");
  }
  if (type === "open") {
    let terms = [];
    const functions = [
      getRandomTrigFunction,
      getRandomLogarithmicFunction,
    ];
    for (let i = 0; i < length; i++) {
      const coefficient = getRandomCoefficient(1, 5);
      const power = getRandomInt(2, 5);
      const randomFunc =
        functions[Math.floor(Math.random() * functions.length)];
      if (coefficient === 1) {
        terms.push(`(${randomFunc(1, true)})^${power}`);
      } else {
        terms.push(`${coefficient}*(${randomFunc(1, true)})^${power}`);
      }
    }
    return terms.join(" + ");
  }
}

function getRandomNestedFunction(length, type) {
  if (type === "trig-poly") {
    let terms = [];
    for (let i = 0; i < length; i++) {
      const trig = getRandomTrigFunction(1);
      const modified_trig = trig.replace(/\(x\)/, "");
      const poly = getRandomPolynomial(1);
      terms.push(`${modified_trig}(${poly})`);
    }
    return terms.join(" + ");
  }
  if (type === "log-poly") {
    let terms = [];
    for (let i = 0; i < length; i++) {
      const log = getRandomLogarithmicFunction(1);
      const modified_log = log.replace(/\(x\)/, "");
      const poly = getRandomPolynomial(1);
      terms.push(`${modified_log}(${poly})`);
    }
    return terms.join(" + ");
  }
  if (type === "exp-poly") {
    let terms = [];
    for (let i = 0; i < length; i++) {
      const exp = getRandomExponentialFunction(1);
      const modified_exp = exp.replace(/x/, "");
      const poly = getRandomPolynomial(1);
      terms.push(`${modified_exp}(${poly})`);
    }
    return terms.join(" + ");
  }
  if (type === "open") {
    let terms = [];
    const functions = [
      getRandomPolynomial,
      getRandomTrigFunction,
      getRandomExponentialFunction,
      getRandomLogarithmicFunction,
    ];

    for (let i = 0; i < length; i++) {
      let randomFunc1 = functions[Math.floor(Math.random() * functions.length)];
      while (randomFunc1 === getRandomPolynomial) {
        randomFunc1 = functions[Math.floor(Math.random() * functions.length)];
      }
      let randomFunc2 = functions[Math.floor(Math.random() * functions.length)];
      
      let func1 = randomFunc1(1);
      let func2 = randomFunc2(1);

      if (func1.includes("*x^")) {
        func1 = func1.replace("x", `(${func2})`);
        terms.push(func1);
      } else if (func1.includes("(x)")) {
        func1 = func1.replace(/\(x\)/, "");
        terms.push(`${func1}(${func2})`);
      } else if (func1.includes("e^x")) {
        func1 = func1.replace(/x/, "");
        terms.push(`${func1}(${func2})`);
      } else {
        terms.push(`${func1}(${func2})`);
      }
    }
    return terms.join(" + ");
  }
}

function getRandomMultiNestedFunction(length) {
  let terms = [];
  for (let i = 0; i < length; i++) {
    const trig = getRandomTrigFunction(1);
    const modified_trig = trig.replace(/\(x\)/, "");
    const log = getRandomLogarithmicFunction(1);
    const modified_log = log.replace(/\(x\)/, "");
    const poly = getRandomPolynomial(1);
    terms.push(`${modified_trig}(${modified_log}(${poly}))`);
  }
  return terms.join(" + ");
}

function GenerateProblem(level) {
  switch (level) {
    case 1.1:
      return getRandomPolynomial(1);
    case 1.2:
      return getRandomPolynomial(3);
    case 1.3:
      return getRandomPolynomial(5);

    case 2.1:
      return getRandomTrigFunction(3);
    case 2.2:
      return getRandomLogarithmicFunction(3);
    case 2.3:
      return getRandomExponentialFunction(3);
    case 2.4:
      return getRandomFunction(5);

    case 3.1:
      return getPowerFunction(2, "trig");
    case 3.2:
      return getPowerFunction(2, "log");
    case 3.3:
      return getPowerFunction(3, "open");

    case 4.1:
      return getRandomNestedFunction(2, "trig-poly");
    case 4.2:
      return getRandomNestedFunction(2, "log-poly");
    case 4.3:
      return getRandomNestedFunction(2, "exp-poly");
    case 4.4:
      return getRandomNestedFunction(3, "open");

    case 5.1:
      return getRandomMultiNestedFunction(1);
    case 5.2:
      return getRandomMultiNestedFunction(2);

    default:
      return "";
  }
}

export { GenerateProblem };
