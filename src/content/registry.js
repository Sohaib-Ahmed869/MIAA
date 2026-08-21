/**
 * Content registry — the single source of truth for editable site copy.
 *
 * Every editable string on the public site is declared here once, with its
 * baked-in default (the copy that ships in the build). The public components
 * read values by key via `useText()` / `<Text>`, and the admin "Site Content"
 * editor is generated entirely from this registry — so making a new string
 * editable is a one-line addition here plus swapping the literal in the JSX for
 * `<Text k="…">`.
 *
 * Field types:
 *   "text"      single-line input
 *   "multiline" textarea; a newline renders as <br>
 *   "richtext"  textarea; blank line separates paragraphs (\n\n → separate <p>)
 *
 *   "image"     uploadable image  ┐ declared in ./mediaRegistry.js and merged
 *   "video"     uploadable video  ├ into these groups below, so each section's
 *   "embed"     player URL        ┘ media sits next to its copy in the editor
 *
 * Keys are namespaced `page.section.field` and must be globally unique.
 */

import { MEDIA_ENTRIES } from "./mediaRegistry"

const TEXT_GROUPS = [
  {
    id: "home",
    label: "Home",
    path: "/",
    sections: [
      {
        id: "hero",
        label: "Hero",
        fields: [
          {
            key: "home.hero.title",
            label: "Heading",
            type: "multiline",
            help: "Main hero heading. Press Enter for a line break.",
            default: "A Space for Art, Culture\nand Community",
          },
          {
            key: "home.hero.description",
            label: "Description",
            type: "richtext",
            help: "Intro paragraph shown under the heading.",
            default:
              "Explore our website to discover information about Australia’s first Islamic Museum dedicated to the arts. We invite you to join us on this unique journey as we navigate the various stages and milestones of this exciting museum project.",
          },
        ],
      },
      {
        id: "aboutus",
        label: "About Us",
        fields: [
          {
            key: "home.aboutus.body",
            label: "Paragraph",
            type: "richtext",
            default:
              "The Museum of Islamic Art Australia (MIAA) is an initiative of the Islamic Sciences and Research Academy (ISRA) funded by the NSW Government WestInvest program. MIAA is an exciting new cultural landmark for Islamic art and culture in the heart of Western Sydney.",
          },
          {
            key: "home.aboutus.cta",
            label: "Button",
            type: "text",
            default: "Learn More About Us",
          },
        ],
      },
      {
        id: "art",
        label: "Islamic Art",
        fields: [
          {
            key: "home.art.heading",
            label: "Heading",
            type: "multiline",
            default: "Celebrating Islamic\nArt in Australia",
          },
          {
            key: "home.art.body",
            label: "Paragraph",
            type: "richtext",
            default:
              "Across Australia, Islamic art continues to flourish — shaped by diverse artists, cultures, and stories. The Museum of Islamic Art Australia proudly supports this creative movement, celebrating its heritage and future through art, learning, and community.",
          },
          {
            key: "home.art.cta",
            label: "Button",
            type: "text",
            default: "Explore",
          },
        ],
      },
      {
        id: "offsite",
        label: "Offsite Events",
        fields: [
          {
            key: "home.offsite.heading",
            label: "Heading",
            type: "text",
            default: "Offsite Programs and Events",
          },
          {
            key: "home.offsite.cta",
            label: "Button",
            type: "text",
            default: "View All Events",
          },
          {
            key: "home.offsite.previousHeading",
            label: "Previous Events heading",
            type: "text",
            default: "Previous Events",
          },
        ],
      },
      {
        id: "smwf",
        label: "SMWF",
        fields: [
          {
            key: "home.smwf.heading",
            label: "Heading",
            type: "multiline",
            default: "MIAA is home of the Sydney\nMuslim Writer's Festival (SMWF)",
          },
          {
            key: "home.smwf.tagline",
            label: "Tagline",
            type: "text",
            default: "Our Story Our Words",
          },
          {
            key: "home.smwf.body",
            label: "Paragraph",
            type: "richtext",
            default:
              "The Sydney Muslim Writers Festival is a unique platform that celebrates the diverse voices of Muslim writers, poets, and thinkers. Founded with the vision of showcasing authentic storytelling, SMWF offers a space for both emerging and established authors to share their narratives and explore various themes in literature. While the full festival will return in 2026, the journey continues with a series of smaller events, workshops, and discussions throughout the year. Join us as we celebrate the power of words, foster dialogue, and build connections across communities",
          },
          {
            key: "home.smwf.cta",
            label: "Button",
            type: "text",
            default: "Explore",
          },
        ],
      },
      {
        id: "education",
        label: "Education",
        fields: [
          {
            key: "home.education.heading",
            label: "Heading",
            type: "multiline",
            default: "Educating the Next\nGeneration of Thinkers",
          },
          {
            key: "home.education.item1.title",
            label: "Item 1 — title",
            type: "text",
            default: "Teachers, Educators and Students",
          },
          {
            key: "home.education.item1.body",
            label: "Item 1 — text",
            type: "richtext",
            default:
              "The Museum of Islamic Art Australia (MIAA) is developing meaningful education programs aligned with national and NSW curricula. Through workshops, tours, and resources, we aim to inspire learning, cultural understanding, and creative exploration among school-aged students.",
          },
          {
            key: "home.education.item2.title",
            label: "Item 2 — title",
            type: "text",
            default: "Children and Families",
          },
          {
            key: "home.education.item2.body",
            label: "Item 2 — text",
            type: "richtext",
            default:
              "The Museum will feature a Children's Gallery — the first dedicated Islamic arts focused children's gallery in the Southern hemisphere. It will feature hands-on interactive displays, accessible contemporary and decorative Islamic art for young children, and curated educational programs for kinder and primary aged children.",
          },
        ],
      },
      {
        id: "timeline",
        label: "Timeline",
        fields: [
          {
            key: "home.timeline.heading",
            label: "Heading",
            type: "multiline",
            default: "Building the Future Home of\nIslamic Art",
          },
          {
            key: "home.timeline.body",
            label: "Paragraph",
            type: "richtext",
            default:
              "The Museum of Islamic Art Australia is now entering its design and construction phase, bringing a world-class vision to life in Western Sydney. Each detail reflects the harmony between tradition, innovation, and community.",
          },
          {
            key: "home.timeline.cta",
            label: "Button",
            type: "text",
            default: "Follow Our Journey",
          },
          {
            key: "home.timeline.subheading",
            label: "Timeline subheading",
            type: "text",
            default: "MIAA Timeline",
          },
        ],
      },
      {
        id: "insights",
        label: "Insights",
        fields: [
          {
            key: "home.insights.heading",
            label: "Heading",
            type: "text",
            default: "Insights and Inspiration",
          },
          {
            key: "home.insights.cta",
            label: "Button",
            type: "text",
            default: "Visit Blog",
          },
        ],
      },
      {
        id: "contact",
        label: "Contact (shown on Home & About)",
        fields: [
          {
            key: "shared.contact.heading",
            label: "Heading",
            type: "text",
            default: "Connect With the Museum",
          },
          {
            key: "shared.contact.intro",
            label: "Intro paragraph",
            type: "richtext",
            default:
              "We’d love to hear from you. Whether you’d like to learn more about the Museum of Islamic Art Australia, explore partnership opportunities, or support our journey, our team is here to connect.",
          },
          {
            key: "shared.contact.cta",
            label: "Submit button",
            type: "text",
            default: "Send Message",
          },
          {
            key: "shared.contact.successTitle",
            label: "Success — title",
            type: "text",
            default: "Thank you!",
          },
          {
            key: "shared.contact.successBody",
            label: "Success — message",
            type: "text",
            default: "Your submission has been received!",
          },
        ],
      },
    ],
  },
  {
    id: "about",
    label: "About",
    path: "/about",
    sections: [
      {
        id: "hero",
        label: "Hero",
        fields: [
          {
            key: "about.hero.title",
            label: "Heading",
            type: "multiline",
            help: "Page hero heading. Press Enter for a line break.",
            default: "Shaping The Future Of Islamic\nArt In Australia",
          },
        ],
      },
      {
        id: "director",
        label: "Director’s Message",
        fields: [
          {
            key: "about.director.label",
            label: "Section label",
            type: "text",
            default: "Message",
          },
          {
            key: "about.director.heading",
            label: "Heading",
            type: "multiline",
            help: "Press Enter for a line break.",
            default: "A Message from\nMIAA’s Director",
          },
          {
            key: "about.director.name",
            label: "Director name",
            type: "text",
            default: "Professor Mehmet Ozalp",
          },
          {
            key: "about.director.role1",
            label: "Role — line 1",
            type: "text",
            default:
              "Executive Director, ISRA (Islamic Sciences and Research Academy)",
          },
          {
            key: "about.director.role2",
            label: "Role — line 2",
            type: "text",
            default: "Director, Museum of Islamic Art Australia",
          },
          {
            key: "about.director.body",
            label: "Message",
            type: "richtext",
            help: "The scrolling message. Leave a blank line between paragraphs.",
            default: [
              "It is with great excitement and purpose that I welcome you to the online home for the Museum of Islamic Art Australia (MIAA). As the Executive Director of the Islamic Sciences and Research Academy (ISRA), I am honoured to introduce this visionary project, which will be in Western Sydney and serve as a cultural landmark for all of Sydney and Australia.",
              "Our vision is clear and unwavering: to be a leading institution for the advancement of Islamic awareness, spiritual growth and community wellbeing in Australia. MIAA is a natural extension of this vision – a space that celebrates beauty, fosters understanding and inspires connection.",
              "The role of the Museum will be multifaceted. It will be a centre for cultural education, a repository for historical and contemporary Islamic art, and a place of encounter where Australians of all backgrounds can explore the artistic and intellectual contributions of Muslims throughout history and today. Through its exhibitions, programs and design, the museum will tell a story that is global and local – reflecting the heritage of Islamic art while capturing the Australian Muslim experience.",
              "Our aspirations for the museum are bold and ambitious. We aim to create a space that reflects excellence in architectural design, environmental harmony and spiritual symbolism. It will be an inclusive, engaging and contemporary institution – accessible to all, deeply rooted in authenticity and connected to the future. The museum will be a place of inspiration for young minds, a resource for educators and researchers, and a cultural beacon that contributes to a more cohesive and confident Australian society.",
              "On behalf of the MIAA team, I invite you to follow our journey, share in our excitement, and help us build a place that will inspire generations to come.",
            ].join("\n\n"),
          },
        ],
      },
      {
        id: "journey",
        label: "Project Background",
        fields: [
          {
            key: "about.journey.label",
            label: "Section label",
            type: "text",
            default: "Project Background",
          },
          {
            key: "about.journey.heading",
            label: "Heading",
            type: "multiline",
            default: "How the MIAA Journey\nStarted",
          },
          {
            key: "about.journey.intro",
            label: "Intro paragraph",
            type: "richtext",
            default:
              "The Museum of Islamic Art Australia is a groundbreaking community-led initiative with the vision of establishing a dedicated museum to showcase and nurture local Islamic art and artists in Australia. Spearheaded by ISRA and supported by its diverse partners, the project gained significant momentum in 2022 when ISRA presented an ambitious proposal for a world-class museum to the NSW government. This proposal met with strong support, culminating in successful acquisition of a generous grant ($26.3m) through the WestInvest Community Project Grants initiative, a NSW State Government program aimed at funding transformative projects across Western Sydney, where the Museum will be proudly located.",
          },
          {
            key: "about.journey.body",
            label: "Secondary text",
            type: "richtext",
            help: "Leave a blank line between paragraphs.",
            default: [
              "Since securing the WestInvest grant, the MIAA has commenced phase one of its operations, focusing on preparatory work for the Museum’s building and design, as well as delivering satellite events and partnerships aimed at fostering arts engagement and community involvement.",
              "These efforts highlight the MIAA’s commitment to becoming a dynamic cultural institution that not only preserves and promotes Islamic art but also strengthens social cohesion and enriches Australia’s cultural landscape.",
            ].join("\n\n"),
          },
        ],
      },
      {
        id: "western",
        label: "Museum Location",
        fields: [
          {
            key: "about.western.label",
            label: "Section label",
            type: "text",
            default: "Museum Location",
          },
          {
            key: "about.western.heading",
            label: "Heading",
            type: "text",
            default: "Based in the Heart of Western Sydney",
          },
          {
            key: "about.western.subheading",
            label: "Subheading",
            type: "multiline",
            default:
              "MIAA is proudly located in Granville in Western Sydney on beautiful Dharug country",
          },
          {
            key: "about.western.acknowledgement",
            label: "Acknowledgement of Country",
            type: "richtext",
            default:
              "The Museum of Islamic Art Australia (MIAA) respectfully acknowledges the Burramattagal people of the Dharug Nation as the Traditional Owners of the land on which the museum will be located. We also acknowledge the City of Parramatta Council’s protocols and processes for engaging with First Nations custodians in relation to the museum’s future construction and operations. We pay our respects to Elders past, present and emerging. Sovereignty has never been ceded.",
          },
          {
            key: "about.western.body",
            label: "Body text",
            type: "richtext",
            help: "Leave a blank line between paragraphs.",
            default: [
              "Western Sydney is home to one of Australia’s most diverse local government areas (LGA). With a growing population of more than two and a half million residents hailing from over 170 countries and speaking more than 100 different languages, the dynamic cultural heritage of Western Sydney is at the heart of this project.",
              "MIAA aims to become a creative hub for this diverse and growing population, operating as a locally established world-class museum, with national and international engagement and connections.",
            ].join("\n\n"),
          },
        ],
      },
      {
        id: "guided",
        label: "Museum Mission",
        fields: [
          {
            key: "about.guided.label",
            label: "Section label",
            type: "text",
            default: "Museum Mission",
          },
          {
            key: "about.guided.heading",
            label: "Heading",
            type: "multiline",
            default: "Guided by Meaning and\nConnection",
          },
          {
            key: "about.guided.mission.title",
            label: "Item 1 — title",
            type: "text",
            default: "Mission Statement",
          },
          {
            key: "about.guided.mission.body",
            label: "Item 1 — text",
            type: "richtext",
            default:
              "The mission of the Museum of Islamic Art Australia (MIAA) aims to promote a deeper understanding and appreciation of Islamic art, culture, and civilisation — both within Australian society and globally. As a community-led initiative, MIAA is committed to creating a platform that highlights and supports local Islamic art and artists. Through this effort, the museum seeks to contribute to the development of a distinct Australian Muslim identity, expressed creatively through the arts.",
          },
          {
            key: "about.guided.vision.title",
            label: "Item 2 — title",
            type: "text",
            default: "Vision",
          },
          {
            key: "about.guided.vision.body",
            label: "Item 2 — text",
            type: "richtext",
            default:
              "The Museum of Islamic Art Australia is a community-led initiative with the vision of establishing a museum to showcase and develop local Islamic art and artists in Australia.",
          },
        ],
      },
      {
        id: "strategic",
        label: "Strategic Direction",
        fields: [
          {
            key: "about.strategic.label",
            label: "Section label",
            type: "text",
            default: "Strategic Direction",
          },
          {
            key: "about.strategic.heading",
            label: "Heading",
            type: "text",
            default: "Our Strategic Direction",
          },
          {
            key: "about.strategic.pillar1",
            label: "Card 1",
            type: "richtext",
            default:
              "Present world-class permanent galleries, temporary and visiting exhibitions, and programming which attract tourists and other visitors to Western Sydney.",
          },
          {
            key: "about.strategic.pillar2",
            label: "Card 2",
            type: "richtext",
            default:
              "Establish and maintain permanent and temporary gallery spaces according to local and international museum standards.",
          },
          {
            key: "about.strategic.pillar3",
            label: "Card 3",
            type: "richtext",
            default:
              "Establish and maintain facilities within the museum premises as part of the museum Community Access Program, with a venue for cultural and educational activities.",
          },
          {
            key: "about.strategic.pillar4",
            label: "Card 4",
            type: "richtext",
            default:
              "Collect, preserve and display art and cultural material that reflects the diverse experiences and expressions of Islamic art and culture both here and abroad.",
          },
          {
            key: "about.strategic.pillar5",
            label: "Card 5",
            type: "richtext",
            default:
              "Collect, preserve and display art and cultural material that reflects the diverse experiences and expressions of Islamic art and culture both here and abroad.",
          },
        ],
      },
      {
        id: "people",
        label: "The People",
        fields: [
          {
            key: "about.people.label",
            label: "Section label",
            type: "text",
            default: "Teams",
          },
          {
            key: "about.people.heading",
            label: "Heading",
            type: "text",
            default: "The People Behind MIAA",
          },
          {
            key: "about.people.emptyBio",
            label: "Empty biography note",
            type: "text",
            help: "Shown in a team member's profile when no biography is set.",
            default: "No biography available yet.",
          },
        ],
      },
    ],
  },
  {
    id: "islamicart",
    label: "Islamic Art",
    path: "/islamic-art",
    sections: [
      {
        id: "page",
        label: "Islamic Art",
        fields: [
          {
            key: "islamicart.title",
            label: "Heading",
            type: "text",
            default: "Islamic Art in Australia",
          },
          {
            key: "islamicart.body",
            label: "Body (scrolling text)",
            type: "richtext",
            help: "Each blank-line-separated block is one paragraph.",
            default: [
              "Over the last few decades, diverse Muslim communities across Australia have grown and flourished, they have professionalised, established schools, mosques, community centres and organisations. As part of that extraordinary growth, there has been the steady development of a vibrant, tenacious and dedicated creative community, with many established artists and arts workers contributing to the cultural landscape and thriving arts sector both here and abroad.",
              "In fact, this growth is so significant that we are now able to dedicate a museum, right here in Australia, to Islamic art. This is truly an incredible achievement and indication of the growing cultural significance of Islam in Australia.",
              "The influence of Islamic art on artisans and makers across the globe, is in of itself a great study in cross-cultural exchange, of trade routes and expeditions of the past.",
              "For centuries, Islamic art has been celebrated, even coveted by private collectors and museums alike. However, with that has come the modern day challenge of re/defining and understanding Islamic art in the contemporary era.",
              "In recent years there has been significant traction in the research of modern and contemporary art globally. We endeavor to not only contribute to the broader narrative of Islamic art, right here from Western Sydney, but to become important voices in that conversation.",
              "MIAA is proud to be part of this historical development, and aims to work alongside artists and other creative practitioners to enrich and educate our communities through art and creativity.",
              "As the Artistic Director of MIAA I look forward to the many conversations and collaborations ahead.",
            ].join("\n\n"),
          },
        ],
      },
    ],
  },
  {
    id: "community",
    label: "Community",
    path: "/community-engagement",
    sections: [
      {
        id: "hero",
        label: "Education Hero",
        fields: [
          {
            key: "community.hero.title",
            label: "Page title",
            type: "text",
            default: "Education & Community Engagement",
          },
          {
            key: "community.hero.heading",
            label: "Heading",
            type: "multiline",
            default: "Educating the Next\nGeneration of Thinkers",
          },
          {
            key: "community.hero.item1.title",
            label: "Item 1 — title",
            type: "text",
            default: "Teachers, Educators and Students",
          },
          {
            key: "community.hero.item1.body",
            label: "Item 1 — text",
            type: "richtext",
            default:
              "The Museum of Islamic Art Australia (MIAA) will deliver substantial education links for school-aged visitors through a bespoke education matrix which engages with both the Australian National curriculum and NSW curriculum. Dr Eeqbal Hassim, an education consultant specialising in intercultural education, international education, and global competencies development is currently working in collaboration with MIAA to deliver a dedicated suite of education programs. The museum education program will ensure meaningful engagement, tours, and specialised programs for school-aged visitors.",
          },
          {
            key: "community.hero.item2.title",
            label: "Item 2 — title",
            type: "text",
            default: "Children and Families",
          },
          {
            key: "community.hero.item2.body",
            label: "Item 2 — text",
            type: "richtext",
            default:
              "As part of our aim to enhance engagement with young people, the Museum will feature a Children's Gallery — the first dedicated Islamic arts focussed children's gallery in the Southern hemisphere. It will include hands-on and interactive displays, accessible contemporary and decorative Islamic art and literature for young children, and a curated series of educational programs with a focus on kinder and primary aged children. The space will also offer parents and bubs' reading groups and other age-appropriate art focussed activities.",
          },
        ],
      },
      {
        id: "culture",
        label: "Community & Culture",
        fields: [
          {
            key: "community.culture.label",
            label: "Section label",
            type: "text",
            default: "Community Engagement",
          },
          {
            key: "community.culture.heading",
            label: "Heading",
            type: "text",
            default: "At the Heart of Community and Culture",
          },
          {
            key: "community.culture.intro",
            label: "Intro paragraph",
            type: "richtext",
            default:
              "Community engagement is at the heart of MIAA. The team behind the establishment of the Museum has welcomed thousands of community members over the course of more than 15 years.",
          },
          {
            key: "community.culture.body",
            label: "Two-column paragraphs",
            type: "richtext",
            help: "Leave a blank line between the two paragraphs.",
            default: [
              "ISRA was established in 2009 as a product of community dialogue and service, quickly becoming a prime organisation for Muslim communities for integration into Australian society. ISRA has established itself as an institution renowned for its academic and Islamic education, diversified community work and interfaith engagement.",
              "ISRA continues to engage Muslims, Islamic organisations and communities from different orientations as well as other faith and cultural groups, schools, and faith-based organisations and institutions. We envision the Museum as a hub for community activities and engagement through the arts and education.",
            ].join("\n\n"),
          },
          {
            key: "community.culture.body2",
            label: "Closing paragraph",
            type: "richtext",
            default:
              "MIAA is committed to enhancing audience experience through a thoughtfully curated selection of community engagement activities, public programs, events and community networking opportunities. Local communities will also enjoy the benefits of the Museum program which includes access to our facilities to hold events, meetings and celebrations. As MIAA’s capacity grows, community based special interest groups such as art clubs and other creative groups will be supported to facilitate gatherings onsite at the museum through our Community Access Program (CAP).",
          },
        ],
      },
    ],
  },
  {
    id: "contact",
    label: "Contact",
    path: "/contact",
    sections: [
      {
        id: "page",
        label: "Contact Page",
        fields: [
          {
            key: "contact.page.heading",
            label: "Heading",
            type: "text",
            default: "Connect With the Museum",
          },
          {
            key: "contact.page.intro",
            label: "Intro paragraph",
            type: "richtext",
            default:
              "We’d love to hear from you. Whether you’d like to learn more about the Museum of Islamic Art Australia, explore partnership opportunities, or support our journey, our team is here to connect.",
          },
          {
            key: "contact.page.connectLabel",
            label: "Connect label",
            type: "text",
            default: "Connect",
          },
          {
            key: "contact.page.connectText",
            label: "Connect text",
            type: "multiline",
            default: "Stay connected with MIAA via our socials\nInstagram Facebook and YouTube",
          },
          {
            key: "contact.page.cta",
            label: "Submit button",
            type: "text",
            default: "Send Message",
          },
          {
            key: "contact.page.successTitle",
            label: "Success — title",
            type: "text",
            default: "Thank you!",
          },
          {
            key: "contact.page.successBody",
            label: "Success — message",
            type: "text",
            default: "Your submission has been received.",
          },
        ],
      },
    ],
  },
  {
    id: "offsite",
    label: "Offsite Events",
    path: "/offsite-events",
    sections: [
      {
        id: "hero",
        label: "Hero",
        fields: [
          {
            key: "offsite.hero.title",
            label: "Page title",
            type: "text",
            default: "Events at MIAA",
          },
        ],
      },
      {
        id: "programs",
        label: "Offsite Programs",
        fields: [
          {
            key: "offsite.programs.heading",
            label: "Heading",
            type: "text",
            default: "Offsite Programs and Events",
          },
        ],
      },
      {
        id: "families",
        label: "Families Discover",
        fields: [
          {
            key: "offsite.families.heading",
            label: "Heading",
            type: "text",
            default: "Where Families Discover Art Together",
          },
          {
            key: "offsite.families.location",
            label: "Card location note",
            type: "text",
            default: "At Gallery A, MIAA",
          },
          {
            key: "offsite.families.card1.title",
            label: "Card 1 — title",
            type: "text",
            default: "The Art of Connection",
          },
          {
            key: "offsite.families.card1.body",
            label: "Card 1 — text",
            type: "richtext",
            default:
              "How Islamic art continues to inspire creativity and unity across Australia's diverse communities.",
          },
          {
            key: "offsite.families.card2.title",
            label: "Card 2 — title",
            type: "text",
            default: "Behind the Vision",
          },
          {
            key: "offsite.families.card2.body",
            label: "Card 2 — text",
            type: "richtext",
            default:
              "Meet the people and ideas shaping the Museum of Islamic Art Australia's journey.",
          },
          {
            key: "offsite.families.card3.title",
            label: "Card 3 — title",
            type: "text",
            default: "Heritage and Design",
          },
          {
            key: "offsite.families.card3.body",
            label: "Card 3 — text",
            type: "richtext",
            default:
              "Exploring how tradition and innovation come together in MIAA's creative process.",
          },
        ],
      },
      {
        id: "previous",
        label: "Previous Events",
        fields: [
          {
            key: "offsite.previous.heading",
            label: "Heading",
            type: "text",
            default: "Previous Events",
          },
        ],
      },
    ],
  },
  {
    id: "timeline",
    label: "Timeline",
    path: "/timeline",
    sections: [
      {
        id: "hero",
        label: "Hero",
        fields: [
          {
            key: "timeline.hero.title",
            label: "Heading",
            type: "multiline",
            default: "The Journey Toward\nCompletion",
          },
          {
            key: "timeline.hero.cta",
            label: "Button",
            type: "text",
            default: "Learn More",
          },
          {
            key: "timeline.hero.intro",
            label: "Intro text",
            type: "richtext",
            help: "Leave a blank line between paragraphs.",
            default: [
              "MIAA is a significant community-led cultural project based in the heart of Western Sydney. We are excited to share the groundwork underpinning the MIAA project as we are fast approaching our build.",
              "Learn more about the architecture and construction of the museum and our project timeline.",
            ].join("\n\n"),
          },
        ],
      },
      {
        id: "architecture",
        label: "Architecture",
        fields: [
          {
            key: "timeline.arch.label",
            label: "Section label",
            type: "text",
            default: "Architectural Design",
          },
          {
            key: "timeline.arch.heading",
            label: "Heading",
            type: "multiline",
            default: "Architecture as Art\nand Experience",
          },
          {
            key: "timeline.arch.brief",
            label: "Brief note",
            type: "richtext",
            default:
              "MIAA officially launched the Architect Design Competition on 18 August 2025. Read the MIAA Architectural Design Brief here.",
          },
          {
            key: "timeline.arch.cta",
            label: "Button",
            type: "text",
            default: "Download",
          },
          {
            key: "timeline.arch.intro",
            label: "Intro paragraph",
            type: "richtext",
            default:
              "The Museum of Islamic Art Australia will be a unique architecturally designed space for showcasing the beauty, intricacy and innovation of Islamic art over the centuries. The museum's architecture will not only embrace Islamic design principles as a contemporary expression, but will also embrace the natural and urban landscape of the museum's location.",
          },
          {
            key: "timeline.arch.body",
            label: "Two-column paragraphs",
            type: "richtext",
            help: "Leave a blank line between the two paragraphs.",
            default: [
              "The architectural design forms part of the museum's story and will be incorporated into the multilayered learning experience for visitors. In other words, the building design will reflect and acknowledge the significance of architecture in the Islamic arts. By incorporating Islamic design principles, it is intended that the museum structure, in of itself, will form part of the 'art' of the museum.",
              "The museum galleries will be curated with multisensory experiences in mind. This unique experience will continue beyond the gallery walls to include taste, touch and scent — these museum offerings are delivered as part of the overall visitor experience through the museum gardens, specialty café and pantry, and the gift shop which offers unique Islamic inspired gifts, homewares and books.",
            ].join("\n\n"),
          },
        ],
      },
      {
        id: "rp",
        label: "RP Infrastructure",
        fields: [
          {
            key: "timeline.rp.label",
            label: "Section label",
            type: "text",
            default: "Project Management",
          },
          {
            key: "timeline.rp.heading",
            label: "Heading",
            type: "text",
            default: "About RP Infrastructure",
          },
          {
            key: "timeline.rp.body",
            label: "Body paragraphs",
            type: "richtext",
            help: "Leave a blank line between paragraphs.",
            default: [
              "After a rigorous selection process, the project management contract was awarded to RP Infrastructure, a highly reputable and experienced project management team with a history of managing major cultural infrastructure projects.",
              "RP Infrastructure specialises in delivering total solutions through effective planning and project management methodologies. This way we help our clients minimise risk and deliver the right outcomes for each and every project.",
              "RPI, in collaboration with our working committees, will manage the construction of the museum. Led by RPI Executive Director Chris Crick, with team members Paul van der Plaat (Project Director), Russell Kosko (Senior Project Manager), and Salma Malik (Assistant Project Manager).",
            ].join("\n\n"),
          },
        ],
      },
      {
        id: "video",
        label: "Video",
        fields: [
          {
            key: "timeline.video.label",
            label: "Section label",
            type: "text",
            default: "Watch The Story",
          },
        ],
      },
      {
        id: "project",
        label: "Project Timeline",
        fields: [
          {
            key: "timeline.project.label",
            label: "Section label",
            type: "text",
            default: "MIAA Project Timeline",
          },
          {
            key: "timeline.project.heading",
            label: "Heading",
            type: "multiline",
            default: "Museum of Islamic Art Australia\nProject Timeline",
          },
          {
            key: "timeline.project.cta",
            label: "Button",
            type: "text",
            default: "Watch Our First Steps",
          },
        ],
      },
    ],
  },
  {
    id: "support",
    label: "Support Us",
    path: "/support-us",
    sections: [
      {
        id: "hero",
        label: "Hero",
        fields: [
          { key: "support.hero.eyebrow", label: "Eyebrow", type: "text", default: "Building MIAA" },
          { key: "support.hero.title", label: "Heading", type: "text", default: "How Can I Get Involved?" },
          {
            key: "support.hero.subtitle",
            label: "Subtitle",
            type: "text",
            default: "Legacy donors, sadaqa jariyah & major gift giving.",
          },
        ],
      },
      {
        id: "founding",
        label: "Founding Member",
        fields: [
          {
            key: "support.founding.heading",
            label: "Heading",
            type: "text",
            default: "Become a founding member of the Museum of Islamic Art Australia",
          },
          {
            key: "support.founding.body1",
            label: "Paragraph 1",
            type: "richtext",
            default:
              "Founding members of the museum will be listed on our dedicated donor’s wall and museum archive. Donations can be made on behalf of an individual (named or anonymous) or a family. Founding members donations start from $5,000",
          },
          {
            key: "support.founding.body2",
            label: "Paragraph 2",
            type: "richtext",
            default:
              "Donate and sponsor an entire gallery, facility or hall. Contact MIAA directly for more details.",
          },
          { key: "support.founding.cta", label: "Button", type: "text", default: "Donate Now" },
          {
            key: "support.founding.note",
            label: "Note beside button",
            type: "text",
            default: "Stay in touch and be the first to hear about our upcoming campaign",
          },
          {
            key: "support.founding.listIntro",
            label: "List intro",
            type: "richtext",
            default:
              "Founding individuals and businesses (includes naming rights for 10 years and permanent founding member status) available for the following:",
          },
          { key: "support.founding.item1", label: "Item 1", type: "text", default: "Faith Gallery & Prayer Hall" },
          { key: "support.founding.item2", label: "Item 2", type: "text", default: "Children's Gallery" },
          { key: "support.founding.item3", label: "Item 3", type: "text", default: "Entry Foyer" },
          { key: "support.founding.item4", label: "Item 4", type: "text", default: "Temporary/Touring Gallery" },
          { key: "support.founding.item5", label: "Item 5", type: "text", default: "Function Room Sponsorship" },
          { key: "support.founding.item6", label: "Item 6", type: "text", default: "Library and Resource Centre" },
          { key: "support.founding.item7", label: "Item 7", type: "text", default: "Gallery Sponsorship" },
          { key: "support.founding.item8", label: "Item 8", type: "text", default: "Central Courtyard/Internal Garden" },
        ],
      },
      {
        id: "other",
        label: "Other Donations",
        fields: [
          {
            key: "support.other.heading",
            label: "Heading",
            type: "text",
            default: "Other Individual Donations Arranged Through Our Team",
          },
          { key: "support.other.cta", label: "Button", type: "text", default: "Donate Now" },
          { key: "support.other.opt1.text", label: "Option 1", type: "text", default: "Artwork acquisition fund" },
          { key: "support.other.opt2.label", label: "Option 2 — bold label", type: "text", default: "Construction material and labour (variable):" },
          { key: "support.other.opt2.text", label: "Option 2 — text", type: "text", default: "business logo displayed and listed as founding sponsor." },
          { key: "support.other.opt3.label", label: "Option 3 — bold label", type: "text", default: "Community Business Partnerships:" },
          { key: "support.other.opt3.text", label: "Option 3 — text", type: "text", default: "business logo/name displayed and listed as founding member." },
          { key: "support.other.opt4.label", label: "Option 4 — bold label", type: "text", default: "Any ongoing donation of professional services (such as gardening or maintenance):" },
          { key: "support.other.opt4.text", label: "Option 4 — text", type: "text", default: "business logo/name displayed and listed as supporting partner as founding member." },
          { key: "support.other.opt5.label", label: "Option 5 — bold label", type: "text", default: "Ongoing discounted goods, such as cleaning or maintenance supplies:" },
          { key: "support.other.opt5.text", label: "Option 5 — text", type: "text", default: "business logo/name displayed and listed as supporting partner" },
          { key: "support.other.opt6.label", label: "Option 6 — bold label", type: "text", default: "Exclusive offers for museum patrons (eg. food, beverages, toiletries etc.):" },
          { key: "support.other.opt6.text", label: "Option 6 — text", type: "text", default: "business logo/name displayed and listed as supporting partner" },
        ],
      },
      {
        id: "causes",
        label: "Our Causes",
        fields: [
          {
            key: "support.causes.label",
            label: "Divider label",
            type: "text",
            help: "The causes below come from Donation Products in the CMS.",
            default: "Our Causes",
          },
        ],
      },
      {
        id: "kids",
        label: "MIAA Kids",
        fields: [
          {
            key: "support.kids.heading",
            label: "Heading",
            type: "text",
            default: "My MIAA and MIAA Kids 2029",
          },
          {
            key: "support.kids.intro",
            label: "Intro paragraph",
            type: "richtext",
            default:
              "Stay in touch and be the first to join My MIAA and MIAA Kids prior to the Museum’s grand opening in early 2029. Benefits of becoming a MIAA Member:",
          },
          { key: "support.kids.benefit1", label: "Benefit 1", type: "text", default: "Free Museum entry all year round*" },
          { key: "support.kids.benefit2", label: "Benefit 2", type: "text", default: "Members only previews and exclusive guided tours" },
          { key: "support.kids.benefit3", label: "Benefit 3", type: "text", default: "Early release tickets for Museum events" },
          { key: "support.kids.benefit4", label: "Benefit 4", type: "text", default: "Early release tickets for the MIAA Annual Gala Dinner" },
          { key: "support.kids.benefit5", label: "Benefit 5", type: "text", default: "Enjoy discounts in the gift shop and cafe" },
          { key: "support.kids.benefit6", label: "Benefit 6", type: "text", default: "Memberships directly support the museum operations" },
          { key: "support.kids.note", label: "Footnote", type: "text", default: "*Excludes ticketed events" },
          { key: "support.kids.cta", label: "Button", type: "text", default: "Join Membership" },
        ],
      },
      {
        id: "volunteer",
        label: "Volunteer",
        fields: [
          { key: "support.volunteer.eyebrow", label: "Eyebrow", type: "text", default: "Coming Soon" },
          { key: "support.volunteer.heading", label: "Heading", type: "text", default: "Volunteer for MIAA" },
          {
            key: "support.volunteer.body1",
            label: "Paragraph 1",
            type: "richtext",
            default:
              "Do you have a passion for art, literature, poetry, film or performance? Have you ever wondered what a museum does and how they do it? Do you enjoy contributing to your community, learning new skills and meeting new people?",
          },
          {
            key: "support.volunteer.body2",
            label: "Paragraph 2",
            type: "richtext",
            default:
              "If you have answered yes to any of the above and you would like to join our growing team of dedicated volunteers, be sure to join our socials and mailing list to receive the Museum’s volunteer call out.",
          },
          { key: "support.volunteer.cta", label: "Button", type: "text", default: "Join Volunteer" },
        ],
      },
      {
        id: "faq",
        label: "Volunteer FAQ",
        fields: [
          { key: "support.faq.heading", label: "Heading", type: "text", default: "General Information for Volunteers" },
          { key: "support.faq.ageNumber", label: "Age badge — number", type: "text", default: "18" },
          { key: "support.faq.ageLabel", label: "Age badge — label", type: "text", default: "Minimum Age" },
          { key: "support.faq.q1", label: "Q1", type: "text", default: "I have submitted my form, when will I hear back from MIAA?" },
          { key: "support.faq.a1", label: "A1", type: "richtext", default: "We endeavour to respond to all applicants in due course. We responsibly engage our volunteers and will only contact you if/when meaningful volunteering opportunities become available in the area/s of interest you have selected." },
          { key: "support.faq.q2", label: "Q2", type: "text", default: "Working With Children Check" },
          { key: "support.faq.a2", label: "A2", type: "richtext", default: "All volunteers working with children or in child-related roles are required to hold a valid Working With Children Check (WWC)." },
          { key: "support.faq.q3", label: "Q3", type: "text", default: "I really want to volunteer but I don’t have a WWC, what should I do?" },
          { key: "support.faq.a3", label: "A3", type: "richtext", default: "You can apply for a WWC through your state or territory government. Once approved, you’ll be eligible for volunteer roles that involve working with children." },
          { key: "support.faq.q4", label: "Q4", type: "text", default: "Rewards and Benefits" },
          { key: "support.faq.a4", label: "A4", type: "richtext", default: "MIAA volunteers enjoy exclusive access to events, behind-the-scenes tours, training opportunities, and recognition for their contributions to the museum." },
          { key: "support.faq.q5", label: "Q5", type: "text", default: "Volunteer Policy" },
          { key: "support.faq.a5", label: "A5", type: "richtext", default: "All volunteers are expected to adhere to MIAA’s volunteer policy, which outlines responsibilities, code of conduct, and safety requirements." },
        ],
      },
    ],
  },
  {
    id: "donate",
    label: "Donations",
    path: "/donate",
    sections: [
      {
        id: "hero",
        label: "Hero",
        fields: [
          { key: "donate.hero.eyebrow", label: "Eyebrow", type: "text", default: "Support MIAA" },
          { key: "donate.hero.title", label: "Heading", type: "text", default: "Make a Donation" },
          {
            key: "donate.hero.subtitle",
            label: "Subtitle",
            type: "richtext",
            default:
              "Your generous contribution helps preserve and celebrate Islamic art and culture in Australia.",
          },
          { key: "donate.hero.cta", label: "Button", type: "text", default: "Donate Now" },
          { key: "donate.hero.chooseLink", label: "Choose-a-cause link", type: "text", default: "Choose a cause →" },
          {
            key: "donate.hero.caption",
            label: "Image caption",
            type: "text",
            default: "Building Australia’s home for Islamic art, together.",
          },
          { key: "donate.hero.badge1.label", label: "Badge 1 — title", type: "text", default: "Secure payments" },
          { key: "donate.hero.badge1.sub", label: "Badge 1 — subtitle", type: "text", default: "Stripe" },
          { key: "donate.hero.badge2.label", label: "Badge 2 — title", type: "text", default: "Instant receipts" },
          { key: "donate.hero.badge2.sub", label: "Badge 2 — subtitle", type: "text", default: "Emailed to you" },
          { key: "donate.hero.badge3.label", label: "Badge 3 — title", type: "text", default: "Direct impact" },
          { key: "donate.hero.badge3.sub", label: "Badge 3 — subtitle", type: "text", default: "Funds our programs" },
        ],
      },
      {
        id: "grid",
        label: "Causes Grid",
        fields: [
          { key: "donate.grid.eyebrow", label: "Eyebrow", type: "text", default: "Choose a Cause" },
          { key: "donate.grid.heading", label: "Heading", type: "text", default: "Where Your Donation Goes" },
          {
            key: "donate.grid.intro",
            label: "Intro paragraph",
            type: "richtext",
            default:
              "Every gift is directed to a specific programme — from safeguarding collections to educating the next generation. Choose where your support makes the greatest difference.",
          },
          {
            key: "donate.grid.viewMore",
            label: "View-more button",
            type: "text",
            help: "The causes themselves come from Donation Products in the CMS.",
            default: "View more causes",
          },
        ],
      },
      {
        id: "empty",
        label: "Causes Grid — nothing published",
        fields: [
          {
            key: "donate.empty.heading",
            label: "Heading",
            type: "text",
            help: "Shown in place of the causes grid while no cause is published.",
            default: "Support the Museum Directly",
          },
          {
            key: "donate.empty.body",
            label: "Paragraph",
            type: "richtext",
            default:
              "There are no specific causes open for donations at the moment. Every gift still goes straight to building Australia’s first museum dedicated to Islamic art — and to the programs and exhibitions along the way.",
          },
          { key: "donate.empty.cta", label: "Button", type: "text", default: "Donate Now" },
        ],
      },
      {
        id: "campaigns",
        label: "Campaigns",
        fields: [
          { key: "donate.campaigns.eyebrow", label: "Eyebrow", type: "text", default: "Active Campaigns" },
          { key: "donate.campaigns.heading", label: "Heading", type: "text", default: "Current Appeals" },
          { key: "donate.campaigns.itemLabel", label: "Per-card label", type: "text", default: "Campaign" },
          { key: "donate.campaigns.cta", label: "Card button", type: "text", default: "Support this Campaign" },
        ],
      },
    ],
  },
  {
    id: "volunteer",
    label: "Volunteer",
    path: "/volunteer",
    sections: [
      {
        id: "page",
        label: "Volunteer Page",
        fields: [
          { key: "volunteer.heading", label: "Heading", type: "text", default: "Volunteer With Us" },
          {
            key: "volunteer.intro",
            label: "Intro paragraph",
            type: "richtext",
            default:
              "The Museum of Islamic Art Australia is built by its community. Whether you can spare a few hours at an event or lend an ongoing hand, we'd love to have you on the team. Tell us a little about yourself and how you'd like to help.",
          },
          { key: "volunteer.cta", label: "Submit button", type: "text", default: "Submit Application" },
          { key: "volunteer.successTitle", label: "Success — title", type: "text", default: "Thank you!" },
          {
            key: "volunteer.successBody",
            label: "Success — message",
            type: "richtext",
            default:
              "Your volunteer application has been received. Our team will be in touch soon.",
          },
          { key: "volunteer.modalTitle", label: "Confirmation modal title", type: "text", default: "Thank you for applying!" },
        ],
      },
    ],
  },
  {
    id: "gala",
    label: "Gala Dinner",
    path: "/gala-dinner",
    sections: [
      {
        id: "hero",
        label: "Hero",
        fields: [
          { key: "gala.hero.eyebrow", label: "Eyebrow", type: "text", default: "Inaugural" },
          { key: "gala.hero.title", label: "Title", type: "text", default: "GALA DINNER" },
          { key: "gala.hero.subtitle", label: "Subtitle", type: "text", default: "Museum of Islamic Art Australia" },
          { key: "gala.hero.cta", label: "Button", type: "text", default: "Buy Ticket" },
        ],
      },
      {
        id: "intro",
        label: "Introduction",
        fields: [
          { key: "gala.intro.label", label: "Section label", type: "text", default: "Introduction" },
          { key: "gala.intro.heading", label: "Heading", type: "multiline", default: "From Vision to Reality:\nArchitectural Design Reveal" },
          {
            key: "gala.intro.body",
            label: "Body",
            type: "richtext",
            help: "Leave a blank line between paragraphs.",
            default: [
              "Join us for a landmark evening celebrating a major milestone in the journey of the Museum of Islamic Art Australia (MIAA) with the first public architectural reveal of the Museum design.",
              "In 2025, the site for the Museum of Islamic Art Australia was secured in Granville, Western Sydney, marking the beginning of a nationally significant cultural project.",
              "Now, with the architectural design completed, the vision enters its next stage.",
              "Located within Sydney's emerging cultural corridor and connected to the Parramatta cultural precinct, the Museum is positioned to become a major destination for education, tourism and cultural engagement.",
              "The evening brings together leaders from the arts, education, philanthropy, business, government and community to mark this important national milestone.",
            ].join("\n\n"),
          },
          { key: "gala.intro.captionText", label: "Artwork caption", type: "text", default: "One Thousand and One and Counting (1004 and counting)" },
          { key: "gala.intro.captionAuthor", label: "Artwork artist", type: "text", default: "Abdullah MI Syed" },
        ],
      },
      {
        id: "sponsors",
        label: "Sponsors",
        fields: [
          { key: "gala.sponsors.label", label: "Section label", type: "text", default: "Our Sponsors" },
          { key: "gala.sponsors.heading", label: "Heading", type: "text", default: "Sponsored By" },
        ],
      },
      {
        id: "sponsorship",
        label: "Sponsorship",
        fields: [
          { key: "gala.sponsorship.label", label: "Section label", type: "text", default: "Sponsorship" },
          { key: "gala.sponsorship.heading", label: "Heading", type: "multiline", default: "Sponsorship\nOpportunities" },
          { key: "gala.sponsorship.cta", label: "Button", type: "text", default: "Download Sponsorship Package" },
          {
            key: "gala.sponsorship.body",
            label: "Body",
            type: "richtext",
            help: "Leave a blank line between paragraphs.",
            default: [
              "Sponsorship of the MIAA Inaugural Gala Dinner offers businesses and organisations a meaningful opportunity to be associated with the establishment of Australia's first Museum of Islamic Art.",
              "Our valued Sponsors will be supporting a nationally significant cultural initiative that contributes to education, community connection and Australia's engagement with global artistic heritage.",
              "To explore sponsorship opportunities please review our sponsorship package available via download here.",
            ].join("\n\n"),
          },
        ],
      },
      {
        id: "donate",
        label: "Donate",
        fields: [
          { key: "gala.donate.label", label: "Label", type: "text", default: "Support the Museum" },
          {
            key: "gala.donate.body",
            label: "Text",
            type: "richtext",
            default:
              "Not sponsoring, but would still like to help? Every contribution, large or small, brings Australia's first Museum of Islamic Art a little closer.",
          },
          { key: "gala.donate.cta", label: "Button", type: "text", default: "Make a Donation" },
        ],
      },
      {
        id: "details",
        label: "Event Details",
        fields: [
          { key: "gala.details.label", label: "Section label", type: "text", default: "Event" },
          { key: "gala.details.heading", label: "Heading", type: "text", default: "Event Details" },
          {
            key: "gala.details.body",
            label: "Description",
            type: "richtext",
            default:
              "Join us on this auspicious occasion, hear from our special guest speakers and entertainment, and enjoy a fine dining experience in the stunning surroundings of the Art Gallery of New South Wales. Your attendance directly supports the building of MIAA. We look forward to welcoming you on the night.",
          },
          { key: "gala.details.day", label: "Day", type: "text", default: "Saturday" },
          { key: "gala.details.date", label: "Date", type: "text", default: "25 July 2026" },
          { key: "gala.details.time", label: "Time", type: "text", default: "6:00PM — 11:00PM" },
          { key: "gala.details.arrivalLabel", label: "Arrival label", type: "text", default: "Arrival Reception" },
          { key: "gala.details.arrivalTime", label: "Arrival time", type: "text", default: "6:00PM" },
          { key: "gala.details.dinnerLabel", label: "Dinner label", type: "text", default: "Dinner Commences" },
          { key: "gala.details.dinnerTime", label: "Dinner time", type: "text", default: "7:00PM" },
          { key: "gala.details.venueName", label: "Venue name", type: "multiline", default: "Art Gallery of New\nSouth Wales" },
          { key: "gala.details.venueHall", label: "Venue hall", type: "text", default: "Kaldor Hall" },
          { key: "gala.details.venueAddr1", label: "Venue address line 1", type: "text", default: "Ground level of the Naala Nura building" },
          { key: "gala.details.venueAddr2", label: "Venue address line 2", type: "text", default: "Art Gallery Road, The Domain, Sydney NSW 2000, Australia" },
          { key: "gala.details.mapsLabel", label: "Maps link", type: "text", default: "Open Maps" },
          { key: "gala.details.ticketHeading", label: "Ticket heading", type: "text", default: "Ticket" },
          { key: "gala.details.ticketBody", label: "Ticket text", type: "richtext", default: "Attendance is by booking only. This is an adult only, no-alcohol and halal friendly event. Book your tickets here." },
          { key: "gala.details.ticketCta", label: "Ticket button", type: "text", default: "Buy Ticket" },
        ],
      },
      {
        id: "location",
        label: "Location",
        fields: [
          { key: "gala.location.label", label: "Section label", type: "text", default: "Location" },
          { key: "gala.location.heading", label: "Heading", type: "text", default: "How to Get Here" },
          { key: "gala.location.findHeading", label: "Sub-heading", type: "text", default: "Where to Find Us" },
          { key: "gala.location.address", label: "Address", type: "text", default: "Art Gallery Road, The Domain, Sydney NSW 2000, Australia" },
          {
            key: "gala.location.addressBody",
            label: "Directions",
            type: "richtext",
            default:
              "On the eastern side of Sydney's CBD, next to the Royal Botanic Gardens and the Domain, just down the road from St Mary's Cathedral. About 5-minute walk from Macquarie Street, across the Domain, or from Hyde Park.",
          },
          { key: "gala.location.mapsCta", label: "Maps button", type: "text", default: "Open Maps" },
        ],
      },
      {
        id: "transport",
        label: "Transport",
        fields: [
          { key: "gala.transport.heading", label: "Heading", type: "text", default: "Public Transport Options" },
          { key: "gala.transport.busTitle", label: "Bus — title", type: "text", default: "Bus" },
          { key: "gala.transport.busBody", label: "Bus — text", type: "richtext", default: "Bus 441 – Departs from the York Street side of Queen Victoria Building (Stand D) and drops off near the Art Gallery. Returns to Queen Victoria Building, picking up outside the Art Gallery." },
          { key: "gala.transport.trainTitle", label: "Train — title", type: "text", default: "Train" },
          { key: "gala.transport.taxiTitle", label: "Taxi — title", type: "text", default: "Taxis and Rideshare" },
          { key: "gala.transport.taxiBody", label: "Taxi — text", type: "richtext", default: "Drop-off and pick-up zone on Art Gallery Road near the front of the Art Gallery." },
        ],
      },
      {
        id: "parking",
        label: "Parking",
        fields: [
          { key: "gala.parking.heading", label: "Heading", type: "text", default: "Parking" },
          { key: "gala.parking.meterTitle", label: "Meter — title", type: "text", default: "Meter Parking" },
          { key: "gala.parking.meterBody", label: "Meter — text", type: "richtext", default: "On Mrs Macquarie's Road and other streets around the Art Gallery." },
          { key: "gala.parking.stationsTitle", label: "Stations — title", type: "text", default: "Parking Stations" },
          { key: "gala.parking.stationsBody", label: "Stations — text", type: "richtext", default: "There are several car parks near the Art Gallery. The closest are the Domain Car Park and The Wharf, Woolloomooloo Car Park, both of which can be booked in advance online." },
          { key: "gala.parking.stationsNoteLabel", label: "Stations — note label", type: "text", default: "Note changes to access from the Domain Car Park:" },
          { key: "gala.parking.stationsNote", label: "Stations — note", type: "richtext", default: " The lift closest to the Art Gallery is not operational as it is being replaced by Wilson Parking. There are stairs, and the car park's south lift remains operational." },
          { key: "gala.parking.bicyclesTitle", label: "Bicycles — title", type: "text", default: "Bicycles" },
          { key: "gala.parking.bicyclesBody", label: "Bicycles — text", type: "richtext", default: "Bike parking is available along Art Gallery Road for both buildings. Bike racks are located at the front of the Naala Nura building and outside the Naala Badu building, opposite the Woolloomooloo Gate entrance to the Royal Botanic Garden." },
          { key: "gala.parking.busesTitle", label: "Buses — title", type: "text", default: "Buses" },
          { key: "gala.parking.busesBody", label: "Buses — text", type: "richtext", default: "Drop-off and pick-up zone on Art Gallery Road near the front of the Art Gallery but no dedicated parking spaces." },
          { key: "gala.parking.mapTitle", label: "Map modal title", type: "text", default: "Venue Map" },
        ],
      },
    ],
  },
  {
    id: "galatickets",
    label: "Gala Tickets",
    path: "/gala-dinner/tickets",
    sections: [
      {
        id: "hero",
        label: "Ticket Hero",
        fields: [
          { key: "galatickets.heading", label: "Heading", type: "text", default: "Secure Your Seat" },
          {
            key: "galatickets.intro",
            label: "Intro",
            type: "richtext",
            default:
              "Book your tickets to join us for an unforgettable evening celebrating the architectural reveal of Australia's first Museum of Islamic Art. Your attendance directly supports the building of MIAA.",
          },
          { key: "galatickets.pricingLabel", label: "Pricing label", type: "text", default: "Ticket Pricing" },
          { key: "galatickets.cta", label: "Submit button", type: "text", default: "Buy Ticket" },
          { key: "galatickets.successTitle", label: "Success — title", type: "text", default: "Booking received" },
          { key: "galatickets.successBody", label: "Success — message", type: "text", default: "We'll be in touch with your confirmation shortly." },
        ],
      },
    ],
  },
  {
    id: "smwf",
    label: "SMWF",
    path: "/smwf",
    sections: [
      {
        id: "hero",
        label: "Hero",
        fields: [
          { key: "smwf.hero.topbar", label: "Top bar", type: "text", default: "Proceed to Museum of Islamic Art Australia" },
          { key: "smwf.hero.topbarShort", label: "Top bar (mobile)", type: "text", default: "Visit MIAA" },
          { key: "smwf.hero.date", label: "Date", type: "text", default: "10-19 April 2026" },
          { key: "smwf.hero.heading", label: "Heading", type: "multiline", default: "Celebrating the Power of\nMuslim Voices" },
          {
            key: "smwf.hero.intro",
            label: "Intro",
            type: "richtext",
            default:
              "Experience a festival that honours diverse Muslim writers and the stories that shape who we are — coming April 2026.",
          },
          { key: "smwf.hero.cta", label: "Button", type: "text", default: "Get Tickets" },
        ],
      },
      {
        id: "about",
        label: "About",
        fields: [
          { key: "smwf.about.visionHeading", label: "Vision heading", type: "text", default: "Our Vision" },
          {
            key: "smwf.about.visionBody",
            label: "Vision text",
            type: "richtext",
            default:
              "To cultivate and foster a deeper understanding and appreciation of literature written by Muslims across diverse genres, for local and international audiences.",
          },
        ],
      },
      {
        id: "festival",
        label: "Festival Day",
        fields: [
          { key: "smwf.festival.heading", label: "Heading", type: "text", default: "Festival Day" },
        ],
      },
    ],
  },
  {
    // Site-wide: the footer renders on every public page except SMWF, which has
    // its own. The preview loads Home and the footer sits at the bottom of it.
    id: "footer",
    label: "Footer",
    path: "/",
    sections: [
      {
        id: "acknowledgement",
        label: "Acknowledgement of Country",
        fields: [
          {
            key: "footer.acknowledgement.lead",
            label: "First line",
            type: "text",
            default:
              "MIAA is proudly located on beautiful Dharug country in Granville, Western Sydney.",
          },
          {
            key: "footer.acknowledgement.body",
            label: "Acknowledgement",
            type: "richtext",
            default:
              "The Museum of Islamic Art Australia (MIAA) respectfully acknowledges the Burramattagal people of the Dharug Nation as the Traditional Owners of the land on which the museum will be located. We pay our respects to Elders past, present and emerging. Sovereignty has never been ceded.",
          },
        ],
      },
      {
        id: "about",
        label: "About MIAA",
        fields: [
          {
            key: "footer.about.lead",
            label: "Text before the ISRA link",
            type: "text",
            default: "Museum of Islamic Art Australia is an initiative of the",
          },
          {
            key: "footer.about.linkLabel",
            label: "Link text",
            type: "text",
            default: "Islamic Sciences and Research Academy (ISRA)",
          },
          {
            key: "footer.about.linkUrl",
            label: "Link address",
            type: "text",
            help: "Where the link above goes.",
            default: "https://isra.org.au",
          },
          {
            key: "footer.about.funding",
            label: "Funding line",
            type: "text",
            help: "Shown after the link, on the same paragraph.",
            default:
              "Funded by the Government of New South Wales Western Sydney Infrastructure Grants Program.",
          },
        ],
      },
      {
        id: "links",
        label: "Quick Links",
        fields: [
          {
            key: "footer.links.islamicArt",
            label: "Link 1",
            type: "text",
            help: "Goes to the Islamic Art in Australia page.",
            default: "Islamic Art in Australia",
          },
          {
            key: "footer.links.offsite",
            label: "Link 2",
            type: "text",
            help: "Goes to the Offsite Events page.",
            default: "MIAA Off-Site Events",
          },
          {
            key: "footer.links.events",
            label: "Link 3",
            type: "text",
            help: "Goes to the Events page.",
            default: "Sydney Muslim Writers Festival",
          },
          {
            key: "footer.links.community",
            label: "Link 4",
            type: "text",
            help: "Goes to the Community Engagement page.",
            default: "Community Engagement & Education",
          },
          {
            key: "footer.links.timeline",
            label: "Link 5",
            type: "text",
            help: "Goes to the Timeline page.",
            default: "MIAA Timeline & Construction",
          },
          {
            key: "footer.links.contact",
            label: "Link 6",
            type: "text",
            help: "Goes to the Contact page.",
            default: "Contact Us",
          },
        ],
      },
      {
        id: "connect",
        label: "Connect & Socials",
        fields: [
          {
            key: "footer.connect.label",
            label: "Heading",
            type: "text",
            default: "Connect",
          },
          {
            key: "footer.connect.text",
            label: "Text",
            type: "multiline",
            help: "Press Enter for a line break.",
            default: "Stay connected with MIAA via our socials\nInstagram, Facebook and YouTube",
          },
          // Each social icon is shown only when its address is filled in, so a
          // blank field simply removes that icon from the footer. The three
          // accounts that already exist ship as defaults; the rest are blank
          // and can be switched on from here without a code change.
          {
            key: "footer.social.instagram",
            label: "Instagram",
            type: "text",
            help: "Full profile address. Clear to restore the original link.",
            default: "https://www.instagram.com/museumofislamicartaustralia/",
          },
          {
            key: "footer.social.facebook",
            label: "Facebook",
            type: "text",
            help: "Full profile address. Clear to restore the original link.",
            default: "https://www.facebook.com/miaaustralia.org",
          },
          {
            key: "footer.social.youtube",
            label: "YouTube",
            type: "text",
            help: "Full channel address. Clear to restore the original link.",
            default: "https://www.youtube.com/@MuseumofIslamicArtAustralia",
          },
          {
            key: "footer.social.linkedin",
            label: "LinkedIn",
            type: "text",
            help: "Paste the page address to show the icon. Leave blank to hide it.",
            default: "",
          },
          {
            key: "footer.social.tiktok",
            label: "TikTok",
            type: "text",
            help: "Paste the profile address to show the icon. Leave blank to hide it.",
            default: "",
          },
          {
            key: "footer.social.x",
            label: "X (Twitter)",
            type: "text",
            help: "Paste the profile address to show the icon. Leave blank to hide it.",
            default: "",
          },
          {
            key: "footer.social.threads",
            label: "Threads",
            type: "text",
            help: "Paste the profile address to show the icon. Leave blank to hide it.",
            default: "",
          },
        ],
      },
      {
        id: "newsletter",
        label: "Newsletter Signup",
        fields: [
          {
            key: "footer.newsletter.heading",
            label: "Heading",
            type: "text",
            default: "Stay Connected",
          },
          {
            key: "footer.newsletter.body",
            label: "Text",
            type: "richtext",
            default: "Get news and updates from the Museum of Islamic Art Australia.",
          },
          {
            key: "footer.newsletter.placeholder",
            label: "Email box placeholder",
            type: "text",
            default: "Email address",
          },
          {
            key: "footer.newsletter.success",
            label: "Success message",
            type: "text",
            help: "Shown under the form once someone subscribes.",
            default: "Thanks — you’re on the list.",
          },
          {
            key: "footer.newsletter.modalTitle",
            label: "Thank-you pop-up — title",
            type: "text",
            default: "Thank you for subscribing!",
          },
          {
            key: "footer.newsletter.modalBody",
            label: "Thank-you pop-up — message",
            type: "richtext",
            help: "Leave a blank line between paragraphs.",
            default:
              "As part of signing up, we’ve added you to our contact list, you can unsubscribe anytime.",
          },
        ],
      },
      {
        id: "legal",
        label: "Copyright",
        fields: [
          {
            key: "footer.legal.copyright",
            label: "Copyright line",
            type: "text",
            default: "© 2026 Museum of Islamic Art Australia",
          },
          {
            key: "footer.legal.creditLead",
            label: "Credit — text",
            type: "text",
            default: "Website by",
          },
          {
            key: "footer.legal.creditLabel",
            label: "Credit — link text",
            type: "text",
            default: "Think Studio",
          },
          {
            key: "footer.legal.creditUrl",
            label: "Credit — link address",
            type: "text",
            default: "https://www.thinkstudio.com.au",
          },
        ],
      },
    ],
  },
]

// ── Media merge ──────────────────────────────────────────────────

/** Field types that hold a media URL rather than copy. */
export const MEDIA_TYPES = new Set(["image", "video", "embed"])

export const isMediaType = (type) => MEDIA_TYPES.has(type)

/** The accessible-description key that accompanies a media field. */
export const altKeyFor = (key) => `${key}.alt`

/**
 * Fold `MEDIA_ENTRIES` into the text groups so the editor shows a section's
 * images and video alongside its copy. Sections and groups referenced by a
 * media entry but absent from the text registry are created on the fly.
 *
 * An entry may also declare `mirrors: [{ groupId, sectionId }]`. A file shared
 * across pages is registered once but *surfaced* in each page that renders it,
 * so an editor working on Home finds the artwork used by Home's Islamic Art
 * block instead of having to know it lives under the Islamic Art tab. Both
 * copies point at the same key, so editing either edits the one value.
 */
function buildGroups() {
  const groups = TEXT_GROUPS.map((g) => ({
    ...g,
    sections: g.sections.map((s) => ({ ...s, fields: [...s.fields] })),
  }))

  const sectionFor = ({ groupId, groupLabel, groupPath, sectionId, sectionLabel }) => {
    let group = groups.find((g) => g.id === groupId)
    if (!group) {
      group = {
        id: groupId,
        label: groupLabel || groupId,
        path: groupPath || "/",
        sections: [],
      }
      groups.push(group)
    }
    let section = group.sections.find((s) => s.id === sectionId)
    if (!section) {
      section = { id: sectionId, label: sectionLabel || sectionId, fields: [] }
      group.sections.push(section)
    }
    return section
  }

  for (const entry of MEDIA_ENTRIES) {
    sectionFor(entry).fields.push(...entry.fields)
    for (const mirror of entry.mirrors || []) {
      sectionFor(mirror).fields.push(...entry.fields)
    }
  }

  return groups
}

export const CONTENT_GROUPS = buildGroups()

// ── Derived lookups ──────────────────────────────────────────────

/** Flat { key → default } map, built once from the registry. */
export const CONTENT_DEFAULTS = (() => {
  const out = {}
  for (const group of CONTENT_GROUPS) {
    for (const section of group.sections) {
      for (const field of section.fields) {
        out[field.key] = field.default ?? ""
        // A media field's `alt` declares a companion text key edited in the
        // same card, so it needs a default like any other string.
        if (typeof field.alt === "string") out[altKeyFor(field.key)] = field.alt
      }
    }
  }
  return out
})()

/** Flat { key → field descriptor } map for the editor. */
export const CONTENT_FIELDS = (() => {
  const out = {}
  for (const group of CONTENT_GROUPS) {
    for (const section of group.sections) {
      for (const field of section.fields) {
        out[field.key] = { ...field, groupId: group.id, sectionId: section.id }
      }
    }
  }
  return out
})()

export function findGroup(id) {
  return CONTENT_GROUPS.find((g) => g.id === id) || CONTENT_GROUPS[0]
}
