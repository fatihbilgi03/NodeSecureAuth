// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',                // açık tema modu
    primary: {
      main: '#e30613',
      contrastText: '#ffffff',    // birincil renkteki metin rengi
    },
    secondary: {
      main: '#161616',
      contrastText: '#ffffff',    // isteğe bağlı, kontrast için ekleyebilirsiniz
    },
    background: {
      default: '#f5f5f5',         // sayfa arka planı
      paper: '#ffffff',           // kağıt (card, modal vb.) arka planı
    },
  },
  shape: {
    borderRadius: 8,              // 8px köşe yuvarlama
  },
  // dilerseniz tipografi, boşluk (spacing) vb. ayarları da buraya ekleyebilirsiniz
});

export default theme;
