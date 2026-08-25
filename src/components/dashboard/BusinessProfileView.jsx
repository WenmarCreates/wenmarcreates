import React, { useState, useRef } from "react";
import { useApp } from "../../context/AppContext";
import { Building2, Save, Upload, Camera, Trash2, CheckCircle2, User, Sparkles } from "lucide-react";

export const BusinessProfileView = () => {
  const { businessProfile, updateBusinessProfile, addToast } = useApp();
  const [formData, setFormData] = useState({ ...businessProfile });
  const fileInputRef = useRef(null);

  // Preset avatar options
  const presetAvatars = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80",
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80"
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        addToast("File Too Large", "Please select an image smaller than 5MB.", "error");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, avatarUrl: reader.result }));
        addToast("Profile Image Ready", "Click 'Save Profile Changes' to update your avatar.");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateBusinessProfile(formData);
    addToast("Profile Saved", "User profile image and business details updated successfully.");
  };

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
      
      <form onSubmit={handleSubmit} className="glass-card" style={{ padding: "2.2rem", background: "var(--bg-secondary)" }}>
        
        {/* Header Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "1rem" }}>
          <div>
            <h2 style={{ fontSize: "1.4rem", fontWeight: "800", color: "var(--text-main)" }}>User & Business Profile Settings</h2>
            <p style={{ fontSize: "0.85rem", color: "var(--text-subtle)" }}>
              Manage your user profile picture, business details, operating hours, and AI Knowledge Base configuration.
            </p>
          </div>
          <button type="submit" className="btn-denim" style={{ padding: "0.65rem 1.4rem" }}>
            <Save size={18} /> Save Profile Changes
          </button>
        </div>

        {/* SECTION 0: USER PROFILE AVATAR IMAGE UPLOADER */}
        <div style={{ background: "var(--bg-tertiary)", padding: "1.5rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", marginBottom: "2rem" }}>
          <h3 style={{ fontSize: "1.05rem", fontWeight: "800", marginBottom: "1rem", color: "#573325", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <User size={18} color="var(--accent-primary)" />
            User Profile Picture & Avatar
          </h3>

          <div style={{ display: "flex", alignItems: "center", gap: "2rem", flexWrap: "wrap" }}>
            
            {/* Avatar Preview Box */}
            <div style={{ position: "relative" }}>
              <div 
                style={{ 
                  width: "96px", 
                  height: "96px", 
                  borderRadius: "50%", 
                  background: "var(--gradient-primary)", 
                  color: "#FEFADF", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  fontSize: "1.8rem", 
                  fontWeight: "800", 
                  overflow: "hidden",
                  border: "3px solid #D3A373",
                  boxShadow: "0 6px 16px rgba(87, 51, 37, 0.2)"
                }}
              >
                {formData.avatarUrl ? (
                  <img src={formData.avatarUrl} alt="User Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  formData.name ? formData.name.substring(0, 2).toUpperCase() : "AD"
                )}
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: "#573325",
                  color: "#FEFADF",
                  border: "2px solid #D3A373",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer"
                }}
                title="Change Photo"
              >
                <Camera size={16} />
              </button>
            </div>

            {/* Upload & Preset Options */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: "none" }}
              />

              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-denim"
                  style={{ fontSize: "0.825rem", padding: "0.55rem 1.1rem" }}
                >
                  <Upload size={16} /> Upload Custom Photo
                </button>
                {formData.avatarUrl && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, avatarUrl: null })}
                    className="btn-secondary"
                    style={{ fontSize: "0.825rem", padding: "0.55rem 1.1rem", color: "var(--accent-rose)" }}
                  >
                    <Trash2 size={16} /> Remove Photo
                  </button>
                )}
              </div>

              {/* Sample Preset Avatars */}
              <div>
                <div style={{ fontSize: "0.75rem", fontWeight: "700", color: "var(--text-subtle)", marginBottom: "0.4rem" }}>Or Select Sample Avatar:</div>
                <div style={{ display: "flex", gap: "0.6rem" }}>
                  {presetAvatars.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt={`Preset Avatar ${idx + 1}`}
                      onClick={() => setFormData({ ...formData, avatarUrl: url })}
                      style={{
                        width: "38px",
                        height: "38px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        cursor: "pointer",
                        border: formData.avatarUrl === url ? "3px solid #573325" : "2px solid transparent",
                        boxShadow: formData.avatarUrl === url ? "0 0 8px rgba(87, 51, 37, 0.4)" : "none",
                        transition: "all var(--transition-fast)"
                      }}
                    />
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Section 1: General Business Details */}
        <h3 style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: "1rem", color: "var(--accent-primary)" }}>
          1. General Business Details
        </h3>
        
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Business Name</label>
            <input
              type="text"
              required
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Business Type</label>
            <input
              type="text"
              required
              className="form-input"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Industry</label>
            <input
              type="text"
              required
              className="form-input"
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Website URL</label>
            <input
              type="url"
              required
              className="form-input"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              required
              className="form-input"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Business Email</label>
            <input
              type="email"
              required
              className="form-input"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>

        {/* Section 2: Location & Hours */}
        <h3 style={{ fontSize: "1.1rem", fontWeight: "700", margin: "1.5rem 0 1rem", color: "var(--accent-primary)" }}>
          2. Location & Timezone
        </h3>

        <div className="form-row">
          <div className="form-group" style={{ gridColumn: "span 2" }}>
            <label className="form-label">Street Address</label>
            <input
              type="text"
              className="form-input"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Country</label>
            <input
              type="text"
              className="form-input"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Timezone</label>
            <input
              type="text"
              className="form-input"
              value={formData.timezone}
              onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
            />
          </div>
          <div className="form-group" style={{ gridColumn: "span 2" }}>
            <label className="form-label">Business Operating Hours</label>
            <textarea
              rows="2"
              className="form-textarea"
              value={formData.businessHours}
              onChange={(e) => setFormData({ ...formData, businessHours: e.target.value })}
            ></textarea>
          </div>
        </div>

        {/* Section 3: Offerings & Policies */}
        <h3 style={{ fontSize: "1.1rem", fontWeight: "700", margin: "1.5rem 0 1rem", color: "var(--accent-primary)" }}>
          3. Company Description, Services & Guarantees
        </h3>

        <div className="form-group">
          <label className="form-label">Company Overview Description</label>
          <textarea
            rows="3"
            className="form-textarea"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          ></textarea>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Key Services Provided (comma separated)</label>
            <textarea
              rows="3"
              className="form-textarea"
              value={Array.isArray(formData.services) ? formData.services.join("\n") : formData.services}
              onChange={(e) => setFormData({ ...formData, services: e.target.value.split("\n") })}
            ></textarea>
          </div>
          <div className="form-group">
            <label className="form-label">Special Offers & Promotions</label>
            <textarea
              rows="3"
              className="form-textarea"
              value={Array.isArray(formData.offers) ? formData.offers.join("\n") : formData.offers}
              onChange={(e) => setFormData({ ...formData, offers: e.target.value.split("\n") })}
            ></textarea>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Refund Policies & Terms SLA</label>
          <textarea
            rows="2"
            className="form-textarea"
            value={formData.policies}
            onChange={(e) => setFormData({ ...formData, policies: e.target.value })}
          ></textarea>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "2rem" }}>
          <button type="submit" className="btn-denim" style={{ padding: "0.75rem 2rem" }}>
            <Save size={18} /> Save & Sync Profile Changes
          </button>
        </div>

      </form>

    </div>
  );
};
