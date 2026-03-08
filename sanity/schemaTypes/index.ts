import { type SchemaTypeDefinition } from 'sanity'
import { user } from '@/sanity/schemaTypes/user'
import { eggs } from '@/sanity/schemaTypes/eggs'
import { chickens } from '@/sanity/schemaTypes/chickens'
import { feed } from '@/sanity/schemaTypes/feed'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [user, eggs, chickens, feed],
}
