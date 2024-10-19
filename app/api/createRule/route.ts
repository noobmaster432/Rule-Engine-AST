import clientPromise from '@/lib/mongodb';
import { createRule } from '@/lib/ruleEngine';

export async function POST(req: Request) {
  try {
    const { name, ruleString } = await req.json(); // Parse the JSON body from the request
    const ast = createRule(ruleString);

    const client = await clientPromise;
    const db = client.db("ruleEngine");
    const result = await db.collection("rules").insertOne({ name, ast });

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
    console.log("the error is: ", error);
    return new Response(
      JSON.stringify({ success: false, error: "Error creating rule" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
