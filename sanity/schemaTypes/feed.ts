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
            name: "name",
            type: "string",
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
    ]
})