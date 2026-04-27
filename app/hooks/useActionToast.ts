import { useEffect, useRef } from "react";
import { toast } from "sonner";
import type { Toast } from "~/types";

export function useActionToast(...dataSources: (Toast | undefined)[]) {
  const shown = useRef(new Set<string>());

  useEffect(
    () => {
      dataSources.forEach((data) => {
        if (!data?.message) return;

        const key = `${data.success}-${data.message}-${data.action}`;
        if (shown.current.has(key)) return;

        shown.current.add(key);

        if (data.success) toast.success(data.message);
        else toast.error(data.message, { description: data.action });
      });
    },
    dataSources.map((d) => d?.message),
  ); // eslint-disable-line react-hooks/exhaustive-deps
}
