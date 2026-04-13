export async function GET() {
  return Response.json({
    resource: "treatments",
    status: "scaffolded",
  });
}
