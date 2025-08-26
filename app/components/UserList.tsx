import { User } from "@/type";

type UserListProps = {
  users: User[];
  renderActions?: (user: User) => React.ReactNode;
};

const UserList = ({ users, renderActions }: UserListProps) => {
  return (
    <div>
      <ol className="list bg-base-100 rounded-box shadow-md mt-4">
        <li className="p-4 pb-2 text-2xl opacity-60 tracking-wide">
          Liste des utilisateurs
        </li>

        {users.map((user) => (
          <li
            key={user.id}
            className="list-row flex justify-between items-center gap-4 p-3 border-b"
          >
            {/* Infos utilisateur */}
            <div className="list-col-grow">
              <div className="font-medium">{user.email}</div>
              <div className="text-xs opacity-60">
                ID: {user.id}
              </div>
              <div className="text-xs">
                <span
                  className={`px-2 py-0.5 rounded ${
                    user.status ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
                  }`}
                >
                  {user.status ? "Actif" : "Inactif"}
                </span>
                <span className="ml-2 px-2 py-0.5 rounded bg-gray-200 text-gray-700">
                  {user.role}
                </span>
              </div>
            </div>

            {/* Actions (passées depuis page.tsx) */}
            <div className="flex gap-2">
              {renderActions && renderActions(user)}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default UserList;
