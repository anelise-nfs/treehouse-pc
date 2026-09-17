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
  phone: '(415) 860-3698',
  email: 'fontaine@treehouseparkcity.com',
  hours: [{ _key: 'everyday', days: 'open every day', hours: '8am – 7pm' }],
  // PLACEHOLDER: real Google Maps place URL and embed src pending.
  mapUrl: 'https://maps.google.com/?q=1209+Center+Dr+Park+City+UT+84098',
  mapEmbedUrl: '',
  status: 'Opening this winter',
};
