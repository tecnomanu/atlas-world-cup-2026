"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from "react";
import {
  atlasEdges,
  atlasClusters,
  atlasNodes,
  editorialSections,
  hostCities,
  topStats,
  type AtlasNode,
  type EvidenceStatus,
  type HostCity,
  type Layer,
} from "./world-data";
import { researchSources } from "./research-sources.generated";

type Section = keyof typeof editorialSections | "statistics";
type MetricMode = "people" | "processes";

const MAP_WIDTH = 1600;
const MAP_HEIGHT = 1000;
const MIN_SCALE = 0.28;

const peopleBadges: Record<string, string> = {
  "world-cup": "≈300k",
  matches: "13,7–25k",
  security: "20k+",
  broadcast: "3,4k/día",
  venues: "5–12k",
  teams: "8,6–16,8k",
  ceremonies: "10k+",
  technology: "1,5–4k",
  hospitality: "27,9k",
  governance: "2–6k",
  "enterprise-tech": "1,5–4k",
  medical: "8–20k",
  transport: "25–80k",
  accommodation: "40–120k",
  fans: "15–40k",
  brand: "5–20k",
  commercial: "20–100k",
  sustainability: "2–8k",
  "finance-admin": "3–12k",
  "cer-flags": "≈70 c/u",
};

const domainIcons: Record<string, string> = {
  matches: "◉",
  security: "⛨",
  broadcast: "⌁",
  venues: "⌂",
  teams: "♟",
  ceremonies: "✦",
  technology: "⟐",
  hospitality: "◇",
  governance: "⌘",
  "enterprise-tech": "▦",
  medical: "+",
  transport: "⇄",
  accommodation: "▤",
  fans: "◎",
  brand: "✎",
  commercial: "¤",
  sustainability: "↻",
  "finance-admin": "$",
};

const supplierDirectory: Record<string, string[]> = {
  matches: ["Host Broadcast Services", "Proveedores técnicos por partido (detalle contractual no público)"],
  security: ["Empresas de seguridad privada por sede (nombres no consolidados públicamente)"],
  broadcast: ["Host Broadcast Services", "Verizon"],
  venues: ["BaAM Productions", "Contratistas y proveedores locales por estadio"],
  teams: ["Rock-it Cargo", "Hoteles y training sites contratados"],
  ceremonies: ["Balich Wonder Studio", "Proveedores escénicos y pirotécnicos locales"],
  technology: ["Lenovo", "Hawk-Eye Innovations", "Football Technology Centre AG", "adidas"],
  hospitality: ["On Location", "Operadores de catering, suites y lounges"],
  "enterprise-tech": ["Lenovo", "Salesforce", "Verizon", "Integradores locales"],
  medical: ["Proveedores médicos y de ambulancias contratados localmente"],
  transport: ["Rock-it Cargo / Global Critical Logistics", "Hyundai–Kia", "Operadores locales de buses y fleet"],
  accommodation: ["Marriott Bonvoy", "Airbnb", "Hoteles base y caterers"],
  fans: ["KultureCity", "Proveedores de ticketing, pagos y guest services"],
  brand: ["Moment Factory", "This Is Catapult", "Agencias locales"],
  commercial: ["Fanatics", "adidas", "Visa", "Coca-Cola", "Sponsors y licenciatarios"],
  sustainability: ["Consultoras y proveedores ambientales por sede (nombres no consolidados públicamente)"],
  "finance-admin": ["Auditores, aseguradoras y estudios externos (contratos parcialmente no públicos)"],
};

const evidenceLabel: Record<EvidenceStatus, string> = {
  confirmed: "Confirmada",
  derived: "Derivada",
  estimated: "Estimada",
  private: "No pública",
  future: "Futura",
};

const evidenceTone: Record<EvidenceStatus, string> = {
  confirmed: "high",
  derived: "medium",
  estimated: "estimate",
  private: "unknown",
  future: "future",
};

function visibleMetric(node: AtlasNode, mode: MetricMode) {
  if (mode === "people") {
    if (peopleBadges[node.id]) return peopleBadges[node.id];
    const range = node.people?.match(/(?:≈\s*)?\d[\d.,]*(?:\s*[–-]\s*\d[\d.,]*)?(?:\s*[kKmM])?/);
    return range?.[0]?.replaceAll(" ", "") ?? "s/d";
  }
  if (node.kind === "root") return `${atlasNodes.filter((item) => item.kind === "detail").length} procesos`;
  if (node.kind === "domain") return `${atlasNodes.filter((item) => item.parent === node.id).length} procesos`;
  return `${node.chain?.length ?? 1} pasos`;
}

const navItems: Array<{ id: Section; label: string; mark: string }> = [
  { id: "overview", label: "Mapa", mark: "◎" },
  { id: "areas", label: "Áreas", mark: "⌘" },
  { id: "matches", label: "Partidos", mark: "◉" },
  { id: "venues", label: "Sedes", mark: "⌾" },
  { id: "people", label: "Personas", mark: "◌" },
  { id: "statistics", label: "Cifras", mark: "∿" },
  { id: "evidence", label: "Evidencia", mark: "□" },
];

const filters: Array<{ id: "all" | Layer; label: string; tone: string }> = [
  { id: "all", label: "Todos", tone: "lime" },
  { id: "fifa", label: "FIFA", tone: "cyan" },
  { id: "government", label: "Gobiernos", tone: "coral" },
  { id: "supplier", label: "Proveedores", tone: "slate" },
];

const evidenceLegend = [
  ["Confirmada", "high"],
  ["Derivada", "medium"],
  ["Estimada", "estimate"],
  ["No pública", "unknown"],
  ["Futura", "future"],
] as const;

const referenceGroups = atlasNodes
  .filter((node) => node.sources && node.sources.length > 0)
  .map((node) => ({
    id: node.id,
    label: node.label,
    sources: Array.from(new Map(node.sources!.map((item) => [item.url, item])).values()),
  }));

const namedPeopleIndex = Array.from(
  new Map(
    atlasNodes
      .flatMap((node) => (node.peopleNamed ?? []).map((person) => [person.name, { ...person, nodeId: node.kind === "detail" ? node.parent! : node.id }] as const)),
  ).values(),
);

const matchMoments = [
  ["−72 h", "Preparación del venue", "venues"],
  ["−24 h", "Ensayos y calibración", "technology"],
  ["−4 h", "Perímetros y apertura", "security"],
  ["−45 min", "Ceremonia previa", "ceremonies"],
  ["00:00", "Partido", "matches"],
  ["+120 min", "Egreso y cierre", "match-egress"],
] as const;

function edgePath(from: Pick<AtlasNode, "x" | "y">, to: Pick<AtlasNode, "x" | "y">) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const bend = Math.min(90, Math.hypot(dx, dy) * 0.18);
  const nx = -dy / Math.max(1, Math.hypot(dx, dy));
  const ny = dx / Math.max(1, Math.hypot(dx, dy));
  const cx = (from.x + to.x) / 2 + nx * bend;
  const cy = (from.y + to.y) / 2 + ny * bend;
  return `M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`;
}

function colorFor(node: AtlasNode) {
  return `var(--${node.color})`;
}

function useDecorativeNetwork() {
  return useMemo(() => {
    const points = Array.from({ length: 170 }, (_, index) => {
      const x = (Math.sin(index * 19.37) * 0.5 + 0.5) * 1600;
      const y = (Math.sin(index * 7.91 + 1.7) * 0.5 + 0.5) * 1000;
      const group = index % 4;
      return { id: index, x, y, group, radius: index % 11 === 0 ? 4 : 1.7 };
    });
    const lines: Array<[number, number]> = [];
    for (let index = 0; index < points.length; index += 1) {
      const candidates = [index + 1, index + 7, index + 19];
      for (const next of candidates) {
        if (next >= points.length) continue;
        const a = points[index];
        const b = points[next];
        if (Math.hypot(a.x - b.x, a.y - b.y) < 245) lines.push([index, next]);
      }
    }
    return { points, lines };
  }, []);
}

function BrandMark() {
  return (
    <div className="brand-mark" aria-hidden="true">
      <span className="brand-orbit orbit-one" />
      <span className="brand-orbit orbit-two" />
      <span className="brand-core" />
      <span className="brand-dot dot-one" />
      <span className="brand-dot dot-two" />
      <span className="brand-dot dot-three" />
    </div>
  );
}

function FloatingNavigation({
  activeSection,
  onSection,
}: {
  activeSection: Section | null;
  onSection: (section: Section) => void;
}) {
  return (
    <aside className="nav-rail glass" aria-label="Navegación principal">
      <button className="brand-button" onClick={() => onSection("overview")} aria-label="Inicio">
        <BrandMark />
        <span className="brand-name">Atlas Operativo<br />Mundial 2026</span>
      </button>
      <nav className="nav-list">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activeSection === item.id ? "is-active" : ""}`}
            onClick={() => onSection(item.id)}
          >
            <span className="nav-mark" aria-hidden="true">{item.mark}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="nav-foot">
        <span className="live-dot" />
        <span>Investigación v1.4</span>
      </div>
    </aside>
  );
}

function OverviewPanel({
  onExplore,
  onEnterMatch,
  onClose,
}: {
  onExplore: () => void;
  onEnterMatch: () => void;
  onClose: () => void;
}) {
  const section = editorialSections.overview;
  return (
    <section className="editorial-panel hero-panel glass">
      <button className="panel-close" onClick={onClose} aria-label="Cerrar panel">×</button>
      <p className="eyebrow">{section.eyebrow}</p>
      <h1>{section.title}</h1>
      <span className="title-rule" />
      <p className="panel-description">{section.description}</p>
      <div className="hero-actions">
        <button className="primary-button" onClick={onExplore}>
          Explorar el mapa <span>→</span>
        </button>
        <button className="secondary-button" onClick={onEnterMatch}>
          Entrar a un partido
        </button>
      </div>
      <div className="hero-stats" aria-label="Estadísticas principales">
        <span><b>18</b> dominios</span>
        <i />
        <span><b>16</b> sedes</span>
        <i />
        <span><b>48</b> equipos</span>
        <i />
        <span><b>3</b> países</span>
      </div>
    </section>
  );
}

function EditorialPanel({
  section,
  onClose,
  onSelectNode,
  onSelectCity,
}: {
  section: Exclude<Section, "overview">;
  onClose: () => void;
  onSelectNode: (id: string) => void;
  onSelectCity: (city: HostCity) => void;
}) {
  const copy = section === "statistics" ? null : editorialSections[section];
  return (
    <section className="editorial-panel reading-panel glass">
      <button className="panel-close" onClick={onClose} aria-label="Cerrar panel">×</button>
      {copy ? (
        <>
          <p className="eyebrow">{copy.eyebrow}</p>
          <h2>{copy.title}</h2>
          <p className="panel-description">{copy.description}</p>
        </>
      ) : (
        <>
          <p className="eyebrow">EL TORNEO EN NÚMEROS</p>
          <h2>Cifras que revelan la escala.</h2>
          <p className="panel-description">
            No son KPIs decorativos: cada número abre una rama del sistema que lo produjo.
          </p>
        </>
      )}

      {section === "areas" && (
        <div className="domain-directory">
          {atlasNodes.filter((node) => node.kind === "domain").map((node) => (
            <button key={node.id} className={`tone-${node.color}`} onClick={() => onSelectNode(node.id)}>
              <span>{(node.shortLabel ?? node.label).slice(0, 2).toUpperCase()}</span>
              <b>{node.label}</b>
              <small>{node.people ?? node.metric}</small>
              <i>→</i>
            </button>
          ))}
        </div>
      )}

      {section === "matches" && (
        <div className="timeline-list">
          {matchMoments.map(([time, label, node]) => (
            <button key={time} onClick={() => onSelectNode(node)}>
              <span>{time}</span><b>{label}</b><i>→</i>
            </button>
          ))}
        </div>
      )}

      {section === "venues" && (
        <div className="country-groups">
          {hostCities.map((group) => (
            <div key={group.country}>
              <p>{group.country}</p>
              <div>
                {group.cities.map((city) => (
                  <button key={city.id} onClick={() => onSelectCity(city)}>{city.city} · {city.matches}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {section === "people" && (
        <>
          <div className="people-circles">
            <button onClick={() => onSelectNode("world-cup")}>
              <span>A</span><b>≈300.000</b><small>Acreditados</small>
            </button>
            <button onClick={() => onSelectNode("security")}>
              <span>B</span><b>350–500k</b><small>Operación ampliada</small>
            </button>
            <button onClick={() => onSelectNode("technology")}>
              <span>C</span><b>0,5–1,2M</b><small>Cadena global</small>
            </button>
            <p>Los círculos se superponen. No se suman entre sí.</p>
          </div>
          <div className="people-directory">
            <p>Personas identificadas públicamente</p>
            {namedPeopleIndex.map((person) => (
              <button key={person.name} onClick={() => onSelectNode(person.nodeId)}><b>{person.name}</b><small>{person.role}</small><i>→</i></button>
            ))}
          </div>
        </>
      )}

      {section === "statistics" && (
        <div className="stats-grid">
          {topStats.map(([value, label], index) => (
            <button
              key={label}
              onClick={() => {
                const topLevel = atlasNodes.filter((n) => n.kind !== "detail");
                onSelectNode(topLevel[index % topLevel.length].id);
              }}
            >
              <b>{value}</b><span>{label}</span><i>abrir rama →</i>
            </button>
          ))}
        </div>
      )}

      {section === "evidence" && (
        <div className="reference-index">
          {referenceGroups.map((group) => (
            <section key={group.id}>
              <button onClick={() => onSelectNode(group.id)}>{group.label}<span>ver nodo →</span></button>
              <ul>
                {group.sources.map((source) => (
                  <li key={source.url}>
                    <a href={source.url} target="_blank" rel="noreferrer">{source.label}<span>↗</span></a>
                  </li>
                ))}
              </ul>
            </section>
          ))}
          <section className="complete-source-registry">
            <button type="button">Registro completo de investigación<span>{researchSources.length} URLs únicas</span></button>
            <ul>
              {researchSources.map((source) => (
                <li key={`${source.number}-${source.url}`}><a href={source.url} target="_blank" rel="noreferrer"><span>{source.number}</span><b>{source.label}</b><i>↗</i></a></li>
              ))}
            </ul>
          </section>
          <p className="source-count">126 referencias numeradas · {researchSources.length} URLs únicas · corte 12 de julio de 2026.</p>
        </div>
      )}
    </section>
  );
}

function NodeInspector({ node, onClose, onJump }: { node: AtlasNode; onClose: () => void; onJump: (id: string) => void }) {
  const children = atlasNodes.filter((item) => item.parent === node.id);
  const connectedIds = atlasEdges
    .filter((edge) => edge.strength === "cross" && (edge.from === node.id || edge.to === node.id))
    .map((edge) => edge.from === node.id ? edge.to : edge.from);
  const connectedNodes = Array.from(new Set(connectedIds))
    .map((id) => atlasNodes.find((item) => item.id === id))
    .filter((item): item is AtlasNode => Boolean(item) && item.parent !== node.id && item.id !== node.parent);
  const status = node.evidence ?? "estimated";
  const supplierKey = node.kind === "detail" ? node.parent : node.id;
  const suppliers = supplierDirectory[supplierKey ?? ""] ?? [];
  const supplierNames = new Set(suppliers.map((supplier) => supplier.toLowerCase()));
  const organizations = node.organizations?.filter((organization) => !supplierNames.has(organization.toLowerCase())) ?? [];
  const functionalAreas = node.areas?.filter((area) => area.toLowerCase() !== "proveedores") ?? [];
  return (
    <aside className="node-inspector glass" aria-live="polite">
      <button className="panel-close" onClick={onClose} aria-label="Cerrar detalle">×</button>
      <div className={`inspector-signal tone-${node.color}`}>
        <span />
        <small>{node.kind === "detail" ? "DETALLE OPERATIVO" : node.eyebrow}</small>
      </div>
      <h2>{node.label}</h2>
      {node.metric && <p className="node-metric">{node.metric}</p>}
      <div className="node-evidence"><i className={`status-dot ${evidenceTone[status]}`} /><span>{evidenceLabel[status]}</span></div>
      <p className="node-summary">{node.summary}</p>

      {node.people && (
        <div className="people-estimate">
          <span>Personas · rango no aditivo</span>
          <b>{node.people}</b>
        </div>
      )}

      {functionalAreas.length > 0 && (
        <div className="inspector-section areas-section">
          <p>Áreas que intervienen</p>
          <div className="area-chips">
            {functionalAreas.map((area) => <span key={area}>{area}</span>)}
          </div>
        </div>
      )}

      {suppliers.length > 0 && (
        <div className="inspector-section suppliers-section">
          <p>Proveedores involucrados</p>
          <ul className="supplier-list">{suppliers.map((supplier) => <li key={supplier}>{supplier}</li>)}</ul>
        </div>
      )}

      {node.countries && node.countries.length > 0 && (
        <div className="inspector-section countries-section">
          <p>Países y alcance</p>
          <div className="area-chips country-chips">{node.countries.map((country) => <span key={country}>{country}</span>)}</div>
        </div>
      )}

      {organizations.length > 0 && (
        <div className="inspector-section">
          <p>Organizaciones</p>
          <ul className="organization-list">{organizations.map((organization) => <li key={organization}>{organization}</li>)}</ul>
        </div>
      )}

      {node.peopleNamed && node.peopleNamed.length > 0 && (
        <div className="inspector-section">
          <p>Personas identificadas</p>
          <div className="named-people">{node.peopleNamed.map((person) => <span key={`${person.name}-${person.role}`}><b>{person.name}</b><small>{person.role}</small></span>)}</div>
        </div>
      )}

      <div className="inspector-section">
        <p>Lo que sabemos</p>
        <ul>{node.facts.map((fact) => <li key={fact}><i className={`status-dot ${evidenceTone[status]}`} />{fact}</li>)}</ul>
      </div>

      {node.chain && (
        <div className="inspector-section">
          <p>Cadena</p>
          <div className="chain-flow">
            {node.chain.map((step, index) => (
              <span key={step}>{step}{index < node.chain!.length - 1 && <i>→</i>}</span>
            ))}
          </div>
        </div>
      )}

      {children.length > 0 && (
        <div className="inspector-section">
          <p>Abrir esta rama</p>
          <div className="related-list">
            {children.map((child) => (
              <button key={child.id} onClick={() => onJump(child.id)}>
                <span className={`mini-tone tone-${child.color}`} />
                <b>{child.label}</b><i>→</i>
              </button>
            ))}
          </div>
        </div>
      )}

      {connectedNodes.length > 0 && (
        <div className="inspector-section">
          <p>Procesos conectados</p>
          <div className="related-list connected-list">
            {connectedNodes.map((connected) => (
              <button key={connected.id} onClick={() => onJump(connected.id)}>
                <span className={`mini-tone tone-${connected.color}`} />
                <b>{connected.label}</b><i>↗</i>
              </button>
            ))}
          </div>
        </div>
      )}

      {node.sources && (
        <div className="inspector-section source-links">
          <p>Evidencia</p>
          {node.sources.map((item) => (
            <a href={item.url} target="_blank" rel="noreferrer" key={item.url}>{item.label} ↗</a>
          ))}
        </div>
      )}
    </aside>
  );
}

function CityInspector({ city, onClose, onOpenDomain }: { city: HostCity; onClose: () => void; onOpenDomain: (id: string) => void }) {
  return (
    <aside className="node-inspector city-inspector glass" aria-live="polite">
      <button className="panel-close" onClick={onClose} aria-label="Cerrar sede">×</button>
      <div className="inspector-signal tone-lime"><span /><small>{city.country} · {city.matches} partidos</small></div>
      <h2>{city.city}</h2>
      <p className="node-metric">{city.venue}</p>
      <p className="node-summary">La sede funciona como una interfaz entre FIFA/FWC26, gobiernos, estadio, transporte, seguridad, salud y proveedores.</p>

      <div className="inspector-section"><p>Interfaz local</p><ul className="organization-list"><li>{city.interface}</li>{city.leaders.map((leader) => <li key={leader}>{leader}</li>)}</ul></div>
      <div className="inspector-section"><p>Propiedad y operación</p><p className="city-copy">{city.ownerOperator}</p></div>
      <div className="inspector-section"><p>Capa pública</p><p className="city-copy">{city.publicLayer}</p></div>
      <div className="inspector-section"><p>Movilidad</p><p className="city-copy">{city.mobility}</p></div>
      <div className="inspector-section"><p>Dinero y evidencia</p><p className="city-copy">{city.finance}</p></div>
      <div className="inspector-section"><p>Cadena de la sede</p><div className="chain-flow">{["Garantías", "Comité", "Venue", "Procurement", "Permisos", "Operación", "Auditoría"].map((step, index, all) => <span key={step}>{step}{index < all.length - 1 && <i>→</i>}</span>)}</div></div>
      <div className="city-domain-actions">
        <button onClick={() => onOpenDomain("governance")}>Abrir gobernanza →</button>
        <button onClick={() => onOpenDomain("venues")}>Abrir estadios →</button>
        <button onClick={() => onOpenDomain("transport")}>Abrir movilidad →</button>
      </div>
      <div className="inspector-section source-links"><p>Evidencia</p><a href={city.source.url} target="_blank" rel="noreferrer">{city.source.label} ↗</a></div>
    </aside>
  );
}

function SearchOverlay({ onClose, onSelect, onSelectCity }: { onClose: () => void; onSelect: (id: string) => void; onSelectCity: (city: HostCity) => void }) {
  const [query, setQuery] = useState("");
  const results = atlasNodes
    .filter((node) => `${node.label} ${node.summary} ${node.metric ?? ""}`.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 6);
  const cityResults = hostCities
    .flatMap((group) => group.cities)
    .filter((city) => `${city.city} ${city.country} ${city.venue} ${city.interface}`.toLowerCase().includes(query.toLowerCase()))
    .slice(0, Math.max(0, 8 - results.length));
  return (
    <div className="search-overlay" role="dialog" aria-modal="true" aria-label="Buscar en el atlas">
      <button className="search-backdrop" onClick={onClose} aria-label="Cerrar búsqueda" />
      <div className="search-box glass">
        <div className="search-input-row">
          <span>⌕</span>
          <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar personas, áreas, objetos o procesos…" />
          <kbd>ESC</kbd>
        </div>
        <div className="search-results">
          {results.map((node) => (
            <button key={node.id} onClick={() => onSelect(node.id)}>
              <span className={`search-tone tone-${node.color}`} />
              <span><b>{node.label}</b><small>{node.eyebrow}</small></span>
              <i>{node.metric ?? "abrir"}</i>
            </button>
          ))}
          {cityResults.map((city) => (
            <button key={city.id} onClick={() => onSelectCity(city)}>
              <span className="search-tone tone-lime" />
              <span><b>{city.city}</b><small>{city.country} · {city.venue}</small></span>
              <i>{city.matches} partidos</i>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<HostCity | null>(null);
  const [activeSection, setActiveSection] = useState<Section | null>("overview");
  const [activeFilter, setActiveFilter] = useState<"all" | Layer>("all");
  const [metricMode, setMetricMode] = useState<MetricMode>("people");
  const [scale, setScale] = useState(0.82);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [drag, setDrag] = useState<{ x: number; y: number; panX: number; panY: number } | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [urlReady, setUrlReady] = useState(false);
  const decorative = useDecorativeNetwork();

  const nodeMap = useMemo(() => new Map(atlasNodes.map((node) => [node.id, node])), []);
  const selectedNode = selectedId ? nodeMap.get(selectedId) ?? null : null;
  const contextParentId = selectedNode?.kind === "domain" ? selectedNode.id : selectedNode?.parent ?? null;
  const related = useMemo(() => {
    if (!selectedId) return new Set<string>();
    const ids = new Set<string>([selectedId]);
    atlasEdges.forEach((edge) => {
      if (edge.from === selectedId) ids.add(edge.to);
      if (edge.to === selectedId) ids.add(edge.from);
    });
    return ids;
  }, [selectedId]);

  const fitNodes = useCallback((nodes: AtlasNode[], maxScale = 0.98, focused = false) => {
    if (!svgRef.current || nodes.length === 0) return;
    const rect = svgRef.current.getBoundingClientRect();
    const baseScale = Math.max(rect.width / MAP_WIDTH, rect.height / MAP_HEIGHT);
    const visibleWidth = rect.width / baseScale;
    const visibleHeight = rect.height / baseScale;
    const minX = Math.min(...nodes.map((node) => node.x - node.radius - 34));
    const maxX = Math.max(...nodes.map((node) => node.x + node.radius + 34));
    const minY = Math.min(...nodes.map((node) => node.y - node.radius - 34));
    const maxY = Math.max(...nodes.map((node) => node.y + node.radius + 34));
    const contentWidth = Math.max(1, maxX - minX);
    const contentHeight = Math.max(1, maxY - minY);
    const nextScale = Math.max(
      MIN_SCALE,
      Math.min(maxScale, (visibleWidth * (focused ? 0.78 : 0.9)) / contentWidth, (visibleHeight * (focused ? 0.76 : 0.9)) / contentHeight),
    );
    const mobile = rect.width <= 900;
    const targetX = focused && !mobile ? 625 : MAP_WIDTH / 2;
    const targetY = focused && mobile ? 245 : MAP_HEIGHT / 2;
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    setScale(nextScale);
    setPan({ x: targetX - centerX * nextScale, y: targetY - centerY * nextScale });
  }, []);

  const fitAll = useCallback(() => fitNodes(atlasNodes, 0.98, false), [fitNodes]);

  const focusNode = useCallback((id: string) => {
    const node = nodeMap.get(id);
    if (!node) return;
    setSelectedId(id);
    setSelectedCity(null);
    setActiveSection(null);
    const branchId = node.kind === "domain" ? node.id : node.parent;
    const branch = node.kind === "root"
      ? atlasNodes
      : atlasNodes.filter((item) => item.id === branchId || item.parent === branchId);
    requestAnimationFrame(() => fitNodes(branch.length > 0 ? branch : [node], node.kind === "detail" ? 1.16 : 1.06, true));
  }, [fitNodes, nodeMap]);

  const resetMap = useCallback(() => {
    setSelectedId(null);
    setSelectedCity(null);
    setActiveSection(null);
    setSearchOpen(false);
    requestAnimationFrame(fitAll);
  }, [fitAll]);

  const openSection = (section: Section) => {
    setSelectedId(null);
    setSelectedCity(null);
    setActiveSection(section);
    if (section === "overview") requestAnimationFrame(fitAll);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const filter = params.get("layer");
    const metric = params.get("metric");
    const node = params.get("node");
    const cityId = params.get("city");
    const section = params.get("view");
    const frame = requestAnimationFrame(() => {
      if (filter === "all" || filter === "fifa" || filter === "government" || filter === "supplier") setActiveFilter(filter);
      if (metric === "people" || metric === "processes") setMetricMode(metric);
      if (node && nodeMap.has(node)) {
        focusNode(node);
      } else if (cityId) {
        const city = hostCities.flatMap((country) => country.cities).find((item) => item.id === cityId);
        if (city) {
          setSelectedCity(city);
          setSelectedId(null);
          setActiveSection(null);
        } else fitAll();
      } else if (section && navItems.some((item) => item.id === section)) {
        setActiveSection(section as Section);
        fitAll();
      } else {
        fitAll();
      }
      setUrlReady(true);
    });
    return () => cancelAnimationFrame(frame);
  }, [fitAll, focusNode, nodeMap]);

  useEffect(() => {
    if (!urlReady) return;
    const params = new URLSearchParams();
    if (selectedId) params.set("node", selectedId);
    else if (selectedCity) params.set("city", selectedCity.id);
    else if (activeSection) params.set("view", activeSection);
    if (activeFilter !== "all") params.set("layer", activeFilter);
    if (metricMode !== "people") params.set("metric", metricMode);
    const query = params.toString();
    window.history.replaceState(null, "", `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`);
  }, [activeFilter, activeSection, metricMode, selectedCity, selectedId, urlReady]);

  useEffect(() => {
    const onResize = () => {
      if (!selectedId && !selectedCity) fitAll();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [fitAll, selectedCity, selectedId]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (searchOpen) setSearchOpen(false);
        else if (selectedCity) setSelectedCity(null);
        else if (selectedId) setSelectedId(null);
        else setActiveSection(null);
      }
      if (event.key === "/" && !searchOpen) {
        event.preventDefault();
        setSearchOpen(true);
      }
      if (event.key === "+" || event.key === "=") setScale((value) => Math.min(1.8, value + 0.12));
      if (event.key === "-") setScale((value) => Math.max(MIN_SCALE, value - 0.12));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [searchOpen, selectedCity, selectedId]);

  const focusCity = useCallback((city: HostCity) => {
    setSelectedId(null);
    setActiveSection(null);
    setSelectedCity(city);
  }, []);

  const onPointerDown = (event: ReactPointerEvent<SVGSVGElement>) => {
    if ((event.target as Element).closest(".atlas-node")) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    setDrag({ x: event.clientX, y: event.clientY, panX: pan.x, panY: pan.y });
  };

  const onPointerMove = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (!drag || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    setPan({
      x: drag.panX + (event.clientX - drag.x) * (1600 / rect.width),
      y: drag.panY + (event.clientY - drag.y) * (1000 / rect.height),
    });
  };

  const onWheel = (event: ReactWheelEvent<SVGSVGElement>) => {
    event.preventDefault();
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const px = ((event.clientX - rect.left) / rect.width) * 1600;
    const py = ((event.clientY - rect.top) / rect.height) * 1000;
    const nextScale = Math.min(1.8, Math.max(MIN_SCALE, scale * (event.deltaY > 0 ? 0.9 : 1.1)));
    const worldX = (px - pan.x) / scale;
    const worldY = (py - pan.y) / scale;
    setPan({ x: px - worldX * nextScale, y: py - worldY * nextScale });
    setScale(nextScale);
  };

  return (
    <main className="atlas-shell">
      <svg
        ref={svgRef}
        className={`atlas-canvas ${drag ? "is-dragging" : ""}`}
        viewBox="0 0 1600 1000"
        preserveAspectRatio="xMidYMid slice"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={() => setDrag(null)}
        onPointerCancel={() => setDrag(null)}
        onWheel={onWheel}
        aria-label="Mapa interactivo de la organización del Mundial 2026"
      >
        <defs>
          <radialGradient id="worldGlow">
            <stop offset="0" stopColor="#c7ff45" stopOpacity=".18" />
            <stop offset=".55" stopColor="#c7ff45" stopOpacity=".05" />
            <stop offset="1" stopColor="#c7ff45" stopOpacity="0" />
          </radialGradient>
          <filter id="softGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <rect width="1600" height="1000" fill="var(--void)" />
        <g className="background-grid">
          {decorative.lines.map(([a, b], index) => (
            <line key={index} x1={decorative.points[a].x} y1={decorative.points[a].y} x2={decorative.points[b].x} y2={decorative.points[b].y} />
          ))}
          {decorative.points.map((point) => (
            <circle key={point.id} cx={point.x} cy={point.y} r={point.radius} className={`ambient-group-${point.group}`} />
          ))}
        </g>
        <g transform={`translate(${pan.x} ${pan.y}) scale(${scale})`} className="atlas-world">
          <circle cx="760" cy="520" r="285" fill="url(#worldGlow)" />
          <g className="cluster-layer">
            {atlasClusters.map((cluster) => (
              <g key={cluster.id} className={`cluster-island tone-${cluster.color}`}>
                <path className="cluster-hull" d={cluster.hull} />
                <text className="cluster-label" x={cluster.labelX} y={cluster.labelY}>{cluster.label}</text>
                <text className="cluster-subtitle" x={cluster.labelX} y={cluster.labelY + 15}>{cluster.subtitle}</text>
                <rect className="cluster-hub" x={cluster.hubX - 5} y={cluster.hubY - 5} width="10" height="10" rx="2" transform={`rotate(45 ${cluster.hubX} ${cluster.hubY})`} />
              </g>
            ))}
          </g>
          <g className="edge-layer">
            {atlasClusters.map((cluster) => {
              const root = nodeMap.get("world-cup")!;
              const clusterRelated = !selectedId || selectedId === "world-cup" || cluster.domains.some((id) => related.has(id));
              return (
                <path
                  key={`trunk-${cluster.id}`}
                  d={edgePath(root, { x: cluster.hubX, y: cluster.hubY })}
                  className={`edge-trunk ${selectedId && !clusterRelated ? "is-muted" : ""}`}
                />
              );
            })}
            {atlasEdges.map((edge) => {
              const from = nodeMap.get(edge.from)!;
              const to = nodeMap.get(edge.to)!;
              const isRelated = selectedId && (related.has(edge.from) && related.has(edge.to));
              const cluster = edge.strength === "main" ? atlasClusters.find((item) => item.domains.includes(edge.to)) : null;
              const pathFrom = cluster ? { x: cluster.hubX, y: cluster.hubY } : from;
              return (
                <path
                  key={`${edge.from}-${edge.to}`}
                  d={edgePath(pathFrom, to)}
                  className={`${edge.strength === "main" ? "edge-main" : edge.strength === "cross" ? "edge-cross" : "edge-soft"} ${isRelated ? "is-related" : ""} ${selectedId && !isRelated ? "is-muted" : ""}`}
                />
              );
            })}
          </g>
          <g className="node-layer">
            {atlasNodes.map((node, index) => {
              const matchesFilter = activeFilter === "all" || node.layer === activeFilter || node.layer === "mixed";
              const isSelected = selectedId === node.id;
              const isRelated = related.has(node.id);
              const muted = !matchesFilter || (selectedId !== null && !isRelated);
              const metricLabel = visibleMetric(node, metricMode);
              const parentNode = node.parent ? nodeMap.get(node.parent) : null;
              const labelOnRight = !parentNode || node.x >= parentNode.x;
              const badgeWidth = node.kind === "root" ? 126 : 102;
              return (
                <g
                  key={node.id}
                  className={`atlas-node node-${node.kind} tone-${node.color} ${isSelected ? "is-selected" : ""} ${isRelated ? "is-related" : ""} ${node.kind === "detail" && contextParentId === node.parent ? "is-in-context" : ""} ${muted ? "is-muted" : ""}`}
                  transform={`translate(${node.x} ${node.y})`}
                  style={{ "--delay": `${(index % 12) * -0.31}s`, "--node-color": colorFor(node) } as CSSProperties}
                  tabIndex={0}
                  role="button"
                  aria-label={`${node.label}. ${metricMode === "people" ? "Personas" : "Procesos"}: ${metricLabel}`}
                  onClick={(event) => { event.stopPropagation(); focusNode(node.id); }}
                  onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") focusNode(node.id); }}
                >
                  <circle className="node-halo" r={node.radius + (node.kind === "detail" ? 10 : 22)} />
                  <circle className="node-ring outer" r={node.radius + (node.kind === "detail" ? 3 : 7)} />
                  <circle className="node-body" r={node.radius} />
                  <circle className={`evidence-pin ${evidenceTone[node.evidence ?? "estimated"]}`} cx={node.radius * 0.7} cy={-node.radius * 0.7} r={node.kind === "detail" ? 2.6 : 4} />
                  {node.kind === "detail" ? (
                    <>
                      <circle className="node-pin" r="4" />
                      <text className="detail-label" x={labelOnRight ? 24 : -24} y="4" textAnchor={labelOnRight ? "start" : "end"}>{node.label}</text>
                      <text className="detail-metric" x={labelOnRight ? 24 : -24} y="16" textAnchor={labelOnRight ? "start" : "end"}>{metricLabel}</text>
                    </>
                  ) : node.kind === "root" ? (
                    <>
                      <image className="root-world-cup-mark" href="/world-cup-2026-mark.svg" x="-35" y="-66" width="70" height="108" preserveAspectRatio="xMidYMid meet" />
                      <rect className="node-metric-badge" x={-badgeWidth / 2} y={node.radius - 8} width={badgeWidth} height="20" rx="10" />
                      <text className="node-small" y={node.radius + 6}>{metricLabel}</text>
                    </>
                  ) : (
                    <>
                      <text className="node-icon" y="-8">{domainIcons[node.id] ?? "•"}</text>
                      <text className="node-label" y="23">{node.shortLabel ?? node.label}</text>
                      <rect className="node-metric-badge" x={-badgeWidth / 2} y={node.radius - 8} width={badgeWidth} height="20" rx="10" />
                      <text className="node-small" y={node.radius + 6}>{metricLabel}</text>
                    </>
                  )}
                </g>
              );
            })}
          </g>
        </g>
      </svg>

      <div className="atmosphere" aria-hidden="true" />
      <FloatingNavigation activeSection={activeSection} onSection={openSection} />

      <div className="top-tools">
        <button className="search-trigger glass" onClick={() => setSearchOpen(true)}>
          <span>⌕</span><span>Buscar en el sistema</span><kbd>/</kbd>
        </button>
        <div className="filter-dock glass" aria-label="Filtrar capas">
          {filters.map((filter) => (
            <button key={filter.id} className={`${activeFilter === filter.id ? "is-active" : ""} tone-${filter.tone}`} onClick={() => setActiveFilter(filter.id)}>
              <span />{filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="metric-mode-dock glass" aria-label="Métrica visible en los nodos">
        <span>Mostrar</span>
        <button className={metricMode === "people" ? "is-active" : ""} onClick={() => setMetricMode("people")}>Personas</button>
        <button className={metricMode === "processes" ? "is-active" : ""} onClick={() => setMetricMode("processes")}>Procesos</button>
      </div>

      {activeSection === "overview" && (
        <OverviewPanel onExplore={() => setActiveSection(null)} onEnterMatch={() => focusNode("matches")} onClose={() => setActiveSection(null)} />
      )}
      {activeSection && activeSection !== "overview" && (
        <EditorialPanel section={activeSection} onClose={() => setActiveSection(null)} onSelectNode={focusNode} onSelectCity={focusCity} />
      )}
      {selectedNode && <NodeInspector node={selectedNode} onClose={() => setSelectedId(null)} onJump={focusNode} />}
      {selectedCity && <CityInspector city={selectedCity} onClose={() => setSelectedCity(null)} onOpenDomain={focusNode} />}

      <div className="map-hint glass">
        <span className="live-dot" />
        Arrastrá para recorrer · rueda para zoom · click para abrir
      </div>
      <aside className="evidence-legend glass" aria-label="Tipos de evidencia">
        <b>Evidencia</b>
        {evidenceLegend.map(([label, status]) => (
          <span key={status}><i className={`status-dot ${status}`} />{label}</span>
        ))}
      </aside>
      <div className="zoom-controls glass" aria-label="Controles del mapa">
        <button onClick={() => setScale((value) => Math.min(1.8, value + 0.12))} aria-label="Acercar">+</button>
        <span>{Math.round(scale * 100)}%</span>
        <button onClick={() => setScale((value) => Math.max(MIN_SCALE, value - 0.12))} aria-label="Alejar">−</button>
        <button onClick={resetMap} aria-label="Restablecer mapa">⌂</button>
      </div>

      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} onSelect={(id) => { setSearchOpen(false); focusNode(id); }} onSelectCity={(city) => { setSearchOpen(false); focusCity(city); }} />}
    </main>
  );
}
