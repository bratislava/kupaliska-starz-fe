export const facilities: Facility[] = [
  {
    key: "shower",
    label: "Sprchy",
  },
  {
    key: "changing-room",
    label: "Šatne",
  },
  {
    key: "food",
    label: "Občerstvenie",
  },
  {
    key: "playground",
    label: "Ihrisko pre deti",
  },
  {
    key: "volleyball",
    label: "Volejbalový kurt",
  },
  {
    key: "football",
    label: "Futbalové ihrisko",
  },
  {
    key: "parking",
    label: "Parkovanie",
  },
  {
    key: "accommodation",
    label: "Ubytovanie",
  },
];

interface Facility {
  key: string;
  label: string;
}

export interface OpeningHoursStrings {
  intervalString: string;
  dayStrings: { day: string, time: string, color: string }[];
}
export interface SwimmingPool {
  id: string;
  name: string;
  description: string;
  expandedDescription?: string;
  waterTemp?: number;
  maxCapacity?: number;
  facilities?: string[];
  locationUrl?: string;
  openingHours?: OpeningHoursStrings[];
  image: {
    originalFile: string;
    thumbnailSize: string;
    smallSize: string;
    mediumSize: string;
    largeSize: string;
    altText: string;
  };
}

export interface SwimmingPoolResponse {
  id: string;
  name: string;
  description: string;
  expandedDescription?: string;
  waterTemp?: number;
  maxCapacity?: number;
  facilities?: string[];
  locationUrl?: string;
  openingHours?: OpeningHoursResponse[];
  image: {
    originalFile: string;
    thumbnailSize: string;
    smallSize: string;
    mediumSize: string;
    largeSize: string;
    altText: string;
  };
}

export interface OpeningHours {
  interval: { from: Date; to: Date };
  days: {
    dayName: string;
    from: string;
    to: string;
  }[];
}

export interface OpeningHoursResponse {
  interval: { from: string; to: string };
  days: {
    dayName: string;
    from: string;
    to: string;
  }[];
}
