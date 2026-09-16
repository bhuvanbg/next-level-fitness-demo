/* ===================== helpers ===================== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const ph = (label, cls = "p43") => `<div class="ph ${cls}"><span class="ph-tag">${esc(label)}</span></div>`;
const money = n => "₹" + Number(n).toLocaleString("en-IN");
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* logos */
["navlogo", "mnlogo", "herologo", "flogo", "modallogo"].forEach(id => { const el = document.getElementById(id); if (el) el.src = NLF.brand.logo; });
$("#yr").textContent = new Date().getFullYear();
$("#heroTagline").textContent = NLF.brand.tagline;

/* ===================== nav ===================== */
const nav = $("#nav");
const onScroll = () => {
  nav.classList.toggle("scrolled", window.scrollY > 40);
  $("#floatcta").classList.toggle("show", window.scrollY > 620);
};
addEventListener("scroll", onScroll, { passive: true }); onScroll();

const mn = $("#mobilenav"), burger = $("#burger");
const setMenu = o => { mn.classList.toggle("open", o); mn.setAttribute("aria-hidden", !o); burger.setAttribute("aria-expanded", o); document.body.style.overflow = o ? "hidden" : ""; };
burger.onclick = () => setMenu(true);
$("#mnclose").onclick = () => setMenu(false);
$$("#mobilenav a.mn-link").forEach(a => a.onclick = () => setMenu(false));

/* ===================== reveal ===================== */
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px", threshold: .08 });
const observeAll = () => $$(".rv:not(.in)").forEach(el => io.observe(el));

/* ===================== hero meta + strip ===================== */
$("#heroMeta").innerHTML = [
  `<span><b>${NLF.branches.filter(b => b.status === "open").length}</b> gyms open in Bengaluru</span>`,
  `<span><b>1</b> new location opening</span>`,
  NLF.contact.phone ? `<span>Call <b>${esc(NLF.contact.phone)}</b></span>` : `<span class="needs">Phone number pending</span>`
].join("");

const stripWords = ["Strength", "Conditioning", "Coached training", "Free weights", "Bengaluru", "Next level"];
$("#strip").innerHTML = [...stripWords, ...stripWords].map(w => `<span>${w}</span>`).join("");

/* ===================== pillars ===================== */
const PILLARS = [
  ["Coached, not supervised", "Form correction and programming from someone who trains alongside you."],
  ["Equipment that gets used", "Racks, bars and plates maintained for heavy work — not a photo set."],
  ["Local and reachable", "Branches placed so you can get there after work without a commute."],
  ["One standard everywhere", "Same coaching approach and floor discipline at every Next Level gym."]
];
$("#pillars").innerHTML = PILLARS.map(([h, p], i) => `<div class="pillar"><span class="dot">${i + 1}</span><div><h4>${h}</h4><p>${p}</p></div></div>`).join("");

/* ===================== stats ===================== */
$("#stats").innerHTML = NLF.stats.map(s => s.value == null
  ? `<div class="stat"><div class="v pending">Awaiting data</div><div class="l">${esc(s.label)}</div></div>`
  : `<div class="stat"><div class="v" data-count="${s.value}">0${esc(s.suffix || "")}</div><div class="l">${esc(s.label)}</div></div>`).join("");

const countIO = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return; countIO.unobserve(e.target);
  const el = e.target, target = +el.dataset.count, dur = reduced ? 0 : 1100, t0 = performance.now();
  const tick = t => { const p = Math.min(1, (t - t0) / (dur || 1)); el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
}), { threshold: .5 });
$$("[data-count]").forEach(el => countIO.observe(el));

/* ===================== branches ===================== */
function branchCard(b) {
  const soon = b.status === "coming-soon";
  const dirUrl = b.mapsUrl || null;
  return `<article class="branch rv">
    <div class="bmedia">${b.image ? `<img src="${esc(b.image)}" alt="${esc(b.name)}" loading="lazy" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover">` : `<div class="ph"><span class="ph-tag">${soon ? "New branch — photo later" : "[GYM IMAGE] " + esc(b.name)}</span></div>`}</div>
    <div class="bbody">
      <div class="btop">
        <h3 class="h-display">${esc(soon ? "Next Level Fitness — New location" : b.name)}</h3>
        <span class="badge ${soon ? "soon" : "open"}">${soon ? "Coming soon" : "Open"}</span>
      </div>
      ${soon ? `<p class="muted" style="margin-top:12px">Location details coming soon. The gym will announce the address and timings here.</p>` : ""}
      ${soon ? "" : `<dl>
        <dt>Address</dt><dd>${esc(b.address)} ${b.addressVerified ? "" : `<span class="badge verify">Verify</span>`}</dd>
        <dt>Hours</dt><dd>${esc(b.hours)} ${b.hoursVerified ? "" : `<span class="badge verify">Verify</span>`}</dd>
        <dt>Phone</dt><dd>${b.phone ? `<a href="tel:${esc(b.phone)}">${esc(b.phone)}</a>` : `<span class="needs">Number pending</span>`}</dd>
      </dl>`}
      <div class="chips">
        ${b.facilities.length ? b.facilities.map(f => `<span class="chip">${esc(f)}</span>`).join("") : (soon ? "" : `<span class="chip dashed">Facilities list pending</span>`)}
        ${b.services.map(s => `<span class="chip">${esc(s)}</span>`).join("")}
      </div>
      ${soon ? "" : `<div class="mapbox">${b.embedQuery
        ? `<iframe loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Map of ${esc(b.name)}" src="https://www.google.com/maps/embed/v1/place?key=YOUR_KEY&q=${encodeURIComponent(b.embedQuery)}"></iframe>`
        : `<div><div class="pin"></div><p>Map loads once the branch location is confirmed and the Maps key is set.</p></div>`}</div>`}
      <div class="bact">
        ${soon ? `<button class="btn btn-ghost btn-sm" data-enquire>Notify me</button>`
      : `${dirUrl ? `<a class="btn btn-lime btn-sm" href="${esc(dirUrl)}" target="_blank" rel="noopener">Get directions</a>` : `<span class="btn btn-ghost btn-sm is-pending">Directions pending</span>`}
           <button class="btn btn-ghost btn-sm" data-join data-branch="${esc(b.id)}">Join this gym</button>
           <button class="btn btn-ghost btn-sm" data-enquire data-branch="${esc(b.id)}">Enquire</button>`}
      </div>
    </div>
  </article>`;
}
$("#branches").innerHTML = NLF.branches.map(branchCard).join("");
$("#fbranches").innerHTML = NLF.branches.map(b => `<li>${esc(b.status === "coming-soon" ? "New location — soon" : b.name)}</li>`).join("");

/* ===================== plans ===================== */
function planCard(p) {
  return `<div class="plan ${p.featured ? "featured" : ""}">
    <div class="pname">${esc(p.name)}</div>
    <div class="pprice">${p.price != null ? money(p.price) : "[PRICE]"}</div>
    <div class="muted small">${esc(p.duration || "")}${p.offer ? ` · <span style="color:var(--lime)">${esc(p.offer)}</span>` : ""}</div>
    <ul>${(p.features || []).map(f => `<li>${esc(f)}</li>`).join("")}</ul>
    <div class="pfoot">
      ${p.validity ? `<div class="small muted">Valid ${esc(p.validity)}</div>` : ""}
      <button class="btn btn-lime" data-join data-plan="${esc(p.id)}">Subscribe</button>
    </div>
  </div>`;
}
$("#plans").innerHTML = NLF.plans.length
  ? `<div class="plans rv">${NLF.plans.map(planCard).join("")}</div>`
  : `<div class="empty rv">
       <span class="needs">Waiting on the owner</span>
       <h3 class="h-display" style="margin-top:14px">Plans and prices go here</h3>
       <p>No membership prices have been published yet. Nothing is shown until the gym confirms plan names, durations and amounts — this site will not display an invented price.</p>
       <div class="eacts"><button class="btn btn-lime" data-enquire>Ask about pricing</button><a class="btn btn-ghost" href="#gyms">See the gyms</a></div>
       <button id="previewPlans" class="small" style="margin-top:22px;color:var(--mute-2);text-decoration:underline">Preview the plan layout with sample numbers</button>
     </div>`;

const pv = $("#previewPlans");
if (pv) pv.onclick = () => {
  NLF.plans = [
    { id: "s1", name: "Monthly", price: 0, duration: "1 month", branches: "all", features: ["Sample feature line", "Sample feature line", "Sample feature line"], validity: "1 month from joining" },
    { id: "s2", name: "Quarterly", price: 0, duration: "3 months", branches: "all", featured: true, offer: "Sample offer", features: ["Sample feature line", "Sample feature line", "Sample feature line", "Sample feature line"], validity: "3 months from joining" },
    { id: "s3", name: "Annual", price: 0, duration: "12 months", branches: "all", features: ["Sample feature line", "Sample feature line", "Sample feature line"], validity: "12 months from joining" }
  ];
  $("#plans").innerHTML = `<div class="notice"><b>Layout preview only.</b> These are placeholder plans with ₹0 so you can approve the design. Real names, prices and features go in the site data — nothing here is a quoted price.</div><div class="plans">${NLF.plans.map(planCard).join("")}</div>`;
};

/* ===================== owner ===================== */
const o = NLF.owner;
$("#owner-card").innerHTML = `
  <div class="oimg">${o.photo ? `<img src="${esc(o.photo)}" alt="${esc(o.name)}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover">` : `<div class="ph"><span class="ph-tag">[OWNER PHOTOGRAPH]</span></div>`}</div>
  <div class="obody">
    <div class="orole">${esc(o.role)}</div>
    <div class="oname">${esc(o.name)}</div>
    <p class="lede">${esc(o.bio)}</p>
    <dl class="branch" style="border:0;background:none;display:block;padding:0;margin:0">
      <div class="crow"><dt>Experience</dt><dd>${o.experience ? esc(o.experience) : `<span class="needs">Pending</span>`}</dd></div>
      <div class="crow"><dt>Specialises in</dt><dd>${o.specializations.length ? o.specializations.map(esc).join(" · ") : `<span class="needs">Pending</span>`}</dd></div>
      <div class="crow"><dt>Certifications</dt><dd>${o.certifications.length ? o.certifications.map(esc).join(" · ") : `<span class="needs">Only listed once documents are shared</span>`}</dd></div>
    </dl>
    ${o.timeline.length ? `<div class="timeline">${o.timeline.map(t => `<div class="tl"><div class="ty">${esc(t.year)}</div><h4>${esc(t.title)}</h4><p>${esc(t.detail)}</p></div>`).join("")}</div>` : `<p class="small muted" style="margin-top:22px">His training journey and milestones will appear here as a timeline once he shares them.</p>`}
    <div class="hero-actions" style="margin-top:26px"><button class="btn btn-lime" data-join>Train with him</button></div>
  </div>`;

/* ===================== achievements / transformations / testimonials ===================== */
$("#achievements-body").innerHTML = NLF.achievements.length
  ? `<div class="plans rv">${NLF.achievements.map(a => `<div class="plan"><div class="orole">${esc(a.category)}</div><div class="pname" style="margin-top:8px">${esc(a.title)}</div><div class="muted small" style="margin-top:6px">${esc(a.year)}</div><p class="small muted" style="margin-top:12px">${esc(a.detail)}</p></div>`).join("")}</div>`
  : `<div class="empty rv"><span class="needs">Nothing published yet</span><h3 class="h-display" style="margin-top:14px">Competitions, awards and milestones</h3><p>Certificates, competition placings and gym milestones will be listed here — each one verified against a document or photograph first. No placeholder trophies.</p><div class="eacts"><button class="btn btn-ghost" data-enquire>Ask the gym</button></div></div>`;

$("#transformations-body").innerHTML = NLF.transformations.length
  ? `<div class="rail rv">${NLF.transformations.map(t => `<div class="quote"><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">${ph("Before", "tall")}${ph("After", "tall")}</div><div><strong>${esc(t.name)}</strong><div class="small muted">${esc(t.goal)} · ${esc(t.duration)}</div></div><p class="small muted" style="margin:0">${esc(t.story)}</p></div>`).join("")}</div>`
  : `<div class="empty rv"><span class="needs">Awaiting photos and consent</span><h3 class="h-display" style="margin-top:14px">Before and after, with permission</h3><p>Member transformations are only published with written consent from the member. Send the photos and signed permission and they will appear here as before/after cards.</p></div>`;

$("#testi-body").innerHTML = NLF.testimonials.length
  ? `<div class="rail rv">${NLF.testimonials.map(t => `<blockquote class="quote"><div class="mark">&ldquo;</div><p style="margin:0">${esc(t.text)}</p><div style="margin-top:auto"><strong>${esc(t.name)}</strong><div class="small muted">${esc(t.branch)}</div></div></blockquote>`).join("")}</div>`
  : `<div class="empty rv"><span class="needs">No reviews added</span><h3 class="h-display" style="margin-top:14px">Real reviews only</h3><p>Member reviews will be added from the gym's own collected feedback or from public listings where reuse is permitted. None have been written for this site.</p></div>`;

/* ===================== gallery ===================== */
let gCat = "All";
function renderGal() {
  const cats = ["All", ...NLF.gallery.categories];
  $("#gfilter").innerHTML = cats.map(c => `<button aria-pressed="${c === gCat}" data-cat="${esc(c)}">${esc(c)}</button>`).join("");
  const items = NLF.gallery.items.filter(i => gCat === "All" || i.category === gCat);
  $("#gal").innerHTML = items.length
    ? items.map(i => `<img class="ph" src="${esc(i.src)}" alt="${esc(i.alt || "")}" loading="lazy" style="margin-bottom:14px">`).join("")
    : (gCat === "All" ? NLF.gallery.categories : [gCat]).map((c, i) => ph(`[${c.toUpperCase()} PHOTO]`, i % 3 === 0 ? "tall" : i % 3 === 1 ? "p43" : "sq")).join("");
  $$("#gfilter button").forEach(b => b.onclick = () => { gCat = b.dataset.cat; renderGal(); /* ===================== real photos, when supplied ===================== */
function paint(el, src) {
  if (!el || !src) return;
  el.style.backgroundImage = `linear-gradient(180deg,rgba(7,7,7,.35),rgba(7,7,7,.55)), url("${src}")`;
  el.style.backgroundSize = "cover";
  el.style.backgroundPosition = "center";
  const t = el.querySelector(".ph-tag"); if (t) t.remove();
}
const IMG = NLF.images || {};
paint($("#heroMedia"), IMG.hero);
const aboutPhs = $$("#about .stack-media .ph");
paint(aboutPhs[0], IMG.aboutWide); paint(aboutPhs[1], IMG.aboutA); paint(aboutPhs[2], IMG.aboutB);
paint($("#owner-card .oimg .ph"), IMG.ownerPortrait);

observeAll(); });
}
renderGal();

/* ===================== contact ===================== */
const C = NLF.contact;
const cRow = (k, v, href) => `<div class="crow"><dt>${k}</dt><dd>${v ? (href ? `<a href="${href}" style="color:var(--lime)">${esc(v)}</a>` : esc(v)) : `<span class="needs">Pending</span>`}</dd></div>`;
$("#contactList").innerHTML =
  cRow("Phone", C.phone, C.phone ? "tel:" + C.phone : null) +
  cRow("WhatsApp", C.whatsapp, C.whatsapp ? "https://wa.me/" + C.whatsapp : null) +
  cRow("Email", C.email, C.email ? "mailto:" + C.email : null) +
  cRow("Instagram", C.instagram, C.instagram) +
  `<div class="crow"><dt>Main gym</dt><dd>${esc(NLF.branches[0].address)}</dd></div>` +
  `<div class="crow"><dt>Hours</dt><dd>${esc(NLF.branches[0].hours)}</dd></div>`;
$("#contactActions").innerHTML = [
  C.phone ? `<a class="btn btn-lime" href="tel:${esc(C.phone)}">Call now</a>` : `<span class="btn btn-lime is-pending">Call now</span>`,
  C.whatsapp ? `<a class="btn btn-ghost" href="https://wa.me/${esc(C.whatsapp)}" target="_blank" rel="noopener">WhatsApp</a>` : `<span class="btn btn-ghost is-pending">WhatsApp</span>`,
  NLF.branches[0].mapsUrl ? `<a class="btn btn-ghost" href="${esc(NLF.branches[0].mapsUrl)}" target="_blank" rel="noopener">Get directions</a>` : ""
].join("");
if (C.whatsapp) { $("#waFab").href = "https://wa.me/" + C.whatsapp; $("#waBar").href = "https://wa.me/" + C.whatsapp; }
$("#social").innerHTML = Object.entries({ Instagram: C.instagram, YouTube: C.youtube, Facebook: C.facebook })
  .map(([k, v]) => v ? `<a class="chip" href="${esc(v)}" target="_blank" rel="noopener">${k}</a>` : `<span class="chip dashed">${k} link pending</span>`).join("");

/* ===================== enquiry form (inline) ===================== */
const branchOptions = NLF.branches.filter(b => b.status === "open").map(b => `<option value="${esc(b.id)}">${esc(b.name)}</option>`).join("");
$("#enqForm").innerHTML = `
  <div class="field"><label for="e_name">Full name <span class="req">*</span></label><input id="e_name" name="name" autocomplete="name" required><span class="err">Enter your name.</span></div>
  <div class="two">
    <div class="field"><label for="e_phone">Mobile number <span class="req">*</span></label><input id="e_phone" name="phone" inputmode="tel" autocomplete="tel" placeholder="10-digit number" required><span class="err">Enter a valid 10-digit mobile number.</span></div>
    <div class="field"><label for="e_email">Email</label><input id="e_email" name="email" type="email" autocomplete="email"><span class="err">Check the email address.</span></div>
  </div>
  <div class="two">
    <div class="field"><label for="e_branch">Preferred gym <span class="req">*</span></label><select id="e_branch" name="branch" required><option value="">Choose a gym</option>${branchOptions}</select><span class="err">Pick a gym.</span></div>
    <div class="field"><label for="e_goal">I'm interested in</label><select id="e_goal" name="interest"><option>General membership</option><option>Personal training</option><option>Group classes</option><option>Trial session</option></select></div>
  </div>
  <div class="field"><label for="e_msg">Message</label><textarea id="e_msg" name="message" placeholder="Your goal, preferred timings, anything else."></textarea></div>
  <label class="consent"><input type="checkbox" id="e_consent" required><span>I agree that Next Level Fitness may contact me about this enquiry, and I have read the <a href="#" data-legal="privacy">privacy policy</a>.</span></label>
  <button class="btn btn-lime" type="submit" style="width:100%">Send enquiry</button>
  <div id="enqResult" style="margin-top:14px"></div>`;

function validate(form, rules) {
  let ok = true;
  rules.forEach(([id, test, always]) => {
    const el = $("#" + id); if (!el) return;
    const f = el.closest(".field") || el.closest(".consent");
    const val = el.type === "checkbox" ? el.checked : el.value.trim();
    const good = (!always && val === "") ? true : test(val);
    const bad = el.required ? (val === "" || !good) : !good;
    if (f && f.classList) f.classList.toggle("invalid", bad);
    if (bad) ok = false;
  });
  return ok;
}
const isPhone = v => /^[6-9]\d{9}$/.test(v.replace(/\D/g, "").slice(-10)) && v.replace(/\D/g, "").length >= 10;
const isEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

$("#enqForm").addEventListener("submit", async e => {
  e.preventDefault();
  const ok = validate($("#enqForm"), [
    ["e_name", v => v.length > 1], ["e_phone", isPhone], ["e_email", isEmail],
    ["e_branch", v => !!v], ["e_consent", v => v === true, true]
  ]);
  const out = $("#enqResult");
  if (!ok) { out.innerHTML = `<p class="small" style="color:#ff7a6b;margin:0">Fix the highlighted fields and send again.</p>`; return; }
  const payload = {
    name: $("#e_name").value.trim(), phone: $("#e_phone").value.trim(), email: $("#e_email").value.trim(),
    branchId: $("#e_branch").value, interest: $("#e_goal").value, message: $("#e_msg").value.trim(),
    source: "website-contact", status: "new", createdAt: new Date().toISOString()
  };
  if (NLF.api.live) {
    try {
      const r = await fetch(NLF.api.enquiry, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!r.ok) throw new Error();
      out.innerHTML = `<p class="small" style="color:var(--lime);margin:0">Enquiry sent. The gym will call you back.</p>`;
      $("#enqForm").reset();
    } catch { out.innerHTML = `<p class="small" style="color:#ff7a6b;margin:0">That didn't send. Call the gym instead, or try again in a moment.</p>`; }
  } else {
    out.innerHTML = `<div class="notice" style="margin:0"><b>Preview mode.</b> The form validated correctly. Once the backend is deployed, this posts to <code>${esc(NLF.api.enquiry)}</code> and the enquiry lands in the owner's dashboard.</div>`;
    console.log("Enquiry payload →", payload);
  }
});

/* ===================== join flow ===================== */
const modal = $("#modal"), mBody = $("#modalBody"), mFoot = $("#modalFoot"), mSteps = $("#steps"), mLabel = $("#steplabel");
const STEP_NAMES = ["Choose your gym", "Choose a membership", "Your details", "Review", "Payment"];
let S = { mode: "join", step: 1, branchId: null, planId: null, details: {}, lastFocus: null };

function openModal(mode, opts = {}) {
  S = { mode, step: 1, branchId: opts.branchId || null, planId: opts.planId || null, details: S.details || {}, lastFocus: document.activeElement };
  if (mode === "enquire") S.step = 3;
  modal.classList.add("open"); document.body.style.overflow = "hidden";
  render();
  setTimeout(() => (mBody.querySelector("button,input,select") || $(".closex", modal)).focus(), 60);
}
function closeModal() { modal.classList.remove("open"); document.body.style.overflow = ""; S.lastFocus && S.lastFocus.focus(); }
$$("[data-close]").forEach(el => el.onclick = closeModal);
addEventListener("keydown", e => { if (e.key === "Escape" && modal.classList.contains("open")) closeModal(); });
document.addEventListener("click", e => {
  if (e.target.closest("[data-close]")) return closeModal();
  const j = e.target.closest("[data-join]"), q = e.target.closest("[data-enquire]"), l = e.target.closest("[data-legal]");
  if (j) { setMenu(false); openModal("join", { branchId: j.dataset.branch, planId: j.dataset.plan }); }
  if (q) { e.preventDefault(); setMenu(false); openModal("enquire", { branchId: q.dataset.branch }); }
  if (l) { e.preventDefault(); openLegal(l.dataset.legal); }
});

function plansFor(branchId) {
  return NLF.plans.filter(p => p.branches === "all" || !p.branches || (Array.isArray(p.branches) && p.branches.includes(branchId)));
}
function currentPlan() { return NLF.plans.find(p => p.id === S.planId) || null; }
function currentBranch() { return NLF.branches.find(b => b.id === S.branchId) || null; }

function render() {
  const joining = S.mode === "join";
  mSteps.hidden = !joining; mLabel.hidden = !joining;
  if (joining) {
    $$("#steps i").forEach((i, n) => i.classList.toggle("on", n < S.step));
    mLabel.textContent = `Step ${S.step} of 5 — ${STEP_NAMES[S.step - 1]}`;
  }
  mBody.innerHTML = view(); mFoot.innerHTML = foot();
  wire();
}

function view() {
  if (S.mode === "enquire") return enquireView();
  if (S.step === 1) return `
    <h3 class="h-display" style="margin-bottom:8px">Which gym?</h3>
    <p class="muted small" style="margin-bottom:22px">Pick the branch you'll train at most. You can change it later with the gym.</p>
    ${NLF.branches.map(b => {
      const soon = b.status === "coming-soon";
      return `<button class="pick" data-pickbranch="${esc(b.id)}" aria-pressed="${S.branchId === b.id}" ${soon ? "disabled" : ""}>
        <div><div class="pk-t">${esc(soon ? "New location" : b.name)}</div><div class="pk-s">${esc(soon ? "Opening soon — not accepting sign-ups yet" : (b.address || "").slice(0, 70) + "…")}</div></div>
        <div class="pk-p" style="font-size:.8rem;color:var(--mute)">${soon ? "Soon" : "Select"}</div>
      </button>`;
    }).join("")}`;

  if (S.step === 2) {
    const list = plansFor(S.branchId);
    if (!list.length) return `
      <div class="notice"><b>No plans published yet.</b> Next Level Fitness hasn't shared membership names and prices for this site, so nothing is listed here. Send your details instead and the gym will quote you directly.</div>
      <h3 class="h-display" style="margin-bottom:8px">Continue as an enquiry</h3>
      <p class="muted small">You'll get a call back with the current plans for ${esc((currentBranch() || {}).name || "this gym")}.</p>
      <button class="btn btn-lime" id="toEnquiry" style="margin-top:18px;width:100%">Continue without a plan</button>`;
    return `<h3 class="h-display" style="margin-bottom:22px">Choose a membership</h3>` + list.map(p => `
      <button class="pick" data-pickplan="${esc(p.id)}" aria-pressed="${S.planId === p.id}">
        <div><div class="pk-t">${esc(p.name)}</div><div class="pk-s">${esc(p.duration)}${p.offer ? " · " + esc(p.offer) : ""}</div></div>
        <div class="pk-p">${p.price != null ? money(p.price) : "[PRICE]"}</div>
      </button>`).join("");
  }

  if (S.step === 3) return detailsView();

  if (S.step === 4) {
    const p = currentPlan(), b = currentBranch(), d = S.details;
    return `<h3 class="h-display" style="margin-bottom:22px">Review</h3>
      <div class="review">
        <div class="rrow"><span>Name</span><span>${esc(d.fullName)}</span></div>
        <div class="rrow"><span>Mobile</span><span>${esc(d.phone)}</span></div>
        ${d.email ? `<div class="rrow"><span>Email</span><span>${esc(d.email)}</span></div>` : ""}
        <div class="rrow"><span>Gym</span><span>${esc(b ? b.name : "—")}</span></div>
        <div class="rrow"><span>Membership</span><span>${esc(p ? p.name : "To be quoted")}</span></div>
        <div class="rrow"><span>Duration</span><span>${esc(p ? p.duration : "—")}</span></div>
        <div class="rrow total"><span>Amount</span><span>${p && p.price != null ? money(p.price) : "Pending"}</span></div>
      </div>
      <p class="small muted" style="margin-top:16px">Taxes and any joining fee are applied by the gym. You'll see the final amount on the Razorpay screen before paying.</p>`;
  }

  if (S.step === 5) {
    const p = currentPlan();
    if (!NLF.api.live) return `
      <div class="notice"><b>Razorpay isn't connected yet.</b> Keys and the order API go live when the backend is deployed. Nothing is charged in preview.</div>
      <h3 class="h-display" style="margin-bottom:14px">What happens when it's live</h3>
      <ol class="small muted" style="padding-left:18px;display:grid;gap:8px">
        <li>Your details are saved as a pending registration in MongoDB.</li>
        <li>The server calls Razorpay and creates an order — the secret key never reaches your browser.</li>
        <li>Razorpay Checkout opens for UPI, card or netbanking.</li>
        <li>Razorpay's signature is verified on the server before anything is marked paid.</li>
        <li>You get a registration ID and the gym sees you in their dashboard.</li>
      </ol>
      <button class="btn btn-ghost" id="toEnquiry" style="margin-top:22px;width:100%">Send my details to the gym instead</button>`;
    return `<h3 class="h-display" style="margin-bottom:14px">Paying ${p && p.price != null ? money(p.price) : ""}</h3>
      <p class="muted small">Opening Razorpay Checkout…</p>`;
  }

  if (S.step === 6) {
    const p = currentPlan(), b = currentBranch();
    return `<div class="okmark">&#10003;</div>
      <h3 class="h-display" style="margin-bottom:10px">Welcome to Next Level Fitness</h3>
      <p class="muted">${S.mode === "enquire" ? "Your enquiry is in. The gym will call you back." : "Your registration is saved."}</p>
      <div class="review" style="margin-top:22px">
        <div class="rrow"><span>Reference</span><span>${esc(S.refId)}</span></div>
        <div class="rrow"><span>Gym</span><span>${esc(b ? b.name : "To be confirmed")}</span></div>
        <div class="rrow"><span>Membership</span><span>${esc(p ? p.name : "To be quoted")}</span></div>
        <div class="rrow"><span>Status</span><span style="color:var(--warn)">${S.mode === "enquire" ? "Enquiry received" : "Awaiting payment"}</span></div>
      </div>
      <h4 style="margin:26px 0 10px">Next steps</h4>
      <ol class="small muted" style="padding-left:18px;display:grid;gap:8px">
        <li>The gym confirms your plan and timings.</li>
        <li>Bring a photo ID on your first visit.</li>
        <li>Come 10 minutes early for a floor induction.</li>
      </ol>`;
  }
  return "";
}

function detailsView() {
  const d = S.details;
  const v = k => esc(d[k] || "");
  return `<h3 class="h-display" style="margin-bottom:8px">${S.mode === "enquire" ? "Your details" : "Your details"}</h3>
    <p class="muted small" style="margin-bottom:22px">Only what the gym needs to register you and reach you.</p>
    <div class="field"><label for="f_name">Full name <span class="req">*</span></label><input id="f_name" value="${v("fullName")}" autocomplete="name" required><span class="err">Enter your full name.</span></div>
    <div class="two">
      <div class="field"><label for="f_phone">Mobile number <span class="req">*</span></label><input id="f_phone" value="${v("phone")}" inputmode="tel" autocomplete="tel" required><span class="err">Enter a valid 10-digit mobile number.</span></div>
      <div class="field"><label for="f_email">Email</label><input id="f_email" type="email" value="${v("email")}" autocomplete="email"><span class="err">Check the email address.</span></div>
    </div>
    <div class="two">
      <div class="field"><label for="f_dob">Date of birth</label><input id="f_dob" type="date" value="${v("dob")}"></div>
      <div class="field"><label for="f_gender">Gender</label><select id="f_gender"><option value="">Prefer not to say</option>${["Male", "Female", "Other"].map(g => `<option ${d.gender === g ? "selected" : ""}>${g}</option>`).join("")}</select></div>
    </div>
    <div class="two">
      <div class="field"><label for="f_ec">Emergency contact</label><input id="f_ec" value="${v("emergency")}" inputmode="tel" placeholder="Number to call if needed"></div>
      <div class="field"><label for="f_branch">Gym</label><select id="f_branch">${NLF.branches.filter(b => b.status === "open").map(b => `<option value="${esc(b.id)}" ${S.branchId === b.id ? "selected" : ""}>${esc(b.name)}</option>`).join("")}</select></div>
    </div>
    <div class="field"><label for="f_msg">Anything we should know</label><textarea id="f_msg" placeholder="Injuries, goals, preferred training time.">${v("message")}</textarea></div>
    <label class="consent"><input type="checkbox" id="f_consent" ${d.consent ? "checked" : ""}><span>I agree to the <a href="#" data-legal="membership">membership terms</a> and the <a href="#" data-legal="privacy">privacy policy</a>, and to being contacted about my membership.</span></label>`;
}
function enquireView() { return `<div class="notice">Leave your details and the gym will call you with current plans and timings.</div>` + detailsView(); }

function foot() {
  if (S.step === 6) return `<span class="small muted">Reference ${esc(S.refId)}</span><button class="btn btn-lime btn-sm" data-close>Done</button>`;
  const back = S.step > 1 && S.mode === "join";
  const canNext = (S.step === 1 && S.branchId) || (S.step === 2 && (S.planId || !plansFor(S.branchId).length)) || S.step === 3 || S.step === 4;
  const nextLabel = S.mode === "enquire" ? "Send enquiry" : S.step === 4 ? "Proceed to payment" : "Continue";
  if (S.step === 5) return `<button class="btn btn-ghost btn-sm" id="back">Back</button><span class="small muted">Secure payment by Razorpay</span>`;
  return `${back ? `<button class="btn btn-ghost btn-sm" id="back">Back</button>` : `<span></span>`}
    <button class="btn btn-lime btn-sm ${canNext ? "" : "is-pending"}" id="next">${nextLabel}</button>`;
}

function saveDetails() {
  const g = id => { const el = $("#" + id); return el ? (el.type === "checkbox" ? el.checked : el.value.trim()) : S.details[id]; };
  S.details = {
    fullName: g("f_name"), phone: g("f_phone"), email: g("f_email"), dob: g("f_dob"),
    gender: g("f_gender"), emergency: g("f_ec"), message: g("f_msg"), consent: g("f_consent")
  };
  if ($("#f_branch")) S.branchId = $("#f_branch").value;
}

function wire() {
  $$("[data-pickbranch]", mBody).forEach(b => b.onclick = () => { S.branchId = b.dataset.pickbranch; S.planId = null; S.step = 2; render(); });
  $$("[data-pickplan]", mBody).forEach(b => b.onclick = () => { S.planId = b.dataset.pickplan; S.step = 3; render(); });
  const te = $("#toEnquiry", mBody); if (te) te.onclick = () => { S.mode = "enquire"; S.step = 3; render(); };
  const back = $("#back"); if (back) back.onclick = () => { if (S.step === 3) saveDetails(); S.step = Math.max(1, S.step - 1); render(); };
  const next = $("#next"); if (next) next.onclick = onNext;
  $$("input,select,textarea", mBody).forEach(el => el.addEventListener("input", () => { const f = el.closest(".field"); f && f.classList.remove("invalid"); }));
}

async function onNext() {
  if (S.step === 1) { if (!S.branchId) return; S.step = 2; return render(); }
  if (S.step === 2) { if (!S.planId && plansFor(S.branchId).length) return; S.step = 3; return render(); }
  if (S.step === 3) {
    const ok = validate(null, [
      ["f_name", v => v.length > 1], ["f_phone", isPhone], ["f_email", isEmail], ["f_consent", v => v === true, true]
    ]);
    saveDetails();
    if (!S.details.consent) { const c = $("#f_consent"); c.closest(".consent").style.color = "#ff7a6b"; }
    if (!ok || !S.details.consent) return;
    if (S.mode === "enquire") return submitEnquiry();
    S.step = 4; return render();
  }
  if (S.step === 4) { S.step = 5; render(); return startPayment(); }
}

function refId(prefix) { return prefix + "-" + Date.now().toString(36).toUpperCase().slice(-6) + Math.random().toString(36).slice(2, 5).toUpperCase(); }

async function submitEnquiry() {
  S.refId = refId("ENQ");
  const payload = { ...S.details, branchId: S.branchId, source: "join-flow", status: "new", createdAt: new Date().toISOString() };
  if (NLF.api.live) { try { await fetch(NLF.api.enquiry, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }); } catch (e) { } }
  else console.log("Enquiry payload →", payload);
  S.step = 6; render();
}

function loadRazorpay(){return new Promise((res,rej)=>{if(window.Razorpay)return res();const t=document.createElement("script");t.src="https://checkout.razorpay.com/v1/checkout.js";t.onload=res;t.onerror=rej;document.head.appendChild(t);});}

async function startPayment() {
  const p = currentPlan();
  if (!NLF.api.live) return;                     // preview: step 5 explains the flow
  try {
    await loadRazorpay();
    const r = await fetch(NLF.api.createOrder, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planId: S.planId, branchId: S.branchId, customer: S.details })
    });
    const order = await r.json();
    const rzp = new Razorpay({
      key: order.keyId, order_id: order.orderId, amount: order.amount, currency: "INR",
      name: "Next Level Fitness", description: p ? p.name : "Membership",
      prefill: { name: S.details.fullName, contact: S.details.phone, email: S.details.email },
      theme: { color: "#97C64A" },
      handler: async resp => {
        const v = await fetch(NLF.api.verify, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(resp) });
        const out = await v.json();
        S.refId = out.registrationId || refId("NLF");
        S.step = 6; render();
      },
      modal: { ondismiss: () => { S.step = 4; render(); } }
    });
    rzp.open();
  } catch (e) {
    mBody.innerHTML = `<div class="notice"><b>Payment couldn't start.</b> Nothing has been charged. Try again, or send your details to the gym and they'll take it from there.</div><button class="btn btn-ghost" id="toEnquiry" style="width:100%">Send my details instead</button>`;
    wire();
  }
}

/* ===================== legal ===================== */
const LEGAL = {
  privacy: ["Privacy policy", "This site collects only what is needed to register you or call you back: name, mobile number, email, date of birth, gender, emergency contact and your chosen gym and plan. Payment card details are never stored by Next Level Fitness — they are handled entirely by Razorpay. Your details are stored in the gym's database and used to contact you about your membership. You can ask the gym to delete your data at any time."],
  terms: ["Terms & conditions", "By using this website you agree to provide accurate information when registering. Membership availability, prices and timings are set by Next Level Fitness and may change. This website is operated on behalf of Next Level Fitness, Bengaluru."],
  membership: ["Membership terms", "Membership is personal and non-transferable unless the gym agrees otherwise in writing. Access is limited to the branch and duration shown on your plan. Members must follow the gym's floor rules and re-rack their weights. Full terms are set by the gym and will be confirmed at the branch."],
  refund: ["Refund & cancellation", "Refund and cancellation terms are set by Next Level Fitness and will be published here once confirmed by the owner. Until then, contact the gym directly about any payment issue."]
};
function openLegal(k) {
  const [t, body] = LEGAL[k];
  S.lastFocus = document.activeElement;
  modal.classList.add("open"); document.body.style.overflow = "hidden";
  mSteps.hidden = true; mLabel.hidden = true;
  mBody.innerHTML = `<h3 class="h-display" style="margin-bottom:16px">${t}</h3><p class="muted">${body}</p><div class="notice" style="margin-top:20px"><b>Draft.</b> This text is a working draft for the owner to review with a lawyer before launch. It is kept editable in the site data.</div>`;
  mFoot.innerHTML = `<span></span><button class="btn btn-ghost btn-sm" data-close>Close</button>`;
  $$("[data-close]", mFoot).forEach(el => el.onclick = closeModal);
}

/* ===================== real photos, when supplied ===================== */
function paint(el, src) {
  if (!el || !src) return;
  el.style.backgroundImage = `linear-gradient(180deg,rgba(7,7,7,.35),rgba(7,7,7,.55)), url("${src}")`;
  el.style.backgroundSize = "cover";
  el.style.backgroundPosition = "center";
  const t = el.querySelector(".ph-tag"); if (t) t.remove();
}
const IMG = NLF.images || {};
paint($("#heroMedia"), IMG.hero);
const aboutPhs = $$("#about .stack-media .ph");
paint(aboutPhs[0], IMG.aboutWide); paint(aboutPhs[1], IMG.aboutA); paint(aboutPhs[2], IMG.aboutB);
paint($("#owner-card .oimg .ph"), IMG.ownerPortrait);

observeAll();
