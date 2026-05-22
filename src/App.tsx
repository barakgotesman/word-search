import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import MainMenu from './components/screens/MainMenu';
import MyPuzzlesScreen from './components/screens/MyPuzzlesScreen';
import GameBoard from './components/screens/GameBoard';
import VictoryScreen from './components/screens/VictoryScreen';
import SettingsScreen from './components/screens/SettingsScreen';
import MusicButton from './components/ui/MusicButton';

export default function App() {
  return (
    <BrowserRouter>
      <GameProvider>
        <Routes>
          <Route path="/" element={<MainMenu />} />
          <Route path="/my-puzzles" element={<MyPuzzlesScreen />} />
          <Route path="/game" element={<GameBoard />} />
          <Route path="/victory" element={<VictoryScreen />} />
          <Route path="/settings" element={<SettingsScreen />} />
        </Routes>
        {/* Global music toggle — visible on every screen */}
        <MusicButton />
      </GameProvider>
    </BrowserRouter>
  );
}
