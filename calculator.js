const mathProblemText = document.querySelector('[math-problem]');
const resultText = document.querySelector('[result]');

class Calculator{
  constructor(mathProblem){
    this.mathProblem = mathProblem;
  }
  

  router() {
    this.mathProblem = this.multiplicationAndDivision(this.mathProblem);
    this.mathProblem = this.clearNegatives(this.mathProblem);
    this.mathProblem = this.additionAndSubstraction(this.mathProblem);
  }

  multiplicationAndDivision(expression) {
    if(!expression.includes("*") && !expression.includes("/")){
      return expression;
    }
    
    let i = 0;
    while(i < expression.length){
      if(expression[i] === "*"){
        expression = this.parseExpressionByOperator(expression, "*", i);
        i = 0;
        continue;
      }else if(expression[i] === "/"){
        expression = this.parseExpressionByOperator(expression, "/", i);
        i = 0;
        continue;
      };

      i++;
    }

    return expression;
  }

  additionAndSubstraction(expression) {
    if(!expression.includes("-") && !expression.includes("+")){
      return expression;
    }

    let i = 0;
    while(i < expression.length){
      if(expression[i] === "-" && i != 0){
        expression = this.parseExpressionByOperator(expression, "-", i);
        i = 0;
        continue;
      }else if(expression[i] === "+"){
        expression = this.parseExpressionByOperator(expression, "+", i);
        i = 0;
        continue;
      };

      i++;
    }

    return expression;

  }

  clearNegatives(expression) {
    if(!expression.includes("-")){
      return expression;
    }

    let expressionArr = expression.split("");

    for(let i = 0; i < expressionArr.length; i++){

      if(expressionArr[i] === "-" && expressionArr[i - 1] === "+"){
        expressionArr.splice((i - 1), 1, "")
      };
    };

    return expressionArr.join("");
  }



  parseExpressionByOperator(expression, operator, index) {
    let startingIndex = index;
    let endingIndex = index;
    const validOperators = ['-', '+', '/', '*']

    if(expression[endingIndex + 1] === "-"){
      endingIndex += 1;
    }

    while(!isNaN(expression[endingIndex + 1]) || expression[endingIndex + 1] === "."){
      endingIndex += 1;
    };

    while(!isNaN(expression[startingIndex - 1]) || expression[startingIndex - 1] === "."){
      startingIndex -= 1;
    };

    if(expression[startingIndex - 1] === "-" && (startingIndex === 1 || validOperators.includes(expression[startingIndex - 2]))){
      startingIndex -= 1;
    };

    let beginningExpression = expression.slice(0, startingIndex);
    let expressionSlice = expression.slice(startingIndex, endingIndex + 1);
    let endingExpression = expression.slice(endingIndex + 1);

    switch (operator) {
      case "*":
        expressionSlice = this.multiplicationCalculation(expressionSlice);
        break;
      case "/":
        expressionSlice = this.divisionCalculation(expressionSlice);
        break;
      case "-":
        expressionSlice = this.substractionCalculation(expressionSlice);
        break;
      case "+":
        expressionSlice = this.additionCalculation(expressionSlice);
        break;
    }

    return beginningExpression.concat(expressionSlice, endingExpression);
  }

  firstNumberNegative(expression){
    if(expression[0] === "-"){
      let i = 1;

      while(i < expression.length){
        if(expression[i] === "-"){
          return i;
        }
      }
    }

    return false;
  }


  multiplicationCalculation(expression){
    let expressionArray = expression.split("*");
    let product = Number(expressionArray[0]) * Number(expressionArray[1])

    return product.toString();
  }

  divisionCalculation(expression){
    let expressionArray = expression.split("/");
    let division = Number(expressionArray[0]) / Number(expressionArray[1]);

    return division.toString();
  }

  substractionCalculation(expression){
    let isFirstNumberNegative = this.firstNumberNegative(expression)
    let expressionArray;

    if(isFirstNumberNegative){
      expressionArray = [];
      expressionArray.push(expression.slice(0, isFirstNumberNegative));
      expressionArray.push(expression.slice((isFirstNumberNegative + 1)));
    }else{
      expressionArray = expression.split("-");
    }
    let substraction = Number(expressionArray[0]) - Number(expressionArray[1]);

    return substraction.toString();
  };

  additionCalculation(expression){
    let expressionArray = expression.split("+");
    let summation = Number(expressionArray[0]) + Number(expressionArray[1]);

    return summation.toString();
  }

}

let calculator = new Calculator("-5")
calculator.router()