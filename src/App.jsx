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
import SponsorsAdmin from "./admin/pages/SponsorsAdmin"
import EventListsAdmin from "./admin/pages/EventListsAdmin"

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
          <Route path="sponsors" element={<SponsorsAdmin />} />
          <Route path="contact" element={<ContactAdmin />} />
          <Route path="newsletter" element={<NewsletterAdmin />} />
          <Route path="event-lists" element={<EventListsAdmin />} />
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
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
