'use server';

import * as z from "zod";
import { ChickensSchema, EggsSchema, FeedSchema } from "@/schemas";
import { parseServerActionResponse } from "@/lib/utils";
import { writeClient } from "@/sanity/lib/write-client";

export const addEggs = async (values: z.infer<typeof EggsSchema>) => {
    const validatedData = EggsSchema.safeParse(values);

    if (!validatedData.success) {
        return { error: 'Invalid egg data provided.' };
    }

    const { date, quantity, price, paymentMade } = validatedData.data;

    const newEggEntry = await writeClient.create({
        _type: 'eggs',
        date,
        quantity,
        price,
        paymentMade,
    })

    return parseServerActionResponse({
        ...newEggEntry,
        error: '',
        success: 'Egg entry added successfully.',
    })
}

export const addChickens = async (values: z.infer<typeof ChickensSchema>) => {
    const validatedData = ChickensSchema.safeParse(values);

    if (!validatedData.success) {
        return { error: 'Invalid chicken data provided.' };
    }

    const { date, quantity, price, paymentMade } = validatedData.data;

    const newChickenEntry = await writeClient.create({
        _type: 'chickens',
        date,
        quantity,
        price,
        paymentMade,
    })

    return parseServerActionResponse({
        ...newChickenEntry,
        error: '',
        success: 'Chicken entry added successfully.',
    })
}

export const addFeed = async (values: z.infer<typeof FeedSchema>) => {
    const validatedData = FeedSchema.safeParse(values);

    if (!validatedData.success) {
        return { error: 'Invalid feed data provided.' };
    }

    const { date, quantity, price, paymentMade } = validatedData.data;

    const newFeedEntry = await writeClient.create({
        _type: 'feed',
        date,
        quantity,
        price,
        paymentMade,
    })

    return parseServerActionResponse({
        ...newFeedEntry,
        error: '',
        success: 'Feed entry added successfully.',
    })
}