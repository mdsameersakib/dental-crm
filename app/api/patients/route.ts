export async function GET() {
  return Response.json({
    resource: "patients",
    status: "scaffolded",
  });
}
