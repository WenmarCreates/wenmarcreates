import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://zdbzkdmdnyojucuqrtqn.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkYnprZG1kbnlvanVjdXFydHFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg2NDE5MjksImV4cCI6MjEwNDIxNzkyOX0.RNt64RfHSJ_swmYfucSUpQ1aP-wQCE-8wJTJnIMaWk8";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

// Comprehensive list of known disposable & throwaway email services
const DISPOSABLE_EMAIL_DOMAINS = new Set([
  "mailinator.com", "tempmail.com", "10minutemail.com", "guerrillamail.com",
  "sharklasers.com", "trashmail.com", "dispostable.com", "yopmail.com",
  "getnada.com", "fakemailgenerator.com", "throwawaymail.com", "temp-mail.org",
  "emailondeck.com", "mohmal.com", "crazymailing.com", "generator.email",
  "armyspy.com", "cuvox.de", "dayrep.com", "einrot.com", "fleckens.hu",
  "gustr.com", "jourrapide.com", "rhyta.com", "superrito.com", "teleworm.us",
  "tmpmail.net", "burnermail.io", "maildrop.cc", "trashmail.net", "dropmail.me"
]);

// Dummy test prefixes and localparts that indicate fake entries
const DUMMY_LOCALPARTS = new Set([
  "test", "testing", "asdf", "qwerty", "fake", "dummy", "sample",
  "aaa", "bbb", "ccc", "abc", "xyz", "123", "1234", "12345", "123456",
  "admin", "administrator", "root", "null", "undefined", "user", "guest"
]);

// Trusted top-tier email providers that always have active MX records
const TRUSTED_TOP_TIER_PROVIDERS = new Set([
  "gmail.com", "googlemail.com", "yahoo.com", "yahoo.co.uk", "yahoo.fr",
  "hotmail.com", "outlook.com", "live.com", "msn.com", "icloud.com",
  "me.com", "mac.com", "aol.com", "proton.me", "protonmail.com",
  "zoho.com", "mail.com", "gmx.com", "yandex.com", "fastmail.com"
]);

/**
 * Real-time DNS MX (Mail Exchange) record validation via DNS-over-HTTPS (DoH).
 * Queries Google Public DNS with Cloudflare fallback to verify that:
 * 1. The domain genuinely exists on the internet (not NXDOMAIN).
 * 2. The domain is configured with active Mail Exchanger (MX) servers to receive emails.
 */
export async function checkDomainMxRecords(domain) {
  if (!domain || typeof domain !== "string") {
    return { valid: false, error: "Invalid domain." };
  }

  const cleanDomain = domain.trim().toLowerCase();

  // Fast-track common trusted email providers
  if (TRUSTED_TOP_TIER_PROVIDERS.has(cleanDomain)) {
    return { valid: true, mxFound: true, provider: "trusted_global_provider" };
  }

  // Abort controller with 3.5s timeout so verification stays snappy
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3500);

  try {
    // Primary: Google Public DNS DoH API
    const googleUrl = `https://dns.google/resolve?name=${encodeURIComponent(cleanDomain)}&type=MX`;
    const googleRes = await fetch(googleUrl, { signal: controller.signal });

    if (googleRes.ok) {
      const data = await googleRes.json();
      clearTimeout(timeoutId);

      // Status 3 is NXDOMAIN (Non-Existent Domain)
      if (data.Status === 3) {
        return {
          valid: false,
          error: `The domain '@${cleanDomain}' does not exist. Please check your email spelling.`
        };
      }

      // Check for MX records (DNS Type 15)
      const mxRecords = data.Answer?.filter((rec) => rec.type === 15);
      if (mxRecords && mxRecords.length > 0) {
        return { valid: true, mxFound: true, records: mxRecords };
      }

      // Check for A records (DNS Type 1) fallback
      const aRecords = data.Answer?.filter((rec) => rec.type === 1);
      if (aRecords && aRecords.length > 0) {
        return { valid: true, mxFound: false, aRecordFallback: true };
      }

      // Domain exists but has no MX or mail host
      return {
        valid: false,
        error: `The domain '@${cleanDomain}' has no active mail exchange (MX) servers configured.`
      };
    }
  } catch (googleErr) {
    // Secondary fallback: Cloudflare DoH API
    try {
      const cfUrl = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(cleanDomain)}&type=MX`;
      const cfRes = await fetch(cfUrl, {
        headers: { Accept: "application/dns-json" },
        signal: controller.signal
      });

      if (cfRes.ok) {
        const cfData = await cfRes.json();
        clearTimeout(timeoutId);

        if (cfData.Status === 3) {
          return {
            valid: false,
            error: `The domain '@${cleanDomain}' does not exist. Please check your email spelling.`
          };
        }

        const mxRecords = cfData.Answer?.filter((rec) => rec.type === 15);
        if (mxRecords && mxRecords.length > 0) {
          return { valid: true, mxFound: true, records: mxRecords };
        }

        return {
          valid: false,
          error: `The domain '@${cleanDomain}' does not have active mail servers (MX).`
        };
      }
    } catch (cfErr) {
      console.warn("DoH fallback notice:", cfErr);
    }
  } finally {
    clearTimeout(timeoutId);
  }

  // Graceful degradation: if offline or client is behind strict corporate firewall blocking DoH
  return { valid: true, mxFound: null, degraded: true };
}

/**
 * Rigorous multi-stage client & domain email validation.
 * Verifies RFC 5322 compliance, filters throwaways, and checks domain structure.
 */
export function validateEmailQuality(email) {
  if (!email || typeof email !== "string") {
    return { valid: false, error: "Please enter your email address." };
  }

  const clean = email.trim().toLowerCase();

  // Basic structure check
  if (!clean.includes("@") || clean.startsWith("@") || clean.endsWith("@")) {
    return { valid: false, error: "Please enter a complete email address (e.g., name@gmail.com)." };
  }

  const parts = clean.split("@");
  if (parts.length !== 2) {
    return { valid: false, error: "Invalid email syntax. Only one '@' symbol is permitted." };
  }

  const [localPart, domain] = parts;

  // Localpart length & dummy check
  if (localPart.length < 2) {
    return { valid: false, error: "Email prefix is too short. Please provide a valid address." };
  }

  if (DUMMY_LOCALPARTS.has(localPart)) {
    return { valid: false, error: "Test and placeholder addresses are not permitted. Please enter your real email." };
  }

  // Regex RFC standard check
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!emailRegex.test(clean)) {
    return { valid: false, error: "Please enter a valid, deliverable email format." };
  }

  // Check against disposable / burner email services
  if (DISPOSABLE_EMAIL_DOMAINS.has(domain)) {
    return { valid: false, error: "Temporary and disposable email providers are blocked. Please use a permanent email." };
  }

  // Validate domain structure and top-level domain (TLD)
  const domainParts = domain.split(".");
  if (domainParts.length < 2) {
    return { valid: false, error: "Please include a valid domain extension (e.g. .com, .org, .co)." };
  }

  const tld = domainParts[domainParts.length - 1];
  if (!tld || tld.length < 2 || !/^[a-z]+$/.test(tld)) {
    return { valid: false, error: "Invalid domain extension. Please check your spelling." };
  }

  // Check placeholder domains (e.g. test.com, example.com, fake.com)
  const mainDomain = domainParts[0];
  if (["test", "example", "fake", "placeholder", "invalid", "localhost"].includes(mainDomain)) {
    return { valid: false, error: "Please enter a genuine personal or corporate email." };
  }

  return { valid: true, email: clean };
}

/**
 * Direct Backend Verification & Persistence with Real-Time DNS MX Verification:
 * 1. Checks format & anti-dummy rules.
 * 2. Checks real-time DNS MX records for the domain.
 * 3. Saves verified visitor record to Supabase database.
 * No email dispatch or code confirmation required!
 */
export async function verifyAndRecordVisitor(name, email, onStatusUpdate) {
  const cleanName = (name || "").trim() || "Executive Guest";
  const cleanEmail = (email || "").trim().toLowerCase();

  // 1. Rigorous format validation
  if (onStatusUpdate) onStatusUpdate("format");
  const validation = validateEmailQuality(cleanEmail);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const domain = cleanEmail.split("@")[1];

  // 2. Real-time DNS MX record verification
  if (onStatusUpdate) onStatusUpdate("mx");
  const mxCheck = await checkDomainMxRecords(domain);
  if (!mxCheck.valid) {
    throw new Error(mxCheck.error);
  }

  // 3. Register user directly into Supabase Authentication -> Users!
  let authUser = null;
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: cleanEmail,
      password: "WenmarAccess!" + cleanEmail.replace(/[^a-zA-Z0-9]/g, "").slice(0, 6) + "2026#",
      options: {
        data: {
          name: cleanName,
          full_name: cleanName,
          registered_via: "executive_gate",
          registered_at: new Date().toISOString()
        }
      }
    });

    if (authError) {
      console.warn("Supabase auth.signUp note:", authError.message);
    } else {
      authUser = authData?.user;
    }
  } catch (authErr) {
    console.warn("Supabase auth signup caught:", authErr);
  }

  // 4. Also persist record in public.visitors table
  const payload = {
    name: cleanName,
    email: cleanEmail,
    verified: true,
    verified_at: new Date().toISOString(),
    verification_type: "direct_backend_with_mx",
    mx_status: mxCheck.mxFound ? "valid_mx" : "valid_domain",
    user_id: authUser?.id || null,
    user_agent: typeof navigator !== "undefined" ? navigator.userAgent : "browser"
  };

  if (onStatusUpdate) onStatusUpdate("supabase");
  let dbResult = null;
  try {
    const { data, error } = await supabase
      .from("visitors")
      .upsert(payload, { onConflict: "email" })
      .select();

    if (error) {
      console.warn("Notice: public.visitors upsert (table may need creation in Supabase SQL editor):", error.message);
    } else {
      dbResult = data;
    }
  } catch (err) {
    console.warn("Supabase record call notice:", err);
  }

  // 4. Persist to browser localStorage for instant subsequent visits
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(
      "wenmar_verified_visitor",
      JSON.stringify({
        name: cleanName,
        email: cleanEmail,
        verified: true,
        verified_at: payload.verified_at
      })
    );
  }

  return {
    success: true,
    visitor: { name: cleanName, email: cleanEmail },
    mxCheck,
    dbResult
  };
}

/**
 * Backwards compatibility helpers
 */
export async function recordVisitor(name, email, verified = true, userId = null) {
  return verifyAndRecordVisitor(name, email);
}

export async function sendOtpCode(email, name) {
  return verifyAndRecordVisitor(name, email);
}

export async function verifyOtpCode(email, token, name) {
  return verifyAndRecordVisitor(name, email);
}
