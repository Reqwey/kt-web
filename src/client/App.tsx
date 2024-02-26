import { MemoryRouter as Router, Routes, Route } from "react-router-dom";
import { CssVarsProvider as JoyCssVarsProvider } from "@mui/joy/styles";
import { CssBaseline } from "@mui/joy";
import {
  experimental_extendTheme as materialExtendTheme,
  Experimental_CssVarsProvider as MaterialCssVarsProvider,
  THEME_ID as MATERIAL_THEME_ID,
} from "@mui/material/styles";

import customTheme from "./theme";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";

import "./App.css";

const materialTheme = materialExtendTheme();

export default function App() {
  return (
    <MaterialCssVarsProvider theme={{ [MATERIAL_THEME_ID]: materialTheme }}>
      <JoyCssVarsProvider disableTransitionOnChange theme={customTheme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/courses" element={<Courses />} />
          </Routes>
        </Router>
      </JoyCssVarsProvider>
    </MaterialCssVarsProvider>
  );
}
