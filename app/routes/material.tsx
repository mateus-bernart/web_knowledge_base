import type { Route } from "./+types/material";

export async function loader({ params }: Route.LoaderArgs) {
  try {
    const res = await fetch(
      `http://localhost:8000/api/materials/${params.materialId}`,
      { headers: { Accept: "application/json" } },
    );

    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status}`);
    }

    const data = await res.json();
    return Array.isArray(data.materials) ? data.materials : [];
  } catch (error) {
    console.log("error", error);
    return;
  }
}

export default function Material({ loaderData }: Route.ComponentProps) {
  console.log("data", loaderData);

  return <h1>material</h1>;
}
