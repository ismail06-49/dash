
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  type: z.enum(["chickens", "eggs", "feed"]),
  date: z.string().min(1, "Date is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  price: z.number().min(0, "Price must be positive"),
});

export default function AddRecord() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "chickens",
      date: new Date().toISOString().split('T')[0],
      quantity: 0,
      price: 0,
    },
  });

  const onSubmit = (values) => {
    console.log(values);
    alert("Record added!");
  };

  return (
    <div className="max-w-sm sm:max-w-md mx-auto mt-0 sm:mt-8 p-4 pt-8 sm:p-6 bg-card rounded-lg shadow-lg border">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">Add Record</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Type</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="w-full h-10 sm:h-10 px-3 py-2 text-base border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="chickens">Chickens Sold</option>
                    <option value="eggs">Eggs Sold</option>
                    <option value="feed">Feed Purchases</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} className="h-10 sm:h-10" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Quantity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    className="h-10 sm:h-10"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">
                  {form.watch('type') === 'feed' ? 'Total Price' : 'Unit Price'}
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    className="h-10 sm:h-10"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {form.watch('type') !== 'feed' && (
            <div className="text-sm text-muted-foreground">
              Total Price: {form.watch('type') === 'eggs'
                ? ((form.watch('quantity') * form.watch('price')) / 20).toFixed(2)
                : (form.watch('quantity') * form.watch('price')).toFixed(2)
              } DH
            </div>
          )}
          <Button type="submit" className="w-full h-10 sm:h-10">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
