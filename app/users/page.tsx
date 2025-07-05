import Wrapper from '../components/Wrapper'
import UserList from "../components/UserList"
import { getAllUsers } from "@/action"

const page = async () => {
    const users = await getAllUsers();   /* - Récupération des utilisateurs */
  return (
    
      <Wrapper >
          
              <div className="flex items-center justify-center flex-col py-10 w-full">
                  <div className="flex flex-col">
                      {/* Titre  */}
                      <div>
                          <h1 className="text-2xl md:text-4xl font-bold text-center">Prenez le contrôle de vos finances</h1>
                      </div>

                      <UserList users={users} />

                  </div>
              </div>
         
      </Wrapper>   
    
  )
}

export default page
