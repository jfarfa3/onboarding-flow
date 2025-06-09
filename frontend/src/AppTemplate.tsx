// Esta es una versión mejorada del App.tsx que incluye navegación al ejemplo de FilterTableExample
// Este archivo será utilizado por el script create-custom-project.sh

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomePage from "@/components/pages/HomePage";
import FilterTableExample from "./components/examples/FilterTableExample";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Router>
        <div className="min-h-screen bg-gray-50">
          <header className="bg-white shadow">
            <div className="container mx-auto px-4 py-4">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">APP_NAME_PLACEHOLDER</h1>
                <nav>
                  <ul className="flex space-x-6">
                    <li>
                      <Link to="/" className="text-blue-600 hover:text-blue-800">
                        Inicio
                      </Link>
                    </li>
                    <li>
                      <Link to="/examples/table" className="text-blue-600 hover:text-blue-800">
                        Ejemplo Tabla
                      </Link>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </header>
          <main className="container mx-auto px-4 py-6">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/examples/table" element={<FilterTableExample />} />
            </Routes>
          </main>
        </div>
      </Router>
    </>
  );
}

export default App;
