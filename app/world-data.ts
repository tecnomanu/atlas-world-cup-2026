export type Layer = "fifa" | "government" | "supplier" | "mixed";
export type NodeKind = "root" | "domain" | "detail";
export type EvidenceStatus = "confirmed" | "derived" | "estimated" | "private" | "future";

export type NamedPerson = {
  name: string;
  role: string;
};

export type AtlasNode = {
  id: string;
  label: string;
  shortLabel?: string;
  x: number;
  y: number;
  radius: number;
  color: "lime" | "cyan" | "coral" | "slate";
  layer: Layer;
  kind: NodeKind;
  parent?: string;
  metric?: string;
  eyebrow: string;
  summary: string;
  people?: string;
  facts: string[];
  areas?: string[];
  evidence?: EvidenceStatus;
  organizations?: string[];
  peopleNamed?: NamedPerson[];
  countries?: string[];
  chain?: string[];
  sources?: { label: string; url: string }[];
};

export type AtlasEdge = {
  from: string;
  to: string;
  strength?: "main" | "soft" | "cross";
};

export type AtlasCluster = {
  id: string;
  label: string;
  subtitle: string;
  color: "lime" | "cyan" | "coral" | "slate";
  hubX: number;
  hubY: number;
  labelX: number;
  labelY: number;
  hull: string;
  domains: string[];
};

const source = {
  numbers: {
    label: "FIFA · Cifras operativas del torneo",
    url: "https://inside.fifa.com/organisation/media-releases/packed-stadiums-record-digital-reach-world-cup-2026-numbers-unprecedented-scale",
  },
  ceremonies: {
    label: "FIFA · Ceremonias previas y banderas",
    url: "https://inside.fifa.com/organisation/media-releases/debut-fan-centric-pre-match-ceremony-world-cup-2026",
  },
  broadcast: {
    label: "FIFA · Ecosistema global de broadcast",
    url: "https://inside.fifa.com/media-releases/world-cup-2026-broadcast-partnerships-global-benchmark-record-reach-innovation",
  },
  teams: {
    label: "FIFA · Team Base Camps",
    url: "https://inside.fifa.com/organisation/media-releases/world-cup-2026-team-base-camps-tbc-48-nations-usa-mexico-canada",
  },
  tech: {
    label: "FIFA · Tecnología arbitral 2026",
    url: "https://inside.fifa.com/news/offside-decisions-referee-body-cams-innovation-world-cup-2026",
  },
  security: {
    label: "FIFA · Balance de fase de grupos",
    url: "https://inside.fifa.com/organisation/news/records-world-cup-2026-group-stage-sets-new-benchmark",
  },
  venues: {
    label: "FIFA · Las 16 sedes",
    url: "https://fifaworldcup26.suites.fifa.com/venues/",
  },
  sustainability: {
    label: "FIFA · Estrategia de sostenibilidad y derechos humanos 2026",
    url: "https://inside.fifa.com/tournament-organisation/world-cup-2026-sustainability-strategy",
  },
  sourcing: {
    label: "FIFA · Código de abastecimiento sostenible",
    url: "https://inside.fifa.com/sustainability/sourcing-code",
  },
  compliance: {
    label: "FIFA · Programa de compliance",
    url: "https://inside.fifa.com/legal/compliance/compliance-program",
  },
  legal: {
    label: "FIFA · Área legal",
    url: "https://inside.fifa.com/legal",
  },
  operations: {
    label: "FIFA · Tournament Operations Centre e Intelligent Command Centre",
    url: "https://inside.fifa.com/organisation/president/news/tournament-operation-center-world-cup-2026-miami-infatino",
  },
  volunteers: {
    label: "FIFA · Programa de voluntariado 2026",
    url: "https://inside.fifa.com/media-releases/applications-now-open-world-cup-26-volunteer-programme",
  },
  referees: {
    label: "FIFA · Oficiales de partido seleccionados",
    url: "https://inside.fifa.com/media-releases/fifa-world-cup-2026-match-referees-appointed",
  },
  logistics: {
    label: "FIFA · Rock-it Cargo, proveedor logístico oficial",
    url: "https://inside.fifa.com/news/fifa-rock-it-cargo-official-logistics-provider-world-cup-26",
  },
  accessibility: {
    label: "FIFA · Accesibilidad e inclusión",
    url: "https://inside.fifa.com/organisation/news/accessibility-world-cup-2026-disability-social-inclusion",
  },
  medical: {
    label: "FIFA · Equipos y estándares médicos 2026",
    url: "https://inside.fifa.com/news/history-made-world-cup-2026-all-female-medical-team",
  },
  brand: {
    label: "FIFA · Identidad oficial de marca 2026",
    url: "https://inside.fifa.com/media-releases/fifa-world-cup-26-tm-official-brand-unveiled-in-a-celebration-of-football",
  },
  hospitality: {
    label: "FIFA · On Location, hospitality oficial",
    url: "https://inside.fifa.com/organisation/media-releases/on-location-appointed-as-official-hospitality-provider-of-the-fifa-world-cup-26",
  },
  retail: {
    label: "FIFA · Fanatics, retail y merchandising",
    url: "https://inside.fifa.com/media-releases/fanatics-exclusive-collectibles-trading-cards-stickers-games",
  },
  finance: {
    label: "FIFA · Chief Finance Officer",
    url: "https://inside.fifa.com/news/thomas-peyer-appointed-fifa-chief-finance-officer-2830404",
  },
};

const domainSeeds: AtlasNode[] = [
  {
    id: "world-cup",
    label: "Mundial 2026",
    x: 820,
    y: 500,
    radius: 94,
    color: "lime",
    layer: "mixed",
    kind: "root",
    metric: "≈300.000 acreditados",
    eyebrow: "EL SISTEMA COMPLETO",
    summary:
      "Una organización temporal y global que conecta competición, gobiernos, estadios, tecnología, proveedores, medios y servicios públicos.",
    people: "≈300.000 personas formalmente acreditadas",
    facts: [
      "104 partidos y 48 selecciones",
      "16 sedes en Canadá, México y Estados Unidos",
      "Más de 600 sitios oficiales",
      "Cadena global estimada: 500.000–1.200.000 personas",
    ],
    areas: ["Dirección", "Finanzas", "Compras", "Legal", "Ambiente", "Personas", "Riesgo", "Proveedores"],
    evidence: "confirmed",
    organizations: ["FIFA", "FIFA World Cup 2026", "Canada Soccer", "Federación Mexicana de Fútbol", "U.S. Soccer", "16 Host City interfaces"],
    peopleNamed: [
      { name: "Gianni Infantino", role: "Presidente de FIFA" },
      { name: "Mattias Grafström", role: "Secretario general de FIFA" },
      { name: "Heimo Schirgi", role: "Chief Operating Officer, FIFA World Cup 2026" },
    ],
    countries: ["Canadá", "México", "Estados Unidos", "Suiza", "Cadena global"],
    chain: ["FIFA", "FWC26", "País anfitrión", "Host City", "Venue", "Proveedor"],
    sources: [source.numbers, source.venues],
  },
  {
    id: "matches",
    label: "Competición",
    x: 1000,
    y: 160,
    radius: 58,
    color: "lime",
    layer: "fifa",
    kind: "domain",
    metric: "104",
    eyebrow: "COMPETICIÓN",
    summary:
      "Cada partido es una empresa efímera: empieza días antes y termina después del cierre financiero, técnico y de seguridad.",
    people: "13.700–25.000 posiciones alrededor de un partido mayor",
    facts: [
      "170 oficiales de partido",
      "1.248 jugadores",
      "Anatomía operativa desde −72 horas hasta desmovilización",
    ],
    areas: ["Competición", "Finanzas", "Venue", "Seguridad", "Medicina", "Broadcast", "Protocolo"],
    evidence: "confirmed",
    organizations: ["FIFA Competition Management", "FIFA Refereeing", "FWC26", "Participating Member Associations"],
    peopleNamed: [{ name: "Pierluigi Collina", role: "Presidente del Comité de Árbitros de FIFA" }],
    countries: ["Canadá", "México", "Estados Unidos"],
    chain: ["Planificación", "Venue readiness", "Ceremonia", "Juego", "Egreso", "Cierre"],
    sources: [source.numbers],
  },
  {
    id: "security",
    label: "Seguridad",
    x: 1000,
    y: 845,
    radius: 68,
    color: "coral",
    layer: "government",
    kind: "domain",
    metric: "20.000+",
    eyebrow: "PROTECCIÓN MULTINIVEL",
    summary:
      "FIFA Safety & Security, stewards, privados, policías, inteligencia, tránsito, counter-drone, bomberos y emergencias.",
    people: "20.000+ integrantes de seguridad confirmados en fase de grupos",
    facts: [
      "265.369 turnos de seguridad",
      "Capas federal, estatal/provincial y local",
      "Cybersecurity y command centres conectados",
    ],
    areas: ["Policía", "Inteligencia", "Legal", "Permisos", "Riesgo", "Seguridad privada", "EMS"],
    evidence: "confirmed",
    organizations: ["FIFA Safety & Security", "Policías locales", "Agencias federales", "Bomberos", "Seguridad privada"],
    countries: ["Canadá", "México", "Estados Unidos"],
    chain: ["Threat assessment", "Permisos", "Background checks", "Rehearsals", "Operación", "After-action"],
    sources: [source.security],
  },
  {
    id: "broadcast",
    label: "Broadcast",
    x: 1320,
    y: 680,
    radius: 62,
    color: "cyan",
    layer: "supplier",
    kind: "domain",
    metric: "220+ territorios",
    eyebrow: "SEÑAL GLOBAL",
    summary:
      "HBS produce la señal anfitriona; decenas de Media Rights Licensees la personalizan y distribuyen a todo el planeta.",
    people: "Hasta 3.400 personas diarias en el IBC",
    facts: [
      "Más de 56 media partners dentro del IBC",
      "5.230 representantes de medios acreditados",
      "Más de 220 territorios con acuerdos",
    ],
    areas: ["Producción", "Derechos", "Finanzas", "Legal", "Tecnología", "Telecom", "Proveedores"],
    evidence: "confirmed",
    organizations: ["FIFA", "Host Broadcast Services", "IBC Dallas", "Media Rights Licensees"],
    peopleNamed: [
      { name: "Dan Miodownik", role: "CEO de HBS" },
      { name: "Luc Antoine Charial", role: "COO de HBS" },
    ],
    countries: ["Suiza", "Estados Unidos", "Más de 220 territorios"],
    chain: ["Cámaras", "Compound", "Señal anfitriona", "IBC", "Rights holder", "Audiencia"],
    sources: [source.broadcast, source.numbers],
  },
  {
    id: "venues",
    label: "Estadios",
    x: 1320,
    y: 330,
    radius: 66,
    color: "lime",
    layer: "mixed",
    kind: "domain",
    metric: "16 venues",
    eyebrow: "INFRAESTRUCTURA",
    summary:
      "Edificios públicos y privados, operadores habituales y un periodo de control FIFA que transforma completamente su funcionamiento.",
    people: "5.000–12.000 personas en preparación y transformación",
    facts: [
      "16 campos de estadio y 77 campos de entrenamiento",
      "300.000 m² de césped entre venues y training sites",
      "Temporary overlay para los 16 estadios",
    ],
    areas: ["Owner", "Operador", "Obras", "Compras", "Permisos", "Ambiente", "Seguros", "Proveedores"],
    evidence: "confirmed",
    organizations: ["FIFA Venue Management", "BaAM Productions", "16 propietarios", "16 operadores", "Autoridades locales"],
    countries: ["Canadá", "México", "Estados Unidos"],
    chain: ["Owner", "Operator", "Venue agreement", "Overlay", "Tournament mode", "Reinstatement"],
    sources: [source.venues],
  },
  {
    id: "teams",
    label: "Equipos",
    x: 1180,
    y: 225,
    radius: 62,
    color: "cyan",
    layer: "mixed",
    kind: "domain",
    metric: "48 selecciones",
    eyebrow: "DELEGACIONES",
    summary:
      "Jugadores y cuerpos técnicos viajan dentro de una burbuja logística de hoteles, campos base, kit vans, seguridad y transporte.",
    people: "3.776 personas directas; 8.600–16.800 con soporte ampliado",
    facts: [
      "1.248 jugadores y 2.528 delegados",
      "48 Team Base Camps",
      "6.310 transfers acumulados al corte investigado",
    ],
    areas: ["Federaciones", "Logística", "Finanzas", "Aduana", "Seguridad", "Hoteles", "Seguros"],
    evidence: "confirmed",
    organizations: ["48 federaciones", "FIFA Team Services", "Rock-it Cargo", "Hoteles y training sites"],
    countries: ["48 selecciones", "Canadá", "México", "Estados Unidos"],
    chain: ["Federación", "Delegación", "Base camp", "Hotel", "Kit", "Match travel"],
    sources: [source.teams, source.numbers],
  },
  {
    id: "ceremonies",
    label: "Ceremonias",
    x: 1390,
    y: 445,
    radius: 65,
    color: "coral",
    layer: "supplier",
    kind: "domain",
    metric: "10.000+ voluntarios",
    eyebrow: "ESPECTÁCULO",
    summary:
      "Banderas, música, artistas, pirotecnia, protocolo y tecnología convierten minutos de ceremonia en meses de producción.",
    people: "Alrededor de 140 personas visibles solo para dos banderas gigantes",
    facts: [
      "≈70 voluntarios por bandera nacional gigante",
      "Más de 200 movimientos logísticos de banners",
      "Balich Wonder Studio en ceremonias principales",
    ],
    areas: ["Creatividad", "Compras", "Legal", "Permisos", "Ambiente", "Seguridad", "Proveedores"],
    evidence: "confirmed",
    organizations: ["FIFA Ceremonies", "Balich Wonder Studio", "Host Cities", "Proveedores locales"],
    peopleNamed: [{ name: "Marco Balich", role: "Chairman de Balich Wonder Studio" }],
    countries: ["Italia", "Canadá", "México", "Estados Unidos"],
    chain: ["Idea", "Creative", "Permisos", "Fabricación", "Ensayo", "Show call"],
    sources: [source.ceremonies],
  },
  {
    id: "technology",
    label: "Tecnología arbitral",
    shortLabel: "Tech arbitral",
    x: 1390,
    y: 570,
    radius: 64,
    color: "cyan",
    layer: "supplier",
    kind: "domain",
    metric: "13 PB de datos",
    eyebrow: "INGENIERÍA INVISIBLE",
    summary:
      "Cámaras, fibra, pelota conectada, IA, ciberseguridad y sistemas arbitrales forman una plataforma crítica distribuida.",
    people: "1.500–4.000 personas en ingeniería central y soporte",
    facts: [
      "161.000 km de fibra",
      "30 cámaras técnicas dedicadas por estadio para SAOT + GLT",
      "Más de 1.000 millones de ataques bloqueados",
    ],
    areas: ["Producto", "Ingeniería", "Compras", "Legal", "Ciberseguridad", "Telecom", "Proveedores"],
    evidence: "confirmed",
    organizations: ["FIFA Innovation", "Lenovo", "Hawk-Eye Innovations", "Football Technology Centre AG", "adidas"],
    peopleNamed: [{ name: "Johannes Holzmüller", role: "Director of Football Technology & Innovation" }],
    countries: ["Suiza", "Reino Unido", "Alemania", "China", "Estados Unidos"],
    chain: ["Research", "Product", "Integración", "Calibración", "Operación 24/7", "Contingencia"],
    sources: [source.tech, source.numbers],
  },
  {
    id: "hospitality",
    label: "Hospitalidad",
    x: 250,
    y: 570,
    radius: 56,
    color: "slate",
    layer: "supplier",
    kind: "domain",
    metric: "27.969 acreditados",
    eyebrow: "EXPERIENCIA DEL FAN",
    summary:
      "Tickets, suites, hoteles, alimentos, accesibilidad, retail y atención al huésped componen otra empresa dentro del torneo.",
    people: "27.969 personas acreditadas de hospitality",
    facts: [
      "607.350 hospitality packages",
      "3.166 entornos premium activados",
      "Más de 700 menús premium",
    ],
    areas: ["Comercial", "Finanzas", "Compras", "Food safety", "Personas", "Accesibilidad", "Proveedores"],
    evidence: "confirmed",
    organizations: ["FIFA", "On Location", "Operadores de suites y lounges", "Catering y protocolo"],
    countries: ["Canadá", "México", "Estados Unidos"],
    chain: ["Producto", "Venta", "Guest data", "Venue", "Servicio", "Conciliación"],
    sources: [source.numbers],
  },
  {
    id: "governance",
    label: "Gobernanza",
    x: 820,
    y: 110,
    radius: 62,
    color: "lime",
    layer: "mixed",
    kind: "domain",
    metric: "3 países · 16 sedes",
    eyebrow: "DIRECCIÓN Y COORDINACIÓN",
    summary: "FIFA, FWC26, federaciones anfitrionas, Host Cities y gobiernos coordinan una organización temporal con múltiples centros de decisión.",
    people: "Estimación: 2.000–6.000 posiciones de dirección, PMO, command centres y coordinación pública",
    facts: ["Tournament Operations Centre en Miami", "16 interfaces locales con formas jurídicas diferentes", "Gobernanza federal, estatal/provincial y municipal"],
    areas: ["Dirección", "PMO", "Gobierno", "Crisis", "Comunicaciones", "Legal", "Finanzas"],
    evidence: "confirmed",
    organizations: ["FIFA", "FWC26", "Canada Soccer", "FMF", "U.S. Soccer", "16 Host Committees/Secretariats"],
    peopleNamed: [
      { name: "Gianni Infantino", role: "Presidente de FIFA" },
      { name: "Mattias Grafström", role: "Secretario general" },
      { name: "Heimo Schirgi", role: "COO FIFA World Cup 2026" },
    ],
    countries: ["Suiza", "Canadá", "México", "Estados Unidos"],
    chain: ["FIFA Council", "FWC26", "Host Association", "Host City", "Gobierno", "Venue", "Proveedor"],
    sources: [source.operations, source.numbers],
  },
  {
    id: "enterprise-tech",
    label: "Tecnología empresarial",
    shortLabel: "Tech empresarial",
    x: 1180,
    y: 780,
    radius: 61,
    color: "cyan",
    layer: "supplier",
    kind: "domain",
    metric: "600+ sitios",
    eyebrow: "PLATAFORMAS Y CIBERSEGURIDAD",
    summary: "Redes privadas, nube, identidad, acreditación, dispositivos, workforce systems y centros de monitoreo mantienen conectado el torneo.",
    people: "Estimación: 1.500–4.000 personas; superposición con broadcast y workforce FIFA",
    facts: ["161.000 km de fibra", "Más de 1.000 millones de ataques bloqueados", "Sistemas en más de 600 sitios oficiales"],
    areas: ["Arquitectura", "Nube", "Redes", "Identidad", "Soporte", "Ciberseguridad", "Datos"],
    evidence: "confirmed",
    organizations: ["FIFA Technology", "Lenovo", "Salesforce", "Verizon", "Integradores locales"],
    countries: ["Estados Unidos", "China", "Suiza", "Cadena global"],
    chain: ["Arquitectura", "Procurement", "Integración", "Hardening", "Monitoreo", "Respuesta", "Recuperación"],
    sources: [source.numbers, source.tech, source.compliance],
  },
  {
    id: "medical",
    label: "Salud y medicina",
    x: 820,
    y: 885,
    radius: 59,
    color: "coral",
    layer: "mixed",
    kind: "domain",
    metric: "16 redes médicas",
    eyebrow: "DEPORTE, PÚBLICO Y SALUD",
    summary: "Medicina de equipos y árbitros, primeros auxilios, ambulancias, hospitales, antidopaje, salud pública y protocolos climáticos.",
    people: "Estimación: 8.000–20.000 profesionales y puestos médicos en el torneo ampliado",
    facts: ["Hospitales de referencia por sede", "Capas separadas para participantes y público", "Vigilancia de calor, alimentos y enfermedades"],
    areas: ["FIFA Medical", "EMS", "Hospitales", "Salud pública", "Antidopaje", "Food safety", "Mental health"],
    evidence: "estimated",
    organizations: ["FIFA Medical", "Team medical staff", "EMS locales", "Hospitales de referencia", "Autoridades sanitarias"],
    countries: ["Canadá", "México", "Estados Unidos"],
    chain: ["Plan médico", "Credentialing", "Puestos", "Triage", "Traslado", "Hospital", "Reporte"],
    sources: [source.medical, source.numbers],
  },
  {
    id: "transport",
    label: "Transporte y logística",
    x: 640,
    y: 845,
    radius: 62,
    color: "slate",
    layer: "mixed",
    kind: "domain",
    metric: "3 países · última milla",
    eyebrow: "MOVILIDAD Y CARGA",
    summary: "Fronteras, aviación, aduanas, buses, transporte público, shuttles, depósitos, freight y rutas de contingencia.",
    people: "Estimación: 25.000–80.000 posiciones entre movilidad, aeropuertos, carga y tránsito",
    facts: ["6.310 movimientos de equipos al corte", "2.321 traslados escoltados", "Redes públicas y privadas coordinadas por sede"],
    areas: ["Aviación", "Migraciones", "Aduana", "Freight", "Transit", "Traffic", "Fleet"],
    evidence: "confirmed",
    organizations: ["Rock-it Cargo/GCL", "Hyundai–Kia", "Agencias de transporte", "Aeropuertos", "Policías de tránsito"],
    countries: ["Canadá", "México", "Estados Unidos", "Cadena logística global"],
    chain: ["Forecast", "Permiso", "Booking", "Aduana", "Depósito", "Ruta", "Última milla", "Retorno"],
    sources: [source.logistics, source.teams, source.numbers],
  },
  {
    id: "accommodation",
    label: "Alojamiento y alimentación",
    shortLabel: "Alojamiento",
    x: 460,
    y: 780,
    radius: 59,
    color: "slate",
    layer: "supplier",
    kind: "domain",
    metric: "hoteles · catering",
    eyebrow: "VIVIR Y ALIMENTAR EL TORNEO",
    summary: "Hoteles, rooming, cocinas, nutrición deportiva, limpieza, lavandería, trazabilidad alimentaria y residuos.",
    people: "Estimación: 40.000–120.000 personas en hotelería, alimentación y servicios asociados",
    facts: ["48 Team Base Camps", "Hoteles diferenciados para equipos, árbitros, FIFA y medios", "Operación alimentaria con controles de salud"],
    areas: ["Hoteles", "Catering", "Nutrición", "Housekeeping", "Lavandería", "Food safety", "Residuos"],
    evidence: "estimated",
    organizations: ["Hoteles base", "Marriott Bonvoy", "Airbnb", "Caterers", "Autoridades sanitarias"],
    countries: ["Canadá", "México", "Estados Unidos"],
    chain: ["Forecast", "Contrato", "Rooming", "Abastecimiento", "Servicio", "Control sanitario", "Conciliación"],
    sources: [source.teams, source.numbers],
  },
  {
    id: "fans",
    label: "Fans y accesibilidad",
    shortLabel: "Fans",
    x: 320,
    y: 680,
    radius: 60,
    color: "lime",
    layer: "mixed",
    kind: "domain",
    metric: "6,2M+ tickets",
    eyebrow: "ENTRADAS Y EXPERIENCIA",
    summary: "Ticketing, pagos, fraude, ingreso, Fan Festivals, información multilingüe, movilidad y servicios de accesibilidad.",
    people: "Estimación: 15.000–40.000 posiciones directas de ticketing, fan services y accesibilidad",
    facts: ["7,7 millones de visitas a Fan Festivals", "Audio descripción y tableros hápticos", "Sensory bags y formación inclusiva"],
    areas: ["Ticketing", "Pagos", "Guest services", "Fan Festival", "Accesibilidad", "Fraude", "Información"],
    evidence: "confirmed",
    organizations: ["FIFA Ticketing", "Host Cities", "KultureCity", "Payment partners", "Venue guest services"],
    countries: ["Canadá", "México", "Estados Unidos"],
    chain: ["Registro", "Compra", "Pago", "Ticket", "Viaje", "Ingreso", "Experiencia", "Soporte"],
    sources: [source.accessibility, source.numbers],
  },
  {
    id: "brand",
    label: "Marca y contenidos",
    x: 250,
    y: 445,
    radius: 59,
    color: "cyan",
    layer: "supplier",
    kind: "domain",
    metric: "16 identidades locales",
    eyebrow: "DISEÑO, MÚSICA Y MEDIOS PROPIOS",
    summary: "Arquitectura de marca, emblema, posters, música, campañas, contenidos, creators, decoración urbana y clean zones.",
    people: "Estimación: 5.000–20.000 personas en la cadena creativo-productiva global",
    facts: ["Sistema común con 16 expresiones Host City", "Sonic IDs y producción local", "Brand protection y de-branding de venues"],
    areas: ["Brand strategy", "Diseño", "Música", "Contenido", "Social", "Derechos", "City dressing"],
    evidence: "confirmed",
    organizations: ["FIFA Brand", "Moment Factory", "This Is Catapult", "Agencias locales", "Host Cities"],
    countries: ["Estados Unidos", "Canadá", "México", "Cadena creativa global"],
    chain: ["Estrategia", "Concepto", "Derechos", "Producción", "Adaptación", "Aprobación", "Publicación"],
    sources: [source.brand, source.numbers],
  },
  {
    id: "commercial",
    label: "Sponsors y retail",
    shortLabel: "Sponsors & retail",
    x: 320,
    y: 330,
    radius: 60,
    color: "lime",
    layer: "supplier",
    kind: "domain",
    metric: "20+ socios globales",
    eyebrow: "DERECHOS COMERCIALES",
    summary: "Patrocinios, licencias, activaciones, equipamiento, pelota, productos, fabricación, tiendas, pagos y royalties.",
    people: "Estimación: 20.000–100.000 personas en activaciones, fabricación, distribución y retail",
    facts: ["Jerarquías FIFA Partner/Sponsor/Supporter", "Fanatics opera retail onsite", "Fabricación y distribución multinacional"],
    areas: ["Sales", "Partnerships", "Licensing", "Retail", "Manufacturing", "Payments", "Brand protection"],
    evidence: "confirmed",
    organizations: ["FIFA Commercial", "Fanatics", "adidas", "Visa", "Coca-Cola", "Sponsors y licensees"],
    countries: ["Estados Unidos", "Alemania", "China", "Arabia Saudita", "Catar", "Cadena global"],
    chain: ["Categoría", "Contrato", "Derechos", "Concepto", "Producción", "Activación", "Venta", "Royalty"],
    sources: [source.retail, source.numbers],
  },
  {
    id: "sustainability",
    label: "Sostenibilidad y DD.HH.",
    shortLabel: "Sostenibilidad",
    x: 460,
    y: 225,
    radius: 61,
    color: "coral",
    layer: "mixed",
    kind: "domain",
    metric: "4 pilares",
    eyebrow: "AMBIENTE, DERECHOS Y LEGADO",
    summary: "Clima, energía, agua, residuos, compras responsables, trabajo, inclusión, mecanismos de quejas, comunidad y legado.",
    people: "Estimación: 2.000–8.000 posiciones especializadas y enlaces funcionales",
    facts: ["Estrategia social, ambiental, económica y de gobernanza", "Planes específicos por Host City y venue", "Sustainable Sourcing Code para cadena de suministro"],
    areas: ["Clima", "Energía", "Agua", "Residuos", "Trabajo", "Derechos humanos", "Comunidad"],
    evidence: "confirmed",
    organizations: ["FIFA Sustainability & Human Rights", "Host Cities", "Venues", "Proveedores", "Comunidades"],
    countries: ["Canadá", "México", "Estados Unidos", "Cadena global"],
    chain: ["Baseline", "Objetivo", "Due diligence", "Plan", "Operación", "Quejas", "Reporte", "Legado"],
    sources: [source.sustainability, source.sourcing],
  },
  {
    id: "finance-admin",
    label: "Finanzas y legal",
    shortLabel: "Finanzas & legal",
    x: 640,
    y: 160,
    radius: 62,
    color: "slate",
    layer: "mixed",
    kind: "domain",
    metric: "presupuesto → auditoría",
    eyebrow: "DINERO, CONTRATOS Y CONTROL",
    summary: "CFO, presupuesto, procurement, contratos, impuestos, seguros, privacidad, permisos, pagos, conciliación y auditoría.",
    people: "Estimación: 3.000–12.000 posiciones transversales; muchas se solapan con otras ramas",
    facts: ["Circuitos separados en FIFA, FWC26, Host Cities y gobiernos", "Compras públicas y privadas conviven", "Cierre financiero continúa después del último partido"],
    areas: ["CFO", "FP&A", "Procurement", "Legal", "Tax", "Insurance", "Audit", "Compliance"],
    evidence: "derived",
    organizations: ["FIFA Finance", "FWC26 Finance", "Host City CFOs", "Gobiernos", "Auditores", "Aseguradoras"],
    peopleNamed: [{ name: "Thomas Peyer", role: "Chief Finance Officer de FIFA" }],
    countries: ["Suiza", "Canadá", "México", "Estados Unidos"],
    chain: ["Necesidad", "Business case", "Presupuesto", "RFP", "Contrato", "Entrega", "Factura", "Pago", "Auditoría"],
    sources: [source.finance, source.compliance, source.legal, source.sourcing],
  },
];

const domainPlacement: Record<string, { x: number; y: number; detailAngle: number }> = {
  "world-cup": { x: 760, y: 520, detailAngle: 0 },
  governance: { x: 560, y: 180, detailAngle: -72 },
  "finance-admin": { x: 330, y: 200, detailAngle: -118 },
  sustainability: { x: 500, y: 380, detailAngle: 138 },
  matches: { x: 850, y: 180, detailAngle: -92 },
  teams: { x: 1160, y: 190, detailAngle: -48 },
  ceremonies: { x: 1000, y: 380, detailAngle: 18 },
  technology: { x: 1360, y: 350, detailAngle: -4 },
  broadcast: { x: 1390, y: 570, detailAngle: 4 },
  "enterprise-tech": { x: 1220, y: 705, detailAngle: 42 },
  venues: { x: 1030, y: 785, detailAngle: 70 },
  security: { x: 820, y: 820, detailAngle: 92 },
  medical: { x: 610, y: 820, detailAngle: 100 },
  transport: { x: 430, y: 730, detailAngle: 142 },
  accommodation: { x: 285, y: 820, detailAngle: 112 },
  hospitality: { x: 180, y: 680, detailAngle: 178 },
  fans: { x: 180, y: 520, detailAngle: 187 },
  brand: { x: 180, y: 365, detailAngle: 167 },
  commercial: { x: 160, y: 180, detailAngle: -145 },
};

const positionedDomainSeeds = domainSeeds.map((node) => ({
  ...node,
  x: domainPlacement[node.id]?.x ?? node.x,
  y: domainPlacement[node.id]?.y ?? node.y,
}));

export const atlasClusters: AtlasCluster[] = [
  {
    id: "direction",
    label: "Dirección y control",
    subtitle: "Gobernanza · dinero · impacto",
    color: "slate",
    hubX: 610,
    hubY: 355,
    labelX: 370,
    labelY: 52,
    hull: "M 160 45 Q 405 -5 610 70 Q 680 205 545 365 Q 325 420 145 285 Q 95 145 160 45 Z",
    domains: ["governance", "finance-admin", "sustainability"],
  },
  {
    id: "competition",
    label: "Competición",
    subtitle: "Partido · equipos · ceremonia",
    color: "lime",
    hubX: 905,
    hubY: 395,
    labelX: 1000,
    labelY: 48,
    hull: "M 800 38 Q 1075 -8 1245 95 Q 1325 235 1150 405 Q 930 440 800 290 Q 750 140 800 38 Z",
    domains: ["matches", "teams", "ceremonies"],
  },
  {
    id: "tech-media",
    label: "Tecnología y señal",
    subtitle: "Arbitraje · plataformas · broadcast",
    color: "cyan",
    hubX: 1110,
    hubY: 535,
    labelX: 1370,
    labelY: 266,
    hull: "M 1170 260 Q 1470 215 1555 390 Q 1590 610 1390 790 Q 1170 815 1080 635 Q 1050 430 1170 260 Z",
    domains: ["technology", "enterprise-tech", "broadcast"],
  },
  {
    id: "city-operation",
    label: "Ciudad y operación",
    subtitle: "Estadios · seguridad · salud · movilidad",
    color: "coral",
    hubX: 850,
    hubY: 690,
    labelX: 770,
    labelY: 955,
    hull: "M 365 650 Q 675 595 990 670 Q 1165 755 1095 950 Q 770 1005 455 940 Q 310 820 365 650 Z",
    domains: ["venues", "security", "medical", "transport"],
  },
  {
    id: "experience",
    label: "Experiencia y servicios",
    subtitle: "Fans · hospitality · alojamiento",
    color: "lime",
    hubX: 500,
    hubY: 625,
    labelX: 165,
    labelY: 905,
    hull: "M 40 435 Q 250 385 410 520 Q 455 715 335 925 Q 110 950 25 765 Q -5 560 40 435 Z",
    domains: ["fans", "hospitality", "accommodation"],
  },
  {
    id: "brand-business",
    label: "Marca y negocio",
    subtitle: "Contenido · sponsors · retail",
    color: "cyan",
    hubX: 485,
    hubY: 445,
    labelX: 180,
    labelY: 120,
    hull: "M 30 115 Q 245 65 380 155 Q 435 310 330 445 Q 145 495 25 355 Q -15 225 30 115 Z",
    domains: ["brand", "commercial"],
  },
];

const childSpecs: Record<
  string,
  Array<[string, string, Layer, string, string, string?]>
> = {
  matches: [
    ["match-ceremony", "Ceremonia previa", "supplier", "360°", "Show, banderas, himnos y protocolo"],
    ["match-officials", "Oficiales", "fifa", "170", "Árbitros, asistentes y video officials"],
    ["match-control", "Control del partido", "fifa", "90+ min", "Competition management y venue control"],
    ["match-medical", "Medicina", "mixed", "80–250", "Equipos, público, EMS y hospitales"],
    ["match-egress", "Egreso", "government", "65.204 avg", "Crowd flow, tránsito y transporte"],
    ["match-close", "Cierre financiero", "mixed", "post-match", "Facturas, reportes, reclamos y auditoría"],
    ["match-opening-case", "Caso inaugural", "mixed", "México–Sudáfrica", "Ceremonia, operación pública, seguridad, movilidad y estadio del partido inaugural", "Estimación: 18.000–30.000 posiciones directas y públicas"],
  ],
  security: [
    ["sec-local", "Policías locales", "government", "multisede", "Perímetros urbanos, tránsito y respuesta"],
    ["sec-private", "Seguridad privada", "supplier", "venue", "Screening, accesos y zonas controladas"],
    ["sec-cyber", "Ciberseguridad", "mixed", "1B+", "SOC, amenazas, dominios y plataformas"],
    ["sec-credentials", "Acreditaciones", "fifa", "300.000", "Identidad, background checks y zonas"],
    ["sec-intel", "Inteligencia", "government", "3 países", "Threat assessment y coordinación federal"],
    ["sec-drones", "Counter-drone", "government", "16 sedes", "Espacio aéreo, detección y respuesta"],
  ],
  broadcast: [
    ["broad-cameras", "Cámaras TV", "supplier", "multilateral", "Producción de la señal anfitriona"],
    ["broad-hbs", "HBS", "supplier", "host", "Host broadcaster e integración global"],
    ["broad-ibc", "IBC Dallas", "supplier", "43.648 m²", "Nervio de TV, radio y nuevos medios"],
    ["broad-rights", "Derechos de TV", "fifa", "220+", "Licencias por territorio y plataforma"],
    ["broad-studios", "Estudios móviles", "supplier", "16 sedes", "Unilaterales, commentary y mixed zones"],
    ["broad-distribution", "Distribución", "supplier", "global", "Fibra, satélite, CDN y streaming"],
  ],
  venues: [
    ["venue-pitch", "Campo de juego", "supplier", "130.000 m²", "Turf, grow-in, instalación y mantenimiento"],
    ["venue-overlay", "Overlay temporal", "supplier", "16 venues", "Carpas, compound, cercos y estructuras"],
    ["venue-owner", "Propietarios", "mixed", "16 modelos", "Activos públicos, privados y leases"],
    ["venue-operator", "Operadores", "supplier", "tournament mode", "Staff habitual + integración FIFA"],
    ["venue-access", "Accesibilidad", "mixed", "todos", "ADC, sign language, sensory y movilidad"],
    ["venue-sustain", "Sostenibilidad", "mixed", "strategy", "Residuos, agua, energía y derechos"],
  ],
  teams: [
    ["team-players", "Jugadores", "mixed", "1.248", "26 futbolistas por selección"],
    ["team-delegates", "Delegaciones", "mixed", "2.528", "Coaches, médicos, analistas y administración"],
    ["team-kit", "Kit vans", "supplier", "2.201", "Equipamiento, colores y match preparation"],
    ["team-buses", "Buses escoltados", "government", "2.321", "Traslados protegidos al corte"],
    ["team-camps", "Base Camps", "mixed", "48", "Hotel + training site + operaciones"],
    ["team-logistics", "Logística", "supplier", "Rock-it", "Freight, customs y team equipment"],
  ],
  ceremonies: [
    ["cer-flags", "Banderas gigantes", "supplier", "≈70 c/u", "Fabricación, logística y voluntarios"],
    ["cer-pyro", "Fuegos artificiales y pirotecnia", "supplier", "colores país", "Diseño, permisos, ambiente y firing"],
    ["cer-opening", "Apertura", "supplier", "90 min antes", "Balich, artistas y producción escénica"],
    ["cer-music", "Sonic IDs", "supplier", "16", "Productores locales y rights clearance"],
    ["cer-protocol", "Protocolo", "fifa", "cada match", "Himnos, dignatarios y sequence"],
    ["cer-rehearsal", "Ensayos", "mixed", "multidía", "Blocking, cues, safety y contingencias"],
  ],
  technology: [
    ["tech-var", "VAR", "fifa", "6 rooms IBC", "Replay, comunicación y decision support"],
    ["tech-saot", "Offside semiauto", "supplier", "16 cámaras", "Tracking corporal y connected ball"],
    ["tech-glt", "Goal-line", "supplier", "14 cámaras", "Detección automática de gol"],
    ["tech-ball", "Pelota conectada", "supplier", "500 Hz", "IMU y kick-point detection"],
    ["tech-network", "Red y fibra", "supplier", "161.000 km", "Private 5G, endpoints y radios"],
    ["tech-ai", "IA & avatares", "supplier", "1.248 scans", "Football AI Pro y visualización 3D"],
  ],
  hospitality: [
    ["hosp-tickets", "Entradas", "fifa", "6,2M+", "Venta, pago, seat map y resale"],
    ["hosp-premium", "Premium", "supplier", "607.350", "Suites, lounges y guests"],
    ["hosp-food", "Alimentos", "supplier", "700+ menús", "Cocina, stock, F&B y food safety"],
    ["hosp-retail", "Retail", "supplier", "Fanatics", "Licencias, stock, POS y royalties"],
    ["hosp-hotels", "Alojamiento", "supplier", "global", "Hoteles, Airbnb y team hotels"],
    ["hosp-fanfest", "Fan Festivals", "mixed", "7,7M+", "Pantallas, cultura, seguridad y vendors"],
  ],
  governance: [
    ["gov-fifa", "FIFA central", "fifa", "global", "Reglas, competición, marca, derechos y estándares", "Estimación: 800–2.000 posiciones centrales y desplegadas"],
    ["gov-fwc26", "FWC26 delivery", "mixed", "trilateral", "Integración operativa y funcional de las sedes", "Estimación: 1.000–3.000 posiciones"],
    ["gov-toc", "TOC Miami", "fifa", "24/7", "Tournament cockpit, command y escalamiento", "Estimación: 150–400 posiciones por turnos"],
    ["gov-associations", "Federaciones anfitrionas", "mixed", "3", "Canada Soccer, FMF y U.S. Soccer", "Estimación: 200–600 enlaces y puestos"],
    ["gov-host-cities", "Host Cities", "government", "16", "Comités, secretarías y alianzas locales", "Estimación: 1.500–5.000 posiciones directas"],
    ["gov-crisis", "Crisis y continuidad", "mixed", "multiagencia", "Incident management, comunicación y recuperación", "Estimación: 300–1.000 posiciones"],
  ],
  "enterprise-tech": [
    ["ent-network", "Redes privadas", "supplier", "161.000 km", "Fibra, radio, private 5G, endpoints y observabilidad", "Estimación: 500–1.200 posiciones"],
    ["ent-cloud", "Nube y datacenters", "supplier", "multi-región", "Compute, storage, edge, backups y resiliencia", "Estimación: 250–700 posiciones"],
    ["ent-identity", "Identidad y accesos", "mixed", "300.000", "Acreditación, zonas, devices y background checks", "Estimación: 300–900 posiciones"],
    ["ent-workforce", "Workforce systems", "supplier", "85.000+", "Scheduling, formación, colaboración y soporte", "Estimación: 250–800 posiciones"],
    ["ent-soc", "SOC y ciberseguridad", "mixed", "1B+", "Threat intel, detección, respuesta y forensics", "Estimación: 300–900 posiciones"],
    ["ent-support", "Service desk", "supplier", "600+ sitios", "Dispositivos, onsite support, spare pool y escalamiento", "Estimación: 600–1.500 posiciones"],
  ],
  medical: [
    ["med-teams", "Medicina de equipos", "mixed", "48", "Médicos, fisios, nutrición y recovery", "Estimación: 700–1.300 profesionales"],
    ["med-venue", "Puestos de estadio", "mixed", "16", "Primeros auxilios, AED, triage y spectator care", "Estimación: 2.000–5.000 posiciones"],
    ["med-ems", "Ambulancias y EMS", "government", "multisede", "Respuesta prehospitalaria y traslados", "Estimación: 1.500–4.000 posiciones"],
    ["med-hospitals", "Hospitales de referencia", "government", "red local", "Trauma, emergencias, coordinación y capacity planning", "Estimación: 2.000–6.000 puestos activados o de guardia"],
    ["med-antidoping", "Antidopaje", "fifa", "104 partidos", "Selección, cadena de custodia y laboratorios", "Estimación: 200–500 posiciones"],
    ["med-public-health", "Salud pública", "government", "3 países", "Calor, epidemiología, alimentos y comunicación sanitaria", "Estimación: 500–1.500 posiciones"],
  ],
  transport: [
    ["tr-air", "Aviación y aeropuertos", "government", "multihub", "Slots, terminales, seguridad, equipaje y contingencias", "Estimación: 8.000–25.000 puestos vinculados"],
    ["tr-border", "Fronteras y aduana", "government", "3 países", "Visas, migraciones, customs y material sensible", "Estimación: 1.500–5.000 posiciones"],
    ["tr-teams", "Movilidad de equipos", "mixed", "6.310", "Buses, escoltas, kit vans y rutas protegidas", "Estimación: 2.000–5.000 posiciones"],
    ["tr-public", "Transporte público", "government", "16 sedes", "Rail, metro, buses, ferries y service plans", "Estimación: 10.000–30.000 puestos activados"],
    ["tr-freight", "Freight y depósitos", "supplier", "global", "Carga, warehouses, customs y venue delivery", "Estimación: 3.000–10.000 posiciones"],
    ["tr-last-mile", "Última milla", "mixed", "match-day", "Shuttles, parking, traffic, rideshare y wayfinding", "Estimación: 5.000–15.000 posiciones"],
  ],
  accommodation: [
    ["acc-team-hotels", "Hoteles de equipos", "supplier", "48", "Rooming, seguridad, privacidad y nutrición", "Estimación: 5.000–12.000 personas"],
    ["acc-official-hotels", "FIFA y oficiales", "supplier", "multisede", "Delegaciones FIFA, árbitros, sponsors y media", "Estimación: 4.000–10.000 personas"],
    ["acc-catering", "Catering", "supplier", "600+ sitios", "Producción, transporte, servicio y limpieza", "Estimación: 15.000–40.000 personas"],
    ["acc-nutrition", "Nutrición deportiva", "mixed", "48 equipos", "Menús, alergias, suplementos y performance", "Estimación: 500–1.500 especialistas y soporte"],
    ["acc-housekeeping", "Limpieza y lavandería", "supplier", "24/7", "Rooms, kits, linens, waste y hygiene", "Estimación: 10.000–30.000 personas"],
    ["acc-food-safety", "Seguridad alimentaria", "government", "3 países", "Inspección, trazabilidad, temperaturas y recall", "Estimación: 1.000–3.000 posiciones"],
  ],
  fans: [
    ["fan-ticketing", "Ticketing", "fifa", "6,2M+", "Cuenta, compra, seat map, entrega y soporte", "Estimación: 1.500–4.000 posiciones"],
    ["fan-payments", "Pagos y fraude", "supplier", "global", "Acquiring, risk, chargebacks y conciliación", "Estimación: 500–1.500 posiciones"],
    ["fan-entry", "Ingreso y validación", "mixed", "16 venues", "Turnstiles, troubleshooting, queues y accessibility", "Estimación: 5.000–12.000 posiciones"],
    ["fan-services", "Atención al espectador", "mixed", "multilingüe", "Información, objetos perdidos y resolución", "Estimación: 3.000–8.000 posiciones"],
    ["fan-festivals", "Fan Festivals", "mixed", "7,7M+", "Pantallas, cultura, vendors, seguridad y limpieza", "Estimación: 5.000–15.000 posiciones"],
    ["fan-accessibility", "Accesibilidad", "mixed", "todos", "ADC, haptic boards, sensory, movilidad y seating", "Estimación: 1.000–3.000 posiciones especializadas"],
  ],
  brand: [
    ["brand-system", "Sistema de marca", "fifa", "global", "Emblema, tipografía, color, guías y approvals", "Estimación: 150–500 personas"],
    ["brand-host", "Identidad de sedes", "mixed", "16", "Posters, cultura local, templates y city dressing", "Estimación: 500–2.000 personas"],
    ["brand-music", "Música y Sonic IDs", "supplier", "16", "Composición, producción, derechos y masters", "Estimación: 300–1.200 personas"],
    ["brand-content", "Foto, video y social", "supplier", "24/7", "Editorial, creators, capture, post y distribución", "Estimación: 2.000–6.000 personas"],
    ["brand-campaigns", "Campañas", "supplier", "global", "Estrategia, medios, adaptaciones y medición", "Estimación: 2.000–8.000 personas"],
    ["brand-protection", "Brand protection", "mixed", "clean zones", "Permisos, de-branding, monitoring y enforcement", "Estimación: 500–2.000 posiciones"],
  ],
  commercial: [
    ["com-partners", "FIFA Partners", "supplier", "global", "Contratos de máxima categoría y derechos globales", "Estimación: 1.000–4.000 personas activadas"],
    ["com-activations", "Activaciones", "supplier", "multisede", "Concepto, build, staffing, hospitality y leads", "Estimación: 5.000–20.000 personas"],
    ["com-licensing", "Licencias", "fifa", "global", "Categorías, approvals, royalties y compliance", "Estimación: 500–1.500 posiciones"],
    ["com-manufacturing", "Fabricación", "supplier", "global", "Textil, souvenirs, packaging y quality control", "Estimación: 10.000–60.000 personas en cadena"],
    ["com-retail", "Retail", "supplier", "Fanatics", "Stock, POS, tiendas, e-commerce y devoluciones", "Estimación: 4.000–12.000 posiciones"],
    ["com-equipment", "Balón y equipamiento", "supplier", "48 equipos", "Diseño, connected ball, kits y distribución", "Estimación: 2.000–8.000 personas en cadena"],
  ],
  sustainability: [
    ["sus-climate", "Clima y carbono", "mixed", "baseline", "Inventario, reducción, viajes y reporting", "Estimación: 300–1.000 especialistas y enlaces"],
    ["sus-resources", "Energía, agua y residuos", "mixed", "600+ sitios", "Planes, medición, vendors y desvío de residuos", "Estimación: 1.000–4.000 posiciones"],
    ["sus-sourcing", "Compras responsables", "mixed", "ISO 20400", "Cláusulas, due diligence y supplier monitoring", "Estimación: 300–1.200 posiciones"],
    ["sus-human-rights", "Derechos humanos", "mixed", "3 países", "Riesgos, defensores, medios, trabajo y grievance", "Estimación: 300–1.000 especialistas y enlaces"],
    ["sus-community", "Comunidad y legado", "government", "16 sedes", "Programas locales, inclusión y beneficios duraderos", "Estimación: 1.000–4.000 posiciones"],
    ["sus-reporting", "Reporte y auditoría", "mixed", "posfinal", "KPIs, evidencia, assurance y publicación", "Estimación: 200–800 posiciones; cierre futuro"],
  ],
  "finance-admin": [
    ["fin-budget", "Presupuesto y FP&A", "mixed", "multientidad", "Business cases, forecast, control y reporting", "Estimación: 500–1.500 posiciones"],
    ["fin-procurement", "Compras y RFP", "mixed", "público/privado", "Sourcing, pliegos, evaluación y vendor management", "Estimación: 500–2.000 posiciones"],
    ["fin-contracts", "Legal y contratos", "mixed", "3 países", "Venue, media, vendors, IP, privacidad y claims", "Estimación: 500–1.500 posiciones"],
    ["fin-insurance", "Seguros y riesgo", "mixed", "continuidad", "Liability, cancelación, accidentes y crisis", "Estimación: 200–800 posiciones"],
    ["fin-payments", "Facturas y pagos", "mixed", "end-to-end", "PO, recepción, invoice, approval, treasury y reconcile", "Estimación: 500–1.500 posiciones"],
    ["fin-audit", "Auditoría y cierre", "mixed", "posfinal", "Close-out, grants, impuestos, evidencias y legacy", "Estimación: 300–1.000 posiciones; cierre futuro"],
  ],
};

const childEvidence: Record<string, EvidenceStatus> = {
  "sus-reporting": "future",
  "fin-audit": "future",
  "cer-pyro": "estimated",
  "cer-flags": "confirmed",
  "hosp-food": "private",
  "sec-private": "private",
  "acc-catering": "private",
  "com-manufacturing": "estimated",
};

const rawDetailNodes: AtlasNode[] = Object.entries(childSpecs).flatMap(
  ([parentId, specs]) => {
    const parent = positionedDomainSeeds.find((node) => node.id === parentId)!;
    const placement = domainPlacement[parentId];
    const baseAngle = ((placement?.detailAngle ?? 0) * Math.PI) / 180;
    return specs.map(([id, label, layer, metric, summary, people], index) => {
      const angle = baseAngle + (Math.PI * 2 * index) / specs.length;
      const orbit = parent.radius + 46 + (index % 2) * 4;
      return {
        id,
        label,
        shortLabel: label,
        x: Math.min(1540, Math.max(60, parent.x + Math.cos(angle) * orbit)),
        y: Math.min(950, Math.max(50, parent.y + Math.sin(angle) * orbit)),
        radius: 14 + (index % 3) * 2,
        color: parent.color,
        layer,
        kind: "detail" as const,
        parent: parentId,
        metric,
        eyebrow: parent.eyebrow,
        summary,
        people: people ?? `Estimación no separada: incluida en el rango de ${parent.label}`,
        facts: [metric, `Parte de ${parent.label}`, "Abrir para seguir la cadena operativa"],
        areas: parent.areas,
        evidence: childEvidence[id] ?? parent.evidence ?? "estimated",
        organizations: parent.organizations,
        peopleNamed: parent.peopleNamed,
        countries: parent.countries,
        chain: parent.chain,
        sources: parent.sources,
      };
    });
  },
);

const detailNodes = rawDetailNodes;

export const atlasNodes = [...positionedDomainSeeds, ...detailNodes];

export const atlasEdges: AtlasEdge[] = [
  ...positionedDomainSeeds
    .filter((node) => node.kind === "domain")
    .map((node) => ({ from: "world-cup", to: node.id, strength: "main" as const })),
  ...detailNodes.map((node) => ({
    from: node.parent!,
    to: node.id,
    strength: "soft" as const,
  })),
  { from: "security", to: "technology", strength: "cross" },
  { from: "broadcast", to: "technology", strength: "cross" },
  { from: "venues", to: "hospitality", strength: "cross" },
  { from: "teams", to: "matches", strength: "cross" },
  { from: "ceremonies", to: "matches", strength: "cross" },
  { from: "security", to: "venues", strength: "cross" },
  { from: "broadcast", to: "venues", strength: "cross" },
  { from: "hospitality", to: "matches", strength: "cross" },
  { from: "governance", to: "finance-admin", strength: "cross" },
  { from: "governance", to: "security", strength: "cross" },
  { from: "governance", to: "transport", strength: "cross" },
  { from: "finance-admin", to: "venues", strength: "cross" },
  { from: "finance-admin", to: "ceremonies", strength: "cross" },
  { from: "finance-admin", to: "commercial", strength: "cross" },
  { from: "sustainability", to: "venues", strength: "cross" },
  { from: "sustainability", to: "commercial", strength: "cross" },
  { from: "sustainability", to: "accommodation", strength: "cross" },
  { from: "medical", to: "security", strength: "cross" },
  { from: "medical", to: "matches", strength: "cross" },
  { from: "transport", to: "teams", strength: "cross" },
  { from: "transport", to: "fans", strength: "cross" },
  { from: "accommodation", to: "teams", strength: "cross" },
  { from: "accommodation", to: "hospitality", strength: "cross" },
  { from: "fans", to: "hospitality", strength: "cross" },
  { from: "brand", to: "ceremonies", strength: "cross" },
  { from: "brand", to: "commercial", strength: "cross" },
  { from: "enterprise-tech", to: "broadcast", strength: "cross" },
  { from: "enterprise-tech", to: "technology", strength: "cross" },
  { from: "match-ceremony", to: "cer-flags", strength: "cross" },
  { from: "match-ceremony", to: "cer-pyro", strength: "cross" },
  { from: "match-ceremony", to: "cer-protocol", strength: "cross" },
];

export type HostCity = {
  id: string;
  city: string;
  country: string;
  matches: number;
  venue: string;
  interface: string;
  leaders: string[];
  ownerOperator: string;
  publicLayer: string;
  mobility: string;
  finance: string;
  source: { label: string; url: string };
};

export const hostCities: Array<{ country: string; cities: HostCity[] }> = [
  {
    country: "Canadá",
    cities: [
      { id: "toronto", city: "Toronto", country: "Canadá", matches: 6, venue: "Toronto Stadium / BMO Field", interface: "Secretaría municipal FIFA World Cup 2026 Toronto", leaders: ["Sharon Bollenbach · Executive Director"], ownerOperator: "City of Toronto · operación MLSE", publicLayer: "Toronto + Ontario + Canadá", mobility: "TTC, Metrolinx/GO, UP Express y MTO", finance: "CAD 380 millones directos: operating + capital", source: { label: "City of Toronto · documentación mundialista", url: "https://www.toronto.ca/explore-enjoy/festivals-events/fifa-world-cup-26/" } },
      { id: "vancouver", city: "Vancouver", country: "Canadá", matches: 7, venue: "BC Place Vancouver", interface: "Consorcio British Columbia–City of Vancouver–PavCo", leaders: ["Liderazgo público distribuido; no hay CEO único"], ownerOperator: "Provincia de British Columbia · PavCo", publicLayer: "Provincia + ciudad + First Nations + Canadá", mobility: "TransLink y SkyTrain", finance: "Costo provincial neto estimado CAD 90–114 millones", source: { label: "Vancouver FIFA World Cup 26", url: "https://vancouverfwc26.ca/" } },
    ],
  },
  {
    country: "México",
    cities: [
      { id: "mexico-city", city: "Ciudad de México", country: "México", matches: 5, venue: "Estadio Ciudad de México / Azteca-Banorte", interface: "Comité de la Ciudad de México para la Copa Mundial", leaders: ["Clara Brugada · Jefa de Gobierno"], ownerOperator: "Operador privado del estadio", publicLayer: "Gobierno federal + CDMX + alcaldías", mobility: "Metro, Metrobús, Tren Ligero, RTP, AICM y AIFA", finance: "Operativo inaugural público; presupuesto urbano distribuido", source: { label: "Gobierno de la Ciudad de México", url: "https://jefaturadegobierno.cdmx.gob.mx/" } },
      { id: "guadalajara", city: "Guadalajara", country: "México", matches: 4, venue: "Guadalajara Stadium / Akron, Zapopan", interface: "Coordinación Jalisco–Zapopan–comité local", leaders: ["Juan José Frangie · responsable público designado"], ownerOperator: "Recinto privado vinculado a Chivas/Grupo Omnilife", publicLayer: "Jalisco + Zapopan + área metropolitana", mobility: "SITEUR, Mi Macro, buses y shuttles", finance: "Presupuesto consolidado no publicado", source: { label: "FIFA · Guadalajara Host City", url: "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/host-cities/guadalajara" } },
      { id: "monterrey", city: "Monterrey", country: "México", matches: 4, venue: "Monterrey Stadium / BBVA, Guadalupe", interface: "Comité Organizador Monterrey 2026", leaders: ["Pedro Esquivel · cabeza pública identificada"], ownerOperator: "Rayados / ecosistema FEMSA", publicLayer: "Nuevo León + Guadalupe + área metropolitana", mobility: "Metrorrey, Transmetro y operación vial", finance: "Partidas distribuidas entre estado, municipios y operador", source: { label: "FIFA · Monterrey Host City", url: "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/host-cities/monterrey" } },
    ],
  },
  {
    country: "Estados Unidos",
    cities: [
      { id: "atlanta", city: "Atlanta", country: "Estados Unidos", matches: 8, venue: "Mercedes-Benz Stadium", interface: "Atlanta World Cup Host Committee / Atlanta Sports Council", leaders: ["Dan Corso · President"], ownerOperator: "GWCCA pública + AMB Sports & Entertainment", publicLayer: "City of Atlanta + Georgia + GWCCA", mobility: "MARTA, GDOT y aeropuerto ATL", finance: "Fondos estatales y grants federales; total no consolidado", source: { label: "Atlanta Host Committee", url: "https://atlantafwc26.com/" } },
      { id: "boston", city: "Boston", country: "Estados Unidos", matches: 7, venue: "Gillette Stadium, Foxborough", interface: "Boston 26 nonprofit", leaders: ["Mike Loynd · CEO", "Ron O’Hanley · Honorary Board"], ownerOperator: "Kraft Group · recinto privado", publicLayer: "Foxborough + Massachusetts + Boston 26", mobility: "MBTA commuter rail y buses expresos", finance: "Seguridad local reportada; presupuesto completo no publicado", source: { label: "Boston 26", url: "https://www.bostonfwc26.com/" } },
      { id: "dallas", city: "Dallas", country: "Estados Unidos", matches: 9, venue: "AT&T Stadium, Arlington", interface: "North Texas FWC Organizing Committee", leaders: ["Monica Paul · President", "Dan Hunt y Nina Vaca · Co-chairs"], ownerOperator: "City of Arlington · Dallas Cowboys bajo lease", publicLayer: "Dallas–Arlington–Fort Worth + Texas", mobility: "DART, TRE, Trinity Metro, shuttles y GoPass", finance: "USD 51,5m FEMA + USD 10,03m FTA; también aloja IBC", source: { label: "Dallas FIFA World Cup 26", url: "https://www.dallasfwc26.com/" } },
      { id: "houston", city: "Houston", country: "Estados Unidos", matches: 7, venue: "NRG Stadium", interface: "Houston Host Committee", leaders: ["Chris Canetti · President"], ownerOperator: "Harris County/HCHSA · management contratado", publicLayer: "Houston + Harris County + Texas", mobility: "METRORail, buses y shuttles", finance: "USD 9,092m FTA; seguridad en partidas separadas", source: { label: "Houston Host Committee", url: "https://www.houstonsoccer2026.com/" } },
      { id: "kansas-city", city: "Kansas City", country: "Estados Unidos", matches: 6, venue: "Arrowhead Stadium", interface: "KC2026 nonprofit regional", leaders: ["Pam Kramer · CEO", "Clark Hunt y Cliff Illig · Honorary Co-chairs"], ownerOperator: "Jackson County Sports Complex Authority + Chiefs", publicLayer: "Missouri–Kansas + municipios metropolitanos", mobility: "KCATA, RideKC y shuttles", finance: "USD 79,36m en programas federales informados", source: { label: "KC2026", url: "https://kansascityfwc26.com/" } },
      { id: "los-angeles", city: "Los Ángeles", country: "Estados Unidos", matches: 8, venue: "SoFi Stadium, Inglewood", interface: "LA World Cup Host Committee / LASEC", leaders: ["Kathryn Schloessman · CEO"], ownerOperator: "StadCo / Hollywood Park", publicLayer: "Inglewood + LA County + región", mobility: "LA Metro y red regional", finance: "Grants federales/estatales; total no consolidado", source: { label: "Los Angeles Host Committee", url: "https://losangelesfwc26.com/" } },
      { id: "miami", city: "Miami", country: "Estados Unidos", matches: 7, venue: "Hard Rock Stadium, Miami Gardens", interface: "Miami Host Committee 501(c)(3)", leaders: ["Alina T. Hudak · President & CEO"], ownerOperator: "Miami Dolphins / Hard Rock Stadium", publicLayer: "Miami-Dade + Miami Gardens + 34 municipios", mobility: "Metrorail/Tri-Rail hubs y shuttles", finance: "Servicios y subsidios aprobados; cierre pendiente", source: { label: "Miami Host Committee", url: "https://miamifwc26.com/" } },
      { id: "nynj", city: "Nueva York/Nueva Jersey", country: "Estados Unidos", matches: 8, venue: "MetLife Stadium, East Rutherford", interface: "NYNJ Host Committee", leaders: ["Alex Lasry · CEO", "Roger Kamau · CFO"], ownerOperator: "New Meadowlands Stadium Company / Giants–Jets", publicLayer: "New Jersey + New York + autoridades regionales", mobility: "NJ TRANSIT, MTA, buses y shuttles", finance: "Costos extraordinarios; conciliación final pendiente", source: { label: "NYNJ Host Committee", url: "https://nynjfwc26.com/" } },
      { id: "philadelphia", city: "Philadelphia", country: "Estados Unidos", matches: 6, venue: "Lincoln Financial Field", interface: "Philadelphia Soccer 2026 nonprofit", leaders: ["Meg Kane · Host City Executive/CEO"], ownerOperator: "Philadelphia Eagles", publicLayer: "City + Pennsylvania + OEM", mobility: "SEPTA / NRG Station", finance: "USD 8,47m FTA + seguridad y aportes separados", source: { label: "Philadelphia Soccer 2026", url: "https://www.philadelphiafwc26.com/" } },
      { id: "san-francisco", city: "San Francisco Bay Area", country: "Estados Unidos", matches: 6, venue: "Levi’s Stadium, Santa Clara", interface: "Bay Area Host Committee nonprofit", leaders: ["Zaileen Janmohamed · President & CEO"], ownerOperator: "Santa Clara Stadium Authority + 49ers Management", publicLayer: "Región de nueve condados + Santa Clara", mobility: "VTA, Caltrain, ACE y buses", finance: "≈USD 51,1m FEMA + USD 8,8m FTA reportados", source: { label: "Bay Area Host Committee", url: "https://bayareahostcommittee.com/" } },
      { id: "seattle", city: "Seattle", country: "Estados Unidos", matches: 6, venue: "Lumen Field", interface: "SeattleFWC26 nonprofit", leaders: ["Peter Tomozawa · CEO"], ownerOperator: "Washington State Public Stadium Authority + First & Goal", publicLayer: "Seattle + King County + Washington", mobility: "Sound Transit, King County Metro y ferries", finance: "USD 8,4m FTA + USD 45m estatales", source: { label: "SeattleFWC26", url: "https://www.seattlefwc26.org/" } },
    ],
  },
];

export const topStats = [
  ["104", "partidos"],
  ["48", "selecciones"],
  ["18", "dominios operativos"],
  ["16", "sedes"],
  ["3", "países"],
  ["126", "fuentes de investigación"],
  ["600+", "sitios oficiales"],
  ["220+", "territorios con señal"],
  ["13 PB", "datos procesados"],
  ["7,7M+", "Fan Festivals"],
];

export const editorialSections = {
  overview: {
    eyebrow: "COPA MUNDIAL FIFA 2026 · ATLAS OPERATIVO",
    title: "300.000 personas. 104 partidos. Un solo sistema.",
    description:
      "Explorá quién pidió, pagó, diseñó, fabricó, reguló y operó cada pieza del Mundial.",
  },
  areas: {
    eyebrow: "18 DOMINIOS OPERATIVOS",
    title: "El Mundial, separado por sistemas.",
    description:
      "Abrí cualquier área sin buscarla en el enjambre. Cada dominio conecta personas, organizaciones, procesos, países y evidencia.",
  },
  matches: {
    eyebrow: "ENTRAR SIN PERDERSE",
    title: "Un partido es una ciudad temporal.",
    description:
      "Elegí un momento del matchday y el mapa enfocará automáticamente las organizaciones, personas y procesos que lo hacen posible.",
  },
  venues: {
    eyebrow: "16 SEDES · 3 PAÍSES",
    title: "La marca de la sede no siempre coincide con la ciudad real.",
    description:
      "Dallas juega en Arlington, Boston en Foxborough y San Francisco Bay Area en Santa Clara. Abrí una sede para ver quién posee, opera, paga y regula.",
  },
  people: {
    eyebrow: "CENSO HUMANO",
    title: "No existe un único número de personas.",
    description:
      "Separamos acreditados, operación ampliada y cadena global para evitar sumar dos veces a quienes cumplieron más de un rol.",
  },
  evidence: {
    eyebrow: "TRAZABILIDAD",
    title: "Índice de referencias del atlas.",
    description:
      "Cada punto aparece como un bloque independiente con sus fuentes enlazadas una debajo de otra. Los colores de confianza permanecen visibles en el mapa.",
  },
} as const;
