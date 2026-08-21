import { useEffect, useRef, useState } from "react"

/**
 * Fetch CMS data with a static fallback. If the backend is unreachable
 * (dev offline, CORS, etc.) the component still renders the original copy.
 *
 * `empty` separates the two cases that both land on the fallback: the backend
 * answered and genuinely has no rows (`true`), versus it never answered at all
 * (`false`). Callers that list real records — events, campaigns — need that
 * distinction, because placeholder rows are the right thing to show when the
 * API is down and the wrong thing to show when it has told us there is nothing.
 */
export function useCMS(fetcher, fallback) {
  const [data, setData] = useState(fallback)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [empty, setEmpty] = useState(false)
  const fetcherRef = useRef(fetcher)
  fetcherRef.current = fetcher

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)

    fetcherRef.current()
      .then((result) => {
        if (controller.signal.aborted) return
        const isEmpty = Array.isArray(result) && result.length === 0
        setData(isEmpty ? fallback : result)
        setEmpty(isEmpty)
        setError(null)
      })
      .catch((err) => {
        if (controller.signal.aborted) return
        setError(err)
        setData(fallback)
        // A failed request tells us nothing about whether rows exist, so this
        // stays false and the fallback keeps rendering.
        setEmpty(false)
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { data, loading, error, empty }
}
