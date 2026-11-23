export interface StoryChapter {
  id: string;
  dateLabel: string;
  title: string;
  location: string;
  description: string;
  image: string;
}

export interface ScheduleEventItem {
  time: string;
  title: string;
  detail: string;
}

export interface CeremonyTab {
  id: 'vu-quy' | 'thanh-hon' | 'tiec-cuoi';
  label: string;
  subtitle: string;
  dateText: string;
  lunarDate: string;
  timeRange: string;
  venueName: string;
  address: string;
  mapQuery: string;
  mapUrl?: string;
  events: ScheduleEventItem[];
}

export interface GalleryPhoto {
  id: string;
  src: string;
  caption: string;
  location: string;
  aspect: 'portrait' | 'landscape' | 'wide';
}

export interface BankAccount {
  role: string;
  ownerName: string;
  bankName: string;
  accountNumber: string;
  branch: string;
}

export interface WishEntry {
  id: string;
  author: string;
  relation: string;
  message: string;
  createdAt: string;
  hearts: number;
}

export interface RsvpSubmission {
  id: string;
  fullName: string;
  phone: string;
  attending: 'yes' | 'no';
  ceremonyChoice: string;
  guestCount: number;
  dietaryNote: string;
  submittedAt: string;
}

export interface WeddingConfig {
  groomName: string;
  groomFullName: string;
  brideName: string;
  brideFullName: string;
  monogram: string;
  weddingDateISO: string;
  displayDate: string;
  lunarDisplayDate: string;
  city: string;
  heroQuote: string;
  heroImage: string;
  venueImage: string;
  groomParents: {
    father: string;
    mother: string;
    address: string;
  };
  brideParents: {
    father: string;
    mother: string;
    address: string;
  };
  brideRank?: string;
  groomRank?: string;
  invitationGreeting: string;
  storyChapters: StoryChapter[];
  ceremonies: CeremonyTab[];
  gallery: GalleryPhoto[];
  dressCode: {
    title: string;
    note: string;
    swatches: Array<{ name: string; hex: string }>;
  };
  bankAccounts: BankAccount[];
}
