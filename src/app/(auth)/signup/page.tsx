"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/layout/AuthShell";
import { Field } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { useProjectStore } from "@/lib/store/useProjectStore";

export default function SignupPage() {
  const router = useRouter();
  const login = useProjectStore((state) => state.login);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    login();
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
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <Field label="조직명" type="text" name="organizationName" placeholder="AquaSense AI" required />
        <Field label="이메일" type="email" name="email" placeholder="you@company.com" required />
        <Field label="비밀번호" type="password" name="password" required />
        <Button type="submit" className="mt-1 justify-center">
          가입하기
        </Button>
      </form>
    </AuthShell>
  );
}
