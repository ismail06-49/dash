import { defineField, defineType } from "sanity";

export const feed = defineType({
    name: "feed",
    title: "Feed",
    type: "document",
    fields: [
        defineField({
            name: "id",
            type: "number",
        }),
        defineField({
            name: "quantity",
            type: "number",
        }),
        defineField({
            name: "price",
            type: "number",
        }),
        defineField({
            name: "date",
            type: "date",
        }),
        defineField({
            name: "paymentMade",
            type: "boolean",
        }),
        defineField({
            name: "type",
            type: "string",
            options: {
                list: [
                    { title: "B", value: "b" },
                    { title: "D", value: "d" },
                    { title: "R", value: "r" },
                    { title: "2", value: "2" },
                ],
                layout: "dropdown",
            },
        }),
    ]
})