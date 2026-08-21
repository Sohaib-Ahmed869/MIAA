import { useMemo } from "react"
import { useText } from "../content/context"

/**
 * The museum's social accounts, in the order they're shown.
 *
 * Only the account's *name* lives here — its address is a Site Content field
 * (`footer.social.*`, edited under Footer → Connect & Socials), so an account
 * can be added, changed or retired without a deploy. An account whose address
 * is blank is simply not rendered, which is how the ones the museum doesn't
 * have yet stay hidden until someone pastes a link in.
 */
export const SOCIAL_ACCOUNTS = [
  { id: "instagram", label: "Instagram", key: "footer.social.instagram" },
  { id: "facebook", label: "Facebook", key: "footer.social.facebook" },
  { id: "youtube", label: "YouTube", key: "footer.social.youtube" },
  { id: "linkedin", label: "LinkedIn", key: "footer.social.linkedin" },
  { id: "tiktok", label: "TikTok", key: "footer.social.tiktok" },
  { id: "x", label: "X", key: "footer.social.x" },
  { id: "threads", label: "Threads", key: "footer.social.threads" },
]

/** The accounts that actually have an address, as `{ id, label, url }`. */
export function useSocialLinks() {
  const t = useText()
  return useMemo(
    () =>
      SOCIAL_ACCOUNTS.map((account) => ({ ...account, url: (t(account.key) || "").trim() })).filter(
        (account) => account.url
      ),
    [t]
  )
}
