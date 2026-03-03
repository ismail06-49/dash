
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
    <div className="min-h-screen p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card p-6">
            <p className="text-sm text-muted-foreground mb-2">Total Profits</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              +DH {totalProfits.toFixed(2)}
            </p>
          </div>
          <div className="card p-6">
            <p className="text-sm text-muted-foreground mb-2">Total Losses</p>
            <p className="text-3xl font-bold text-red-600 dark:text-red-400">
              -DH {totalLosses.toFixed(2)}
            </p>
          </div>
          <div className="card p-6">
            <p className="text-sm text-muted-foreground mb-2">Net</p>
            <p className={`text-3xl font-bold ${
              net >= 0
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}>
              {net >= 0 ? "+" : ""}{net.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <div className="card p-6">
            <p className="text-sm text-muted-foreground mb-2">Paid Records</p>
            <p className="text-3xl font-bold">{paidCount}</p>
          </div>
          <div className="card p-6">
            <p className="text-sm text-muted-foreground mb-2">Unpaid Records</p>
            <p className="text-3xl font-bold">{unpaidCount}</p>
          </div>
        </div>

        {/* charts section */}
        <DashboardCharts records={records} />

        <div className="mt-8 flex flex-wrap gap-2">
          <Button asChild>
            <Link href="/records">View All Records</Link>
          </Button>
          <Button asChild>
            <Link href="/addRecord">Add New Record</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

// 