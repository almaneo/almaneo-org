/**
 * GAII Report PDF Document
 *
 * Uses @react-pdf/renderer to generate downloadable PDF report
 */

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';
import {
  GAII_REPORT_V1,
  type CountryRanking,
  type RegionReport,
  type KeyInsight,
  type PolicyRecommendation,
} from '../../data/gaii';

// Register fonts (using system fonts as fallback)
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'Helvetica' },
    { src: 'Helvetica-Bold', fontWeight: 'bold' },
  ],
});

// Styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 20,
    borderBottom: '2px solid #FF6B00',
    paddingBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0A0F1A',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 10,
  },
  metadata: {
    fontSize: 9,
    color: '#888888',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF6B00',
    marginBottom: 10,
    paddingBottom: 5,
    borderBottom: '1px solid #e0e0e0',
  },
  sectionSubtitle: {
    fontSize: 9,
    color: '#888888',
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 10,
    lineHeight: 1.5,
    color: '#333333',
    marginBottom: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  statCard: {
    width: '25%',
    padding: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0A0F1A',
  },
  statLabel: {
    fontSize: 8,
    color: '#666666',
  },
  table: {
    marginBottom: 15,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    padding: 6,
    borderBottom: '1px solid #e0e0e0',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 5,
    borderBottom: '1px solid #f0f0f0',
  },
  tableCell: {
    fontSize: 9,
  },
  tableCellRank: {
    width: '8%',
  },
  tableCellCountry: {
    width: '30%',
  },
  tableCellGaii: {
    width: '12%',
    textAlign: 'center',
  },
  tableCellGrade: {
    width: '12%',
    textAlign: 'center',
  },
  tableCellIndicator: {
    width: '10%',
    textAlign: 'center',
  },
  gradeBox: {
    padding: '2px 6px',
    borderRadius: 3,
    fontSize: 8,
  },
  gradeLow: {
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  gradeModerate: {
    backgroundColor: '#fff3cd',
    color: '#856404',
  },
  gradeHigh: {
    backgroundColor: '#ffe5d0',
    color: '#c44c00',
  },
  gradeCritical: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
  },
  insightCard: {
    marginBottom: 12,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderLeft: '3px solid #FF6B00',
  },
  insightTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0A0F1A',
    marginBottom: 5,
  },
  insightDescription: {
    fontSize: 9,
    color: '#444444',
    lineHeight: 1.4,
    marginBottom: 5,
  },
  recommendation: {
    fontSize: 9,
    color: '#155724',
    backgroundColor: '#d4edda',
    padding: 6,
    marginTop: 5,
  },
  regionCard: {
    width: '48%',
    marginBottom: 12,
    padding: 10,
    backgroundColor: '#f5f5f5',
    minHeight: 100,
  },
  regionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  regionName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0A0F1A',
    maxWidth: '70%',
  },
  regionScore: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF6B00',
  },
  regionMeta: {
    fontSize: 8,
    color: '#888888',
    marginTop: 6,
    marginBottom: 4,
  },
  policyCard: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
  },
  priorityBadge: {
    padding: '2px 6px',
    borderRadius: 3,
    fontSize: 7,
    marginLeft: 5,
  },
  priorityHigh: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
  },
  priorityMedium: {
    backgroundColor: '#fff3cd',
    color: '#856404',
  },
  priorityLow: {
    backgroundColor: '#cce5ff',
    color: '#004085',
  },
  methodologyBox: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    marginBottom: 15,
  },
  formula: {
    fontSize: 11,
    fontFamily: 'Courier',
    backgroundColor: '#0A0F1A',
    color: '#00d4ff',
    padding: 10,
    marginBottom: 10,
  },
  weightBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  weightLabel: {
    width: '25%',
    fontSize: 9,
    color: '#666666',
  },
  weightBarFill: {
    height: 8,
    backgroundColor: '#FF6B00',
  },
  weightValue: {
    fontSize: 9,
    color: '#0A0F1A',
    marginLeft: 5,
  },
  sourceCard: {
    width: '48%',
    padding: 8,
    marginBottom: 8,
    backgroundColor: '#f5f5f5',
  },
  sourceName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0A0F1A',
  },
  sourceYear: {
    fontSize: 8,
    color: '#888888',
    marginBottom: 3,
  },
  sourceDesc: {
    fontSize: 8,
    color: '#666666',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 8,
    color: '#888888',
    borderTop: '1px solid #e0e0e0',
    paddingTop: 10,
  },
  pageNumber: {
    fontSize: 8,
    color: '#888888',
  },
});

// Helper function for grade styling
function getGradeStyle(grade: string) {
  switch (grade) {
    case 'Low':
      return styles.gradeLow;
    case 'Moderate':
      return styles.gradeModerate;
    case 'High':
      return styles.gradeHigh;
    case 'Critical':
      return styles.gradeCritical;
    default:
      return {};
  }
}

// Helper function for priority styling
function getPriorityStyle(priority: string) {
  switch (priority) {
    case 'high':
      return styles.priorityHigh;
    case 'medium':
      return styles.priorityMedium;
    case 'low':
      return styles.priorityLow;
    default:
      return {};
  }
}

// Cover Page
function CoverPage() {
  const { metadata } = GAII_REPORT_V1;

  return (
    <Page size="A4" style={styles.page}>
      <View style={{ marginTop: 150, textAlign: 'center' }}>
        <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#FF6B00', marginBottom: 20 }}>
          GAII
        </Text>
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#0A0F1A', marginBottom: 15 }}>
          {metadata.title}
        </Text>
        <Text style={{ fontSize: 14, color: '#666666', marginBottom: 40 }}>
          {metadata.subtitle}
        </Text>
        <Text style={{ fontSize: 12, color: '#888888', marginBottom: 5 }}>
          Version {metadata.version}
        </Text>
        <Text style={{ fontSize: 12, color: '#888888', marginBottom: 40 }}>
          {metadata.publishDate}
        </Text>
        <Text style={{ fontSize: 14, color: '#FF6B00', marginBottom: 5 }}>
          {metadata.organization}
        </Text>
        <Text style={{ fontSize: 10, color: '#888888' }}>
          {metadata.website}
        </Text>
      </View>
      <View style={styles.footer}>
        <Text>AlmaNEO Foundation</Text>
        <Text>{metadata.website}</Text>
      </View>
    </Page>
  );
}

// Executive Summary Page
function ExecutiveSummaryPage() {
  const { executiveSummary } = GAII_REPORT_V1;
  const { globalStats, keyFindings } = executiveSummary;

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Executive Summary</Text>
        <Text style={styles.sectionSubtitle}>Key findings from the GAII Report v1.0</Text>

        {/* Global Stats */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{globalStats.globalGaii}</Text>
            <Text style={styles.statLabel}>Global GAII Score</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{globalStats.totalCountries}</Text>
            <Text style={styles.statLabel}>Countries Analyzed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{globalStats.totalPopulation}B</Text>
            <Text style={styles.statLabel}>Population Covered</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{globalStats.inequalityGap}%</Text>
            <Text style={styles.statLabel}>Inequality Gap</Text>
          </View>
        </View>

        {/* Key Findings */}
        <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 10, marginTop: 10 }}>
          Key Findings
        </Text>
        {keyFindings.map((finding, i) => (
          <View key={i} style={styles.insightCard}>
            <Text style={styles.insightTitle}>{finding.title}</Text>
            <Text style={styles.insightDescription}>{finding.description}</Text>
            {finding.stat && (
              <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#FF6B00' }}>
                {finding.stat}
              </Text>
            )}
          </View>
        ))}

        {/* Indicator Averages */}
        <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 10, marginTop: 15 }}>
          Global Average by Indicator
        </Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{globalStats.avgAccess}</Text>
            <Text style={styles.statLabel}>Access</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{globalStats.avgAffordability}</Text>
            <Text style={styles.statLabel}>Affordability</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{globalStats.avgLanguage}</Text>
            <Text style={styles.statLabel}>Language</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{globalStats.avgSkill}</Text>
            <Text style={styles.statLabel}>Skill</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Text>GAII Report v1.0 - Executive Summary</Text>
        <Text render={({ pageNumber }) => `Page ${pageNumber}`} />
      </View>
    </Page>
  );
}

// Country Rankings Page
function CountryRankingsPage({
  rankings,
  title,
  subtitle,
}: {
  rankings: CountryRanking[];
  title: string;
  subtitle: string;
}) {
  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.sectionSubtitle}>{subtitle}</Text>

        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, styles.tableCellRank, { fontWeight: 'bold' }]}>
              Rank
            </Text>
            <Text style={[styles.tableCell, styles.tableCellCountry, { fontWeight: 'bold' }]}>
              Country
            </Text>
            <Text style={[styles.tableCell, styles.tableCellGaii, { fontWeight: 'bold' }]}>
              GAII
            </Text>
            <Text style={[styles.tableCell, styles.tableCellGrade, { fontWeight: 'bold' }]}>
              Grade
            </Text>
            <Text style={[styles.tableCell, styles.tableCellIndicator, { fontWeight: 'bold' }]}>
              Access
            </Text>
            <Text style={[styles.tableCell, styles.tableCellIndicator, { fontWeight: 'bold' }]}>
              Afford.
            </Text>
            <Text style={[styles.tableCell, styles.tableCellIndicator, { fontWeight: 'bold' }]}>
              Lang.
            </Text>
            <Text style={[styles.tableCell, styles.tableCellIndicator, { fontWeight: 'bold' }]}>
              Skill
            </Text>
          </View>

          {/* Table Rows */}
          {rankings.map((item) => (
            <View key={item.country.iso3} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableCellRank]}>#{item.rank}</Text>
              <Text style={[styles.tableCell, styles.tableCellCountry]}>
                {item.country.name}
              </Text>
              <Text style={[styles.tableCell, styles.tableCellGaii, { fontWeight: 'bold' }]}>
                {item.country.gaii}
              </Text>
              <View style={[styles.tableCellGrade]}>
                <Text style={[styles.gradeBox, getGradeStyle(item.country.gaiiGrade)]}>
                  {item.country.gaiiGrade}
                </Text>
              </View>
              <Text style={[styles.tableCell, styles.tableCellIndicator]}>
                {item.country.indicators.access}
              </Text>
              <Text style={[styles.tableCell, styles.tableCellIndicator]}>
                {item.country.indicators.affordability}
              </Text>
              <Text style={[styles.tableCell, styles.tableCellIndicator]}>
                {item.country.indicators.language}
              </Text>
              <Text style={[styles.tableCell, styles.tableCellIndicator]}>
                {item.country.indicators.skill}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <Text>GAII Report v1.0 - Country Rankings</Text>
        <Text render={({ pageNumber }) => `Page ${pageNumber}`} />
      </View>
    </Page>
  );
}

// Regional Analysis Page
function RegionalAnalysisPage() {
  const { regionalAnalysis } = GAII_REPORT_V1;

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Regional Analysis</Text>
        <Text style={styles.sectionSubtitle}>GAII breakdown by world region</Text>

        <View style={styles.regionRow}>
          {regionalAnalysis.regions.map((region: RegionReport) => (
            <View key={region.code} style={styles.regionCard} wrap={false}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                <Text style={styles.regionName}>{region.name}</Text>
                <Text style={styles.regionScore}>{region.avgGaii}</Text>
              </View>
              <Text style={styles.regionMeta}>
                {region.countries} countries
              </Text>
              <Text style={{ fontSize: 8, color: '#444444', marginTop: 6, marginBottom: 6, lineHeight: 1.4 }}>
                {region.keyInsight}
              </Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
                <Text style={{ fontSize: 7, color: '#155724' }}>Best: {region.topPerformer}</Text>
                <Text style={{ fontSize: 7, color: '#721c24' }}>Worst: {region.bottomPerformer}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <Text>GAII Report v1.0 - Regional Analysis</Text>
        <Text render={({ pageNumber }) => `Page ${pageNumber}`} />
      </View>
    </Page>
  );
}

// Key Insights Page
function KeyInsightsPage() {
  const { keyInsights } = GAII_REPORT_V1;

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Key Insights</Text>
        <Text style={styles.sectionSubtitle}>Critical findings and observations</Text>

        {keyInsights.map((insight: KeyInsight, i: number) => (
          <View key={i} style={styles.insightCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
              <Text style={{ fontSize: 8, color: '#FF6B00', marginRight: 5 }}>
                [{insight.category.toUpperCase()}]
              </Text>
              <Text style={styles.insightTitle}>{insight.title}</Text>
            </View>
            <Text style={styles.insightDescription}>{insight.description}</Text>
            {insight.countries && insight.countries.length > 0 && (
              <Text style={{ fontSize: 8, color: '#888888', marginBottom: 5 }}>
                Affected: {insight.countries.join(', ')}
              </Text>
            )}
            {insight.recommendation && (
              <Text style={styles.recommendation}>
                Recommendation: {insight.recommendation}
              </Text>
            )}
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <Text>GAII Report v1.0 - Key Insights</Text>
        <Text render={({ pageNumber }) => `Page ${pageNumber}`} />
      </View>
    </Page>
  );
}

// Policy Recommendations Page
function PolicyRecommendationsPage() {
  const { recommendations } = GAII_REPORT_V1;

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Policy Recommendations</Text>
        <Text style={styles.sectionSubtitle}>Actions for stakeholders to address AI inequality</Text>

        {recommendations.map((rec: PolicyRecommendation, i: number) => (
          <View key={i} style={styles.policyCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
              <Text style={{ fontSize: 8, color: '#666666', marginRight: 5 }}>
                [{rec.target.toUpperCase()}]
              </Text>
              <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#0A0F1A' }}>
                {rec.title}
              </Text>
              <Text style={[styles.priorityBadge, getPriorityStyle(rec.priority)]}>
                {rec.priority}
              </Text>
            </View>
            <Text style={{ fontSize: 9, color: '#444444', lineHeight: 1.4, marginBottom: 5 }}>
              {rec.description}
            </Text>
            <Text style={{ fontSize: 8, color: '#0052FF', backgroundColor: '#f0f7ff', padding: 5 }}>
              Impact: {rec.impact}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <Text>GAII Report v1.0 - Policy Recommendations</Text>
        <Text render={({ pageNumber }) => `Page ${pageNumber}`} />
      </View>
    </Page>
  );
}

// Methodology Page
function MethodologyPage() {
  const { metadata } = GAII_REPORT_V1;
  const { methodology, dataSources } = metadata;

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Methodology</Text>
        <Text style={styles.sectionSubtitle}>How GAII scores are calculated</Text>

        <View style={styles.methodologyBox}>
          <Text style={{ fontSize: 10, fontWeight: 'bold', marginBottom: 8 }}>Formula</Text>
          <Text style={styles.formula}>{methodology.formula}</Text>

          <Text style={{ fontSize: 10, fontWeight: 'bold', marginBottom: 8, marginTop: 10 }}>
            Indicator Weights
          </Text>
          {Object.entries(methodology.weights).map(([key, value]) => (
            <View key={key} style={styles.weightBar}>
              <Text style={styles.weightLabel}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
              <View style={{ flex: 1, backgroundColor: '#e0e0e0', height: 8, marginRight: 5 }}>
                <View style={[styles.weightBarFill, { width: `${value * 100}%` }]} />
              </View>
              <Text style={styles.weightValue}>{value * 100}%</Text>
            </View>
          ))}

          <Text style={{ fontSize: 10, fontWeight: 'bold', marginBottom: 8, marginTop: 15 }}>
            Grade Thresholds
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            <View style={{ width: '50%', marginBottom: 5, flexDirection: 'row', alignItems: 'center' }}>
              <Text style={[styles.gradeBox, styles.gradeLow]}>Low</Text>
              <Text style={{ fontSize: 8, marginLeft: 5 }}>0 - 30 (Best AI equality)</Text>
            </View>
            <View style={{ width: '50%', marginBottom: 5, flexDirection: 'row', alignItems: 'center' }}>
              <Text style={[styles.gradeBox, styles.gradeModerate]}>Moderate</Text>
              <Text style={{ fontSize: 8, marginLeft: 5 }}>30 - 50 (Room for improvement)</Text>
            </View>
            <View style={{ width: '50%', marginBottom: 5, flexDirection: 'row', alignItems: 'center' }}>
              <Text style={[styles.gradeBox, styles.gradeHigh]}>High</Text>
              <Text style={{ fontSize: 8, marginLeft: 5 }}>50 - 70 (Significant inequality)</Text>
            </View>
            <View style={{ width: '50%', marginBottom: 5, flexDirection: 'row', alignItems: 'center' }}>
              <Text style={[styles.gradeBox, styles.gradeCritical]}>Critical</Text>
              <Text style={{ fontSize: 8, marginLeft: 5 }}>70 - 100 (Urgent intervention)</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Data Sources</Text>
        <Text style={styles.sectionSubtitle}>Primary data sources used in this report</Text>

        <View style={styles.regionRow}>
          {dataSources.map((source, i) => (
            <View key={i} style={styles.sourceCard}>
              <Text style={styles.sourceName}>{source.name}</Text>
              <Text style={styles.sourceYear}>{source.year}</Text>
              <Text style={styles.sourceDesc}>{source.description}</Text>
              {source.url && (
                <Text style={{ fontSize: 7, color: '#0052FF', marginTop: 3 }}>{source.url}</Text>
              )}
            </View>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <Text>GAII Report v1.0 - Methodology & Data Sources</Text>
        <Text render={({ pageNumber }) => `Page ${pageNumber}`} />
      </View>
    </Page>
  );
}

// Main PDF Document
export function GAIIReportPDF() {
  const { countryRankings } = GAII_REPORT_V1;

  // Split rankings for multiple pages
  const topCountries = countryRankings.slice(0, 25);
  const bottomCountries = countryRankings.slice(25);

  return (
    <Document
      title="GAII Report v1.0 - Global AI Inequality Index"
      author="AlmaNEO Foundation"
      subject="Global AI Inequality Index Report"
      keywords="GAII, AI, inequality, global south, access"
    >
      <CoverPage />
      <ExecutiveSummaryPage />
      <CountryRankingsPage
        rankings={topCountries}
        title="Country Rankings (1-25)"
        subtitle="GAII scores for countries ranked 1-25 (lower is better)"
      />
      <CountryRankingsPage
        rankings={bottomCountries}
        title="Country Rankings (26-50)"
        subtitle="GAII scores for countries ranked 26-50 (lower is better)"
      />
      <RegionalAnalysisPage />
      <KeyInsightsPage />
      <PolicyRecommendationsPage />
      <MethodologyPage />
    </Document>
  );
}

export default GAIIReportPDF;
