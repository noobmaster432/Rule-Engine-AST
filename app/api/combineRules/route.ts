import clientPromise from '@/lib/mongodb';
import { combineRules } from '@/lib/ruleEngine';

export async function POST(req: Request) {
  try {
    const { ruleIds } = await req.json(); // Parse the JSON body from the request

    const client = await clientPromise;
    const db = client.db("ruleEngine");
    const rules = await db
      .collection("rules")
      .find({ _id: { $in: ruleIds } })
      .toArray();

    const combinedAst = combineRules(rules.map((r) => JSON.stringify(r.ast)));

    const result = await db.collection("rules").insertOne({
      name: `Combined Rule ${Math.floor(Date.now() / 1000) % 60}`,
      ast: combinedAst,
    });

    return new Response(
      JSON.stringify({ success: true, id: result.insertedId }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error combining rules:", error); // Log the error for debugging
    return new Response(
      JSON.stringify({ success: false, error: "Error combining rules" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
