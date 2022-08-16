export default class Calculator {

    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement
        this.currentOperandTextElement = currentOperandTextElement
        this.isFunction = false
        
        this.clear();
    }

    clear() {
        //Clearing entire screen with current and previous values
        this.currentOperand = ''
        this.previousOperand = ''
        this.operation = undefined
        this.isFunction = false
    }

    delete() {
        //deleting last value on screen
        const operandLength = this.currentOperand.length 

        this.currentOperand = this.currentOperand.toString().slice(0, -1)


        if(this.operation === '**' && this.currentOperand === '') {

            this.currentOperand = this.previousOperand
            this.previousOperand = ''
            this.operation = undefined
        }

        if(this.operation === 'cos' || this.operation === 'sin' 
        || this.operation === 'tan') {
        
            if(operandLength === 0) {
                this.currentOperand = this.previousOperand
                this.operation = undefined
            }
        }
    }

    appendNumber(number) {
        //appending the number to document 
        if (number === '.' && this.currentOperand.includes('.')) return
        this.currentOperand = this.currentOperand.toString() + number.toString()
    }

    chooseOperation(operation) {
        //Changing Current operand to current Operand
        if(this.currentOperand === '' && operation !== 'cos' &&
         operation !== 'sin' && operation !== 'tan') return;

        if(this.currentOperand !== null, this.previousOperand !== null) {
            this.compute()
        }

        if(operation === 'f(x)') {
            this.isFunction = true
            this.appendNumber(operation)
            this.updateDisplay()
            return          
        }

        if(this.previousOperand !== '' && operation !== 'cos' && 
        operation !=='sin' && operation !== 'tan' && this.isFunction) {
            this.compute()
        }



        this.operation = operation
        if(operation === '//') {
            this.compute()
        } else {
            this.previousOperand = this.currentOperand
            this.currentOperand = ''            
        }

    }

    compute() {
        let computation
        const prev = parseFloat(this.previousOperand)
        const current = parseFloat(this.currentOperand)


        if(this.operation !== '//' && this.operation !== 'cos'
         && this.operation !== 'sin' && this.operation !== 'tan') {
            if(isNaN(prev) || isNaN(current)){
                return
            } 
        }

        switch (this.operation) {
            case '+':
                computation = prev + current
                break;
            case '-':
                computation = prev - current
                break;
            case '*':
                computation = prev * current
                break;
            case '/':
                computation = prev / current
                break;
            case '**':
                computation = prev ** current
                break;
            case '//':
                if(isNaN(current)) {
                    return;
                }
                computation = Math.sqrt(current)
                break;
            case 'cos': 
                let cosValue = Math.cos(current)

                if(isNaN(prev)) {
                    computation = cosValue
                } else {
                    computation = cosValue * prev   
                }
                break;
            case 'sin':
                let sinValue = Math.sin(current)

                if(isNaN(prev)) {
                    computation = sinValue
                } else {
                    computation = sinValue * prev   
                }
                break;
            case 'tan':
                let tanValue = Math.tan(current)

                if(isNaN(prev)) {
                    computation = tanValue
                } else {
                    computation = tanValue * prev   
                }
                break;
            default:
                return
            
            
                
        }



        //Putting Anwer onto the screen
        this.currentOperand = computation
        this.operation = undefined
        this.previousOperand = ''
    }

    updateDisplay() {
        //Updaying Display of Calculator

        this.currentOperandTextElement.innerText =
        this.getDisplayNumber(this.currentOperand) 

        if(this.operation === "+" || this.operation === "-"
         || this.operation === "*" || this.operation === '/' ) {
            if(!this.isFunction) {
                this.previousOperandTextElement.innerText = 
                `${this.getDisplayNumber(this.previousOperand)}`
                return
            }
        }
        


        if(this.operation != null && this.operation != '**' &&
         this.operation != '//' && this.operation != 'cos' && 
         this.operation != 'sin' && this.operation != 'tan'
         && !this.isFunction && isNaN(this.currentOperand)) {

            this.previousOperandTextElement.innerText = 
            `${this.getDisplayNumber(this.previousOperand)}`
        } else if (this.operation == '**' ||
         this.operation == 'cos' || this.operation == 'sin' ||
          this.operation == 'tan' && this.operation != '//') {
            
            this.currentOperandTextElement.innerText = 
            `${this.getDisplayNumber(this.previousOperand)} ${this.operation} (${this.getDisplayNumber(this.currentOperand)})`

        } else if(this.operation == '//') {
            this.currentOperandTextElement = 
            `${this.getDisplayNumber(this.currentOperand)}`
        } else if(this.isFunction) {
            this.currentOperandTextElement.innerText =  `${this.currentOperand}`
        } else {
            this.previousOperandTextElement.innerText = ''                
        }   
    }

    
    getDisplayNumber(number) {
        //Floating number for display for decimal answers
        const stringNumber = number.toString()
        const integerDigits = parseFloat(stringNumber.split('.'[0]))
        const decimalDigits = stringNumber.split('.')[1]
        let integerDisplay
        if(isNaN(integerDigits)) {
            integerDisplay = ''
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {maximumFractionDigits: 0})
        }
        if(decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`
        } else {
            return integerDisplay
        }
    }

    //Getting operation for Current Calculation
    getOperation() {
        return this.operation
    }

    setIsFunction(bool) {
        this.isFunction = bool
    }



}