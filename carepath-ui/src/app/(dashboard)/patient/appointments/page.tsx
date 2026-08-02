"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  UserRound,
  X,
} from "lucide-react";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import type {
  EventClickArg,
  EventContentArg,
  EventInput,
} from "@fullcalendar/core";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { demoRides, RideRow, statusVariant, toDisplayDate } from "@/lib/portal";

const DEFAULT_API_BASE =
  process.env.NEXT_PUBLIC_CAREPATH_API_URL ?? "http://localhost:3001/api";

type SelectedCalendarEvent = {
  title: string;
  appointmentType: string;
  appointmentDate: string;
  pickupTime: string;
  clinicName: string;
  clinicLocation: string;
  status: string;
  driverName: string;
  driverPhone: string;
};
function calendarColor(appointmentType: string) {
  const type = appointmentType.toLowerCase()

  if (type.includes('dialysis')) return '#d9c9e8'       // lavender

  if (type.includes('cardio')) return '#c8def4'         // light blue

  if (type.includes('oncology')) return '#f4ccd9'       // blush

  if (type.includes('primary')) return '#cfe9dd'        // mint

  if (type.includes('therapy')) return '#f7dfc2'        // peach

  if (type.includes('radiology')) return '#d8d5f6'      // light violet

  return '#ece1f6'                                      // default
}

function formatCalendarDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
function CalendarEventContent(eventInfo: EventContentArg) {
  const appointmentType =
    eventInfo.event.extendedProps.appointmentType ?? eventInfo.event.title;

  return (
    <div className="carepath-calendar-event">
      <span className="carepath-calendar-event-icon" aria-hidden="true">
        🩺
      </span>

      <div className="carepath-calendar-event-text">
        {eventInfo.timeText && (
          <span className="carepath-calendar-event-time">
            {eventInfo.timeText}
          </span>
        )}

        <span className="carepath-calendar-event-title">{appointmentType}</span>
      </div>
    </div>
  );
}
export default function PatientAppointmentsPage() {
  const [mode, setMode] = useState<"demo" | "live">("demo");
  const [apiBase, setApiBase] = useState(DEFAULT_API_BASE);
  const [token, setToken] = useState("");
  const [rides, setRides] = useState<RideRow[]>(demoRides);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [selectedEvent, setSelectedEvent] =
    useState<SelectedCalendarEvent | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("carepath.patient.token");

    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  useEffect(() => {
    const updateScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 720);
    };

    updateScreenSize();

    window.addEventListener("resize", updateScreenSize);

    return () => {
      window.removeEventListener("resize", updateScreenSize);
    };
  }, []);

  const load = async () => {
    if (mode === "demo") {
      setRides(demoRides);
      setError(null);
      setMsg("Demo data loaded.");
      return;
    }

    if (!token) {
      setError("Patient JWT token required.");
      return;
    }

    setLoading(true);
    setError(null);
    setMsg(null);

    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await fetch(`${apiBase}/patients/rides`, {
        headers,
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Failed to load appointments (${response.status}).`);
      }

      const data = await response.json();

      setRides(data);
      setMsg("Appointments loaded.");
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Failed to load appointments.",
      );
    } finally {
      setLoading(false);
    }
  };

  const upcoming = useMemo(
    () =>
      rides.filter((ride) =>
        ["PENDING", "MATCHED", "CONFIRMED", "IN_PROGRESS"].includes(
          ride.status,
        ),
      ),
    [rides],
  );

  const past = useMemo(
    () =>
      rides.filter((ride) => ["COMPLETED", "CANCELLED"].includes(ride.status)),
    [rides],
  );

  const calendarEvents = useMemo<EventInput[]>(() => {
    return rides.map((ride) => {
      const driverName = ride.driver
        ? `${ride.driver.user.firstName} ${ride.driver.user.lastName}`
        : "Not assigned";

      const driverPhone = ride.driver?.user.phone ?? "";

      return {
        id: ride.id,
       title: ride.appointment.appointmentType,
        start: ride.appointment.appointmentDate,
      backgroundColor: calendarColor(
  ride.appointment.appointmentType
),

borderColor: calendarColor(
  ride.appointment.appointmentType
),
        textColor: '#3f3150',
        extendedProps: {
          appointmentType: ride.appointment.appointmentType,
          appointmentDate: ride.appointment.appointmentDate,
          pickupTime: ride.pickupTime,
          clinicName: ride.appointment.clinicName,
          clinicLocation: `${ride.appointment.clinicCity}, ${ride.appointment.clinicState}`,
          status: ride.status,
          driverName,
          driverPhone,
        },
      };
    });
  }, [rides]);

  const handleEventClick = (clickInfo: EventClickArg) => {
    const details = clickInfo.event.extendedProps;

    setSelectedEvent({
      title: clickInfo.event.title,
      appointmentType: details.appointmentType ?? "Medical appointment",
      appointmentDate:
        details.appointmentDate ?? clickInfo.event.start?.toISOString() ?? "",
      pickupTime: details.pickupTime ?? "",
      clinicName: details.clinicName ?? "",
      clinicLocation: details.clinicLocation ?? "",
      status: details.status ?? "PENDING",
      driverName: details.driverName ?? "Not assigned",
      driverPhone: details.driverPhone ?? "",
    });
  };

  const loadSavedToken = () => {
    const savedToken = localStorage.getItem("carepath.patient.token");

    if (!savedToken) {
      setError("No saved patient token was found.");
      return;
    }

    setToken(savedToken);
    setError(null);
    setMsg("Token loaded.");
  };

  const saveToken = () => {
    localStorage.setItem("carepath.patient.token", token);
    setError(null);
    setMsg("Token saved.");
  };

  return (
    <DashboardLayout
      role="patient"
      title="Appointments"
      subtitle="Upcoming and past medical appointments"
      userName="Patient"
    >
      <div className="cp-space-y-4">
        <section
          style={{
            borderRadius: 16,
            padding: 20,
            background:
              "linear-gradient(135deg, #71769c 0%, #e6caef 50%, #694f81 100%)",
            color: "#ffffff",
          }}
        >
          <p
            style={{
              marginBottom: 6,
              color: "#f8effb",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            Appointment tracker
          </p>

          <h2
            style={{
              margin: 0,
              color: "#ffffff",
              fontSize: 20,
              fontWeight: 800,
              lineHeight: 1.35,
            }}
          >
            Every appointment tied to a confirmed ride reduces missed care.
          </h2>
        </section>

        <Card>
          <div className="cp-space-y-3">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              <Badge variant={mode === "live" ? "success" : "warning"}>
                {mode === "live" ? "Live" : "Demo"}
              </Badge>

              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  setMode("demo");
                  setRides(demoRides);
                  setError(null);
                  setMsg("Demo mode.");
                }}
              >
                Demo
              </Button>

              <Button
                size="sm"
                style={{ background: "#b72898" }}
                onClick={() => {
                  setMode("live");
                  setMsg("Live mode selected. Press Refresh to load data.");
                }}
                disabled={loading}
              >
                Live
              </Button>
            </div>

            <input
              value={apiBase}
              onChange={(event) => setApiBase(event.target.value)}
              placeholder="API base URL"
              className="cp-input"
            />

            <input
              value={token}
              onChange={(event) => setToken(event.target.value)}
              placeholder="Patient JWT token"
              className="cp-input"
            />

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              <Button size="sm" variant="secondary" onClick={loadSavedToken}>
                Load token
              </Button>

              <Button
                size="sm"
                style={{ background: "#b72898" }}
                onClick={saveToken}
              >
                Save token
              </Button>

              <Button
                size="sm"
                variant="secondary"
                onClick={load}
                disabled={loading}
              >
                {loading ? "Loading…" : "Refresh"}
              </Button>
            </div>
          </div>
        </Card>

        {msg && (
          <div className="cp-alert cp-alert-success">
            <CheckCircle2 size={16} />
            {msg}
          </div>
        )}

        {error && (
          <div className="cp-alert cp-alert-error">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <div className="cp-grid-2">
          <StatCard
            label="Upcoming"
            value={upcoming.length}
            icon={CalendarDays}
            color="teal"
          />

          <StatCard
            label="Past appointments"
            value={past.length}
            icon={CheckCircle2}
            color="blue"
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Appointment calendar</CardTitle>
          </CardHeader>

          <p
            style={{
              marginBottom: 18,
              color: "#64748b",
              fontSize: 13,
              lineHeight: 1.6,
            }}
          >
            Select an appointment to see its ride, clinic, and driver details.
          </p>

          <div className="carepath-calendar">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
              initialView={isSmallScreen ? "listMonth" : "dayGridMonth"}
              headerToolbar={
                isSmallScreen
                  ? {
                      left: "prev,next",
                      center: "title",
                      right: "today",
                    }
                  : {
                      left: "prev,next today",
                      center: "title",
                      right: "dayGridMonth,timeGridWeek,listMonth",
                    }
              }
              footerToolbar={
                isSmallScreen
                  ? {
                      left: "",
                      center: "dayGridMonth,timeGridWeek,listMonth",
                      right: "",
                    }
                  : false
              }
              buttonText={{
                today: "Today",
                month: "Month",
                week: "Week",
                list: "List",
              }}
              events={calendarEvents}
              eventContent={CalendarEventContent}
              eventClick={handleEventClick}
              height="auto"
              contentHeight="auto"
              dayMaxEvents={3}
              nowIndicator
              eventDisplay="block"
              eventTimeFormat={{
                hour: "numeric",
                minute: "2-digit",
                meridiem: "short",
              }}
              slotMinTime="06:00:00"
              slotMaxTime="21:00:00"
              allDayText="Appointments"
              noEventsContent="No appointments scheduled."
            />
          </div>
        </Card>
{selectedEvent && (
  <Card>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 16,
      }}
    >
      <div>
        <p
          style={{
            color: "#8b6da0",
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: 4,
          }}
        >
          Upcoming Appointment
        </p>

        <h2
          style={{
            margin: 0,
            fontSize: 24,
            fontWeight: 800,
            color: "#46345d",
          }}
        >
          🩺 {selectedEvent.appointmentType}
        </h2>

        <p
          style={{
            marginTop: 6,
            color: "#64748b",
            fontSize: 15,
          }}
        >
          {selectedEvent.clinicName}
        </p>
      </div>

      <Badge variant={statusVariant(selectedEvent.status)}>
        {selectedEvent.status}
      </Badge>
    </div>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))",
        gap: 16,
        marginTop: 28,
      }}
    >
      <div className="carepath-detail-row">
        <span style={{ fontSize: 22 }}>📅</span>

        <div>
          <strong>Date & Time</strong>

          <span>
            {formatCalendarDate(selectedEvent.appointmentDate)}
          </span>
        </div>
      </div>

      <div className="carepath-detail-row">
        <span style={{ fontSize: 22 }}>🚗</span>

        <div>
          <strong>Pickup</strong>

          <span>
            {selectedEvent.pickupTime
              ? formatCalendarDate(selectedEvent.pickupTime)
              : "Pickup time not assigned"}
          </span>
        </div>
      </div>

      <div className="carepath-detail-row">
        <span style={{ fontSize: 22 }}>📍</span>

        <div>
          <strong>Clinic</strong>

          <span>
            {selectedEvent.clinicName}

            {selectedEvent.clinicLocation &&
              ` • ${selectedEvent.clinicLocation}`}
          </span>
        </div>
      </div>

      <div className="carepath-detail-row">
        <span style={{ fontSize: 22 }}>👤</span>

        <div>
          <strong>Driver</strong>

          <span>
            {selectedEvent.driverName}

            {selectedEvent.driverPhone &&
              ` • ${selectedEvent.driverPhone}`}
          </span>
        </div>
      </div>
    </div>
  </Card>
)}

        {upcoming.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Upcoming appointments</CardTitle>
            </CardHeader>

            <div className="cp-space-y-3">
              {upcoming.map((ride) => (
                <div
                  key={ride.id}
                  style={{
                    padding: 16,
                    border: "1.5px solid #d1a1e2",
                    borderRadius: 12,
                    background: "#f3f0f5",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: 8,
                    }}
                  >
                    <p
                      style={{
                        color: "#0f172a",
                        fontSize: 15,
                        fontWeight: 700,
                      }}
                    >
                      {ride.appointment.clinicName}
                    </p>

                    <Badge variant={statusVariant(ride.status)}>
                      {ride.status}
                    </Badge>
                  </div>

                  <p
                    style={{
                      marginTop: 4,
                      color: "#475569",
                      fontSize: 13,
                    }}
                  >
                    {ride.appointment.appointmentType} ·{" "}
                    {ride.appointment.clinicCity},{" "}
                    {ride.appointment.clinicState}
                  </p>

                  <p
                    style={{
                      marginTop: 6,
                      color: "#694f81",
                      fontSize: 13,
                      fontWeight: 700,
                    }}
                  >
                    Appointment:{" "}
                    {toDisplayDate(ride.appointment.appointmentDate)}
                  </p>

                  <p
                    style={{
                      marginTop: 2,
                      color: "#475569",
                      fontSize: 13,
                    }}
                  >
                    Pickup: {toDisplayDate(ride.pickupTime)}
                  </p>

                  {ride.driver && (
                    <p
                      style={{
                        marginTop: 4,
                        color: "#475569",
                        fontSize: 13,
                      }}
                    >
                      Driver: {ride.driver.user.firstName}{" "}
                      {ride.driver.user.lastName} · {ride.driver.user.phone}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        {past.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Past appointments</CardTitle>
            </CardHeader>

            <div className="cp-space-y-3">
              {past.map((ride) => (
                <div
                  key={ride.id}
                  style={{
                    padding: 16,
                    border: "1.5px solid #e2e8f0",
                    borderRadius: 12,
                    background: "#f8fafc",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: 8,
                    }}
                  >
                    <p
                      style={{
                        color: "#0f172a",
                        fontSize: 15,
                        fontWeight: 700,
                      }}
                    >
                      {ride.appointment.clinicName}
                    </p>

                    <Badge variant={statusVariant(ride.status)}>
                      {ride.status}
                    </Badge>
                  </div>

                  <p
                    style={{
                      marginTop: 4,
                      color: "#64748b",
                      fontSize: 13,
                    }}
                  >
                    {ride.appointment.appointmentType} ·{" "}
                    {toDisplayDate(ride.appointment.appointmentDate)}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {rides.length === 0 && !loading && (
          <Card>
            <div
              style={{
                padding: "18px 8px",
                textAlign: "center",
              }}
            >
              <CalendarDays
                size={34}
                style={{
                  margin: "0 auto 10px",
                  color: "#8b6da0",
                }}
              />

              <p
                style={{
                  color: "#334155",
                  fontWeight: 700,
                }}
              >
                No appointments found
              </p>

              <p
                style={{
                  marginTop: 4,
                  color: "#64748b",
                  fontSize: 13,
                }}
              >
                New appointments and scheduled rides will appear here.
              </p>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
