import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "./components/layout/Layout"
import Home from "./pages/Home"
import About from "./pages/About"
import IslamicArt from "./pages/IslamicArt"
import OffsiteEvents from "./pages/OffsiteEvents"
import Events from "./pages/Events"
import EventDetail from "./pages/EventDetail"
import CommunityEngagement from "./pages/CommunityEngagement"
import Timeline from "./pages/Timeline"
import Contact from "./pages/Contact"
import Blog from "./pages/Blog"
import BlogDetail from "./pages/BlogDetail"
import Volunteer from "./pages/Volunteer"
import SupportUs from "./pages/SupportUs"
import GalaDinner from "./pages/GalaDinner"
import GalaDinnerTicketing from "./pages/GalaDinnerTicketing"
import SMWF from "./pages/SMWF"
import Donations from "./pages/Donations"
import DonationCheckout from "./pages/DonationCheckout"
import DonationSuccess from "./pages/DonationSuccess"
import DonationCancelled from "./pages/DonationCancelled"
import CampaignDetail from "./pages/CampaignDetail"

import AdminLayout from "./admin/components/AdminLayout"
import ProtectedRoute from "./admin/components/ProtectedRoute"
import Login from "./admin/pages/Login"
import Dashboard from "./admin/pages/Dashboard"
import EventsAdmin from "./admin/pages/EventsAdmin"
import PreviousEventsAdmin from "./admin/pages/PreviousEventsAdmin"
import TeamAdmin from "./admin/pages/TeamAdmin"
import ContactAdmin from "./admin/pages/ContactAdmin"
import NewsletterAdmin from "./admin/pages/NewsletterAdmin"
import BlogAdmin from "./admin/pages/BlogAdmin"
import EventListsAdmin from "./admin/pages/EventListsAdmin"
import DonationProductsAdmin from "./admin/pages/DonationProductsAdmin"
import DonationsAdmin from "./admin/pages/DonationsAdmin"
import CampaignsAdmin from "./admin/pages/CampaignsAdmin"
import DonorsAdmin from "./admin/pages/DonorsAdmin"
import SubscriptionsAdmin from "./admin/pages/SubscriptionsAdmin"
import AuditLogAdmin from "./admin/pages/AuditLogAdmin"
import SettingsAdmin from "./admin/pages/SettingsAdmin"
import DonationsDashboard from "./admin/pages/DonationsDashboard"

import DonorProtectedRoute from "./components/donor/DonorProtectedRoute"
import DonorLayout from "./components/donor/DonorLayout"
import DonorLogin from "./pages/donor/DonorLogin"
import DonorRegister from "./pages/donor/DonorRegister"
import DonorForgotPassword from "./pages/donor/DonorForgotPassword"
import DonorDashboard from "./pages/donor/DonorDashboard"
import DonorDonations from "./pages/donor/DonorDonations"
import DonorSubscriptions from "./pages/donor/DonorSubscriptions"
import DonorReceipts from "./pages/donor/DonorReceipts"
import DonorProfile from "./pages/donor/DonorProfile"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin (no public Layout) */}
        <Route path="/admin/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="events" element={<EventsAdmin />} />
          <Route path="previous-events" element={<PreviousEventsAdmin />} />
          <Route path="team" element={<TeamAdmin />} />
          <Route path="blog" element={<BlogAdmin />} />
          <Route path="contact" element={<ContactAdmin />} />
          <Route path="newsletter" element={<NewsletterAdmin />} />
          <Route path="event-lists" element={<EventListsAdmin />} />
          <Route path="donations-dashboard" element={<DonationsDashboard />} />
          <Route path="donation-products" element={<DonationProductsAdmin />} />
          <Route path="donations" element={<DonationsAdmin />} />
          <Route path="campaigns" element={<CampaignsAdmin />} />
          <Route path="donors" element={<DonorsAdmin />} />
          <Route path="subscriptions" element={<SubscriptionsAdmin />} />
          <Route path="audit-log" element={<AuditLogAdmin />} />
          <Route path="settings" element={<SettingsAdmin />} />
        </Route>

        {/* Donor portal */}
        <Route path="/donor/login" element={<DonorLogin />} />
        <Route path="/donor/register" element={<DonorRegister />} />
        <Route path="/donor/forgot-password" element={<DonorForgotPassword />} />
        <Route
          path="/donor"
          element={
            <DonorProtectedRoute>
              <DonorLayout />
            </DonorProtectedRoute>
          }
        >
          <Route index element={<DonorDashboard />} />
          <Route path="donations" element={<DonorDonations />} />
          <Route path="subscriptions" element={<DonorSubscriptions />} />
          <Route path="receipts" element={<DonorReceipts />} />
          <Route path="profile" element={<DonorProfile />} />
        </Route>

        {/* Public site */}
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="islamic-art" element={<IslamicArt />} />
          <Route path="offsite-events" element={<OffsiteEvents />} />
          <Route path="events" element={<Events />} />
          <Route path="event/:id" element={<EventDetail />} />
          <Route path="community-engagement" element={<CommunityEngagement />} />
          <Route path="timeline" element={<Timeline />} />
          <Route path="contact" element={<Contact />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:slug" element={<BlogDetail />} />
          <Route path="volunteer" element={<Volunteer />} />
          <Route path="support-us" element={<SupportUs />} />
          <Route path="gala-dinner" element={<GalaDinner />} />
          <Route path="gala-dinner/tickets" element={<GalaDinnerTicketing />} />
          <Route path="smwf" element={<SMWF />} />
          <Route path="donate" element={<Donations />} />
          <Route path="donate/checkout" element={<DonationCheckout />} />
          <Route path="donate/success" element={<DonationSuccess />} />
          <Route path="donate/cancelled" element={<DonationCancelled />} />
          <Route path="campaign/:slug" element={<CampaignDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
