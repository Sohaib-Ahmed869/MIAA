import { Navigate } from "react-router-dom"
import { getDonorToken } from "../../lib/donorAuth"

export default function DonorProtectedRoute({ children }) {
  if (!getDonorToken()) {
    return <Navigate to="/donor/login" replace />
  }
  return children
}
