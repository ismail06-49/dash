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

function getTypeLabel(record: Record) {
  if (record._type === "feed") {
    return record.type ? record.type.charAt(0).toUpperCase() + record.type.slice(1) : "Feed";
  }
  return record._type.charAt(0).toUpperCase() + record._type.slice(1);
}

function getTypeLabelForFilter(type: string) {
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
      {/* Filters Section */}
      <div className="mb-4 sm:mb-6 flex flex-col gap-3 sm:gap-4">
        {/* Type Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <span className="text-xs sm:text-sm font-semibold text-foreground">Filter by type:</span>
          <div className="flex flex-wrap gap-2">
            {(["all", "eggs", "chickens", "feed"] as const).map((t) => (
              <button
                key={t}
                className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium transition-all ${
                  typeFilter === t
                    ? "bg-primary text-primary-foreground border border-primary"
                    : "bg-muted text-foreground border border-border hover:bg-accent hover:text-accent-foreground"
                }`}
                onClick={() => setTypeFilter(t)}
              >
                {t === "all" ? "All" : getTypeLabelForFilter(t)}
              </button>
            ))}
          </div>
        </div>

        {/* Payment Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <span className="text-xs sm:text-sm font-semibold text-foreground">Payment status:</span>
          <div className="flex flex-wrap gap-2">
            {(["all", "paid", "unpaid"] as const).map((p) => (
              <button
                key={p}
                className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium transition-all ${
                  paymentFilter === p
                    ? "bg-primary text-primary-foreground border border-primary"
                    : "bg-muted text-foreground border border-border hover:bg-accent hover:text-accent-foreground"
                }`}
                onClick={() => setPaymentFilter(p)}
              >
                {p === "all" ? "All" : p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Sort Button */}
        <div className="flex justify-end">
          <button
            className="px-3 py-1 rounded text-xs sm:text-sm font-medium bg-secondary text-secondary-foreground border border-border hover:bg-secondary/80 transition-all"
            onClick={toggleSort}
          >
            Sort by type {sortByTypeAsc ? "▲" : "▼"}
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card p-6 sm:p-8 text-center">
          <p className="text-muted-foreground text-sm sm:text-base">No records match the selected criteria.</p>
        </div>
      ) : (
        <>
          {/* Table Section */}
          <div className="card overflow-hidden mb-6 sm:mb-8">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-foreground">Type</th>
                    <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-foreground">Date</th>
                    <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm font-semibold text-foreground">Quantity</th>
                    <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm font-semibold text-foreground">Price</th>
                    <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm font-semibold text-foreground">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((record) => (
                    <tr
                      key={record._id}
                      className={`border-b last:border-b-0 hover:opacity-90 transition-opacity ${
                        isProfit(record._type)
                          ? "bg-chart-2/5 dark:bg-chart-2/10"
                          : "bg-destructive/5 dark:bg-destructive/10"
                      }`}
                    >
                      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 flex items-center gap-2">
                        {getIcon(record._type)}
                        <span className="text-xs sm:text-sm font-medium">{
                          getTypeLabel(record)}
                        </span>
                      </td>
                      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-xs sm:text-sm">
                        {format(new Date(record.date), "MMM d, yyyy")}
                      </td>
                      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm">{record.quantity}</td>
                      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm">
                        DH {getDisplayPrice(record).toFixed(2)}
                      </td>
                      <td
                        className={`px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm font-semibold ${
                          isProfit(record._type) ? "text-chart-2" : "text-destructive"
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

          {/* Summary Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div className="card p-4 sm:p-6">
              <p className="text-xs sm:text-sm text-muted-foreground mb-2 font-medium">Total Profits</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-chart-2">
                +DH {filtered
                  .filter((r) => isProfit(r._type))
                  .reduce((sum, r) => sum + r.quantity * getDisplayPrice(r), 0)
                  .toFixed(2)}
              </p>
            </div>
            <div className="card p-4 sm:p-6">
              <p className="text-xs sm:text-sm text-muted-foreground mb-2 font-medium">Total Losses</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-destructive">
                -DH {filtered
                  .filter((r) => !isProfit(r._type))
                  .reduce((sum, r) => sum + r.quantity * getDisplayPrice(r), 0)
                  .toFixed(2)}
              </p>
            </div>
            <div className="card p-4 sm:p-6">
              <p className="text-xs sm:text-sm text-muted-foreground mb-2 font-medium">Net</p>
              <p className={`text-xl sm:text-2xl lg:text-3xl font-bold ${
                filtered.reduce((sum, r) => sum + getRowAmount(r), 0) >= 0
                  ? "text-chart-2"
                  : "text-destructive"
              }`}
              >
                {filtered.reduce((sum, r) => sum + getRowAmount(r), 0) >= 0 ? "+" : ""}{filtered
                  .reduce((sum, r) => sum + getRowAmount(r), 0)
                  .toFixed(2)} DH
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
}
