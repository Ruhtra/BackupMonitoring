import { MainScreen } from "./pages/MainScreen";
import { Route, Routes } from "react-router-dom";
import { Layout } from "./layouts/Layout";
import { ConfigScreen } from "./pages/ConfigScreen";

export function RouterSet() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<MainScreen />} />
        <Route path="config" element={<ConfigScreen />} />
      </Route>
    </Routes>
  );
}

export function App() {
  return <RouterSet />;
}
