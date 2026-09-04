import { useState, useEffect } from 'react'
import { 
  HiOutlineGlobe,
  HiOutlineRefresh,
  HiOutlineExternalLink,
  HiOutlineCloud,
  HiOutlineBookOpen,
  HiOutlineVolumeUp,
  HiOutlineTruck
} from 'react-icons/hi'

function ApiHub() {
  const [activeApi, setActiveApi] = useState('weather')
  const [weather, setWeather] = useState(null)
  const [joke, setJoke] = useState(null)
  const [quote, setQuote] = useState(null)
  const [word, setWord] = useState(null)
  const [traffic, setTraffic] = useState(null)
  const [tmType, setTmType] = useState('1')
  const [loading, setLoading] = useState(false)

  const apis = [
    { id: 'weather', name: '날씨', icon: HiOutlineCloud },
    { id: 'joke', name: '유머', icon: HiOutlineGlobe },
    { id: 'quote', name: '명언', icon: HiOutlineGlobe },
    { id: 'english', name: '오늘의 영어', icon: HiOutlineBookOpen },
    { id: 'traffic', name: '고속도로 교통량', icon: HiOutlineTruck },
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
    else if (activeApi === 'english') fetchWord()
    else if (activeApi === 'traffic') fetchTraffic(tmType)
  }, [activeApi])

  const fetchTraffic = async (type = tmType) => {
    setLoading(true)
    setTraffic(null)
    try {
      const response = await fetch(`/api/traffic?tmType=${type}`)
      const data = await response.json()
      if (data.code === 'SUCCESS') setTraffic(data)
    } catch (error) {
      console.error('Traffic fetch error:', error)
    }
    setLoading(false)
  }

  const handleTmTypeChange = (type) => {
    setTmType(type)
    fetchTraffic(type)
  }

  const getTrafficSummary = () => {
    if (!traffic?.trafficAll) return null
    const rows = traffic.trafficAll
    const sum = (filter) => rows.filter(filter).reduce((a, r) => a + Number(r.trafficAmout || 0), 0)
    const total = sum(() => true)
    const hipass = sum((r) => r.tcsName === 'hi-pass')
    const tcs = total - hipass
    const byCar = ['1', '2', '3', '4', '5', '6'].map((c) => ({
      car: `${c}종`,
      tcs: sum((r) => r.carType === c && r.tcsName === 'TCS'),
      hipass: sum((r) => r.carType === c && r.tcsName === 'hi-pass'),
    })).map((r) => ({ ...r, total: r.tcs + r.hipass }))
    const first = rows[0]
    return { total, hipass, tcs, byCar, sumDate: first?.sumDate, sumTm: first?.sumTm, tmName: first?.tmName }
  }

  const fetchWord = async () => {
    setLoading(true)
    setWord(null)
    try {
      // 랜덤 단어는 사전에 없는 경우가 많아 최대 5번 재시도
      for (let i = 0; i < 5; i++) {
        const wordRes = await fetch('https://random-word-api.herokuapp.com/word?number=1')
        const [randomWord] = await wordRes.json()
        const dictRes = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${randomWord}`)
        if (dictRes.ok) {
          const [entry] = await dictRes.json()
          setWord(entry)
          break
        }
      }
    } catch (error) {
      console.error('Word fetch error:', error)
    }
    setLoading(false)
  }

  const playAudio = () => {
    const audioUrl = word?.phonetics?.find(p => p.audio)?.audio
    if (audioUrl) new Audio(audioUrl).play()
  }

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

        {activeApi === 'english' && (
          <div className="api-card">
            <div className="api-card-header">
              <h3>오늘의 영어 단어</h3>
              <button className="btn-icon" onClick={fetchWord}>
                <HiOutlineRefresh size={18} />
              </button>
            </div>
            {loading ? (
              <div className="loading">단어 찾는 중...</div>
            ) : word ? (
              <div className="word-display">
                <div className="word-top">
                  <span className="word-text">{word.word}</span>
                  {word.phonetics?.find(p => p.audio) && (
                    <button className="btn-icon" onClick={playAudio} title="발음 듣기">
                      <HiOutlineVolumeUp size={20} />
                    </button>
                  )}
                </div>
                {word.phonetic && <p className="word-phonetic">{word.phonetic}</p>}
                {word.meanings?.slice(0, 2).map((meaning, i) => (
                  <div key={i} className="word-meaning">
                    <span className="word-pos">{meaning.partOfSpeech}</span>
                    <p className="word-definition">{meaning.definitions[0]?.definition}</p>
                    {meaning.definitions[0]?.example && (
                      <p className="word-example">"{meaning.definitions[0].example}"</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="error">단어를 불러올 수 없습니다. 새로고침을 눌러주세요.</div>
            )}
            <p className="api-source">출처: Random Word API + Free Dictionary API (무료, 키 불필요)</p>
          </div>
        )}

        {activeApi === 'traffic' && (
          <div className="api-card">
            <div className="api-card-header">
              <h3>고속도로 실시간 교통량</h3>
              <div className="traffic-controls">
                <select value={tmType} onChange={(e) => handleTmTypeChange(e.target.value)}>
                  <option value="1">1시간 단위</option>
                  <option value="2">15분 단위</option>
                  <option value="3">5분 단위</option>
                </select>
                <button className="btn-icon" onClick={() => fetchTraffic()}>
                  <HiOutlineRefresh size={18} />
                </button>
              </div>
            </div>
            {loading ? (
              <div className="loading">교통량 불러오는 중...</div>
            ) : (() => {
              const s = getTrafficSummary()
              if (!s) return <div className="error">교통량 정보를 불러올 수 없습니다.</div>
              return (
                <div className="traffic-display">
                  <p className="traffic-time">집계 기준: {s.sumDate} {s.sumTm}시 ({s.tmName})</p>
                  <div className="traffic-stats">
                    <div className="traffic-stat">
                      <span className="stat-num">{s.total.toLocaleString()}</span>
                      <span className="stat-lbl">총 통행량 (대)</span>
                    </div>
                    <div className="traffic-stat">
                      <span className="stat-num">{s.hipass.toLocaleString()}</span>
                      <span className="stat-lbl">하이패스 (대)</span>
                    </div>
                    <div className="traffic-stat">
                      <span className="stat-num">{s.tcs.toLocaleString()}</span>
                      <span className="stat-lbl">TCS (대)</span>
                    </div>
                  </div>
                  <table className="traffic-table">
                    <thead>
                      <tr>
                        <th>차종</th>
                        <th>TCS</th>
                        <th>하이패스</th>
                        <th>합계</th>
                      </tr>
                    </thead>
                    <tbody>
                      {s.byCar.map((row) => (
                        <tr key={row.car}>
                          <td>{row.car}</td>
                          <td>{row.tcs.toLocaleString()}</td>
                          <td>{row.hipass.toLocaleString()}</td>
                          <td className="traffic-total">{row.total.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            })()}
            <p className="api-source">출처: 한국도로공사 고속도로 공공데이터 (data.ex.co.kr)</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ApiHub
