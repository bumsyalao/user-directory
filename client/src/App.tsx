import { BrowserRouter, Route, Routes } from "react-router-dom";
import { UserDirectoryPage } from "./pages/UserDirectoryPage";

/** Application routes. */
export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserDirectoryPage />} />
      </Routes>
    </BrowserRouter>
  );
}
