// Tiny fetch wrapper for the MIAA backend.
// Configure the base URL with `VITE_API_URL` in `.env.local`.

const BASE = (import.meta.env.VITE_API_URL || "https://miaa-backend.onrender.com").replace(/\/$/, "")

async function request(path, { method = "GET", body, headers, signal } = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(headers || {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    signal,
  })
  const text = await res.text()
  let data
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = text
  }
  if (!res.ok) {
    const err = new Error(
      (data && (data.error || data.message)) || `Request failed (${res.status})`
    )
    err.status = res.status
    err.data = data
    throw err
  }
  return data
}

export const api = {
  // public reads
  events: (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return request(`/api/events${qs ? `?${qs}` : ""}`)
  },
  eventById: (id) => request(`/api/events/${encodeURIComponent(id)}`),
  // Event registration (public)
  registerForEvent: (payload) =>
    request(`/api/event-registrations`, { method: "POST", body: payload }),
  confirmEventRegistration: (payload) =>
    request(`/api/event-registrations/confirm`, { method: "POST", body: payload }),
  // Volunteer door check-in (public, guarded by the volunteer's link token)
  volunteerPortal: (token) =>
    request(`/api/event-volunteers/portal/${encodeURIComponent(token)}`),
  volunteerCheckin: (token, passCode) =>
    request(`/api/event-volunteers/portal/${encodeURIComponent(token)}/checkin`, {
      method: "POST",
      body: { passCode },
    }),
  // Direct URL to the event pass PDF (guarded by the pass code).
  eventPassUrl: (id, code) =>
    `${BASE}/api/event-registrations/${id}/pass.pdf?code=${encodeURIComponent(code)}`,
  previousEvents: (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return request(`/api/previous-events${qs ? `?${qs}` : ""}`)
  },
  team: () => request(`/api/team`),

  // public writes
  submitContact: (payload) => request(`/api/contact`, { method: "POST", body: payload }),
  subscribeNewsletter: (email, source = "footer") =>
    request(`/api/newsletter`, { method: "POST", body: { email, source } }),

  // image url helper for items with a private S3 `key`
  signGet: (key) => request(`/api/uploads/sign-get?key=${encodeURIComponent(key)}`),

  // Gala Dinner / Tickets Tailor
  galaEvent: () => request(`/api/gala/event`),
  galaCheckout: (payload) => request(`/api/gala/checkout`, { method: "POST", body: payload }),

  // Blog (public)
  blogList: (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return request(`/api/blog${qs ? `?${qs}` : ""}`)
  },
  blogBySlug: (slug) => request(`/api/blog/${encodeURIComponent(slug)}`),

  // Sponsors (public) — logos shown on the Gala Dinner page
  sponsors: (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return request(`/api/sponsors${qs ? `?${qs}` : ""}`)
  },

  // Donations (public)
  donationProducts: (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return request(`/api/donation-products${qs ? `?${qs}` : ""}`)
  },
  donationProduct: (idOrSlug) =>
    request(`/api/donation-products/${encodeURIComponent(idOrSlug)}`),
  campaigns: () => request(`/api/campaigns`),
  campaign: (idOrSlug) =>
    request(`/api/campaigns/${encodeURIComponent(idOrSlug)}`),
  campaignDonations: (idOrSlug) =>
    request(`/api/campaigns/${encodeURIComponent(idOrSlug)}/donations`),
  donationConfig: () => request(`/api/donations/config`),
  createStripeCheckout: (payload) =>
    request(`/api/donations/checkout/stripe`, { method: "POST", body: payload }),
  createPaymentIntent: (payload) =>
    request(`/api/donations/payment-intent`, { method: "POST", body: payload }),
  confirmStripeDonation: (payload) =>
    request(`/api/donations/confirm/stripe`, { method: "POST", body: payload }),
  createPaypalOrder: (payload) =>
    request(`/api/donations/checkout/paypal`, { method: "POST", body: payload }),
  capturePaypalOrder: (payload) =>
    request(`/api/donations/capture/paypal`, { method: "POST", body: payload }),
  upsellProducts: (excludeId) =>
    request(`/api/donations/upsell${excludeId ? `?excludeProduct=${excludeId}` : ""}`),

  // Site settings (public)
  siteSettings: () => request(`/api/settings`),
}
