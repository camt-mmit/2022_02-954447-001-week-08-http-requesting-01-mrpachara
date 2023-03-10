import { integer } from './common';

export type ObjectType = 'OBJECT_TYPE_UNSPECIFIED' | 'PERSON' | 'PAGE';

export type SourceType =
  | 'SOURCE_TYPE_UNSPECIFIED'
  | 'ACCOUNT'
  | 'PROFILE'
  | 'DOMAIN_PROFILE'
  | 'CONTACT'
  | 'OTHER_CONTACT'
  | 'DOMAIN_CONTACT';

export type UserType =
  | 'USER_TYPE_UNKNOWN'
  | 'GOOGLE_USER'
  | 'GPLUS_USER'
  | 'GOOGLE_APPS_USER';

export type AgeRange =
  | 'AGE_RANGE_UNSPECIFIED'
  | 'LESS_THAN_EIGHTEEN'
  | 'EIGHTEEN_TO_TWENTY'
  | 'TWENTY_ONE_OR_OLDER';

export type ContentType =
  | 'CONTENT_TYPE_UNSPECIFIED'
  | 'TEXT_PLAIN'
  | 'TEXT_HTML';

export type KeywordType =
  | 'TYPE_UNSPECIFIED'
  | 'OUTLOOK_BILLING_INFORMATION'
  | 'OUTLOOK_DIRECTORY_SERVER'
  | 'OUTLOOK_KEYWORD'
  | 'OUTLOOK_MILEAGE'
  | 'OUTLOOK_PRIORITY'
  | 'OUTLOOK_SENSITIVITY'
  | 'OUTLOOK_SUBJECT'
  | 'OUTLOOK_USER'
  | 'HOME'
  | 'WORK'
  | 'OTHER';

export type NicknameType = 'DEFAULT' | 'ALTERNATE_NAME';

export type ReadSourceType =
  | 'READ_SOURCE_TYPE_UNSPECIFIED'
  | 'READ_SOURCE_TYPE_PROFILE'
  | 'READ_SOURCE_TYPE_CONTACT'
  | 'READ_SOURCE_TYPE_DOMAIN_CONTACT';

export type SortOrder =
  | 'LAST_MODIFIED_ASCENDING'
  | 'LAST_MODIFIED_DESCENDING'
  | 'FIRST_NAME_ASCENDING'
  | 'LAST_NAME_ASCENDING';

export type Date = {
  year?: integer;
  month?: integer;
  day?: integer;
};

export type ProfileMetadata = {
  objectType?: ObjectType;
  userTypes?: UserType[];
};

export type Source = {
  type?: SourceType;
  id?: string;
  etag?: string;
  updateTime?: string;
  profileMetadata?: ProfileMetadata;
};

export type FieldMetadata = {
  primary?: boolean;
  sourcePrimary?: boolean;
  verified?: boolean;
  source?: Source;
};

export type PersonMetadata = {
  sources?: Source[];
  previousResourceNames?: string[];
  linkedPeopleResourceNames?: string[];
  deleted?: boolean;
};

export type HasMetadata = {
  metadata?: FieldMetadata;
};

export type Address = HasMetadata & {
  formattedValue?: string;
  type?: string;
  formattedType?: string;
  poBox?: string;
  streetAddress?: string;
  extendedAddress?: string;
  city?: string;
  region?: string;
  postalCode?: string;
  country?: string;
  countryCode?: string;
};

export type AgeRangeType = HasMetadata & {
  ageRange?: AgeRange;
};

export type Biography = HasMetadata & {
  value?: string;
  contentType?: ContentType;
};

export type Birthday = HasMetadata & {
  date?: Date;
  text?: string;
};

export type CalendarUrl = HasMetadata & {
  url?: string;
  type?: string;
  formattedType?: string;
};

export type ClientData = HasMetadata & {
  key?: string;
  value?: string;
};

export type CoverPhoto = HasMetadata & {
  url?: string;
  default?: boolean;
};

export type EmailAddress = HasMetadata & {
  value?: string;
  type?: string;
  formattedType?: string;
  displayName?: string;
};

export type Event = HasMetadata & {
  date?: Date;
  type?: string;
  formattedType?: string;
};

export type ExternalId = HasMetadata & {
  value?: string;
  type?: string;
  formattedType?: string;
};

export type FileAs = HasMetadata & {
  value?: string;
};

export type Gender = HasMetadata & {
  value?: string;
  formattedValue?: string;
  addressMeAs?: string;
};

export type ImClient = HasMetadata & {
  username?: string;
  type?: string;
  formattedType?: string;
  protocol?: string;
  formattedProtocol?: string;
};

export type Interest = HasMetadata & {
  value?: string;
};

export type Locale = HasMetadata & {
  value?: string;
};

export type Location = HasMetadata & {
  value?: string;
  type?: string;
  current?: boolean;
  buildingId?: string;
  floor?: string;
  floorSection?: string;
  deskCode?: string;
};

export type ContactGroupMembership = {
  contactGroupResourceName?: string;
};

export type DomainMembership = {
  inViewerDomain?: boolean;
};

export type Membership = HasMetadata & {
  // Union field membership can be only one of the following:
  contactGroupMembership?: ContactGroupMembership;
  domainMembership?: DomainMembership;
  // End of list of possible types for union field membership.
};

export type MiscKeyword = HasMetadata & {
  value?: string;
  type?: KeywordType;
  formattedType?: string;
};

export type Name = HasMetadata & {
  displayName?: string;
  displayNameLastFirst?: string;
  unstructuredName?: string;
  familyName?: string;
  givenName?: string;
  middleName?: string;
  honorificPrefix?: string;
  honorificSuffix?: string;
  phoneticFullName?: string;
  phoneticFamilyName?: string;
  phoneticGivenName?: string;
  phoneticMiddleName?: string;
  phoneticHonorificPrefix?: string;
  phoneticHonorificSuffix?: string;
};

export type Nickname = HasMetadata & {
  value?: string;
  type?: NicknameType;
};

export type Occupation = HasMetadata & {
  value?: string;
};

export type Organization = HasMetadata & {
  type?: string;
  formattedType?: string;
  startDate?: Date;
  endDate?: Date;
  current?: boolean;
  name?: string;
  phoneticName?: string;
  department?: string;
  title?: string;
  jobDescription?: string;
  symbol?: string;
  domain?: string;
  location?: string;
  costCenter?: string;
  fullTimeEquivalentMillipercent?: integer;
};

export type PhoneNumber = HasMetadata & {
  value?: string;
  canonicalForm?: string;
  type?: string;
  formattedType?: string;
};

export type Photo = HasMetadata & {
  url?: string;
  default?: boolean;
};

export type Relation = HasMetadata & {
  person?: string;
  type?: string;
  formattedType?: string;
};

export type SipAddress = HasMetadata & {
  value?: string;
  type?: string;
  formattedType?: string;
};

export type Skill = HasMetadata & {
  value?: string;
};

export type Url = HasMetadata & {
  value?: string;
  type?: string;
  formattedType?: string;
};

export type UserDefined = HasMetadata & {
  key?: string;
  value?: string;
};

export type Person = {
  resourceName: string;
  etag: string;
  metadata?: PersonMetadata;
  addresses?: Address[];
  ageRanges?: AgeRangeType[];
  biographies?: Biography[];
  birthdays?: Birthday[];
  calendarUrls?: CalendarUrl[];
  clientData?: ClientData[];
  coverPhotos?: CoverPhoto[];
  emailAddresses?: EmailAddress[];
  events?: Event[];
  externalIds?: ExternalId[];
  fileAses?: FileAs[];
  genders?: Gender[];
  imClients?: ImClient[];
  interests?: Interest[];
  locales?: Locale[];
  locations?: Location[];
  memberships?: Membership[];
  miscKeywords?: MiscKeyword[];
  names?: Name[];
  nicknames?: Nickname[];
  occupations?: Occupation[];
  organizations?: Organization[];
  phoneNumbers?: PhoneNumber[];
  photos?: Photo[];
  relations?: Relation[];
  sipAddresses?: SipAddress[];
  skills?: Skill[];
  urls?: Url[];
  userDefined?: UserDefined[];
};

export type ConnectionsList = {
  connections: Person[];
  nextPageToken: string;
  nextSyncToken: string;
  totalItems: integer;
};

export type ConnectionsListParams = {
  personFields: string;
  pageToken?: string;
  pageSize?: integer;
  sortOrder?: SortOrder;
  requestSyncToken?: boolean;
  syncToken?: string;
  sources?: SourceType[];
};

export type CreateContactParams = {
  personFields: string;
  sources?: SourceType[];
};

/**
 * Parser Functions
 */

export function parseDate(data?: Date): Date {
  return { ...data };
}

export function parseProfileMetadata(data?: ProfileMetadata): ProfileMetadata {
  return { ...data };
}

export function parseSource(data?: Source): Source {
  return {
    ...data,
    profileMetadata: parseProfileMetadata(data?.profileMetadata),
  };
}

export function parseFieldMetadata(data?: FieldMetadata): FieldMetadata {
  return {
    ...data,
    source: parseSource(data?.source),
  };
}

export function parsePersonMetadata(data?: PersonMetadata): PersonMetadata {
  return {
    ...data,
    sources: (data?.sources || []).map((data: Source) => parseSource(data)),
  };
}

export function parseHasMetadata(data?: HasMetadata): HasMetadata {
  return {
    ...data,
    metadata: parseFieldMetadata(data?.metadata),
  };
}

export function parseAddress(data?: Address): Address {
  return {
    ...parseHasMetadata(data),
  };
}

export function parseAgeRangeType(data?: AgeRangeType): AgeRangeType {
  return {
    ...parseHasMetadata(data),
  };
}

export function parseBiography(data?: Biography): Biography {
  return {
    ...parseHasMetadata(data),
  };
}

export function parseBirthday(data?: Birthday): Birthday {
  return {
    ...parseHasMetadata(data),
  };
}

export function parseCalendarUrl(data?: CalendarUrl): CalendarUrl {
  return {
    ...parseHasMetadata(data),
  };
}

export function parseClientData(data?: ClientData): ClientData {
  return {
    ...parseHasMetadata(data),
  };
}

export function parseCoverPhoto(data?: CoverPhoto): CoverPhoto {
  return {
    ...parseHasMetadata(data),
  };
}

export function parseEmailAddress(data?: EmailAddress): EmailAddress {
  return {
    ...parseHasMetadata(data),
  };
}

export function parseEvent(data?: Event): Event {
  return {
    ...parseHasMetadata(data),
  };
}

export function parseExternalId(data?: ExternalId): ExternalId {
  return {
    ...parseHasMetadata(data),
  };
}

export function parseFileAs(data?: FileAs): FileAs {
  return {
    ...parseHasMetadata(data),
  };
}

export function parseGender(data?: Gender): Gender {
  return {
    ...parseHasMetadata(data),
  };
}

export function parseImClient(data?: ImClient): ImClient {
  return {
    ...parseHasMetadata(data),
  };
}

export function parseInterest(data?: Interest): Interest {
  return {
    ...parseHasMetadata(data),
  };
}

export function parseLocale(data?: Locale): Locale {
  return {
    ...parseHasMetadata(data),
  };
}

export function parseLocation(data?: Location): Location {
  return {
    ...parseHasMetadata(data),
  };
}

export function parseContactGroupMembership(
  data?: ContactGroupMembership,
): ContactGroupMembership {
  return { ...data };
}

export function parseDomainMembership(
  data?: DomainMembership,
): DomainMembership {
  return { ...data };
}

export function parseMembership(data?: Membership): Membership {
  const membership = {
    ...parseHasMetadata(data),
  } as Membership;

  if (membership?.contactGroupMembership) {
    membership.contactGroupMembership = parseContactGroupMembership(
      membership.contactGroupMembership,
    );
  }

  if (membership?.domainMembership) {
    membership.domainMembership = parseDomainMembership(
      membership.domainMembership,
    );
  }

  return membership;
}

export function parseMiscKeyword(data?: MiscKeyword): MiscKeyword {
  return {
    ...parseHasMetadata(data),
  };
}

export function parseName(data?: Name): Name {
  return {
    ...parseHasMetadata(data),
  };
}

export function parseNickname(data?: Nickname): Nickname {
  return {
    ...parseHasMetadata(data),
  };
}

export function parseOccupation(data?: Occupation): Occupation {
  return {
    ...parseHasMetadata(data),
  };
}

export function parseOrganization(data?: Organization): Organization {
  return {
    ...parseHasMetadata(data),
    startDate: parseDate(data?.startDate),
    endDate: parseDate(data?.endDate),
  };
}

export function parsePhoneNumber(data?: PhoneNumber): PhoneNumber {
  return {
    ...parseHasMetadata(data),
  };
}

export function parsePhoto(data?: Photo): Photo {
  return {
    ...parseHasMetadata(data),
  };
}

export function parseRelation(data?: Relation): Relation {
  return {
    ...parseHasMetadata(data),
  };
}

export function parseSipAddress(data?: SipAddress): SipAddress {
  return {
    ...parseHasMetadata(data),
  };
}

export function parseSkill(data?: Skill): Skill {
  return {
    ...parseHasMetadata(data),
  };
}

export function parseUrl(data?: Url): Url {
  return {
    ...parseHasMetadata(data),
  };
}

export function parseUserDefined(data?: UserDefined): UserDefined {
  return {
    ...parseHasMetadata(data),
  };
}

export function parsePerson(data: Person): Person {
  return {
    ...data,
    metadata: parsePersonMetadata(data?.metadata),
    addresses: (data?.addresses || []).map((data: Address) =>
      parseAddress(data),
    ),
    ageRanges: (data?.ageRanges || []).map((data: AgeRangeType) =>
      parseAgeRangeType(data),
    ),
    biographies: (data?.biographies || []).map((data: Biography) =>
      parseBiography(data),
    ),
    birthdays: (data?.birthdays || []).map((data) => parseBirthday(data)),
    calendarUrls: (data?.calendarUrls || []).map((data) =>
      parseCalendarUrl(data),
    ),
    clientData: (data?.clientData || []).map((data) => parseClientData(data)),
    coverPhotos: (data?.coverPhotos || []).map((data) => parseCoverPhoto(data)),
    emailAddresses: (data?.emailAddresses || []).map((data) =>
      parseEmailAddress(data),
    ),
    events: (data?.events || []).map((data) => parseEvent(data)),
    externalIds: (data?.externalIds || []).map((data) => parseExternalId(data)),
    fileAses: (data?.fileAses || []).map((data) => parseFileAs(data)),
    genders: (data?.genders || []).map((data) => parseGender(data)),
    imClients: (data?.imClients || []).map((data) => parseImClient(data)),
    interests: (data?.interests || []).map((data) => parseInterest(data)),
    locales: (data?.locales || []).map((data) => parseLocale(data)),
    locations: (data?.locations || []).map((data) => parseLocation(data)),
    memberships: (data?.memberships || []).map((data) => parseMembership(data)),
    miscKeywords: (data?.miscKeywords || []).map((data) =>
      parseMiscKeyword(data),
    ),
    names: (data?.names || []).map((data) => parseName(data)),
    nicknames: (data?.nicknames || []).map((data) => parseNickname(data)),
    occupations: (data?.occupations || []).map((data) => parseOccupation(data)),
    organizations: (data?.organizations || []).map((data) =>
      parseOrganization(data),
    ),
    phoneNumbers: (data?.phoneNumbers || []).map((data) =>
      parsePhoneNumber(data),
    ),
    photos: (data?.photos || []).map((data) => parsePhoto(data)),
    relations: (data?.relations || []).map((data) => parseRelation(data)),
    sipAddresses: (data?.sipAddresses || []).map((data) =>
      parseSipAddress(data),
    ),
    skills: (data?.skills || []).map((data) => parseSkill(data)),
    urls: (data?.urls || []).map((data) => parseUrl(data)),
    userDefined: (data?.userDefined || []).map((data) =>
      parseUserDefined(data),
    ),
  };
}

export function parseConnectionsList(data: ConnectionsList): ConnectionsList {
  return {
    ...data,
    connections: (data?.connections || []).map((data) => parsePerson(data)),
  };
}

/**
 * Helper Functions
 */
export function getPrimaryMetadata<T extends HasMetadata>(
  items: T[],
): T | undefined {
  return items.find((item) => item?.metadata?.primary);
}

export function displayName(names: Name[]): string | undefined {
  return getPrimaryMetadata(names)?.displayName;
}

export function displayEmailAddress(
  emailAddresses: EmailAddress[],
): string | undefined {
  return getPrimaryMetadata(emailAddresses)?.value;
}

export function displayPhoneNumber(
  phoneNumbers: PhoneNumber[],
): string | undefined {
  return getPrimaryMetadata(phoneNumbers)?.value;
}

export function urlPhotos(photos: Photo[]): string | undefined {
  return getPrimaryMetadata(photos)?.url;
}
