import { Link } from "react-router-dom"
import clsx from "clsx"

/**
 * The consent notice shown under every form that collects personal information
 * — contact, volunteer, donations, event registration and donor sign-up.
 *
 * Deliberately not a Site Content field: the same sentence has to appear on
 * every one of those forms and stay in step with the policies it points at, and
 * a per-page editable copy would let the five drift apart. The policy pages
 * themselves are fully editable, which is where wording changes belong.
 *
 * `tone` picks the palette — "dark" for the deep-teal form pages, "light" for
 * forms sitting on cream or white.
 */
export default function PolicyConsent({
  action = "submitting this form",
  volunteer = false,
  tone = "dark",
  className,
}) {
  const linkClass = clsx(
    "underline underline-offset-2 transition-colors",
    tone === "dark"
      ? "text-accent-wheat hover:text-white"
      : "text-secondary-terra hover:text-primary",
  )

  return (
    <p
      className={clsx(
        "text-xs 3xl:text-sm leading-relaxed",
        tone === "dark" ? "text-white/50" : "text-primary/60",
        className,
      )}
    >
      By {action} you agree to our{" "}
      {volunteer && (
        <>
          <Link to="/volunteer-policy" className={linkClass}>
            Volunteer Policy
          </Link>{" "}
          and{" "}
        </>
      )}
      <Link to="/privacy-policy" className={linkClass}>
        Privacy Policy
      </Link>
      , and consent to MIAA collecting and handling your personal information as
      described there.
    </p>
  )
}
