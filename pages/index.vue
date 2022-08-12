<template>
      <div class="calculator-grid mt-5">
        <div class="output">
            <div data-previous-operand class="previous-operand"></div>
            <div data-current-operand class="current-operand"></div>
        </div>
        <button data-all-clear class="span-two"  @click="clear">AC</button>
        <button data-delete @click="remove">DEL</button>
        <button id="divide" data-operation @click="operations('/')">÷</button>
        <button data-number @click="numbers(1)">1</button>
        <button data-number @click="numbers(2)">2</button>
        <button data-number @click="numbers(3)">3</button>
        <button id="multiply" data-operation @click="operations('*')">*</button>
        <button data-number @click="numbers(4)">4</button>
        <button data-number @click="numbers(5)">5</button>
        <button data-number @click="numbers(6)">6</button>
        <button id="plus" data-operation @click="operations('+')">+</button>
        <button data-number @click="numbers(7)">7</button>
        <button data-number @click="numbers(8)">8</button>
        <button data-number @click="numbers(9)">9</button>
        <button id="subtract" data-operation @click="operations('-')">-</button>
        <button data-number @click="numbers('.')">.</button>
        <button data-number @click="numbers(0)">0</button>
        <button id="square" data-number @click="operations('**')">^</button>
        <button data-operation @click="operations('//')" id="squareRoot">√</button>
        <button data-operation @click="operations('cos')" id="cosine">cos(x)</button>
        <button data-operation @click="operations('sin')" id="sin">sin(x)</button>
        <button data-operation @click="operations('tan')" id="tan">tan(x)</button>
        <button></button>
        <button data-number @click="numbers('x')">x</button>
        <button data-number></button>
        <button data-number></button>
        <button data-number></button>
        <button data-equals @click="equals" class="span-four" style="width: 100%">= / Graph</button>
   
        <div class="chart-container" style="position: relative; height:400px; width: 400px">
          <canvas id="myChart"></canvas>        
        </div>


    </div>
</template>

<script>
import Calculator from '../helper/Calculator'
import Grapher from '../helper/Grapher'

export default {
  name: 'IndexPage',
  created() {
    const previousOperandTextElement = document.querySelector('[data-previous-operand]')
    const currentOperandTextElement = document.querySelector('[data-current-operand]')




    let calculator = new Calculator(previousOperandTextElement, currentOperandTextElement)

    return {
      Calculator: calculator,
      numberButtons: document.querySelectorAll('[data-number]'),
      operationButtons: document.querySelectorAll('[data-operation]'),
      equalsButton: document.querySelectorAll('[data-equals]'),
      deleteButton: document.querySelector('[data-delete]'),
      allClearButton: document.querySelector('[data-all-clear]'),
      previousOperandTextElement: previousOperandTextElement,
      currentOperandTextElement: currentOperandTextElement,
      currentFunction : "",
      isFunction: false,
      graph: null,
      grapher: null
    }
  },
  methods: {
    numbers(value) {
      console.log(this.isFunction)
      if(this.Calculator === undefined) {
          this.Calculator = new Calculator(document.querySelector('[data-previous-operand]'), 
          document.querySelector('[data-current-operand]'))
      } 

      if(value === 'x') {
        this.isFunction = true;
        this.operations("f(x)")

        this.Calculator.appendNumber(value)
        this.Calculator.updateDisplay()   
      
        return
      }

      this.Calculator.appendNumber(value)
      this.Calculator.updateDisplay()   
      



    },
    operations(operation) {

      if(this.Calculator === undefined) {
          this.Calculator = new Calculator(document.querySelector('[data-previous-operand]'), 
          document.querySelector('[data-current-operand]'))
      } 

      if(this.isFunction && operation != 'f(x)') {
        this.Calculator.appendNumber(operation);
        this.Calculator.updateDisplay();
        return
      }

      if(operation === "f(x)") {
        this.isFunction = true;
        this.Calculator.setIsFunction(true)
        return
      }
   



      if(operation === "**" || operation === 'cos' ||
      operation === 'tan' || operation === 'sin') {
        if(!this.isFunction) {
          this.disableButtons()          
        }

      }

      this.Calculator.chooseOperation(operation)
      this.Calculator.updateDisplay()
    },
    equals(functionType = "") {
      if(document.getElementsByClassName('current-operand')[0].innerText.length > 0) {
        if(this.Calculator === undefined) {
            this.Calculator = new Calculator(document.querySelector('[data-previous-operand]'), 
            document.querySelector('[data-current-operand]'))
        } 

        if(this.isFunction) {
          this.createGraph(document.querySelector('[data-current-operand]').innerText, functionType)
          return;
        }

        if(document.getElementById('squareRoot').disabled === true) {
          this.undisabledButtons()      
        }

        this.Calculator.compute()
        this.Calculator.updateDisplay()
      }
    },
    clear() {
      if(document.getElementsByClassName('current-operand')[0].innerText.length > 0) {
        if(this.Calculator === undefined) {
          this.Calculator = new Calculator(document.querySelector('[data-previous-operand]'), 
          document.querySelector('[data-current-operand]'))
        } 
        this.Calculator.setIsFunction(false)
        this.isFunction = false
        this.undisabledButtons()


        this.Calculator.clear()
        this.Calculator.updateDisplay()        
      }
    },
    remove() {      
      if(this.Calculator === undefined) {
        this.Calculator = new Calculator(this.previousOperandTextElement, this.currentOperandTextElement)
      } 


      this.Calculator.delete()
      this.Calculator.updateDisplay()
      if(this.currentOperandTextElement === '' || !this.Calculator.getOperation()) {
        this.isFunction = false
        this.undisabledButtons()
      }
    },
    createGraph(operation) {
      let canvas = document.getElementById('myChart').getContext('2d')
      document.getElementById('myChart').getContext('2d').clearRect(0,0, canvas.width, canvas.height);
      this.graph = null;

      if(this.grapher !== undefined) {
        this.grapher.destroyGraph();
      }

      this.graph = document.getElementById('myChart').getContext('2d')
      this.grapher = new Grapher(this.graph, operation);
      this.grapher.createGraph();
    },
    disableButtons() {
      document.getElementById('squareRoot').disabled = true
      document.getElementById('cosine').disabled = true
      document.getElementById('sin').disabled = true
      document.getElementById('tan').disabled = true
      document.getElementById('divide').disabled = true;
      document.getElementById('multiply').disabled = true;
      document.getElementById('plus').disabled = true;
      document.getElementById('subtract').disabled = true;
      document.getElementById('square').disabled = true;
    },
    undisabledButtons() {
      document.getElementById('squareRoot').disabled = false
      document.getElementById('cosine').disabled = false
      document.getElementById('sin').disabled = false
      document.getElementById('tan').disabled = false
      document.getElementById('divide').disabled = false;
      document.getElementById('multiply').disabled = false;
      document.getElementById('plus').disabled = false;
      document.getElementById('subtract').disabled = false;
      document.getElementById('square').disabled = false;
    }
  }
}
</script>


<style>
*, *::before, *::after {
  box-sizing: border-box;
  font-family: Gotham Rounded, sans-serif;
  font-weight: normal;
}
canvas {
  width: 10px;
}

body {
  margin: 0;
  padding: 0;
  background: linear-gradient(to right, #CBCE91FF, #EA738DFF);
  }

  .calculator-grid {
    display: grid;
    justify-content: center;
    align-content: center;
    min-height: 100vh;
    grid-template-columns: repeat(4, 100px);
    grid-template-rows: minmax(120px, auto) repeat(5, 100px);
    }

    .calculator-grid > button {
      cursor: pointer;
      font-size: 2rem;
      border: 1px, solid #FFFFFF;
      outline: none;
      background-color: rbga(255, 255, 255, 0.75);
    }

      .calculator-grid > button:hover {
        background-color: #a9a9a9;
      }

      .span-two {
        grid-column: span 2;
        color: #adf802;
        background-color: rgba(139, 0, 139, 0.8);
      }
      .span-four {
        grid-column: span 4;
        color: #adf802;
        background-color: rgba(139, 0, 139, 0.8);
      }

      .output{
        grid-column: 1 / -1;
        background-color: rgba(0, 0, 0, 0.75);
        display: flex;
        align-items: flex-end;
        justify-content: space-around;
        flex-direction: column;
        padding: 10px;
        word-wrap: break-word;
        word-break: break-all;
      }

      .output .previous-operand{
        color: rgba(255,255, 255, 0.75);
        font-size: 1rem;
      }

      .output .current-operand{
        color: white;
        font-size: 2rem;
      }
</style>
