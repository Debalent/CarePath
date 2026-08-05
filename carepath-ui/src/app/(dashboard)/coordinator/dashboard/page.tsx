"use client";

import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

type SummaryCard = {
  label: string;
  value: number;
  detail: string;
  href: string;
};

type AttentionItem = {
  id: number;
  patient: string;
  issue: string;
  status: string;
  statusColor: string;
  statusBackground: string;
};

type ScheduledRide = {
  id: number;
  time: string;
  patient: string;
  destination: string;
  driver: string;
  status: string;
  statusColor: string;
  statusBackground: string;
};

type RideRequest = {
  id: number;
  patient: string;
  appointment: string;
  destination: string;
  pickupArea: string;
  accessibility: string;
};

type Driver = {
  id: number;
  name: string;
  area: string;
  vehicle: string;
  status: string;
  statusColor: string;
  statusBackground: string;
};

const summaryCards: SummaryCard[] = [
  {
    label: "Pending Requests",
    value: 8,
    detail: "Waiting for review",
    href: "/coordinator/pooling",
  },
  {
    label: "Unassigned Rides",
    value: 3,
    detail: "Need a driver",
    href: "/coordinator/dispatch",
  },
  {
    label: "Today's Rides",
    value: 12,
    detail: "Scheduled today",
    href: "/coordinator/dispatch",
  },
  {
    label: "Available Drivers",
    value: 6,
    detail: "Ready to accept rides",
    href: "/coordinator/volunteers",
  },
];

const attentionItems: AttentionItem[] = [
  {
    id: 1,
    patient: "Robert T.",
    issue: "Ride begins soon and does not have a driver assigned.",
    status: "Needs Driver",
    statusColor: "#9a3412",
    statusBackground: "#ffedd5",
  },
  {
    id: 2,
    patient: "Linda P.",
    issue: "Patient requires a wheelchair-accessible vehicle.",
    status: "Accessibility",
    statusColor: "#6b21a8",
    statusBackground: "#f3e8ff",
  },
  {
    id: 3,
    patient: "Maria S.",
    issue: "Pickup confirmation has not been received.",
    status: "Confirmation",
    statusColor: "#92400e",
    statusBackground: "#fef3c7",
  },
];

const scheduledRides: ScheduledRide[] = [
  {
    id: 1,
    time: "8:30 AM",
    patient: "Maria S.",
    destination: "Tulsa Dialysis Center",
    driver: "James R.",
    status: "Confirmed",
    statusColor: "#166534",
    statusBackground: "#dcfce7",
  },
  {
    id: 2,
    time: "10:00 AM",
    patient: "Robert T.",
    destination: "St. Francis Cardiology",
    driver: "Unassigned",
    status: "Needs Driver",
    statusColor: "#9a3412",
    statusBackground: "#ffedd5",
  },
  {
    id: 3,
    time: "1:15 PM",
    patient: "Linda P.",
    destination: "Oncology Clinic",
    driver: "Angela M.",
    status: "En Route",
    statusColor: "#5b21b6",
    statusBackground: "#ede9fe",
  },
  {
    id: 4,
    time: "3:00 PM",
    patient: "Samuel D.",
    destination: "Tulsa Family Medicine",
    driver: "Denise K.",
    status: "Assigned",
    statusColor: "#1d4ed8",
    statusBackground: "#dbeafe",
  },
];

const rideRequests: RideRequest[] = [
  {
    id: 1,
    patient: "Janice W.",
    appointment: "Tomorrow at 9:00 AM",
    destination: "Hillcrest Medical Center",
    pickupArea: "North Tulsa",
    accessibility: "Walker assistance",
  },
  {
    id: 2,
    patient: "Eric B.",
    appointment: "Monday at 2:30 PM",
    destination: "Tulsa Cancer Institute",
    pickupArea: "Downtown Tulsa",
    accessibility: "No special accommodations",
  },
  {
    id: 3,
    patient: "Patricia G.",
    appointment: "Tuesday at 11:15 AM",
    destination: "St. John Cardiology",
    pickupArea: "Broken Arrow",
    accessibility: "Wheelchair-accessible vehicle",
  },
];

const drivers: Driver[] = [
  {
    id: 1,
    name: "James R.",
    area: "North Tulsa",
    vehicle: "Sedan",
    status: "Available",
    statusColor: "#166534",
    statusBackground: "#dcfce7",
  },
  {
    id: 2,
    name: "Angela M.",
    area: "Downtown Tulsa",
    vehicle: "Accessible Van",
    status: "On a Ride",
    statusColor: "#5b21b6",
    statusBackground: "#ede9fe",
  },
  {
    id: 3,
    name: "Denise K.",
    area: "Broken Arrow",
    vehicle: "SUV",
    status: "Available",
    statusColor: "#166534",
    statusBackground: "#dcfce7",
  },
];

const cardStyle = {
  background: "#ffffff",
  border: "1px solid #e3d9e8",
  borderRadius: 16,
  boxShadow: "0 8px 24px rgba(85, 64, 161, 0.06)",
};

const sectionHeadingStyle = {
  margin: 0,
  color: "#59436b",
  fontSize: 20,
  fontWeight: 800,
};

const buttonStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 42,
  padding: "10px 16px",
  borderRadius: 10,
  background: "#ae5a8b",
  color: "#ffffff",
  fontSize: 14,
  fontWeight: 800,
  textDecoration: "none",
  boxShadow: "0 4px 12px rgba(174, 90, 139, 0.22)",
};

export default function CoordinatorDashboardPage() {
  return (
    <DashboardLayout
      role="coordinator"
      title="Coordinator Hub"
      subtitle="Manage rides, drivers, patients, and transportation routes"
      userName="Coordinator"
    >
      <div className="cp-space-y-4">
        {/* Welcome section */}
        <section
          className="coordinator-welcome"
          style={{
            padding: 28,
            borderRadius: 16,
            background:
              "linear-gradient(135deg, #71769c 0%, #e6caef 50%, #694f81 100%)",
            color: "#ffffff",
            boxShadow: "0 10px 28px rgba(85, 64, 161, 0.16)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 20,
              flexWrap: "wrap",
            }}
          >
            <div style={{ maxWidth: 650 }}>
              <h2
                style={{
                  margin: 0,
                  fontSize: 26,
                  fontWeight: 900,
                  color: "#ffffff",
                }}
              >
                Welcome to the Coordinator Hub
              </h2>

              <p
                style={{
                  marginTop: 10,
                  marginBottom: 0,
                  lineHeight: 1.7,
                  color: "rgba(255, 255, 255, 0.92)",
                }}
              >
                Review ride requests, assign drivers, organize routes, and help
                patients reach their appointments.
              </p>
            </div>

            <div
              className="coordinator-welcome-buttons"
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              <Link
                href="/coordinator/pooling"
                style={{
                  ...buttonStyle,
                  background: "#ffffff",
                  color: "#694f81",
                }}
              >
                Review Requests
              </Link>

              <Link
                href="/coordinator/dispatch"
                style={{
                  ...buttonStyle,
                  background: "#59436b",
                }}
              >
                Open Dispatch Board
              </Link>
            </div>
          </div>
        </section>

        {/* Summary cards */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 16,
          }}
        >
          {summaryCards.map((card) => (
            <Link
              key={card.label}
              href={card.href}
              style={{
                ...cardStyle,
                display: "block",
                padding: 16,
                color: "inherit",
                textDecoration: "none",
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: "#64748b",
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                {card.label}
              </p>

              <p
                style={{
                  marginTop: 10,
                  marginBottom: 4,
                  color: "#59436b",
                  fontSize: 28,
                  fontWeight: 900,
                }}
              >
                {card.value}
              </p>

              <p
                style={{
                  margin: 0,
                  color: "#8a7893",
                  fontSize: 13,
                }}
              >
                {card.detail}
              </p>
            </Link>
          ))}
        </section>

        {/* Needs attention */}
        <section
          style={{
            ...cardStyle,
            padding: 20,
            background: "#fffaf7",
            border: "1px solid #f2d8c8",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 16,
              flexWrap: "wrap",
              marginBottom: 18,
            }}
          >
            <div>
              <h2 style={sectionHeadingStyle}>Needs Attention</h2>

              <p
                style={{
                  marginTop: 6,
                  marginBottom: 0,
                  color: "#7c6b73",
                  fontSize: 14,
                }}
              >
                Urgent ride and patient transportation issues.
              </p>
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Link href="/coordinator/dispatch" style={buttonStyle}>
                Review All
              </Link>
              <Link href="/coordinator/tracking" style={buttonStyle}>
                View tracking
              </Link>
            </div>
          </div>

          <div style={{ display: "grid", gap: 12 }}>
            {attentionItems.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 16,
                  flexWrap: "wrap",
                  padding: 16,
                  borderRadius: 12,
                  background: "#ffffff",
                  border: "1px solid #f0dfd5",
                }}
              >
                <div>
                  <p
                    style={{
                      margin: 0,
                      color: "#3f3446",
                      fontWeight: 800,
                    }}
                  >
                    {item.patient}
                  </p>

                  <p
                    style={{
                      marginTop: 5,
                      marginBottom: 0,
                      color: "#64748b",
                      fontSize: 14,
                    }}
                  >
                    {item.issue}
                  </p>
                </div>

                <span
                  style={{
                    padding: "7px 11px",
                    borderRadius: 999,
                    color: item.statusColor,
                    background: item.statusBackground,
                    fontSize: 12,
                    fontWeight: 800,
                  }}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Today's schedule */}
        <section style={{ ...cardStyle, padding: 20 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 16,
              flexWrap: "wrap",
              marginBottom: 18,
            }}
          >
            <div>
              <h2 style={sectionHeadingStyle}>Today&apos;s Schedule</h2>

              <p
                style={{
                  marginTop: 6,
                  marginBottom: 0,
                  color: "#64748b",
                  fontSize: 14,
                }}
              >
                Upcoming rides and their current assignment status.
              </p>
            </div>

            <Link href="/coordinator/dispatch" style={buttonStyle}>
              View Dispatch
            </Link>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                minWidth: 720,
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr
                  style={{
                    borderBottom: "1px solid #e8e0ec",
                    textAlign: "left",
                  }}
                >
                  {["Time", "Patient", "Destination", "Driver", "Status"].map(
                    (heading) => (
                      <th
                        key={heading}
                        style={{
                          padding: "12px 10px",
                          color: "#7c6b85",
                          fontSize: 13,
                          fontWeight: 800,
                        }}
                      >
                        {heading}
                      </th>
                    ),
                  )}
                </tr>
              </thead>

              <tbody>
                {scheduledRides.map((ride) => (
                  <tr
                    key={ride.id}
                    style={{
                      borderBottom: "1px solid #f0ebf2",
                    }}
                  >
                    <td
                      style={{
                        padding: "15px 10px",
                        color: "#3f3446",
                        fontWeight: 800,
                      }}
                    >
                      {ride.time}
                    </td>

                    <td
                      style={{
                        padding: "15px 10px",
                        color: "#3f3446",
                      }}
                    >
                      {ride.patient}
                    </td>

                    <td
                      style={{
                        padding: "15px 10px",
                        color: "#64748b",
                      }}
                    >
                      {ride.destination}
                    </td>

                    <td
                      style={{
                        padding: "15px 10px",
                        color:
                          ride.driver === "Unassigned" ? "#b45309" : "#3f3446",
                        fontWeight:
                          ride.driver === "Unassigned" ? 800 : undefined,
                      }}
                    >
                      {ride.driver}
                    </td>

                    <td style={{ padding: "15px 10px" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "7px 11px",
                          borderRadius: 999,
                          color: ride.statusColor,
                          background: ride.statusBackground,
                          fontSize: 12,
                          fontWeight: 800,
                        }}
                      >
                        {ride.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Requests and drivers */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Pending requests */}
          <div style={{ ...cardStyle, padding: 20 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                flexWrap: "wrap",
                marginBottom: 18,
              }}
            >
              <div>
                <h2 style={sectionHeadingStyle}>Pending Ride Requests</h2>

                <p
                  style={{
                    marginTop: 6,
                    marginBottom: 0,
                    color: "#64748b",
                    fontSize: 14,
                  }}
                >
                  New requests waiting for review.
                </p>
              </div>

              <Link
                href="/coordinator/pooling"
                style={{
                  color: "#8a4f78",
                  fontSize: 14,
                  fontWeight: 800,
                  textDecoration: "none",
                }}
              >
                View All
              </Link>
            </div>

            <div style={{ display: "grid", gap: 12 }}>
              {rideRequests.map((request) => (
                <div
                  key={request.id}
                  style={{
                    padding: 16,
                    borderRadius: 12,
                    background: "#faf8fb",
                    border: "1px solid #e8e0ec",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 12,
                      flexWrap: "wrap",
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        color: "#3f3446",
                        fontWeight: 900,
                      }}
                    >
                      {request.patient}
                    </p>

                    <span
                      style={{
                        color: "#8a4f78",
                        fontSize: 13,
                        fontWeight: 800,
                      }}
                    >
                      {request.appointment}
                    </span>
                  </div>

                  <p
                    style={{
                      marginTop: 10,
                      marginBottom: 3,
                      color: "#59436b",
                      fontWeight: 700,
                    }}
                  >
                    {request.destination}
                  </p>

                  <p
                    style={{
                      margin: 0,
                      color: "#64748b",
                      fontSize: 13,
                      lineHeight: 1.6,
                    }}
                  >
                    Pickup: {request.pickupArea}
                    <br />
                    Accessibility: {request.accessibility}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Driver availability */}
          <div style={{ ...cardStyle, padding: 20 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                flexWrap: "wrap",
                marginBottom: 18,
              }}
            >
              <div>
                <h2 style={sectionHeadingStyle}>Driver Availability</h2>

                <p
                  style={{
                    marginTop: 6,
                    marginBottom: 0,
                    color: "#64748b",
                    fontSize: 14,
                  }}
                >
                  Current volunteer driver status.
                </p>
              </div>

              <Link
                href="/coordinator/volunteers"
                style={{
                  color: "#8a4f78",
                  fontSize: 14,
                  fontWeight: 800,
                  textDecoration: "none",
                }}
              >
                Manage Drivers
              </Link>
            </div>

            <div style={{ display: "grid", gap: 12 }}>
              {drivers.map((driver) => (
                <div
                  key={driver.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 16,
                    flexWrap: "wrap",
                    padding: 16,
                    borderRadius: 12,
                    background: "#faf8fb",
                    border: "1px solid #e8e0ec",
                  }}
                >
                  <div>
                    <p
                      style={{
                        margin: 0,
                        color: "#3f3446",
                        fontWeight: 900,
                      }}
                    >
                      {driver.name}
                    </p>

                    <p
                      style={{
                        marginTop: 5,
                        marginBottom: 0,
                        color: "#64748b",
                        fontSize: 13,
                      }}
                    >
                      {driver.area} · {driver.vehicle}
                    </p>
                  </div>

                  <span
                    style={{
                      padding: "7px 11px",
                      borderRadius: 999,
                      color: driver.statusColor,
                      background: driver.statusBackground,
                      fontSize: 12,
                      fontWeight: 800,
                    }}
                  >
                    {driver.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quick actions */}
        <section style={{ ...cardStyle, padding: 20 }}>
          <div style={{ marginBottom: 18 }}>
            <h2 style={sectionHeadingStyle}>Quick Actions</h2>

            <p
              style={{
                marginTop: 6,
                marginBottom: 0,
                color: "#64748b",
                fontSize: 14,
              }}
            >
              Go directly to the coordinator tools you use most.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
              gap: 12,
            }}
          >
            <Link href="/coordinator/pooling" style={buttonStyle}>
              Review Ride Requests
            </Link>

            <Link
              href="/coordinator/dispatch"
              style={{
                ...buttonStyle,
                background: "#694f81",
              }}
            >
              Assign a Driver
            </Link>

            <Link
              href="/coordinator/volunteers"
              style={{
                ...buttonStyle,
                background: "#71769c",
              }}
            >
              Manage Volunteers
            </Link>
          </div>
        </section>

        <style jsx>{`
          @media (max-width: 480px) {
            .coordinator-welcome {
              padding: 16px !important;
            }

            .coordinator-welcome h2 {
              font-size: 20px !important;
              line-height: 1.2 !important;
            }

            .coordinator-welcome p {
              margin-top: 8px !important;
              font-size: 14px !important;
              line-height: 1.45 !important;
            }

            .coordinator-welcome-buttons {
              gap: 8px !important;
            }

            .coordinator-welcome a {
              min-height: 38px !important;
              padding: 8px 12px !important;
              font-size: 13px !important;
            }
          }
        `}</style>
      </div>
    </DashboardLayout>
  );
}