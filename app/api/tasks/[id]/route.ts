import { init } from '@instantdb/admin';
import schema from '../../../../instant.schema';

const db = init({
  appId: process.env.NEXT_PUBLIC_INSTANT_APP_ID!,
  adminToken: process.env.INSTANT_APP_ADMIN_TOKEN!,
  schema,
});

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const data = await db.query({ tasks: { $: { where: { id: params.id } } } });
  if (data.tasks.length === 0) return Response.json({ error: 'Not found' }, { status: 404 });
  return Response.json(data.tasks[0]);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { title, description, done } = await request.json();
  await db.transact(
    db.tx.tasks[params.id].update({
      title,
      description,
      done,
    })
  );
  const data = await db.query({ tasks: { $: { where: { id: params.id } } } });
  return Response.json(data.tasks[0]);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await db.transact(db.tx.tasks[params.id].delete());
  return Response.json({ success: true });
}