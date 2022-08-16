import { Chart, registerables} from 'chart.js';

export default class Grapher {
    constructor(graphingTextElement, operation) {
        this.graphingTextElement = graphingTextElement
        Chart.register(...registerables);
        this.operation = operation
        this.myChart = undefined;
    }

    createGraph() {


        let theOperation = this.createOperationFunction(this.operation)            


        let ctx = this.graphingTextElement;
        
        var xValues = [];
        var yValues = [];
        generateData(theOperation, -10, 10, 0.5);
        const myChart = new Chart(ctx, {
            type: "line",
            data: {
              labels: xValues,
              datasets: [{
                fill: false,
                pointRadius: 1,
                borderWidth: 1,
                borderColor: "rgba(25,73,88,0.5)",
                data: yValues,
                backgroundColor: "#e755ba",
                pointBackgroundColor: "#55bae7",
                pointBorderColor: "#55bae7",
                pointHoverBackgroundColor: "#55bae7",
                pointHoverBorderColor: "#55bae7",
              }]
            },

            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        borderWidth: 2
                    }
                },
                plugins: {
                    title: {
                        text: `y = ${this.operation}`,
                        display: true
                    },
                    legend: {
                        display: false,
                        labels: {
                            usePointStyle: true
                        }
                    },

                },
                responsive: true
            }
        });   

        this.myChart = myChart

        //Generating Data For Graph
        function generateData(value, i1, i2, step = 1) {
            for (let x = i1; x <= i2; x += step) {
                yValues.push(eval(value));
                xValues.push(x);
            }
        }     
    }

    destroyGraph() {
        this.myChart.destroy();
    }

    createOperationFunction(operation) {
        let newOperation = ""
        let isVariable = false
        const operationLength = operation.length - 1
        for(let i = 0; i <= operationLength; i++) {

            if(isVariable) {
                isVariable = false;
                continue
            }

            if(operation[i] === "x" && operation[i-1] === "x") {
                continue
            }

            if(operation[i] === "*" && operation[i+1] === "*") {
                newOperation = newOperation + operation[i] + operation[i] + ' '
                continue;
            }

            if(operation[i] === "*" && operation[i-1] === "*") {
                continue;
            }

            if(operation[i] === "x" && operation[i+1] === "*") {
                newOperation = newOperation + operation[i] + " ";
                continue;
            }

            if(!isNaN(operation[i]) && operation[i+1] === 'x' 
            && isNaN(operation[i+2]) ) {
                newOperation = newOperation + operation[i] + " * " + operation[i+1] + " "
                isVariable = true;
                continue
            }


            if(!isNaN(operation[i]) && operation[i-1] === "*" ||
             operation[i] === "+") {

                newOperation = newOperation + operation[i] + " "
            } else if(isNaN(operation[i]) && isNaN(operation[i+1]) 
            && operation[i+1] !== "x") {
                newOperation = newOperation + operation[i] + " "
            } else {
                newOperation = newOperation + operation[i]
            }
        }
        return newOperation;
    }



}