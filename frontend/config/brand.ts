/**
 * Decorative photography for page chrome that is not CMS-managed (page heroes, CTA bands, panels).
 * Stand-in stock photography (Unsplash licence) until Femur supplies its own photos.
 */
const photo = (id: string, w = 1800) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=75`;

export const brandImagery = {
  authPanel: { src: photo("1666214277730-e9c7e755e5a3", 1600), alt: "" },
  services: photo("1518310383802-640c2de311b2"),
  about: photo("1581056771107-24ca5f033842"),
  specialists: photo("1666214277730-e9c7e755e5a3"),
  pricing: photo("1571019613454-1cb2f99b2d8b"),
  membership: photo("1518611012118-696072aa579a"),
  contact: photo("1540497077202-7c8a3999166f"),
  story: photo("1576765608866-5b51046452be"),
  nira: photo("1666214277730-e9c7e755e5a3"),
  cta: photo("1518611012118-696072aa579a"),
  panel: photo("1616279969856-759f316a5ac1", 1400),
} as const;
