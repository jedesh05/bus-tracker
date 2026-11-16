# Data coverage

Retrieved from the official MTC route-wise form on 15 November 2026: **685 routes**, **9,529 fare-stage entries**, zero failed retrievals. This is the complete set of selectable identifiers observed in that form, not a claim to include every service operated by MTC.

Every route is included in `data/routes.json`, with a source URL, retrieval time, source publication date, one actually published stage direction and an ordered stage list. All identifiers are preserved, including letters, prefixes and `#`. The route selector's value `1` is a placeholder labelled `--Route--`, so route 1 was not fabricated. Natural sorting begins with 1C in this particular snapshot.

Individual stops: **0**. Verified bus geometry: **0**. Coordinates: **0**. Independently verified return paths: **0**. Confirmed service-day schedules: **0**. Authorized live feed: **none**.

The separate timetable retrieval queried 685 route/origin/destination combinations, found **333 review candidates** with **8,711 listed departure entries**, and had zero request/format failures. A response without departure entries is not treated as evidence that no service runs. The source does not supply operating days or holiday validity, so candidates remain unpublished. See `data/timetable-candidates.json` and `data/timetable-coverage.json`.

Database status: all 685 routes imported as drafts; none published. Public Vercel builds read only explicitly published database data. The local reference-preview flag is ignored on Vercel.

Tourism: four verified attraction descriptions with source links and image provenance. Nearby bus stops, walking links, current opening hours, fees and accessibility were not fabricated.
