const fs = require("fs")
const path = require("path")

const ROOT = path.resolve(__dirname, "..")
const cream = fs.readFileSync(path.join(ROOT, "src/assets/images/Homepage/smalllogo.png")).toString("base64")
const dark = fs.readFileSync(path.join(ROOT, "src/assets/images/Homepage/Footer Logo.png")).toString("base64")
const CREAM = `data:image/png;base64,${cream}`
const DARK = `data:image/png;base64,${dark}`

// Think Studio typographic wordmark (no image asset available) rendered in CSS.
const thinkStudio = (light) => `
<span class="ts-mark ${light ? "ts-light" : ""}">
  <span class="ts-dot"></span>
  <span class="ts-name"><b>Think</b> Studio</span>
</span>`

const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<style>
  :root{
    --teal:#214952; --terra:#C15C45; --cream:#F3EFEB; --ink:#1B1E1E;
    --line:rgba(33,73,82,.14); --muted:rgba(33,73,82,.62);
  }
  *{ box-sizing:border-box; margin:0; padding:0; }
  html,body{ -webkit-print-color-adjust:exact; print-color-adjust:exact; }
  @page{ size:A4; margin:0; }
  body{ font-family:"Helvetica Neue",Arial,sans-serif; color:var(--teal); font-size:10.5pt; line-height:1.55; }
  .serif{ font-family:Georgia,"Times New Roman",serif; }
  .page{ width:210mm; height:297mm; position:relative; overflow:hidden; page-break-after:always; background:#fff; }
  .page:last-child{ page-break-after:auto; }
  .pad{ padding:16mm 17mm; }

  /* ---- header band ---- */
  .band{ background:var(--teal); color:var(--cream); padding:11mm 17mm 10mm; display:flex; align-items:center; justify-content:space-between; }
  .band img.logo{ height:13mm; display:block; }
  .kicker{ font-size:7.5pt; letter-spacing:.32em; text-transform:uppercase; opacity:.7; }

  /* ---- think studio mark ---- */
  .ts-mark{ display:inline-flex; align-items:center; gap:6px; font-size:11pt; letter-spacing:.02em; color:var(--teal); }
  .ts-mark .ts-name b{ font-weight:700; }
  .ts-mark .ts-name{ font-weight:300; }
  .ts-dot{ width:9px; height:9px; border-radius:50%; background:var(--terra); display:inline-block; }
  .ts-light{ color:var(--cream); }
  .ts-light .ts-dot{ background:var(--terra); }

  /* ---- typography ---- */
  h1{ font-size:27pt; line-height:1.08; font-weight:400; letter-spacing:-.01em; }
  h1 em{ font-style:italic; color:var(--terra); }
  h2{ font-size:16pt; font-weight:400; margin-bottom:3mm; }
  .lead{ font-size:11pt; color:var(--muted); line-height:1.6; max-width:150mm; }
  .eyebrow{ font-size:7.5pt; letter-spacing:.3em; text-transform:uppercase; color:var(--terra); font-weight:700; margin-bottom:4mm; }
  p+p{ margin-top:2mm; }
  .small{ font-size:9pt; color:var(--muted); }
  code{ font-family:"SF Mono",Consolas,monospace; background:rgba(193,92,69,.10); color:var(--terra); padding:1px 5px; border-radius:3px; font-size:9pt; }

  /* ---- flow diagram ---- */
  .flow{ display:flex; align-items:stretch; gap:0; margin:7mm 0 3mm; }
  .node{ flex:1; background:var(--cream); border:1px solid var(--line); border-radius:6px; padding:6mm 5mm; text-align:center; }
  .node .ic{ width:13mm; height:13mm; border-radius:50%; background:#fff; border:1px solid var(--line); display:flex; align-items:center; justify-content:center; margin:0 auto 3.5mm; }
  .node h4{ font-size:10.5pt; font-weight:700; margin-bottom:1.5mm; }
  .node p{ font-size:8.5pt; color:var(--muted); line-height:1.45; }
  .arrow{ display:flex; align-items:center; justify-content:center; width:14mm; color:var(--terra); flex:0 0 auto; }
  .node.accent{ background:var(--teal); border-color:var(--teal); }
  .node.accent h4,.node.accent p{ color:var(--cream); }
  .node.accent .ic{ background:rgba(255,255,255,.12); border-color:rgba(255,255,255,.25); }

  /* ---- cards ---- */
  .cards{ display:flex; gap:5mm; margin-top:8mm; }
  .card{ flex:1; border:1px solid var(--line); border-radius:6px; padding:6mm 5mm; }
  .card .num{ font-family:Georgia,serif; font-size:15pt; color:var(--terra); }
  .card h4{ font-size:10.5pt; font-weight:700; margin:2mm 0 1.5mm; }
  .card p{ font-size:9pt; color:var(--muted); }

  /* ---- steps ---- */
  .step{ display:flex; gap:6mm; padding:6mm 0; border-top:1px solid var(--line); }
  .step:first-of-type{ border-top:none; }
  .step .badge{ flex:0 0 auto; width:11mm; height:11mm; border-radius:50%; background:var(--teal); color:var(--cream); display:flex; align-items:center; justify-content:center; font-family:Georgia,serif; font-size:13pt; }
  .step .body{ flex:1; }
  .step h3{ font-size:12.5pt; font-weight:700; margin-bottom:1.5mm; }
  .step p{ font-size:9.5pt; color:var(--muted); }

  /* ---- admin mock ---- */
  .mock{ margin-top:4mm; border:1px solid var(--line); border-radius:6px; overflow:hidden; background:#fff; }
  .mock .topbar{ background:var(--cream); padding:3mm 5mm; border-bottom:1px solid var(--line); font-size:7.5pt; letter-spacing:.22em; text-transform:uppercase; color:var(--muted); }
  .mock .topbar b{ color:var(--teal); letter-spacing:.02em; text-transform:none; font-size:10pt; display:block; margin-top:1mm; }
  .mock .formrow{ display:flex; gap:4mm; padding:5mm; }
  .mock .field{ flex:1; }
  .mock .field label{ font-size:6.5pt; letter-spacing:.2em; text-transform:uppercase; color:rgba(33,73,82,.5); display:block; margin-bottom:1.5mm; }
  .mock .field .inp{ border:1px solid var(--line); border-radius:3px; padding:2.5mm 3mm; font-size:9pt; color:var(--muted); background:#fff; }
  .mock .field .inp.filled{ color:var(--teal); }
  .mock .formfoot{ display:flex; align-items:center; justify-content:space-between; padding:0 5mm 5mm; }
  .mock .chk{ font-size:8.5pt; color:var(--muted); display:flex; align-items:center; gap:2mm; }
  .mock .chk .box{ width:3.5mm; height:3.5mm; border:1px solid var(--line); border-radius:2px; display:inline-block; }
  .btn{ background:var(--terra); color:#fff; font-size:9pt; font-weight:600; padding:2.5mm 5mm; border-radius:3px; display:inline-flex; align-items:center; gap:2mm; }

  /* ---- table ---- */
  table{ width:100%; border-collapse:collapse; margin-top:5mm; }
  th,td{ text-align:left; padding:3.5mm 4mm; font-size:9.5pt; border-bottom:1px solid var(--line); vertical-align:top; }
  th{ font-size:7.5pt; letter-spacing:.18em; text-transform:uppercase; color:var(--terra); font-weight:700; }
  td.k{ font-weight:700; color:var(--teal); width:42mm; }
  td p{ color:var(--muted); }

  .tip{ background:var(--cream); border-left:3px solid var(--terra); border-radius:0 5px 5px 0; padding:4mm 5mm; margin-top:5mm; }
  .tip h4{ font-size:9.5pt; font-weight:700; margin-bottom:1.5mm; }
  .tip p{ font-size:9pt; color:var(--muted); }

  /* ---- footer ---- */
  .foot{ position:absolute; left:17mm; right:17mm; bottom:12mm; display:flex; align-items:center; justify-content:space-between; padding-top:5mm; border-top:1px solid var(--line); }
  .foot img{ height:9mm; }
  .foot .small{ font-size:8pt; }
  .pgnum{ position:absolute; bottom:12mm; right:17mm; font-size:8pt; color:var(--muted); }
</style>
</head>
<body>

<!-- ============ PAGE 1 ============ -->
<section class="page">
  <div class="band">
    <img class="logo" src="${CREAM}" alt="MIAA">
    <div style="text-align:right">
      <div class="kicker" style="margin-bottom:3mm">Prepared by</div>
      ${thinkStudio(true)}
    </div>
  </div>

  <div class="pad">
    <div class="eyebrow">Integration Guide &middot; Ticket Tailor &rarr; Brevo</div>
    <h1 class="serif">Your event registrations,<br><em>synced automatically.</em></h1>
    <p class="lead" style="margin-top:6mm">
      When someone buys a ticket or registers for one of your events on <b>Ticket Tailor</b>,
      their details now flow straight into the right <b>Brevo</b> email list &mdash; with no
      spreadsheets, exports, or copy&#8209;paste. This guide shows your team how to connect a new
      event in three short steps.
    </p>

    <div class="flow">
      <div class="node">
        <div class="ic">${iconTicket()}</div>
        <h4>Someone registers</h4>
        <p>A guest completes checkout for your event on Ticket Tailor.</p>
      </div>
      <div class="arrow">${chevron()}</div>
      <div class="node accent">
        <div class="ic">${iconSync()}</div>
        <h4>Synced instantly</h4>
        <p>Their name, email &amp; phone are sent securely to Brevo in real time.</p>
      </div>
      <div class="arrow">${chevron()}</div>
      <div class="node">
        <div class="ic">${iconList()}</div>
        <h4>Added to your list</h4>
        <p>The contact lands in the Brevo list you chose for that event.</p>
      </div>
    </div>
    <p class="small" style="text-align:center; margin-top:1mm">
      Cancelled or refunded orders are automatically removed from the list &mdash; the contact is kept.
    </p>

    <div class="cards">
      <div class="card">
        <div class="num">01</div>
        <h4>No manual work</h4>
        <p>No exporting CSVs or importing contacts. It happens the moment someone registers.</p>
      </div>
      <div class="card">
        <div class="num">02</div>
        <h4>Always current</h4>
        <p>Your lists stay in step with real registrations &mdash; including cancellations.</p>
      </div>
      <div class="card">
        <div class="num">03</div>
        <h4>You stay in control</h4>
        <p>Decide which Brevo list each event feeds, all from your admin dashboard.</p>
      </div>
    </div>
  </div>

  <div class="pgnum">Museum of Islamic Art Australia &nbsp;&middot;&nbsp; 1 / 3</div>
</section>

<!-- ============ PAGE 2 ============ -->
<section class="page">
  <div class="pad">
    <div class="eyebrow">How it works</div>
    <h2 class="serif">Adding an event in three steps</h2>
    <p class="lead">Do this once per event. It takes about a minute.</p>

    <div style="margin-top:6mm">
      <div class="step">
        <div class="badge">1</div>
        <div class="body">
          <h3>Copy the Ticket Tailor event ID</h3>
          <p>In your Ticket Tailor dashboard, open the event. The ID looks like
          <code>ev_8542618</code> and appears in the event&rsquo;s web address (URL). Copy it.</p>
        </div>
      </div>
      <div class="step">
        <div class="badge">2</div>
        <div class="body">
          <h3>Find the Brevo list ID</h3>
          <p>In Brevo, go to <b>Contacts &rarr; Lists</b> and open (or create) the list this event
          should feed. The <b>list ID</b> is the number shown in that list&rsquo;s URL &mdash; for
          example <code>19</code>. Copy that number.</p>
        </div>
      </div>
      <div class="step">
        <div class="badge">3</div>
        <div class="body">
          <h3>Add the mapping in your dashboard</h3>
          <p>Open your admin dashboard &rarr; <b>Event Lists</b>. Enter a name, paste the Ticket
          Tailor event ID and the Brevo list ID, then click <b>Add mapping</b>. That&rsquo;s it &mdash;
          the event is now live and syncing.</p>

          <div class="mock">
            <div class="topbar">Admin &middot; Ticket Tailor &rarr; Brevo<b>Event Lists</b></div>
            <div class="formrow">
              <div class="field">
                <label>Event name</label>
                <div class="inp filled">Writers&rsquo; Festival 2026</div>
              </div>
              <div class="field">
                <label>Ticket Tailor event ID</label>
                <div class="inp filled">ev_8542618</div>
              </div>
              <div class="field">
                <label>Brevo list ID</label>
                <div class="inp filled">19</div>
              </div>
            </div>
            <div class="formfoot">
              <span class="chk"><span class="box"></span> Use as the default (catch-all) list</span>
              <span class="btn">${iconPlus()} Add mapping</span>
            </div>
          </div>
          <p class="small" style="margin-top:2.5mm">The dashboard form, exactly as you&rsquo;ll see it.</p>
        </div>
      </div>
    </div>

    <div class="tip">
      <h4>Good to know &middot; Only mapped events route to a list</h4>
      <p>You only need a mapping for events whose registrations should land in a specific Brevo list.
      If an event isn&rsquo;t mapped, its registrants are still saved to Brevo &mdash; they&rsquo;re just
      not added to any list. Add a mapping any time to start routing that event.</p>
    </div>
  </div>
  <div class="pgnum">Museum of Islamic Art Australia &nbsp;&middot;&nbsp; 2 / 3</div>
</section>

<!-- ============ PAGE 3 ============ -->
<section class="page">
  <div class="pad">
    <div class="eyebrow">What to expect</div>
    <h2 class="serif">After an event is connected</h2>
    <p class="lead">Once a mapping is saved, everything below runs on its own.</p>

    <table>
      <tr><th>When this happens</th><th>What the sync does</th></tr>
      <tr>
        <td class="k">New registration</td>
        <td><p>The guest is added (or updated) in Brevo and placed in the event&rsquo;s list, tagged with the event name and order status.</p></td>
      </tr>
      <tr>
        <td class="k">Cancellation / refund</td>
        <td><p>The contact is removed from the event&rsquo;s list automatically. Their contact record is kept in Brevo for your records.</p></td>
      </tr>
      <tr>
        <td class="k">Event with no mapping</td>
        <td><p>The contact is still <b>saved in Brevo</b>, just <b>not added to any list</b>. Only events
        you&rsquo;ve explicitly mapped route into a list &mdash; map the event whenever you want its
        registrations to flow into one.</p></td>
      </tr>
      <tr>
        <td class="k">Editing a mapping</td>
        <td><p>Change the list, rename, disable, or delete a mapping at any time from the Event Lists page &mdash; changes take effect immediately.</p></td>
      </tr>
    </table>

    <div class="cards" style="margin-top:8mm">
      <div class="card">
        <div class="num">&#10003;</div>
        <h4>Secure by design</h4>
        <p>Every message from Ticket Tailor is signature&#8209;verified before it&rsquo;s accepted &mdash; only genuine registrations sync.</p>
      </div>
      <div class="card">
        <div class="num">&#9201;</div>
        <h4>Real time</h4>
        <p>Contacts usually appear in Brevo within a second of someone completing checkout.</p>
      </div>
      <div class="card">
        <div class="num">&#9881;</div>
        <h4>Low maintenance</h4>
        <p>Set an event up once. The only ongoing task is mapping each new event you create.</p>
      </div>
    </div>

    <div class="tip">
      <h4>Good to know</h4>
      <p>Phone numbers are added when they&rsquo;re in valid international format; an unusual number
      simply syncs the contact without the phone, so a registration is never lost. Marketing consent
      handling can be switched on whenever your Ticket Tailor checkout includes an opt&#8209;in question.</p>
    </div>
  </div>

  <div class="foot">
    <img src="${DARK}" alt="MIAA">
    <div style="text-align:right">
      <div class="small" style="margin-bottom:2mm">Prepared for Museum of Islamic Art Australia</div>
      ${thinkStudio(false)}
    </div>
  </div>
  <div class="pgnum" style="bottom:7mm">3 / 3</div>
</section>

</body>
</html>`

function chevron(){ return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 6 15 12 9 18"/></svg>' }
function iconTicket(){ return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#214952" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4z"/><path d="M13 6v12"/></svg>' }
function iconSync(){ return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F3EFEB" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="21 4 21 10 15 10"/><path d="M21 13a9 9 0 1 1-3-7l3 3"/></svg>' }
function iconList(){ return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#214952" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6h13M8 12h13M8 18h13"/><circle cx="3.5" cy="6" r="1.2"/><circle cx="3.5" cy="12" r="1.2"/><circle cx="3.5" cy="18" r="1.2"/></svg>' }
function iconPlus(){ return '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>' }

// chevron()/icon*() are referenced above before declaration — fine because they are
// function declarations (hoisted). Rebuild html now that all are defined:
fs.writeFileSync(path.join(__dirname, "guide.html"), html)
console.log("wrote guide.html")
