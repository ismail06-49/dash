import { type SchemaTypeDefinition } from 'sanity'
import { eggs } from '@/sanity/schemaTypes/eggs'
import { chickens } from '@/sanity/schemaTypes/chickens'
import { feed } from '@/sanity/schemaTypes/feed'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [eggs, chickens, feed],
}
