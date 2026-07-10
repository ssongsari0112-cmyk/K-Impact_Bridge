import { Document, Page, Text, View, StyleSheet, renderToBuffer } from "@react-pdf/renderer";
import type { Project } from "@/lib/types";

const COLOR = {
  harbor: "#123A66",
  bridge: "#3794FF",
  ink: "#16242F",
  inkSoft: "#5B6B78",
  line: "#E1E8EE",
  mist: "#F5F7F9",
};

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10.5, color: COLOR.ink, fontFamily: "Helvetica" },
  coverBar: { height: 6, backgroundColor: COLOR.bridge, marginBottom: 24 },
  coverTitle: { fontSize: 22, fontWeight: 700, color: COLOR.harbor, marginBottom: 8 },
  coverSubtitle: { fontSize: 11, color: COLOR.inkSoft, marginBottom: 4 },
  demoNotice: {
    marginTop: 16,
    padding: 8,
    backgroundColor: "#FBF1DF",
    color: "#6B4E17",
    fontSize: 9,
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: COLOR.harbor,
    marginTop: 18,
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: COLOR.line,
    paddingBottom: 4,
  },
  paragraph: { fontSize: 10, lineHeight: 1.6, color: COLOR.ink, marginBottom: 4 },
  row: { flexDirection: "row", marginBottom: 3 },
  rowLabel: { width: 130, fontSize: 9.5, fontWeight: 700, color: COLOR.inkSoft },
  rowValue: { flex: 1, fontSize: 9.5, color: COLOR.ink },
  referenceItem: { fontSize: 9, color: COLOR.inkSoft, marginBottom: 3 },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 40,
    right: 40,
    fontSize: 8,
    color: COLOR.inkSoft,
    textAlign: "center",
  },
});

export async function renderStrategyPdf(project: Project): Promise<Buffer> {
  const report = project.strategyReport;

  return renderToBuffer(
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.coverBar} />
        <Text style={styles.coverTitle}>{project.title}</Text>
        <Text style={styles.coverSubtitle}>K-Impact Bridge · 전략 리포트</Text>
        <Text style={styles.coverSubtitle}>
          생성일 {report ? new Date(report.generatedAt).toLocaleDateString("ko-KR") : "-"}
        </Text>
        {project.citations.some((c) => c.isDemo) && (
          <Text style={styles.demoNotice}>
            이 리포트에는 일부 데모 데이터가 포함되어 있습니다. 실제 협력 전 추가 검증이 필요합니다.
          </Text>
        )}

        {report ? (
          <>
            <Text style={styles.sectionTitle}>1. Executive Summary</Text>
            <Text style={styles.paragraph}>{report.executiveSummary}</Text>

            <Text style={styles.sectionTitle}>2. 기술 분석</Text>
            <Text style={styles.paragraph}>{report.techAnalysis}</Text>

            <Text style={styles.sectionTitle}>3. 국가 상세</Text>
            <Text style={styles.paragraph}>{report.countryDetail}</Text>

            <Text style={styles.sectionTitle}>4. 파트너 상세</Text>
            <Text style={styles.paragraph}>{report.partnerDetail}</Text>

            <Text style={styles.sectionTitle}>5. Value Chain</Text>
            {report.valueChain.map((row) => (
              <View key={row.actor} style={styles.row}>
                <Text style={styles.rowLabel}>{row.actor}</Text>
                <Text style={styles.rowValue}>{row.role}</Text>
              </View>
            ))}

            <Text style={styles.sectionTitle}>6. 기대효과</Text>
            {report.expectedImpact.map((row) => (
              <View key={row.metric} style={styles.row}>
                <Text style={styles.rowLabel}>{row.metric}</Text>
                <Text style={styles.rowValue}>{row.value}</Text>
              </View>
            ))}

            <Text style={styles.sectionTitle}>7. 리스크 및 대응전략</Text>
            {report.risks.map((row) => (
              <View key={row.risk} style={styles.row}>
                <Text style={styles.rowLabel}>
                  {row.risk} ({row.level})
                </Text>
                <Text style={styles.rowValue}>{row.mitigation}</Text>
              </View>
            ))}

            <Text style={styles.sectionTitle}>8. 실행 로드맵</Text>
            {report.roadmap.map((row) => (
              <View key={row.month} style={styles.row}>
                <Text style={styles.rowLabel}>{row.month}</Text>
                <Text style={styles.rowValue}>{row.milestone}</Text>
              </View>
            ))}

            <Text style={styles.sectionTitle}>9. 유사 사업 사례</Text>
            {report.similarProjects.map((item) => (
              <Text key={item.title} style={styles.paragraph}>
                {item.title} ({item.year}) — {item.citation.sourceName}
              </Text>
            ))}
          </>
        ) : (
          <Text style={styles.paragraph}>
            아직 전략 리포트가 생성되지 않았습니다. 워크스페이스에서 먼저 생성해주세요.
          </Text>
        )}

        <Text style={styles.sectionTitle}>References</Text>
        {project.citations.map((citation, index) => (
          <Text key={citation.id} style={styles.referenceItem}>
            [{index + 1}] {citation.sourceName}, {citation.title} — {citation.url}
            {citation.isDemo ? " (Demo)" : ""}
          </Text>
        ))}

        <Text style={styles.footer} fixed>
          K-Impact Bridge · 외교 공공데이터·AI 기반 국제개발협력 Strategy Copilot
        </Text>
      </Page>
    </Document>
  );
}
