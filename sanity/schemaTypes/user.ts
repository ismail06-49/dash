import { UserIcon } from "lucide-react";
import { defineField, defineType } from "sanity";

export const user = defineType({
    name: "user",
    title: "User",
    type: "document",
    icon: UserIcon,
    fields: [
        defineField({
            name: 'id',
            type: 'string',
        }),
        defineField({
            name: 'name',
            type: 'string',
        }),
        defineField({
            name: 'email',
            type: 'string',
        }),
        defineField({
            name: 'password',
            type: 'string',
        })
    ],
    preview: {
        select: {
            title: 'name'            
        }
    }
})