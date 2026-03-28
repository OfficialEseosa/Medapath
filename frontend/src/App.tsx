import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import WelcomePage from './pages/WelcomePage';
import IntakePage from './pages/IntakePage';
import SymptomsPage from './pages/SymptomsPage';
import AnalysisPage from './pages/AnalysisPage';
import ResultsPage from './pages/ResultsPage';
import './App.css';

function App() {
  return (
    <div className="bg-background min-h-screen flex flex-col">
      <Header />
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/intake" element={<IntakePage />} />
        <Route path="/symptoms" element={<SymptomsPage />} />
        <Route path="/analysis" element={<AnalysisPage />} />
        <Route path="/results" element={<ResultsPage />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
