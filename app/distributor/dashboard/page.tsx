"use client";

import {
  TitleBar,
  MyPerformance,
  TeamPerformance,
  OverallPerformanceChart,
  MapPanel,
  OrderPerformance,
  BestSellingProducts,
  TopAffiliateMembers,
  BottomPanel,
  BOTTOM_ROWS,
} from "@/components/dashboard";

export default function DashboardPage() {
  return (
    <main className="flex flex-col gap-6 p-6 lg:p-8">
      <TitleBar />

      <MyPerformance />

      {/* Row: Team Performance + Overall Performance */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <TeamPerformance />
        <OverallPerformanceChart />
      </div>

      {/* Row: Map + Order Performance */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[2fr_1fr]">
        <MapPanel />
        <OrderPerformance />
      </div>

      <BestSellingProducts />

      <TopAffiliateMembers />

      {/* Row: two bottom summary tables */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <BottomPanel
          title="Orders not purchased in the last 90 days"
          summaryText="Customers who haven't placed an order in the last 90 days"
          summaryNumber="210"
          extraColumn={{
            header: "Affiliate",
            rows: ["Sarah Chen", "Anan Suksan", "Nur Aisyah", "Wei Ming"],
          }}
          rows={BOTTOM_ROWS}
        />
        <BottomPanel
          title="New Affiliate Members"
          summaryText="Affiliates who joined in the last 30 days but haven't sent any email yet"
          summaryNumber="10"
          extraColumn={{
            header: "Last Email Sent",
            rows: ["3 days ago", "1 week ago", "2 weeks ago", "Never"],
          }}
          rows={BOTTOM_ROWS}
        />
      </div>
    </main>
  );
}