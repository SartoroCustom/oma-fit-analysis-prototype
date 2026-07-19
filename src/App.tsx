"use client";

import { useMemo, useState } from "react";

type Measurement = {
  name: string;
  bm: string;
  sm: string;
  staff: string;
  dta: string;
  final: string;
  confidence: number;
  rationale: string;
  order: [string, string, string];
  brand: [string, string, string];
  labels: [string, string];
};

const bodyMeasurements: Measurement[] = [
  { name: "Neck", bm: "15.5", sm: "15.5", staff: "—", dta: "15.5", final: "15.5", confidence: 92, rationale: "Matches order average", order: ["15.6", "15.8", "16.5"], brand: ["16.0", "16.2", "16.7"], labels: ["15.9", "16.1"] },
  { name: "Chest", bm: "40.0", sm: "40.0", staff: "—", dta: "40.0", final: "40.0", confidence: 96, rationale: "SM + photo proportions align", order: ["39.3", "39.8", "41.7"], brand: ["40.5", "41.5", "43.2"], labels: ["40.8", "42.1"] },
  { name: "Upper Waist", bm: "34.7", sm: "34.0", staff: "—", dta: "34.0", final: "34.0", confidence: 90, rationale: "Closest to order cohort", order: ["35.3", "34.4", "36.9"], brand: ["36.9", "36.2", "38.5"], labels: ["35.3", "36.6"] },
  { name: "Belly", bm: "37.5", sm: "35.0", staff: "—", dta: "35.0", final: "35.0", confidence: 88, rationale: "Reduced to fit observed frame", order: ["35.3", "35.4", "36.9"], brand: ["36.9", "37.2", "39.1"], labels: ["—", "—"] },
  { name: "Shoulder", bm: "17.6", sm: "20.0", staff: "—", dta: "17.2", final: "20.0", confidence: 91, rationale: "Photo width contradicts SM", order: ["18.0", "18.3", "19.1"], brand: ["18.6", "19.0", "19.6"], labels: ["18.0", "18.0"] },
  { name: "Arm Length", bm: "27.6", sm: "27.6", staff: "—", dta: "27.6", final: "27.6", confidence: 93, rationale: "Matches height + sleeve cohort", order: ["25.9", "26.1", "26.9"], brand: ["26.4", "26.5", "27.0"], labels: ["26.3", "26.5"] },
  { name: "Armscye", bm: "20.0", sm: "—", staff: "—", dta: "20.0", final: "20.0", confidence: 90, rationale: "Derived from chest + build", order: ["—", "—", "—"], brand: ["—", "—", "—"], labels: ["—", "—"] },
  { name: "Bicep", bm: "13.7", sm: "13.5", staff: "—", dta: "13.5", final: "13.5", confidence: 88, rationale: "Trim build visible in photos", order: ["13.9", "13.5", "14.5"], brand: ["14.2", "14.0", "14.6"], labels: ["14.4", "—"] },
  { name: "Forearm", bm: "11.5", sm: "11.5", staff: "—", dta: "11.5", final: "11.5", confidence: 90, rationale: "Consistent with bicep ratio", order: ["11.3", "11.5", "12.0"], brand: ["11.6", "11.6", "12.0"], labels: ["—", "—"] },
  { name: "Wrist", bm: "7.3", sm: "7.9", staff: "—", dta: "7.3", final: "7.9", confidence: 87, rationale: "Photo proportions support 7.3", order: ["7.2", "7.3", "7.7"], brand: ["7.5", "7.4", "7.7"], labels: ["7.8", "—"] },
  { name: "Jacket Front", bm: "33.6", sm: "—", staff: "—", dta: "33.6", final: "33.6", confidence: 93, rationale: "Long preference + height", order: ["30.4", "32.2", "32.8"], brand: ["31.6", "32.6", "33.0"], labels: ["32.2", "—"] },
  { name: "Jacket Back", bm: "32.4", sm: "31.5", staff: "—", dta: "31.5", final: "31.5", confidence: 83, rationale: "Slightly shorter than trend", order: ["30.5", "31.2", "31.9"], brand: ["31.2", "31.6", "32.0"], labels: ["31.0", "31.5"] },
  { name: "Beltline", bm: "36.7", sm: "37.4", staff: "—", dta: "37.4", final: "37.4", confidence: 91, rationale: "Follows trouser size trend", order: ["34.1", "34.2", "35.8"], brand: ["34.9", "35.8", "37.4"], labels: ["35.0", "34.4"] },
  { name: "Hips", bm: "41.4", sm: "42.5", staff: "—", dta: "42.5", final: "42.5", confidence: 90, rationale: "Photo + SM support comfort", order: ["39.0", "42.5", "42.1"], brand: ["40.5", "40.8", "42.0"], labels: ["—", "39.8"] },
  { name: "Crotch", bm: "27.2", sm: "—", staff: "—", dta: "27.2", final: "27.2", confidence: 62, rationale: "Limited comparable outcomes", order: ["26.7", "26.8", "27.9"], brand: ["27.3", "27.3", "27.8"], labels: ["27.2", "—"] },
  { name: "Thigh", bm: "23.6", sm: "—", staff: "—", dta: "23.6", final: "23.6", confidence: 66, rationale: "Near lower cohort boundary", order: ["24.0", "23.2", "26.6"], brand: ["25.3", "23.9", "24.5"], labels: ["23.1", "25.8"] },
  { name: "Thigh Height", bm: "34.8", sm: "—", staff: "—", dta: "34.8", final: "34.8", confidence: 92, rationale: "Matches height ratio", order: ["—", "—", "—"], brand: ["—", "—", "—"], labels: ["—", "—"] },
  { name: "Calf", bm: "15.5", sm: "—", staff: "—", dta: "15.5", final: "15.5", confidence: 89, rationale: "Balanced with thigh", order: ["14.9", "15.4", "15.8"], brand: ["15.5", "16.7", "18.0"], labels: ["15.7", "17.5"] },
  { name: "Inseam", bm: "—", sm: "n/a", staff: "—", dta: "30.9", final: "n/a", confidence: 74, rationale: "Derived from height + rise", order: ["30.0", "30.9", "31.5"], brand: ["30.6", "31.4", "31.9"], labels: ["—", "—"] },
  { name: "Outseam", bm: "42.9", sm: "—", staff: "—", dta: "42.9", final: "42.9", confidence: 88, rationale: "Long rise proportion retained", order: ["40.8", "41.6", "42.3"], brand: ["40.1", "41.4", "42.8"], labels: ["—", "—"] },
];

type GarmentType = "jacket" | "pants" | "shirt" | "vest" | "coat" | "shorts";

type GarmentMeasurement = {
  name: string;
  bodyName: string;
  body: string;
  mg: string;
  alt: string;
  hist: string;
  finish: string;
  note: string;
  order: [string, string, string];
  brand: [string, string, string];
  labels: [string, string];
};

const bodyFinalMap = Object.fromEntries(bodyMeasurements.map((item) => [item.name, item.final]));

function garmentRow(name: string, bodyName: string, finish: number, options: Partial<Pick<GarmentMeasurement, "mg" | "alt" | "hist" | "note">> = {}): GarmentMeasurement {
  const average = finish.toFixed(1);
  return {
    name,
    bodyName,
    body: bodyName ? (bodyFinalMap[bodyName] ?? "—") : "—",
    mg: options.mg ?? "",
    alt: options.alt ?? "",
    hist: options.hist ?? (finish - .1).toFixed(1),
    finish: average,
    note: options.note ?? "",
    order: [(finish - .6).toFixed(1), average, (finish + .6).toFixed(1)],
    brand: [(finish - .5).toFixed(1), (finish + .1).toFixed(1), (finish + .7).toFixed(1)],
    labels: [(finish - .2).toFixed(1), (finish + .2).toFixed(1)],
  };
}

const garmentMeasurements: Record<GarmentType, GarmentMeasurement[]> = {
  jacket: [
    garmentRow("Neck", "Neck", 17.4), garmentRow("Chest", "Chest", 43.5, { mg: "43.4", note: "Chest fit felt good." }), garmentRow("Upper Waist", "Upper Waist", 39.0), garmentRow("Belly", "Belly", 40.0),
    garmentRow("Hips / Seat", "Hips", 44.5), garmentRow("Shoulder", "Shoulder", 18.2, { hist: "18.1" }), garmentRow("Arm Length", "Arm Length", 26.0), garmentRow("Bicep", "Bicep", 15.5),
    garmentRow("Forearm", "Forearm", 13.0, { alt: "−0.3", note: "Sleeves felt full below elbow." }), garmentRow("Wrist / Cuff", "Wrist", 10.5), garmentRow("Stance", "", 17.0), garmentRow("Front Length", "Jacket Front", 32.0),
    garmentRow("Back Length", "Jacket Back", 31.5), garmentRow("Left Sleeve", "Arm Length", 26.0, { alt: "−1.0", note: "Sleeve was too long." }), garmentRow("Right Sleeve", "Arm Length", 26.0, { alt: "−1.0", note: "Match left sleeve adjustment." }), garmentRow("Upper Back", "Shoulder", 18.8),
    garmentRow("Center Back", "Jacket Back", 31.5), garmentRow("Lower Back", "Beltline", 20.0), garmentRow("Jacket Base", "Hips", 45.0), garmentRow("Button Position", "", 18.5),
  ],
  pants: [
    garmentRow("Waistband", "Beltline", 36.0, { alt: "+0.5", note: "Waist felt snug when seated." }), garmentRow("Seat", "Hips", 44.0), garmentRow("Front Rise", "Crotch", 10.8), garmentRow("Back Rise", "Crotch", 15.7),
    garmentRow("Thigh", "Thigh", 25.0), garmentRow("Knee", "", 18.0), garmentRow("Calf", "Calf", 17.2), garmentRow("Leg Opening", "", 15.5),
    garmentRow("Outseam", "Outseam", 42.4), garmentRow("Inseam", "Inseam", 31.4, { alt: "−0.5", note: "Trouser break was too long." }), garmentRow("Waistband Height", "", 1.6), garmentRow("Fly Length", "", 7.2),
    garmentRow("Front Pocket", "", 6.5), garmentRow("Back Pocket", "", 5.5),
  ],
  shirt: [
    garmentRow("Collar", "Neck", 16.0), garmentRow("Chest", "Chest", 44.0), garmentRow("Waist", "Upper Waist", 40.0), garmentRow("Seat", "Hips", 44.5),
    garmentRow("Shoulder", "Shoulder", 18.4), garmentRow("Sleeve Left", "Arm Length", 36.0, { alt: "−0.5", note: "Cuff covered too much of hand." }), garmentRow("Sleeve Right", "Arm Length", 36.0, { alt: "−0.5" }), garmentRow("Bicep", "Bicep", 16.0),
    garmentRow("Forearm", "Forearm", 13.5), garmentRow("Cuff Left", "Wrist", 9.2), garmentRow("Cuff Right", "Wrist", 9.2), garmentRow("Front Length", "Jacket Front", 31.5),
    garmentRow("Back Length", "Jacket Back", 32.0), garmentRow("Yoke", "Shoulder", 18.5), garmentRow("Armhole", "Armscye", 21.5),
  ],
  vest: [
    garmentRow("Chest", "Chest", 42.5), garmentRow("Upper Waist", "Upper Waist", 38.0), garmentRow("Belly", "Belly", 39.0), garmentRow("Seat", "Hips", 43.0),
    garmentRow("Shoulder", "Shoulder", 14.0), garmentRow("Armhole", "Armscye", 21.0), garmentRow("Front Length", "Jacket Front", 26.5), garmentRow("Back Length", "Jacket Back", 24.5),
    garmentRow("Front Drop", "", 2.0), garmentRow("Vest Base", "Beltline", 40.0),
  ],
  coat: [
    garmentRow("Neck", "Neck", 18.0), garmentRow("Chest", "Chest", 46.0), garmentRow("Waist", "Upper Waist", 43.0), garmentRow("Seat", "Hips", 47.0),
    garmentRow("Shoulder", "Shoulder", 19.0), garmentRow("Sleeve Left", "Arm Length", 26.5), garmentRow("Sleeve Right", "Arm Length", 26.5), garmentRow("Bicep", "Bicep", 17.0),
    garmentRow("Cuff", "Wrist", 12.0), garmentRow("Front Length", "Jacket Front", 40.0), garmentRow("Back Length", "Jacket Back", 39.5), garmentRow("Coat Base", "Hips", 49.0),
  ],
  shorts: [
    garmentRow("Waistband", "Beltline", 36.0), garmentRow("Seat", "Hips", 44.0), garmentRow("Front Rise", "Crotch", 10.5), garmentRow("Back Rise", "Crotch", 15.5),
    garmentRow("Thigh", "Thigh", 26.0), garmentRow("Leg Opening", "", 23.0), garmentRow("Outseam", "", 19.0), garmentRow("Inseam", "", 8.5),
    garmentRow("Waistband Height", "", 1.6), garmentRow("Fly Length", "", 6.2),
  ],
};

const garmentTypeLabels: Record<GarmentType, string> = { jacket: "Jacket", pants: "Pants", shirt: "Shirt", vest: "Vest", coat: "Coat", shorts: "Shorts" };

const garmentSkuOptions: Record<GarmentType, string[]> = {
  jacket: ["JKT-40L · Navy Hopsack", "JKT-40L · Charcoal Suiting"], pants: ["PNT-34 · Navy Hopsack", "PNT-34 · Charcoal Suiting"],
  shirt: ["SHT-15.5/36 · White Poplin", "SHT-15.5/36 · Blue Twill"], vest: ["VST-40L · Navy Hopsack"], coat: ["COT-40L · Camel Wool"], shorts: ["SHR-34 · Stone Cotton"],
};

const profileItems = [
  ["Sex", "Male"], ["Height", "6'3\""], ["Weight", "185 lbs"], ["Age", "26"],
  ["BMI", "23.1"], ["Torso", "Rectangle"], ["Jacket", "40"], ["Pants", "34"],
  ["Shirt", "15.5 / 36"], ["Fit Pref.", "Modern"], ["Shoulder", "Average"], ["Arms", "Long"],
  ["Rise", "Mid"], ["Seat", "Average"],
];

function tone(confidence: number) {
  if (confidence >= 88) return "good";
  if (confidence >= 75) return "watch";
  return "risk";
}

function Icon({ children }: { children: string }) {
  return <span className="nav-icon" aria-hidden="true">{children}</span>;
}

function BrainLogo() {
  return <svg className="intelligence-logo brain-logo" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="3.5" r="2.6" fill="#7a39d6"/><circle cx="15.5" cy="6.5" r="2.6" fill="#d349d8"/><circle cx="15.5" cy="13.5" r="2.6" fill="#fa4f8d"/><circle cx="10" cy="16.5" r="2.6" fill="#5a6ff0"/><circle cx="4.5" cy="13.5" r="2.6" fill="#27a9e8"/><circle cx="4.5" cy="6.5" r="2.6" fill="#7b5ce1"/><circle cx="10" cy="10" r="2.2" fill="#fff"/></svg>;
}

function ClickUpLogo() {
  return <svg className="intelligence-logo clickup-logo" viewBox="0 0 22 20" aria-hidden="true"><path d="M4 7.7 11 2l7 5.7-2.4 2.8L11 6.8l-4.6 3.7L4 7.7Z" fill="#ff5ac8"/><path d="M4.7 12.1 7.6 10c.9 1.3 2 2 3.4 2s2.5-.7 3.4-2l2.9 2.1C15.8 14.7 13.7 16 11 16s-4.8-1.3-6.3-3.9Z" fill="#7b38e8"/></svg>;
}

function CohortValue({ values, compact = false }: { values: [string, string, string]; compact?: boolean }) {
  if (values.every((value) => value === "—")) return <span className="no-cohort-data">—</span>;
  return <><b>{values[1]}</b>{!compact && <span>({values[0]}–{values[2]})</span>}</>;
}

function finalRangeStatus(value: string, order: [string, string, string]) {
  const finalValue = Number.parseFloat(value);
  const low = Number.parseFloat(order[0]);
  const high = Number.parseFloat(order[2]);
  if (![finalValue, low, high].every(Number.isFinite) || finalValue === 0) return null;
  const boundary = finalValue < low ? low : finalValue > high ? high : null;
  if (boundary === null) return null;
  const deviation = Math.abs(finalValue - boundary) / boundary;
  if (deviation >= .03) return "risk";
  if (deviation >= .015) return "watch";
  return null;
}

export default function Home() {
  const [tab, setTab] = useState<"body" | "garment">("body");
  const measurements = bodyMeasurements;
  const [finals, setFinals] = useState<Record<string, string>>({});
  const [sourceValues, setSourceValues] = useState<Record<string, string>>({});
  const [activeGarment, setActiveGarment] = useState<GarmentType>("jacket");
  const [historicalOrder, setHistoricalOrder] = useState("#6041 · Mar 2024");
  const [historicalSku, setHistoricalSku] = useState(garmentSkuOptions.jacket[0]);
  const [garmentInputs, setGarmentInputs] = useState<Record<string, string>>({});
  const [garmentFinishes, setGarmentFinishes] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<Set<string>>(new Set(bodyMeasurements.map((item) => item.name)));
  const [profileExpanded, setProfileExpanded] = useState(false);
  const [showStaff, setShowStaff] = useState(false);
  const [showBrandMeasurements, setShowBrandMeasurements] = useState(false);
  const [unit, setUnit] = useState<"in" | "cm">("in");
  const [heightTolerance, setHeightTolerance] = useState(1);
  const [weightTolerance, setWeightTolerance] = useState(5);
  const [reconExpanded, setReconExpanded] = useState(true);
  const [showReconfirm, setShowReconfirm] = useState(true);
  const [showRemake, setShowRemake] = useState(true);
  const [remakeExpanded, setRemakeExpanded] = useState(true);
  const [intelligenceTab, setIntelligenceTab] = useState<"brain" | "clickup">("brain");
  const [notesExpanded, setNotesExpanded] = useState(false);
  const [printNotesExpanded, setPrintNotesExpanded] = useState(false);
  const [printSheetNotes, setPrintSheetNotes] = useState("");
  const [cohortExpanded, setCohortExpanded] = useState(false);
  const [dtaExpanded, setDtaExpanded] = useState(false);
  const [photo, setPhoto] = useState(0);
  const [toast, setToast] = useState("");
  const selectedCount = selected.size;
  const allSelected = measurements.length > 0 && measurements.every((item) => selected.has(item.name));
  const changedCount = useMemo(() => tab === "body"
    ? measurements.filter((m) => (finals[m.name] ?? m.final) !== m.final).length
    : garmentMeasurements[activeGarment].filter((m) => (garmentFinishes[`${activeGarment}:${m.name}`] ?? m.finish) !== m.finish).length,
  [activeGarment, finals, garmentFinishes, measurements, tab]);

  function toggleSelected(name: string) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }

  function applySelected() {
    const next = { ...finals };
    measurements.forEach((item) => {
      if (selected.has(item.name)) next[item.name] = item.dta;
    });
    setFinals(next);
    setToast(`${selected.size} DTA ${selected.size === 1 ? "value" : "values"} applied to Final`);
    setTimeout(() => setToast(""), 2400);
  }

  function changeTab(nextTab: "body" | "garment") {
    setTab(nextTab);
    if (nextTab === "body") setSelected(new Set(bodyMeasurements.map((item) => item.name)));
  }

  function changeGarment(nextGarment: GarmentType) {
    setActiveGarment(nextGarment);
    setHistoricalSku(garmentSkuOptions[nextGarment][0]);
  }

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(measurements.map((item) => item.name)));
  }

  function updateSource(name: string, source: "sm" | "staff", value: string) {
    setSourceValues((current) => ({ ...current, [`${tab}:${name}:${source}`]: value }));
  }

  function runDta() {
    setToast("OMA Brain DTA analysis refreshed");
    setTimeout(() => setToast(""), 2400);
  }

  return (
    <main className="app-shell">
      <aside className="global-nav" aria-label="OMA navigation">
        <div className="global-mark">S</div>
        <nav>
          <button aria-label="Home"><Icon>⌂</Icon></button>
          <button aria-label="Orders"><Icon>▣</Icon></button>
          <button aria-label="Customers"><Icon>♙</Icon></button>
          <button className="active" aria-label="Analysis"><Icon>◉</Icon></button>
          <button aria-label="Garments"><Icon>♧</Icon></button>
          <button aria-label="Reports"><Icon>▤</Icon></button>
          <button aria-label="OMA Brain"><Icon>✣</Icon></button>
        </nav>
        <div className="global-nav-bottom"><button aria-label="Settings"><Icon>⚙</Icon></button><button aria-label="Help"><Icon>?</Icon></button></div>
      </aside>
      <header className="topbar">
        <div className="order-identity">
          <button className="icon-button" aria-label="Back">←</button>
          <strong>#6608</strong>
          <span className="customer-name">Demo Customer</span>
          <div className="garment-strip" aria-label="Order garments">
            {[0, 1, 2, 3].map((item) => <span key={item} className={`garment-mini garment-${item}`}>♟</span>)}
            <button aria-label="Add garment">＋</button>
          </div>
        </div>
        <div className="collaboration-note">
          <strong>Demo Manager</strong><span>Today · Customer photos received and fit profile ready for final analysis.</span>
        </div>
        <div className="order-signals" aria-label="Order activity"><span>▣</span><span>♡</span><span>▤</span><span>▧</span></div>
        <div className="deadline">
          <span><b>6 Days</b> to ship</span>
          <div className="deadline-bar"><i /><i /><i /><i /><i /><i /></div>
        </div>
        <div className="top-actions">
          <span className="day-badge">15</span>
          <button className="new-order-button">New Order</button>
          <button className="assignee-button" aria-label="Assigned to Andy Fine"><span>AF</span><small>Assigned to</small><strong>Andy Fine</strong><b>⌄</b></button>
        </div>
      </header>

      <div className="app-body">
        <aside className="order-rail" aria-label="Order and garment navigation">
          <button className="rail-profile active" aria-label="Current fit profile"><span>♟</span></button>
          {[0, 1, 2, 3].map((item) => <button key={item} className={`rail-garment rail-garment-${item}`} aria-label={`Open garment ${item + 1}`}><span /></button>)}
        </aside>

        <section className="workspace">
          <section className="order-toolbar">
            <div className="profile-control"><span>Profile</span><button><strong>Jun 27, 2025 · Primary</strong><small>active</small><b>⌄</b></button><button className="assign-button">Assign to Order</button></div>
            <div className="garment-segments" aria-label="Customer order history"><span className="has-orders">Jackets <b>2</b></span><span>Pants <b>0</b></span><span className="has-orders">Shirts <b>5</b></span><span>Vests <b>0</b></span></div>
            <nav className="module-actions" aria-label="Order tools"><button aria-label="Shipping">✈</button><button aria-label="Delivery">▣</button><button aria-label="Customer messages">▧</button><button aria-label="Favorites">♡</button><button aria-label="Documents">▤</button><button aria-label="Measurements">◉</button><button aria-label="Print">▥</button></nav>
          </section>

        <section className={`analysis-stage ${tab === "garment" ? "garment-mode" : "body-mode"}`}>
        <section className={`profile-strip ${profileExpanded ? "expanded" : ""}`}>
          <div className="profile-summary-row">
            <div className="profile-facts">
              {profileItems.map(([label, value]) => (
                <div key={label} className={`fact ${["Height", "Weight", "Age", "BMI"].includes(label) ? "vital" : ""} ${["Jacket", "Pants", "Shirt"].includes(label) ? "size-fact" : ""} ${["Torso", "Shirt"].includes(label) ? "group-end" : ""}`}><small>{label}</small><strong>{value}</strong></div>
              ))}
            </div>
            <button className="profile-details-toggle" aria-expanded={profileExpanded} onClick={() => setProfileExpanded(!profileExpanded)}>{profileExpanded ? "Hide details" : "Fit details"}<span>{profileExpanded ? "⌃" : "⌄"}</span></button>
          </div>
          {profileExpanded && (
            <div className="profile-details">
              <div><strong>Jacket fit</strong><span>Cut <b>Modern</b></span><span>Shoulder <b>Average</b></span><span>Chest <b>Regular</b></span><span>Belly <b>Trim</b></span><span>Sleeves <b>Very long</b></span><span>Length <b>Long</b></span></div>
              <div><strong>Shirt fit</strong><span>Cut <b>Modern</b></span><span>Chest <b>Average</b></span><span>Belly <b>Trim</b></span><span>Biceps <b>Average</b></span><span>Sleeves <b>Long</b></span></div>
              <div><strong>Pants fit</strong><span>Waist <b>Mid</b></span><span>Seat <b>Average</b></span><span>Thigh <b>Slim</b></span><span>Calves <b>Slim</b></span><span>Length <b>Full</b></span></div>
            </div>
          )}
        </section>

          <section className="analysis-card">
            <div className="analysis-toolbar">
              <div className="tabs" role="tablist">
                <button className={tab === "body" ? "active" : ""} onClick={() => changeTab("body")} role="tab">Body Measurements</button>
                <button className={tab === "garment" ? "active" : ""} onClick={() => changeTab("garment")} role="tab">Garment Measurements</button>
              </div>
              <div className="table-actions">
                {tab === "body" && <><span className="column-label">Show columns</span><label className="column-toggle"><input type="checkbox" checked={showStaff} onChange={(event) => setShowStaff(event.target.checked)} />Staff</label></>}
                <label className="column-toggle"><input type="checkbox" checked={showBrandMeasurements} onChange={(event) => setShowBrandMeasurements(event.target.checked)} />{tab === "body" ? "Brand measurements" : "Brands"}</label>
                <div className="unit-toggle" role="group" aria-label="Measurement units"><button className={unit === "in" ? "active" : ""} aria-pressed={unit === "in"} onClick={() => setUnit("in")}>IN</button><button className={unit === "cm" ? "active" : ""} aria-pressed={unit === "cm"} onClick={() => setUnit("cm")}>CM</button></div>
              </div>
            </div>

            {tab === "body" ? <>
            <div className="measurement-table-wrap">
              <table className={`measurement-table ${showStaff ? "with-staff" : "without-staff"} ${showBrandMeasurements ? "with-brands" : "without-brands"} ${dtaExpanded ? "dta-expanded" : "dta-compact"}`}>
                <colgroup>
                  <col className="c-name" /><col className="c-data" /><col className="c-data" />{showBrandMeasurements && <col className="c-brands" />}
                  <col className="c-self" />{showStaff && <col className="c-staff" />}<col className="c-final" /><col className="c-dta" />
                </colgroup>
                <thead>
                  <tr>
                    <th>Measurement</th>
                    <th>{dtaExpanded ? "Brand" : "Brand Data"}</th>
                    <th>{dtaExpanded ? "Order" : "Order Data"}</th>
                    {showBrandMeasurements && <th>Brand Measurements <small>SUSU · AOS</small></th>}
                    <th>SM</th>
                    {showStaff && <th><span>Staff</span><small>Measured</small></th>}
                    <th className="final-head">Final</th>
                    <th className="dta-head">
                      <span className="dta-title"><b>DTA</b><small>{selectedCount} selected</small></span>
                      {!allSelected && <button className="select-all-action" onClick={toggleAll}>Select all</button>}
                      <button className="header-apply" disabled={!selectedCount} onClick={applySelected}>Apply Selected</button>
                      <button className="dta-width-toggle" aria-label={dtaExpanded ? "Restore standard DTA width" : "Give DTA more width"} title={dtaExpanded ? "Restore standard DTA width" : "Give DTA more width"} onClick={() => setDtaExpanded(!dtaExpanded)}>{dtaExpanded ? "↤" : "↔"}</button>
                      <button className="dta-run-button" onClick={runDta}>Run</button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {measurements.map((item) => {
                    const value = finals[item.name] ?? item.final;
                    const isChanged = value !== item.final;
                    const isDtaDifferent = item.dta !== item.final;
                    const rangeStatus = finalRangeStatus(value, item.order);
                    const rangeMessage = rangeStatus === "risk" ? "Final is materially outside the historical Order range" : rangeStatus === "watch" ? "Final is outside the historical Order range" : isDtaDifferent ? "Final differs from the DTA recommendation" : "Final measurement";
                    return (
                      <tr key={item.name} className={`${selected.has(item.name) ? "selected" : "deselected"} ${tone(item.confidence) === "risk" ? "needs-review" : ""}`}>
                        <td className="measurement-name">
                          <span>{item.name}</span>
                        </td>
                        <td className="cohort-data"><CohortValue values={item.brand} compact={dtaExpanded} /></td>
                        <td className="cohort-data"><CohortValue values={item.order} compact={dtaExpanded} /></td>
                        {showBrandMeasurements && <td className="double"><span>{item.labels[0]}</span><span>{item.labels[1]}</span></td>}
                        <td className="source-input-cell sm"><input aria-label={`${item.name} self measurement`} placeholder="—" value={sourceValues[`${tab}:${item.name}:sm`] ?? (item.sm === "—" ? "" : item.sm)} onChange={(event) => updateSource(item.name, "sm", event.target.value)} /></td>
                        {showStaff && <td className="source-input-cell staff"><input aria-label={`${item.name} staff measurement`} placeholder="—" value={sourceValues[`${tab}:${item.name}:staff`] ?? (item.staff === "—" ? "" : item.staff)} onChange={(event) => updateSource(item.name, "staff", event.target.value)} /></td>}
                        <td className={`final-cell ${isDtaDifferent ? "decision" : ""} ${isChanged ? "changed" : ""} ${rangeStatus ? `range-${rangeStatus}` : ""}`}>
                          <input aria-label={`${item.name} final measurement`} title={rangeMessage} value={value} onChange={(event) => setFinals({ ...finals, [item.name]: event.target.value })} />
                        </td>
                        <td className="dta-cell">
                          <div className="dta-content"><button className={`dta-value ${tone(item.confidence)}`} aria-label={`${selected.has(item.name) ? "Exclude" : "Include"} ${item.name} DTA value ${item.dta}`} aria-pressed={selected.has(item.name)} onClick={() => toggleSelected(item.name)}>{item.dta}</button><span className={`confidence ${tone(item.confidence)}`}><i />{item.confidence}%</span><span className="rationale" title={item.rationale}>{item.rationale}</span></div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <section className={`cohort-panel ${cohortExpanded ? "expanded" : ""}`}>
              <div className="cohort-title"><strong>Reference Cohort Search</strong><button className="cohort-results" aria-label="106 matching profiles"><span><i />106</span><em>⌄</em></button><button onClick={() => setCohortExpanded(!cohortExpanded)}>{cohortExpanded ? "Fewer filters" : "More filters"}<i>{cohortExpanded ? "⌃" : "⌄"}</i></button><button>Reset</button></div>
              <div className="cohort-primary-fields">
                <div className="expected-lengths" aria-label="Expected length references for this height">
                  {[[["Jacket", ["31.0", "32.0", "33.0"]], ["Sleeve", ["25.5", "26.5", "27.5"]]], [["Outseam", ["41.0", "41.7", "42.4"]], ["Inseam", ["30.9", "31.4", "31.9"]]]].map((group, groupIndex) => (
                    <div className="length-stack" key={groupIndex}>{group.map(([label, values]) => <div className="length-reference" key={label as string}><span>{label as string}</span><div>{(values as string[]).map((value, index) => <b className={index === 1 ? "average" : ""} key={value}>{value}</b>)}</div></div>)}</div>
                  ))}
                </div>
                <div className="cohort-search-controls">
                  <div className="cohort-core-row">
                    <div className="cohort-core-field" aria-label={`Height 75 inches, plus or minus ${heightTolerance} inches`}><b>75<small>in</small></b><div><button aria-label="Decrease height tolerance" onClick={() => setHeightTolerance(Math.max(1, heightTolerance - 1))}>−</button><span>± {heightTolerance} in</span><button aria-label="Increase height tolerance" onClick={() => setHeightTolerance(heightTolerance + 1)}>+</button></div></div>
                    <div className="cohort-core-field" aria-label={`Weight 185 pounds, plus or minus ${weightTolerance} pounds`}><b>185<small>lb</small></b><div><button aria-label="Decrease weight tolerance" onClick={() => setWeightTolerance(Math.max(5, weightTolerance - 5))}>−</button><span>± {weightTolerance} lb</span><button aria-label="Increase weight tolerance" onClick={() => setWeightTolerance(weightTolerance + 5)}>+</button></div></div>
                  </div>
                  <div className="cohort-filter-row">
                    {[["Jacket", "40"], ["Length", "L"], ["Pants", "34"]].map(([label, value]) => (
                      <button className="cohort-select" key={label}><small>{label}</small><b>{value}</b><span>⌄</span></button>
                    ))}
                    <button className="cohort-search" onClick={() => { setToast("Reference cohort updated"); setTimeout(() => setToast(""), 2200); }}>⌕ Search</button>
                  </div>
                </div>
              </div>
              {cohortExpanded && <div className="cohort-secondary-fields">
                {[["Fit Pref.", "Modern"], ["Shoulder", "Average"], ["Arms", "Long"], ["Rise", "Mid"], ["Seat", "Average"]].map(([label, value]) => (
                  <button className="cohort-select" key={label}><small>{label}</small><b>{value}</b><span>⌄</span></button>
                ))}
                <span className="cohort-summary">Advanced filters refine the same historical cohort.</span>
              </div>}
            </section>
            </> : <>
              <section className="garment-record-workspace">
                <div className="garment-type-tabs" role="tablist" aria-label="Garment type">
                  {(Object.keys(garmentTypeLabels) as GarmentType[]).map((type) => <button key={type} role="tab" aria-selected={activeGarment === type} className={activeGarment === type ? "active" : ""} onClick={() => changeGarment(type)}><span>{garmentTypeLabels[type]}</span><small>{garmentMeasurements[type].length}</small></button>)}
                </div>
                <div className="history-record-bar">
                  <div className="history-record-title"><span>↶</span><div><strong>Historical QC record</strong><small>Choose the exact prior garment used for HIST</small></div></div>
                  <label><span>Order</span><select aria-label="Historical order" value={historicalOrder} onChange={(event) => setHistoricalOrder(event.target.value)}><option>#6041 · Mar 2024</option><option>#5718 · Sep 2023</option><option>#4922 · Nov 2022</option></select></label>
                  <label className="sku-picker"><span>Garment / SKU</span><select aria-label="Historical garment SKU" value={historicalSku} onChange={(event) => setHistoricalSku(event.target.value)}>{garmentSkuOptions[activeGarment].map((sku) => <option key={sku}>{sku}</option>)}</select></label>
                  <div className="record-loaded"><i />QC measurements loaded</div>
                </div>
                <div className="scenario-controls" aria-label="Prototype scenario controls">
                  <span>Demo</span>
                  <button className={showRemake ? "active" : ""} aria-pressed={showRemake} onClick={() => setShowRemake(!showRemake)}><i />Remake</button>
                  <button className={showReconfirm ? "active" : ""} aria-pressed={showReconfirm} onClick={() => setShowReconfirm(!showReconfirm)}><i />Reconfirm</button>
                </div>
              </section>

              <div className="garment-data-layout">
                <aside className="garment-body-reference" aria-label="Body final measurements">
                  <header><strong>Body Data</strong><span>Final</span></header>
                  <div style={{ gridTemplateRows: `repeat(${garmentMeasurements[activeGarment].length}, minmax(0, 1fr))` }}>{garmentMeasurements[activeGarment].map((item) => <div key={item.name}><span>{item.bodyName}</span><b className={item.bodyName ? "" : "empty"}>{item.bodyName ? (finals[item.bodyName] ?? item.body) : ""}</b></div>)}</div>
                </aside>
                <div className="garment-table-wrap">
                <table className={`garment-measurement-table ${showBrandMeasurements ? "with-brands" : "without-brands"}`}>
                  <colgroup><col className="g-name" /><col className="g-data" /><col className="g-data" />{showBrandMeasurements && <col className="g-brands" />}<col className="g-input" /><col className="g-input" /><col className="g-hist" /><col className="g-finish" /><col className="g-notes" /></colgroup>
                  <thead><tr><th>Measurement</th><th>Brand Data</th><th>Order Data</th>{showBrandMeasurements && <th>Brands<small>SUSU · AOS</small></th>}<th>MG</th><th>ALT</th><th>HIST<small>QC record</small></th><th className="finish-head">Finish</th><th className="customer-note-head">Customer Notes</th></tr></thead>
                  <tbody>{garmentMeasurements[activeGarment].map((item) => {
                    const key = `${activeGarment}:${item.name}`;
                    const historyOffset = historicalOrder.startsWith("#6041") ? 0 : historicalOrder.startsWith("#5718") ? -.2 : .2;
                    const historicalValue = item.hist === "—" ? "—" : (Number.parseFloat(item.hist) + historyOffset).toFixed(1);
                    const finishValue = garmentFinishes[key] ?? item.finish;
                    return <tr key={item.name}>
                      <td className="garment-measurement-name">{item.name}</td>
                      <td className="cohort-data"><CohortValue values={item.brand} /></td>
                      <td className="cohort-data"><CohortValue values={item.order} /></td>
                      {showBrandMeasurements && <td className="double"><span>{item.labels[0]}</span><span>{item.labels[1]}</span></td>}
                      <td className="garment-input-cell mg"><input aria-label={`${item.name} MG measurement`} placeholder="—" value={garmentInputs[`${key}:mg`] ?? item.mg} onChange={(event) => setGarmentInputs((current) => ({ ...current, [`${key}:mg`]: event.target.value }))} /></td>
                      <td className={`garment-input-cell alt ${showRemake && item.alt ? "has-adjustment" : ""}`}><input aria-label={`${item.name} alteration`} placeholder="—" value={garmentInputs[`${key}:alt`] ?? (showRemake ? item.alt : "")} onChange={(event) => setGarmentInputs((current) => ({ ...current, [`${key}:alt`]: event.target.value }))} /></td>
                      <td className="historical-cell" title={`${historicalOrder} · ${historicalSku}`}><span>{historicalValue}</span></td>
                      <td className={`finish-cell ${finishValue !== item.finish ? "changed" : ""}`}><input aria-label={`${item.name} finished garment measurement`} value={finishValue} onChange={(event) => setGarmentFinishes((current) => ({ ...current, [key]: event.target.value }))} /></td>
                      <td className={`customer-note-cell ${showRemake && item.note ? "has-note" : ""}`} title={showRemake ? item.note : ""}><span>{showRemake && item.note ? item.note : "—"}</span></td>
                    </tr>;
                  })}</tbody>
                </table>
                </div>
              </div>

              <section className={`cohort-panel ${cohortExpanded ? "expanded" : ""}`}>
                <div className="cohort-title"><strong>Reference Cohort Search</strong><button className="cohort-results" aria-label="106 matching profiles"><span><i />106</span><em>⌄</em></button><button onClick={() => setCohortExpanded(!cohortExpanded)}>{cohortExpanded ? "Fewer filters" : "More filters"}<i>{cohortExpanded ? "⌃" : "⌄"}</i></button><button>Reset</button></div>
                <div className="cohort-primary-fields">
                  <div className="expected-lengths" aria-label="Expected length references for this height">
                    {[[["Jacket", ["31.0", "32.0", "33.0"]], ["Sleeve", ["25.5", "26.5", "27.5"]]], [["Outseam", ["41.0", "41.7", "42.4"]], ["Inseam", ["30.9", "31.4", "31.9"]]]].map((group, groupIndex) => (
                      <div className="length-stack" key={groupIndex}>{group.map(([label, values]) => <div className="length-reference" key={label as string}><span>{label as string}</span><div>{(values as string[]).map((value, index) => <b className={index === 1 ? "average" : ""} key={value}>{value}</b>)}</div></div>)}</div>
                    ))}
                  </div>
                  <div className="cohort-search-controls">
                    <div className="cohort-core-row">
                      <div className="cohort-core-field" aria-label={`Height 75 inches, plus or minus ${heightTolerance} inches`}><b>75<small>in</small></b><div><button aria-label="Decrease height tolerance" onClick={() => setHeightTolerance(Math.max(1, heightTolerance - 1))}>−</button><span>± {heightTolerance} in</span><button aria-label="Increase height tolerance" onClick={() => setHeightTolerance(heightTolerance + 1)}>+</button></div></div>
                      <div className="cohort-core-field" aria-label={`Weight 185 pounds, plus or minus ${weightTolerance} pounds`}><b>185<small>lb</small></b><div><button aria-label="Decrease weight tolerance" onClick={() => setWeightTolerance(Math.max(5, weightTolerance - 5))}>−</button><span>± {weightTolerance} lb</span><button aria-label="Increase weight tolerance" onClick={() => setWeightTolerance(weightTolerance + 5)}>+</button></div></div>
                    </div>
                    <div className="cohort-filter-row">
                      {[["Jacket", "40"], ["Length", "L"], ["Pants", "34"]].map(([label, value]) => <button className="cohort-select" key={label}><small>{label}</small><b>{value}</b><span>⌄</span></button>)}
                      <button className="cohort-search" onClick={() => { setToast("Reference cohort updated"); setTimeout(() => setToast(""), 2200); }}>⌕ Search</button>
                    </div>
                  </div>
                </div>
                {cohortExpanded && <div className="cohort-secondary-fields">
                  {[["Fit Pref.", "Modern"], ["Shoulder", "Average"], ["Arms", "Long"], ["Rise", "Mid"], ["Seat", "Average"]].map(([label, value]) => <button className="cohort-select" key={label}><small>{label}</small><b>{value}</b><span>⌄</span></button>)}
                  <span className="cohort-summary">Advanced filters refine the same historical cohort.</span>
                </div>}
              </section>
            </>}

            <footer className="action-bar">
              <div><button className="text-button">Cancel</button></div>
              <div className="save-status"><span className="status-dot" /> All changes saved <b>{changedCount ? `· ${changedCount} edited` : ""}</b></div>
              <div><label className="switch-label">Include in data set <input type="checkbox" defaultChecked /><i /></label><label className="switch-label">Lock FP <input type="checkbox" /><i /></label><button className="secondary-button save-close">Save &amp; Close</button><button className="primary-button save-ready">Save &amp; Ready</button></div>
            </footer>
          </section>

          <aside className="review-rail">
            <div className={`review-context ${tab === "garment" && showRemake ? "has-remake" : ""} ${tab === "garment" && !showReconfirm ? "without-reconfirm" : ""}`}>
              {tab === "garment" && showRemake && <section className={`remake-card ${remakeExpanded ? "expanded" : "collapsed"}`}>
                <header><div><span className="remake-icon">↺</span><strong>Remake Request</strong><em>Submitted</em></div><button aria-label={remakeExpanded ? "Collapse remake request" : "Expand remake request"} onClick={() => setRemakeExpanded(!remakeExpanded)}>{remakeExpanded ? "⌃" : "⌄"}</button></header>
                {remakeExpanded && <div className="remake-body">
                  <div className="remake-meta"><span><small>Submitted</small><b>Jul 3 · 3:15 PM</b></span><span className="urgent"><small>Ship speed</small><b>Rush ($70)</b></span><span className="urgent"><small>Ship by</small><b>Jul 6, 2025</b></span></div>
                  <p>Attending a wedding in 10 days. Sleeves were too long and expensive to alter locally.</p>
                  <div className="remake-footer"><span>Jacket · Pants · Vest · 2 Shirts</span><button>View order →</button></div>
                </div>}
              </section>}

              <section className={`photo-card photo-${photo} ${tab === "garment" && showRemake ? "remake-photos" : ""}`} aria-label={tab === "garment" && showRemake ? "Remake photos" : "Customer photos"}>
                <div className="photo-top"><span>{tab === "garment" && showRemake ? "3 remake photos" : "5 photos"}</span><button aria-label="Open full-screen photo">⛶</button></div>
                <div className="photo-thumbnails">
                  {(tab === "garment" && showRemake ? [0, 1, 2] : [0, 1, 2, 3, 4]).map((item) => <button key={item} className={photo === item ? "active" : ""} onClick={() => setPhoto(item)} aria-label={`View ${tab === "garment" && showRemake ? "remake" : "customer"} photo ${item + 1}`}><span /></button>)}
                </div>
              </section>

              <section className={`notes-card ${notesExpanded ? "expanded" : "collapsed"}`}>
                <header><strong>Customer &amp; Fit Notes</strong><div><button>Edit</button><button className="notes-toggle" aria-label={notesExpanded ? "Collapse customer notes" : "Expand customer notes"} onClick={() => setNotesExpanded(!notesExpanded)}>{notesExpanded ? "⌃" : "⌄"}</button></div></header>
                {notesExpanded && <><p>Demo note: Customer needs the order for an upcoming wedding and prefers a clean, modern fit.</p>
                <p>Demo note: Review the previous fit profile before confirming final measurements.</p>
                <div className="note-tags"><span>Wedding deadline</span><span>Prior profile requested</span></div>
                <button className="view-notes">View all notes →</button></>}
              </section>

              <section className={`print-notes-card ${printNotesExpanded ? "expanded" : "collapsed"}`}>
                <header><div><span className="print-note-icon">▤</span><strong>Print Sheet Notes</strong></div><button className="notes-toggle" aria-label={printNotesExpanded ? "Collapse print sheet notes" : "Expand print sheet notes"} onClick={() => setPrintNotesExpanded(!printNotesExpanded)}>{printNotesExpanded ? "⌃" : "⌄"}</button></header>
                {printNotesExpanded && <div className="print-notes-editor"><textarea aria-label="Notes printed with the order" placeholder="Add a note for the tailor or production team…" value={printSheetNotes} onChange={(event) => setPrintSheetNotes(event.target.value)} /><div><small>Printed with the production sheet</small><button onClick={() => { setToast("Print sheet note saved"); setTimeout(() => setToast(""), 2200); }}>Save note</button></div></div>}
              </section>

              {(tab === "body" || showReconfirm) && <section className={`recon-card ${reconExpanded ? "expanded" : "collapsed"}`}>
                <header><div><span className="recon-icon">↻</span><strong>Recon</strong><em>10</em></div><b>Required</b><button aria-label={reconExpanded ? "Collapse reconfirm details" : "Expand reconfirm details"} onClick={() => setReconExpanded(!reconExpanded)}>{reconExpanded ? "⌃" : "⌄"}</button></header>
                {reconExpanded && <><div className="recon-timeline"><span><small>Sent out</small><b>Jul 10 · 10:39</b></span><span><small>Received</small><b>Jul 16 · 11:35</b></span><span><small>Impact</small><b>None</b></span></div>
                <div className="recon-status"><span>Delivery timing</span><b>✓ Okay</b></div>
                <ul><li><span>Core inputs</span><b>No change</b></li><li><span>Available jacket</span><b className="missing">None</b></li><li><span>Profile photos</span><b>Provided</b></li></ul></>}
              </section>}
            </div>

            <section className="brain-card intelligence-card">
              <header className="intelligence-header">
                <div className="intelligence-tabs" role="tablist" aria-label="Order intelligence">
                  <button className={intelligenceTab === "brain" ? "active" : ""} role="tab" aria-selected={intelligenceTab === "brain"} onClick={() => setIntelligenceTab("brain")}><BrainLogo /><b>OMA Brain</b></button>
                  <button className={intelligenceTab === "clickup" ? "active" : ""} role="tab" aria-selected={intelligenceTab === "clickup"} onClick={() => setIntelligenceTab("clickup")}><ClickUpLogo /><b>ClickUp</b><em>3</em></button>
                </div>
                {intelligenceTab === "clickup" && <span className="connected-status">Connected</span>}
              </header>

              {intelligenceTab === "brain" ? <>
                <div className="brain-score">
                  <div className="score-ring"><strong>78%</strong></div>
                  <div><small>Overall fit confidence</small><b>Strong match — manager review recommended</b><span>28 comparable orders · 5 profile photos</span></div>
                </div>
                <div className="brain-body">
                  <div className="analysis-summary"><b>Brain recommendation</b><span>Overall proportions support a 40 Long, modern-fit profile. Use the DTA set with manager judgment on shoulder, crotch, and thigh.</span></div>
                  <div className="brain-section-title"><h3>Review before finalizing</h3><span>3 items</span></div>
                  <ul className="attention-list">
                    <li className="high"><i /><div><b>Shoulder <em>High priority</em></b><span>SM appears too wide; photo proportions and both cohorts support <strong>17.2</strong>.</span></div></li>
                    <li><i /><div><b>Crotch <em>Low confidence</em></b><span>Limited comparable outcomes. Confirm the predicted <strong>27.2</strong> before applying.</span></div></li>
                    <li><i /><div><b>Thigh <em>Boundary</em></b><span>The prediction sits near the lower edge of the reference cohort.</span></div></li>
                  </ul>
                  <div className="evidence-coverage"><div><b>Evidence coverage</b><span>Fit profile, photos, order data and brand data included</span></div><em>Prior fit outcome unavailable</em></div>
                  <button className="details-button">Full analysis trail →</button>
                </div>
                <div className="brain-chat">
                  <div className="brain-chat-title"><div><span>✣</span><strong>Ask OMA Brain</strong></div><small>Profile context is attached</small></div>
                  <div className="brain-chat-message"><b>OMA Brain</b><p>Ask me to explain a prediction, compare evidence, or recommend the final value for any measurement.</p></div>
                  <div className="brain-chat-prompts"><button>Explain shoulder 17.2</button><button>What needs review?</button></div>
                  <div className="brain-chat-input"><input aria-label="Ask OMA Brain" placeholder="Ask about this analysis…" /><button>Send</button></div>
                </div>
              </> : <div className="team-chat-workspace">
                <div className="team-chat-intro"><strong>Order team conversation</strong><span>3 messages · Fit analysis context</span></div>
                <div className="team-chat-thread">
                  <article><b>Demo Manager <small>Jul 9 · 02:23</small></b><p>Were the requested customer photos added to the fit profile?</p></article>
                  <article className="reply"><b>Demo Specialist <small>Jul 11 · 17:45</small></b><p>Yes — the demo photos are attached and ready for analysis.</p></article>
                  <article><b>Demo Manager <small>Jul 12 · 19:14</small></b><p>Perfect. Please complete the final fit review before moving the order to Ready.</p></article>
                </div>
                <div className="team-chat-input"><input aria-label="Message the ClickUp team" placeholder="Message the ClickUp team…" /><button>Send</button></div>
              </div>}
            </section>
          </aside>
        </section>
      </section>
      </div>

      {toast && <div className="toast">✓ {toast}</div>}
    </main>
  );
}
