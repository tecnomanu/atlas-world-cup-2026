/**
 * Builds app/i18n/content.en.json from Spanish atlas string dump.
 * Run: node scripts/gen-content-en.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const es = JSON.parse(readFileSync("/tmp/atlas-strings-es.json", "utf8"));

const phrase = [
  ["Estados Unidos", "United States"],
  ["Canadá", "Canada"],
  ["México", "Mexico"],
  ["Suiza", "Switzerland"],
  ["Cadena global", "Global chain"],
  ["País anfitrión", "Host country"],
  ["Proveedor", "Supplier"],
  ["Proveedores", "Suppliers"],
  ["Personas", "People"],
  ["Finanzas", "Finance"],
  ["Compras", "Procurement"],
  ["Ambiente", "Environment"],
  ["Riesgo", "Risk"],
  ["Dirección", "Direction"],
  ["Seguridad", "Security"],
  ["Medicina", "Medicine"],
  ["Protocolo", "Protocol"],
  ["Competición", "Competition"],
  ["Planificación", "Planning"],
  ["Ceremonia", "Ceremony"],
  ["Juego", "Match"],
  ["Egreso", "Egress"],
  ["Cierre", "Close-out"],
  ["Operación", "Operations"],
  ["Permisos", "Permits"],
  ["Policía", "Police"],
  ["Inteligencia", "Intelligence"],
  ["Seguridad privada", "Private security"],
  ["Producción", "Production"],
  ["Derechos", "Rights"],
  ["Tecnología", "Technology"],
  ["Cámaras", "Cameras"],
  ["Señal anfitriona", "Host feed"],
  ["Audiencia", "Audience"],
  ["Operador", "Operator"],
  ["Obras", "Works"],
  ["Seguros", "Insurance"],
  ["Federaciones", "Federations"],
  ["Logística", "Logistics"],
  ["Aduana", "Customs"],
  ["Hoteles", "Hotels"],
  ["Creatividad", "Creative"],
  ["Fabricación", "Manufacturing"],
  ["Ensayo", "Rehearsal"],
  ["Idea", "Concept"],
  ["Selección", "National team"],
  ["selecciones", "national teams"],
  ["partidos", "matches"],
  ["sedes", "venues"],
  ["países", "countries"],
  ["voluntarios", "volunteers"],
  ["acreditados", "accredited"],
  ["oficiales de partido", "match officials"],
  ["jugadores", "players"],
  ["Más de", "More than"],
  ["Alrededor de", "Around"],
  ["Hasta", "Up to"],
  ["Estimación:", "Estimate:"],
  ["Estimación no separada: incluida en el rango de", "Estimate not separated: included in the range of"],
  ["Parte de", "Part of"],
  ["Abrir para seguir la cadena operativa", "Open to follow the operational chain"],
  ["posiciones", "roles"],
  ["personas", "people"],
  ["turnos", "shifts"],
  ["dominios operativos", "operational domains"],
  ["fuentes de investigación", "research sources"],
  ["sitios oficiales", "official sites"],
  ["territorios con señal", "territories with coverage"],
  ["datos procesados", "data processed"],
  ["Policías locales", "Local police"],
  ["Agencias federales", "Federal agencies"],
  ["Bomberos", "Fire services"],
  ["Federación Mexicana de Fútbol", "Mexican Football Federation"],
  ["Presidente de FIFA", "FIFA President"],
  ["Secretario general de FIFA", "FIFA Secretary General"],
  ["Presidente del Comité de Árbitros de FIFA", "Chair of the FIFA Referees Committee"],
  ["CEO de HBS", "HBS CEO"],
  ["COO de HBS", "HBS COO"],
  ["Chairman de Balich Wonder Studio", "Chairman of Balich Wonder Studio"],
  ["Proveedores locales", "Local suppliers"],
  ["Hoteles y training sites", "Hotels and training sites"],
  ["propietarios", "owners"],
  ["operadores", "operators"],
  ["Autoridades locales", "Local authorities"],
  ["Capas federal, estatal/provincial y local", "Federal, state/provincial, and local layers"],
  ["Anatomía operativa desde −72 horas hasta desmovilización", "Operational anatomy from −72 hours through demobilization"],
  ["integrantes de seguridad confirmados en fase de grupos", "security personnel confirmed in the group stage"],
  ["representantes de medios acreditados", "accredited media representatives"],
  ["media partners dentro del IBC", "media partners inside the IBC"],
  ["territorios con acuerdos", "territories with agreements"],
  ["personas diarias en el IBC", "people per day at the IBC"],
  ["personas en preparación y transformación", "people in preparation and transformation"],
  ["campos de estadio y", "stadium pitches and"],
  ["campos de entrenamiento", "training pitches"],
  ["de césped entre venues y training sites", "of turf across venues and training sites"],
  ["personas directas;", "direct people;"],
  ["con soporte ampliado", "with expanded support"],
  ["delegados", "delegates"],
  ["transfers acumulados al corte investigado", "transfers accumulated at the research cut-off"],
  ["personas visibles solo para dos banderas gigantes", "people visible for two giant flags alone"],
  ["voluntarios por bandera nacional gigante", "volunteers per giant national flag"],
  ["movimientos logísticos de banners", "banner logistics movements"],
  ["Italia", "Italy"],
  ["Alemania", "Germany"],
  ["China", "China"],
  ["Reino Unido", "United Kingdom"],
  ["Arabia Saudita", "Saudi Arabia"],
  ["Catar", "Qatar"],
  ["Proveedores locales", "Local suppliers"],
  ["Hoteles base", "Base hotels"],
  ["Hoteles y training sites", "Hotels and training sites"],
  ["Operadores de suites y lounges", "Suite and lounge operators"],
  ["Catering y protocolo", "Catering and protocol"],
  ["Policías locales", "Local police"],
  ["Agencias federales", "Federal agencies"],
  ["Bomberos", "Fire services"],
  ["Seguridad privada", "Private security"],
  ["Integradores locales", "Local integrators"],
  ["Agencias locales", "Local agencies"],
  ["EMS locales", "Local EMS"],
  ["Hospitales de referencia", "Referral hospitals"],
  ["Autoridades sanitarias", "Health authorities"],
  ["Autoridades locales", "Local authorities"],
  ["Agencias de transporte", "Transport agencies"],
  ["Aeropuertos", "Airports"],
  ["Policías de tránsito", "Traffic police"],
  ["Cadena logística global", "Global logistics chain"],
  ["Cadena creativa global", "Global creative chain"],
  ["Sponsors y licensees", "Sponsors and licensees"],
  ["Comunidades", "Communities"],
  ["Gobiernos", "Governments"],
  ["Auditores", "Auditors"],
  ["Aseguradoras", "Insurers"],
  ["Secretario general", "Secretary General"],
  ["pública", "public"],
  ["región", "region"],
  ["millones", "million"],
  ["operación", "operations"],
  ["documen", "documentation"],
  ["y MTO", "and MTO"],
  ["y SkyTrain", "and SkyTrain"],
  ["Metrobús", "Metrobus"],
];

phrase.sort((a, b) => b[0].length - a[0].length);

function tr(text) {
  if (typeof text !== "string") return text;
  let out = text;
  for (const [from, to] of phrase) {
    if (out.includes(from)) out = out.split(from).join(to);
  }
  return out;
}

function deepTr(value) {
  if (typeof value === "string") return tr(value);
  if (Array.isArray(value)) return value.map(deepTr);
  if (value && typeof value === "object") {
    const next = {};
    for (const [k, v] of Object.entries(value)) next[k] = deepTr(v);
    return next;
  }
  return value;
}

const domainOverrides = {
  "world-cup": {
    label: "World Cup 2026",
    eyebrow: "THE FULL SYSTEM",
    summary:
      "A temporary global organization connecting competition, governments, stadiums, technology, suppliers, media, and public services.",
    people: "≈300,000 formally accredited people",
    metric: "≈300,000 accredited",
    facts: [
      "104 matches and 48 national teams",
      "16 venues in Canada, Mexico, and the United States",
      "More than 600 official sites",
      "Estimated global chain: 500,000–1,200,000 people",
    ],
    areas: [
      "Direction",
      "Finance",
      "Procurement",
      "Legal",
      "Environment",
      "People",
      "Risk",
      "Suppliers",
    ],
    countries: ["Canada", "Mexico", "United States", "Switzerland", "Global chain"],
    chain: ["FIFA", "FWC26", "Host country", "Host City", "Venue", "Supplier"],
    sources: [
      "FIFA · Tournament operational figures",
      "FIFA · The 16 venues",
    ],
  },
  matches: {
    label: "Competition",
    eyebrow: "COMPETITION",
    summary:
      "Each match is an ephemeral enterprise: it starts days earlier and ends after financial, technical, and security close-out.",
    people: "13,700–25,000 roles around a major match",
    facts: [
      "170 match officials",
      "1,248 players",
      "Operational anatomy from −72 hours through demobilization",
    ],
    areas: [
      "Competition",
      "Finance",
      "Venue",
      "Security",
      "Medicine",
      "Broadcast",
      "Protocol",
    ],
    chain: ["Planning", "Venue readiness", "Ceremony", "Match", "Egress", "Close-out"],
    sources: ["FIFA · Tournament operational figures"],
  },
  security: {
    label: "Security",
    eyebrow: "MULTI-LAYER PROTECTION",
    summary:
      "FIFA Safety & Security, stewards, private firms, police, intelligence, traffic, counter-drone, fire, and emergency services.",
    people: "20,000+ security personnel confirmed in the group stage",
    facts: [
      "265,369 security shifts",
      "Federal, state/provincial, and local layers",
      "Cybersecurity and connected command centres",
    ],
    sources: ["FIFA · Group-stage balance"],
  },
  broadcast: {
    label: "Broadcast",
    eyebrow: "GLOBAL FEED",
    summary:
      "HBS produces the host feed; dozens of Media Rights Licensees customize and distribute it worldwide.",
    people: "Up to 3,400 people per day at the IBC",
    metric: "220+ territories",
    facts: [
      "More than 56 media partners inside the IBC",
      "5,230 accredited media representatives",
      "More than 220 territories under agreement",
    ],
    sources: [
      "FIFA · Global broadcast ecosystem",
      "FIFA · Tournament operational figures",
    ],
  },
  venues: {
    label: "Stadiums",
    eyebrow: "INFRASTRUCTURE",
    summary:
      "Public and private buildings, standing operators, and a FIFA control period that fully transforms how they run.",
    people: "5,000–12,000 people in preparation and transformation",
    facts: [
      "16 stadium pitches and 77 training pitches",
      "300,000 m² of turf across venues and training sites",
      "Temporary overlay for all 16 stadiums",
    ],
    sources: ["FIFA · The 16 venues"],
  },
  teams: {
    label: "Teams",
    eyebrow: "DELEGATIONS",
    summary:
      "Players and technical staff travel inside a logistics bubble of hotels, base camps, kit vans, security, and transport.",
    people: "3,776 direct people; 8,600–16,800 with expanded support",
    metric: "48 national teams",
    facts: [
      "1,248 players and 2,528 delegates",
      "48 Team Base Camps",
      "6,310 transfers accumulated at the research cut-off",
    ],
    areas: ["Federations", "Logistics", "Finance", "Customs", "Security", "Hotels", "Insurance"],
    countries: ["48 national teams", "Canada", "Mexico", "United States"],
    organizations: ["48 federations", "FIFA Team Services", "Rock-it Cargo", "Hotels and training sites"],
    chain: ["Federation", "Delegation", "Base camp", "Hotel", "Kit", "Match travel"],
    sources: [
      "FIFA · Team Base Camps",
      "FIFA · Tournament operational figures",
    ],
  },
  ceremonies: {
    label: "Ceremonies",
    eyebrow: "SPECTACLE",
    summary:
      "Flags, music, artists, pyrotechnics, protocol, and technology turn minutes of ceremony into months of production.",
    people: "Around 140 people visible for two giant flags alone",
    metric: "10,000+ volunteers",
    facts: [
      "≈70 volunteers per giant national flag",
      "More than 200 banner logistics movements",
      "Balich Wonder Studio on main ceremonies",
    ],
    areas: ["Creative", "Procurement", "Legal", "Permits", "Environment", "Security", "Suppliers"],
    countries: ["Italy", "Canada", "Mexico", "United States"],
    organizations: ["FIFA Ceremonies", "Balich Wonder Studio", "Host Cities", "Local suppliers"],
    peopleNamed: [{ name: "Marco Balich", role: "Chairman of Balich Wonder Studio" }],
    chain: ["Concept", "Creative", "Permits", "Manufacturing", "Rehearsal", "Show call"],
    sources: ["FIFA · Pre-match ceremonies and flags"],
  },
  technology: {
    label: "Refereeing technology",
    shortLabel: "Ref tech",
    eyebrow: "INVISIBLE ENGINEERING",
    summary:
      "Cameras, fiber, connected ball, AI, cybersecurity, and refereeing systems form a critical distributed platform.",
    people: "1,500–4,000 people in central engineering and support",
    metric: "13 PB of data",
    facts: [
      "161,000 km of fiber",
      "30 dedicated technical cameras per stadium for SAOT + GLT",
      "More than 1 billion blocked attacks",
    ],
    areas: ["Product", "Engineering", "Procurement", "Legal", "Cybersecurity", "Telecom", "Suppliers"],
    countries: ["Switzerland", "United Kingdom", "Germany", "China", "United States"],
    chain: ["Research", "Product", "Integration", "Calibration", "24/7 operations", "Contingency"],
    sources: ["FIFA · 2026 refereeing technology", "FIFA · Tournament operational figures"],
  },
  hospitality: {
    label: "Hospitality",
    eyebrow: "FAN EXPERIENCE",
    summary:
      "Tickets, suites, hotels, food, accessibility, retail, and guest care form another enterprise inside the tournament.",
    people: "27,969 accredited hospitality people",
    facts: [
      "607,350 hospitality packages",
      "3,166 premium environments activated",
      "More than 700 premium menus",
    ],
    areas: ["Commercial", "Finance", "Procurement", "Food safety", "People", "Accessibility", "Suppliers"],
    organizations: ["FIFA", "On Location", "Suite and lounge operators", "Catering and protocol"],
    chain: ["Product", "Sales", "Guest data", "Venue", "Service", "Reconciliation"],
    sources: ["FIFA · Tournament operational figures"],
  },
  governance: {
    label: "Governance",
    eyebrow: "DIRECTION AND COORDINATION",
    summary:
      "FIFA, FWC26, host associations, Host Cities, and governments coordinate a temporary organization with multiple decision centers.",
    people: "Estimate: 2,000–6,000 direction, PMO, command-centre, and public-coordination roles",
    metric: "3 countries · 16 venues",
    facts: [
      "Tournament Operations Centre in Miami",
      "16 local interfaces with different legal forms",
      "Federal, state/provincial, and municipal governance",
    ],
    areas: ["Direction", "PMO", "Government", "Crisis", "Communications", "Legal", "Finance"],
    peopleNamed: [
      { name: "Gianni Infantino", role: "FIFA President" },
      { name: "Mattias Grafström", role: "Secretary General" },
      { name: "Heimo Schirgi", role: "COO FIFA World Cup 2026" },
    ],
    countries: ["Switzerland", "Canada", "Mexico", "United States"],
    chain: ["FIFA Council", "FWC26", "Host Association", "Host City", "Government", "Venue", "Supplier"],
    sources: [
      "FIFA · Tournament Operations Centre and Intelligent Command Centre",
      "FIFA · Tournament operational figures",
    ],
  },
  "enterprise-tech": {
    label: "Enterprise technology",
    shortLabel: "Enterprise tech",
    eyebrow: "PLATFORMS AND CYBERSECURITY",
    summary:
      "Private networks, cloud, identity, accreditation, devices, workforce systems, and monitoring centers keep the tournament connected.",
    people: "Estimate: 1,500–4,000 people; overlap with broadcast and FIFA workforce",
    metric: "600+ sites",
    facts: [
      "161,000 km of fiber",
      "More than 1 billion blocked attacks",
      "Systems across more than 600 official sites",
    ],
    areas: ["Architecture", "Cloud", "Networks", "Identity", "Support", "Cybersecurity", "Data"],
    organizations: ["FIFA Technology", "Lenovo", "Salesforce", "Verizon", "Local integrators"],
    countries: ["United States", "China", "Switzerland", "Global chain"],
    chain: ["Architecture", "Procurement", "Integration", "Hardening", "Monitoring", "Response", "Recovery"],
    sources: [
      "FIFA · Tournament operational figures",
      "FIFA · 2026 refereeing technology",
      "FIFA · Compliance program",
    ],
  },
  medical: {
    label: "Health and medicine",
    eyebrow: "SPORT, PUBLIC AND HEALTH",
    summary:
      "Team and referee medicine, first aid, ambulances, hospitals, anti-doping, public health, and climate protocols.",
    people: "Estimate: 8,000–20,000 medical professionals and roles in the expanded tournament",
    metric: "16 medical networks",
    facts: [
      "Referral hospitals per venue",
      "Separate layers for participants and the public",
      "Heat, food, and disease surveillance",
    ],
    areas: ["FIFA Medical", "EMS", "Hospitals", "Public health", "Anti-doping", "Food safety", "Mental health"],
    organizations: ["FIFA Medical", "Team medical staff", "Local EMS", "Referral hospitals", "Health authorities"],
    chain: ["Medical plan", "Credentialing", "Posts", "Triage", "Transfer", "Hospital", "Reporting"],
    sources: ["FIFA · 2026 medical teams and standards", "FIFA · Tournament operational figures"],
  },
  transport: {
    label: "Transport and logistics",
    eyebrow: "MOBILITY AND FREIGHT",
    summary:
      "Borders, aviation, customs, buses, public transit, shuttles, depots, freight, and contingency routes.",
    people: "Estimate: 25,000–80,000 roles across mobility, airports, freight, and traffic",
    metric: "3 countries · last mile",
    facts: [
      "6,310 team movements at cut-off",
      "2,321 escorted transfers",
      "Public and private networks coordinated per venue",
    ],
    areas: ["Aviation", "Immigration", "Customs", "Freight", "Transit", "Traffic", "Fleet"],
    organizations: ["Rock-it Cargo/GCL", "Hyundai–Kia", "Transport agencies", "Airports", "Traffic police"],
    countries: ["Canada", "Mexico", "United States", "Global logistics chain"],
    chain: ["Forecast", "Permit", "Booking", "Customs", "Depot", "Route", "Last mile", "Return"],
    sources: [
      "FIFA · Rock-it Cargo, official logistics provider",
      "FIFA · Team Base Camps",
      "FIFA · Tournament operational figures",
    ],
  },
  accommodation: {
    label: "Accommodation and food",
    shortLabel: "Accommodation",
    eyebrow: "HOUSING AND FEEDING THE TOURNAMENT",
    summary:
      "Hotels, rooming, kitchens, sports nutrition, cleaning, laundry, food traceability, and waste.",
    people: "Estimate: 40,000–120,000 people in lodging, food, and related services",
    metric: "hotels · catering",
    facts: [
      "48 Team Base Camps",
      "Differentiated hotels for teams, referees, FIFA, and media",
      "Food operations with health controls",
    ],
    areas: ["Hotels", "Catering", "Nutrition", "Housekeeping", "Laundry", "Food safety", "Waste"],
    organizations: ["Base hotels", "Marriott Bonvoy", "Airbnb", "Caterers", "Health authorities"],
    chain: ["Forecast", "Contract", "Rooming", "Supply", "Service", "Health control", "Reconciliation"],
    sources: ["FIFA · Team Base Camps", "FIFA · Tournament operational figures"],
  },
  fans: {
    label: "Fans and accessibility",
    shortLabel: "Fans",
    eyebrow: "TICKETS AND EXPERIENCE",
    summary:
      "Ticketing, payments, fraud, entry, Fan Festivals, multilingual information, mobility, and accessibility services.",
    people: "Estimate: 15,000–40,000 direct roles in ticketing, fan services, and accessibility",
    metric: "6.2M+ tickets",
    facts: [
      "7.7 million Fan Festival visits",
      "Audio description and haptic boards",
      "Sensory bags and inclusive training",
    ],
    areas: ["Ticketing", "Payments", "Guest services", "Fan Festival", "Accessibility", "Fraud", "Information"],
    chain: ["Registration", "Purchase", "Payment", "Ticket", "Travel", "Entry", "Experience", "Support"],
    sources: ["FIFA · Accessibility and inclusion", "FIFA · Tournament operational figures"],
  },
  brand: {
    label: "Brand and content",
    eyebrow: "DESIGN, MUSIC AND OWNED MEDIA",
    summary:
      "Brand architecture, emblem, posters, music, campaigns, content, creators, city dressing, and clean zones.",
    people: "Estimate: 5,000–20,000 people in the global creative-production chain",
    metric: "16 local identities",
    facts: [
      "Shared system with 16 Host City expressions",
      "Sonic IDs and local production",
      "Brand protection and venue de-branding",
    ],
    areas: ["Brand strategy", "Design", "Music", "Content", "Social", "Rights", "City dressing"],
    organizations: ["FIFA Brand", "Moment Factory", "This Is Catapult", "Local agencies", "Host Cities"],
    countries: ["United States", "Canada", "Mexico", "Global creative chain"],
    chain: ["Strategy", "Concept", "Rights", "Production", "Adaptation", "Approval", "Publication"],
    sources: ["FIFA · Official 2026 brand identity", "FIFA · Tournament operational figures"],
  },
  commercial: {
    label: "Sponsors and retail",
    shortLabel: "Sponsors & retail",
    eyebrow: "COMMERCIAL RIGHTS",
    summary:
      "Sponsorships, licensing, activations, equipment, ball, products, manufacturing, stores, payments, and royalties.",
    people: "Estimate: 20,000–100,000 people in activations, manufacturing, distribution, and retail",
    metric: "20+ global partners",
    facts: [
      "FIFA Partner/Sponsor/Supporter hierarchies",
      "Fanatics operates onsite retail",
      "Multinational manufacturing and distribution",
    ],
    organizations: ["FIFA Commercial", "Fanatics", "adidas", "Visa", "Coca-Cola", "Sponsors and licensees"],
    countries: ["United States", "Germany", "China", "Saudi Arabia", "Qatar", "Global chain"],
    chain: ["Category", "Contract", "Rights", "Concept", "Production", "Activation", "Sales", "Royalty"],
    sources: ["FIFA · Fanatics, retail and merchandising", "FIFA · Tournament operational figures"],
  },
  sustainability: {
    label: "Sustainability & human rights",
    shortLabel: "Sustainability",
    eyebrow: "ENVIRONMENT, RIGHTS AND LEGACY",
    summary:
      "Climate, energy, water, waste, responsible sourcing, labor, inclusion, grievance mechanisms, community, and legacy.",
    people: "Estimate: 2,000–8,000 specialized roles and functional liaisons",
    metric: "4 pillars",
    facts: [
      "Social, environmental, economic, and governance strategy",
      "Specific plans per Host City and venue",
      "Sustainable Sourcing Code for the supply chain",
    ],
    areas: ["Climate", "Energy", "Water", "Waste", "Labor", "Human rights", "Community"],
    organizations: ["FIFA Sustainability & Human Rights", "Host Cities", "Venues", "Suppliers", "Communities"],
    countries: ["Canada", "Mexico", "United States", "Global chain"],
    chain: ["Baseline", "Target", "Due diligence", "Plan", "Operations", "Grievance", "Reporting", "Legacy"],
    sources: [
      "FIFA · 2026 sustainability and human-rights strategy",
      "FIFA · Sustainable sourcing code",
    ],
  },
  "finance-admin": {
    label: "Finance and legal",
    shortLabel: "Finance & legal",
    eyebrow: "MONEY, CONTRACTS AND CONTROL",
    summary:
      "CFO, budget, procurement, contracts, tax, insurance, privacy, permits, payments, reconciliation, and audit.",
    people: "Estimate: 3,000–12,000 cross-cutting roles; many overlap other branches",
    metric: "budget → audit",
    facts: [
      "Separate circuits in FIFA, FWC26, Host Cities, and governments",
      "Public and private procurement coexist",
      "Financial close-out continues after the final match",
    ],
    organizations: ["FIFA Finance", "FWC26 Finance", "Host City CFOs", "Governments", "Auditors", "Insurers"],
    peopleNamed: [{ name: "Thomas Peyer", role: "FIFA Chief Finance Officer" }],
    countries: ["Switzerland", "Canada", "Mexico", "United States"],
    chain: ["Need", "Business case", "Budget", "RFP", "Contract", "Delivery", "Invoice", "Payment", "Audit"],
    sources: [
      "FIFA · Chief Finance Officer",
      "FIFA · Compliance program",
      "FIFA · Legal area",
      "FIFA · Sustainable sourcing code",
    ],
  },
};

const detailOverrides = {
  "match-ceremony": { label: "Pre-match ceremony", summary: "Show, flags, anthems, and protocol" },
  "match-officials": { label: "Officials", summary: "Referees, assistants, and video officials" },
  "match-control": { label: "Match control", summary: "Competition management and venue control" },
  "match-medical": { label: "Medicine", summary: "Teams, public, EMS, and hospitals" },
  "match-egress": { label: "Egress", summary: "Crowd flow, traffic, and transport" },
  "match-close": { label: "Financial close-out", summary: "Invoices, reports, claims, and audit" },
  "match-opening-case": {
    label: "Opening match case",
    summary: "Ceremony, public ops, security, mobility, and stadium for the opening match",
    people: "Estimate: 18,000–30,000 direct and public roles",
    metric: "Mexico–South Africa",
  },
  "sec-local": { label: "Local police", summary: "Urban perimeters, traffic, and response", metric: "multi-venue" },
  "sec-private": { label: "Private security", summary: "Screening, access, and controlled zones" },
  "sec-cyber": { label: "Cybersecurity", summary: "SOC, threats, domains, and platforms" },
  "sec-credentials": { label: "Accreditation", summary: "Identity, background checks, and zones" },
  "sec-intel": { label: "Intelligence", summary: "Threat assessment and federal coordination", metric: "3 countries" },
  "sec-drones": { label: "Counter-drone", summary: "Airspace, detection, and response", metric: "16 venues" },
  "broad-cameras": { label: "TV cameras", summary: "Host-feed production" },
  "broad-hbs": { label: "HBS", summary: "Host broadcaster and global integration" },
  "broad-ibc": { label: "IBC Dallas", summary: "Nerve center for TV, radio, and new media" },
  "broad-rights": { label: "TV rights", summary: "Licenses by territory and platform" },
  "broad-studios": { label: "Mobile studios", summary: "Unilaterals, commentary, and mixed zones", metric: "16 venues" },
  "broad-distribution": { label: "Distribution", summary: "Fiber, satellite, CDN, and streaming" },
  "venue-pitch": { label: "Pitch", summary: "Turf, grow-in, install, and maintenance" },
  "venue-overlay": { label: "Temporary overlay", summary: "Tents, compound, fencing, and structures" },
  "venue-owner": { label: "Owners", summary: "Public, private, and leased assets" },
  "venue-operator": { label: "Operators", summary: "Standing staff + FIFA integration" },
  "venue-access": { label: "Accessibility", summary: "ADC, sign language, sensory, and mobility" },
  "venue-sustain": { label: "Sustainability", summary: "Waste, water, energy, and rights" },
  "team-players": { label: "Players", summary: "26 footballers per national team" },
  "team-delegates": { label: "Delegations", summary: "Coaches, doctors, analysts, and admin" },
  "team-kit": { label: "Kit vans", summary: "Equipment, colors, and match preparation" },
  "team-buses": { label: "Escorted buses", summary: "Protected transfers at cut-off" },
  "team-camps": { label: "Base Camps", summary: "Hotel + training site + operations" },
  "team-logistics": { label: "Logistics", summary: "Freight, customs, and team equipment" },
  "cer-flags": { label: "Giant flags", summary: "Manufacturing, logistics, and volunteers" },
  "cer-pyro": { label: "Fireworks and pyrotechnics", summary: "Design, permits, environment, and firing", metric: "country colors" },
  "cer-opening": { label: "Opening", summary: "Balich, artists, and stage production" },
  "cer-music": { label: "Sonic IDs", summary: "Local producers and rights clearance" },
  "cer-protocol": { label: "Protocol", summary: "Anthems, dignitaries, and sequence" },
  "cer-rehearsal": { label: "Rehearsals", summary: "Blocking, cues, safety, and contingencies", metric: "multi-day" },
  "tech-var": { label: "VAR", summary: "Replay, communication, and decision support" },
  "tech-saot": { label: "Semi-automated offside", summary: "Body tracking and connected ball", metric: "16 cameras" },
  "tech-glt": { label: "Goal-line", summary: "Automatic goal detection", metric: "14 cameras" },
  "tech-ball": { label: "Connected ball", summary: "IMU and kick-point detection" },
  "tech-network": { label: "Network and fiber", summary: "Private 5G, endpoints, and radios" },
  "tech-ai": { label: "AI & avatars", summary: "Football AI Pro and 3D visualization" },
  "hosp-tickets": { label: "Tickets", summary: "Sales, payment, seat map, and resale" },
  "hosp-premium": { label: "Premium", summary: "Suites, lounges, and guests" },
  "hosp-food": { label: "Food", summary: "Kitchen, stock, F&B, and food safety", metric: "700+ menus" },
  "hosp-retail": { label: "Retail", summary: "Licensing, stock, POS, and royalties" },
  "hosp-hotels": { label: "Lodging", summary: "Hotels, Airbnb, and team hotels" },
  "hosp-fanfest": { label: "Fan Festivals", summary: "Screens, culture, security, and vendors" },
  "gov-fifa": { label: "Central FIFA", summary: "Rules, competition, brand, rights, and standards" },
  "gov-fwc26": { label: "FWC26 delivery", summary: "Operational and functional venue integration" },
  "gov-toc": { label: "TOC Miami", summary: "Tournament cockpit, command, and escalation" },
  "gov-associations": { label: "Host associations", summary: "Canada Soccer, FMF, and U.S. Soccer" },
  "gov-host-cities": { label: "Host Cities", summary: "Committees, agencies, and local alliances" },
  "gov-crisis": { label: "Crisis and continuity", summary: "Incident management, communications, and recovery" },
  "ent-network": { label: "Private networks", summary: "Fiber, radio, private 5G, endpoints, and observability" },
  "ent-cloud": { label: "Cloud and datacenters", summary: "Compute, storage, edge, backups, and resilience", metric: "multi-region" },
  "ent-identity": { label: "Identity and access", summary: "Accreditation, zones, devices, and background checks" },
  "ent-workforce": { label: "Workforce systems", summary: "Scheduling, training, collaboration, and support" },
  "ent-soc": { label: "SOC and cybersecurity", summary: "Threat intel, detection, response, and forensics" },
  "ent-support": { label: "Service desk", summary: "Devices, onsite support, spare pool, and escalation" },
  "med-teams": { label: "Team medicine", summary: "Doctors, physios, nutrition, and recovery" },
  "med-venue": { label: "Stadium posts", summary: "First aid, AED, triage, and spectator care" },
  "med-ems": { label: "Ambulances and EMS", summary: "Prehospital response and transfers" },
  "med-hospitals": { label: "Referral hospitals", summary: "Trauma, emergencies, coordination, and capacity planning" },
  "med-antidoping": { label: "Anti-doping", summary: "Selection, chain of custody, and labs" },
  "med-public-health": { label: "Public health", summary: "Heat, epidemiology, food, and health communications" },
  "tr-air": { label: "Aviation and airports", summary: "Slots, terminals, security, baggage, and contingencies" },
  "tr-border": { label: "Borders and customs", summary: "Visas, immigration, customs, and sensitive materials" },
  "tr-teams": { label: "Team mobility", summary: "Buses, escorts, kit vans, and protected routes" },
  "tr-public": { label: "Public transport", summary: "Rail, metro, buses, ferries, and service plans", metric: "16 venues" },
  "tr-freight": { label: "Freight and depots", summary: "Cargo, warehouses, customs, and venue delivery" },
  "tr-last-mile": { label: "Last mile", summary: "Shuttles, parking, traffic, rideshare, and wayfinding" },
  "acc-team-hotels": { label: "Team hotels", summary: "Rooming, security, privacy, and nutrition" },
  "acc-official-hotels": { label: "FIFA and officials", summary: "FIFA delegations, referees, sponsors, and media" },
  "acc-catering": { label: "Catering", summary: "Production, transport, service, and cleaning" },
  "acc-nutrition": { label: "Sports nutrition", summary: "Menus, allergies, supplements, and performance" },
  "acc-housekeeping": { label: "Housekeeping and laundry", summary: "Rooms, kits, linens, waste, and hygiene" },
  "acc-food-safety": { label: "Food safety", summary: "Inspection, traceability, temperatures, and recall" },
  "fan-ticketing": { label: "Ticketing", summary: "Account, purchase, seat map, delivery, and support" },
  "fan-payments": { label: "Payments and fraud", summary: "Acquiring, risk, chargebacks, and reconciliation" },
  "fan-entry": { label: "Entry and validation", summary: "Turnstiles, troubleshooting, queues, and accessibility" },
  "fan-services": { label: "Spectator services", summary: "Information, lost and found, and issue resolution" },
  "fan-festivals": { label: "Fan Festivals", summary: "Screens, culture, vendors, security, and cleaning" },
  "fan-accessibility": { label: "Accessibility", summary: "ADC, haptic boards, sensory, mobility, and seating" },
  "brand-system": { label: "Brand system", summary: "Emblem, type, color, guidelines, and approvals" },
  "brand-host": { label: "Host identities", summary: "Posters, local culture, templates, and city dressing" },
  "brand-music": { label: "Music and Sonic IDs", summary: "Composition, production, rights, and masters" },
  "brand-content": { label: "Photo, video, and social", summary: "Editorial, creators, capture, post, and distribution" },
  "brand-campaigns": { label: "Campaigns", summary: "Strategy, media, adaptations, and measurement" },
  "brand-protection": { label: "Brand protection", summary: "Permits, de-branding, monitoring, and enforcement" },
  "com-partners": { label: "FIFA Partners", summary: "Top-tier contracts and global rights" },
  "com-activations": { label: "Activations", summary: "Concept, build, staffing, hospitality, and leads" },
  "com-licensing": { label: "Licensing", summary: "Categories, approvals, royalties, and compliance" },
  "com-manufacturing": { label: "Manufacturing", summary: "Textiles, souvenirs, packaging, and quality control" },
  "com-retail": { label: "Retail", summary: "Stock, POS, stores, e-commerce, and returns" },
  "com-equipment": { label: "Ball and equipment", summary: "Design, connected ball, kits, and distribution" },
  "sus-climate": { label: "Climate and carbon", summary: "Inventory, reduction, travel, and reporting" },
  "sus-resources": { label: "Energy, water, and waste", summary: "Plans, metering, vendors, and diversion" },
  "sus-sourcing": { label: "Responsible sourcing", summary: "Clauses, due diligence, and supplier monitoring" },
  "sus-human-rights": { label: "Human rights", summary: "Risks, defenders, media, labor, and grievance" },
  "sus-community": { label: "Community and legacy", summary: "Local programs, inclusion, and lasting benefits" },
  "sus-reporting": { label: "Reporting and audit", summary: "KPIs, evidence, assurance, and publication" },
  "fin-budget": { label: "Budget and FP&A", summary: "Business cases, forecast, control, and reporting" },
  "fin-procurement": { label: "Procurement and RFP", summary: "Sourcing, tenders, evaluation, and vendor management", metric: "public/private" },
  "fin-contracts": { label: "Legal and contracts", summary: "Venue, media, vendors, IP, privacy, and claims" },
  "fin-insurance": { label: "Insurance and risk", summary: "Liability, cancellation, accidents, and crisis" },
  "fin-payments": { label: "Invoices and payments", summary: "PO, receipt, invoice, approval, treasury, and reconcile" },
  "fin-audit": { label: "Audit and close-out", summary: "Close-out, grants, taxes, evidence, and legacy" },
};

const en = deepTr(es);

en.clusters = [
  { id: "direction", label: "Direction and control", subtitle: "Governance · money · impact" },
  { id: "competition", label: "Competition", subtitle: "Match · teams · ceremony" },
  { id: "tech-media", label: "Technology and signal", subtitle: "Refereeing · platforms · broadcast" },
  { id: "city-operation", label: "City and operations", subtitle: "Stadiums · security · health · mobility" },
  { id: "experience", label: "Experience and services", subtitle: "Fans · hospitality · lodging" },
  { id: "brand-business", label: "Brand and business", subtitle: "Content · sponsors · retail" },
];

en.editorial = {
  overview: {
    eyebrow: "FIFA WORLD CUP 2026 · OPERATIONAL ATLAS",
    title: "300,000 people. 104 matches. One system.",
    description:
      "Explore who requested, paid for, designed, manufactured, regulated, and operated each piece of the World Cup.",
  },
  areas: {
    eyebrow: "18 OPERATIONAL DOMAINS",
    title: "The World Cup, split by systems.",
    description:
      "Open any area without hunting through the swarm. Each domain connects people, organizations, processes, countries, and evidence.",
  },
  matches: {
    eyebrow: "ENTER WITHOUT GETTING LOST",
    title: "A match is a temporary city.",
    description:
      "Pick a matchday moment and the map will automatically focus the organizations, people, and processes that make it possible.",
  },
  venues: {
    eyebrow: "16 VENUES · 3 COUNTRIES",
    title: "The host-city brand does not always match the real city.",
    description:
      "Dallas plays in Arlington, Boston in Foxborough, and San Francisco Bay Area in Santa Clara. Open a venue to see who owns, operates, pays, and regulates.",
  },
  people: {
    eyebrow: "HUMAN CENSUS",
    title: "There is no single people number.",
    description:
      "We separate accredited staff, expanded operations, and the global chain to avoid double-counting people who held more than one role.",
  },
  evidence: {
    eyebrow: "TRACEABILITY",
    title: "Atlas reference index.",
    description:
      "Each point appears as an independent block with its sources linked one under another. Confidence colors stay visible on the map.",
  },
};

en.topStats = [
  ["104", "matches"],
  ["48", "national teams"],
  ["18", "operational domains"],
  ["16", "venues"],
  ["3", "countries"],
  ["126", "research sources"],
  ["600+", "official sites"],
  ["220+", "territories with coverage"],
  ["13 PB", "data processed"],
  ["7.7M+", "Fan Festivals"],
];

en.nodes = en.nodes.map((node) => ({
  ...node,
  ...(domainOverrides[node.id] ?? {}),
  peopleNamed: (node.peopleNamed ?? []).map((person) => ({
    ...person,
    role: tr(person.role),
  })),
  organizations: (node.organizations ?? []).map(tr),
  sources: (domainOverrides[node.id]?.sources ?? node.sources ?? []).map(tr),
}));

const parentLabelByEs = Object.fromEntries(
  es.nodes.map((node) => [node.label, domainOverrides[node.id]?.label ?? tr(node.label)]),
);

en.details = es.details.map((detail) => {
  const override = detailOverrides[detail.id] ?? {};
  const label = override.label ?? tr(detail.label);
  const parentMatch = detail.people?.match(/rango de\s+(.+)$/);
  const parentEn = parentMatch
    ? parentLabelByEs[parentMatch[1]] ?? tr(parentMatch[1])
    : "domain";
  const people =
    override.people ??
    (detail.people?.startsWith("Estimación no separada")
      ? `Estimate not separated: included in the range of ${parentEn}`
      : detail.people?.startsWith("Estimación:")
        ? tr(detail.people)
        : tr(detail.people));
  const metric = override.metric ?? tr(detail.metric);
  return {
    id: detail.id,
    label,
    summary: override.summary ?? tr(detail.summary),
    people,
    metric,
    facts: [
      metric,
      `Part of ${parentEn}`,
      "Open to follow the operational chain",
    ],
  };
});

const hostOverrides = {
  toronto: {
    interface: "City of Toronto FIFA World Cup 2026 municipal secretariat",
    ownerOperator: "City of Toronto · operated by MLSE",
    publicLayer: "Toronto + Ontario + Canada",
    mobility: "TTC, Metrolinx/GO, UP Express, and MTO",
    finance: "CAD 380 million direct: operating + capital",
    sourceLabel: "City of Toronto · World Cup documentation",
  },
  vancouver: {
    interface: "British Columbia–City of Vancouver–PavCo consortium",
    leaders: ["Distributed public leadership; no single CEO"],
    ownerOperator: "Province of British Columbia · PavCo",
    publicLayer: "Province + city + First Nations + Canada",
    mobility: "TransLink and SkyTrain",
    finance: "Estimated net provincial cost CAD 90–114 million",
    sourceLabel: "Vancouver FIFA World Cup 26",
  },
  "mexico-city": {
    city: "Mexico City",
    interface: "Mexico City World Cup Committee",
    leaders: ["Clara Brugada · Head of Government"],
    ownerOperator: "Private stadium operator",
    publicLayer: "Federal government + Mexico City + boroughs",
    mobility: "Metro, Metrobús, Light Rail, RTP, AICM, and AIFA",
    finance: "Public opening-match operations; distributed urban budget",
    sourceLabel: "Mexico City Government",
  },
  guadalajara: {
    interface: "Jalisco–Zapopan–local committee coordination",
    leaders: ["Juan José Frangie · designated public lead"],
    ownerOperator: "Private venue linked to Chivas/Grupo Omnilife",
    publicLayer: "Jalisco + Zapopan + metro area",
    mobility: "SITEUR, Mi Macro, buses, and shuttles",
    finance: "Consolidated budget not published",
  },
  monterrey: {
    interface: "Monterrey 2026 Organizing Committee",
    leaders: ["Pedro Esquivel · identified public lead"],
    ownerOperator: "Rayados / FEMSA ecosystem",
    publicLayer: "Nuevo León + Guadalupe + metro area",
    mobility: "Metrorrey, Transmetro, and road operations",
    finance: "Line items split across state, municipalities, and operator",
  },
  atlanta: {
    finance: "State funds and federal grants; total not consolidated",
  },
  boston: {
    ownerOperator: "Kraft Group · private venue",
    finance: "Local security reported; full budget not published",
  },
  dallas: {
    finance: "USD 51.5m FEMA + USD 10.03m FTA; also hosts the IBC",
  },
  houston: {
    ownerOperator: "Harris County/HCHSA · contracted management",
    finance: "USD 9.092m FTA; security in separate line items",
  },
  "kansas-city": {
    finance: "USD 79.36m in reported federal programs",
  },
  "los-angeles": {
    city: "Los Angeles",
    finance: "Federal/state grants; total not consolidated",
  },
  miami: {
    finance: "Approved services and subsidies; close-out pending",
  },
  nynj: {
    city: "New York/New Jersey",
    finance: "Extraordinary costs; final reconciliation pending",
  },
  philadelphia: {
    finance: "USD 8.47m FTA + separate security and contributions",
  },
  "san-francisco": {
    publicLayer: "Nine-county region + Santa Clara",
    finance: "≈USD 51.1m FEMA + USD 8.8m FTA reported",
  },
  seattle: {
    finance: "USD 8.4m FTA + USD 45m state funds",
  },
};

en.hostCities = es.hostCities.map((group) => ({
  country: tr(group.country),
  cities: group.cities.map((city) => {
    const override = hostOverrides[city.id] ?? {};
    return {
      ...deepTr(city),
      ...override,
      country: tr(city.country),
      city:
        override.city ??
        city.city
          .replace("Los Ángeles", "Los Angeles")
          .replace("Nueva York/Nueva Jersey", "New York/New Jersey")
          .replace("Ciudad de México", "Mexico City"),
      sourceLabel: override.sourceLabel ?? tr(city.sourceLabel),
    };
  }),
}));

const outPath = join(root, "app/i18n/content.en.json");
writeFileSync(outPath, JSON.stringify(en, null, 2));
console.log(`Wrote ${outPath}`);
console.log({
  clusters: en.clusters.length,
  nodes: en.nodes.length,
  details: en.details.length,
  hosts: en.hostCities.reduce((n, g) => n + g.cities.length, 0),
});
