import { defineQuery } from "next-sanity";

export const AUTHOR_BY_GEMAIL_QUERY =
    defineQuery(`*[_type == 'user' && email == $email][0]{
        _id,
        id,
        name,
        username,
        email,
        password,
    }`);

export const EGGS_QUERY = defineQuery(`
    *[_type == 'eggs' && defined(quantity)] | order(date desc) {
        id,
        price,
        date,
        quantity,
        paymentMade
    }`)

    export const CHICKENS_QUERY = defineQuery(`
    *[_type == 'chickens' && defined(quantity)] | order(date desc) {
        id,
        price,
        date,
        quantity,
        paymentMade
    }`)

    export const FEED_QUERY = defineQuery(`
    *[_type == 'feed' && defined(quantity)] | order(date desc) {
        id,
        price,
        date,
        quantity,
        type,
        paymentMade
    }`)