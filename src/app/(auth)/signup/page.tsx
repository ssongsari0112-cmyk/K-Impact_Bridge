"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/layout/AuthShell";
import { Field } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { useProjectStore } from "@/lib/store/useProjectStore";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 4;

export default function SignupPage() {
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

    setError(null);
    login(email);
    router.push("/onboarding");
  }

  return (
    <AuthShell
      title="회원가입"
      subtitle="기업 또는 NGO 계정을 생성하세요."
      footer={
        <>
          이미 계정이 있으신가요?{" "}
          <Link href="/login" className="font-semibold text-bridge hover:text-harbor">
            로그인
          </Link>
        </>
      }
    >
      <Alert kind="demo" title="데모용 회원가입" className="mb-5">
        이메일 형식(예: you@company.com)과 4자 이상의 비밀번호만 입력하면 가입과 동시에
        로그인됩니다.
      </Alert>

      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <Field label="조직명" type="text" name="organizationName" placeholder="AquaSense AI" required />
        <Field label="이메일" type="email" name="email" placeholder="you@company.com" required />
        <Field label="비밀번호" type="password" name="password" placeholder="4자 이상" required />
        {error && <p className="text-sm font-medium text-red">{error}</p>}
        <Button type="submit" className="mt-1 justify-center">
          가입하기
        </Button>
      </form>
    </AuthShell>
  );
}
