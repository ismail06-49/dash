'use client';

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
        <div className="min-h-screen flex items-center justify-center">
            <div className="card p-6 max-w-2xl w-full mx-4">
                <h1 className="text-2xl font-semibold text-center mb-4">Sell Eggs</h1>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Date</FormLabel>
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
                                        <FormLabel>Quantity</FormLabel>
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
                                        <FormLabel>Price</FormLabel>
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
                        <div className="sm:col-span-3 mt-4">
                            <Button type="submit" className="w-full">Submit</Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default Eggs
