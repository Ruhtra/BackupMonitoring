import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { MainScreen } from "./pages/MainScreen";
import { Layout } from "./layouts/Layout";
import { ConfigScreen } from "./pages/ConfigScreen";

export function RouterSet() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<MainScreen />} />
          <Route path="config" element={<ConfigScreen />} />
        </Route>
      </Routes>
    </Router>
  );
}

export function App() {
  return <RouterSet />;
}
