import './App.css'
import {SignUpPage} from './components/signup'
import {SignInPage} from './components/signin'
import {Todo} from './components/todo'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

function App() {


  return (
    <div className="App">
      <div className='navbar'>
        <h2>Todo App</h2>
      </div>
      <Router>
        <Routes>
          <Route path="/" element={<SignUpPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/todos" element={<Todo />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
