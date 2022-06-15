import React, { lazy } from "react";
import {
	BrowserRouter as Router,
  Routes,
  Route,
  useRoutes,
} from "react-router-dom";
import { WrapRoutes } from "@/router/index";
// import HistoryRule from '@/router/history';
// import LayoutScreen from "@/components/Visualscreen/LayoutScreen";
// import MainLayout from "@/layouts/LayoutTemp";

// const Home = lazy(() => import("@/views/home/index"));
// const NotFound = lazy(() => import("@/views/error/index"));

// const supportsHistory = "pushState" in window.history;
// BrowserRouter as Router用 forceRefresh={!supportsHistory}  history={History}
const App: React.FC<any> = (): JSX.Element => {
	return (
		// <BrowserRouter forceRefresh={!supportsHistory}>
    <Router>
      <WrapRoutes/>
    </Router>
  //   <Routes>
  //   <Route path="/screenfull" element={<LayoutScreen />} />
  //   <Route path="/" element={<Navigate to="/views/home" replace />} />
  //   <Route path="/views/home" element={<Home />} />
  //   <Route path='/*' element={<Navigate to="/error" replace />} />
  // </Routes>
	);
};

export default App;
