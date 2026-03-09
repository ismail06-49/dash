'use client';

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { FeedSchema } from "@/schemas";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addFeed } from "@/lib/actions";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";

const Feed = () => {

    const [error, setError] = useState<string | undefined>('');
    const [success, setSuccess] = useState<string | undefined>('');
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const form = useForm<z.infer<typeof FeedSchema>>({
        resolver: zodResolver(FeedSchema),
        defaultValues: {
            quantity: 0,
            price: 0,
            date: new Date().toISOString().split('T')[0],
            paymentMade: false,
        },
    });

    const onSubmit = (values: z.infer<typeof FeedSchema>) => {
        setError('');
        setSuccess('');

        startTransition(async () => {
            const response = await addFeed(values);
            if (response.error) {
                setError(response.error);
            } else {
                setSuccess(response.success);
                router.push('/records');
            }
        })
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 sm:p-6">
            <div className="card p-4 sm:p-6 lg:p-8 max-w-2xl w-full">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-center mb-6 sm:mb-8">Buy Feed</h1>
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
                            <FormField
                                control={form.control}
                                name="paymentMade"
                                render={({ field }) => (
                                    <FormItem className="flex items-center gap-2">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormLabel className="text-xs sm:text-sm">Payment Made</FormLabel>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormError message={error} />
                        <FormSuccess message={success} />
                        <div className="mt-6 sm:mt-8 flex gap-3">
                            <Button
                                type="submit"
                                className="flex-1"
                                disabled={isPending}
                            >
                                Submit
                            </Button>
                            <Button
                                variant="outline"
                                asChild
                                className="flex-1"
                                disabled={isPending}
                            >
                                <Link href="/addRecord">Cancel</Link>
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default Feed
