/**
 * Builds the MIAA "Site Content" user guide as a print-ready HTML file, styled
 * to match miaa-user-guide.pdf (the Platform Handbook).
 *
 * Render:  chrome --headless --print-to-pdf=... --no-pdf-header-footer guide.html
 */
const fs = require("fs")
const path = require("path")

const ASSETS = "E:/Miaa/MIAA/src/assets/images/Homepage"
const b64 = (f) => fs.readFileSync(path.join(ASSETS, f)).toString("base64")
const CREAM_LOGO = `data:image/png;base64,${b64("smalllogo.png")}`

const TOTAL = 14
let pageNo = 0

/** A body page with the standard running footer. */
const page = (inner) => {
  pageNo += 1
  return `<section class="page">
  <div class="pad">${inner}</div>
  <div class="foot"><span>MIAA Site Content Guide</span><span>Page ${pageNo} of ${TOTAL}</span></div>
</section>`
}

const loc = (html) => `<div class="loc"><span class="loclabel">Location:</span> ${html}</div>`
const note = (label, html) => `<div class="note"><b>${label}:</b> ${html}</div>`
const c = (t) => `<code>${t}</code>`

/** Numbered steps, as in the handbook. */
const steps = (items) =>
  `<div class="steps">${items
    .map((t, i) => `<div class="step"><span class="sn">${i + 1}</span><span class="st">${t}</span></div>`)
    .join("")}</div>`

/** Two-column reference table. */
const table = (head, rows, opts = {}) =>
  `<table class="${opts.cls || ""}">
  <thead><tr>${head.map((h) => `<th>${h}</th>`).join("")}</tr></thead>
  <tbody>${rows
    .map((r) => `<tr>${r.map((cell, i) => `<td class="${i === 0 ? "k" : ""}">${cell}</td>`).join("")}</tr>`)
    .join("")}</tbody>
</table>`

/* ─────────────────────────────────────────────────────────────── contents */

const TOC = [
  ["Getting started", [
    ["1. What Site Content is", 3],
    ["2. Opening the editor", 3],
    ["3. The workspace", 4],
  ]],
  ["Editing", [
    ["4. Choosing a page", 5],
    ["5. Finding a field", 5],
    ["6. Editing text", 6],
    ["7. Images and video", 7],
    ["&nbsp;&nbsp;&nbsp;&nbsp;7.1 Replacing a file", 7, true],
    ["&nbsp;&nbsp;&nbsp;&nbsp;7.2 Video links", 7, true],
    ["&nbsp;&nbsp;&nbsp;&nbsp;7.3 Description (alt text)", 8, true],
    ["&nbsp;&nbsp;&nbsp;&nbsp;7.4 What can be uploaded", 8, true],
    ["&nbsp;&nbsp;&nbsp;&nbsp;7.5 Files shared by more than one page", 8, true],
    ["8. The live preview", 9],
    ["9. Publishing", 10],
    ["10. Putting the original back", 10],
  ]],
  ["Reference", [
    ["11. What is on each page", 11],
    ["12. What is not edited here", 12],
    ["13. If something looks wrong", 13],
  ]],
  ["Appendix", [
    ["A. Field types", 14],
    ["B. Buttons and shortcuts", 14],
    ["C. Glossary", 14],
  ]],
]

const tocHtml = TOC.map(
  ([group, rows]) => `<h3 class="tocgroup">${group}</h3>
  <ul class="toc">${rows
    .map(
      ([label, p, sub]) =>
        `<li class="${sub ? "sub" : ""}"><span class="tl">${label}</span><span class="dots"></span><span class="tp">${p}</span></li>`
    )
    .join("")}</ul>`
).join("")

/* ─────────────────────────────────────────── page 4 workspace schematic */

const marker = (n) => `<span class="mk">${n}</span>`

const schematic = `
<div class="mock">
  <div class="mockcols">
    <!-- editor column -->
    <div class="mcol">
      <div class="mrow">
        <div class="pilltrack">
          <span class="pill on">Home</span><span class="pill">About</span>
          <span class="pill">Islamic Art<i class="dot"></i></span><span class="pill">Community</span>
        </div>${marker(1)}
      </div>
      <div class="mrow">
        <div class="msearch">Search this page…</div>
        <div class="micons"><i></i><i></i><i></i></div>
        <div class="mtag">Unsaved</div>${marker(2)}
      </div>
      <div class="mrow">
        <div class="chips"><span class="cl">Jump to</span><span class="chip on">Hero</span><span class="chip">About Us</span><span class="chip">Islamic Art<i class="dot"></i></span></div>${marker(3)}
      </div>
      <div class="card">
        <div class="chead"><span>Hero</span><span class="cbadge">2 unsaved</span><span class="chev"></span></div>
        <div class="cbody">
          <div class="flabel">Heading <span class="edited">Edited</span></div>
          <div class="inp">A Space for Art, Culture</div>
          <div class="flabel">Description</div>
          <div class="inp tall"></div>
        </div>${marker(4)}
      </div>
      <div class="card">
        <div class="chead"><span>About Us</span><span class="cmedia">2</span><span class="chev"></span></div>
      </div>
    </div>
    <!-- preview column -->
    <div class="mcol">
      <div class="browser">
        <div class="btop">
          <span class="bdots"><i></i><i></i><i></i></span>
          <span class="burl">miaaustralia.org</span>
          <span class="bicons"><i class="on"></i><i></i><i></i></span>
        </div>
        <div class="bbody">
          <div class="bline w70"></div><div class="bline w45"></div>
          <div class="bpara"></div><div class="bpara w80"></div>
          <div class="bimg"></div>
        </div>
      </div>${marker(5)}
      <div class="pubbar"><span>3 unsaved changes</span><span class="pb">Publish</span>${marker(6)}</div>
    </div>
  </div>
</div>`

/* ───────────────────────────────────────────────────────────────── pages */

// The bundled logo carries the "Museum of Islamic Art Australia" line beneath the
// wordmark; the cover states that in its own eyebrow, so the mark is cropped to
// the wordmark alone.
const P_COVER = `<section class="page cover">
  <span class="clogo"><img src="${CREAM_LOGO}" alt="MIAA"></span>
  <div class="ctitle">
    <p class="ceyebrow">Museum of Islamic Art Australia</p>
    <h1>Site Content<br>Guide</h1>
    <span class="crule"></span>
    <p class="clead">How to change the words, images and video on the public
    website from the admin portal — with a live preview of every edit before
    anything is published.</p>
  </div>
  <p class="cmeta">Version 1.0 &nbsp;|&nbsp; 13 August 2026 &nbsp;|&nbsp; miaaustralia.org</p>
</section>`

const P_TOC = `<section class="page">
  <div class="pad">
    <p class="eyebrow">Contents</p>
    <h1 class="tochead">Table of Contents</h1>
    <hr class="tocrule">
    ${tocHtml}
  </div>
  <div class="foot"><span>MIAA Site Content Guide</span><span>Page 2 of ${TOTAL}</span></div>
</section>`
pageNo = 2

const P3 = page(`
<h2>1. What Site Content is</h2>
<p>Site Content is the one screen in the admin portal where the words, pictures and
video on the public website are edited. It covers the fixed copy of every public
page — headings, paragraphs, buttons, labels and list items — together with the
photography, background video and video links those pages show.</p>

${table(["What it covers", "How much"], [
  ["Editable fields", "355 across the whole public website"],
  ["Pictures, video and video links", "86 of those fields"],
  ["Public pages", "15, listed in section 11"],
])}

<p>Every change you make is stored as an override on top of what ships with the
website. The original wording and the original file are always kept, so
<b>Reset</b> can put either back at any time.</p>

${note("Note", `Site Content changes what the website says and shows, never how it
looks. Layout, colour, type size and spacing belong to the design.`)}

<h2>2. Opening the editor</h2>
${loc(`Sidebar &gt; Settings &gt; Site Content &nbsp;|&nbsp; ${c("/admin/content")}`)}
<p>Sign in to the admin portal and choose <b>Site Content</b>, near the bottom of the
sidebar under <b>Settings</b>. Your ordinary admin sign-in is all that is needed.</p>

<h3>2.1 The three figures in the corner</h3>
<p>They count the whole website, not the page you happen to be looking at.</p>
${table(["Figure", "What it counts"], [
  ["fields", "Every field that can be edited anywhere on the public website"],
  ["images &amp; videos", "How many of those fields hold a picture, a video or a video link"],
  ["changed", `How many fields no longer match what shipped with the website —
   including changes published weeks ago. It turns terracotta once it is above zero.`],
])}
`)

const P4 = page(`
<h2>3. The workspace</h2>
<p>The screen is split in two. The left half is the editor; the right half is the
page itself, updating as you type. On a wide screen only the editor scrolls, so
the preview cannot drift out of view. On a laptop or tablet the two stack, editor
first.</p>

${schematic}

${table(["", "Part", "What it is for"], [
  [marker(1), "Page track", "One button per public page. Choose the page you want to edit — section 4"],
  [marker(2), "Search and filters", "Narrow a long page down to the field you are after — section 5"],
  [marker(3), "Jump to", "Skip straight to a section of the page"],
  [marker(4), "Section cards", "The fields themselves, grouped as they appear on the page. Fold a card away by choosing its heading"],
  [marker(5), "Live preview", "The real page in its real design — section 8"],
  [marker(6), "Publish bar", "Appears only when something is unpublished — section 9"],
], { cls: "mktable" })}

${note("Tip", `Nothing on this screen reaches the public website until you publish.
Type freely — until then, the only person seeing your edits is you.`)}
`)

const P5 = page(`
<h2>4. Choosing a page</h2>
<p>The row of buttons along the top of the editor is the page selector — one per
public page, fifteen in all. Choosing one changes both the fields below it and
the preview beside it.</p>
<ul>
  <li>The row scrolls sideways. A small arrow appears at either end whenever there
  are more pages that way.</li>
  <li>A dot on a page button means that page holds changes you have not published yet.</li>
  <li>Moving between pages <b>keeps</b> your unsaved edits. They stay staged, on
  every page you have touched, until you publish or discard them.</li>
  <li>Moving between pages does clear the search box and reopen any sections you
  had folded away.</li>
</ul>

<h2>5. Finding a field</h2>
<p>A page such as Home carries a great many fields. Four tools narrow them down,
and they work together.</p>

${table(["Tool", "What it does"], [
  ["Search", `Matches the field's label and the words currently in it, on the page
   you are on. Clearing the box brings everything back.`],
  ["Type filter", `Three small buttons: <b>Everything</b>, <b>Text only</b>, or
   <b>Images &amp; video only</b>. The last is the quickest way to find a picture.`],
  ["Unsaved", `Shows only what you have changed in this session and not yet published.`],
  ["Jump to", `A chip for each section of the page. Choosing one reopens that section
   and scrolls to it. A terracotta dot marks a section with unsaved changes, and the
   chip for the section you are looking at stays highlighted as you scroll.`],
])}

<p><b>Jump to</b> is hidden while you are searching or while <b>Unsaved</b> is on,
because the list is already short.</p>

<h3>5.1 Section cards</h3>
<p>Each card heading carries the section's name, a count of the pictures and video
inside it, and — where they exist — the number of unsaved changes. Choosing the
heading folds the card away, which is the easiest way to work down a long page.</p>

${note("Note", `If a filter leaves nothing on screen the editor says so — either
“Nothing unsaved on this page” or that no field matches what you searched for.`)}
`)

const P6 = page(`
<h2>6. Editing text</h2>
${loc("Site Content &gt; any page &gt; any section")}
<p>Fields sit in the section they belong to on the page, labelled with what they
are — Heading, Description, Button — and most carry a short note underneath
saying where the words land.</p>

<h3>6.1 The three kinds of text field</h3>
${table(["Kind", "How it behaves"], [
  ["Single line", "One line of text. Headings, buttons and short labels."],
  ["Multiline", `Press Enter for a line break. Used where a heading is deliberately
   broken across two lines, as the home page hero is.`],
  ["Rich text", `Leave a blank line between paragraphs and the page renders them as
   separate paragraphs. The box grows as you type, so long copy is never hidden.`],
])}

<h3>6.2 The Edited mark</h3>
<p>As soon as a field differs from the wording that shipped with the website, a
terracotta dot and the word <b>Edited</b> appear beside its label, and a
<b>Reset</b> link appears opposite. The mark stays after publishing: it means
“this is no longer the original”, not “this is unsaved”. Unsaved work is counted
on the section heading and on the bar at the foot of the screen instead.</p>

<h3>6.3 Writing for the page</h3>
<ul>
  <li>Keep headings close to the length of the original. Type size is set by the
  design, so much longer wording simply wraps onto more lines.</li>
  <li>Line breaks and paragraphs are the only formatting. There is no bold, italic
  or link, and typed HTML appears on the page as typed.</li>
  <li>Curly quotes and apostrophes are safe to paste in, as are accented characters.</li>
  <li>An emptied field falls back to the original wording rather than showing
  nothing, so a field cannot be used to hide a heading.</li>
</ul>

${note("Careful", `Nothing you write here is checked before it goes out beyond your
own browser's spelling check. Read it in the preview first — that is what it is for.`)}
`)

const P7 = page(`
<h2>7. Images and video</h2>
<p>Pictures, background video and video links sit in the same list as the copy, in
the section they belong to, each in a card showing the file as it stands.</p>

<h3>7.1 Replacing a file</h3>
${steps([
  `Find the card. Setting the type filter to <b>Images &amp; video only</b> hides
   everything else on the page.`,
  `Drag a file onto the picture, or hover over it and choose <b>Replace</b> to pick
   one from your computer.`,
  `A bar shows the upload's progress. A large video takes a moment; leave the page
   open until it finishes.`,
  `The card shows the new file straight away and the preview follows. Publish when
   you are happy with it.`,
])}
<p>A card holding a file of your own is badged <b>Custom</b>, and its <b>Reset</b>
puts the file that shipped with the website back.</p>

<h3>7.2 Video links</h3>
<p>A few cards take a web address rather than a file — the project video on the
Timeline page, and two on the SMWF page. Paste the ordinary address of a YouTube
or Vimeo video and the player appears underneath, so you can check you have the
right one before publishing.</p>
${table(["What you can paste", "Example"], [
  ["A YouTube watch link", c("https://www.youtube.com/watch?v=…")],
  ["A YouTube short link", c("https://youtu.be/…")],
  ["A Vimeo link", c("https://vimeo.com/123456789")],
])}
<p>The address is converted to the player form for you; there is no need to find
an embed code.</p>

<h3>7.3 Description (alt text)</h3>
<p>Where a card offers a <b>Description (alt text)</b> box, it holds the sentence a
screen reader speaks in place of the picture, and the words search engines read.
Describe what the picture shows — “The museum's Kufic calligraphy façade at dusk”
— rather than naming the file. It is saved and reset together with the picture it
belongs to.</p>
`)

const P8 = page(`
<h3>7.4 What can be uploaded</h3>
${table(["Kind", "Formats", "Largest file"], [
  ["Image", "PNG, JPEG, WebP, AVIF, GIF, SVG", "10 MB"],
  ["Video", "MP4, WebM, MOV", "100 MB"],
])}
<p>Both are checked in your browser and again by the server. A file that is too
large, or of a kind that is not on the list, is refused with a message on the card
and nothing is uploaded — so a mistake here costs nothing.</p>

${note("Note", `Replace like with like. The design decides how a picture is cropped,
so a tall portrait dropped in where a wide banner used to be will lose its top and
bottom. Matching the shape of the file you are replacing is the safest approach.`)}

<h3>7.5 Files shared by more than one page</h3>
<p>Some pictures appear on more than one page. Rather than hide them under whichever
page happens to own them, the editor shows them under every page that uses them —
but there is only one file underneath, so editing either copy changes both.</p>

${table(["File", "Appears under"], [
  ["Five Islamic Art artworks", "Islamic Art, Home"],
  ["Three offsite programme pictures", "Offsite Events, Home"],
  ["Previous Events stand-in", "Offsite Events, Home"],
  ["Contact picture", "Home, About, Contact"],
  ["Gala hero", "Gala Dinner, Gala Tickets"],
  ["Twelve past-festival photographs", "SMWF — Past Festivals and Festival Day"],
], { cls: "wide" })}

${note("Note", `A file you have uploaded stays in the museum's media store even after
you reset the card. Reset points the field back at the original; it does not delete
your upload, which may still be in use elsewhere.`)}
`)

const P9 = page(`
<h2>8. The live preview</h2>
<p>The right-hand side is the public page itself, in its real design — not a
mock-up of it. It follows your typing within a moment of you stopping.</p>

<h3>8.1 The controls above it</h3>
${table(["Control", "What it does"], [
  ["Desktop, Tablet, Mobile", `Narrows the preview to that width. Worth a look
   whenever you lengthen a heading, since a line that sits neatly on a desktop can
   wrap awkwardly on a phone.`],
  ["Reload", `Loads the page again from scratch. Use it if part of the page has
   stopped following your typing.`],
  ["Open in new tab", `Opens the public page in a tab of its own. That tab shows what
   is <b>published</b>, not what you are editing — which makes it a useful
   before-and-after.`],
  ["The address", "Which public page you are looking at, so there is no doubt."],
])}

<h3>8.2 What it is showing you</h3>
<p>The preview shows the page as it would be if you published this moment: your
unsaved edits, over everything published before them. Visitors carry on seeing the
published version until you publish.</p>

<h3>8.3 Two things worth knowing</h3>
<ul>
  <li>The home page normally opens with a short animation. The preview skips it so
  your edits appear immediately rather than after it has played.</li>
  <li>Words and pictures update as you type. A section that builds itself only once,
  such as a carousel, may need <b>Reload</b> before it picks a change up.</li>
</ul>

${note("Tip", `Check a long paragraph on <b>Mobile</b> before publishing. It is the
narrowest the design ever gets, and where extra wording shows first.`)}
`)

const P10 = page(`
<h2>9. Publishing</h2>
<p>The moment anything differs from what is published, a dark bar appears at the
foot of the screen carrying the number of unsaved changes.</p>

${table(["Button", "What it does"], [
  ["Publish", `Puts every unsaved change onto the public website — across every page
   you have edited in this session, not only the one in front of you.`],
  ["Discard", `Throws away every unsaved change and returns to what is published.
   It cannot be undone.`],
])}

<p><b>⌘/Ctrl+S</b> publishes too, from anywhere on the screen. A short message
confirms it: <i>Content saved — live on the site</i>. The bar then disappears,
which is your sign that the website has the change.</p>

<p>Only what changed is sent. A field you have put back to its original wording is
cleared rather than saved, so that piece of the page follows the website again if
the design is updated later.</p>

${note("Important", `Publishing is immediate and covers the whole site. There is no
draft, no approval step and no scheduled publishing here — when the bar goes, the
change is public.`)}

<p>Every publish and every reset is written to the <b>Audit Log</b>, with who made
it and which fields were touched, so a change can always be traced back.</p>

<h2>10. Putting the original back</h2>
${table(["What you want back", "How"], [
  ["One text field", "<b>Reset</b>, beside the field's label"],
  ["One picture, video or link", "<b>Reset</b>, in the card's heading"],
  ["Everything unsaved, everywhere", "<b>Discard</b>, on the publish bar"],
])}
<p><b>Reset</b> stages the original in exactly the way typing does — it reaches the
public website when you publish, not before. <b>Discard</b> is immediate, because
it only throws away work that had not left your screen.</p>
`)

const P11 = page(`
<h2>11. What is on each page</h2>
<p>One button on the page track for each of these. The sections named are the cards
you will find under that button.</p>

${table(["Page", "Address", "Sections you can edit"], [
  ["Home", c("/"), "Hero, About Us, Islamic Art, Offsite Events, SMWF, Education, Timeline, Insights, Contact"],
  ["About", c("/about"), "Hero, Director's Message, Project Background, Museum Location, Museum Mission, Strategic Direction, The People, Contact"],
  ["Islamic Art", c("/islamic-art"), "Page title and body, the five artworks"],
  ["Community", c("/community-engagement"), "Education Hero, Community &amp; Culture"],
  ["Contact", c("/contact"), "The contact page's wording"],
  ["Offsite Events", c("/offsite-events"), "Hero carousel, Offsite Programs, Families Discover, Previous Events"],
  ["Timeline", c("/timeline"), "Hero, Architecture, RP Infrastructure, the project video, Project Timeline labels"],
  ["Support Us", c("/support-us"), "Hero, Founding Member, Other Donations, Support Causes, MIAA Kids, Volunteer, Volunteer FAQ"],
  ["Donations", c("/donate"), "Hero and its three badges, Products grid, Campaigns"],
  ["Volunteer", c("/volunteer"), "Heading, introduction, buttons and confirmation message"],
  ["Gala Dinner", c("/gala-dinner"), "Hero, Intro, Sponsors, Sponsorship, Donate, Event Details, Location, Transport, Parking"],
  ["Gala Tickets", c("/gala-dinner/tickets"), "Ticket heading and introduction, the stage banner"],
  ["SMWF", c("/smwf"), "Hero, Our Vision, Festival Day, Stories We Inherit, programme and gallery photography, partner logos"],
  ["Blog", c("/blog"), "The stand-in picture for a featured article with no cover"],
  ["Brand", "site-wide", "The site logo and the footer logo"],
], { cls: "pagetable" })}

${note("Note", `The last two hold pictures only. Blog articles themselves, and every
other list of records, are managed elsewhere — see section 12.`)}
`)

const P12 = page(`
<h2>12. What is not edited here</h2>
<p>Site Content holds the fixed copy and imagery of the website. Anything that is a
list of records has a section of its own in the sidebar, and a few pieces of the
design are deliberately left alone.</p>

<h3>12.1 Managed elsewhere in the portal</h3>
${table(["Content", "Where it lives"], [
  ["Events and their pictures", "Events"],
  ["Team members and photographs", "Team"],
  ["Blog articles and covers", "Blog Posts"],
  ["Sponsor logos", "Sponsors"],
  ["Donation causes", "Products"],
  ["Appeals and their targets", "Campaigns"],
  ["Site-wide contact details", "Site Settings"],
], { cls: "wide" })}
<p>The headings and labels <i>around</i> those lists — and the stand-in picture used
when a record has none of its own — are in Site Content, so the wording of a section
can be changed without touching the records inside it.</p>

<h3>12.2 Left in the design on purpose</h3>
${table(["What", "Why"], [
  ["Patterns, ornaments, icons", `They are part of the layout. Replacing one breaks
   the design rather than updating the content.`],
  ["The opening animation", `It plays before the saved content has arrived, so a
   replaced picture would flash the original first.`],
  ["34 SMWF panellist portraits", `Each belongs with a name and a biography, so they
   want a section of their own rather than 34 loose picture fields.`],
  ["SMWF timetables and tiers", `Structured festival data, still held in the design,
   alongside the panellists' biographies.`],
  ["The event pass logo", `The pass is produced as a PDF file and carries its own
   copy of the logo.`],
], { cls: "wide" })}

${note("Note", `Anything in the second table can be made editable later — each one is
a small addition to the same registry the editor is built from. Ask, and it can be
added to a future release.`)}
`)

const P13 = page(`
<h2>13. If something looks wrong</h2>

${table(["What you see", "What it usually is"], [
  ["The change is not on the public website", `It has not been published. Look for the
   dark bar at the foot of the editor and choose <b>Publish</b>.`],
  ["The preview has stopped following your typing", `Choose <b>Reload</b> above the
   preview. A section that builds itself once does not always pick a change up.`],
  [`“That file is 14.2 MB — the limit is 10 MB”`, `The file is too large. Save the
   picture at a smaller size, or compress the video. See 7.4.`],
  [`“image/heic isn't supported here”`, `The format is not one the website accepts.
   Export it as JPEG or PNG and try again.`],
  [`“Upload failed — check the bucket's CORS policy”`, `A server setting, not
   something you can fix from here. Pass it to whoever maintains the site.`],
  [`“Public media bucket is not configured on the server”`, `The same — the media store
   has not been set up on this server. Text still saves normally.`],
  ["A replaced picture looks cropped or stretched", `The new file is a different shape
   from the one it replaced. Match the original's proportions.`],
  ["I cannot find the field I want", `It may be under a different page button, hidden
   by the type filter or the <b>Unsaved</b> toggle, or not editable here at all — see
   section 12.`],
  ["A heading has split onto two lines", `Multiline fields keep your line breaks.
   Put the cursor at the start of the second line and press Backspace.`],
  ["A picture changed on a page I was not editing", `The file is shared between pages.
   See 7.5.`],
  ["I published something by mistake", `Type the original wording back, or use
   <b>Reset</b>, and publish again. The Audit Log records what was changed and when.`],
])}
`)

const P14 = page(`
<h2>Appendix A. Field types</h2>
${table(["Type", "What it holds"], [
  ["Single line", "One line of text"],
  ["Multiline", "Text where Enter makes a line break"],
  ["Rich text", "Text where a blank line makes a new paragraph"],
  ["Image", "An uploaded picture, up to 10 MB"],
  ["Video", "An uploaded video file, up to 100 MB"],
  ["Video link", "A YouTube or Vimeo web address"],
  ["Description", "The alt text that goes with a picture"],
], { cls: "tight" })}

<h2>Appendix B. Buttons and shortcuts</h2>
${table(["Button", "What it does"], [
  ["Publish", "Sends every unsaved change to the public website"],
  ["Discard", "Throws away every unsaved change"],
  ["Reset", "Puts one field or one file back to the original"],
  ["Replace", "Chooses a new file for a picture or video card"],
  ["Unsaved", "Shows only what you have changed this session"],
  ["Reload", "Loads the preview again from scratch"],
  ["⌘ / Ctrl + S", "Publishes, from anywhere on the screen"],
], { cls: "tight" })}

<h2>Appendix C. Glossary</h2>
${table(["Term", "Meaning"], [
  ["Field", "One editable thing — a heading, a paragraph, a picture"],
  ["Section", "A group of fields matching a block of the public page"],
  ["Original", "The wording or file that shipped with the website"],
  ["Edited / Custom", "This field no longer matches the original"],
  ["Unsaved", "Changed on your screen, not yet on the public website"],
  ["Alt text", "The description of a picture, read aloud by screen readers"],
], { cls: "tight" })}
`)

/* ─────────────────────────────────────────────────────────────────── css */

const CSS = `
:root{
  --teal:#1D4A54; --teal-d:#173C45; --terra:#B9553C; --terra-l:#C4674E;
  --ink:#33383A; --muted:#6E7679; --cream:#F3EEE8; --rule:#DAD4CC;
  --rule-d:#B8B0A6; --chip:#EDE7E0;
}
*{ box-sizing:border-box; margin:0; padding:0; }
html,body{ -webkit-print-color-adjust:exact; print-color-adjust:exact; }
@page{ size:A4; margin:0; }
body{
  font-family:"Segoe UI","Lato","Helvetica Neue",Arial,sans-serif;
  color:var(--ink); font-size:9.6pt; line-height:1.62;
  font-feature-settings:"kern" 1; text-rendering:optimizeLegibility;
}
.page{ width:210mm; height:297mm; position:relative; overflow:hidden;
  page-break-after:always; background:#fff; }
.page:last-child{ page-break-after:auto; }
.pad{ padding:20mm 19mm 0; }

/* ───────── cover ───────── */
.cover{ background:#1D4A54;
  background-image:linear-gradient(146deg,#2E5E69 0%,#245059 38%,#1A4048 72%,#15353D 100%);
  color:#F4F0EA; padding:0; }
.clogo{ position:absolute; left:24mm; top:31mm; width:45mm; height:10.6mm;
  overflow:hidden; display:block; }
.clogo img{ width:100%; display:block; }
.ctitle{ position:absolute; left:24mm; right:24mm; top:120mm; }
.ceyebrow{ font-size:7.6pt; letter-spacing:.26em; text-transform:uppercase;
  color:#B9C7CA; margin-bottom:5mm; }
.cover h1{ font-family:Georgia,"Times New Roman",serif; font-weight:700;
  font-size:35pt; line-height:1.12; letter-spacing:-.005em; color:#F6F2EC; }
.crule{ display:block; width:16mm; height:2.6pt; background:var(--terra-l);
  margin:7mm 0 6mm; }
.clead{ font-size:11pt; line-height:1.62; color:#D3DCDD; max-width:112mm; }
.cmeta{ position:absolute; left:24mm; bottom:26mm; font-size:8.6pt; color:#9FB1B4; }

/* ───────── contents ───────── */
.eyebrow{ font-size:7.4pt; letter-spacing:.26em; text-transform:uppercase;
  color:var(--terra); font-weight:600; margin-bottom:3mm; }
.tochead{ font-family:Georgia,serif; font-weight:700; font-size:23pt;
  color:var(--teal); letter-spacing:-.01em; }
.tocrule{ border:none; border-top:1px solid var(--rule); margin:5mm 0 5mm; }
.tocgroup{ font-family:Georgia,serif; font-weight:400; font-size:13.5pt;
  color:var(--terra); margin:6mm 0 2.5mm; }
.tocgroup:first-of-type{ margin-top:0; }
ul.toc{ list-style:none; }
ul.toc li{ display:flex; align-items:baseline; font-size:9.6pt; line-height:1.35;
  padding:.75mm 0; }
ul.toc li.sub .tl{ color:var(--muted); font-size:9.2pt; }
ul.toc .tl{ flex:0 0 auto; }
ul.toc .dots{ flex:1; margin:0 2mm; border-bottom:1px dotted #C9C2B9;
  transform:translateY(-1px); }
ul.toc .tp{ flex:0 0 auto; color:var(--muted); font-size:9pt; }

/* ───────── headings ───────── */
h2{ font-family:Georgia,serif; font-weight:700; font-size:15.5pt; color:var(--teal);
  letter-spacing:-.005em; padding-bottom:2.4mm; border-bottom:1px solid #C4BDB3;
  margin:0 0 4mm; }
h2+h2, p+h2, ul+h2, table+h2, .note+h2, .steps+h2{ margin-top:9mm; }
h3{ font-family:Georgia,serif; font-weight:700; font-size:11.4pt; color:var(--teal);
  margin:7mm 0 2.5mm; }
.pad > :first-child{ margin-top:0; }
p{ margin-bottom:3mm; }
ul:not(.toc){ margin:0 0 3mm 4.6mm; }
ul:not(.toc) li{ margin-bottom:1.6mm; padding-left:1.2mm; }
ul:not(.toc) li::marker{ color:var(--terra); }
b{ font-weight:600; color:#22282A; }
i{ font-style:italic; }
code{ font-family:Consolas,"SF Mono",monospace; font-size:8.4pt; background:var(--chip);
  color:#40575D; padding:.6mm 1.4mm; border-radius:1.5px; white-space:nowrap; }

/* ───────── location bar ───────── */
.loc{ background:var(--cream); border-left:2.6pt solid var(--terra);
  padding:2.4mm 4mm; margin:0 0 4mm; font-size:9pt; color:#4A5457; }
.loclabel{ font-size:7.2pt; letter-spacing:.16em; text-transform:uppercase;
  color:var(--terra); font-weight:600; margin-right:1.5mm; }

/* ───────── notes ───────── */
.note{ background:var(--cream); padding:3.2mm 4.5mm; margin:5mm 0 3mm;
  font-size:9.2pt; line-height:1.58; color:#454D50; }
.note b{ color:var(--terra); font-weight:700; }

/* ───────── steps ───────── */
.steps{ margin:0 0 3.5mm; }
.step{ display:flex; gap:3mm; align-items:flex-start; margin-bottom:2.2mm; }
.sn{ flex:0 0 auto; width:4.4mm; height:4.4mm; border-radius:1.2px;
  background:var(--terra); color:#fff; font-size:7.4pt; font-weight:600;
  display:flex; align-items:center; justify-content:center; margin-top:.9mm; }
.st{ flex:1; }

/* ───────── tables ───────── */
table{ width:100%; border-collapse:collapse; margin:0 0 3mm; }
th{ text-align:left; font-size:7.2pt; letter-spacing:.17em; text-transform:uppercase;
  color:var(--terra); font-weight:600; padding:0 4mm 1.8mm 0;
  border-bottom:1.1pt solid var(--rule-d); }
td{ text-align:left; font-size:9.4pt; line-height:1.5; padding:2.6mm 4mm 2.6mm 0;
  border-bottom:.7pt solid var(--rule); vertical-align:top; }
td:last-child,th:last-child{ padding-right:0; }
td.k{ color:#22282A; width:44mm; }
table.wide td.k{ width:52mm; }
table.tight td{ padding:1.6mm 4mm 1.6mm 0; }
table.tight+h2{ margin-top:7.5mm; }
table.pagetable td.k{ width:32mm; }
table.pagetable td:nth-child(2){ width:36mm; }
table.mktable th:first-child,table.mktable td:first-child{ width:9mm; }
table.mktable td:nth-child(2){ width:34mm; color:#22282A; }

/* ───────── workspace schematic ───────── */
.mock{ border:.7pt solid var(--rule); background:#FBF9F7; padding:4mm;
  margin:1mm 0 6mm; }
.mockcols{ display:flex; gap:4mm; }
.mcol{ flex:1; min-width:0; }
.mrow{ display:flex; align-items:center; gap:1.6mm; margin-bottom:2mm; }
.mk{ display:inline-flex; align-items:center; justify-content:center;
  width:4mm; height:4mm; border-radius:50%; background:var(--teal); color:#fff;
  font-size:6.4pt; font-weight:600; flex:0 0 auto; }
table.mktable .mk{ margin-top:.4mm; }
.pilltrack{ flex:1; display:flex; gap:1mm; background:#fff; border:.6pt solid var(--rule);
  border-radius:6mm; padding:.9mm; overflow:hidden; }
.pill{ font-size:5.6pt; letter-spacing:.08em; text-transform:uppercase; color:#9AA1A3;
  padding:.9mm 2mm; border-radius:5mm; white-space:nowrap; display:inline-flex;
  align-items:center; gap:.8mm; }
.pill.on{ background:var(--teal); color:#fff; }
.dot{ width:1.1mm; height:1.1mm; border-radius:50%; background:var(--terra);
  display:inline-block; }
.msearch{ flex:1; background:#fff; border:.6pt solid var(--rule); border-radius:5mm;
  padding:1.2mm 2.5mm; font-size:6pt; color:#A9AFB0; }
.micons{ display:flex; gap:.8mm; background:#fff; border:.6pt solid var(--rule);
  border-radius:5mm; padding:.7mm; }
.micons i{ width:3mm; height:3mm; border-radius:50%; background:#E6E1DB; display:block; }
.micons i:first-child{ background:var(--teal); }
.mtag{ font-size:5.6pt; color:#9AA1A3; border:.6pt solid var(--rule); background:#fff;
  border-radius:5mm; padding:1mm 2mm; }
.chips{ display:flex; align-items:center; gap:1.2mm; }
.cl{ font-size:5pt; letter-spacing:.16em; text-transform:uppercase; color:#B0B5B6; }
.chip{ font-size:5.6pt; letter-spacing:.06em; text-transform:uppercase; color:#9AA1A3;
  padding:.8mm 1.8mm; border-radius:4mm; display:inline-flex; align-items:center; gap:.8mm; }
.chip.on{ background:#E7EBEC; color:var(--teal); }
.card{ background:#fff; border:.6pt solid var(--rule); border-radius:2mm;
  margin-bottom:2mm; position:relative; }
.chead{ display:flex; align-items:center; gap:1.5mm; padding:2mm 2.5mm;
  font-size:5.8pt; letter-spacing:.14em; text-transform:uppercase; color:#7C8385; }
.chead span:first-child{ flex:1; }
.cbadge{ background:#F2E3DE; color:var(--terra); border-radius:4mm; padding:.4mm 1.5mm;
  letter-spacing:0; text-transform:none; font-size:5.4pt; }
.cmedia{ color:#B0B5B6; font-size:5.4pt; }
.chev{ width:2.6mm; height:2.6mm; border-right:.6pt solid #B0B5B6;
  border-bottom:.6pt solid #B0B5B6; transform:rotate(45deg) translate(-.5mm,-.5mm); }
.cbody{ border-top:.6pt solid #EFEBE6; padding:2.5mm; }
.flabel{ font-size:5.2pt; letter-spacing:.16em; text-transform:uppercase; color:#9AA1A3;
  margin-bottom:1mm; }
.edited{ color:var(--terra); letter-spacing:0; text-transform:none; font-size:5.2pt; }
.inp{ border:.6pt solid var(--rule); border-radius:1.5mm; padding:1.4mm 2mm;
  font-size:6pt; color:#5C6668; margin-bottom:2.5mm; }
.inp.tall{ height:9mm; margin-bottom:0; }
.browser{ border:.6pt solid var(--rule); border-radius:2mm; overflow:hidden;
  background:#fff; }
.btop{ display:flex; align-items:center; gap:1.5mm; padding:1.6mm 2mm;
  background:#F5F1EC; border-bottom:.6pt solid var(--rule); }
.bdots{ display:flex; gap:.8mm; }
.bdots i{ width:1.5mm; height:1.5mm; border-radius:50%; background:#D8CFC6; display:block; }
.bdots i:first-child{ background:#DEB1A4; }
.burl{ flex:1; text-align:center; font-size:5.4pt; color:#A9AFB0; }
.bicons{ display:flex; gap:.8mm; }
.bicons i{ width:2.4mm; height:2.4mm; border-radius:50%; background:#E6E1DB; display:block; }
.bicons i.on{ background:var(--teal); }
.bbody{ padding:4mm 3.5mm; }
.bline{ height:2.6mm; background:#DDE3E4; border-radius:.6mm; margin-bottom:1.6mm; }
.bline.w70{ width:70%; } .bline.w45{ width:45%; }
.bpara{ height:1.4mm; background:#EDE9E4; border-radius:.6mm; margin-bottom:1.2mm; }
.bpara.w80{ width:80%; }
.bimg{ height:17mm; background:#E7E2DC; border-radius:1mm; margin-top:3mm; }
.pubbar{ display:flex; align-items:center; gap:2mm; background:#16363E; color:#E9E3DA;
  border-radius:6mm; padding:1.6mm 1.6mm 1.6mm 3.5mm; margin-top:3mm; font-size:6pt; }
.pubbar span:first-child{ flex:1; }
.pb{ background:var(--terra); color:#fff; border-radius:5mm; padding:1.1mm 2.6mm;
  font-size:5.4pt; letter-spacing:.1em; text-transform:uppercase; }
.pubbar .mk{ background:#fff; color:var(--teal); }

/* ───────── running footer ───────── */
.foot{ position:absolute; left:19mm; right:19mm; bottom:14mm; display:flex;
  justify-content:space-between; font-size:8pt; color:#9A9891; }
`

/* ─────────────────────────────────────────────────────────────── assemble */

const html = `<!doctype html>
<html><head><meta charset="utf-8"><title>MIAA Site Content Guide</title>
<style>${CSS}</style></head>
<body>
${P_COVER}
${P_TOC}
${P3}${P4}${P5}${P6}${P7}${P8}${P9}${P10}${P11}${P12}${P13}${P14}
</body></html>`

const out = path.join(__dirname, "site-content-guide.html")
fs.writeFileSync(out, html)
console.log("wrote", out, "pages:", pageNo)
