export async function GET() {
  return Response.json({
    resource: "documents",
    status: "scaffolded",
  });
}
