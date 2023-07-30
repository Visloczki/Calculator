class Calculator {
  constructor(previousOutputText, currentOutputText) {
      this.previousOutputText = previousOutputText
      this.currentOutputText = currentOutputText
      this.clear()
      this.fetchingData()
      this.allCalculate()
  }
  clear()
  {
      this.previousOperand = ''
      this.currentOperand = ''
      this.previousOutputText.innerText = ''
      this.currentOutputText.innerText = ''
      this.operation = undefined
  }

  delete()
  {
      this.currentOperand = this.currentOperand.toString().slice(0, -1)
  }

  appendNumber(number)
  {
    console.log(number)
      if(number === '.' && this.currentOperand.includes('.')) return
      this.currentOperand = this.currentOperand.toString() + number.toString()
  }

  chooseOperation(operation)
  {
      if(this.currentOperand === '') return

      if(this.previousOperand !== '') {
          this.compute()
      }
      this.operation = operation
      this.previousOperand = this.currentOperand
      this.currentOperand = ''
  }
  async updateDataTable(data) 
  {
      try {
          await fetch('http://api.dxapi.nhely.hu/api/', {
              method: 'POST',
              body: JSON.stringify(data)
          }).then(response => response.ok)
          .then(data => {
              this.fetchingData()
              this.allCalculate()
          })
          .catch(err => console.log(err))
      } catch (error) {
          console.log(error)
      }
  }

  compute()
  {
      let computation
      const prev = parseFloat(this.previousOperand)
      const current = parseFloat(this.currentOperand)

      if(isNaN(prev) || isNaN(current) ) return

      switch(this.operation) {
          case '+' : computation = prev + current
              break
          case '-' : computation = prev - current
              break
          case '*' : computation = prev * current
              break
          case '/' : computation = prev / current
              break
          default: 
              return
      }

      this.updateDataTable({
          firstNumber : prev,
          lastNumber : current,
          operand : this.operation,
          sum : computation
      })

      this.previousOperand = computation
      this.previousOutputText.innerText = computation
      this.operation = undefined
      this.currentOperand = ''
      
   }
  getDisplayNumber(number) 
  {
      const floatNumber = parseFloat(number)
      if(isNaN(floatNumber)) return ''
      return number.toLocaleString('hu')
  }

  updateDisplay()
  {
         this.currentOutputText.innerText = this.getDisplayNumber(this.currentOperand)
         if(this.operation != null) {
             this.previousOutputText.innerText = `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`
          }
  }

  async allCalculate() {
      let template = ""

      try {
          const response = await fetch('http://api.dxapi.nhely.hu/api/get-all-calculates')
          const resp_data = await response.json()
         
          for (const item of resp_data) {

              template += `<tr>
              <td>${item.id}</td>
              <td>${item.firstNumber}</td>
              <td>${item.lastNumber}</td>
              <td>${item.sum}</td>
              <td>${item.operand}</td>
              </tr>`
          }
      } catch (error) {
          console.log(error)
      }
      allCalculateTable.innerHTML = template
  }

  async fetchingData() {
      let template = "<tr>"
      try {
          const response = await fetch('http://api.dxapi.nhely.hu/api/statics')
          const response_data = await response.json()
          if (!response_data.mostUsedOperand) return
          for (const item of response_data.datas) {
              template += `
              <td>${item.legnagyobb_vegosszeg}</td>
              <td>${item.legkissebb_vegosszeg}</td>
              <td>${Math.round(item.atlag)}</td>
              <td>${item.osszes_vegosszeg}</td>
              <td><b>${response_data.mostUsedOperand.operand}</b> ( ${response_data.mostUsedOperand.countOfUsed} x )</td>
              `
          } 
          template += "</tr>"
      } catch(err) {
          console.log(err)
      }
      staticsTable.innerHTML = template
  }
}


const numberButtons = document.querySelectorAll('[data-number]')
const operationButtons = document.querySelectorAll('[data-operand]')
const equalButton = document.querySelector('[data-equal]')
const delButton = document.querySelector('[data-delete]')
const clearButton = document.querySelector('[data-clear-all]')
const previousOutputText = document.querySelector('[data-previous-operand]')
const currentOutputText = document.querySelector('[data-current-operand]')
const staticsTable = document.querySelector('[data-statics-result]')
const allCalculateTable = document.querySelector('[data-all-results]')




const calculator = new Calculator(previousOutputText, currentOutputText)

numberButtons.forEach(button => {
  button.addEventListener('click', () => {
    calculator.appendNumber(button.innerText)
    calculator.updateDisplay()
  })
})

operationButtons.forEach(button => {
  button.addEventListener('click', () => {
    calculator.chooseOperation(button.innerText)
    calculator.updateDisplay()
  })
})

equalButton.addEventListener('click', button => {
  calculator.compute()
  calculator.updateDisplay()
})

clearButton.addEventListener('click', button => {
  calculator.clear()
  calculator.updateDisplay()
})

delButton.addEventListener('click', button => {
  calculator.delete()
  calculator.updateDisplay()
})