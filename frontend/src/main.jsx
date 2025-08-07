// frontend/src/main.jsx
import ReactDOM from 'react-dom/client';
import { StyledEngineProvider } from '@mui/material/styles';
import { ThemeProvider, CssBaseline, GlobalStyles } from '@mui/material';
import theme from './theme';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* enableCssLayer ile Tailwind katmanlarını override edelim */}
    <StyledEngineProvider enableCssLayer>
      {/* Katman sırasını base → components → mui → utilities olarak ayarla */}
      <GlobalStyles styles={`@layer base, components, mui, utilities;`} />

      <ThemeProvider theme={theme}>
        <CssBaseline />   {/* MUI tema arkaplanını ve global reset’i uygular */}
        <App />
      </ThemeProvider>
    </StyledEngineProvider>
  </React.StrictMode>
);
