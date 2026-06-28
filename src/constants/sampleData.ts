/**
 * Sample seed data for building UI before Firestore is wired. Replace with
 * live queries against the `retailers`, `events`, and `articles` collections.
 */
import { GoodToKnowArticle, RedeemableReward, Retailer, WhatsOnEvent } from '@/types';

export const SAMPLE_RETAILERS: Retailer[] = [
  {
    id: 'r1',
    name: 'Riverside Café',
    category: 'Café',
    description: 'Friendly café with step-free access and accessible bathrooms.',
    address: '12 Victoria St, Hamilton',
    country: 'NZ',
    latitude: -37.7833,
    longitude: 175.2833,
    pointsPerVisit: 10,
    phone: '+6478380000',
  },
  {
    id: 'r2',
    name: 'Te Awa Pharmacy',
    category: 'Pharmacy',
    description: 'Pharmacy offering free blood-pressure checks for members.',
    address: '5 Ward St, Hamilton',
    country: 'NZ',
    latitude: -37.7872,
    longitude: 175.2799,
    pointsPerVisit: 15,
  },
  {
    id: 'r3',
    name: 'Garden City Books',
    category: 'Retail',
    description: 'Independent bookshop with comfortable seating and large-print titles.',
    address: '88 Grey St, Hamilton',
    country: 'NZ',
    latitude: -37.7901,
    longitude: 175.2912,
    pointsPerVisit: 10,
  },
];

export const SAMPLE_EVENTS: WhatsOnEvent[] = [
  {
    id: 'e0',
    title: 'Seniors Matinee Concert',
    summary: 'A past event — kept here to show the upcoming-events filter at work.',
    startsAt: '2026-06-20T13:00:00+12:00',
    location: 'Clarence Street Theatre, Hamilton',
    country: 'NZ',
  },
  {
    id: 'e1',
    title: 'Riverbank Morning Walk',
    summary: 'Gentle guided walk along the Waikato River. All paces welcome.',
    startsAt: '2026-07-05T09:30:00+12:00',
    location: 'Memorial Park, Hamilton',
    country: 'NZ',
  },
  {
    id: 'e2',
    title: 'Community Morning Tea',
    summary: 'Meet other members over a cuppa. Free for SGO members.',
    startsAt: '2026-07-08T10:00:00+12:00',
    location: 'Garden Place, Hamilton',
    country: 'NZ',
  },
  {
    id: 'e3',
    title: 'Library Tech Help Drop-in',
    summary: 'Bring your phone — friendly volunteers help with apps, photos, and calls.',
    startsAt: '2026-07-15T14:00:00+12:00',
    location: 'Hamilton Central Library',
    country: 'NZ',
  },
];

/**
 * Sample Smart Rewards catalogue. Members spend their points balance on these;
 * replace with a `rewards` Firestore collection when the catalogue is live.
 */
export const SAMPLE_REWARDS: RedeemableReward[] = [
  {
    id: 'rw1',
    title: '$5 off your next coffee',
    description: 'Redeem at any participating café.',
    cost: 80,
    icon: '☕',
  },
  {
    id: 'rw2',
    title: 'Free reusable SGO tote bag',
    description: 'Collect in store with your membership card.',
    cost: 150,
    icon: '🛍️',
  },
  {
    id: 'rw3',
    title: '$10 pharmacy voucher',
    description: 'Towards anything in store at Te Awa Pharmacy.',
    cost: 250,
    icon: '💊',
  },
];

export const SAMPLE_ARTICLES: GoodToKnowArticle[] = [
  {
    id: 'a1',
    title: 'Getting around Hamilton',
    category: 'Transport',
    body: 'Local buses are free for SuperGold cardholders during off-peak hours. Look for the BUSIT stops marked in orange.',
  },
  {
    id: 'a2',
    title: 'Staying safe in the sun',
    category: 'Wellbeing',
    body: 'Even on cool days the NZ sun is strong. Slip, slop, slap and wrap when you’re out exploring.',
  },
  {
    id: 'a3',
    title: 'Using your membership card',
    category: 'Membership',
    body: 'Show your digital card at any participating retailer to collect Smart Rewards points. It works offline and never expires.',
  },
];
