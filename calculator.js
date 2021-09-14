

class Calculator{
  constructor(){
    this.mathProblem = "";
    this.result = "";
  }
  //router function will move the result instance variable via all functions to calculate the math problem.
  router() {
    this.result = this.validations(this.mathProblem);
    this.result = this.multiplicationAndDivision(this.result);
    this.result = this.clearNegatives(this.result);
    this.result = this.additionAndSubstraction(this.result);
  }
  // validations validate the mathProblem input. 
  validations(expression){
    expression = this.trimSpaces(expression);
    this.operatorValidator(expression);
    this.inputValidator(expression);
    this.decimalValidator(expression);

    return expression;
  }
  //validates that the input is only numbers in text, operators, and .
  inputValidator(expression){
    const validInputs = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'];
    const validOperators = ['-', '+', '/', '*'];

    for(let i = 0; i < expression.length; i++){
      //if the char at index i is not in the validInputs and validOperators, it will throw an error.
      if(!validInputs.includes(expression[i]) && !validOperators.includes(expression[i])){
        throw new Error('Invalid Input: Only 0, 1, 2, 3, 4, 5, 6, 7, 8, 9,-, +, /, *, . are allowed')
      }
    }

    return true;
  }
  //removing the empty spaces in the string.
  trimSpaces(expression){
    return expression.split(" ").join("");
  }
  //validates that the decimal is placed correctly, for example, 1.5 or 3.
  decimalValidator(expression){
    let decimalFound = false;
    const validOperators = ['-', '+', '/', '*'];

    for(let i = 0; i < expression.length; i++){
      //if the char at i is . and the left and right chars are NaN, then throw an error. For example, .+ 5
      if((expression[i] === "." && isNaN(expression[i + 1])) && (expression[i] === "." && isNaN(expression[i - 1]))){
        throw new SyntaxError('Decimal Placement Error')
      }else if(expression[i] === "."){
        //if the char at i is . and the decimal found is true, then this would also need an error. For example, 35.577.9.
        //setting the decimal found to true otherwise.
        if(decimalFound){
          throw new SyntaxError('Decimal Placement Error')
        }else{
          decimalFound = true;
        }
      //if the char at i is one of the operators, then we need to set the decimalFound to false since this is a new valid space for a decimal.
      }else if(validOperators.includes(expression[i])){
        if(decimalFound){
          decimalFound = false;
        }
      }
    };

    return true;
  }
  //validates that the second consecutive operator can only be a - and that there can't be more than 2 concecutive operators and the starting operator can only be -.
  operatorValidator(expression){
    const validOperators = ['-', '+', '/', '*'];
    const invalidStartingOperators = ['+', '/', '*']

    let i = 0;
    let operatorCount = 0;

    while (i < expression.length){
      //increment operatorCount by 1 if the char at index i is a validOperator.
      if(validOperators.includes(expression[i])){
        operatorCount += 1;
      //if the char at index i is a number and if the operatorCount has a value other than 0, we will set the operatorCount to 0
      //if we are at number, that means that we can have two more operators after this index.
      }else if(!isNaN(expression[i]) && operatorCount != 0){
        operatorCount = 0;
      }
      //if the second operator is not "-", throwing an error
      if(operatorCount == 2 && expression[i] != "-"){
        throw new SyntaxError('Second Consecutive Operator Can Only Be a -');
      // if the operatorCount is 3 or greater, throwing an error
      }else if(operatorCount >= 3){
        throw new SyntaxError('Too Many Consecutive Operators');
      // if there are two operators at the start of the expression or if we have a starting invalid operator, throwing an error
      }else if((operatorCount == 2 && i === 1) || (i === 0 && invalidStartingOperators.includes(expression[0]))){
        throw new SyntaxError('Invalid Starting Operator');
      };

      i += 1;
    }

    return true;
  }
  //routes multiplication and division to the parser function.
  multiplicationAndDivision(expression) {
    //if the expression has no * or /, then we are returning expression immidiately.
    if(!expression.includes("*") && !expression.includes("/")){
      return expression;
    }
    
    let i = 0;
    while(i < expression.length){
      //if the char at index i is a * or /, the index will be sent to the parser function. The parser function will return
      //a new expression with the calculated expression at this index. For example, 5*8*2, the expression returned would be 40*2
      //the i is set as 0 again to restart the itiration.
      
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
  //routes addition and substraction to the parser function.
  additionAndSubstraction(expression) {
    //if the expression has no + or -, then we are returning expression immidiately.
    if(!expression.includes("-") && !expression.includes("+")){
      return expression;
    }

    let i = 0;
    while(i < expression.length){
      //if the char at index i is a + or -, the index will be sent to the parser function. The parser function will return
      //a new expression with the calculated expression at this index. For example, 10-2+3, the expression returned would be 8+3
      //the i is set as 0 again to restart the itiration.
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

  //clearNegatives removes the negatives by changing the expression to for example changes 5+-5 to 5-5 or 5--5 to 5+5;
  clearNegatives(expression) {
    if(!expression.includes("-")){
      return expression;
    }

    let expressionArr = expression.split("");

    for(let i = 0; i < expressionArr.length; i++){
      // if the char at i is "-" and the char at i - 1 is +, then we will make the element at index i - 1 an empty string to make 
      //the expression into a substraction instead. the char at i and the char at i - 1 are both -, that means we can make the expression
      //into an addition instead by making the element at i - 1 to + and the element at i to an empty string.
      //9--1 would eventually become 9+1
      if(expressionArr[i] === "-" && expressionArr[i - 1] === "+"){
        expressionArr.splice((i - 1), 1, "")
      }else if(expressionArr[i] === "-" && expressionArr[i - 1] === "-"){
        expressionArr.splice((i - 1), 1, "+");
        expressionArr.splice(i, 1, "");
        i = i - 2;
      };

    };

    return expressionArr.join("");
  }

  //this is the parser function that uses the expression, operator, and index to find the expression slice. For 9-1*3, we want to find 1*3 from the expression.
  parseExpressionByOperator(expression, operator, index) {
    //startingIndex will be the index of where the expression slice will begin
    let startingIndex = index;
    //endingIndex will be the index of where expression slice ends.
    let endingIndex = index;
    const validOperators = ['-', '+', '/', '*']
    //if the next char is a -, we want to increment the ending index by 1 because we want to include the - as part of the number. 
    if(expression[endingIndex + 1] === "-"){
      endingIndex += 1;
    }

    //increment endingIndex as long as the char at endingIndex + 1 is a number or equal to .
    while(!isNaN(expression[endingIndex + 1]) || expression[endingIndex + 1] === "."){
      endingIndex += 1;
    };
    //decrement startingIndex as long as the char at startingIndex - 1 is a number or  equal to .
    while(!isNaN(expression[startingIndex - 1]) || expression[startingIndex - 1] === "."){
      startingIndex -= 1;
    };
    //will check if the startingIndex - 1 is a - and if  startingIndex - 2 is a valid operator, or if the starting index is 1 because we also want to 
    //include the - to denote the number as a negative.
    if(expression[startingIndex - 1] === "-" && (startingIndex === 1 || validOperators.includes(expression[startingIndex - 2]))){
      startingIndex -= 1;
    };
    //beginningExpression will be the string beginning expression up and not including the startingIndex
    let beginningExpression = expression.slice(0, startingIndex);
    //the expressionSlice will be the string starting at the startingIndex and including the endingIndex.
    let expressionSlice = expression.slice(startingIndex, endingIndex + 1);
    //the endingExpression string will be anything after the endingIndex + 1.
    let endingExpression = expression.slice(endingIndex + 1);

    //depending on what the operator is, we will send the expressionSlice to the respective function and make returned value equal to expressionSlice. 5*2 will return 10
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
    //the function will return a new string with all the expressions concatenated.
    return beginningExpression.concat(expressionSlice, endingExpression);
  }

  //checks if the first number of the expression is a negative. If it is, then it will return the index of the next -. If not, it will return false.
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

//multiplication func that calculates the product 
  multiplicationCalculation(expression){
    let expressionArray = expression.split("*");
    let product = Number(expressionArray[0]) * Number(expressionArray[1])

    return product.toString();
  }
//func calculates the division
  divisionCalculation(expression){
    let expressionArray = expression.split("/");
    let division = Number(expressionArray[0]) / Number(expressionArray[1]);

    return division.toString();
  }
//func calculates the substraction
  substractionCalculation(expression){
    //makes ifFirstNumberNegative equal to the return value of firstNumberNegative
    let isFirstNumberNegative = this.firstNumberNegative(expression)
    let expressionArray;
    //if isFirstNumberNegative is truthy, then we will use the value that gets returned to slice the expression at the correct
    //- index.
    if(isFirstNumberNegative){
      expressionArray = [];
      expressionArray.push(expression.slice(0, isFirstNumberNegative));
      expressionArray.push(expression.slice((isFirstNumberNegative + 1)));
      //if isFirstNumberNegative is falsy, we will split the expression by -.
    }else{
      expressionArray = expression.split("-");
    }
    let substraction = Number(expressionArray[0]) - Number(expressionArray[1]);

    return substraction.toString();
  };
//calculates the sum
  additionCalculation(expression){
    let expressionArray = expression.split("+");
    let summation = Number(expressionArray[0]) + Number(expressionArray[1]);

    return summation.toString();
  }

  appendMathProblem(mathText){
    this.mathProblem = mathText
  }

}
//getting the elements from the index.html file
const mathProblemText = document.querySelector('[math-problem]');
const resultText = document.querySelector('[result]');
const calculateButton = document.querySelector('[calculate]')
//initiating our calculator instance.
let calculator = new Calculator()

//adding an event listener to the calculate button so everytime the button gets clicked, we will get the value from the text input and start the calculation.
calculateButton.addEventListener('click', (event)=>{
  event.preventDefault();
  calculator.appendMathProblem(mathProblemText.value);
  calculator.router();
  resultText.innerText = calculator.result;
})