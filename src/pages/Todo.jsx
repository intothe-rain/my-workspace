import { useState, useEffect } from 'react'
import {
  HiOutlinePlus,
  HiOutlineCheck,
  HiOutlineTrash,
  HiOutlineCalendar
} from 'react-icons/hi'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const fallbackTodos = [
  { id: 1, text: '이메일 확인하기', completed: false, priority: 'high', due_date: '오늘' },
  { id: 2, text: '프로젝트 리뷰', completed: false, priority: 'medium', due_date: '오늘' },
]

const toDisplay = (todo) => ({ ...todo, date: todo.due_date || todo.date || '오늘' })

function Todo() {
  const [todos, setTodos] = useState(fallbackTodos.map(toDisplay))
  const [newTodo, setNewTodo] = useState('')
  const [filter, setFilter] = useState('all')
  const [priority, setPriority] = useState('medium')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isSupabaseConfigured) return
    const fetchTodos = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: false })
      if (!error && data) setTodos(data.map(toDisplay))
      setLoading(false)
    }
    fetchTodos()
  }, [])

  const addTodo = async () => {
    if (!newTodo.trim()) return
    const item = { text: newTodo, completed: false, priority, due_date: '오늘' }
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('todos').insert(item).select()
      if (!error && data) setTodos([toDisplay(data[0]), ...todos])
    } else {
      setTodos([toDisplay({ id: Date.now(), ...item }), ...todos])
    }
    setNewTodo('')
  }

  const toggleTodo = async (id) => {
    const target = todos.find(t => t.id === id)
    if (!target) return
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('todos')
        .update({ completed: !target.completed })
        .eq('id', id)
        .select()
      if (!error && data) setTodos(todos.map(t => t.id === id ? toDisplay(data[0]) : t))
    } else {
      setTodos(todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      ))
    }
  }

  const deleteTodo = async (id) => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('todos').delete().eq('id', id)
      if (!error) setTodos(todos.filter(todo => todo.id !== id))
    } else {
      setTodos(todos.filter(todo => todo.id !== id))
    }
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  const stats = {
    total: todos.length,
    active: todos.filter(t => !t.completed).length,
    completed: todos.filter(t => t.completed).length
  }

  return (
    <div className="todo-page">
      <div className="page-header">
        <h2>할 일 {isSupabaseConfigured && <span className="cloud-badge">☁️ 동기화됨</span>}</h2>
      </div>

      <div className="todo-stats">
        <div className="stat-box">
          <span className="stat-number">{stats.total}</span>
          <span className="stat-label">전체</span>
        </div>
        <div className="stat-box active">
          <span className="stat-number">{stats.active}</span>
          <span className="stat-label">진행 중</span>
        </div>
        <div className="stat-box completed">
          <span className="stat-number">{stats.completed}</span>
          <span className="stat-label">완료</span>
        </div>
      </div>

      <div className="add-todo-section">
        <input
          type="text"
          placeholder="새 할 일을 입력하세요..."
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
        />
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="high">높음</option>
          <option value="medium">보통</option>
          <option value="low">낮음</option>
        </select>
        <button className="btn btn-primary" onClick={addTodo}>
          <HiOutlinePlus size={18} />
          추가
        </button>
      </div>

      <div className="filter-tabs">
        <button
          className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          전체
        </button>
        <button
          className={`filter-tab ${filter === 'active' ? 'active' : ''}`}
          onClick={() => setFilter('active')}
        >
          진행 중
        </button>
        <button
          className={`filter-tab ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          완료
        </button>
      </div>

      {loading && <div className="loading">불러오는 중...</div>}

      <div className="todo-list">
        {filteredTodos.map((todo) => (
          <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
            <button
              className={`todo-checkbox ${todo.completed ? 'checked' : ''}`}
              onClick={() => toggleTodo(todo.id)}
            >
              {todo.completed && <HiOutlineCheck size={14} />}
            </button>
            <div className="todo-content">
              <span className="todo-text">{todo.text}</span>
              <div className="todo-meta">
                <span className={`priority-badge ${todo.priority}`}>
                  {todo.priority === 'high' ? '높음' : todo.priority === 'medium' ? '보통' : '낮음'}
                </span>
                <span className="todo-date">
                  <HiOutlineCalendar size={12} />
                  {todo.date}
                </span>
              </div>
            </div>
            <button className="btn-icon danger" onClick={() => deleteTodo(todo.id)}>
              <HiOutlineTrash size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Todo
