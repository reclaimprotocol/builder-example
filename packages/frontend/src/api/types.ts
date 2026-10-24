/** A provider you can verify against. */
export interface Provider {
  id: string;
  name: string;
}

/** The backend's record of a verification. `fields` is set on success, and `error` on any other terminal status. */
export interface Verification {
  id: string;
  providerId: string;
  status: 'pending' | 'success' | 'rejected' | 'error' | 'cancelled' | 'expired';
  verificationUrl: string;
  createdAt: string;
  updatedAt: string;
  fields?: { label: string; value: string }[];
  error?: { code: string };
}
