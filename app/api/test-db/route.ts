/* import { NextResponse } from 'next/server' */
import mysql from 'mysql2/promise'

export async function GET() {

    try {
        const connection = await mysql.createConnection({
            host: '91.204.209.8',       // ex: sql.ahlemkoubci.icu
            user: 'ahlemkou_verceld',       // ex: ahlemkoubci_user
            password: 'Pomaria121165',
            database: 'ahlemkou_tresorerie',
            port: 3306
        })
        const [rows] = await connection.query("SELECT 'connexion OK' AS test");
        return new Response(JSON.stringify(rows), { status: 200 });
    } catch (error) {
            const errorMessage = new Response(JSON.stringify({ error: error }), { status: 500 })
            return errorMessage;
    }
  

/*   const [rows] = await connection.execute('SELECT * FROM test_connection')
  return NextResponse.json(rows) */
}
