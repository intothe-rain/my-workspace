import { useState } from 'react'
import { 
  HiOutlineCalculator,
  HiOutlineClipboard,
  HiOutlineRefresh,
  HiOutlineColorSwatch,
  HiOutlineDocumentText
} from 'react-icons/hi'

function Utilities() {
  const [activeTab, setActiveTab] = useState('calculator')

  return (
    <div className="utilities-page">
      <div className="page-header">
        <h2>유틸리티</h2>
      </div>

      <div className="utility-tabs">
        <button 
          className={`utility-tab ${activeTab === 'calculator' ? 'active' : ''}`}
          onClick={() => setActiveTab('calculator')}
        >
          <HiOutlineCalculator size={18} />
          계산기
        </button>
        <button 
          className={`utility-tab ${activeTab === 'converter' ? 'active' : ''}`}
          onClick={() => setActiveTab('converter')}
        >
          <HiOutlineRefresh size={18} />
          단위 변환
        </button>
        <button 
          className={`utility-tab ${activeTab === 'color' ? 'active' : ''}`}
          onClick={() => setActiveTab('color')}
        >
          <HiOutlineColorSwatch size={18} />
          컬러
        </button>
        <button 
          className={`utility-tab ${activeTab === 'text' ? 'active' : ''}`}
          onClick={() => setActiveTab('text')}
        >
          <HiOutlineDocumentText size={18} />
          텍스트
        </button>
      </div>

      <div className="utility-content">
        {activeTab === 'calculator' && <Calculator />}
        {activeTab === 'converter' && <UnitConverter />}
        {activeTab === 'color' && <ColorTool />}
        {activeTab === 'text' && <TextTool />}
      </div>
    </div>
  )
}

function Calculator() {
  const [display, setDisplay] = useState('0')
  const [equation, setEquation] = useState('')

  const handleNumber = (num) => {
    setDisplay(display === '0' ? num : display + num)
  }

  const handleOperator = (op) => {
    setEquation(display + ' ' + op + ' ')
    setDisplay('0')
  }

  const handleEqual = () => {
    try {
      const result = eval(equation + display)
      setDisplay(String(result))
      setEquation('')
    } catch {
      setDisplay('Error')
    }
  }

  const handleClear = () => {
    setDisplay('0')
    setEquation('')
  }

  return (
    <div className="calculator">
      <div className="calc-display">
        <div className="calc-equation">{equation}</div>
        <div className="calc-result">{display}</div>
      </div>
      <div className="calc-buttons">
        <button className="calc-btn clear" onClick={handleClear}>C</button>
        <button className="calc-btn" onClick={() => handleOperator('/')}>÷</button>
        <button className="calc-btn" onClick={() => handleOperator('*')}>×</button>
        <button className="calc-btn" onClick={() => handleOperator('-')}>-</button>
        <button className="calc-btn" onClick={() => handleNumber('7')}>7</button>
        <button className="calc-btn" onClick={() => handleNumber('8')}>8</button>
        <button className="calc-btn" onClick={() => handleNumber('9')}>9</button>
        <button className="calc-btn" onClick={() => handleOperator('+')}>+</button>
        <button className="calc-btn" onClick={() => handleNumber('4')}>4</button>
        <button className="calc-btn" onClick={() => handleNumber('5')}>5</button>
        <button className="calc-btn" onClick={() => handleNumber('6')}>6</button>
        <button className="calc-btn equals" onClick={handleEqual}>=</button>
        <button className="calc-btn" onClick={() => handleNumber('1')}>1</button>
        <button className="calc-btn" onClick={() => handleNumber('2')}>2</button>
        <button className="calc-btn" onClick={() => handleNumber('3')}>3</button>
        <button className="calc-btn zero" onClick={() => handleNumber('0')}>0</button>
        <button className="calc-btn" onClick={() => handleNumber('.')}>.</button>
      </div>
    </div>
  )
}

function UnitConverter() {
  const [type, setType] = useState('length')
  const [from, setFrom] = useState('')
  const [result, setResult] = useState('')

  const conversions = {
    length: { 
      m: 1, km: 0.001, cm: 100, mm: 1000, 
      mile: 0.000621371, inch: 39.3701, ft: 3.28084 
    },
    weight: { 
      kg: 1, g: 1000, mg: 1000000, 
      lb: 2.20462, oz: 35.274 
    },
    temperature: {
      celsius: 'C', fahrenheit: 'F', kelvin: 'K'
    }
  }

  const handleConvert = (value, fromUnit, toUnit) => {
    if (type === 'temperature') {
      let celsius
      if (fromUnit === 'celsius') celsius = parseFloat(value)
      else if (fromUnit === 'fahrenheit') celsius = (parseFloat(value) - 32) * 5/9
      else celsius = parseFloat(value) - 273.15

      if (toUnit === 'celsius') setResult(celsius.toFixed(2))
      else if (toUnit === 'fahrenheit') setResult((celsius * 9/5 + 32).toFixed(2))
      else setResult((celsius + 273.15).toFixed(2))
    } else {
      const baseValue = parseFloat(value) / conversions[type][fromUnit]
      setResult((baseValue * conversions[type][toUnit]).toFixed(4))
    }
  }

  return (
    <div className="converter">
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="length">길이</option>
        <option value="weight">무게</option>
        <option value="temperature">온도</option>
      </select>
      <div className="converter-inputs">
        <input
          type="number"
          placeholder="값 입력"
          value={from}
          onChange={(e) => {
            setFrom(e.target.value)
            if (e.target.value) handleConvert(e.target.value, 'm', 'km')
          }}
        />
        <span>→</span>
        <div className="converter-result">{result}</div>
      </div>
    </div>
  )
}

function ColorTool() {
  const [color, setColor] = useState('#6366f1')
  const [copied, setCopied] = useState('')

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(text)
    setTimeout(() => setCopied(''), 1500)
  }

  const hexToRgb = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgb(${r}, ${g}, ${b})`
  }

  return (
    <div className="color-tool">
      <div className="color-preview" style={{ background: color }}></div>
      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
      />
      <div className="color-values">
        <div className="color-value" onClick={() => copyToClipboard(color)}>
          <span>HEX</span>
          <code>{color}</code>
          {copied === color && <span className="copied">복사됨!</span>}
        </div>
        <div className="color-value" onClick={() => copyToClipboard(hexToRgb(color))}>
          <span>RGB</span>
          <code>{hexToRgb(color)}</code>
        </div>
      </div>
    </div>
  )
}

function TextTool() {
  const [text, setText] = useState('')
  const [result, setResult] = useState('')

  const countChars = () => {
    setResult({
      chars: text.length,
      charsNoSpace: text.replace(/\s/g, '').length,
      words: text.trim() ? text.trim().split(/\s+/).length : 0,
      lines: text ? text.split('\n').length : 0
    })
  }

  return (
    <div className="text-tool">
      <textarea
        placeholder="텍스트를 입력하세요..."
        rows={8}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyUp={countChars}
      />
      {result && (
        <div className="text-stats">
          <div className="text-stat">
            <span className="stat-num">{result.chars}</span>
            <span className="stat-lbl">글자</span>
          </div>
          <div className="text-stat">
            <span className="stat-num">{result.charsNoSpace}</span>
            <span className="stat-lbl">공백 제외</span>
          </div>
          <div className="text-stat">
            <span className="stat-num">{result.words}</span>
            <span className="stat-lbl">단어</span>
          </div>
          <div className="text-stat">
            <span className="stat-num">{result.lines}</span>
            <span className="stat-lbl">줄</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default Utilities
