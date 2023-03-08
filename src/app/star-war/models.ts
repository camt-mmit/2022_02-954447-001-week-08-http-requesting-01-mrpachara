type Raw<T, KI extends keyof T, O> = {
  [K in keyof T]: K extends KI ? O : T[K];
};

export type List<T> = {
  count: number;
  next: URL | null;
  previous: URL | null;
  results: T[];
};

export type RawList<T> = Raw<List<T>, 'next' | 'previous', string | null>;

export type SearchData = {
  search?: string;
  page?: string;
};

export type Person = {
  name: string; // The name of this person.
  birth_year: string; // The birth year of the person, using the in-universe standard of BBY or ABY - Before the Battle of Yavin or After the Battle of Yavin. The Battle of Yavin is a battle that occurs at the end of Star Wars episode IV: A New Hope.
  eye_color: string; // The eye color of this person. Will be "unknown" if not known or "n/a" if the person does not have an eye.
  gender: string; // The gender of this person. Either "Male", "Female" or "unknown", "n/a" if the person does not have a gender.
  hair_color: string; // The hair color of this person. Will be "unknown" if not known or "n/a" if the person does not have hair.
  height: string; // The height of the person in centimeters.
  mass: string; // The mass of the person in kilograms.
  skin_color: string; // The skin color of this person.
  homeworld: URL; // The URL of a planet resource, a planet that this person was born on or inhabits.
  films: URL[]; // An array of film resource URLs that this person has been in.
  species: URL[]; // An array of species resource URLs that this person belongs to.
  starships: URL[]; // An array of starship resource URLs that this person has piloted.
  vehicles: URL[]; // An array of vehicle resource URLs that this person has piloted.
  url: URL; // the hypermedia URL of this resource.
  created: Date; // the ISO 8601 date format of the time that this resource was created.
  edited: Date; // the ISO 8601 date format of the time that this resource was edited.
};

export type RawPerson = Raw<
  Raw<
    Raw<Person, 'homeworld' | 'url', string>,
    'films' | 'species' | 'starships' | 'vehicles',
    string[]
  >,
  'created' | 'edited',
  string
>;
