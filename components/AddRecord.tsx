import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Egg, Feather, ShoppingCart } from "lucide-react"

export default function AddRecord() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="card p-6 max-w-sm w-full mx-4">
        <h1 className="text-2xl font-semibold text-center mb-6">Add Record</h1>
        <div className="space-y-4">
          <Button asChild size="lg" className="w-full">
            <Link
              href="/addRecord/sellEggs"
              className="flex items-center justify-center gap-2"
            >
              <Egg className="h-5 w-5" />
              Eggs
            </Link>
          </Button>

          <Button asChild size="lg" className="w-full">
            <Link
              href="/addRecord/sellChickens"
              className="flex items-center justify-center gap-2"
            >
              <Feather className="h-5 w-5" />
              Chickens
            </Link>
          </Button>

          <Button asChild size="lg" className="w-full">
            <Link
              href="/addRecord/buyFeed"
              className="flex items-center justify-center gap-2"
            >
              <ShoppingCart className="h-5 w-5" />
              Feed
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}