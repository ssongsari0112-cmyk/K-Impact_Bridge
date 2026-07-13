"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/layout/AuthShell";
import { Field } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { useProjectStore } from "@/lib/store/useProjectStore";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 4;

export default function LoginPage() {
  const router = useRouter();
  const login = useProjectStore((state) => state.login);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (!EMAIL_PATTERN.test(email)) {
      setError("이메일 형식이 올바르지 않습니다. 예: you@company.com");
      return;
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`비밀번호는 ${MIN_PASSWORD_LENGTH}자 이상 입력해주세요.`);
      return;
    }

    const result = login(email, password);
    if (!result.ok) {
      setError(result.error ?? "로그인에 실패했습니다.");
      return;
    }

    setError(null);
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
        <Field label="비밀번호" type="password" name="password" placeholder="4자 이상" required />
        {error && <p className="text-sm font-medium text-red">{error}</p>}
        <Button type="submit" className="mt-1 justify-center">
          로그인
        </Button>
      </form>
    </AuthShell>
  );
}
