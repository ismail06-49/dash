import { client } from "@/sanity/lib/client";
import { EGGS_QUERY, CHICKENS_QUERY, FEED_QUERY } from "@/sanity/lib/queries";
import { format } from "date-fns";
import { Egg, Feather, ShoppingCart } from "lucide-react";

interface Record {
  _id: string;
  _type: "eggs" | "chickens" | "feed";
  quantity: number;
  price: number;
  date: string;
}

async function getRecords() {
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

function getIcon(type: string) {
  switch (type) {
    case "eggs":
      return <Egg className="h-5 w-5 text-green-500" />;
    case "chickens":
      return <Feather className="h-5 w-5 text-green-500" />;
    case "feed":
      return <ShoppingCart className="h-5 w-5 text-red-500" />;
    default:
      return null;
  }
}

function getTypeLabel(type: string) {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

function isProfit(type: string): boolean {
  return type === "eggs" || type === "chickens";
}

// convert raw price to display price in DH; eggs values are divided by 20
function getDisplayPrice(record: Record): number {
  switch (record._type) {
    case "eggs":
      // stored price is batch price, show per-egg
      return record.price / 20;
    case "feed":
      // user enters the total amount in `price`; display unit cost
      return record.quantity ? record.price / record.quantity : record.price;
    default:
      return record.price;
  }
}

function getRowAmount(record: Record): number {
  const displayPrice = getDisplayPrice(record);
  const amount = record.quantity * displayPrice;
  return isProfit(record._type) ? amount : -amount;
}

export default async function RecordsPage() {
  const records = await getRecords();

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Records</h1>

        {records.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-muted-foreground">No records found. Start by adding a new record.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="card">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-6 py-4 text-left text-sm font-semibold">Type</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold">Quantity</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold">Price</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => (
                    <tr
                      key={record._id}
                      className={`border-b last:border-b-0 hover:opacity-75 transition-opacity ${
                        isProfit(record._type) ? "bg-green-50 dark:bg-green-950/20" : "bg-red-50 dark:bg-red-950/20"
                      }`}
                    >
                      <td className="px-6 py-4 flex items-center gap-3">
                        {getIcon(record._type)}
                        <span className="text-sm font-medium">{getTypeLabel(record._type)}</span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {format(new Date(record.date), "MMM d, yyyy")}
                      </td>
                      <td className="px-6 py-4 text-right text-sm">{record.quantity}</td>
                      <td className="px-6 py-4 text-right text-sm">
                        DH {getDisplayPrice(record).toFixed(2)}
                      </td>
                      <td className={`px-6 py-4 text-right text-sm font-semibold ${
                        isProfit(record._type) ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                      }`}>
                        {isProfit(record._type) ? "+" : "-"}DH {Math.abs(getRowAmount(record)).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Summary Stats */}
        {records.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="card p-6">
              <p className="text-sm text-muted-foreground mb-2">Total Profits</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                +DH {records
                  .filter((r) => isProfit(r._type))
                  .reduce((sum, r) => sum + r.quantity * getDisplayPrice(r), 0)
                  .toFixed(2)}
              </p>
            </div>
            <div className="card p-6">
              <p className="text-sm text-muted-foreground mb-2">Total Losses</p>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                -DH {records
                  .filter((r) => !isProfit(r._type))
                  .reduce((sum, r) => sum + r.quantity * getDisplayPrice(r), 0)
                  .toFixed(2)}
              </p>
            </div>
            <div className="card p-6">
              <p className="text-sm text-muted-foreground mb-2">Net</p>
              <p className={`text-3xl font-bold ${
                records.reduce((sum, r) => sum + getRowAmount(r), 0) >= 0
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}>
                {records.reduce((sum, r) => sum + getRowAmount(r), 0) >= 0 ? "+" : ""}{records
                  .reduce((sum, r) => sum + getRowAmount(r), 0)
                  .toFixed(2)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
