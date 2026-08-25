import React, { useState, useEffect, useRef } from "react";
import { useApp } from "../../context/AppContext";
import { 
  PhoneCall, Save, Mic, MicOff, PhoneOff, Volume2, Sparkles, Play, 
  CheckCircle2, User, Brain, Clock, Sliders, Headphones, Zap, 
  ShieldAlert, VolumeX, Flame, BookOpen, Layers
} from "lucide-react";

export const AIReceptionistView = () => {
  const { receptionistConfig, setReceptionistConfig, addToast } = useApp();
  const DEFAULT_ELEVENLABS_KEY = "sk_c1b7a5ddb4ebba85c833ed50104e98b8a7172db0e7de9435";

  // Tab State: 'training' | 'callSettings' | 'behavior' | 'voiceAudio'
  const [activeTab, setActiveTab] = useState("training");

  const [config, setConfig] = useState({ 
    ...receptionistConfig, 
    elevenLabsApiKey: receptionistConfig.elevenLabsApiKey || DEFAULT_ELEVENLABS_KEY 
  });

  useEffect(() => {
    setConfig(prev => ({
      ...receptionistConfig,
      elevenLabsApiKey: receptionistConfig.elevenLabsApiKey || prev.elevenLabsApiKey || DEFAULT_ELEVENLABS_KEY
    }));
  }, [receptionistConfig]);

  // Live Web Call Simulator State
  const [isCalling, setIsCalling] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [callTranscript, setCallTranscript] = useState([]);
  const [isPlayingSample, setIsPlayingSample] = useState(false);

  // Pre-fetch browser TTS voice list
  useEffect(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  // Timer interval for call duration
  useEffect(() => {
    let timer;
    if (isCalling) {
      timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(timer);
  }, [isCalling]);

  // Format seconds to mm:ss
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Helper to select Female vs Male system voices in browser fallback
  const getBrowserVoice = (voiceKey) => {
    if (!("speechSynthesis" in window)) return null;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return null;

    const vk = (voiceKey || "").toLowerCase();
    const isFemale = vk.includes("chloe") || vk.includes("victoria") || vk.includes("sophia") || vk.includes("amy");
    const isMale = vk.includes("james") || vk.includes("oliver") || vk.includes("joey");

    if (isFemale) {
      const naturalFemale = voices.find(v => 
        /natural|online|google/i.test(v.name) && /jenny|aria|samantha|zira|victoria|hazel|female|woman/i.test(v.name) && v.lang.startsWith("en")
      ) || voices.find(v => 
        /jenny|aria|samantha|karen|victoria|hazel|zira|eva|fiona|catherine|helena|female|woman/i.test(v.name) && v.lang.startsWith("en")
      );
      if (naturalFemale) return naturalFemale;
    }

    if (isMale) {
      const naturalMale = voices.find(v => 
        /natural|online|google/i.test(v.name) && /guy|david|mark|george|daniel|alex|james|male|man/i.test(v.name) && v.lang.startsWith("en")
      ) || voices.find(v => 
        /guy|david|mark|george|daniel|alex|richard|james|male|man/i.test(v.name) && v.lang.startsWith("en")
      );
      if (naturalMale) return naturalMale;
    }

    const englishVoice = voices.find(v => /natural|online|google/i.test(v.name) && v.lang.startsWith("en")) || voices.find(v => v.lang.startsWith("en"));
    return englishVoice || voices[0];
  };

  // Web Audio Synthesizer for Ambient Background Environments
  const ambientAudioCtxRef = useRef(null);
  const ambientSourceRef = useRef(null);

  const stopAmbientSound = () => {
    if (ambientSourceRef.current) {
      try { ambientSourceRef.current.stop(); } catch (e) {}
      ambientSourceRef.current = null;
    }
    if (ambientAudioCtxRef.current) {
      try { ambientAudioCtxRef.current.close(); } catch (e) {}
      ambientAudioCtxRef.current = null;
    }
  };

  const startAmbientSound = () => {
    stopAmbientSound();

    const env = config.backgroundSound;
    if (!env || env === "none") return;

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      if (ctx.state === "suspended") {
        ctx.resume();
      }
      ambientAudioCtxRef.current = ctx;

      // 2 seconds loop of ambient sound
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);

      // Generate soundscape buffers
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        if (env === "coffee_shop") {
          output[i] = (white * 0.45) + Math.sin(i * 0.008) * 0.12;
        } else if (env === "static_noise") {
          output[i] = white * 0.4;
        } else if (env === "summer_outdoor" || env === "mountain_outdoor") {
          output[i] = (white * 0.3) + Math.sin(i * 0.002) * 0.15;
        } else if (env === "convention_hall" || env === "call_center") {
          output[i] = (white * 0.4) + Math.cos(i * 0.004) * 0.1;
        } else {
          output[i] = white * 0.35;
        }
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;
      noiseSource.loop = true;

      // Filter to shape ambient spectrum
      const filter = ctx.createBiquadFilter();
      if (env === "coffee_shop") {
        filter.type = "lowpass";
        filter.frequency.value = 850;
      } else if (env === "static_noise") {
        filter.type = "bandpass";
        filter.frequency.value = 1800;
      } else if (env === "summer_outdoor") {
        filter.type = "highpass";
        filter.frequency.value = 1000;
      } else if (env === "mountain_outdoor") {
        filter.type = "lowpass";
        filter.frequency.value = 450;
      } else if (env === "call_center" || env === "convention_hall") {
        filter.type = "bandpass";
        filter.frequency.value = 1200;
      } else {
        filter.type = "lowpass";
        filter.frequency.value = 1000;
      }

      const gainNode = ctx.createGain();
      const volPercent = (config.ambientVolume ?? 30) / 100;
      gainNode.gain.value = Math.max(0.02, Math.min(volPercent * 0.3, 0.35));

      noiseSource.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      noiseSource.start(0);
      ambientSourceRef.current = noiseSource;
    } catch (err) {
      console.warn("Ambient Web Audio synthesis error:", err);
    }
  };

  const handleStopSpeech = () => {
    setIsPlayingSample(false);
    stopAmbientSound();
  };

  // Helper for natural browser speech fallback
  const speakNativeSpeech = (cleanText, voiceKey) => {
    if (!("speechSynthesis" in window)) {
      handleStopSpeech();
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      const matchedVoice = getBrowserVoice(voiceKey);
      if (matchedVoice) utterance.voice = matchedVoice;
      
      utterance.pitch = 1.0; 
      utterance.rate = Math.max(0.7, Math.min(1.3, parseFloat(config.voiceSpeed) || 0.95));

      utterance.onend = handleStopSpeech;
      utterance.onerror = handleStopSpeech;
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn("Native speech error:", err);
      handleStopSpeech();
    }
  };

  // Audio Speech Synthesis Engine (Supports direct ElevenLabs Free API Key)
  const currentAudioRef = useRef(null);

  const speakText = async (text, voiceKey = config.voice) => {
    if (currentAudioRef.current) {
      try {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      } catch (e) {}
    }
    if ("speechSynthesis" in window) {
      try { window.speechSynthesis.cancel(); } catch (e) {}
    }

    const cleanText = text.replace(/\[.*?\]/g, "").trim();
    if (!cleanText) return;

    setIsPlayingSample(true);
    startAmbientSound();

    const apiKey = (config.elevenLabsApiKey && config.elevenLabsApiKey.trim()) || DEFAULT_ELEVENLABS_KEY;

    // Direct ElevenLabs API Call
    if (apiKey && apiKey.length > 5) {
      let voiceId = "21m00Tcm4TlvDq8ikWAM"; 
      const vk = (voiceKey || "").toLowerCase();
      
      if (vk.includes("chloe")) voiceId = "21m00Tcm4TlvDq8ikWAM";       // Rachel
      else if (vk.includes("victoria")) voiceId = "EXAVITQu4vr4xnSDxMaL"; // Bella
      else if (vk.includes("sophia")) voiceId = "cgSgspJ2msm6clMCkdW9";   // Jessica
      else if (vk.includes("amy")) voiceId = "MF3mGyEYCl7XYWbV9V6O";      // Elli
      else if (vk.includes("james")) voiceId = "ErXwobaYiN019PkySvjV";    // Antoni
      else if (vk.includes("oliver")) voiceId = "TxGEqnHWrfWFTfGW9XjX";   // Josh
      else if (vk.includes("joey")) voiceId = "pNInz6obpgDQGcFmaJgB";     // Adam

      try {
        const stabilityVal = parseFloat(config.voiceStability) || 0.5;
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "xi-api-key": apiKey
          },
          body: JSON.stringify({
            text: cleanText,
            model_id: "eleven_monolingual_v1",
            voice_settings: { 
              stability: stabilityVal, 
              similarity_boost: 0.8, 
              style: 0.2, 
              use_speaker_boost: true 
            }
          })
        });

        if (response.ok) {
          const blob = await response.blob();
          const audioUrl = URL.createObjectURL(blob);
          const audio = new Audio(audioUrl);
          audio.playbackRate = Math.max(0.7, Math.min(1.3, parseFloat(config.voiceSpeed) || 1.0));
          currentAudioRef.current = audio;
          audio.onended = handleStopSpeech;
          audio.onerror = handleStopSpeech;
          audio.play().catch(() => speakNativeSpeech(cleanText, voiceKey));
          return;
        }
      } catch (err) {
        console.warn("ElevenLabs direct API call fallback:", err);
      }
    }

    // Default Stream HD Neural Audio fallback
    let providerVoice = "Joanna";
    const vk = (voiceKey || "").toLowerCase();

    if (vk.includes("victoria")) providerVoice = "Emma";
    else if (vk.includes("sophia")) providerVoice = "Nicole";
    else if (vk.includes("amy")) providerVoice = "Ivy";
    else if (vk.includes("james")) providerVoice = "Brian";
    else if (vk.includes("oliver")) providerVoice = "Russell";
    else if (vk.includes("joey")) providerVoice = "Joey";
    else providerVoice = "Joanna";

    const streamUrl = `https://api.streamelements.com/kappa/v2/speech?voice=${providerVoice}&text=${encodeURIComponent(cleanText)}`;
    const audio = new Audio(streamUrl);
    audio.playbackRate = Math.max(0.7, Math.min(1.3, parseFloat(config.voiceSpeed) || 1.0));
    currentAudioRef.current = audio;

    audio.onended = handleStopSpeech;
    audio.onerror = () => {
      speakNativeSpeech(cleanText, voiceKey);
    };

    audio.play().catch(() => {
      speakNativeSpeech(cleanText, voiceKey);
    });
  };

  const playVoiceSample = () => {
    const greetingScript = (config.greeting && config.greeting.trim()) 
      ? config.greeting 
      : `Thank you for calling Apex Digital Solutions! I am ${config.receptionistName}. How can I assist your business today?`;
    
    speakText(greetingScript, config.voice);
    addToast("Playing Greeting Sample", `Speaking your Live Web Voice Greeting Script out loud.`, "info");
  };

  const handleSave = (e) => {
    e.preventDefault();
    setReceptionistConfig(config);
    addToast("AI Receptionist Config Saved", "Voice training, call settings, and audio FX rules updated successfully!");
  };

  const startSimulatedCall = () => {
    setIsCalling(true);
    setCallDuration(0);
    setCallTranscript([
      { sender: "ai", text: `[Voice AI] ${config.greeting}`, time: "00:01" }
    ]);
    
    const pauseTime = (parseFloat(config.waitBeforeSpeaking) || 1.0) * 1000;
    setTimeout(() => {
      speakText(config.greeting);
    }, pauseTime);

    addToast("Call Connected", "Live web voice session active. Listen to AI speech output.", "info");

    setTimeout(() => {
      setCallTranscript((prev) => [
        ...prev,
        { sender: "user", text: "Hi! I'm calling to inquire about booking an AI automation consultation.", time: "00:08" }
      ]);
    }, 3500);

    setTimeout(() => {
      const responseText = `I'd be glad to help! Based on your objectives (${config.goals || "qualifying leads and booking appointments"}), I can reserve a 30-minute slot for you tomorrow at 10:30 AM CST. Does that work?`;
      setCallTranscript((prev) => [
        ...prev,
        { sender: "ai", text: `[Voice AI] ${responseText}`, time: "00:15" }
      ]);
      speakText(responseText);
    }, 6500);
  };

  const endSimulatedCall = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
    }
    stopAmbientSound();
    setIsCalling(false);
    addToast("Call Ended", "Simulated web voice session concluded.", "info");
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "2rem" }}>
      
      {/* Left Form Configuration Container */}
      <form onSubmit={handleSave} className="glass-card" style={{ padding: "2rem", background: "var(--bg-secondary)" }}>
        
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "1rem" }}>
          <div>
            <h2 style={{ fontSize: "1.35rem", fontWeight: "800", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Brain size={22} color="var(--accent-primary)" /> AI Voice Agent Studio
            </h2>
            <p style={{ fontSize: "0.85rem", color: "var(--text-subtle)", marginTop: "2px" }}>
              Train AI persona, call thresholds, agent behavior, and advanced audio FX
            </p>
          </div>
          <span className="badge badge-success" style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
            <Zap size={12} /> WebRTC Neural Engine
          </span>
        </div>

        {/* Sub-Navigation Tabs */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.75rem", overflowX: "auto" }}>
          <button
            type="button"
            onClick={() => setActiveTab("training")}
            style={{
              padding: "0.5rem 0.85rem",
              borderRadius: "var(--radius-sm)",
              fontSize: "0.82rem",
              fontWeight: "600",
              cursor: "pointer",
              border: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              background: activeTab === "training" ? "var(--gradient-primary)" : "var(--bg-tertiary)",
              color: activeTab === "training" ? "#ffffff" : "var(--text-subtle)",
              transition: "all 0.2s ease"
            }}
          >
            <Brain size={15} /> Training & Persona
          </button>
          
          <button
            type="button"
            onClick={() => setActiveTab("callSettings")}
            style={{
              padding: "0.5rem 0.85rem",
              borderRadius: "var(--radius-sm)",
              fontSize: "0.82rem",
              fontWeight: "600",
              cursor: "pointer",
              border: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              background: activeTab === "callSettings" ? "var(--gradient-primary)" : "var(--bg-tertiary)",
              color: activeTab === "callSettings" ? "#ffffff" : "var(--text-subtle)",
              transition: "all 0.2s ease"
            }}
          >
            <Clock size={15} /> Call Settings
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("behavior")}
            style={{
              padding: "0.5rem 0.85rem",
              borderRadius: "var(--radius-sm)",
              fontSize: "0.82rem",
              fontWeight: "600",
              cursor: "pointer",
              border: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              background: activeTab === "behavior" ? "var(--gradient-primary)" : "var(--bg-tertiary)",
              color: activeTab === "behavior" ? "#ffffff" : "var(--text-subtle)",
              transition: "all 0.2s ease"
            }}
          >
            <Sliders size={15} /> Behavior Tuning
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("voiceAudio")}
            style={{
              padding: "0.5rem 0.85rem",
              borderRadius: "var(--radius-sm)",
              fontSize: "0.82rem",
              fontWeight: "600",
              cursor: "pointer",
              border: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              background: activeTab === "voiceAudio" ? "var(--gradient-primary)" : "var(--bg-tertiary)",
              color: activeTab === "voiceAudio" ? "#ffffff" : "var(--text-subtle)",
              transition: "all 0.2s ease"
            }}
          >
            <Headphones size={15} /> Voice & Audio FX
          </button>
        </div>

        {/* TAB 1: AI TRAINING & PERSONALITY */}
        {activeTab === "training" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div className="form-group">
              <label className="form-label">Voice Assistant Name</label>
              <input
                type="text"
                required
                className="form-input"
                value={config.receptionistName || ""}
                onChange={(e) => setConfig({ ...config, receptionistName: e.target.value })}
              />
            </div>

            <div className="form-group">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                <label className="form-label" style={{ marginBottom: 0 }}>Live Web Voice Greeting Script</label>
                <button
                  type="button"
                  onClick={playVoiceSample}
                  className="btn-secondary"
                  style={{ fontSize: "0.75rem", padding: "0.2rem 0.6rem", display: "inline-flex", alignItems: "center", gap: "0.3rem", color: "var(--text-main)", background: "var(--bg-tertiary)" }}
                >
                  <Volume2 size={14} color="var(--accent-primary)" /> {isPlayingSample ? "Playing..." : "Play Sample"}
                </button>
              </div>
              <textarea
                rows="3"
                required
                className="form-textarea"
                value={config.greeting || ""}
                onChange={(e) => setConfig({ ...config, greeting: e.target.value })}
              ></textarea>
            </div>

            <div className="form-group">
              <label className="form-label">AI Voice Personality & Tone</label>
              <select
                className="form-select"
                value={config.personality || "Warm, Empathetic & Executive Professional"}
                onChange={(e) => setConfig({ ...config, personality: e.target.value })}
              >
                <option value="Warm, Empathetic & Executive Professional">Warm, Empathetic & Executive Professional</option>
                <option value="Energetic, Persuasive Sales Representative">Energetic, Persuasive Sales Representative</option>
                <option value="Calm, Analytical Technical Support Specialist">Calm, Analytical Technical Support Specialist</option>
                <option value="Friendly, Upbeat Customer Concierge">Friendly, Upbeat Customer Concierge</option>
                <option value="Direct, Formal Enterprise Receptionist">Direct, Formal Enterprise Receptionist</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Primary Agent Goals & Objectives</label>
              <textarea
                rows="2"
                placeholder="e.g. Qualify incoming leads, book consultation appointments on Google Calendar, resolve pricing inquiries."
                className="form-textarea"
                value={config.goals || ""}
                onChange={(e) => setConfig({ ...config, goals: e.target.value })}
              ></textarea>
            </div>

            <div className="form-group">
              <label className="form-label">Additional Business Context & Training Instructions</label>
              <textarea
                rows="3"
                placeholder="e.g. Apex Digital Solutions specializes in AI automation. Always mention our 30-day money back SLA."
                className="form-textarea"
                value={config.additionalInfo || ""}
                onChange={(e) => setConfig({ ...config, additionalInfo: e.target.value })}
              ></textarea>
            </div>

            <div className="form-group" style={{ background: "var(--bg-tertiary)", padding: "1rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: "700", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <BookOpen size={16} color="var(--accent-primary)" /> Knowledge Base Sync
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-subtle)", marginTop: "2px" }}>
                    Allow AI Voice Agent to answer questions directly from your company Knowledge Base
                  </div>
                </div>
                <label className="switch" style={{ position: "relative", display: "inline-block", width: "44px", height: "24px" }}>
                  <input
                    type="checkbox"
                    checked={config.useKnowledgeBase ?? true}
                    onChange={(e) => setConfig({ ...config, useKnowledgeBase: e.target.checked })}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span style={{
                    position: "absolute", cursor: "pointer", top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: config.useKnowledgeBase ? "var(--accent-primary)" : "#334155",
                    borderRadius: "24px", transition: "0.3s"
                  }}></span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CALL & SILENCE SETTINGS */}
        {activeTab === "callSettings" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Operating Timezone</label>
                <select
                  className="form-select"
                  value={config.timezone || "America/Chicago (CST)"}
                  onChange={(e) => setConfig({ ...config, timezone: e.target.value })}
                >
                  <option value="America/New_York (EST)">America/New_York (EST)</option>
                  <option value="America/Chicago (CST)">America/Chicago (CST)</option>
                  <option value="America/Denver (MST)">America/Denver (MST)</option>
                  <option value="America/Los_Angeles (PST)">America/Los_Angeles (PST)</option>
                  <option value="Europe/London (GMT)">Europe/London (GMT)</option>
                  <option value="Europe/Paris (CET)">Europe/Paris (CET)</option>
                  <option value="Asia/Tokyo (JST)">Asia/Tokyo (JST)</option>
                  <option value="Australia/Sydney (AEST)">Australia/Sydney (AEST)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Maximum Call Duration</label>
                <select
                  className="form-select"
                  value={config.maxCallTime || "10"}
                  onChange={(e) => setConfig({ ...config, maxCallTime: e.target.value })}
                >
                  <option value="3">3 Minutes</option>
                  <option value="5">5 Minutes</option>
                  <option value="10">10 Minutes</option>
                  <option value="15">15 Minutes</option>
                  <option value="30">30 Minutes</option>
                  <option value="unlimited">Unlimited</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Idle Time Timeout</label>
                <select
                  className="form-select"
                  value={config.idleTime || "30"}
                  onChange={(e) => setConfig({ ...config, idleTime: e.target.value })}
                >
                  <option value="15">15 Seconds</option>
                  <option value="30">30 Seconds</option>
                  <option value="45">45 Seconds</option>
                  <option value="60">60 Seconds</option>
                </select>
                <p style={{ fontSize: "0.72rem", color: "var(--text-subtle)", marginTop: "2px" }}>
                  Triggers reminder prompt if caller is inactive.
                </p>
              </div>

              <div className="form-group">
                <label className="form-label">Reminder Frequency</label>
                <select
                  className="form-select"
                  value={config.reminderFrequency || "Every 30s"}
                  onChange={(e) => setConfig({ ...config, reminderFrequency: e.target.value })}
                >
                  <option value="Every 15s">Every 15 Seconds</option>
                  <option value="Every 30s">Every 30 Seconds</option>
                  <option value="Every 60s">Every 60 Seconds</option>
                  <option value="Disabled">Disabled</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Wait Before Speaking (Pause Delay)</label>
              <select
                className="form-select"
                value={config.waitBeforeSpeaking || "1.0"}
                onChange={(e) => setConfig({ ...config, waitBeforeSpeaking: e.target.value })}
              >
                <option value="0.5">0.5 Seconds (Instant)</option>
                <option value="1.0">1.0 Second (Natural Pause)</option>
                <option value="1.5">1.5 Seconds (Calm Entry)</option>
                <option value="2.0">2.0 Seconds (Deliberate)</option>
              </select>
              <p style={{ fontSize: "0.72rem", color: "var(--text-subtle)", marginTop: "2px" }}>
                Pause before the assistant starts speaking at the beginning of a call.
              </p>
            </div>

            <div className="form-group" style={{ background: "var(--bg-tertiary)", padding: "1rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
              <label className="form-label" style={{ fontWeight: "700" }}>End Call Before Speaking (Silence Auto-Hangup)</label>
              <select
                className="form-select"
                value={config.endCallSilenceDuration || "45"}
                onChange={(e) => setConfig({ ...config, endCallSilenceDuration: e.target.value })}
              >
                <option value="Disabled">Disabled (Never auto-hangup)</option>
                <option value="15">After 15 Seconds of User Silence</option>
                <option value="30">After 30 Seconds of User Silence</option>
                <option value="45">After 45 Seconds of User Silence</option>
                <option value="60">After 60 Seconds of User Silence</option>
              </select>
              <p style={{ fontSize: "0.75rem", color: "var(--text-subtle)", marginTop: "0.4rem" }}>
                Automatically ends the call if the user has been completely silent for the specified duration.
              </p>
            </div>

          </div>
        )}

        {/* TAB 3: AGENT BEHAVIOR TUNING */}
        {activeTab === "behavior" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            
            <div className="form-group">
              <label className="form-label">Response Speed (Latency Tuning)</label>
              <select
                className="form-select"
                value={config.responseSpeed || "1.0"}
                onChange={(e) => setConfig({ ...config, responseSpeed: e.target.value })}
              >
                <option value="0.5">0.5 Seconds (Hyper-fast / Rapid Response)</option>
                <option value="1.0">1.0 Second (Natural Conversational Speed)</option>
                <option value="1.5">1.5 Seconds (Thoughtful / Relaxed)</option>
                <option value="2.0">2.0 Seconds (Formal Executive Pace)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Interruption Sensitivity</label>
              <select
                className="form-select"
                value={config.interruptionSensitivity || "Medium"}
                onChange={(e) => setConfig({ ...config, interruptionSensitivity: e.target.value })}
              >
                <option value="Low">Low (AI finishes speaking before yielding)</option>
                <option value="Medium">Medium (Balanced user barge-in detection)</option>
                <option value="High">High (AI stops speaking immediately if caller speaks)</option>
              </select>
            </div>

            <div className="form-group" style={{ background: "var(--bg-tertiary)", padding: "1.25rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <label className="form-label" style={{ marginBottom: 0, fontWeight: "700" }}>
                  LLM Temperature (Creativity & Flexibility)
                </label>
                <span className="badge badge-primary" style={{ fontFamily: "monospace", fontSize: "0.85rem" }}>
                  {config.llmTemperature ?? 0.7}
                </span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={config.llmTemperature ?? 0.7}
                onChange={(e) => setConfig({ ...config, llmTemperature: parseFloat(e.target.value) })}
                style={{ width: "100%", accentColor: "var(--accent-primary)", cursor: "pointer", margin: "0.75rem 0" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--text-subtle)" }}>
                <span>0.0 (Strict / Factual / Scripted)</span>
                <span>0.5 (Balanced)</span>
                <span>1.0 (Creative / Conversational)</span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Calendar Booking & Escalation Rules</label>
              <textarea
                rows="2"
                className="form-textarea"
                value={config.appointmentRules || ""}
                onChange={(e) => setConfig({ ...config, appointmentRules: e.target.value })}
              ></textarea>
            </div>
          </div>
        )}

        {/* TAB 4: VOICE & AUDIO FX ENGINE */}
        {activeTab === "voiceAudio" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            
            <div className="form-group">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                <label className="form-label" style={{ marginBottom: 0 }}>Voice Engine & Preset</label>
                <button
                  type="button"
                  onClick={playVoiceSample}
                  className="btn-secondary"
                  style={{ fontSize: "0.75rem", padding: "0.2rem 0.6rem", display: "inline-flex", alignItems: "center", gap: "0.3rem", color: "var(--text-main)", background: "var(--bg-tertiary)" }}
                >
                  <Volume2 size={14} color="var(--accent-primary)" /> {isPlayingSample ? "Playing..." : "Play Sample"}
                </button>
              </div>
              <select
                className="form-select"
                value={config.voice || "elevenlabs-chloe"}
                onChange={(e) => {
                  const newVoice = e.target.value;
                  setConfig({ ...config, voice: newVoice });
                  const voiceName = e.target.options[e.target.selectedIndex].text.split("•")[1] || newVoice;
                  speakText(`Hello! Switched voice preset to ${voiceName}.`, newVoice);
                }}
              >
                <option value="elevenlabs-chloe">ElevenLabs • Chloe (US Executive Female)</option>
                <option value="elevenlabs-victoria">ElevenLabs • Victoria (UK British Female Accent)</option>
                <option value="elevenlabs-sophia">ElevenLabs • Sophia (Australian Female Accent)</option>
                <option value="elevenlabs-amy">ElevenLabs • Amy (Young Energetic US Female)</option>
                <option value="elevenlabs-james">ElevenLabs • James (Executive UK Male Accent)</option>
                <option value="elevenlabs-oliver">ElevenLabs • Oliver (Friendly AU Male Accent)</option>
                <option value="elevenlabs-joey">ElevenLabs • Joey (US Business Male)</option>
                <option value="custom-elevenlabs">Custom ElevenLabs Voice ID</option>
              </select>
            </div>

            <div className="form-group" style={{ background: "var(--bg-tertiary)", padding: "1rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <label className="form-label" style={{ marginBottom: 0, fontWeight: "700" }}>ElevenLabs API Key (BYOK)</label>
                <span className="badge badge-success">Free Tier Supported</span>
              </div>
              <input
                type="password"
                className="form-input"
                placeholder="Paste your ElevenLabs xi-api-key here (e.g. sk_...)"
                value={config.elevenLabsApiKey || ""}
                onChange={(e) => setConfig({ ...config, elevenLabsApiKey: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Noise Cancellation Mode</label>
              <select
                className="form-select"
                value={config.noiseCancellationMode || "remove_noise"}
                onChange={(e) => setConfig({ ...config, noiseCancellationMode: e.target.value })}
              >
                <option value="do_not_remove">Do not remove noise (Raw mic audio pass-through)</option>
                <option value="remove_noise">Remove noise (Standard AI noise suppression)</option>
                <option value="remove_noise_speech">Remove noise + background speech (Isolation Mode)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Ambient Background Sound Environment</label>
              <select
                className="form-select"
                value={config.backgroundSound || "coffee_shop"}
                onChange={(e) => setConfig({ ...config, backgroundSound: e.target.value })}
              >
                <option value="none">None (Clean studio environment)</option>
                <option value="coffee_shop">Coffee shop (Subtle ambient murmur)</option>
                <option value="convention_hall">Convention hall (Wide acoustic space)</option>
                <option value="summer_outdoor">Summer outdoor (Nature & breeze soundscape)</option>
                <option value="mountain_outdoor">Mountain outdoor (Open air atmosphere)</option>
                <option value="static_noise">Static noise (Classic telephone line feel)</option>
                <option value="call_center">Call center (Professional office background)</option>
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
                  <label className="form-label" style={{ marginBottom: 0 }}>Ambient Sound Volume</label>
                  <span style={{ fontSize: "0.8rem", fontWeight: "700", color: "var(--accent-primary)" }}>
                    {config.ambientVolume ?? 30}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={config.ambientVolume ?? 30}
                  onChange={(e) => setConfig({ ...config, ambientVolume: parseInt(e.target.value) })}
                  style={{ width: "100%", accentColor: "var(--accent-primary)", cursor: "pointer" }}
                />
              </div>

              <div className="form-group">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
                  <label className="form-label" style={{ marginBottom: 0 }}>Voice Speed / Rate</label>
                  <span style={{ fontSize: "0.8rem", fontWeight: "700", color: "var(--accent-primary)" }}>
                    {config.voiceSpeed ?? 1.0}x
                  </span>
                </div>
                <input
                  type="range"
                  min="0.7"
                  max="1.3"
                  step="0.05"
                  value={config.voiceSpeed ?? 1.0}
                  onChange={(e) => setConfig({ ...config, voiceSpeed: parseFloat(e.target.value) })}
                  style={{ width: "100%", accentColor: "var(--accent-primary)", cursor: "pointer" }}
                />
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
                <label className="form-label" style={{ marginBottom: 0 }}>ElevenLabs Voice Stability</label>
                <span style={{ fontSize: "0.8rem", fontWeight: "700", color: "var(--accent-primary)" }}>
                  {Math.round((config.voiceStability ?? 0.5) * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={config.voiceStability ?? 0.5}
                onChange={(e) => setConfig({ ...config, voiceStability: parseFloat(e.target.value) })}
                style={{ width: "100%", accentColor: "var(--accent-primary)", cursor: "pointer" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "var(--text-subtle)", marginTop: "2px" }}>
                <span>0% (More expressive / dynamic)</span>
                <span>50% (Recommended)</span>
                <span>100% (More consistent / monotonous)</span>
              </div>
            </div>

          </div>
        )}

        <button type="submit" className="gradient-btn" style={{ width: "100%", justifyContent: "center", padding: "0.75rem", marginTop: "1.5rem" }}>
          <Save size={18} /> Save AI Receptionist Studio Config
        </button>
      </form>

      {/* Right Visual Web Voice Call Simulator */}
      <div className="glass-card" style={{ padding: "1.75rem", background: "var(--bg-secondary)", display: "flex", flexDirection: "column", gap: "1.25rem", alignItems: "center" }}>
        
        <div style={{ textAlign: "center" }}>
          <h3 style={{ fontSize: "1.15rem", fontWeight: "800" }}>Live Web Voice Call Simulator</h3>
          <p style={{ fontSize: "0.78rem", color: "var(--text-subtle)" }}>Simulate a live in-browser web voice conversation with your trained AI Assistant</p>
        </div>

        {/* Active Call Settings Badges */}
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", justifyContent: "center" }}>
          <span className="badge badge-primary" style={{ fontSize: "0.68rem" }}>
            <Clock size={10} /> Max {config.maxCallTime || "10"}m
          </span>
          <span className="badge badge-success" style={{ fontSize: "0.68rem" }}>
            <Volume2 size={10} /> {config.backgroundSound && config.backgroundSound !== "none" ? config.backgroundSound.replace("_", " ") : "Studio Clean"}
          </span>
          <span className="badge badge-warning" style={{ fontSize: "0.68rem" }}>
            <Flame size={10} /> Temp {config.llmTemperature ?? 0.7}
          </span>
        </div>

        {/* Visual Phone Frame */}
        <div
          style={{
            width: "310px",
            height: "550px",
            borderRadius: "36px",
            background: "#080c14",
            border: "8px solid #1e293b",
            boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            position: "relative"
          }}
        >
          {/* Top Speaker Notch */}
          <div style={{ width: "120px", height: "18px", background: "#1e293b", margin: "0 auto", borderRadius: "0 0 12px 12px" }}></div>

          {/* Call Screen Header */}
          <div style={{ padding: "1.25rem 1rem 0.5rem", textAlign: "center" }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "var(--gradient-primary)", margin: "0 auto 0.75rem", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 20px rgba(99, 102, 241, 0.4)" }}>
              <PhoneCall size={28} color="#ffffff" />
            </div>
            <div style={{ fontWeight: "800", fontSize: "1rem", color: "#ffffff" }}>{config.receptionistName || "Chloe AI"}</div>
            <div style={{ fontSize: "0.72rem", color: "var(--accent-cyan)", marginTop: "2px" }}>
              {isCalling ? `Web Voice Call Active • ${formatTime(callDuration)}` : "Ready for Web Voice Call"}
            </div>
          </div>

          {/* Real-time Call Transcript Display */}
          <div style={{ flex: 1, padding: "0.85rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {callTranscript.map((t, i) => (
              <div
                key={i}
                style={{
                  alignSelf: t.sender === "user" ? "flex-end" : "flex-start",
                  maxWidth: "90%",
                  background: t.sender === "user" ? "var(--accent-primary)" : "#1e293b",
                  color: "#ffffff",
                  fontSize: "0.72rem",
                  padding: "0.5rem 0.65rem",
                  borderRadius: "8px",
                  lineHeight: 1.4
                }}
              >
                {t.text}
              </div>
            ))}
          </div>

          {/* Controls Bar */}
          <div style={{ padding: "1.25rem", background: "#0f172a", borderTop: "1px solid var(--border-color)", display: "flex", alignItems: "center", justifyContent: "space-around" }}>
            {!isCalling ? (
              <button
                type="button"
                onClick={startSimulatedCall}
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  background: "var(--gradient-emerald)",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 0 20px rgba(16, 185, 129, 0.4)",
                  cursor: "pointer",
                  border: "none"
                }}
                title="Start Live Web Call"
              >
                <PhoneCall size={24} />
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "50%",
                    background: isMuted ? "var(--accent-rose)" : "#334155",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    border: "none"
                  }}
                  title="Mute Mic"
                >
                  {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
                </button>
                <button
                  type="button"
                  onClick={endSimulatedCall}
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    background: "var(--accent-rose)",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 0 20px rgba(244, 63, 94, 0.4)",
                    cursor: "pointer",
                    border: "none"
                  }}
                  title="End Call"
                >
                  <PhoneOff size={24} />
                </button>
              </>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
