import { redirect, useActionData, type ActionFunctionArgs } from "react-router";
import { apiClient } from "~/services/api";
import type { Route } from "./+types/groups";
import type { Group, Method } from "~/types";
import { createGroup } from "~/services/groups";
import { ApiError } from "~/errors";
import { useActionToast } from "~/hooks/useActionToast";
import { commitSession, getSession } from "~/sessions";

export async function loader({ request }: Route.LoaderArgs) {
  const api = apiClient(request);
  const [groupsRes] = await Promise.all([api("/groups")]);
  const groups = await groupsRes.json();
  return { groups: Array.isArray(groups) ? groups : [] };
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const method = (formData.get("_method") as Method) ?? request.method;
  let response;

  const session = await getSession(request.headers.get("Cookie"));

  try {
    if (method === "POST") {
      response = await createGroup(request, formData);

      session.flash("toast", {
        success: response.success,
        message: response.message,
      });

      return redirect(`/groups/${response.data.id}/materials`, {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
    }

    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      console.log(error);
      return { success: false, message: error.message, action: error.action };
    }

    return {
      success: false,
      message: "Erro inesperado",
      action: "Tente novamente ou contate o suporte.",
      status: 500,
    };
  }
}

export default function Groups({ loaderData }: Route.ComponentProps) {
  return <GroupView groups={loaderData.groups} />;
}

export function GroupView({ groups }: { groups: Group[] }) {
  return <div></div>;
}
