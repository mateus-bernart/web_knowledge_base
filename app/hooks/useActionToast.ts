// app/hooks/useActionToast.ts
import { useEffect } from "react";
import { toast } from "sonner";

type ToastData =
  | {
      success: boolean;
      message?: string;
      action?: string;
    }
  | undefined;

export function useActionToast(...dataSources: ToastData[]) {
  dataSources.forEach((data) => {
    useEffect(() => {
      if (!data) return;
      if (data.success) toast.success(data.message);
      else toast.error(data.message, { description: data.action });
    }, [data]);
  });
}
