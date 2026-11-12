import type { FemurApi } from "../contracts";
import { mockAccount } from "./account";
import { mockAdmin } from "./admin";
import { mockAuth } from "./auth";
import { mockAppointments, mockAvailability, mockCatalog, mockCms, mockPractitioners, mockPricing } from "./public";

/** MOCK adapter — sample data for development & design review. See docs/architecture/FRONTEND.md §6. */
export const mockApi: FemurApi = {
  cms: mockCms,
  catalog: mockCatalog,
  practitioners: mockPractitioners,
  pricing: mockPricing,
  availability: mockAvailability,
  appointments: mockAppointments,
  auth: mockAuth,
  account: mockAccount,
  admin: mockAdmin,
};
