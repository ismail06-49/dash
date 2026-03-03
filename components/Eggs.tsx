'use client';

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { EggsSchema } from "@/schemas";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Eggs = () => {
    const form = useForm<z.infer<typeof EggsSchema>>({
        resolver: zodResolver(EggsSchema),
        defaultValues: {
            quantity: 0,
            price: 0,
            date: new Date().toISOString().split('T')[0],
        },
    });

    const onSubmit = (values: z.infer<typeof EggsSchema>) => {
        console.log(values);
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 sm:p-6">
            <div className="card p-4 sm:p-6 lg:p-8 max-w-2xl w-full">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-center mb-6 sm:mb-8">Sell Eggs</h1>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                            <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs sm:text-sm">Date</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="date"
                                                placeholder="Enter date"
                                                className="w-full"
                                            />
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
                                        <FormLabel className="text-xs sm:text-sm">Quantity</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type='number'
                                                value={field.value}
                                                onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                                                placeholder="Enter quantity"
                                                className="w-full"
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
                                        <FormLabel className="text-xs sm:text-sm">Price</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="number"
                                                value={field.value}
                                                onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                                                placeholder="Enter price"
                                                className="w-full"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="mt-6 sm:mt-8 flex gap-3">
                            <Button type="submit" className="flex-1">Submit</Button>
                            <Button variant="outline" asChild className="flex-1">
                                <Link href="/records">Cancel</Link>
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default Eggs
