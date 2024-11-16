import { Outlet } from "react-router-dom";
import { Suspense } from "react";

import Header from "./components/shared/Header";
import Footer from "./components/shared/Footer";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Suspense fallback={<div>Loading...</div>}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default App;
