import { useEffect, useState } from "react"
import { adminApi } from "../auth"
import PageHeader from "../components/PageHeader"
import Button from "../components/Button"
import { Field, TextInput, TextArea, NumberInput, Checkbox } from "../components/Field"
import { useToast } from "../components/Toast"

export default function SettingsAdmin() {
  const [widget, setWidget] = useState({
    enabled: false,
    headline: "Support MIAA",
    description: "",
    ctaLabel: "Donate Now",
    presetAmounts: [2500, 5000, 10000, 25000],
  })
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const { notify } = useToast()

  useEffect(() => {
    adminApi
      .getSiteSettings()
      .then((settings) => {
        if (settings?.donationWidget) {
          setWidget({ ...widget, ...settings.donationWidget })
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const save = async () => {
    setBusy(true)
    setError("")
    try {
      await adminApi.updateSiteSettings({ donationWidget: widget })
      notify("Settings saved")
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  if (loading) return <p className="text-primary/40 text-sm">Loading…</p>

  return (
    <div>
      <PageHeader
        label="Settings"
        title="Site Settings"
        subtitle="Configure the homepage donation widget and other site-wide settings."
      />

      <div className="max-w-2xl">
        <div className="bg-white border border-primary/10 rounded-sm p-6 mb-6">
          <h3 className="text-[0.625rem] tracking-[0.2em] uppercase text-primary/55 mb-4">
            Homepage Donation Widget
          </h3>

          {error && (
            <p className="text-xs text-rose-600 bg-rose-50 px-3 py-2 rounded-sm mb-4">
              {error}
            </p>
          )}

          <div className="flex flex-col gap-5">
            <Checkbox
              label="Enable widget on homepage"
              checked={widget.enabled}
              onChange={(v) => setWidget({ ...widget, enabled: v })}
            />
            <Field label="Headline">
              <TextInput
                value={widget.headline}
                onChange={(e) => setWidget({ ...widget, headline: e.target.value })}
                placeholder="Support MIAA"
              />
            </Field>
            <Field label="Description">
              <TextArea
                value={widget.description}
                onChange={(e) => setWidget({ ...widget, description: e.target.value })}
                rows={3}
                placeholder="Your donation helps preserve and celebrate…"
              />
            </Field>
            <Field label="CTA Button Label">
              <TextInput
                value={widget.ctaLabel}
                onChange={(e) => setWidget({ ...widget, ctaLabel: e.target.value })}
                placeholder="Donate Now"
              />
            </Field>
            <Field
              label="Preset Amounts (cents, comma-separated)"
              hint="e.g. 2500,5000,10000,25000 for $25,$50,$100,$250"
            >
              <TextInput
                value={(widget.presetAmounts || []).join(",")}
                onChange={(e) =>
                  setWidget({
                    ...widget,
                    presetAmounts: e.target.value
                      .split(",")
                      .map((s) => Number(s.trim()))
                      .filter((n) => n > 0),
                  })
                }
                placeholder="2500,5000,10000,25000"
              />
            </Field>
          </div>

          <div className="mt-6 pt-4 border-t border-primary/10">
            <Button onClick={save} variant="primary" disabled={busy} withArrow>
              {busy ? "Saving…" : "Save Settings"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
