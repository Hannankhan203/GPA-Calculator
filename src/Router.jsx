import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './components/Auth/Login'
import Signup from './components/Auth/Signup'

function Router() {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  </Router>
  )
}

export default Router;
