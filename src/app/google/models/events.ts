import { date, datetime, etag, integer } from './common';

export type EventResource = {
  kind: 'calendar#event';
  etag: etag;
  id: string;
  status?: string;
  htmlLink?: string;
  created?: datetime;
  updated?: datetime;
  summary?: string;
  description?: string;
  location?: string;
  colorId?: string;
  creator?: {
    id?: string;
    email?: string;
    displayName?: string;
    self?: boolean;
  };
  organizer?: {
    id?: string;
    email?: string;
    displayName?: string;
    self?: boolean;
  };
  start?: {
    date?: date;
    dateTime?: datetime | Date;
    timeZone?: string;
  };
  end?: {
    date?: date;
    dateTime?: datetime | Date;
    timeZone?: string;
  };
  endTimeUnspecified?: boolean;
  recurrence?: [string];
  recurringEventId?: string;
  originalStartTime?: {
    date?: date;
    dateTime?: datetime;
    timeZone?: string;
  };
  transparency?: string;
  visibility?: string;
  iCalUID?: string;
  sequence?: integer;
  attendees?: [
    {
      id?: string;
      email?: string;
      displayName?: string;
      organizer?: boolean;
      self?: boolean;
      resource?: boolean;
      optional?: boolean;
      responseStatus?: string;
      comment?: string;
      additionalGuests?: integer;
    },
  ];
  attendeesOmitted?: boolean;
  extendedProperties?: {
    private?: {
      [key: string]: string;
    };
    shared?: {
      [key: string]: string;
    };
  };
  hangoutLink?: string;
  conferenceData?: {
    createRequest?: {
      requestId?: string;
      conferenceSolutionKey?: {
        type?: string;
      };
      status?: {
        statusCode?: string;
      };
    };
    entryPoints?: [
      {
        entryPointType?: string;
        uri?: string;
        label?: string;
        pin?: string;
        accessCode?: string;
        meetingCode?: string;
        passcode?: string;
        password?: string;
      },
    ];
    conferenceSolution?: {
      key?: {
        type?: string;
      };
      name?: string;
      iconUri?: string;
    };
    conferenceId?: string;
    signature?: string;
    notes?: string;
  };
  gadget?: {
    type?: string;
    title?: string;
    link?: string;
    iconLink?: string;
    width?: integer;
    height?: integer;
    display?: string;
    preferences?: {
      [key: string]: string;
    };
  };
  anyoneCanAddSelf?: boolean;
  guestsCanInviteOthers?: boolean;
  guestsCanModify?: boolean;
  guestsCanSeeOtherGuests?: boolean;
  privateCopy?: boolean;
  locked?: boolean;
  reminders?: {
    useDefault?: boolean;
    overrides?: [
      {
        method?: string;
        minutes?: integer;
      },
    ];
  };
  source?: {
    url?: string;
    title?: string;
  };
  attachments?: [
    {
      fileUrl?: string;
      title?: string;
      mimeType?: string;
      iconLink?: string;
      fileId?: string;
    },
  ];
  eventType?: string;
};

export type EventsList = {
  kind: 'calendar#events';
  etag: etag;
  summary?: string;
  description?: string;
  updated?: datetime;
  timeZone?: string;
  accessRole?: string;
  defaultReminders?: [
    {
      method?: string;
      minutes?: integer;
    },
  ];
  nextPageToken?: string;
  nextSyncToken?: string;
  items?: EventResource[];
};

export type EventQueryParams = {
  alwaysIncludeEmail?: boolean; //Deprecated and ignored. A value will always be returned in the email field for the organizer, creator and attendees, even if no real email address is available (i.e. a generated, non-working value will be provided).
  iCalUID?: string; //Specifies an event ID in the iCalendar format to be provided in the response. Optional. Use this if you want to search for an event by its iCalendar ID.
  maxAttendees?: integer; //The maximum number of attendees to include in the response. If there are more than the specified number of attendees, only the participant is returned. Optional.
  maxResults?: integer; //Maximum number of events returned on one result page. The number of events in the resulting page may be less than this value, or none at all, even if there are more events matching the query. Incomplete pages can be detected by a non-empty nextPageToken field in the response. By default the value is 250 events. The page size can never be larger than 2500 events. Optional.
  orderBy?: 'startTime' | 'updated'; //The order of the events returned in the result. Optional. The default is an unspecified, stable order.

  pageToken?: string; // Token specifying which result page to return. Optional.
  privateExtendedProperty?: string; //Extended properties constraint specified as propertyName=value. Matches only private properties. This parameter might be repeated multiple times to return events that match all given constraints.
  q?: string; // Free text search terms to find events that match these terms in the following fields: summary, description, location, attendee's displayName, attendee's email. Optional.
  sharedExtendedProperty?: string; // Extended properties constraint specified as propertyName=value. Matches only shared properties. This parameter might be repeated multiple times to return events that match all given constraints.
  showDeleted?: boolean; // Whether to include deleted events (with status equals "cancelled") in the result. Cancelled instances of recurring events (but not the underlying recurring event) will still be included if showDeleted and singleEvents are both False. If showDeleted and singleEvents are both True, only single instances of deleted events (but not the underlying recurring events) are returned. Optional. The default is False.
  showHiddenInvitations?: boolean; // Whether to include hidden invitations in the result. Optional. The default is False.
  singleEvents?: boolean; // Whether to expand recurring events into instances and only return single one-off events and instances of recurring events, but not the underlying recurring events themselves. Optional. The default is False.
  syncToken?: string; // Token obtained from the nextSyncToken field returned on the last page of results from the previous list request. It makes the result of this list request contain only entries that have changed since then. All events deleted since the previous list request will always be in the result set and it is not allowed to set showDeleted to False.

  timeMax?: datetime; // Upper bound (exclusive) for an event's start time to filter by. Optional. The default is not to filter by start time. Must be an RFC3339 timestamp with mandatory time zone offset, for example, 2011-06-03T10:00:00-07:00, 2011-06-03T10:00:00Z. Milliseconds may be provided but are ignored. If timeMin is set, timeMax must be greater than timeMin.
  timeMin?: datetime; // Lower bound (exclusive) for an event's end time to filter by. Optional. The default is not to filter by end time. Must be an RFC3339 timestamp with mandatory time zone offset, for example, 2011-06-03T10:00:00-07:00, 2011-06-03T10:00:00Z. Milliseconds may be provided but are ignored. If timeMax is set, timeMin must be smaller than timeMax.
  timeZone?: string; // Time zone used in the response. Optional. The default is the time zone of the calendar.
  updatedMin?: datetime; // Lower bound for an event's last modification time (as a RFC3339 timestamp) to filter by. When specified, entries deleted since this time will always be included regardless of showDeleted. Optional. The default is not to filter by last modification time.
};

/**
 * Parser Functions
 */

export function parseEventResource(data: EventResource): EventResource {
  return {
    ...data,
    ...(data?.start
      ? {
          start: {
            ...data.start,
            dateTime: data.start.dateTime
              ? new Date(data.start.dateTime)
              : undefined,
          },
        }
      : null),
    ...(data?.end
      ? {
          end: {
            ...data.end,
            dateTime: data.end.dateTime
              ? new Date(data.end.dateTime)
              : undefined,
          },
        }
      : null),
  };
}

export function parseEventsList(data: EventsList): EventsList {
  return {
    ...data,
    items: (data?.items || []).map((item) => parseEventResource(item)),
  };
}

/**
 * Helper Functions
 */

export function displayEventTimeRange(eventResource: EventResource): string {
  const start: Date | string | null | undefined =
    eventResource.start?.dateTime ?? eventResource.start?.date;
  const end: Date | string | null | undefined =
    eventResource.end?.dateTime ?? eventResource.end?.date;

  let result = '';

  if (start && end) {
    if (start instanceof Date && end instanceof Date) {
      const startString = start.toLocaleString(undefined, {
        dateStyle: 'short',
        timeStyle: 'short',
      });

      const startDate = start.toLocaleDateString(undefined, {
        dateStyle: 'short',
      });
      const endDate = end.toLocaleDateString(undefined, {
        dateStyle: 'short',
      });
      if (startDate === endDate) {
        const startTime = start.toLocaleTimeString(undefined, {
          timeStyle: 'short',
        });
        const endTime = end.toLocaleTimeString(undefined, {
          timeStyle: 'short',
        });

        result = `${startDate} ${startTime} - ${endTime}`;
      } else {
        const endString = end.toLocaleString(undefined, {
          dateStyle: 'short',
          timeStyle: 'short',
        });

        result = `${startString} to ${endString}`;
      }
    } else {
      result = `${start} to ${end}`;
    }
  } else if (start) {
    result = `${start}`;
  } else if (end) {
    result = `${end}`;
  } else {
    result = 'Unkonwn';
  }

  return result;
}
