/**
 * Internal content-status markers. They are intentionally invisible on the public site.
 * (Kept as components so call sites and the CMS "confirmed" flow stay simple.)
 */
export function PlaceholderMark(props: { className?: string; label?: string }) {
  void props;
  return null;
}

export function DemoNotice(props: { className?: string; children?: React.ReactNode }) {
  void props;
  return null;
}
