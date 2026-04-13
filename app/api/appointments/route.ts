export async function GET() {
  return Response.json({
    resource: "appointments",
    status: "scaffolded",
  });
}
