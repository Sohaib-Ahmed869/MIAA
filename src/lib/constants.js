export const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "About Us", path: "/about" },
  { label: "Islamic Art in Australia", path: "/islamic-art" },
  { label: "MIAA Offsite Events", path: "/offsite-events" },
  { label: "Gala Dinner", path: "/gala-dinner" },
  { label: "Sydney Muslim Writers Festival", path: "/smwf" },
  { label: "Education & Community Engagement", path: "/community-engagement" },
  { label: "Timeline & Construction", path: "/timeline" },
  // { label: "Updates & Blogs", path: "/blog" },
  { label: "Donate", path: "/donate" },
  { label: "Volunteer", path: "/volunteer" },
  { label: "Contact Us", path: "/contact" },
]

export const FOOTER_LINKS = [
  { label: "Islamic Art in Australia", path: "/islamic-art" },
  { label: "MIAA Off-Site Events", path: "/offsite-events" },
  { label: "Sydney Muslim Writers Festival", path: "/smwf" },
  { label: "Community Engagement & Education", path: "/community-engagement" },
  { label: "MIAA Timeline & Construction", path: "/timeline" },
  { label: "Volunteer", path: "/volunteer" },
  { label: "Contact Us", path: "/contact" },
]

// Social accounts moved to ./socials.js — their addresses are Site Content
// fields now (`footer.social.*`), so they're editable without a deploy.

export const ACKNOWLEDGMENT_TEXT =
  "MIAA is proudly located on beautiful Dharug country in Granville, Western Sydney. The Museum of Islamic Art Australia (MIAA) respectfully acknowledges the Burramattagal people of the Dharug Nation as the Traditional Owners of the land on which the museum will be located. We pay our respects to Elders past, present and emerging. Sovereignty has never been ceded."

export const EVENTS = [
  {
    date: "July 25, 2026",
    location: "The Kaldor Hall, Naala Nura Building, Art Gallery of NSW",
    title: "SAVE THE DATE — Inaugural Gala Dinner 2026",
    description:
      "The Museum of Islamic Art Australia cordially invites you to the MIAA inaugural Gala Dinner.",
    image: "offsiteimg-01.png",
  },
  {
    date: "May 16, 2026",
    location: "ISRA Centre, Sydney",
    title: "'Zamzam for Everyone' Story Time and Book Launch",
    description:
      "Join children's author Razeena Omar Gutta for a special storytelling session celebrating her new book 'Zamzam for Everyone: Sharing Water at Hajj.'",
    image: "offsiteimg-02.png",
  },
  {
    date: "April 19, 2026",
    location: "ISRA Academy, Sydney",
    title: "Workshop Day Sydney Muslim Writers Festival",
    description: "An art fair showcasing Islamic artistic expressions.",
    image: "offsiteimg-03.png",
  },
  {
    date: "April 18, 2026",
    location: "Bryan Brown Theatre, Bankstown",
    title: "Festival Day Sydney Muslim Writers Festival",
    description:
      "Our theme this year 'Beyond Noise' is about filtering out the excess of opinions in modern discourse to amplify voices that are constructive, authentic, and rooted in knowledge.",
    image: "offsiteimg-04.png",
  },
]

export const TIMELINE_MILESTONES = [
  { year: "2023", text: "Grant approved by the NSW Government's West Invest Program" },
  { year: "2024", text: "Project site confirmed in Western Sydney" },
  { year: "2025", text: "Land acquired and branding revealed" },
  { year: "2026", text: "Architectural design and development underway" },
]

export const BLOG_POSTS = [
  {
    slug: "the-art-of-connection",
    title: "The Art of Connection",
    description: "Learn more about our growing creative communities",
    image: "Rectangle 100 (4).png",
    category: "Blog",
  },
  {
    slug: "heritage-and-design",
    title: "Heritage and Design",
    description:
      "Explore the heritage and innovation behind the Museum's creative vision and design.",
    image: "Rectangle 100 (5).png",
    category: "Blog",
  },
  {
    slug: "behind-the-vision",
    title: "Behind the Vision",
    description:
      "Meet the people and ideas shaping the Museum of Islamic Art Australia's journey.",
    image: "Rectangle 100 (6).png",
    category: "Blog",
  },
]

// Articles used by the Blog index + detail pages.
// "Update" = MIAA Updates row; "Blog" = MIAA Blog Posts row.
export const BLOG_ARTICLES = [
  // --- MIAA Updates ---
  {
    slug: "art-of-connection-update",
    category: "Update",
    image: "Rectangle 100 (4).png",
    title: "The Art of Connection",
    description:
      "How MIAA is bringing communities together through art, programming and storytelling.",
    date: "November 20, 2025",
    author: "MIAA Team",
  },
  {
    slug: "behind-the-vision-update",
    category: "Update",
    image: "Rectangle 100 (5).png",
    title: "Behind the Vision",
    description:
      "Meet the curators, advisors and partners shaping the museum's first chapter.",
    date: "October 15, 2025",
    author: "MIAA Team",
  },
  {
    slug: "heritage-and-design-update",
    category: "Update",
    image: "Rectangle 100 (6).png",
    title: "Heritage and Design",
    description:
      "Heritage references and design language guiding MIAA's architectural identity.",
    date: "September 28, 2025",
    author: "MIAA Team",
  },
  {
    slug: "westinvest-progress",
    category: "Update",
    image: "Rectangle 100 (4).png",
    title: "WestInvest Project Progress",
    description:
      "An update on planning, design and delivery milestones since the WestInvest grant.",
    date: "August 10, 2025",
    author: "MIAA Team",
  },
  {
    slug: "site-secured-granville",
    category: "Update",
    image: "Rectangle 100 (5).png",
    title: "Granville Site Secured",
    description:
      "A community-defining moment as the museum site is formally secured in Western Sydney.",
    date: "July 5, 2025",
    author: "MIAA Team",
  },
  {
    slug: "design-competition-launch",
    category: "Update",
    image: "Rectangle 100 (6).png",
    title: "Architect Design Competition Launch",
    description:
      "MIAA officially launched its Architect Design Competition in August 2025.",
    date: "August 1, 2025",
    author: "MIAA Team",
  },

  // --- MIAA Blog Posts ---
  {
    slug: "stories-behind-the-creative-process",
    category: "Blog",
    image: "Rectangle 100 (4).png",
    title: "Stories Behind the Creative Process",
    description:
      "Insights into artists, makers, and cultural storytelling.",
    date: "December 16, 2025",
    author: "George Green",
    featured: true,
  },
  {
    slug: "mihrab-sacred-spaces",
    category: "Blog",
    image: "Rectangle 100 (5).png",
    title: "The Art of the Mihrab: Sacred Spaces",
    description:
      "Exploring the architectural niche's significance in mosque design and Islamic tradition.",
    date: "November 5, 2025",
    author: "Amina Khalil",
  },
  {
    slug: "scholars-recap",
    category: "Blog",
    image: "Rectangle 100 (6).png",
    title: "Scholars Explore the Legacy of Islamic Science",
    description:
      "Panel discussion from the House of Wisdom through the European Renaissance.",
    date: "October 22, 2025",
    author: "Dr. Yusuf Rahman",
  },
  {
    slug: "safiyya-bello-spotlight",
    category: "Blog",
    image: "Rectangle 100 (4).png",
    title: "Artist Spotlight: Safiyya Bello",
    description:
      "A Western Sydney artist whose geometric paintings examine identity and home.",
    date: "September 14, 2025",
    author: "Layla Mahmoud",
  },
  {
    slug: "muslim-writers-festival-recap",
    category: "Blog",
    image: "Rectangle 100 (5).png",
    title: "Sydney Muslim Writers Festival Recap",
    description:
      "Highlights from a weekend of literature, conversation and craft in Western Sydney.",
    date: "August 30, 2025",
    author: "MIAA Team",
  },
  {
    slug: "children-gallery-preview",
    category: "Blog",
    image: "Rectangle 100 (6).png",
    title: "A Preview of the Children's Gallery",
    description:
      "A first look at the Southern hemisphere's first dedicated Islamic arts children's space.",
    date: "July 18, 2025",
    author: "MIAA Team",
  },
  {
    slug: "calligraphy-traditions",
    category: "Update",
    image: "Rectangle 100 (4).png",
    title: "Calligraphy Traditions in the Modern Age",
    description:
      "How traditional Islamic calligraphy is finding new expression in contemporary Australian art.",
    date: "June 25, 2025",
    author: "MIAA Team",
  },
  {
    slug: "community-voices",
    category: "Update",
    image: "Rectangle 100 (5).png",
    title: "Community Voices: What MIAA Means to Us",
    description:
      "Local community members share their hopes and excitement for Australia's first Islamic art museum.",
    date: "June 10, 2025",
    author: "MIAA Team",
  },
  {
    slug: "architecture-reveal",
    category: "Update",
    image: "Rectangle 100 (6).png",
    title: "Architecture Reveal: First Look",
    description:
      "An exclusive first look at the architectural vision for the Museum of Islamic Art Australia.",
    date: "May 28, 2025",
    author: "MIAA Team",
  },
  {
    slug: "partnerships-announcement",
    category: "Update",
    image: "Rectangle 100 (4).png",
    title: "New Cultural Partnerships Announced",
    description:
      "MIAA partners with leading cultural institutions to expand programming and outreach.",
    date: "May 15, 2025",
    author: "MIAA Team",
  },
  {
    slug: "education-program-launch",
    category: "Update",
    image: "Rectangle 100 (5).png",
    title: "Education Program Launch",
    description:
      "MIAA launches its inaugural schools program connecting students with Islamic art and culture.",
    date: "April 30, 2025",
    author: "MIAA Team",
  },
  {
    slug: "donor-wall-concept",
    category: "Update",
    image: "Rectangle 100 (6).png",
    title: "Donor Wall Concept Unveiled",
    description:
      "A preview of the donor recognition wall that will honour founding supporters of MIAA.",
    date: "April 12, 2025",
    author: "MIAA Team",
  },
  {
    slug: "geometric-patterns-blog",
    category: "Blog",
    image: "Rectangle 100 (4).png",
    title: "The Language of Geometric Patterns",
    description:
      "Exploring the mathematical beauty and spiritual significance of Islamic geometric art.",
    date: "June 20, 2025",
    author: "Dr. Fatima Hassan",
  },
  {
    slug: "textile-traditions-blog",
    category: "Blog",
    image: "Rectangle 100 (5).png",
    title: "Textile Traditions: Weaving Stories",
    description:
      "From Persian carpets to Indonesian batik — how Islamic textile arts carry cultural memory.",
    date: "May 8, 2025",
    author: "Amina Khalil",
  },
  {
    slug: "architecture-islam-blog",
    category: "Blog",
    image: "Rectangle 100 (6).png",
    title: "Architecture and Islam: Building Sacred Spaces",
    description:
      "How Islamic architectural principles create spaces for contemplation and community.",
    date: "April 22, 2025",
    author: "George Green",
  },
  {
    slug: "digital-preservation-blog",
    category: "Blog",
    image: "Rectangle 100 (4).png",
    title: "Digital Preservation of Islamic Art",
    description:
      "How technology is helping preserve and share Islamic art heritage for future generations.",
    date: "March 15, 2025",
    author: "Dr. Yusuf Rahman",
  },
  {
    slug: "women-in-islamic-art",
    category: "Blog",
    image: "Rectangle 100 (5).png",
    title: "Women in Islamic Art: Past and Present",
    description:
      "Celebrating the contributions of women artists, patrons and scholars throughout Islamic art history.",
    date: "March 1, 2025",
    author: "Layla Mahmoud",
  },
  {
    slug: "music-and-poetry-blog",
    category: "Blog",
    image: "Rectangle 100 (6).png",
    title: "Music, Poetry and the Islamic Arts",
    description:
      "The interplay between sound, word and visual art in the Islamic cultural tradition.",
    date: "February 14, 2025",
    author: "MIAA Team",
  },
]

// Reusable lorem-style body used for every detail page placeholder.
export const ARTICLE_PLACEHOLDER_BODY = [
  "In id pellentesque purus, sed auctor elit. Phasellus at dui ex. Curabitur molestie dignissim laoreet. Fusce mollis sagittis tellus, id efficitur diam gravida vitae. Integer convallis ultrices massa, id euismod nibh auctor non. Mauris vestibulum consectetur ligula, eget viverra mi efficitur quis. Pellentesque egestas magna in lorem vulputate efficitur.",
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed finibus turpis quis tortor pretium, eu ultricies nisl egestas. Nullam at lorem porttitor, dapibus dolor a, ultrices nibh. Donec congue, nibh eget posuere accumsan, augue mauris commodo quam, nec gravida turpis purus nec massa. Aenean a justo eget elit imperdiet vehicula. Pellentesque a finibus orci. Suspendisse nec mi varius felis aliquet.",
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse dapibus ex sagittis sapien fermentum, ac auctor neque facilisis. Quisque a posuere felis. Aenean luctus nibh quis tincidunt iaculis. Nunc placerat at lacinia odio. Vestibulum sagittis turpis ut elit varius, nec varius felis varius. Praesent in arcu dignissim, ornare lacus eu, posuere quam.",
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed pretium tincidunt fermentum. Etiam quis sapien lectus. Mauris vitae erat sapien. Curabitur eu felis suscipit, suscipit risus ut, congue lorem. Integer tincidunt ipsum vitae lacinia volutpat. Donec convallis ipsum quis fringilla blandit.",
]
