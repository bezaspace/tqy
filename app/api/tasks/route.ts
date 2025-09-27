import { init, id } from '@instantdb/admin';
import schema from '../../../instant.schema';

const db = init({
  appId: process.env.NEXT_PUBLIC_INSTANT_APP_ID!,
  adminToken: process.env.INSTANT_APP_ADMIN_TOKEN!,
  schema,
});

export async function GET() {
  const data = await db.query({ tasks: {} });
  return Response.json(data.tasks);
}

export async function POST(request: Request) {
  const { title, description, date, startTime, endTime } = await request.json();
  const taskId = id();
  await db.transact(
    db.tx.tasks[taskId].update({
      title,
      description: description || "",
      date: new Date(date),
      startTime: startTime || null,
      endTime: endTime || null,
      done: false,
      createdAt: new Date(),
    })
  );
  const data = await db.query({ tasks: { $: { where: { id: taskId } } } });
  return Response.json(data.tasks[0]);
}