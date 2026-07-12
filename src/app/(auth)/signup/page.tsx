"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Heart } from "lucide-react";
import { AuthShell } from "@/components/layout/AuthShell";
import { Field } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { useProjectStore } from "@/lib/store/useProjectStore";
import type { OrgType } from "@/lib/store/useProjectStore";
import { cn } from "@/lib/utils";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 4;

const ORG_TYPES: { value: OrgType; label: string; description: string; icon: typeof Building2 }[] = [
  { value: "company", label: "기업 회원", description: "기업 · 스타트업 · 사회적기업", icon: Building2 },
  { value: "ngo", label: "NGO 회원", description: "NGO · 국제개발협력 수행기관", icon: Heart },
];

export default function SignupPage() {
  const router = useRouter();
  const login = useProjectStore((state) => state.login);
  const [orgType, setOrgType] = useState<OrgType>("company");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const organizationName = String(formData.get("organizationName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (!organizationName) {
      setError(`${orgType === "ngo" ? "기관명" : "조직명"}을 입력해주세요.`);
      return;
    }
    if (!EMAIL_PATTERN.test(email)) {
      setError("이메일 형식이 올바르지 않습니다. 예: you@company.com");
      return;
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`비밀번호는 ${MIN_PASSWORD_LENGTH}자 이상 입력해주세요.`);
      return;
    }

    setError(null);
    login(email, orgType);
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
        <div>
          <p className="mb-2 text-sm font-semibold text-ink">
            회원 유형<span className="ml-0.5 text-red">*</span>
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            {ORG_TYPES.map((type) => {
              const Icon = type.icon;
              const isActive = orgType === type.value;
              return (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setOrgType(type.value)}
                  aria-pressed={isActive}
                  className={cn(
                    "flex flex-col items-start gap-1.5 rounded-card border p-3 text-left transition-colors",
                    isActive
                      ? "border-bridge bg-bridge-soft"
                      : "border-line bg-white hover:border-bridge/50"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full",
                      isActive ? "bg-bridge text-white" : "bg-mist text-ink-soft"
                    )}
                  >
                    <Icon size={16} />
                  </span>
                  <span className="text-sm font-semibold text-ink">{type.label}</span>
                  <span className="text-xs leading-snug text-ink-soft">{type.description}</span>
                </button>
              );
            })}
          </div>
        </div>

        <Field
          label={orgType === "ngo" ? "기관명" : "조직명"}
          type="text"
          name="organizationName"
          required
        />
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
