import type { Metadata } from "next";
import LoginForm from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Acceso al panel",
  robots: { index: false },
};

export default function LoginPage() {
  return (
    <main className="grid min-h-dvh place-items-center px-5 py-16">
      <LoginForm />
    </main>
  );
}
