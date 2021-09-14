

class Calculator{
  constructor(){
    this.mathProblem = "";
    this.result = "";
  }
  

  router() {
    this.result = this.validations(this.mathProblem);
    this.result = this.multiplicationAndDivision(this.result);
    this.result = this.clearNegatives(this.result);
    this.result = this.additionAndSubstraction(this.result);
  }

  validations(expression){
    expression = this.trimSpaces(expression);
    this.operatorValidator(expression);
    this.inputValidator(expression);
    this.decimalValidator(expression);

    return expression;
  }

  inputValidator(expression){
    const validInputs = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'];
    const validOperators = ['-', '+', '/', '*'];

    for(let i = 0; i < expression.length; i++){
      if(!validInputs.includes(expression[i]) && !validOperators.includes(expression[i])){
        throw new Error('Invalid Input: Only 0, 1, 2, 3, 4, 5, 6, 7, 8, 9,-, +, /, *, . are allowed')
      }
    }
  }

  trimSpaces(expression){
    return expression.split(" ").join("");
  }

  decimalValidator(expression){
    let decimalFound = false;
    const validOperators = ['-', '+', '/', '*'];

    for(let i = 0; i < expression.length; i++){

      if((expression[i] === "." && isNaN(expression[i + 1])) && (expression[i] === "." && isNaN(expression[i - 1]))){
        throw new SyntaxError('Decimal Placement Error')
      }else if(expression[i] === "."){

        if(decimalFound){
          throw new SyntaxError('Decimal Placement Error')
        }else{
          decimalFound = true;
        }
        
      }else if(validOperators.includes(expression[i])){
        if(decimalFound){
          decimalFound = false;
        }
      }
    };

    return true;
  }

  operatorValidator(expression){
    const validOperators = ['-', '+', '/', '*'];

    let i = 0;
    let operatorCount = 0;

    while (i < expression.length){
      if(validOperators.includes(expression[i])){
        operatorCount += 1;
      }else if(!isNaN(expression[i]) && operatorCount != 0){
        operatorCount = 0;
      }

      if(operatorCount == 2 && expression[i] != "-"){
        throw new SyntaxError('Second Consecutive Operator Can Only Be a -');
      }else if(operatorCount >= 3){
        throw new SyntaxError('Too Many Consecutive Operators');
      };

      i += 1;
    }

    return true;
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
      }else if(expressionArr[i] === "-" && expressionArr[i - 1] === "-"){
        expressionArr.splice((i - 1), 1, "+")
        i = i - 2
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
        i += 1;
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

  appendMathProblem(mathText){
    this.mathProblem = mathText
  }

}

const mathProblemText = document.querySelector('[math-problem]');
const resultText = document.querySelector('[result]');
const calculateButton = document.querySelector('[calculate]')

let calculator = new Calculator()

calculateButton.addEventListener('click', (event)=>{
  event.preventDefault();
  calculator.appendMathProblem(mathProblemText.value);
  calculator.router();
  resultText.innerText = calculator.result;
})