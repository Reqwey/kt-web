import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CssVarsProvider as JoyCssVarsProvider } from "@mui/joy/styles";
import { CssBaseline } from "@mui/joy";

import customTheme from "./theme";

import { ErrorBoundary } from "react-error-boundary";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import TaskPaper from "./pages/TaskPaper";
import NotFound from "./pages/NotFound";
import Fallback from "./pages/Fallback";
import TaskResult from "./pages/TaskResult";
import { VideoPlayerProvider } from "./components/VideoPlayerProvider";

export default function App() {
  return (
    <ErrorBoundary FallbackComponent={Fallback}>
      <JoyCssVarsProvider disableTransitionOnChange theme={customTheme}>
        <CssBaseline />
        <VideoPlayerProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/paper/:paperId" element={<TaskPaper />} />
              <Route
                path="/task/:taskId/paper/:paperId"
                element={<TaskPaper />}
              />
              <Route path="/exercise/:exerciseId" element={<TaskResult />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </VideoPlayerProvider>
      </JoyCssVarsProvider>
    </ErrorBoundary>
  );
}
