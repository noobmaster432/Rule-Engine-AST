import clientPromise from '@/lib/mongodb';
import { evaluateRule } from '@/lib/ruleEngine';
import { ObjectId } from 'mongodb';

export async function POST(req) {
  try {
    const { ruleId, data } = await req.json();
    console.log("Received ruleId:", ruleId);

    const client = await clientPromise;
    const db = client.db('ruleEngine');

    // Convert string ruleId to ObjectId
    let objectId;
    try {
      objectId = new ObjectId(ruleId);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      console.log('Invalid ObjectId format');
      return new Response(JSON.stringify({ success: false, error: 'Invalid rule ID format' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const rule = await db.collection('rules').findOne({ _id: objectId });

    if (!rule) {
      console.log('Rule not found');
      return new Response(JSON.stringify({ success: false, error: 'Rule not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log('Rule found:', rule);

    const result = evaluateRule(rule.ast, data);

    return new Response(JSON.stringify({ success: true, result }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error evaluating rule:", error);
    return new Response(JSON.stringify({ success: false, error: 'Error evaluating rule' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}