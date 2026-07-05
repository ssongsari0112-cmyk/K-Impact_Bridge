import Link from "next/link";
import { AuthShell } from "@/components/layout/AuthShell";
import { Field } from "@/components/ui/Field";

export default function LoginPage() {
  return (
    <AuthShell
      title="로그인"
      subtitle="기업/NGO 계정으로 로그인하세요."
      footer={
        <>
          아직 계정이 없으신가요?{" "}
          <Link href="/signup" className="font-medium underline">
            회원가입
          </Link>
        </>
      }
    >
      <form className="flex flex-col gap-4">
        <Field label="이메일" type="email" name="email" placeholder="you@company.com" required />
        <Field label="비밀번호" type="password" name="password" required />
        <button
          type="submit"
          className="mt-2 rounded-full bg-foreground px-4 py-2.5 text-sm font-medium text-background hover:opacity-90"
        >
          로그인
        </button>
      </form>
    </AuthShell>
  );
}
