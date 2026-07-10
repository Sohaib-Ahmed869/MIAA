// Donor authentication + API helpers
const TOKEN_KEY = "miaa_donor_token"
const DONOR_KEY = "miaa_donor_user"

const BASE = (import.meta.env.VITE_API_URL || "https://miaa-backend.onrender.com").replace(/\/$/, "")

export function getDonorToken() {
  return localStorage.getItem(TOKEN_KEY)
}
export function getDonorUser() {
  try {
    const raw = localStorage.getItem(DONOR_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}
export function setDonorSession(token, donor) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(DONOR_KEY, JSON.stringify(donor))
}
export function clearDonorSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(DONOR_KEY)
}

async function request(path, { method = "GET", body, headers, signal, auth = true } = {}) {
  const token = auth ? getDonorToken() : null
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
    clearDonorSession()
  }
  if (!res.ok) {
    const err = new Error((data && (data.error || data.message)) || `Request failed (${res.status})`)
    err.status = res.status
    err.data = data
    throw err
  }
  return data
}

export const donorApi = {
  register: (payload) =>
    request("/api/donor/register", { method: "POST", body: payload, auth: false }),
  login: (email, password) =>
    request("/api/donor/login", { method: "POST", body: { email, password }, auth: false }),
  forgotPassword: (email) =>
    request("/api/donor/forgot-password", { method: "POST", body: { email }, auth: false }),
  resetPassword: (email, code, newPassword) =>
    request("/api/donor/reset-password", {
      method: "POST",
      body: { email, code, newPassword },
      auth: false,
    }),
  getProfile: () => request("/api/donor/profile"),
  updateProfile: (payload) =>
    request("/api/donor/profile", { method: "PATCH", body: payload }),

  // donations
  myDonations: () => request("/api/donations/donor"),
  getDonation: (id) => request(`/api/donations/${id}`),

  // subscriptions
  mySubscriptions: () => request("/api/subscriptions/donor"),
  cancelSubscription: (id) =>
    request(`/api/subscriptions/${id}/cancel`, { method: "PATCH" }),
  pauseSubscription: (id) =>
    request(`/api/subscriptions/${id}/pause`, { method: "PATCH" }),
  resumeSubscription: (id) =>
    request(`/api/subscriptions/${id}/resume`, { method: "PATCH" }),

  // campaign request
  requestCampaign: (payload) =>
    request("/api/campaigns/request", { method: "POST", body: payload }),
  myCampaignRequests: () => request("/api/campaigns/request/mine"),
  presignCampaignImage: (payload) =>
    request("/api/uploads/presign/donor", { method: "POST", body: payload }),

  // receipts & tax statements
  downloadReceipt: (donationId) =>
    `${BASE}/api/tax-statements/receipt/${donationId}`,
  downloadTaxStatement: (year) =>
    `${BASE}/api/tax-statements/donor/${year}`,
}

/** Upload a campaign-request image to S3 via a donor presigned PUT. Returns the key. */
export async function uploadDonorImage(file) {
  const { uploadUrl, key } = await donorApi.presignCampaignImage({
    filename: file.name,
    contentType: file.type || "application/octet-stream",
  })
  const res = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type || "application/octet-stream" },
    body: file,
  })
  if (!res.ok) throw new Error(`Image upload failed (${res.status})`)
  return key
}
