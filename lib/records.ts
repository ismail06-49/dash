
export interface Record {
  _id: string;
  _type: "eggs" | "chickens" | "feed";
  quantity: number;
  price: number;
  date: string;
  paymentMade: boolean;
  type?: string;
}

export function isProfit(type: string): boolean {
  return type === "eggs" || type === "chickens";
}


// convert raw price to display price in DH; eggs values are divided by 20
export function getDisplayPrice(record: Record): number {
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

export function getRowAmount(record: Record): number {
  const displayPrice = getDisplayPrice(record);
  const amount = record.quantity * displayPrice;
  return isProfit(record._type) ? amount : -amount;
}
