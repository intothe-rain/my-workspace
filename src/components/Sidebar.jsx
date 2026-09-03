import { NavLink } from 'react-router-dom'
import { 
  HiOutlineHome, 
  HiOutlineBookmark,
  HiOutlineDocumentText,
  HiOutlineCheckCircle,
  HiOutlineCalculator,
  HiOutlineGlobe,
  HiOutlineMenu,
  HiOutlineX
} from 'react-icons/hi'
import { useState } from 'react'

const menuItems = [
  { path: '/', label: '홈', icon: HiOutlineHome },
  { path: '/bookmarks', label: '북마크', icon: HiOutlineBookmark },
  { path: '/notes', label: '메모', icon: HiOutlineDocumentText },
  { path: '/todo', label: '할 일', icon: HiOutlineCheckCircle },
  { path: '/utilities', label: '유틸리티', icon: HiOutlineCalculator },
  { path: '/api', label: 'API', icon: HiOutlineGlobe },
]

function Sidebar() {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <h2 className="logo">{isOpen ? 'My Space' : 'M'}</h2>
        <button 
          className="menu-toggle"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <HiOutlineX size={20} /> : <HiOutlineMenu size={20} />}
        </button>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `nav-item ${isActive ? 'active' : ''}`
            }
          >
            <item.icon size={20} />
            {isOpen && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        {isOpen && <span className="version">v1.0.0</span>}
      </div>
    </aside>
  )
}

export default Sidebar
