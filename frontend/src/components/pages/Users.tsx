import { useState } from "react";
import Div from "../atoms/Div";
import UserCreate from "../organism/UserCreate";
import UserTable from "../organism/UserTable";

export default function UsersPage() {
  const [statePage, setStatePage] = useState<'create' | 'edit' | 'view'>('view');
  const userId = 'user-1'

  const changeStatePage = (newState: 'create' | 'edit' | 'view') => {
    setStatePage(newState);
  };

  return (
    <Div>
      <h1 className="text-3xl font-bold mb-4 text-black">
        {
          statePage === 'create' ? 'Crear Usuario' :
            statePage === 'edit' ? 'Editar Usuario' :
              'Ver Usuario'
        }
      </h1>
      <div className="w-full" >
        <button
          onClick={() => changeStatePage(statePage === 'create' ? 'view' : statePage === 'edit' ? 'view' : 'create')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {statePage === 'create' ? 'Ver Usuarios' : statePage === 'edit' ? 'Volver a Ver Usuarios' : 'Crear Usuario'}
        </button>
      </div>
      {
        statePage === 'create' ? (
          <UserCreate />
        ) : statePage === 'edit' ? (
          <div className="p-4">
            <p className="text-gray-600 mb-4">
              Editando usuario con ID: {userId}
            </p>
          </div>
        ) : (
          <div className="p-4 text-black">
            <UserTable />
          </div>
        )
      }
    </Div>
  );
}