export interface RSVPData {
  id?: string;
  guestName: string;
  attending: boolean;
  dietary?: string;
  guestsCount: number;
  message?: string;
  createdAt: string;
}

export interface PhotoData {
  id: string;
  guestName: string;
  photoUrl: string;
  caption?: string;
  createdAt: string;
}

export interface CountdownData {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}
