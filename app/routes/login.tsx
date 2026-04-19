import { BookOpen } from "lucide-react";
import { Link, redirect, type ActionFunctionArgs } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { loginUser } from "~/services/auth";

type ActionData = {
  error?: string;
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const userLoginResponse = await loginUser(email, password);

  if (userLoginResponse.error) {
    return { error: userLoginResponse.error };
  }

  return redirect("/", {
    headers: {
      "Set-Cookie": `token=${userLoginResponse.token}; Path=/; HttpOnly`,
    },
  });
}

export default function Login({ actionData }: { actionData: ActionData }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-sm space-y-8 px-4">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 text-primary">
            <BookOpen className="h-8 w-8" />
            <span className="text-2xl font-bold">Base de conhecimento</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Entre na base do conhecimento logosófico.
          </p>
        </div>

        <form method="post" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="voce@exemplo.com"
              name="email"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              name="password"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Entrar
          </Button>
          {actionData?.error && (
            <p className="text-sm text-red-400">{actionData.error}</p>
          )}
        </form>

        {/* <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-primary hover:underline font-medium"
          >
            Sign up
          </Link>
        </p> */}
      </div>
    </div>
  );
}
