import { useState } from 'react'
import { HiOutlineLockClosed } from 'react-icons/hi'

const UNLOCK_KEY = 'ws-unlocked'

function PasswordGate({ children }) {
  const [unlocked, setUnlocked] = useState(
    () => sessionStorage.getItem(UNLOCK_KEY) === '1'
  )
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const sitePassword = import.meta.env.VITE_SITE_PASSWORD

  if (!sitePassword) {
    return (
      <div className="gate-screen">
        <div className="gate-card">
          <HiOutlineLockClosed size={32} />
          <h2>비밀번호가 설정되지 않았습니다</h2>
          <p>환경변수 VITE_SITE_PASSWORD를 설정해주세요.</p>
        </div>
      </div>
    )
  }

  if (unlocked) return children

  const handleSubmit = (e) => {
    e.preventDefault()
    if (password === sitePassword) {
      sessionStorage.setItem(UNLOCK_KEY, '1')
      setUnlocked(true)
      setError('')
    } else {
      setError('비밀번호가 틀렸습니다.')
      setPassword('')
    }
  }

  return (
    <div className="gate-screen">
      <form className="gate-card" onSubmit={handleSubmit}>
        <div className="gate-icon">
          <HiOutlineLockClosed size={28} />
        </div>
        <h2>My Workspace</h2>
        <p>비밀번호를 입력하세요</p>
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
        />
        {error && <span className="gate-error">{error}</span>}
        <button type="submit" className="btn btn-primary gate-btn">
          열기
        </button>
      </form>
    </div>
  )
}

export default PasswordGate
