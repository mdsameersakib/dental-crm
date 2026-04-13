export async function GET() {
  return Response.json({
    resource: "webhooks",
    status: "scaffolded",
  });
}
