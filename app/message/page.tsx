import {getAllMessages} from "@/action"
export default async function MessagePage() {
    const messages = await getAllMessages();  // Récupération
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Liste des Messages</h1>
            <ol className="list-decimal list-inside font-[family-name:var(--font-geist-sans)]">
                {messages.map((mes) => (
                  <li key={mes.id} className="mb-2">
                    {mes.message}
                  </li>
                ))}
            </ol>
    </main>
  )
}
