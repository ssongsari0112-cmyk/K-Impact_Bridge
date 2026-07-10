"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/layout/AuthShell";
import { Field } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { useProjectStore } from "@/lib/store/useProjectStore";

export default function LoginPage() {
  const router = useRouter();
  const login = useProjectStore((state) => state.login);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    login();
    router.push("/dashboard");
  }

  return (
    <AuthShell
      title="로그인"
      subtitle="기업/NGO 계정으로 로그인하세요."
      footer={
        <>
          아직 계정이 없으신가요?{" "}
          <Link href="/signup" className="font-semibold text-bridge hover:text-harbor">
            회원가입
          </Link>
        </>
      }
    >
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <Field label="이메일" type="email" name="email" placeholder="you@company.com" required />
        <Field label="비밀번호" type="password" name="password" required />
        <Button type="submit" className="mt-1 justify-center">
          로그인
        </Button>
      </form>
    </AuthShell>
  );
}
