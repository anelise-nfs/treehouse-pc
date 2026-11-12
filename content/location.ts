import type { Location } from '@/types/content';

export const parkCity: Location = {
  _id: 'location.park-city',
  _type: 'location',
  name: 'Treehouse Park City',
  slug: 'park-city',
  address: {
    street: '1209 Center Dr',
    city: 'Park City',
    region: 'UT',
    postalCode: '84098',
    country: 'US',
  },
  // No phone at launch, by the client's explicit direction. The field exists
  // on Location and nothing renders it — see the Location type and SiteFooter.
  // Putting a number back means restoring the footer's renderer too.
  email: 'holler@treehouseparkcity.com',
  // TEMPORARY, until opening. Real trading hours go back here as one entry per
  // line, and the two lines return to meaning what they are named — `days` a
  // day range, `hours` a time range. Both renderers read this single entry, so
  // restoring them is an edit here and nowhere else.
  hours: [{ _key: 'status', days: 'opening winter 2027', hours: 'check back soon' }],
  // PLACEHOLDER: real Google Maps place URL and embed src pending.
  mapUrl: 'https://maps.google.com/?q=1209+Center+Dr+Park+City+UT+84098',
  mapEmbedUrl: '',
  status: 'Opening this winter',
};
