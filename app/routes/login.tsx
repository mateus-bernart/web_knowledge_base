import { redirect, type ActionFunctionArgs } from "react-router";

type ActionData = {
  error?: string;
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const res = await fetch("http://localhost:8000/api/login", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json", // 👈 add this
    },
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    return { error: "Credenciais inválidas" };
  }

  const data = await res.json();

  return redirect("/", {
    headers: { "Set-Cookie": `token=${data.token}; Path=/; HttpOnly` },
  });
}

export default async function Login({
  actionData,
}: {
  actionData: ActionData;
}) {
  return (
    // <form method="post">
    //   <div className="flex gap-5 flex-col items-center justify-center h-screen p-10">
    //     <h1>Login</h1>

    //     <input
    //       name="email"
    //       type="email"
    //       placeholder="Email"
    //       className="p-2 border-amber-500 border-2 bg-amber-50 placeholder-gray-400 rounded-lg"
    //     />
    //     <input
    //       name="password"
    //       type="password"
    //       placeholder="Senha"
    //       className="p-2 border-amber-500 border-2 bg-amber-50 placeholder-gray-400 rounded-lg"
    //     />
    //     {actionData?.error && <p>{actionData.error}</p>}
    //     <button
    //       type="submit"
    //       className="p-2  rounded-lg text-white bg-amber-400 hover:cursor-pointer"
    //     >
    //       Entrar
    //     </button>
    //   </div>
    // </form>
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-sm space-y-8 px-4">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 text-primary">
            <BookOpen className="h-8 w-8" />
            <span className="text-2xl font-bold">StudyBase</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Sign in to your knowledge base
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-primary hover:underline font-medium"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
