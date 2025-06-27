
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import ShortenerForm from './components/ShortenerForm.jsx';
import StatisticsPage from './components/StatisticsPage.jsx';
import RedirectHandler from './components/RedirectHandler.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>URL Shortener</Typography>
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" component={Link} to="/stats">Stats</Button>
        </Toolbar>
      </AppBar>

      <Routes>
        <Route path="/" element={<ShortenerForm />} />
        <Route path="/stats" element={<StatisticsPage />} />
        <Route path="/:shortcode" element={<RedirectHandler />} />
      </Routes>
    </BrowserRouter>
  );
}
