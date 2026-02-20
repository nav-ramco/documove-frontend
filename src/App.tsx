import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage.tsx'
import LoginPage from './pages/LoginPage.tsx'
import RegisterPage from './pages/RegisterPage.tsx'
import DashboardLayout from './components/DashboardLayout.tsx'
import Dashboard from './pages/dashboard/Dashboard.tsx'
import Transactions from './pages/dashboard/Transactions.tsx'
import TransactionDetail from './pages/dashboard/TransactionDetail.tsx'
import Messages from './pages/dashboard/Messages.tsx'
import Documents from './pages/dashboard/Documents.tsx'
import Settings from './pages/dashboard/Settings.tsx'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="transactions/:id" element={<TransactionDetail />} />
          <Route path="messages" element={<Messages />} />
          <Route path="documents" element={<Documents />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  )
}
