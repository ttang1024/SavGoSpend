/**
 * Sample seed data for building UI before Firestore is wired. Replace with
 * live queries against the `retailers`, `events`, and `articles` collections.
 */
import { GoodToKnowArticle, Retailer, WhatsOnEvent } from '@/types';

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
