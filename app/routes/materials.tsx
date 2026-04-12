import { Link } from "react-router";
import type { Route } from "./+types/materials";

type Material = {
  id: number;
  title: string;
};

export async function loader() {
  try {
    const res = await fetch("http://localhost:8000/api/materials", {
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status}`);
    }

    const data = await res.json();
    return Array.isArray(data.materials) ? data.materials : [];
  } catch (error) {
    console.log("error", error);
    return [];
  }
}

export default function Materials({ loaderData }: Route.ComponentProps) {
  console.log("data", loaderData);

  return (
    <div>
      {loaderData?.map((material: Material) => {
        return (
          <div key={material.id}>
            <Link to={`/materials/${material.id}`}>
              <h3>{material.title}</h3>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
