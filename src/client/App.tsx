import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CssVarsProvider as JoyCssVarsProvider } from "@mui/joy/styles";
import { CssBaseline, Typography } from "@mui/joy";

import customTheme from "./theme";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import { ErrorBoundary } from "react-error-boundary";

import "./App.css";
import { TaskPaper } from "./pages/TaskPaper";
import { SWRConfig } from "swr";
import { NotFound } from "./pages/NotFound";
import { Fallback } from "./pages/Fallback";

export default function App() {
  return (
    <ErrorBoundary FallbackComponent={Fallback}>
      <JoyCssVarsProvider disableTransitionOnChange theme={customTheme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/paper/:paperId" element={<TaskPaper />} />
            <Route
              path="/task/:taskId/paper/:paperId"
              element={<TaskPaper />}
            />
            <Route path="/courses" element={<Courses />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </JoyCssVarsProvider>
    </ErrorBoundary>
  );
}
