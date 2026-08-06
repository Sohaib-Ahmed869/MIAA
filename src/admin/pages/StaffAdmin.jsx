import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Plus, Pencil, Trash2, ShieldCheck, ScanLine, Ban, Power } from "lucide-react"
import { adminApi, getAdminUser } from "../auth"
import PageHeader from "../components/PageHeader"
import EmptyState from "../components/EmptyState"
import Drawer from "../components/Drawer"
import Button from "../components/Button"
import { Field, TextInput, Select } from "../components/Field"
import { useToast } from "../components/Toast"
import { useConfirm } from "../../components/ui/ConfirmDialog"
import { SkeletonList } from "../components/Skeleton"

const ROLE_META = {
  admin: {
    label: "Admin",
    hint: "Full access to the whole CMS.",
    badge: "bg-secondary-terra/15 text-secondary-terra",
    icon: ShieldCheck,
  },
  volunteer: {
    label: "Volunteer",
    hint: "Door check-in only — no donations, donors or settings.",
    badge: "bg-emerald-500/15 text-emerald-700",
    icon: ScanLine,
  },
}

const blankDraft = { id: null, name: "", email: "", password: "", role: "volunteer" }

const initials = (name, email) =>
  ((name || email || "?")
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("") || "?").toUpperCase()

export default function StaffAdmin() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [draft, setDraft] = useState(blankDraft)
  const [saving, setSaving] = useState(false)
  const { notify } = useToast()
  const confirm = useConfirm()
  const me = getAdminUser()

  const load = async () => {
    setLoading(true)
    try {
      const data = await adminApi.listStaff()
      setItems(data)
      setError("")
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  // Initial fetch — state is only touched inside the async callbacks (never
  // synchronously in the effect body), so it doesn't trip set-state-in-effect.
  useEffect(() => {
    let alive = true
    adminApi
      .listStaff()
      .then((data) => alive && (setItems(data), setError("")))
      .catch((err) => alive && setError(err.message))
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [])

  const openNew = () => {
    setDraft(blankDraft)
    setDrawerOpen(true)
  }
  const openEdit = (s) => {
    setDraft({ id: s._id, name: s.name || "", email: s.email, password: "", role: s.role })
    setDrawerOpen(true)
  }

  const save = async () => {
    setSaving(true)
    try {
      if (draft.id) {
        // Only send a password when the admin actually typed a reset value.
        const payload = { name: draft.name, role: draft.role }
        if (draft.password) payload.password = draft.password
        await adminApi.updateStaff(draft.id, payload)
        notify("Account updated")
      } else {
        await adminApi.createStaff({
          name: draft.name,
          email: draft.email,
          password: draft.password,
          role: draft.role,
        })
        notify("Account created")
      }
      setDrawerOpen(false)
      load()
    } catch (err) {
      notify(err.message, "error")
    } finally {
      setSaving(false)
    }
  }

  const toggleActive = async (s) => {
    const nextActive = s.active === false // currently disabled → enabling
    try {
      await adminApi.updateStaff(s._id, { active: nextActive })
      notify(nextActive ? "Account enabled" : "Account disabled")
      load()
    } catch (err) {
      notify(err.message, "error")
    }
  }

  const remove = async (s) => {
    if (
      !(await confirm({
        title: `Delete ${s.name || s.email}?`,
        message: "They will no longer be able to sign in.",
        confirmLabel: "Delete",
        danger: true,
      }))
    )
      return
    try {
      await adminApi.deleteStaff(s._id)
      notify("Account deleted")
      load()
    } catch (err) {
      notify(err.message, "error")
    }
  }

  const isSelf = (s) => s.email === me?.email
  const canSave = draft.id
    ? true
    : draft.email.trim() && draft.password.length >= 8

  return (
    <div>
      <PageHeader
        label="Access"
        title="Staff & Volunteers"
        subtitle="Create login accounts. Volunteers can sign in for door check-in only; admins get the full CMS."
        actions={
          <Button onClick={openNew}>
            <Plus className="w-3.5 h-3.5" /> Add account
          </Button>
        }
      />

      {error && (
        <p className="text-xs text-rose-600 bg-rose-50 px-3 py-2 rounded-sm mb-4">{error}</p>
      )}

      {loading ? (
        <SkeletonList count={4} />
      ) : items.length === 0 ? (
        <EmptyState
          title="No accounts yet"
          hint="Add a volunteer so they can run door check-in."
        />
      ) : (
        <motion.ul
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.03 } } }}
          className="bg-white border border-primary/10 rounded-sm divide-y divide-primary/8 overflow-hidden"
        >
          {items.map((s) => {
            const meta = ROLE_META[s.role] || ROLE_META.volunteer
            const RoleIcon = meta.icon
            const disabled = s.active === false
            return (
              <motion.li
                key={s._id}
                variants={{ hidden: { opacity: 0, y: 6 }, visible: { opacity: 1, y: 0 } }}
                className="flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3.5"
              >
                <span
                  className={`grid place-items-center w-9 h-9 rounded-full bg-primary/8 text-primary text-[0.6875rem] font-semibold flex-shrink-0 ${
                    disabled ? "opacity-40" : ""
                  }`}
                >
                  {initials(s.name, s.email)}
                </span>

                <div className={`flex-1 min-w-0 ${disabled ? "opacity-50" : ""}`}>
                  <p className="text-primary text-sm font-semibold truncate">
                    {s.name || "—"}
                    {isSelf(s) && (
                      <span className="ml-2 text-[0.5625rem] tracking-[0.18em] uppercase text-primary/40">
                        You
                      </span>
                    )}
                  </p>
                  <p className="text-[0.75rem] text-primary/55 break-all sm:truncate">{s.email}</p>
                </div>

                {disabled && (
                  <span className="hidden sm:inline-flex items-center text-[0.625rem] tracking-[0.18em] uppercase px-2 py-1 rounded-sm bg-primary/10 text-primary/55">
                    Disabled
                  </span>
                )}
                <span
                  className={`hidden sm:inline-flex items-center gap-1 text-[0.625rem] tracking-[0.18em] uppercase px-2 py-1 rounded-sm ${meta.badge} ${
                    disabled ? "opacity-50" : ""
                  }`}
                >
                  <RoleIcon className="w-3 h-3" /> {meta.label}
                </span>

                <button
                  onClick={() => toggleActive(s)}
                  disabled={isSelf(s)}
                  className={`p-2 rounded-sm transition-colors hover:bg-accent-cream disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed ${
                    disabled
                      ? "text-primary/50 hover:text-emerald-600"
                      : "text-primary/50 hover:text-amber-600"
                  }`}
                  aria-label={disabled ? "Enable account" : "Disable account"}
                  title={
                    isSelf(s)
                      ? "You can't disable your own account"
                      : disabled
                      ? "Enable — allow sign-in"
                      : "Disable — block sign-in"
                  }
                >
                  {disabled ? <Power className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => openEdit(s)}
                  className="p-2 rounded-sm text-primary/50 hover:text-secondary-terra hover:bg-accent-cream transition-colors"
                  aria-label="Edit account"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => remove(s)}
                  disabled={isSelf(s)}
                  className="p-2 rounded-sm text-primary/50 hover:text-rose-600 hover:bg-accent-cream transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-primary/50 disabled:cursor-not-allowed"
                  aria-label="Delete account"
                  title={isSelf(s) ? "You can't delete your own account" : "Delete"}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.li>
            )
          })}
        </motion.ul>
      )}

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={draft.id ? "Edit account" : "Add account"}
        subtitle={
          draft.role === "volunteer"
            ? "Volunteers only see the Door Check-in screen."
            : "Admins get full access to the CMS."
        }
        footer={
          <>
            <Button variant="ghost" onClick={() => setDrawerOpen(false)}>
              Cancel
            </Button>
            <Button onClick={save} disabled={!canSave || saving}>
              {saving ? "Saving…" : draft.id ? "Save changes" : "Create account"}
            </Button>
          </>
        }
      >
        <div className="space-y-5">
          <Field label="Role">
            <Select
              value={draft.role}
              onChange={(e) => setDraft((d) => ({ ...d, role: e.target.value }))}
            >
              <option value="volunteer">Volunteer — door check-in only</option>
              <option value="admin">Admin — full access</option>
            </Select>
          </Field>

          <Field label="Full name">
            <TextInput
              value={draft.name}
              onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
              placeholder="e.g. Door Volunteer"
            />
          </Field>

          {draft.id ? (
            <Field label="Email" hint="The login email can't be changed.">
              <p className="px-3 py-2.5 text-sm text-primary/70 bg-accent-cream/60 border border-primary/10 rounded-sm break-all">
                {draft.email}
              </p>
            </Field>
          ) : (
            <Field label="Email" hint="Used to sign in at /admin/login.">
              <TextInput
                type="email"
                value={draft.email}
                onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))}
                placeholder="volunteer@miaaustralia.org"
              />
            </Field>
          )}

          <Field
            label={draft.id ? "Reset password" : "Password"}
            hint={
              draft.id
                ? "Leave blank to keep the current password. Min 8 characters."
                : "At least 8 characters. Share it with the volunteer securely."
            }
          >
            <TextInput
              type="text"
              value={draft.password}
              onChange={(e) => setDraft((d) => ({ ...d, password: e.target.value }))}
              placeholder={draft.id ? "••••••••" : "Set a password"}
              autoComplete="new-password"
            />
          </Field>
        </div>
      </Drawer>
    </div>
  )
}
