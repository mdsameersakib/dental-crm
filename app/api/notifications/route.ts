export async function GET() {
  return Response.json({
    resource: "notifications",
    status: "scaffolded",
  });
}
