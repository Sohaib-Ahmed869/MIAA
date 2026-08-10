// Token + admin-API helpers
const TOKEN_KEY = "miaa_admin_token"
const ADMIN_KEY = "miaa_admin_user"

const BASE = (import.meta.env.VITE_API_URL || "https://miaa-backend.onrender.com").replace(/\/$/, "")

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}
export function getAdminUser() {
  try {
    const raw = localStorage.getItem(ADMIN_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}
export function setSession(token, admin) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(ADMIN_KEY, JSON.stringify(admin))
}
export function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(ADMIN_KEY)
}

async function request(path, { method = "GET", body, headers, signal, auth = true } = {}) {
  const token = auth ? getToken() : null
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
  if (res.status === 401) {
    clearSession()
  }
  if (!res.ok) {
    const err = new Error((data && (data.error || data.message)) || `Request failed (${res.status})`)
    err.status = res.status
    err.data = data
    throw err
  }
  return data
}

export const adminApi = {
  login: (email, password) =>
    request("/api/auth/login", {
      method: "POST",
      body: { email, password },
      auth: false,
    }),

  // events — the admin list, which unlike the public one includes unpublished
  // events. Without it an event would disappear from this screen the moment it
  // was unpublished or archived.
  listEvents: (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return request(`/api/events/admin/all${qs ? `?${qs}` : ""}`)
  },
  // Copies an event into the Previous Events archive and unpublishes it. Past
  // events reach the archive on their own, so this is for archiving one early
  // or giving it a different write-up.
  archiveEvent: (id) =>
    request(`/api/previous-events/from-event/${id}`, { method: "POST" }),
  createEvent: (payload) => request("/api/events", { method: "POST", body: payload }),
  updateEvent: (id, payload) => request(`/api/events/${id}`, { method: "PATCH", body: payload }),
  deleteEvent: (id) => request(`/api/events/${id}`, { method: "DELETE" }),

  // event registrations (paid / free)
  listEventRegistrations: (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return request(`/api/event-registrations${qs ? `?${qs}` : ""}`)
  },
  getEventRegistration: (id) => request(`/api/event-registrations/${id}`),
  // CSV export — mirrors the current list filters. Streams a file, so it can't
  // go through `request` (which parses JSON); download the blob directly.
  exportEventRegistrations: async (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    const res = await fetch(
      `${BASE}/api/event-registrations/export.csv${qs ? `?${qs}` : ""}`,
      { headers: { ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}) } }
    )
    if (res.status === 401) clearSession()
    if (!res.ok) throw new Error(`Export failed (${res.status})`)
    const blob = await res.blob()
    const disposition = res.headers.get("Content-Disposition") || ""
    const match = disposition.match(/filename="?([^"]+)"?/)
    return { blob, filename: match?.[1] || "event-registrations.csv" }
  },
  updateEventRegistration: (id, payload) =>
    request(`/api/event-registrations/${id}`, { method: "PATCH", body: payload }),
  deleteEventRegistration: (id) =>
    request(`/api/event-registrations/${id}`, { method: "DELETE" }),
  eventAnalytics: (id) => request(`/api/event-registrations/analytics/${id}`),
  checkinRegistration: (passCode) =>
    request(`/api/event-registrations/checkin`, {
      method: "POST",
      body: { passCode },
    }),

  // event volunteers (door check-in helpers)
  listEventVolunteers: (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return request(`/api/event-volunteers${qs ? `?${qs}` : ""}`)
  },
  createEventVolunteer: (payload) =>
    request("/api/event-volunteers", { method: "POST", body: payload }),
  updateEventVolunteer: (id, payload) =>
    request(`/api/event-volunteers/${id}`, { method: "PATCH", body: payload }),
  sendVolunteerLink: (id) =>
    request(`/api/event-volunteers/${id}/send-link`, { method: "POST" }),
  deleteEventVolunteer: (id) =>
    request(`/api/event-volunteers/${id}`, { method: "DELETE" }),

  // previous events
  listPreviousEvents: (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return request(`/api/previous-events${qs ? `?${qs}` : ""}`, { auth: false })
  },
  createPreviousEvent: (payload) =>
    request("/api/previous-events", { method: "POST", body: payload }),
  updatePreviousEvent: (id, payload) =>
    request(`/api/previous-events/${id}`, { method: "PATCH", body: payload }),
  deletePreviousEvent: (id) =>
    request(`/api/previous-events/${id}`, { method: "DELETE" }),

  // team
  listTeam: () => request("/api/team", { auth: false }),
  createTeam: (payload) => request("/api/team", { method: "POST", body: payload }),
  updateTeam: (id, payload) => request(`/api/team/${id}`, { method: "PATCH", body: payload }),
  deleteTeam: (id) => request(`/api/team/${id}`, { method: "DELETE" }),

  // contact submissions
  listContact: (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return request(`/api/contact${qs ? `?${qs}` : ""}`)
  },
  updateContact: (id, payload) =>
    request(`/api/contact/${id}`, { method: "PATCH", body: payload }),
  deleteContact: (id) => request(`/api/contact/${id}`, { method: "DELETE" }),

  // volunteer applications
  listVolunteerApplications: (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return request(`/api/volunteer-applications${qs ? `?${qs}` : ""}`)
  },
  updateVolunteerApplication: (id, payload) =>
    request(`/api/volunteer-applications/${id}`, { method: "PATCH", body: payload }),
  deleteVolunteerApplication: (id) =>
    request(`/api/volunteer-applications/${id}`, { method: "DELETE" }),

  // newsletter
  listNewsletter: () => request("/api/newsletter"),
  deleteSubscriber: (id) => request(`/api/newsletter/${id}`, { method: "DELETE" }),

  // brevo event→list mappings (Ticket Tailor sync routing)
  listEventLists: () => request("/api/brevo-lists"),
  createEventList: (payload) => request("/api/brevo-lists", { method: "POST", body: payload }),
  updateEventList: (id, payload) =>
    request(`/api/brevo-lists/${id}`, { method: "PATCH", body: payload }),
  deleteEventList: (id) => request(`/api/brevo-lists/${id}`, { method: "DELETE" }),

  // blog
  listBlog: () => request("/api/blog/admin/all"),
  createBlog: (payload) => request("/api/blog", { method: "POST", body: payload }),
  updateBlog: (id, payload) => request(`/api/blog/${id}`, { method: "PATCH", body: payload }),
  deleteBlog: (id) => request(`/api/blog/${id}`, { method: "DELETE" }),

  // sponsors (Gala Dinner logos)
  listSponsors: () => request("/api/sponsors/admin/all"),
  createSponsor: (payload) => request("/api/sponsors", { method: "POST", body: payload }),
  updateSponsor: (id, payload) => request(`/api/sponsors/${id}`, { method: "PATCH", body: payload }),
  deleteSponsor: (id) => request(`/api/sponsors/${id}`, { method: "DELETE" }),

  // donation products
  listDonationProducts: (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return request(`/api/donation-products/admin/all${qs ? `?${qs}` : ""}`)
  },
  createDonationProduct: (payload) =>
    request("/api/donation-products", { method: "POST", body: payload }),
  updateDonationProduct: (id, payload) =>
    request(`/api/donation-products/${id}`, { method: "PATCH", body: payload }),
  // Soft delete: archiving also unpublishes/deactivates so it leaves the public site.
  archiveDonationProduct: (id) =>
    request(`/api/donation-products/${id}`, {
      method: "PATCH",
      body: { archived: true, isActive: false, published: false },
    }),
  unarchiveDonationProduct: (id) =>
    request(`/api/donation-products/${id}`, { method: "PATCH", body: { archived: false } }),
  deleteDonationProduct: (id) =>
    request(`/api/donation-products/${id}`, { method: "DELETE" }),

  // donations
  listDonations: (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return request(`/api/donations/admin/all${qs ? `?${qs}` : ""}`)
  },
  getDonation: (id) => request(`/api/donations/${id}`),
  getDonationStats: (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return request(`/api/donations/stats${qs ? `?${qs}` : ""}`)
  },

  // campaigns
  listCampaigns: (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return request(`/api/campaigns/admin/all${qs ? `?${qs}` : ""}`)
  },
  createCampaign: (payload) => request("/api/campaigns", { method: "POST", body: payload }),
  updateCampaign: (id, payload) =>
    request(`/api/campaigns/${id}`, { method: "PATCH", body: payload }),
  // Soft delete: archiving also unpublishes so it leaves the public site.
  archiveCampaign: (id) =>
    request(`/api/campaigns/${id}`, {
      method: "PATCH",
      body: { archived: true, published: false },
    }),
  unarchiveCampaign: (id) =>
    request(`/api/campaigns/${id}`, { method: "PATCH", body: { archived: false } }),
  deleteCampaign: (id) => request(`/api/campaigns/${id}`, { method: "DELETE" }),

  // campaign requests (donor-submitted)
  listCampaignRequests: () => request("/api/campaigns/admin/requests"),
  campaignRequestsCount: () => request("/api/campaigns/admin/requests/count"),
  updateCampaignStatus: (id, payload) =>
    request(`/api/campaigns/${id}/status`, { method: "PATCH", body: payload }),

  // subscriptions
  listSubscriptions: (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return request(`/api/subscriptions/admin/all${qs ? `?${qs}` : ""}`)
  },

  // donors
  listDonors: () => request("/api/donor/admin/all"),
  getDonor: (id) => request(`/api/donor/admin/${id}`),

  // audit log
  listAuditLog: (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return request(`/api/audit-log${qs ? `?${qs}` : ""}`)
  },

  // tax statements
  generateTaxStatement: (donorId, year) =>
    request(`/api/tax-statements/generate/${donorId}?year=${year}`),

  // staff accounts (admins + check-in volunteers)
  listStaff: () => request("/api/staff"),
  createStaff: (payload) => request("/api/staff", { method: "POST", body: payload }),
  updateStaff: (id, payload) => request(`/api/staff/${id}`, { method: "PATCH", body: payload }),
  deleteStaff: (id) => request(`/api/staff/${id}`, { method: "DELETE" }),

  // site settings
  getSiteSettings: () => request("/api/settings"),
  updateSiteSettings: (payload) =>
    request("/api/settings", { method: "PATCH", body: payload }),

  // uploads
  presign: ({ filename, contentType, folder }) =>
    request("/api/uploads/presign", {
      method: "POST",
      body: { filename, contentType, folder },
    }),
}

/** Upload a File to S3 via a presigned PUT. Returns the S3 key to persist. */
export async function uploadFileToS3(file, folder = "uploads") {
  const { uploadUrl, key } = await adminApi.presign({
    filename: file.name,
    contentType: file.type || "application/octet-stream",
    folder,
  })
  const res = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type || "application/octet-stream" },
    body: file,
  })
  if (!res.ok) throw new Error(`S3 upload failed (${res.status})`)
  return key
}
