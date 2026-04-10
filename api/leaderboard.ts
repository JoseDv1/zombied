import { createClient } from "@libsql/client";

// The client is configured via environment variables
// that you must set in Vercel and your local .env file.
const client = createClient({
  url: process.env.TURSO_DATABASE_URL || "",
  authToken: process.env.TURSO_AUTH_TOKEN || "",
});

export default async function handler(req: any, res: any) {
  // Configuración de CORS por si se necesita (Vercel ya lo rutea, pero es buena práctica)
  res.setHeader('Access-Control-Allow-Credentials', "true");
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Comprobar variables de entorno
  if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
      return res.status(500).json({ error: "No Database credentials configured" });
  }

  if (req.method === "GET") {
    try {
      const result = await client.execute(`
        SELECT id, name, score, created_at 
        FROM scores 
        ORDER BY score DESC 
        LIMIT 10
      `);
      return res.status(200).json(result.rows);
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  } else if (req.method === "POST") {
    try {
      const { name, score } = req.body || {};
      if (!name || typeof score !== 'number') {
        return res.status(400).json({ error: "Invalid request body" });
      }

      await client.execute({
        sql: `INSERT INTO scores (name, score) VALUES (?, ?)`,
        args: [name, score]
      });

      const result = await client.execute(`
        SELECT id, name, score, created_at 
        FROM scores 
        ORDER BY score DESC 
        LIMIT 10
      `);
      return res.status(200).json(result.rows);
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
