/**
 * Media registry — every image / video on the public site that staff can
 * replace from the admin "Site Content" editor.
 *
 * Same philosophy as the text registry: the *default* is the asset that ships
 * in the build (imported below, so Vite fingerprints and serves it as usual),
 * and the database only ever stores an **override** — the URL of a file the
 * admin uploaded to the public S3 media bucket. If the override is missing,
 * blank, or the bucket is unreachable, the bundled default renders. The site
 * therefore never depends on S3 being up.
 *
 * Entries are merged into `CONTENT_GROUPS` (registry.js) by `groupId` /
 * `sectionId`, so media appears inline in the editor next to the copy for the
 * same section. A section listed here that doesn't exist in the text registry
 * is created; likewise for a whole group.
 *
 * `mirrors: [{ groupId, sectionId }]` additionally surfaces the same fields
 * under another page. A file shared across pages is declared once but shown
 * wherever it renders, so an editor working on Home doesn't have to know that
 * Home's artwork lives under the Islamic Art tab. Both copies edit one key.
 *
 * Field types:
 *   "image"  uploadable still image  (png/jpg/webp/avif/gif/svg)
 *   "video"  uploadable video file   (mp4/webm/mov)
 *   "embed"  external player URL     (YouTube / Vimeo iframe src — no upload)
 *
 * `alt` on an image/video declares a companion text key `<key>.alt` holding the
 * accessible description, edited alongside the file in the same card.
 *
 * ── Deliberately NOT editable ──────────────────────────────────────────────
 * Decorative artwork that is part of the layout, not the message: background
 * patterns (herobgpattern, section2bg, SMWF-BGPATTERN, pattern-kufic,
 * bgpatternticket, Footer Pattern), floating ornaments (float1, float2,
 * Ornament_1, supportuselement, design.png, dot.png, herotoprightelement) and
 * icon glyphs (ic1–ic5, icon-calendar/clock/location, arrow-up-right,
 * quote-mark, marquee-icon). Swapping these breaks the design rather than
 * updating content.
 *
 * Also excluded: imagery owned by another CMS collection — Team photos, Blog
 * covers, Sponsor logos, Event images, Donation products, Campaigns (their
 * *fallback* placeholders are registered here, the real records are not); the
 * SMWF panellist portraits, which belong with each panellist's name and bio and
 * want their own collection rather than 34 loose image fields.
 */

/* ── Home ─────────────────────────────────────────────────────── */
import homeVideo from "../assets/videos/homeVideo.mp4"
import educatingImg from "../assets/images/Homepage/educatingnextgen.png"
import buildingImg from "../assets/images/Homepage/buildingfuture.jpg"
import sydneyView from "../assets/images/Homepage/Miatimeline/sydney-view.png"
import sydneyWater from "../assets/images/Homepage/Miatimeline/sydney-water.png"
import sydneyPasture from "../assets/images/Homepage/Miatimeline/sydney-pasture.png"
import sydneyArches from "../assets/images/Homepage/Miatimeline/sydney-arches.png"
import connectImg from "../assets/images/About/connect.png"
import smwfHome1 from "../assets/images/Homepage/SMWF/SMWF-02.jpg"
import smwfHome2 from "../assets/images/Homepage/SMWF/SMWF-03.jpg"
import smwfHome3 from "../assets/images/Homepage/SMWF/SMWF-04.jpg"
import smwfHome4 from "../assets/images/Homepage/SMWF/SMWF-05.jpg"

/* ── Islamic art (shared: Home “Islamic Art” + /islamic-art) ──── */
import art1 from "../assets/images/Homepage/Art in Aus.png"
import art2 from "../assets/images/Homepage/Art in Aus-1.png"
import art3 from "../assets/images/Homepage/Art in Aus-2.png"
import art4 from "../assets/images/Homepage/Art in Aus-3.png"
import art5 from "../assets/images/Homepage/Art in Aus-4.png"

/* ── About ────────────────────────────────────────────────────── */
import aboutHeroImg from "../assets/images/About/about-hero.png"
import directorImg from "../assets/images/About/director-mehmet-ozalp.png"
import journeyPanelImg from "../assets/images/About/western-sydney-photo.png"
import guidedImg from "../assets/images/About/journey-photo.png"
import teamPortraitDirector from "../assets/images/About/team-potrait-director.png"
import teamPortraitMale from "../assets/images/About/team-portrait-male.png"
import teamPortraitFemale from "../assets/images/About/team-portrait-female.png"

/* ── Community engagement ─────────────────────────────────────── */
import educationHeroImg from "../assets/images/Community Engagement/education-hero.png"
import communityAudienceImg from "../assets/images/Community Engagement/community-audience.png"
import workshopImg from "../assets/images/Community Engagement/workshop-program.png"

/* ── Offsite events ───────────────────────────────────────────── */
import eventsHero1 from "../assets/images/MIAEvents/events-hero-1.png"
import eventsHero2 from "../assets/images/MIAEvents/events-hero-2.png"
import eventsHero3 from "../assets/images/MIAEvents/events-hero-3.png"
import offsiteImg4 from "../assets/images/Homepage/Offsite program images/offsiteimg-04.png"

/* ── Timeline ─────────────────────────────────────────────────── */
import timelineHeroImg from "../assets/images/Timeline/buildingfuture.jpg"
import rpTeamImg from "../assets/images/Timeline/rp-infrastructure-team.png"

/* ── Support us ───────────────────────────────────────────────── */
import supportHeroImg from "../assets/images/Support/support-hero.jpg"
import founderImg from "../assets/images/Support/founder-portrait.jpg"
import donorEventImg from "../assets/images/Support/donor-event.png"
import volunteerImg from "../assets/images/Support/volunteer-group.png"

/* ── Gala dinner + ticketing ──────────────────────────────────── */
import galaHeroImg from "../assets/images/GalaDinner/hero.jpg"
import galaArtHorse from "../assets/images/GalaDinner/art-01-horse.png"
import galaArtGrill from "../assets/images/GalaDinner/art-02-grill.png"
import galaVenueImg from "../assets/images/GalaDinner/maskimage.png"
import agnswExterior from "../assets/images/Ticketing/agnsw-exterior.jpg"
import areaMap from "../assets/images/Ticketing/area-map.png"

/* ── SMWF ─────────────────────────────────────────────────────── */
import smwfHeroPhoto from "../assets/images/Homepage/SMWF/hero-photo.jpg"
import smwfVisionPhoto from "../assets/images/Homepage/SMWF/vision-photo.jpg"
import smwfStoriesImg from "../assets/images/Homepage/SMWF/stories-bg.jpg"
// Highlight slots follow the order they appear on the page, which is not the
// order of the filenames — slot 1 is h5.avif.
import smwfHighlight1 from "../assets/images/Homepage/SMWF/highlights/h5.avif"
import smwfHighlight2 from "../assets/images/Homepage/SMWF/highlights/h6.avif"
import smwfHighlight3 from "../assets/images/Homepage/SMWF/highlights/h1.avif"
import smwfHighlight4 from "../assets/images/Homepage/SMWF/highlights/h2.avif"
import smwfHighlight5 from "../assets/images/Homepage/SMWF/highlights/h4.avif"
import smwfHighlight6 from "../assets/images/Homepage/SMWF/highlights/h3.avif"
import smwfGallery1 from "../assets/images/Homepage/SMWF/gallery/g1.jpg"
import smwfGallery2 from "../assets/images/Homepage/SMWF/gallery/g2.jpg"
import smwfGallery3 from "../assets/images/Homepage/SMWF/gallery/g3.jpg"
import smwfGallery4 from "../assets/images/Homepage/SMWF/gallery/g4.jpg"
import smwfGallery5 from "../assets/images/Homepage/SMWF/gallery/g5.jpg"
import smwfGallery6 from "../assets/images/Homepage/SMWF/gallery/g6.jpg"
import smwfGallery7 from "../assets/images/Homepage/SMWF/gallery/g7.jpg"
import smwfGallery8 from "../assets/images/Homepage/SMWF/gallery/g8.jpg"
import smwfGallery9 from "../assets/images/Homepage/SMWF/gallery/g9.jpg"
import smwfGallery10 from "../assets/images/Homepage/SMWF/gallery/g10.jpg"
import smwfGallery11 from "../assets/images/Homepage/SMWF/gallery/g11.jpg"
import smwfGallery12 from "../assets/images/Homepage/SMWF/gallery/g12.jpg"
// Slots follow the order the section renders them, not the filenames.
import smwfSide1 from "../assets/images/Homepage/SMWF/gallery/Rectangle 129.png"
import smwfSide2 from "../assets/images/Homepage/SMWF/gallery/Rectangle 128.png"
import smwfSide3 from "../assets/images/Homepage/SMWF/gallery/Rectangle 130.jpg"
import smwfSide4 from "../assets/images/Homepage/SMWF/gallery/Rectangle 131.jpg"
import smwfPartner1 from "../assets/images/Homepage/SMWF/partners/nsw-gov.png"
import smwfPartner2 from "../assets/images/Homepage/SMWF/partners/cbc.png"
import smwfPartner3 from "../assets/images/Homepage/SMWF/partners/logo-lockup-07.png"
import smwfPartner4 from "../assets/images/Homepage/SMWF/partners/isra.png"
import smwfPartner5 from "../assets/images/Homepage/SMWF/partners/Group 25.png"
import smwfPartner6 from "../assets/images/Homepage/SMWF/partners/Barakah.png"

/* ── Blog ─────────────────────────────────────────────────────── */
import blogHeroImg from "../assets/images/UpdatesBlogs/blogshero.png"

/* ── Brand ────────────────────────────────────────────────────── */
import siteLogo from "../assets/images/Homepage/smalllogo.png"
import footerLogo from "../assets/images/Homepage/Footer Logo.png"

/* ── Donations ────────────────────────────────────────────────────
 * The hero-carousel photos are stock imagery (Unsplash) rather than files that
 * ship in the build, so these defaults are remote URLs instead of imports.
 * They are placeholders for MIAA's own photography — uploading from Site
 * Content overrides them exactly like any other media key.
 */
const UNSPLASH = (id) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1400&q=70`

const donateHero1 = UNSPLASH("photo-1469571486292-0ba58a3f068b")
const donateHero2 = UNSPLASH("photo-1532629345422-7515f3d16bb6")
const donateHero3 = UNSPLASH("photo-1593113646773-028c64a8f1b8")
const donateHero4 = UNSPLASH("photo-1497633762265-9d179a990aa6")

const SHARED_NOTE = "Shared — this file is used in more than one place on the site."

export const MEDIA_ENTRIES = [
  /* ══ Home ══════════════════════════════════════════════════ */
  {
    groupId: "home",
    sectionId: "hero",
    fields: [
      {
        key: "home.hero.video",
        label: "Background video",
        type: "video",
        help: "Full-screen looping video behind the hero. Muted and autoplayed — keep it short and under ~15 MB so the page stays fast.",
        default: homeVideo,
      },
    ],
  },
  {
    groupId: "home",
    sectionId: "smwf",
    fields: [
      { key: "home.smwf.image1", label: "Festival photo 1", type: "image", default: smwfHome1, alt: "SMWF event" },
      { key: "home.smwf.image2", label: "Festival photo 2", type: "image", default: smwfHome2, alt: "SMWF event" },
      { key: "home.smwf.image3", label: "Festival photo 3", type: "image", default: smwfHome3, alt: "SMWF event" },
      { key: "home.smwf.image4", label: "Festival photo 4", type: "image", default: smwfHome4, alt: "SMWF event" },
    ],
  },
  {
    groupId: "home",
    sectionId: "education",
    fields: [
      {
        key: "home.education.image",
        label: "Section image",
        type: "image",
        default: educatingImg,
        alt: "Man viewing art gallery",
      },
    ],
  },
  {
    groupId: "home",
    sectionId: "timeline",
    fields: [
      {
        key: "home.timeline.image",
        label: "Building render",
        type: "image",
        default: buildingImg,
        alt: "Future museum building render",
      },
      { key: "home.timeline.milestone1", label: "Milestone image 1", type: "image", default: sydneyView },
      { key: "home.timeline.milestone2", label: "Milestone image 2", type: "image", default: sydneyWater },
      { key: "home.timeline.milestone3", label: "Milestone image 3", type: "image", default: sydneyPasture },
      { key: "home.timeline.milestone4", label: "Milestone image 4", type: "image", default: sydneyArches },
    ],
  },
  {
    groupId: "home",
    sectionId: "contact",
    // The Contact block also appears on About.
    mirrors: [{ groupId: "about", sectionId: "contact", sectionLabel: "Contact" }],
    fields: [
      {
        key: "home.contact.image",
        label: "Section image",
        type: "image",
        help: `${SHARED_NOTE} The Contact block appears on both Home and About.`,
        default: connectImg,
      },
    ],
  },
  /* ══ Islamic art (shared with the Home “Islamic Art” block) ══ */
  {
    groupId: "islamicart",
    sectionId: "page",
    // Also drawn by the Home page's Islamic Art block.
    mirrors: [{ groupId: "home", sectionId: "art" }],
    fields: [
      {
        key: "islamicart.gallery.image1",
        label: "Artwork 1",
        type: "image",
        help: `${SHARED_NOTE} These five artworks also fill the Islamic Art block on the Home page. Each artwork's artist, title, year and caption are edited under "Artwork credits".`,
        default: art1,
      },
      { key: "islamicart.gallery.image2", label: "Artwork 2", type: "image", default: art2 },
      { key: "islamicart.gallery.image3", label: "Artwork 3", type: "image", default: art3 },
      { key: "islamicart.gallery.image4", label: "Artwork 4", type: "image", default: art4 },
      { key: "islamicart.gallery.image5", label: "Artwork 5", type: "image", default: art5 },
    ],
  },

  /* ══ About ═════════════════════════════════════════════════ */
  {
    groupId: "about",
    sectionId: "hero",
    fields: [
      { key: "about.hero.image", label: "Hero image", type: "image", default: aboutHeroImg, alt: "Audience at MIAA event" },
    ],
  },
  {
    groupId: "about",
    sectionId: "director",
    fields: [
      { key: "about.director.image", label: "Director portrait", type: "image", default: directorImg, alt: "Professor Mehmet Ozalp" },
    ],
  },
  {
    groupId: "about",
    sectionId: "journey",
    fields: [
      { key: "about.journey.image", label: "Section image", type: "image", default: journeyPanelImg, alt: "MIAA leadership panel" },
    ],
  },
  {
    groupId: "about",
    sectionId: "guided",
    fields: [
      { key: "about.guided.image", label: "Section image", type: "image", default: guidedImg, alt: "MIAA cultural performance" },
    ],
  },

  /* ══ Community engagement ══════════════════════════════════ */
  {
    groupId: "community",
    sectionId: "hero",
    fields: [
      { key: "community.hero.image", label: "Hero image", type: "image", default: educationHeroImg, alt: "Educator at MIAA community event" },
    ],
  },
  {
    groupId: "community",
    sectionId: "culture",
    fields: [
      { key: "community.culture.image1", label: "Image 1", type: "image", default: communityAudienceImg, alt: "Community audience at MIAA gathering" },
      { key: "community.culture.image2", label: "Image 2", type: "image", default: workshopImg, alt: "Sydney Muslim Writers Festival workshop" },
    ],
  },

  /* ══ Offsite events ════════════════════════════════════════ */
  {
    groupId: "offsite",
    sectionId: "hero",
    fields: [
      { key: "offsite.hero.image1", label: "Carousel photo 1", type: "image", default: eventsHero1, alt: "Meet the award-winning author book launch" },
      { key: "offsite.hero.image2", label: "Carousel photo 2", type: "image", default: eventsHero2, alt: "MIAA community panel discussion" },
      { key: "offsite.hero.image3", label: "Carousel photo 3", type: "image", default: eventsHero3, alt: "Visitors connecting at a MIAA event" },
    ],
  },
  {
    groupId: "offsite",
    sectionId: "previous",
    mirrors: [{ groupId: "home", sectionId: "offsite" }],
    fields: [
      {
        key: "offsite.previous.image",
        label: "Fallback image",
        type: "image",
        help: "Used for past events that have no image in the Previous Events CMS.",
        default: offsiteImg4,
      },
    ],
  },

  /* ══ Timeline ══════════════════════════════════════════════ */
  {
    groupId: "timeline",
    sectionId: "hero",
    fields: [
      { key: "timeline.hero.image", label: "Hero render", type: "image", default: timelineHeroImg, alt: "MIAA architectural render" },
    ],
  },
  {
    groupId: "timeline",
    sectionId: "rp",
    fields: [
      { key: "timeline.rp.image", label: "Section image", type: "image", default: rpTeamImg, alt: "RP Infrastructure team reviewing construction plans" },
    ],
  },
  {
    groupId: "timeline",
    sectionId: "video",
    fields: [
      {
        key: "timeline.video.url",
        label: "Video embed URL",
        type: "embed",
        help: "Paste a YouTube or Vimeo link — the share/watch URL is converted to an embed automatically.",
        default: "https://www.youtube.com/embed/Wkqt0JoStac?rel=0",
      },
    ],
  },

  /* ══ Support us ════════════════════════════════════════════ */
  {
    groupId: "support",
    sectionId: "hero",
    fields: [
      { key: "support.hero.image", label: "Hero image", type: "image", default: supportHeroImg, alt: "Speaker addressing the MIAA community" },
    ],
  },
  {
    groupId: "support",
    sectionId: "founding",
    fields: [
      { key: "support.founding.image", label: "Section image", type: "image", default: founderImg, alt: "MIAA member visiting a gallery" },
    ],
  },
  {
    groupId: "support",
    sectionId: "kids",
    fields: [
      { key: "support.kids.image", label: "Section image", type: "image", default: donorEventImg, alt: "MIAA community audience at an event" },
    ],
  },
  {
    groupId: "support",
    sectionId: "volunteer",
    fields: [
      { key: "support.volunteer.image", label: "Section image", type: "image", default: volunteerImg, alt: "MIAA volunteers" },
    ],
  },

  /* ══ Donations ═════════════════════════════════════════════ */
  {
    groupId: "donate",
    sectionId: "hero",
    fields: [
      {
        key: "donate.hero.image1",
        label: "Carousel photo 1",
        type: "image",
        help: "The four photos crossfade in this order beside the donation heading. Landscape 4:3 crops best.",
        default: donateHero1,
        alt: "Many hands raised together forming a heart",
      },
      { key: "donate.hero.image2", label: "Carousel photo 2", type: "image", default: donateHero2, alt: "Open hands offering coins with a 'make a change' note" },
      { key: "donate.hero.image3", label: "Carousel photo 3", type: "image", default: donateHero3, alt: "Volunteers packing goods at a community drive" },
      { key: "donate.hero.image4", label: "Carousel photo 4", type: "image", default: donateHero4, alt: "A stack of books representing learning and culture" },
    ],
  },

  /* ══ Gala dinner ═══════════════════════════════════════════ */
  {
    groupId: "gala",
    sectionId: "hero",
    // Same file backs the stage banner on the ticketing page.
    mirrors: [
      { groupId: "galatickets", sectionId: "stage", sectionLabel: "Stage Banner" },
    ],
    fields: [
      {
        key: "gala.hero.image",
        label: "Hero image",
        type: "image",
        help: `${SHARED_NOTE} Also used for the stage banner on the ticketing page.`,
        default: galaHeroImg,
        alt: "MIAA Inaugural Gala Dinner",
      },
    ],
  },
  {
    groupId: "gala",
    sectionId: "intro",
    fields: [
      { key: "gala.intro.image1", label: "Artwork 1", type: "image", default: galaArtHorse, alt: "Islamic art — horse painting" },
      { key: "gala.intro.image2", label: "Artwork 2", type: "image", default: galaArtGrill, alt: "Islamic architectural detail" },
    ],
  },
  {
    groupId: "gala",
    sectionId: "details",
    fields: [
      { key: "gala.details.image", label: "Venue image", type: "image", default: galaVenueImg, alt: "Kaldor Hall" },
    ],
  },
  {
    groupId: "gala",
    sectionId: "location",
    fields: [
      { key: "gala.location.image", label: "Venue photo", type: "image", default: agnswExterior, alt: "Art Gallery of New South Wales — exterior columns" },
    ],
  },
  {
    groupId: "gala",
    sectionId: "parking",
    fields: [
      {
        key: "gala.parking.image",
        label: "Area map",
        type: "image",
        default: areaMap,
        alt: "Map of the area around Art Gallery of NSW with parking locations",
      },
    ],
  },

  /* ══ SMWF ══════════════════════════════════════════════════ */
  {
    groupId: "smwf",
    sectionId: "hero",
    fields: [
      { key: "smwf.hero.image", label: "Hero photo", type: "image", default: smwfHeroPhoto, alt: "Sydney Muslim Writers Festival panel discussion" },
    ],
  },
  {
    groupId: "smwf",
    sectionId: "about",
    fields: [
      { key: "smwf.about.image", label: "Vision photo", type: "image", default: smwfVisionPhoto, alt: "Sydney Muslim Writers Festival community" },
    ],
  },
  {
    groupId: "smwf",
    sectionId: "mark",
    sectionLabel: "Behind the Mark",
    fields: [
      {
        key: "smwf.mark.videoUrl",
        label: "Video embed URL",
        type: "embed",
        help: "YouTube or Vimeo link for the “behind the mark” film.",
        default:
          "https://player.vimeo.com/video/1153891644?badge=0&autopause=0&player_id=0&app_id=58479&title=0&byline=0&portrait=0",
      },
    ],
  },
  {
    groupId: "smwf",
    sectionId: "stories",
    sectionLabel: "Stories We Inherit",
    fields: [
      { key: "smwf.stories.image", label: "Section image", type: "image", default: smwfStoriesImg, alt: "Sydney Muslim Writers Festival author signing books" },
    ],
  },
  {
    groupId: "smwf",
    sectionId: "past",
    sectionLabel: "Past Festivals",
    fields: [
      {
        key: "smwf.past.videoUrl",
        label: "Video embed URL",
        type: "embed",
        help: "YouTube or Vimeo link for the past-festivals recap.",
        default:
          "https://player.vimeo.com/video/1156048878?badge=0&autopause=0&player_id=0&app_id=58479&title=0&byline=0&portrait=0",
      },
    ],
  },

  {
    groupId: "smwf",
    sectionId: "highlights",
    sectionLabel: "Programme Highlights",
    fields: [
      { key: "smwf.highlights.image1", label: "Highlight 1", type: "image", default: smwfHighlight1 },
      { key: "smwf.highlights.image2", label: "Highlight 2", type: "image", default: smwfHighlight2 },
      { key: "smwf.highlights.image3", label: "Highlight 3", type: "image", default: smwfHighlight3 },
      { key: "smwf.highlights.image4", label: "Highlight 4", type: "image", default: smwfHighlight4 },
      { key: "smwf.highlights.image5", label: "Highlight 5", type: "image", default: smwfHighlight5 },
      { key: "smwf.highlights.image6", label: "Highlight 6", type: "image", default: smwfHighlight6 },
    ],
  },
  {
    groupId: "smwf",
    sectionId: "past",
    // Festival Day shows the 1st, 4th and 7th of these as a teaser.
    mirrors: [{ groupId: "smwf", sectionId: "festival" }],
    fields: [
      { key: "smwf.past.image1", label: "Gallery photo 1", type: "image", default: smwfGallery1 },
      { key: "smwf.past.image2", label: "Gallery photo 2", type: "image", default: smwfGallery2 },
      { key: "smwf.past.image3", label: "Gallery photo 3", type: "image", default: smwfGallery3 },
      { key: "smwf.past.image4", label: "Gallery photo 4", type: "image", default: smwfGallery4 },
      { key: "smwf.past.image5", label: "Gallery photo 5", type: "image", default: smwfGallery5 },
      { key: "smwf.past.image6", label: "Gallery photo 6", type: "image", default: smwfGallery6 },
      { key: "smwf.past.image7", label: "Gallery photo 7", type: "image", default: smwfGallery7 },
      { key: "smwf.past.image8", label: "Gallery photo 8", type: "image", default: smwfGallery8 },
      { key: "smwf.past.image9", label: "Gallery photo 9", type: "image", default: smwfGallery9 },
      { key: "smwf.past.image10", label: "Gallery photo 10", type: "image", default: smwfGallery10 },
      { key: "smwf.past.image11", label: "Gallery photo 11", type: "image", default: smwfGallery11 },
      { key: "smwf.past.image12", label: "Gallery photo 12", type: "image", default: smwfGallery12 },
    ],
  },
  {
    groupId: "smwf",
    sectionId: "sideevents",
    sectionLabel: "Side Events",
    fields: [
      { key: "smwf.side.image1", label: "Event 1 — photo 1", type: "image", default: smwfSide1 },
      { key: "smwf.side.image2", label: "Event 1 — photo 2", type: "image", default: smwfSide2 },
      { key: "smwf.side.image3", label: "Event 2 — photo 1", type: "image", default: smwfSide3 },
      { key: "smwf.side.image4", label: "Event 2 — photo 2", type: "image", default: smwfSide4 },
    ],
  },
  {
    groupId: "smwf",
    sectionId: "partners",
    sectionLabel: "Partners & Supporters",
    fields: [
      { key: "smwf.partners.logo1", label: "Partner logo 1", type: "image", default: smwfPartner1, alt: "NSW Government" },
      { key: "smwf.partners.logo2", label: "Partner logo 2", type: "image", default: smwfPartner2, alt: "Canterbury Bankstown" },
      { key: "smwf.partners.logo3", label: "Partner logo 3", type: "image", default: smwfPartner3, alt: "Think Studio" },
      { key: "smwf.partners.logo4", label: "Partner logo 4", type: "image", default: smwfPartner4, alt: "ISRA" },
      { key: "smwf.partners.logo5", label: "Partner logo 5", type: "image", default: smwfPartner5, alt: "City of Parramatta" },
      { key: "smwf.partners.logo6", label: "Partner logo 6", type: "image", default: smwfPartner6, alt: "Barakah Brew" },
    ],
  },
  {
    groupId: "about",
    sectionId: "people",
    fields: [
      {
        key: "about.people.fallback1",
        label: "Placeholder portrait 1",
        type: "image",
        help: "Used for a team member who has no photo in the Team CMS. Real portraits are managed under admin → Team.",
        default: teamPortraitDirector,
      },
      { key: "about.people.fallback2", label: "Placeholder portrait 2", type: "image", default: teamPortraitMale },
      { key: "about.people.fallback3", label: "Placeholder portrait 3", type: "image", default: teamPortraitFemale },
    ],
  },

  /* ══ Blog ══════════════════════════════════════════════════ */
  {
    groupId: "blog",
    groupLabel: "Blog",
    groupPath: "/blog",
    sectionId: "hero",
    sectionLabel: "Featured Article",
    fields: [
      {
        key: "blog.hero.image",
        label: "Fallback image",
        type: "image",
        help: "Shown for the featured article when the post itself has no cover image.",
        default: blogHeroImg,
      },
    ],
  },

  /* ══ Brand (site-wide) ═════════════════════════════════════ */
  {
    groupId: "brand",
    groupLabel: "Brand",
    groupPath: "/",
    sectionId: "logo",
    sectionLabel: "Logos",
    fields: [
      {
        key: "brand.logo.image",
        label: "Site logo",
        type: "image",
        help: "Shown in the header on every page and in the donor portal. Use a transparent PNG or SVG.",
        default: siteLogo,
        alt: "MIAA",
      },
    ],
  },
  {
    // Same "Logos" card as the site logo above, but mirrored into the Footer
    // page group so an editor working on the footer finds it there too.
    groupId: "brand",
    groupLabel: "Brand",
    groupPath: "/",
    sectionId: "logo",
    sectionLabel: "Logos",
    mirrors: [{ groupId: "footer", sectionId: "logo", sectionLabel: "Logo" }],
    fields: [
      {
        key: "brand.logo.footer",
        label: "Footer logo",
        type: "image",
        help: "Larger lockup shown as a watermark in the site footer (decorative — no alt text needed).",
        default: footerLogo,
      },
    ],
  },
]
