// Content-block helpers shared by the builder and its consumers.

let _uid = 0
export function makeId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID()
  return `b${Date.now()}_${_uid++}`
}

export function newBlock(type) {
  const id = makeId()
  if (type === "heading") return { id, type, text: "", level: 2 }
  if (type === "quote") return { id, type, text: "", cite: "" }
  if (type === "image") return { id, type, imageKey: "", caption: "" }
  return { id, type: "paragraph", text: "" }
}

// Ensure loaded blocks have stable ids (for React keys + reordering).
export function withBlockIds(blocks) {
  return (Array.isArray(blocks) ? blocks : []).map((b) =>
    b && b.id ? b : { ...b, id: makeId() },
  )
}
