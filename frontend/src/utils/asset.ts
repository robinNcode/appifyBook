// Prefix a public-folder asset path with Vite's configured base URL.
//
// Vite rewrites asset URLs in index.html, but NOT string literals inside
// components — so `/assets/images/x.png` would resolve at the domain root
// instead of under the /appifybook/ subpath. Route every static asset through
// this helper so it always points at `${BASE_URL}assets/...`.
//
// BASE_URL is '/appifybook/' in production and '/' in dev, both with a
// trailing slash, so we strip any leading slash off the given path.
const BASE_URL = import.meta.env.BASE_URL

export const asset = (path: string): string =>
  `${BASE_URL}${path.replace(/^\/+/, '')}`
