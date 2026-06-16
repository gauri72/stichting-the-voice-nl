import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconArrowLeft,
  IconCalendar,
  IconCalendarEvent,
  IconClock,
  IconDeviceFloppy,
  IconDotsVertical,
  IconGlobe,
  IconMapPin,
  IconPlus,
  IconSettings,
  IconTicket,
} from "@tabler/icons-react";
import AdminLayout from "./AdminLayout.jsx";
import "../../styles/admin-events-page.css";

const STEPS = [
  { id: 1, label: "Event Details" },
  { id: 2, label: "Ticket Types" },
  { id: 3, label: "Review & Publish" },
];

const EVENT_CATEGORIES = [
  "Cultural Event",
  "Music & Performance",
  "Community Gathering",
  "Fundraiser",
  "Workshop",
];

const TIMEZONES = ["(CEST) Amsterdam", "(GMT) London", "(EST) New York", "(PST) Los Angeles"];

const VISIBILITY_OPTIONS = [
  "Public – Visible to everyone",
  "Members only",
  "Private – Invite only",
];

const INITIAL_TICKETS = [
  {
    id: "early-bird",
    name: "Early Bird",
    badge: { label: "Early Bird", tone: "green" },
    description: "Limited early access pricing",
    price: "29.00",
    qty: 100,
    enabled: true,
  },
  {
    id: "general",
    name: "General Admission",
    badge: null,
    description: "Standard entry ticket",
    price: "45.00",
    qty: 250,
    enabled: true,
  },
  {
    id: "vip",
    name: "VIP",
    badge: { label: "Popular", tone: "gold" },
    description: "Premium experience access",
    price: "89.00",
    qty: 50,
    enabled: true,
  },
  {
    id: "vvip",
    name: "VVIP",
    badge: { label: "Limited", tone: "purple" },
    description: "Exclusive all-access pass",
    price: "149.00",
    qty: 25,
    enabled: true,
  },
];

function SectionCard({
  icon: Icon,
  step,
  title,
  description,
  action,
  children,
  headerClassName = "",
  compactBody = false,
}) {
  return (
    <section className="admin-events__card">
      <header
        className={`admin-events__card-header${headerClassName ? ` ${headerClassName}` : ""}`}
      >
        <div className="admin-events__card-heading">
          <span className="admin-events__card-icon" aria-hidden="true">
            <Icon size={20} stroke={1.7} />
          </span>
          <div>
            <h2>
              {step}. {title}
            </h2>
            {description ? <p>{description}</p> : null}
          </div>
        </div>
        {action}
      </header>
      <div
        className={`admin-events__card-body${compactBody ? " admin-events__card-body--compact-top" : ""}`}
      >
        {children}
      </div>
    </section>
  );
}

function RequiredLabel({ htmlFor, children }) {
  return (
    <label className="admin-events__label" htmlFor={htmlFor}>
      {children}
      <span className="admin-events__required" aria-hidden="true">
        *
      </span>
    </label>
  );
}

export default function AdminEventsPage() {
  const navigate = useNavigate();
  const [activeStep] = useState(1);
  const [title, setTitle] = useState("HerBeats Her Night 2025 – A Night of Voices");
  const [category, setCategory] = useState("Cultural Event");
  const [shortDescription, setShortDescription] = useState(
    "A night of inspiration, connection and celebration honoring women who lead with voice and vision."
  );
  const [eventDate, setEventDate] = useState("2025-05-31");
  const [startTime, setStartTime] = useState("18:30");
  const [endTime, setEndTime] = useState("00:30");
  const [timezone, setTimezone] = useState("(CEST) Amsterdam");
  const [visibility, setVisibility] = useState("Public – Visible to everyone");
  const [registrationDeadline, setRegistrationDeadline] = useState("2025-05-30T23:59");
  const [tickets, setTickets] = useState(INITIAL_TICKETS);
  const [saveMessage, setSaveMessage] = useState("");

  function handleTicketToggle(id) {
    setTickets((current) =>
      current.map((ticket) => (ticket.id === id ? { ...ticket, enabled: !ticket.enabled } : ticket))
    );
  }

  function handleTicketQty(id, qty) {
    setTickets((current) =>
      current.map((ticket) => (ticket.id === id ? { ...ticket, qty: Number(qty) || 0 } : ticket))
    );
  }

  function handleSave() {
    setSaveMessage("Event saved successfully.");
    window.setTimeout(() => setSaveMessage(""), 3000);
  }

  return (
    <AdminLayout hideBottomNav>
      <div className="admin-events">
        <header className="admin-events__hero">
          <button
            type="button"
            className="admin-events__back"
            onClick={() => navigate("/admin/dashboard")}
          >
            <IconArrowLeft size={18} stroke={1.8} aria-hidden="true" />
            Back
          </button>
          <h1 className="admin-events__title">Launch New Event</h1>
          <p className="admin-events__subtitle">Create and publish an amazing experience</p>
        </header>

        <nav className="admin-events__stepper" aria-label="Event creation progress">
          <ol className="admin-events__stepper-list">
            {STEPS.map((step, index) => {
              const isActive = step.id === activeStep;
              const isComplete = step.id < activeStep;
              return (
                <li
                  key={step.id}
                  className={`admin-events__step${isActive ? " admin-events__step--active" : ""}${isComplete ? " admin-events__step--complete" : ""}`}
                >
                  <span className="admin-events__step-marker">{step.id}</span>
                  <span className="admin-events__step-label">{step.label}</span>
                  {index < STEPS.length - 1 ? (
                    <span className="admin-events__step-line" aria-hidden="true" />
                  ) : null}
                </li>
              );
            })}
          </ol>
        </nav>

        <SectionCard
          icon={IconCalendarEvent}
          step={1}
          title="Event Details"
          description="Add the essential information about your event"
          headerClassName="admin-events__card-header--compact"
          compactBody
        >
          <div className="admin-events__field">
            <RequiredLabel htmlFor="event-title">Event Title</RequiredLabel>
            <div className="admin-events__input-wrap admin-events__input-wrap--counter">
              <input
                id="event-title"
                type="text"
                className="admin-events__input"
                value={title}
                maxLength={100}
                onChange={(event) => setTitle(event.target.value)}
              />
              <span className="admin-events__counter">{title.length}/100</span>
            </div>
          </div>

          <div className="admin-events__field">
            <RequiredLabel htmlFor="event-category">Event Category</RequiredLabel>
            <select
              id="event-category"
              className="admin-events__select"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              {EVENT_CATEGORIES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-events__field">
            <RequiredLabel htmlFor="event-description">Short Description</RequiredLabel>
            <div className="admin-events__input-wrap admin-events__input-wrap--counter admin-events__input-wrap--textarea">
              <textarea
                id="event-description"
                className="admin-events__textarea"
                value={shortDescription}
                maxLength={150}
                rows={3}
                onChange={(event) => setShortDescription(event.target.value)}
              />
              <span className="admin-events__counter">{shortDescription.length}/150</span>
            </div>
          </div>

          <div className="admin-events__field">
            <RequiredLabel htmlFor="event-date">Date &amp; Time</RequiredLabel>
            <div className="admin-events__datetime-row">
              <label className="admin-events__input-icon-wrap">
                <IconCalendar size={18} stroke={1.7} aria-hidden="true" />
                <input
                  id="event-date"
                  type="date"
                  className="admin-events__input admin-events__input--with-icon admin-events__input--hide-native-icon"
                  value={eventDate}
                  onChange={(event) => setEventDate(event.target.value)}
                />
              </label>
              <label className="admin-events__input-icon-wrap admin-events__input-icon-wrap--time">
                <IconClock size={18} stroke={1.7} aria-hidden="true" />
                <input
                  type="time"
                  className="admin-events__input admin-events__input--with-icon admin-events__input--hide-native-icon"
                  value={startTime}
                  onChange={(event) => setStartTime(event.target.value)}
                />
                <span className="admin-events__tz-tag">CEST</span>
              </label>
            </div>
          </div>

          <div className="admin-events__field">
            <RequiredLabel htmlFor="event-venue">Venue</RequiredLabel>
            <div className="admin-events__venue">
              <label className="admin-events__input-icon-wrap admin-events__input-icon-wrap--block">
                <IconMapPin size={18} stroke={1.7} aria-hidden="true" />
                <input
                  id="event-venue"
                  type="text"
                  className="admin-events__input admin-events__input--with-icon"
                  defaultValue="Mainport Hotel Rotterdam"
                  readOnly
                />
              </label>
              <p className="admin-events__venue-address">
                Leuvehaven 77, 3011 EA Rotterdam, Netherlands
              </p>
              <button type="button" className="admin-events__link-btn">
                Change Venue
              </button>
            </div>
          </div>

          <div className="admin-events__field">
            <label className="admin-events__label" htmlFor="event-timezone">
              Timezone
            </label>
            <label className="admin-events__input-icon-wrap admin-events__input-icon-wrap--block">
              <IconGlobe size={18} stroke={1.7} aria-hidden="true" />
              <select
                id="event-timezone"
                className="admin-events__select admin-events__select--with-icon"
                value={timezone}
                onChange={(event) => setTimezone(event.target.value)}
              >
                {TIMEZONES.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="admin-events__field">
            <label className="admin-events__label" htmlFor="event-end">
              Event Ends
            </label>
            <label className="admin-events__input-icon-wrap admin-events__input-icon-wrap--block admin-events__input-icon-wrap--time">
              <IconClock size={18} stroke={1.7} aria-hidden="true" />
              <input
                id="event-end"
                type="time"
                className="admin-events__input admin-events__input--with-icon admin-events__input--hide-native-icon"
                value={endTime}
                onChange={(event) => setEndTime(event.target.value)}
              />
              <span className="admin-events__tz-tag">CEST</span>
            </label>
          </div>
        </SectionCard>

        <SectionCard
          icon={IconTicket}
          step={2}
          title="Ticket Types"
          description="Add and manage ticket types for your event"
          headerClassName="admin-events__card-header--tickets"
          action={
            <button type="button" className="admin-events__outline-btn">
              <IconPlus size={16} stroke={2} aria-hidden="true" />
              Add Ticket Type
            </button>
          }
        >
          <ul className="admin-events__ticket-list">
            {tickets.map((ticket) => (
              <li key={ticket.id} className="admin-events__ticket-row">
                <div className="admin-events__ticket-main">
                  <div className="admin-events__ticket-title-row">
                    <p className="admin-events__ticket-name">{ticket.name}</p>
                    {ticket.badge ? (
                      <span
                        className={`admin-events__ticket-badge admin-events__ticket-badge--${ticket.badge.tone}`}
                      >
                        {ticket.badge.label}
                      </span>
                    ) : null}
                  </div>
                  <p className="admin-events__ticket-desc">{ticket.description}</p>
                  <p className="admin-events__ticket-price">€{ticket.price} + Fee</p>
                </div>
                <div className="admin-events__ticket-controls">
                  <input
                    type="number"
                    className="admin-events__qty-input"
                    min={0}
                    value={ticket.qty}
                    aria-label={`${ticket.name} quantity`}
                    onChange={(event) => handleTicketQty(ticket.id, event.target.value)}
                  />
                  <label className="admin-events__toggle">
                    <input
                      type="checkbox"
                      checked={ticket.enabled}
                      onChange={() => handleTicketToggle(ticket.id)}
                    />
                    <span className="admin-events__toggle-track" aria-hidden="true" />
                  </label>
                  <button type="button" className="admin-events__menu-btn" aria-label="Ticket options">
                    <IconDotsVertical size={18} stroke={1.8} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard
          icon={IconSettings}
          step={3}
          title="Additional Settings"
          description="Configure more options for your event"
          headerClassName="admin-events__card-header--compact"
          compactBody
        >
          <div className="admin-events__field">
            <label className="admin-events__label" htmlFor="event-visibility">
              Event Visibility
            </label>
            <label className="admin-events__input-icon-wrap admin-events__input-icon-wrap--block">
              <IconGlobe size={18} stroke={1.7} aria-hidden="true" />
              <select
                id="event-visibility"
                className="admin-events__select admin-events__select--with-icon"
                value={visibility}
                onChange={(event) => setVisibility(event.target.value)}
              >
                {VISIBILITY_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="admin-events__field">
            <label className="admin-events__label" htmlFor="registration-deadline">
              Registration Deadline
            </label>
            <label className="admin-events__input-icon-wrap admin-events__input-icon-wrap--block">
              <IconCalendar size={18} stroke={1.7} aria-hidden="true" />
              <input
                id="registration-deadline"
                type="datetime-local"
                className="admin-events__input admin-events__input--with-icon admin-events__input--hide-native-icon"
                value={registrationDeadline}
                onChange={(event) => setRegistrationDeadline(event.target.value)}
              />
            </label>
          </div>
        </SectionCard>

        <footer className="admin-events__footer">
          {saveMessage ? (
            <p className="admin-events__save-message" role="status">
              {saveMessage}
            </p>
          ) : null}
          <button type="button" className="admin-events__save-btn" onClick={handleSave}>
            <IconDeviceFloppy size={20} stroke={1.8} aria-hidden="true" />
            Save Event
          </button>
          <p className="admin-events__autosave">All changes are saved automatically</p>
        </footer>
      </div>
    </AdminLayout>
  );
}
