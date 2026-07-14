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

  // events
  listEvents: (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return request(`/api/events${qs ? `?${qs}` : ""}`, { auth: false })
  },
  createEvent: (payload) => request("/api/events", { method: "POST", body: payload }),
  updateEvent: (id, payload) => request(`/api/events/${id}`, { method: "PATCH", body: payload }),
  deleteEvent: (id) => request(`/api/events/${id}`, { method: "DELETE" }),

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
