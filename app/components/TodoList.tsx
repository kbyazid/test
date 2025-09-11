import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { Plus } from "lucide-react";

/* interface Todo {
  id: number;
  message: string | null;
  completed: boolean;
  createdAt: Date;
} */

export default async function TodoList() {
  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress
  const localuser = await prisma.user.findUnique({
          where: { email }
      })

      if (!localuser) {
          throw new Error('Utilisateur non trouvé')
      }

  if (!localuser?.id) {
    return null;
  }

  const todos = await prisma.test_connection.findMany({
    where: {
      userId: localuser.id,
      completed: false
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  if (todos.length === 0) {
    return (
/*      <div className="flex flex-col items-center justify-center mt-10">
        <h2 className="text-xl font-semibold text-gray-600 mb-2">Mes tâches</h2>
        <p className="text-gray-500">Aucune tâche en cours</p>
      </div> */
      <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <Plus className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-lg">Aucune tâche en cours</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Ajoutez votre première tâche pour commencer</p>
          </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center mt-10">
      <h1 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-700 sm:text-5xl md:text-6xl">
                            <span className="block">Mes tâches en cours</span>
                            {/* <span className="block text-indigo-600">vos finances</span> */}
      </h1>
{/*       <h2 className="text-xl font-semibold text-gray-800 mb-4">Mes tâches en cours</h2> */}
      <div className="w-full space-y-2">
        {todos.map((todo) => (
          <div key={todo.id} className="w-full bg-base p-3 rounded-lg shadow-sm border border-base-400  hover:shadow-xl hover:border-accent">
            <p className="text-base-800">{todo.message}</p>
            <p className="text-xs text-base-500 mt-1">
              {new Date(todo.createdAt).toLocaleDateString('fr-FR')}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}