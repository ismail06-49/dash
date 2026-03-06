'use server';

import { EggsSchema } from "@/schemas";
import * as z from "zod";
import { parseServerActionResponse } from "./utils";
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