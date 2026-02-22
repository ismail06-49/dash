import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function addRecord() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-sm sm:max-w-md mx-auto mt-0 sm:mt-8 p-4 pt-8 sm:p-6 bg-card rounded-lg shadow-lg border">
        <div className="space-y-4">
          <Button variant='link' className="w-full bg-primary text-primary-foreground hover:bg-primary/85 cursor-pointer">
            <Link href="/addRecord/sellEggs">Eggs</Link>
          </Button>
          <Button variant='link' className="w-full bg-primary text-primary-foreground hover:bg-primary/85 cursor-pointer">
            <Link href="/addRecord/sellChickens">Chickens</Link>
          </Button>
          <Button variant='link' className="w-full bg-primary text-primary-foreground hover:bg-primary/85 cursor-pointer">
            <Link href="/addRecord/buyFeed">Feed</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}