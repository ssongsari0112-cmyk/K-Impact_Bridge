import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import WorldMap from "@/components/landing/WorldMap";

export default function MapPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-ink">
      <Header />
      <main className="flex-1 bg-mist px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium text-bridge">국가별 사업 기회 지도</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-harbor sm:text-4xl">
              한국의 기술이 필요한 국가를 지도에서 확인하세요
            </h1>
            <p className="mt-4 text-ink-soft">
              국가를 클릭하면 매칭되는 기술과 기업, 추천 파트너를 바로 볼 수 있습니다.
            </p>
          </div>

          <div className="mt-14">
            <WorldMap />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
