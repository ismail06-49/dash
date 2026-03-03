import { client } from "@/sanity/lib/client";
import { EGGS_QUERY, CHICKENS_QUERY, FEED_QUERY } from "@/sanity/lib/queries";

import RecordsTable from "@/components/RecordsTable";
import {
  Record,
  isProfit,
  getDisplayPrice,
  getRowAmount,
} from "@/lib/records";

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



// render table and controls on the client so we can sort/filter interactively

export default async function RecordsPage() {
  const records = await getRecords();

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Records</h1>
        <RecordsTable records={records} />
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Client component
// -----------------------------------------------------------------------------


