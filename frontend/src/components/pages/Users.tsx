import Div from "../atoms/Div";
import UserTable from "../organism/UserTable";

export default function UsersPage() {
  return (
    <Div>
      {

        <div className="p-4 text-black">
          <UserTable />
        </div>

      }
    </Div>
  );
}