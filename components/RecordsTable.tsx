"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import { Egg, Feather, ShoppingCart } from "lucide-react";

import {
  Record,
  isProfit,
  getDisplayPrice,
  getRowAmount,
} from "@/lib/records";

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

interface RecordsTableProps {
  records: Record[];
}

export default function RecordsTable({ records }: RecordsTableProps) {
  const [typeFilter, setTypeFilter] = useState<"all" | "eggs" | "chickens" | "feed">("all");
  const [paymentFilter, setPaymentFilter] = useState<"all" | "paid" | "unpaid">("all");
  const [sortByTypeAsc, setSortByTypeAsc] = useState<boolean>(false);

  const filtered = useMemo(() => {
    let arr = [...records];

    if (typeFilter !== "all") {
      arr = arr.filter((r) => r._type === typeFilter);
    }

    if (paymentFilter !== "all") {
      const paid = paymentFilter === "paid";
      arr = arr.filter((r) => r.paymentMade === paid);
    }

    if (sortByTypeAsc) {
      arr.sort((a, b) => a._type.localeCompare(b._type));
    }

    return arr;
  }, [records, typeFilter, paymentFilter, sortByTypeAsc]);

  const toggleSort = () => setSortByTypeAsc((s) => !s);

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Filter type:</span>
          {(["all", "eggs", "chickens", "feed"] as const).map((t) => (
            <button
              key={t}
              className={`px-3 py-1 rounded text-sm font-semibold border transition-colors ${
                typeFilter === t
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-transparent text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600"
              }`}
              onClick={() => setTypeFilter(t)}
            >
              {t === "all" ? "All" : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Payment:</span>
          {(["all", "paid", "unpaid"] as const).map((p) => (
            <button
              key={p}
              className={`px-3 py-1 rounded text-sm font-semibold border transition-colors ${
                paymentFilter === p
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-transparent text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600"
              }`}
              onClick={() => setPaymentFilter(p)}
            >
              {p === "all" ? "All" : p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>

        <button
          className="ml-auto px-3 py-1 rounded text-sm font-semibold border bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={toggleSort}
        >
          Sort by type {sortByTypeAsc ? "▲" : "▼"}
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-muted-foreground">No records match the selected criteria.</p>
        </div>
      ) : (
        <>
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
                  {filtered.map((record) => (
                    <tr
                      key={record._id}
                      className={`border-b last:border-b-0 hover:opacity-75 transition-opacity ${
                        isProfit(record._type)
                          ? "bg-green-50 dark:bg-green-950/20"
                          : "bg-red-50 dark:bg-red-950/20"
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
                      <td
                        className={`px-6 py-4 text-right text-sm font-semibold ${
                          isProfit(record._type)
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {isProfit(record._type) ? "+" : "-"}DH {Math.abs(getRowAmount(record)).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* summary stats for filtered records */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="card p-6">
              <p className="text-sm text-muted-foreground mb-2">Total Profits</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                +DH {filtered
                  .filter((r) => isProfit(r._type))
                  .reduce((sum, r) => sum + r.quantity * getDisplayPrice(r), 0)
                  .toFixed(2)}
              </p>
            </div>
            <div className="card p-6">
              <p className="text-sm text-muted-foreground mb-2">Total Losses</p>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                -DH {filtered
                  .filter((r) => !isProfit(r._type))
                  .reduce((sum, r) => sum + r.quantity * getDisplayPrice(r), 0)
                  .toFixed(2)}
              </p>
            </div>
            <div className="card p-6">
              <p className="text-sm text-muted-foreground mb-2">Net</p>
              <p className={`text-3xl font-bold ${
                filtered.reduce((sum, r) => sum + getRowAmount(r), 0) >= 0
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
              >
                {filtered.reduce((sum, r) => sum + getRowAmount(r), 0) >= 0 ? "+" : ""}{filtered
                  .reduce((sum, r) => sum + getRowAmount(r), 0)
                  .toFixed(2)}
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
}
