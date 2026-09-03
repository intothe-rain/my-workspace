import Sidebar from './Sidebar'

function Layout({ children }) {
  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <header className="top-bar">
          <h1>My Workspace</h1>
          <div className="user-info">
            <span className="user-avatar">U</span>
            <span className="user-name">User</span>
          </div>
        </header>
        <div className="content-area">
          {children}
        </div>
      </main>
    </div>
  )
}

export default Layout
