import * as z from 'zod';

export const EggsSchema = z.object({
    date: z.string(),
    quantity: z.number(),
    price: z.number(),
})

export const ChickensSchema = z.object({
    date: z.string(),
    quantity: z.number(),
    price: z.number(),
})

export const FeedSchema = z.object({
    date: z.string(),
    quantity: z.number(),
    price: z.number(),
})