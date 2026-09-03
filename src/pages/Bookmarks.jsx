import { useState, useEffect } from 'react'
import {
  HiOutlinePlus,
  HiOutlineSearch,
  HiOutlineExternalLink,
  HiOutlineTrash
} from 'react-icons/hi'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const fallbackBookmarks = [
  { id: 1, name: 'GitHub', url: 'https://github.com', category: '개발', color: '#333' },
  { id: 2, name: 'YouTube', url: 'https://youtube.com', category: '미디어', color: '#FF0000' },
  { id: 3, name: 'Gmail', url: 'https://mail.google.com', category: '이메일', color: '#EA4335' },
  { id: 4, name: 'Notion', url: 'https://notion.so', category: '생산성', color: '#000' },
  { id: 5, name: 'ChatGPT', url: 'https://chat.openai.com', category: 'AI', color: '#10A37F' },
  { id: 6, name: 'Figma', url: 'https://figma.com', category: '디자인', color: '#F24E1E' },
]

function Bookmarks() {
  const [bookmarks, setBookmarks] = useState(fallbackBookmarks)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('전체')
  const [isAdding, setIsAdding] = useState(false)
  const [newBookmark, setNewBookmark] = useState({ name: '', url: '', category: '기타' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isSupabaseConfigured) return
    const fetchBookmarks = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .order('created_at', { ascending: false })
      if (!error && data) setBookmarks(data)
      setLoading(false)
    }
    fetchBookmarks()
  }, [])

  const categories = ['전체', ...new Set(bookmarks.map(b => b.category))]

  const filteredBookmarks = bookmarks.filter(bookmark => {
    const matchesSearch = bookmark.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === '전체' || bookmark.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleAdd = async () => {
    if (!(newBookmark.name && newBookmark.url)) return
    const item = {
      ...newBookmark,
      color: '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
    }
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('bookmarks').insert(item).select()
      if (!error && data) setBookmarks([data[0], ...bookmarks])
    } else {
      setBookmarks([{ id: Date.now(), ...item }, ...bookmarks])
    }
    setNewBookmark({ name: '', url: '', category: '기타' })
    setIsAdding(false)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('bookmarks').delete().eq('id', id)
      if (!error) setBookmarks(bookmarks.filter(b => b.id !== id))
    } else {
      setBookmarks(bookmarks.filter(b => b.id !== id))
    }
  }

  return (
    <div className="bookmarks-page">
      <div className="page-header">
        <h2>북마크 {isSupabaseConfigured && <span className="cloud-badge">☁️ 동기화됨</span>}</h2>
        <button className="btn btn-primary" onClick={() => setIsAdding(true)}>
          <HiOutlinePlus size={18} />
          추가
        </button>
      </div>

      {isAdding && (
        <div className="add-form">
          <input
            type="text"
            placeholder="이름"
            value={newBookmark.name}
            onChange={(e) => setNewBookmark({ ...newBookmark, name: e.target.value })}
          />
          <input
            type="url"
            placeholder="URL (https://...)"
            value={newBookmark.url}
            onChange={(e) => setNewBookmark({ ...newBookmark, url: e.target.value })}
          />
          <select
            value={newBookmark.category}
            onChange={(e) => setNewBookmark({ ...newBookmark, category: e.target.value })}
          >
            <option value="개발">개발</option>
            <option value="디자인">디자인</option>
            <option value="미디어">미디어</option>
            <option value="생산성">생산성</option>
            <option value="AI">AI</option>
            <option value="기타">기타</option>
          </select>
          <div className="form-actions">
            <button className="btn btn-secondary" onClick={() => setIsAdding(false)}>취소</button>
            <button className="btn btn-primary" onClick={handleAdd}>추가</button>
          </div>
        </div>
      )}

      <div className="filter-bar">
        <div className="search-box">
          <HiOutlineSearch className="search-icon" size={18} />
          <input
            type="text"
            placeholder="검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="category-tabs">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-tab ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {loading && <div className="loading">불러오는 중...</div>}

      <div className="bookmarks-grid">
        {filteredBookmarks.map((bookmark) => (
          <div key={bookmark.id} className="bookmark-card">
            <div className="bookmark-icon" style={{ background: bookmark.color }}>
              {bookmark.name.charAt(0)}
            </div>
            <div className="bookmark-info">
              <h4>{bookmark.name}</h4>
              <span className="bookmark-category">{bookmark.category}</span>
            </div>
            <div className="bookmark-actions">
              <a href={bookmark.url} target="_blank" rel="noopener noreferrer" className="btn-icon">
                <HiOutlineExternalLink size={16} />
              </a>
              <button className="btn-icon danger" onClick={() => handleDelete(bookmark.id)}>
                <HiOutlineTrash size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Bookmarks
