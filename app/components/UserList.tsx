import { User } from "@/type";

const UserList = ({ users }: { users: User[] }) => {
 
  return (
    <>
    {/* <div className="bg-gray-50 flex flex-col items-center justify-center mt-6">
      <h1 className="text-4xl font-bold mb-8 font-[family-name:var(--font-geist-sans)] text-[#333333]">
        Liste Users
      </h1>
      <ol className="list-decimal list-inside font-[family-name:var(--font-geist-sans)]">
        {users.map((user) => (
          <li key={user.id} className="mb-2">
            {user.email}
          </li>
        ))}
      </ol>
    </div> */}
      <div>
        <ol className="list bg-base-100 rounded-box shadow-md">

          <li className="p-4 pb-2 text-2xl opacity-60 tracking-wide">Liste des utilisateurs</li>
          {users.map((user) => (
            <li key={user.id} className="list-row">

              <div className="text-4xl font-thin opacity-30 tabular-nums">#</div>
              
{/*            <div>
                <img className="size-10 rounded-box" src="https://img.daisyui.com/images/profile/demo/1@94.webp" />
              </div> */}
              <div className="list-col-grow">
                <div>{user.email}</div>
                <div className="text-xs uppercase font-semibold opacity-60">{user.id}</div>
              </div>

{/*               <button className="btn btn-square btn-ghost">
                <svg className="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor"><path d="M6 3L20 12 6 21 6 3z"></path></g></svg>
              </button> */}
            </li>

          ))}



        </ol>
      </div>

    </>






  );
};
export default UserList;

