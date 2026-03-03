
import { client } from "@/sanity/lib/client";
import { EGGS_QUERY, CHICKENS_QUERY, FEED_QUERY } from "@/sanity/lib/queries";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import {
  Record,
  isProfit,
  getDisplayPrice,
  getRowAmount,
} from "@/lib/records";
import DashboardCharts from "@/components/DashboardCharts";

async function getRecords(): Promise<Record[]> {
  const [eggs, chickens, feed] = await Promise.all([
    client.fetch(EGGS_QUERY),
    client.fetch(CHICKENS_QUERY),
    client.fetch(FEED_QUERY),
  ]);

  const records: Record[] = [
    ...eggs.map((e: any) => ({ ...e, _type: "eggs" as const })),
    ...chickens.map((c: any) => ({ ...c, _type: "chickens" as const })),
    ...feed.map((f: any) => ({ ...f, _type: "feed" as const })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return records;
}

export default async function Home() {
  const records = await getRecords();

  const totalProfits = records
    .filter((r) => isProfit(r._type))
    .reduce((sum, r) => sum + r.quantity * getDisplayPrice(r), 0);
  const totalLosses = records
    .filter((r) => !isProfit(r._type))
    .reduce((sum, r) => sum + r.quantity * getDisplayPrice(r), 0);
  const net = records.reduce((sum, r) => sum + getRowAmount(r), 0);

  const paidCount = records.filter((r) => r.paymentMade).length;
  const unpaidCount = records.filter((r) => !r.paymentMade).length;

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 lg:mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground text-sm sm:text-base mt-2">Weekly insights and financial overview</p>
        </div>

        {/* Summary Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 lg:mb-8">
          <div className="card p-4 sm:p-6 hover:shadow-lg transition-shadow">
            <p className="text-xs sm:text-sm text-muted-foreground mb-2 font-medium">Total Profits</p>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-chart-2">
              +DH {totalProfits.toFixed(2)}
            </p>
          </div>
          <div className="card p-4 sm:p-6 hover:shadow-lg transition-shadow">
            <p className="text-xs sm:text-sm text-muted-foreground mb-2 font-medium">Total Losses</p>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-destructive">
              -DH {totalLosses.toFixed(2)}
            </p>
          </div>
          <div className="card p-4 sm:p-6 hover:shadow-lg transition-shadow">
            <p className="text-xs sm:text-sm text-muted-foreground mb-2 font-medium">Net</p>
            <p className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${
              net >= 0 ? "text-chart-2" : "text-destructive"
            }`}>
              {net >= 0 ? "+" : ""}{net.toFixed(2)} DH
            </p>
          </div>
        </div>

        {/* Payment Status Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 lg:mb-8">
          <div className="card p-4 sm:p-6 hover:shadow-lg transition-shadow">
            <p className="text-xs sm:text-sm text-muted-foreground mb-3 font-medium">Paid Records</p>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary">{paidCount}</p>
          </div>
          <div className="card p-4 sm:p-6 hover:shadow-lg transition-shadow">
            <p className="text-xs sm:text-sm text-muted-foreground mb-3 font-medium">Unpaid Records</p>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-accent">{unpaidCount}</p>
          </div>
        </div>

        {/* Chart Section */}
        <DashboardCharts records={records} />

        {/* Action Buttons */}
        <div className="mt-8 lg:mt-10 flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button asChild className="w-full sm:w-auto">
            <Link href="/records">View All Records</Link>
          </Button>
          <Button asChild variant="secondary" className="w-full sm:w-auto">
            <Link href="/addRecord">Add New Record</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

// 