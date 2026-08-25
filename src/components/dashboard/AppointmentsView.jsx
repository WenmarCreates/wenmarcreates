import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Calendar as CalendarIcon, Clock, Plus, CheckCircle2, XCircle, User, Mail, Phone, FileText, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Modal } from "../common/Modal";

export const AppointmentsView = () => {
  const { appointments, updateAppointmentStatus, addAppointment, addToast } = useApp();
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(null);
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());

  const [newApt, setNewApt] = useState({
    customer: "",
    email: "",
    phone: "",
    service: "AI Receptionist Demo & Audit",
    date: new Date().toISOString().split("T")[0],
    time: "11:00 AM",
    notes: ""
  });

  // Filter appointments by tab and selected date (if any)
  const filtered = appointments.filter((a) => {
    const matchesTab = a.status === activeTab;
    if (selectedCalendarDate) {
      return matchesTab && a.date === selectedCalendarDate;
    }
    return matchesTab;
  });

  const handleCreate = (e) => {
    e.preventDefault();
    addAppointment(newApt);
    setShowAddModal(false);
    setNewApt({ customer: "", email: "", phone: "", service: "AI Receptionist Demo & Audit", date: new Date().toISOString().split("T")[0], time: "11:00 AM", notes: "" });
  };

  // Calendar Math
  const daysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const totalDays = daysInMonth(currentMonthDate);
  const startOffset = firstDayOfMonth(currentMonthDate);
  const monthName = currentMonthDate.toLocaleString("default", { month: "long", year: "numeric" });

  const prevMonth = () => setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 1));

  const getAppointmentsForDay = (dayNum) => {
    const year = currentMonthDate.getFullYear();
    const month = String(currentMonthDate.getMonth() + 1).padStart(2, "0");
    const day = String(dayNum).padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;
    return appointments.filter(a => a.date === dateStr);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
      
      {/* Header Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2 style={{ fontSize: "1.4rem", fontWeight: "800", color: "var(--text-main)" }}>AI Appointment Booking & Calendar</h2>
          <p style={{ fontSize: "0.85rem", color: "var(--text-subtle)", marginTop: "0.2rem" }}>
            Automated calendar booking slots synced with Google Calendar & Outlook.
          </p>
        </div>

        <button onClick={() => setShowAddModal(true)} className="btn-denim" style={{ fontSize: "0.875rem" }}>
          <Plus size={16} /> Book New Appointment
        </button>
      </div>

      {/* 2-COLUMN LAYOUT: Appointments List (Left) + Visual Month Calendar (Right) */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "1.5rem", alignItems: "start" }}>
        
        {/* LEFT COLUMN: Filter Tabs & Appointments List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          
          {/* Status Filter Tabs */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: "0.5rem", background: "var(--bg-tertiary)", padding: "0.35rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
              {["Upcoming", "Past", "Cancelled"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setSelectedCalendarDate(null);
                  }}
                  style={{
                    padding: "0.5rem 1.25rem",
                    borderRadius: "var(--radius-sm)",
                    background: activeTab === tab ? "#573325" : "transparent",
                    color: activeTab === tab ? "#FEFADF" : "var(--text-muted)",
                    fontSize: "0.85rem",
                    fontWeight: activeTab === tab ? "800" : "600",
                    transition: "all var(--transition-fast)"
                  }}
                >
                  {tab} ({appointments.filter(a => a.status === tab).length})
                </button>
              ))}
            </div>

            {selectedCalendarDate && (
              <button 
                onClick={() => setSelectedCalendarDate(null)}
                style={{ fontSize: "0.78rem", color: "var(--accent-primary)", fontWeight: "700", cursor: "pointer" }}
              >
                Clear Date Filter ({selectedCalendarDate})
              </button>
            )}
          </div>

          {/* Appointments List Grid */}
          {filtered.length === 0 ? (
            <div className="glass-card" style={{ padding: "3rem", textAlign: "center", color: "var(--text-subtle)", background: "var(--bg-secondary)" }}>
              <CalendarIcon size={40} style={{ margin: "0 auto 1rem", opacity: 0.5, color: "var(--accent-primary)" }} />
              <h3 style={{ fontSize: "1.1rem", fontWeight: "800" }}>No {activeTab} Appointments {selectedCalendarDate ? `on ${selectedCalendarDate}` : ""}</h3>
              <p style={{ fontSize: "0.85rem", marginTop: "0.3rem" }}>Appointments booked via Chat Widget or AI Web Voice Call will appear here.</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.25rem" }}>
              {filtered.map((apt) => (
                <div key={apt.id} className="glass-card" style={{ padding: "1.5rem", background: "var(--bg-secondary)", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "1.2rem", border: "1px solid var(--border-color)" }}>
                  
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.85rem" }}>
                      <div>
                        <h4 style={{ fontSize: "1.05rem", fontWeight: "800", color: "var(--text-main)" }}>{apt.customer}</h4>
                        <div style={{ fontSize: "0.8rem", color: "var(--accent-primary)", fontWeight: "700" }}>{apt.service}</div>
                      </div>
                      <span className={`badge ${apt.status === "Upcoming" ? "badge-success" : apt.status === "Past" ? "badge-neutral" : "badge-danger"}`}>
                        {apt.status}
                      </span>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", fontSize: "0.825rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: "600", color: "var(--text-main)" }}>
                        <CalendarIcon size={15} color="var(--accent-primary)" /> {apt.date} at {apt.time}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <Mail size={14} /> {apt.email}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <Phone size={14} /> {apt.phone}
                      </div>
                    </div>

                    {apt.notes && (
                      <div style={{ background: "var(--bg-tertiary)", padding: "0.65rem", borderRadius: "var(--radius-sm)", fontSize: "0.78rem", color: "var(--text-main)", borderLeft: "3px solid var(--accent-primary)" }}>
                        <strong>Notes:</strong> {apt.notes}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  {apt.status === "Upcoming" && (
                    <div style={{ display: "flex", gap: "0.5rem", paddingTop: "0.75rem", borderTop: "1px solid var(--border-color)" }}>
                      <button
                        onClick={() => updateAppointmentStatus(apt.id, "Past")}
                        className="btn-secondary"
                        style={{ flex: 1, justifyContent: "center", fontSize: "0.78rem" }}
                      >
                        <CheckCircle2 size={14} color="var(--accent-emerald)" /> Complete
                      </button>
                      <button
                        onClick={() => updateAppointmentStatus(apt.id, "Cancelled")}
                        style={{ flex: 1, padding: "0.5rem", borderRadius: "var(--radius-sm)", background: "rgba(244, 63, 94, 0.15)", color: "var(--accent-rose)", border: "1px solid rgba(244, 63, 94, 0.3)", fontSize: "0.78rem", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.3rem", cursor: "pointer" }}
                      >
                        <XCircle size={14} /> Cancel
                      </button>
                    </div>
                  )}

                </div>
              ))}
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Interactive Visual Month Calendar */}
        <div className="glass-card" style={{ padding: "1.5rem", background: "var(--bg-secondary)", border: "1px solid var(--border-highlight)", position: "sticky", top: "1rem" }}>
          
          {/* Month Navigator Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "800", color: "var(--text-main)" }}>{monthName}</h3>
            <div style={{ display: "flex", gap: "0.4rem" }}>
              <button onClick={prevMonth} className="btn-secondary" style={{ padding: "0.3rem 0.6rem", fontSize: "0.8rem" }}>‹</button>
              <button onClick={nextMonth} className="btn-secondary" style={{ padding: "0.3rem 0.6rem", fontSize: "0.8rem" }}>›</button>
            </div>
          </div>

          {/* Weekday Names Header */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "0.35rem", textAlign: "center", fontSize: "0.72rem", fontWeight: "800", color: "var(--text-subtle)", marginBottom: "0.5rem" }}>
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>

          {/* Calendar Days Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "0.35rem" }}>
            {Array.from({ length: startOffset }).map((_, i) => (
              <div key={`empty-${i}`} style={{ height: "38px" }}></div>
            ))}

            {Array.from({ length: totalDays }).map((_, i) => {
              const dayNum = i + 1;
              const dayApts = getAppointmentsForDay(dayNum);
              const hasBooking = dayApts.length > 0;
              const year = currentMonthDate.getFullYear();
              const month = String(currentMonthDate.getMonth() + 1).padStart(2, "0");
              const day = String(dayNum).padStart(2, "0");
              const dateStr = `${year}-${month}-${day}`;
              
              const isSelected = selectedCalendarDate === dateStr;
              const isToday = dayNum === new Date().getDate() && currentMonthDate.getMonth() === new Date().getMonth();

              return (
                <button
                  key={dayNum}
                  onClick={() => setSelectedCalendarDate(dateStr)}
                  style={{
                    height: "38px",
                    borderRadius: "var(--radius-sm)",
                    background: isSelected ? "#573325" : isToday ? "rgba(211, 163, 115, 0.35)" : hasBooking ? "var(--bg-tertiary)" : "transparent",
                    color: isSelected ? "#FEFADF" : isToday ? "var(--accent-primary)" : "var(--text-main)",
                    fontWeight: isSelected || isToday || hasBooking ? "800" : "600",
                    fontSize: "0.825rem",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    border: isSelected ? "2px solid #D3A373" : hasBooking ? "1px solid var(--accent-primary)" : "1px solid transparent",
                    cursor: "pointer",
                    position: "relative",
                    transition: "all var(--transition-fast)"
                  }}
                >
                  <span>{dayNum}</span>
                  {hasBooking && (
                    <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: isSelected ? "#D3A373" : "var(--accent-primary)", marginTop: "2px" }}></span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Calendar Sync Footer */}
          <div style={{ marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid var(--border-color)", display: "flex", flexDirection: "column", gap: "0.65rem" }}>
            <div style={{ fontSize: "0.75rem", fontWeight: "800", textTransform: "uppercase", color: "var(--text-subtle)" }}>Calendar Integrations:</div>
            
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.8rem", color: "var(--text-main)" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--accent-emerald)" }}></span>
                Google Calendar
              </span>
              <span className="badge badge-success" style={{ fontSize: "0.68rem" }}>Synced</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.8rem", color: "var(--text-main)" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--accent-emerald)" }}></span>
                Outlook 365
              </span>
              <span className="badge badge-success" style={{ fontSize: "0.68rem" }}>Synced</span>
            </div>

            <div style={{ marginTop: "0.5rem", padding: "0.75rem", borderRadius: "var(--radius-sm)", background: "var(--bg-tertiary)", border: "1px solid var(--border-color)", fontSize: "0.78rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Sparkles size={16} color="var(--accent-primary)" />
              <span>AI Receptionist auto-books open slots.</span>
            </div>
          </div>

        </div>

      </div>

      {/* Add Appointment Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Schedule New Appointment">
        <form onSubmit={handleCreate}>
          <div className="form-group">
            <label className="form-label">Customer Name</label>
            <input
              type="text"
              required
              className="form-input"
              value={newApt.customer}
              onChange={(e) => setNewApt({ ...newApt, customer: e.target.value })}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                required
                className="form-input"
                value={newApt.email}
                onChange={(e) => setNewApt({ ...newApt, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                required
                className="form-input"
                value={newApt.phone}
                onChange={(e) => setNewApt({ ...newApt, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                type="date"
                required
                className="form-input"
                value={newApt.date}
                onChange={(e) => setNewApt({ ...newApt, date: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Time</label>
              <input
                type="text"
                required
                className="form-input"
                value={newApt.time}
                onChange={(e) => setNewApt({ ...newApt, time: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Service Type</label>
            <input
              type="text"
              required
              className="form-input"
              value={newApt.service}
              onChange={(e) => setNewApt({ ...newApt, service: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Appointment Notes</label>
            <textarea
              rows="2"
              className="form-textarea"
              value={newApt.notes}
              onChange={(e) => setNewApt({ ...newApt, notes: e.target.value })}
            ></textarea>
          </div>

          <button type="submit" className="btn-denim" style={{ width: "100%", justifyContent: "center", padding: "0.75rem", marginTop: "1rem" }}>
            Save Appointment to Calendar
          </button>
        </form>
      </Modal>

    </div>
  );
};
