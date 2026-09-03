import { useState, useEffect } from 'react'
import { 
  HiOutlineGlobe,
  HiOutlineRefresh,
  HiOutlineExternalLink,
  HiOutlineCloud
} from 'react-icons/hi'

function ApiHub() {
  const [activeApi, setActiveApi] = useState('weather')
  const [weather, setWeather] = useState(null)
  const [joke, setJoke] = useState(null)
  const [quote, setQuote] = useState(null)
  const [loading, setLoading] = useState(false)

  const apis = [
    { id: 'weather', name: '날씨', icon: HiOutlineCloud },
    { id: 'joke', name: '유머', icon: HiOutlineGlobe },
    { id: 'quote', name: '명언', icon: HiOutlineGlobe },
  ]

  const fetchWeather = async () => {
    setLoading(true)
    try {
      const response = await fetch(
        'https://api.open-meteo.com/v1/forecast?latitude=37.5665&longitude=126.978&current=temperature_2m,relative_humidity_2m,weather_code&timezone=Asia/Seoul'
      )
      const data = await response.json()
      setWeather(data.current)
    } catch (error) {
      console.error('Weather fetch error:', error)
    }
    setLoading(false)
  }

  const fetchJoke = async () => {
    setLoading(true)
    try {
      const response = await fetch('https://official-joke-api.appspot.com/random_joke')
      const data = await response.json()
      setJoke(data)
    } catch (error) {
      console.error('Joke fetch error:', error)
    }
    setLoading(false)
  }

  const fetchQuote = async () => {
    setLoading(true)
    try {
      const response = await fetch('https://dummyjson.com/quotes/random')
      const data = await response.json()
      setQuote(data)
    } catch (error) {
      console.error('Quote fetch error:', error)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (activeApi === 'weather') fetchWeather()
    else if (activeApi === 'joke') fetchJoke()
    else if (activeApi === 'quote') fetchQuote()
  }, [activeApi])

  const getWeatherIcon = (code) => {
    const icons = {
      0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️',
      45: '🌫️', 48: '🌫️', 51: '🌦️', 53: '🌦️',
      55: '🌧️', 61: '🌧️', 63: '🌧️', 65: '🌧️',
      71: '🌨️', 73: '🌨️', 75: '🌨️', 80: '🌧️',
      95: '⛈️', 96: '⛈️', 99: '⛈️'
    }
    return icons[code] || '🌡️'
  }

  return (
    <div className="api-page">
      <div className="page-header">
        <h2>API 허브</h2>
      </div>

      <div className="api-tabs">
        {apis.map((api) => (
          <button
            key={api.id}
            className={`api-tab ${activeApi === api.id ? 'active' : ''}`}
            onClick={() => setActiveApi(api.id)}
          >
            <api.icon size={18} />
            {api.name}
          </button>
        ))}
      </div>

      <div className="api-content">
        {activeApi === 'weather' && (
          <div className="api-card">
            <div className="api-card-header">
              <h3>서울 날씨</h3>
              <button className="btn-icon" onClick={fetchWeather}>
                <HiOutlineRefresh size={18} />
              </button>
            </div>
            {loading ? (
              <div className="loading">로딩 중...</div>
            ) : weather ? (
              <div className="weather-display">
                <div className="weather-icon">
                  {getWeatherIcon(weather.weather_code)}
                </div>
                <div className="weather-info">
                  <div className="temperature">{weather.temperature_2m}°C</div>
                  <div className="humidity">습도: {weather.relative_humidity_2m}%</div>
                </div>
              </div>
            ) : (
              <div className="error">날씨 정보를 불러올 수 없습니다.</div>
            )}
            <p className="api-source">출처: Open-Meteo API (무료, API 키 불필요)</p>
          </div>
        )}

        {activeApi === 'joke' && (
          <div className="api-card">
            <div className="api-card-header">
              <h3>랜덤 유머</h3>
              <button className="btn-icon" onClick={fetchJoke}>
                <HiOutlineRefresh size={18} />
              </button>
            </div>
            {loading ? (
              <div className="loading">로딩 중...</div>
            ) : joke ? (
              <div className="joke-display">
                <p className="joke-setup">{joke.setup}</p>
                <p className="joke-punchline">→ {joke.punchline}</p>
              </div>
            ) : (
              <div className="error">유머를 불러올 수 없습니다.</div>
            )}
            <p className="api-source">출처: Official Joke API (무료)</p>
          </div>
        )}

        {activeApi === 'quote' && (
          <div className="api-card">
            <div className="api-card-header">
              <h3>랜덤 명언</h3>
              <button className="btn-icon" onClick={fetchQuote}>
                <HiOutlineRefresh size={18} />
              </button>
            </div>
            {loading ? (
              <div className="loading">로딩 중...</div>
            ) : quote ? (
              <div className="quote-display">
                <p className="quote-text">"{quote.quote}"</p>
                <p className="quote-author">— {quote.author}</p>
              </div>
            ) : (
              <div className="error">명언을 불러올 수 없습니다.</div>
            )}
            <p className="api-source">출처: DummyJSON (무료)</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ApiHub
