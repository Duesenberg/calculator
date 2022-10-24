let result = 0;
let operand1, operand2, operator, operandValue;
let calculationStage = 0;
let dot = 0;//used for preventing multiple '.' when inputting
let equalsClicked = 0;//used in the invert and percent fns

const body = document.querySelector('body');
const buttons = document.querySelectorAll('button');
const numButtons = document.querySelectorAll('.numpad');
const opButtons = document.querySelectorAll('.operate');

const resScreenCont = document.querySelector('.result-screen-container');
const resScreen = document.createElement('div');
resScreen.textContent = result;
resScreen.classList.add('result-screen');
resScreenCont.appendChild(resScreen);

buttons.forEach(button => {
  button.addEventListener('mousedown', () => {
    button.classList.add('button-pressed');
  })
});
body.addEventListener('mouseup', () => {
  buttons.forEach(button => {
    button.classList.remove('button-pressed');
  })
})

//the conditions with 'dot' prevent writing '.' more than once
function operandInput () {
  operandValue = 0;
  numButtons.forEach(button => {
    button.addEventListener('click', () => {
      if (dot == 0 && button.value == '.') {
        operandValue += button.value;
        dot += 1;
      } else if (dot != 0 && button.value == '.') operandValue = operandValue;
      else operandValue += button.value;
      storeOperand(operandValue);
      showOnScreen (operand1, operand2);
    })
  })
}

//operates on the operand you are inputting
function perCent () {
  if (equalsClicked == 1) {
    operandValue = result;
    operandValue = parseFloat(operandValue) / 100;
    operandValue = operandValue.toString();//otherwise error when backSpace()
    storeOperand(operandValue);
    showOnScreen (operand1, operand2);
    equalsClicked = 0; 
  } else {
    operandValue = parseFloat(operandValue) / 100;
    operandValue = operandValue.toString();//otherwise error when backSpace()
    storeOperand(operandValue);
    showOnScreen (operand1, operand2);  
  }
}

//operates on the operand you are inputting
function invert () {
  if (equalsClicked == 1) {
    operandValue = result;
    operandValue = - parseFloat(operandValue);
    storeOperand(operandValue);
    showOnScreen (operand1, operand2);
    equalsClicked = 0;
  } else {
    operandValue = - parseFloat(operandValue);
    storeOperand(operandValue);
    showOnScreen (operand1, operand2);
  }  
  }

function backSpace () {
  operandValue = operandValue.toString();
  operandValue = operandValue.slice(0, -1);
  if (operandValue != '') {
    storeOperand(operandValue);
    showOnScreen (operand1, operand2);  
  } else {
    operandValue = '0';
    storeOperand(operandValue);
    showOnScreen (operand1, operand2);  
  }
}

//last condition changes result to operand1 if numpad is pressed directly after
//'='. Also resets equalsClicked.
//this is so you can start a new operation if you dont want to chain ops
function storeOperand (operandValue) {
  calculationStage == 0 || calculationStage == 2 ? 
  operand1 = parseFloat(operandValue) : operand2 = parseFloat(operandValue);
  if (calculationStage == 2) {
    result = operand1;
    equalsClicked = 0; 
  }
}

//while operand is being written
function showOnScreen (operand1, operand2) {
  if (operandValue.toString().length <= 10) {
    calculationStage == 0 || calculationStage == 2 ? 
    resScreen.textContent = operand1 : resScreen.textContent = operand2;  
  } else {
    calculationStage == 0 || calculationStage == 2 ? 
    resScreen.textContent = operand1.toPrecision(10) : 
    resScreen.textContent = operand2.toPrecision(10);  
  }
}

//- runs operate() on each click (except for when calculationStage is 
//  greater than 1, case when equals has been pressed before). this allows 
//  chaining operations
function operatorInput () {
  opButtons.forEach(button => {
    button.addEventListener('click', () => {
      if (calculationStage == 0) {
        operate(operand1, operand2, operator);  
        calculationStage < 1 ? calculationStage += 1 : calculationStage = 1;
        operator = button.id;
        operandValue = 0;
        dot = 0;
      } else if (calculationStage == 1) {
        operate(operand1, operand2, operator);  
        calculationStage < 1 ? calculationStage += 1 : calculationStage = 1;
        operator = button.id;
        operandValue = 0;
        dot = 0;
        resScreen.textContent = result;//shows result on screen when chaining ops
      } else {
        calculationStage < 1 ? calculationStage += 1 : calculationStage = 1;
        operator = button.id;
        operandValue = 0;
        dot = 0;
      }
    })
  })
}

function operate(operand1,operand2,operator) {
  if (calculationStage == 0) result = operand1;
  else {
    switch (operator) {
      case 'plus':
        result += operand2;
        break;
      case 'minus':
        result -= operand2;
        break;
      case 'multiply':
        result *= operand2;
        break;
      case 'divide':
        result /= operand2;
        break;
    }
  }
}

//- sets calculationStage to 2. this is done so when you enter the next operator,
//  the operate fn doesn't get called (if it was called it would take prev.
//  value of operand2 and calculate before you can enter the next number. see operatorInput fn)
function equals () {
  operate(operand1, operand2, operator);
  result.toString().length <= 10 ? resScreen.textContent = result : 
  resScreen.textContent = result.toPrecision(10);
  calculationStage = 2;
  operandValue = 0;
  equalsClicked = 1;
}

function clearAll() {
  operand1 = 0;
  operand2 = 0;
  operator = '';
  result = 0;
  dot = 0;
  equalsClicked = 0;
  calculationStage = 0;
  operandValue = 0;
  resScreen.textContent = result;
}

//hotkeys
window.addEventListener('keydown', function(e) {
  const key = document.querySelector(`button[data-key="${e.key}"]`);
  key.click();
  key.classList.add('button-pressed');
  setTimeout(function() {
    key.classList.remove('button-pressed')
  }, 100);
})

operandInput();
operatorInput();