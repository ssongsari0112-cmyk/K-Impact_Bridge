import { Alert } from "@/components/ui/Alert";

export function DemoBanner({ className }: { className?: string }) {
  return (
    <Alert kind="demo" title="데모 데이터 포함" className={className}>
      일부 결과는 실제 NGO DB가 아닌 샘플 데이터를 기반으로 생성되었습니다. 실제 협력 전 추가 검증이
      필요합니다.
    </Alert>
  );
}
