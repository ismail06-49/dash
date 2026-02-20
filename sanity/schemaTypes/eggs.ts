import { defineField, defineType } from "sanity";

export const eggs = defineType({
    name: "eggs",
    title: "Eggs",
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