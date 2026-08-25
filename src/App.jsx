import { useState } from 'react'
import './App.css'

const OPS = { '÷': (a, b) => a / b, '×': (a, b) => a * b, '−': (a, b) => a - b, '+': (a, b) => a + b }

function formatNum(value) {
  if (value === 'Error') return value
  const num = Number(value)
  if (Number.isNaN(num)) return value
  const str = value.toString()
  if (str.length > 11) {
    return num.toPrecision(10).replace(/\.?0+$/, '').replace(/\.?0+e/, 'e')
  }
  return str
}

export default function App() {
  const [display, setDisplay] = useState('0')
  const [stored, setStored] = useState(null)
  const [operator, setOperator] = useState(null)
  const [overwrite, setOverwrite] = useState(true)
  const [expression, setExpression] = useState('')

  const inputDigit = (digit) => {
    if (display === 'Error') return resetAnd(() => inputDigit(digit))
    if (overwrite) {
      setDisplay(digit === '.' ? '0.' : digit)
      setOverwrite(false)
    } else {
      if (digit === '.' && display.includes('.')) return
      setDisplay(display + digit)
    }
  }

  const resetAnd = (fn) => {
    setDisplay('0')
    setStored(null)
    setOperator(null)
    setExpression('')
    setOverwrite(true)
    setTimeout(fn, 0)
  }

  const clearAll = () => {
    setDisplay('0')
    setStored(null)
    setOperator(null)
    setExpression('')
    setOverwrite(true)
  }

  const toggleSign = () => {
    if (display === 'Error') return
    setDisplay((Number(display) * -1).toString())
  }

  const percent = () => {
    if (display === 'Error') return
    setDisplay((Number(display) / 100).toString())
  }

  const chooseOperator = (nextOp) => {
    if (display === 'Error') return
    if (operator && !overwrite) {
      const result = OPS[operator](stored, Number(display))
      const resultStr = Number.isFinite(result) ? result.toString() : 'Error'
      setDisplay(resultStr)
      setStored(resultStr === 'Error' ? null : result)
      setExpression(resultStr === 'Error' ? '' : `${formatNum(resultStr)} ${nextOp}`)
    } else {
      setStored(Number(display))
      setExpression(`${formatNum(display)} ${nextOp}`)
    }
    setOperator(nextOp)
    setOverwrite(true)
  }

  const equals = () => {
    if (operator === null || overwrite || display === 'Error') return
    const result = OPS[operator](stored, Number(display))
    const resultStr = Number.isFinite(result) ? result.toString() : 'Error'
    setExpression(resultStr === 'Error' ? '' : `${formatNum(stored)} ${operator} ${formatNum(display)} =`)
    setDisplay(resultStr)
    setStored(null)
    setOperator(null)
    setOverwrite(true)
  }

  const backspace = () => {
    if (display === 'Error' || overwrite) return
    const next = display.length > 1 ? display.slice(0, -1) : '0'
    setDisplay(next)
    if (next === '0') setOverwrite(true)
  }

  const keyClass = (base, extra = '') => `key ${base}${extra ? ' ' + extra : ''}`

  return (
    <div className="calculator">
      <div className="screen">
        <div className="expression">{expression || '\u00A0'}</div>
        <div className="display">{formatNum(display)}</div>
      </div>

      <div className="keys">
        <button className={keyClass('key--func')} onClick={clearAll}>AC</button>
        <button className={keyClass('key--func')} onClick={toggleSign}>±</button>
        <button className={keyClass('key--func')} onClick={percent}>%</button>
        <button className={keyClass('key--op', operator === '÷' && overwrite ? 'is-active' : '')} onClick={() => chooseOperator('÷')}>÷</button>

        <button className="key" onClick={() => inputDigit('7')}>7</button>
        <button className="key" onClick={() => inputDigit('8')}>8</button>
        <button className="key" onClick={() => inputDigit('9')}>9</button>
        <button className={keyClass('key--op', operator === '×' && overwrite ? 'is-active' : '')} onClick={() => chooseOperator('×')}>×</button>

        <button className="key" onClick={() => inputDigit('4')}>4</button>
        <button className="key" onClick={() => inputDigit('5')}>5</button>
        <button className="key" onClick={() => inputDigit('6')}>6</button>
        <button className={keyClass('key--op', operator === '−' && overwrite ? 'is-active' : '')} onClick={() => chooseOperator('−')}>−</button>

        <button className="key" onClick={() => inputDigit('1')}>1</button>
        <button className="key" onClick={() => inputDigit('2')}>2</button>
        <button className="key" onClick={() => inputDigit('3')}>3</button>
        <button className={keyClass('key--op', operator === '+' && overwrite ? 'is-active' : '')} onClick={() => chooseOperator('+')}>+</button>

        <button className={keyClass('key--func')} onClick={backspace}>⌫</button>
        <button className="key" onClick={() => inputDigit('0')}>0</button>
        <button className="key" onClick={() => inputDigit('.')}>.</button>
        <button className="key key--equals" onClick={equals}>=</button>
      </div>
    </div>
  )
}
