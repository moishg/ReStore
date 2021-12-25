import { ThemeProvider } from "@emotion/react";
import { Container, createTheme, CssBaseline, Typography } from "@mui/material"; 
import Catalog from "../../features/catalog/Catalog"; 
import Header from "./Header";

function App() {    
  const [darkMode,setDarkMode]=useState(false);
  const paletteType=darkMode ? 'dark' : 'light'
  const theme=createTheme({
    palette:{
      mode:'dark'
    }

  })
  return (
    <>
    <ThemeProvider theme={theme} >
        <CssBaseline />
        <Header />
        <Container>
          <Catalog   />
        </Container>
      </ThemeProvider>
    </>
  );
}

export default App;
