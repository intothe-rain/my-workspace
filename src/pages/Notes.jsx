import { useState, useEffect } from 'react'
import {
  HiOutlinePlus,
  HiOutlineSearch,
  HiOutlineTrash,
  HiOutlinePencil,
  HiOutlineDocumentText
} from 'react-icons/hi'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const fallbackNotes = [
  {
    id: 1,
    title: '프로젝트 아이디어',
    content: '대시보드 앱을 만들어보자. 북마크, 메모, 할 일 기능을 포함해야 한다.',
    color: '#6366f1',
    pinned: true,
    created_at: '2024-01-15'
  },
]

const formatDate = (iso) => {
  if (!iso) return ''
  try {
    return new Date(iso).toISOString().split('T')[0]
  } catch {
    return iso
  }
}

function Notes() {
  const [notes, setNotes] = useState(fallbackNotes)
  const [searchTerm, setSearchTerm] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [editingNote, setEditingNote] = useState(null)
  const [newNote, setNewNote] = useState({ title: '', content: '', color: '#6366f1' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isSupabaseConfigured) return
    const fetchNotes = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false })
      if (!error && data) setNotes(data)
      setLoading(false)
    }
    fetchNotes()
  }, [])

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (note.content || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  const pinnedNotes = filteredNotes.filter(n => n.pinned)
  const regularNotes = filteredNotes.filter(n => !n.pinned)

  const handleAdd = async () => {
    if (!(newNote.title && newNote.content)) return
    const item = { ...newNote, pinned: false }
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('notes').insert(item).select()
      if (!error && data) setNotes([data[0], ...notes])
    } else {
      setNotes([{ id: Date.now(), ...item, created_at: new Date().toISOString() }, ...notes])
    }
    setNewNote({ title: '', content: '', color: '#6366f1' })
    setIsAdding(false)
  }

  const handleEdit = async () => {
    if (!editingNote) return
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('notes')
        .update({ title: editingNote.title, content: editingNote.content, color: editingNote.color })
        .eq('id', editingNote.id)
        .select()
      if (!error && data) setNotes(notes.map(n => n.id === editingNote.id ? data[0] : n))
    } else {
      setNotes(notes.map(n => n.id === editingNote.id ? editingNote : n))
    }
    setEditingNote(null)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('notes').delete().eq('id', id)
      if (!error) setNotes(notes.filter(n => n.id !== id))
    } else {
      setNotes(notes.filter(n => n.id !== id))
    }
  }

  const togglePin = async (id) => {
    const target = notes.find(n => n.id === id)
    if (!target) return
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('notes')
        .update({ pinned: !target.pinned })
        .eq('id', id)
        .select()
      if (!error && data) setNotes(notes.map(n => n.id === id ? data[0] : n))
    } else {
      setNotes(notes.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n))
    }
  }

  const renderNoteCard = (note, pinTitle) => (
    <div key={note.id} className="note-card" style={{ borderLeftColor: note.color }}>
      <div className="note-header">
        <HiOutlineDocumentText size={16} className="note-icon" />
        <span className="note-date">{formatDate(note.created_at)}</span>
      </div>
      <h4>{note.title}</h4>
      <p>{note.content}</p>
      <div className="note-actions">
        <button className="btn-icon" onClick={() => togglePin(note.id)} title={pinTitle}>
          📌
        </button>
        <button className="btn-icon" onClick={() => setEditingNote(note)} title="수정">
          <HiOutlinePencil size={14} />
        </button>
        <button className="btn-icon danger" onClick={() => handleDelete(note.id)} title="삭제">
          <HiOutlineTrash size={14} />
        </button>
      </div>
    </div>
  )

  return (
    <div className="notes-page">
      <div className="page-header">
        <h2>메모 {isSupabaseConfigured && <span className="cloud-badge">☁️ 동기화됨</span>}</h2>
        <button className="btn btn-primary" onClick={() => setIsAdding(true)}>
          <HiOutlinePlus size={18} />
          새 메모
        </button>
      </div>

      {(isAdding || editingNote) && (
        <div className="note-editor">
          <input
            type="text"
            placeholder="제목"
            value={editingNote ? editingNote.title : newNote.title}
            onChange={(e) => editingNote
              ? setEditingNote({ ...editingNote, title: e.target.value })
              : setNewNote({ ...newNote, title: e.target.value })
            }
          />
          <textarea
            placeholder="내용을 입력하세요..."
            rows={6}
            value={editingNote ? editingNote.content : newNote.content}
            onChange={(e) => editingNote
              ? setEditingNote({ ...editingNote, content: e.target.value })
              : setNewNote({ ...newNote, content: e.target.value })
            }
          />
          <div className="color-picker">
            {['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'].map(color => (
              <button
                key={color}
                className={`color-dot ${(editingNote ? editingNote.color : newNote.color) === color ? 'active' : ''}`}
                style={{ background: color }}
                onClick={() => editingNote
                  ? setEditingNote({ ...editingNote, color })
                  : setNewNote({ ...newNote, color })
                }
              />
            ))}
          </div>
          <div className="form-actions">
            <button className="btn btn-secondary" onClick={() => { setIsAdding(false); setEditingNote(null); }}>
              취소
            </button>
            <button className="btn btn-primary" onClick={editingNote ? handleEdit : handleAdd}>
              {editingNote ? '수정' : '추가'}
            </button>
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
      </div>

      {loading && <div className="loading">불러오는 중...</div>}

      {pinnedNotes.length > 0 && (
        <div className="notes-section">
          <h3>고정된 메모</h3>
          <div className="notes-grid">
            {pinnedNotes.map((note) => renderNoteCard(note, '고정 해제'))}
          </div>
        </div>
      )}

      <div className="notes-section">
        <h3>일반 메모</h3>
        <div className="notes-grid">
          {regularNotes.map((note) => renderNoteCard(note, '고정'))}
        </div>
      </div>
    </div>
  )
}

export default Notes
