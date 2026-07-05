import Link from "next/link";
import { AuthShell } from "@/components/layout/AuthShell";
import { Field } from "@/components/ui/Field";

export default function SignupPage() {
  return (
    <AuthShell
      title="회원가입"
      subtitle="기업 또는 NGO 계정을 생성하세요."
      footer={
        <>
          이미 계정이 있으신가요?{" "}
          <Link href="/login" className="font-medium underline">
            로그인
          </Link>
        </>
      }
    >
      <form className="flex flex-col gap-4">
        <Field label="조직명" type="text" name="organizationName" placeholder="AquaSense AI" required />
        <Field label="이메일" type="email" name="email" placeholder="you@company.com" required />
        <Field label="비밀번호" type="password" name="password" required />
        <button
          type="submit"
          className="mt-2 rounded-full bg-foreground px-4 py-2.5 text-sm font-medium text-background hover:opacity-90"
        >
          가입하기
        </button>
      </form>
    </AuthShell>
  );
}
