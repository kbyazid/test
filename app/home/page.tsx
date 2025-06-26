import React from "react";
import mysql, { RowDataPacket } from "mysql2/promise";

type MessageRow = {
  message: string;
};

async function getMessageFromDB(): Promise<string> {
  const connection = await mysql.createConnection({
    host: '91.204.209.8',       // ex: sql.ahlemkoubci.icu
    user: 'ahlemkou_vercel',       // ex: ahlemkoubci_user
    password: 'Pomaria121165',
    database: 'ahlemkou_tresorerie',
    port: 3306
  });

  const [rows] = await connection.execute<RowDataPacket[] & MessageRow[]>(
    "SELECT message FROM test_connection LIMIT 1"
  );

  await connection.end();

  return rows.length > 0 ? rows[0].message : "Aucun message trouvé";
}

export default async function Home() {
  const message = await getMessageFromDB();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold text-center text-blue-600">{message}</h1>
    </main>
  );
}
