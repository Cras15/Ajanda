import { CssBaseline } from '@mui/joy'
import { Route, Routes } from 'react-router-dom'
import CustomSnackbar from './components/CustomSnackbar'
import ContactAdd from './pages/ContactAdd'
import ContactList from './pages/ContactList'
import DateAdd from './pages/DateAdd'
import DateList from './pages/DateList'
import HomePage from './pages/HomePage'
import Root from './pages/Root'
import SettingsPage from './pages/SettingsPage'

function App() {
  return (
    <div>
      <CssBaseline />
      <CustomSnackbar />
      <Routes>
        <Route path='/' element={<Root />}>
          <Route index element={<HomePage />} />
          <Route path="/date/list" element={<DateList />} />
          <Route path="/date/add" element={<DateAdd />} />
          <Route path="/contact/add" element={<ContactAdd />} />
          <Route path="/contact/list" element={<ContactList />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
