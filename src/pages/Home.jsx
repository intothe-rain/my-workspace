import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  HiOutlineBookmark,
  HiOutlineDocumentText,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineRefresh
} from 'react-icons/hi'

function Home() {
  const [time, setTime] = useState(new Date())
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const hour = time.getHours()
    if (hour < 12) setGreeting('좋은 아침이에요')
    else if (hour < 18) setGreeting('좋은 오후에요')
    else setGreeting('좋은 저녁이에요')
  }, [time])

  const formatDate = (date) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      weekday: 'long' 
    }
    return date.toLocaleDateString('ko-KR', options)
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString('ko-KR', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const quickLinks = [
    { name: 'GitHub', url: 'https://github.com', color: '#333' },
    { name: 'YouTube', url: 'https://youtube.com', color: '#FF0000' },
    { name: 'Gmail', url: 'https://mail.google.com', color: '#EA4335' },
    { name: 'Notion', url: 'https://notion.so', color: '#000' },
    { name: 'ChatGPT', url: 'https://chat.openai.com', color: '#10A37F' },
    { name: 'Figma', url: 'https://figma.com', color: '#F24E1E' },
  ]

  const memoSample = [
    { id: 1, title: '프로젝트 아이디어', preview: '대시보드 앱 만들기...', date: '오늘' },
    { id: 2, title: '할 일 정리', preview: 'API 연동 필요...', date: '어제' },
  ]

  return (
    <div className="home">
      <div className="welcome-section">
        <div className="time-display">
          <span className="greeting">{greeting}</span>
          <h1 className="current-time">{formatTime(time)}</h1>
          <span className="current-date">{formatDate(time)}</span>
        </div>
      </div>

      <div className="widget-grid">
        <div className="widget quick-links-widget">
          <div className="widget-header">
            <HiOutlineBookmark size={20} />
            <h3>바로가기</h3>
          </div>
          <div className="quick-links-grid">
            {quickLinks.map((link, index) => (
              <a 
                key={index} 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="quick-link-item"
              >
                <span className="link-dot" style={{ background: link.color }}></span>
                <span>{link.name}</span>
              </a>
            ))}
          </div>
          <Link to="/bookmarks" className="widget-footer">전체 보기</Link>
        </div>

        <div className="widget todo-widget">
          <div className="widget-header">
            <HiOutlineCheckCircle size={20} />
            <h3>오늘의 할 일</h3>
          </div>
          <div className="todo-preview">
            <div className="todo-item-preview">
              <span className="todo-checkbox"></span>
              <span>이메일 확인</span>
            </div>
            <div className="todo-item-preview">
              <span className="todo-checkbox checked"></span>
              <span className="done">출근 체크</span>
            </div>
            <div className="todo-item-preview">
              <span className="todo-checkbox"></span>
              <span>프로젝트 리뷰</span>
            </div>
          </div>
          <Link to="/todo" className="widget-footer">할 일 보기</Link>
        </div>

        <div className="widget memo-widget">
          <div className="widget-header">
            <HiOutlineDocumentText size={20} />
            <h3>최근 메모</h3>
          </div>
          <div className="memo-preview">
            {memoSample.map((memo) => (
              <div key={memo.id} className="memo-item-preview">
                <span className="memo-title">{memo.title}</span>
                <span className="memo-preview-text">{memo.preview}</span>
                <span className="memo-date">{memo.date}</span>
              </div>
            ))}
          </div>
          <Link to="/notes" className="widget-footer">메모 보기</Link>
        </div>

        <div className="widget clock-widget">
          <div className="widget-header">
            <HiOutlineClock size={20} />
            <h3>세계 시간</h3>
          </div>
          <div className="world-clock">
            <div className="clock-item">
              <span className="clock-city">서울</span>
              <span className="clock-time">
                {time.toLocaleTimeString('ko-KR', { timeZone: 'Asia/Seoul', hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div className="clock-item">
              <span className="clock-city">도쿄</span>
              <span className="clock-time">
                {time.toLocaleTimeString('ja-JP', { timeZone: 'Asia/Tokyo', hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div className="clock-item">
              <span className="clock-city">뉴욕</span>
              <span className="clock-time">
                {time.toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
