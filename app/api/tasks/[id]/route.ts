import { init } from '@instantdb/admin';
import schema from '../../../../instant.schema';

const db = init({
  appId: process.env.NEXT_PUBLIC_INSTANT_APP_ID!,
  adminToken: process.env.INSTANT_APP_ADMIN_TOKEN!,
  schema,
});

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await db.query({ tasks: { $: { where: { id } } } });
  if (data.tasks.length === 0) return Response.json({ error: 'Not found' }, { status: 404 });
  return Response.json(data.tasks[0]);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { title, description, done, date, startTime, endTime } = await request.json();
  await db.transact(
    db.tx.tasks[id].update({
      title,
      description,
      date: date ? new Date(date) : undefined,
      startTime: startTime || null,
      endTime: endTime || null,
      done,
    })
  );
  const data = await db.query({ tasks: { $: { where: { id } } } });
  return Response.json(data.tasks[0]);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await db.transact(db.tx.tasks[id].delete());
  return Response.json({ success: true });
}