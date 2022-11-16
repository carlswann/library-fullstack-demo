export interface IPerson {
  birth_year: number | null,
  death_year: number | null,
  name: string
}

export class BookEntity {
  _id: string;

  gutenbergId: number;
  authors: IPerson[];
  bookshelves: string[];
  copyright: boolean;
  download_count: number;
  formats: Record<string, string>;
  languages: string[];
  media_type: string;
  subjects: string[];
  title: string;
  translators: IPerson[];
  shortlisted: boolean;
  reserved: boolean;
}
