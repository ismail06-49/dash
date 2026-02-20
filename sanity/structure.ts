import type {StructureResolver} from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.documentTypeListItem('eggs').title('Eggs'),
      S.documentTypeListItem('chickens').title('Chickens'),
      S.documentTypeListItem('feed').title('Feed'),
    ])
