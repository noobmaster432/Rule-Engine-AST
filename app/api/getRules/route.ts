import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('ruleEngine');
    const rules = await db.collection('rules').find({}).project({ name: 1 }).toArray();

    return new Response(JSON.stringify({ success: true, rules }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: 'Error fetching rules' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
