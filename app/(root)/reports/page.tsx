import { client } from "@/sanity/lib/client";
import { EGGS_QUERY, CHICKENS_QUERY, FEED_QUERY } from "@/sanity/lib/queries";
import {
  Record,
  isProfit,
  getDisplayPrice,
  getRowAmount,
} from "@/lib/records";
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, startOfYear } from "date-fns";
import { Egg, Feather, ShoppingCart, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { sanityFetch, SanityLive } from "@/sanity/lib/live";

async function getRecords(): Promise<Record[]> {
  
  const [{ data: eggsData }, { data: chickensData }, { data: feedData }] = await Promise.all([
      sanityFetch({ query: EGGS_QUERY }),
      sanityFetch({ query: CHICKENS_QUERY }),
      sanityFetch({ query: FEED_QUERY }),
  ]);

  const records: Record[] = [
    ...eggsData.map((e: any) => ({ ...e, _type: "eggs" as const })),
    ...chickensData.map((c: any) => ({ ...c, _type: "chickens" as const })),
    ...feedData.map((f: any) => ({ ...f, _type: "feed" as const })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return records;
}

interface MonthlyStats {
  month: string;
  revenue: number;
  expenses: number;
  net: number;
}

function generateMonthlyStats(records: Record[]): MonthlyStats[] {
  const now = new Date();
  const yearStart = startOfYear(now);
  const months = eachMonthOfInterval({ start: yearStart, end: now });

  return months.map((monthDate) => {
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthDate);
    const monthRecords = records.filter((r) => {
      const recordDate = new Date(r.date);
      return recordDate >= monthStart && recordDate <= monthEnd;
    });

    const revenue = monthRecords
      .filter((r) => isProfit(r._type))
      .reduce((sum, r) => sum + getRowAmount(r), 0);

    const expenses = monthRecords
      .filter((r) => !isProfit(r._type))
      .reduce((sum, r) => sum + Math.abs(getRowAmount(r)), 0);

    return {
      month: format(monthDate, "MMM yyyy"),
      revenue,
      expenses,
      net: revenue - expenses,
    };
  });
}

function StatCard({
  icon: Icon,
  label,
  value,
  subtext,
  trend,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtext?: string;
  trend?: "up" | "down";
  color: string;
}) {
  return (
    <div className="card p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs sm:text-sm text-muted-foreground mb-2 font-medium">
            {label}
          </p>
          <p className={`text-2xl sm:text-3xl font-bold ${color}`}>{value}</p>
          {subtext && (
            <p className="text-xs sm:text-sm text-muted-foreground mt-2">{subtext}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color.replace("text-", "bg-").replace("-600", "-100")}`}>
          {Icon}
        </div>
      </div>
      {trend && (
        <div className="flex items-center gap-1 mt-3">
          {trend === "up" ? (
            <TrendingUp className="h-4 w-4 text-green-600" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-600" />
          )}
          <span className={`text-xs font-medium ${trend === "up" ? "text-green-600" : "text-red-600"}`}>
            {trend === "up" ? "Increasing" : "Decreasing"}
          </span>
        </div>
      )}
    </div>
  );
}

export default async function ReportsPage() {
  const records = await getRecords();
  const monthlyStats = generateMonthlyStats(records);

  // Calculate overall statistics
  const eggRecords = records.filter((r) => r._type === "eggs");
  const chickenRecords = records.filter((r) => r._type === "chickens");
  const feedRecords = records.filter((r) => r._type === "feed");

  const eggRevenue = eggRecords.reduce((sum, r) => sum + getRowAmount(r), 0);
  const chickenRevenue = chickenRecords.reduce((sum, r) => sum + getRowAmount(r), 0);
  const feedExpense = feedRecords.reduce((sum, r) => sum + Math.abs(getRowAmount(r)), 0);
  const totalRevenue = eggRevenue + chickenRevenue;
  const totalExpense = feedExpense;
  const netProfit = totalRevenue - totalExpense;

  // Payment statistics
  const paidRecords = records.filter((r) => r.paymentMade);
  const unpaidRecords = records.filter((r) => !r.paymentMade);
  const paidAmount = paidRecords.reduce((sum, r) => sum + getRowAmount(r), 0);
  const unpaidAmount = unpaidRecords.reduce((sum, r) => sum + getRowAmount(r), 0);

  // Average calculations
  const avgEggPrice = eggRecords.length > 0 
    ? eggRecords.reduce((sum, r) => sum + getDisplayPrice(r), 0) / eggRecords.length 
    : 0;
  const avgFeedPrice = feedRecords.length > 0
    ? feedRecords.reduce((sum, r) => sum + getDisplayPrice(r), 0) / feedRecords.length
    : 0;

  // Find best and worst months
  const validMonths = monthlyStats.filter((m) => m.revenue > 0 || m.expenses > 0);
  const bestMonth = validMonths.reduce((best, current) =>
    current.net > best.net ? current : best,
    validMonths[0] || { month: "N/A", revenue: 0, expenses: 0, net: 0 }
  );
  const worstMonth = validMonths.reduce((worst, current) =>
    current.net < worst.net ? current : worst,
    validMonths[0] || { month: "N/A", revenue: 0, expenses: 0, net: 0 }
  );

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 lg:mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">Reports</h1>
          <p className="text-muted-foreground text-sm sm:text-base mt-2">
            Complete financial and operational analytics
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 lg:mb-8">
          <StatCard
            icon={<TrendingUp className="h-6 w-6 text-green-600" />}
            label="Total Revenue"
            value={`+DH ${totalRevenue.toFixed(2)}`}
            color="text-green-600"
            subtext={`${records.filter((r) => isProfit(r._type)).length} transactions`}
          />
          <StatCard
            icon={<TrendingDown className="h-6 w-6 text-red-600" />}
            label="Total Expenses"
            value={`-DH ${totalExpense.toFixed(2)}`}
            color="text-red-600"
            subtext={`${feedRecords.length} feed purchases`}
          />
          <StatCard
            icon={<Wallet className="h-6 w-6 text-blue-600" />}
            label="Net Profit"
            value={`${netProfit >= 0 ? "+" : ""}DH ${netProfit.toFixed(2)}`}
            color={netProfit >= 0 ? "text-green-600" : "text-red-600"}
            trend={netProfit >= 0 ? "up" : "down"}
          />
          <StatCard
            icon={<ShoppingCart className="h-6 w-6 text-orange-600" />}
            label="Total Records"
            value={records.length.toString()}
            color="text-orange-600"
            subtext={`${paidRecords.length} paid`}
          />
        </div>

        {/* Revenue Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8">
          <div className="card p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Revenue Breakdown</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Egg className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Eggs</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">+DH {eggRevenue.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">
                    Avg: DH {avgEggPrice.toFixed(2)}/unit
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Feather className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Chickens</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">+DH {chickenRevenue.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">
                    {chickenRecords.length} transactions
                  </p>
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total Revenue</span>
                  <p className="font-bold text-lg text-green-600">
                    +DH {totalRevenue.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Expense Summary */}
          <div className="card p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Expense Summary</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="h-5 w-5 text-red-500" />
                  <span className="text-sm">Feed Costs</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-red-600">-DH {feedExpense.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">
                    Avg: DH {avgFeedPrice.toFixed(2)}/unit
                  </p>
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total Expenses</span>
                  <p className="font-bold text-lg text-red-600">-DH {totalExpense.toFixed(2)}</p>
                </div>
              </div>
              <div className="bg-muted p-3 rounded border-l-4 border-blue-500">
                <p className="text-xs text-muted-foreground">Profit Margin</p>
                <p className="font-bold text-lg">
                  {totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : "0"}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Status & Monthly Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8">
          <div className="card p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Payment Status</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span className="text-sm">Paid</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold">+DH {paidAmount.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">{paidRecords.length} records</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                  <span className="text-sm">Pending</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold">+DH {unpaidAmount.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">{unpaidRecords.length} records</p>
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Collection Rate</span>
                  <p className="font-bold text-lg">
                    {records.length > 0 ? ((paidRecords.length / records.length) * 100).toFixed(0) : 0}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Highlights */}
          <div className="card p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Performance Highlights</h2>
            <div className="space-y-4">
              <div className="bg-green-50 dark:bg-green-950 p-4 rounded">
                <p className="text-xs text-muted-foreground mb-1">Best Month</p>
                <p className="font-semibold">{bestMonth.month}</p>
                <p className="text-sm text-green-600 font-medium">
                  +DH {bestMonth.net.toFixed(2)}
                </p>
              </div>
              <div className="bg-red-50 dark:bg-red-950 p-4 rounded">
                <p className="text-xs text-muted-foreground mb-1">Lowest Month</p>
                <p className="font-semibold">{worstMonth.month}</p>
                <p className="text-sm text-red-600 font-medium">
                  {worstMonth.net >= 0 ? "+" : ""}DH {worstMonth.net.toFixed(2)}
                </p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded">
                <p className="text-xs text-muted-foreground mb-1">Average Monthly Net</p>
                <p className="font-bold text-lg">
                  +DH{" "}
                  {validMonths.length > 0
                    ? (validMonths.reduce((sum, m) => sum + m.net, 0) / validMonths.length).toFixed(2)
                    : "0.00"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Breakdown Table */}
        <div className="card p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Monthly Breakdown</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="py-3 px-2 font-medium">Month</th>
                  <th className="py-3 px-2 font-medium text-right">Revenue</th>
                  <th className="py-3 px-2 font-medium text-right">Expenses</th>
                  <th className="py-3 px-2 font-medium text-right">Net</th>
                </tr>
              </thead>
              <tbody>
                {monthlyStats
                  .filter((m) => m.revenue > 0 || m.expenses > 0)
                  .reverse()
                  .map((stat, idx) => (
                    <tr key={idx} className="border-b hover:bg-muted transition-colors">
                      <td className="py-3 px-2 font-medium">{stat.month}</td>
                      <td className="py-3 px-2 text-right text-green-600">
                        +DH {stat.revenue.toFixed(2)}
                      </td>
                      <td className="py-3 px-2 text-right text-red-600">
                        -DH {stat.expenses.toFixed(2)}
                      </td>
                      <td
                        className={`py-3 px-2 text-right font-semibold ${
                          stat.net >= 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {stat.net >= 0 ? "+" : ""}DH {stat.net.toFixed(2)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <SanityLive />
    </div>
  );
}
