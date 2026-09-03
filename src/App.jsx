import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Bookmarks from './pages/Bookmarks'
import Notes from './pages/Notes'
import Todo from './pages/Todo'
import Utilities from './pages/Utilities'
import ApiHub from './pages/ApiHub'
import './styles/dashboard.css'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/todo" element={<Todo />} />
          <Route path="/utilities" element={<Utilities />} />
          <Route path="/api" element={<ApiHub />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
