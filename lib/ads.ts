import type { AdProfile } from "./tools/registry";

export type AdPlacement = "top" | "sidebar" | "in-content" | "result";

export type AdSlotConfig = {
  placement: AdPlacement;
  minHeight: number;
  lazy: boolean;
};

const adPlans: Record<AdProfile, AdSlotConfig[]> = {
  light: [
    { placement: "top", minHeight: 90, lazy: false },
    { placement: "result", minHeight: 90, lazy: true }
  ],
  standard: [
    { placement: "top", minHeight: 90, lazy: false },
    { placement: "in-content", minHeight: 120, lazy: true },
    { placement: "sidebar", minHeight: 280, lazy: true }
  ],
  "high-intent": [
    { placement: "top", minHeight: 90, lazy: false },
    { placement: "in-content", minHeight: 120, lazy: true },
    { placement: "result", minHeight: 90, lazy: true },
    { placement: "sidebar", minHeight: 280, lazy: true }
  ]
};

export function getAdPlan(profile: AdProfile) {
  return adPlans[profile];
}
