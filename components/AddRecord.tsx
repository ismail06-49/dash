import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Egg, Feather, ShoppingCart } from "lucide-react"

export default function AddRecord() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6">
      <div className="card p-4 sm:p-6 lg:p-8 max-w-sm w-full">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-center mb-6 sm:mb-8">Add Record</h1>
        <div className="space-y-3 sm:space-y-4">
          <Button asChild size="lg" className="w-full text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-2.5">
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