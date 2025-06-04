import { Link } from "react-router-dom";
import Div from "../atoms/Div";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <Div>
      <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50 p-6 text-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
          <h1 className="text-6xl font-bold text-blue-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Página no encontrada</h2>
          <p className="text-gray-600 mb-8">
            Lo sentimos, la página que estás buscando no existe o ha sido movida.
          </p>
          <Link
            to="/dashboard"
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors mx-auto w-max"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver al Dashboard
          </Link>
        </div>
      </div>
    </Div>
  );
}
