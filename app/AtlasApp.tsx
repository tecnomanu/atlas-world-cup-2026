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
  type AtlasNode,
  type EvidenceStatus,
  type HostCity,
  type Layer,
} from "./world-data";
import { researchSources } from "./research-sources.generated";
import { useAtlasUi, type Section, type MetricMode } from "./i18n/useAtlasUi";



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


const evidenceTone: Record<EvidenceStatus, string> = {
  confirmed: "high",
  derived: "medium",
  estimated: "estimate",
  private: "unknown",
  future: "future",
};

function visibleMetric(
  node: AtlasNode,
  mode: MetricMode,
  atlasNodes: AtlasNode[],
  labels: { noData: string; processes: string; steps: string },
) {
  if (mode === "people") {
    if (peopleBadges[node.id]) return peopleBadges[node.id];
    const range = node.people?.match(/(?:≈\s*)?\d[\d.,]*(?:\s*[–-]\s*\d[\d.,]*)?(?:\s*[kKmM])?/);
    return range?.[0]?.replaceAll(" ", "") ?? labels.noData;
  }
  if (node.kind === "root") return `${atlasNodes.filter((item) => item.kind === "detail").length} ${labels.processes}`;
  if (node.kind === "domain") return `${atlasNodes.filter((item) => item.parent === node.id).length} ${labels.processes}`;
  return `${node.chain?.length ?? 1} ${labels.steps}`;
}

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
  const { t, navItems } = useAtlasUi();

  return (
    <aside className="nav-rail glass" aria-label={t.navAria}>
      <button className="brand-button" onClick={() => onSection("overview")} aria-label={t.homeAria}>
        <BrandMark />
        <span className="brand-name">{t.brandLine1}<br />{t.brandLine2}</span>
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
        <span>{t.researchVersion}</span>
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
  const { t, editorialSections } = useAtlasUi();

  const section = editorialSections.overview;
  return (
    <section className="editorial-panel hero-panel glass">
      <button className="panel-close" onClick={onClose} aria-label={t.closePanelAria}>×</button>
      <p className="eyebrow">{section.eyebrow}</p>
      <h1>{section.title}</h1>
      <span className="title-rule" />
      <p className="panel-description">{section.description}</p>
      <div className="hero-actions">
        <button className="primary-button" onClick={onExplore}>
          {t.exploreMap} <span>→</span>
        </button>
        <button className="secondary-button" onClick={onEnterMatch}>
          {t.enterMatch}
        </button>
      </div>
      <div className="hero-stats" aria-label={t.mainStatsAria}>
        <span><b>18</b> {t.heroDomains}</span>
        <i />
        <span><b>16</b> {t.heroVenues}</span>
        <i />
        <span><b>48</b> {t.heroTeams}</span>
        <i />
        <span><b>3</b> {t.heroCountries}</span>
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
  const { t, atlasNodes, hostCities, topStats, editorialSections, matchMoments, namedPeopleIndex, referenceGroups } = useAtlasUi();

  const copy = section === "statistics" ? null : editorialSections[section];
  return (
    <section className="editorial-panel reading-panel glass">
      <button className="panel-close" onClick={onClose} aria-label={t.closePanelAria}>×</button>
      {copy ? (
        <>
          <p className="eyebrow">{copy.eyebrow}</p>
          <h2>{copy.title}</h2>
          <p className="panel-description">{copy.description}</p>
        </>
      ) : (
        <>
          <p className="eyebrow">{t.statsEyebrow}</p>
          <h2>{t.statsTitle}</h2>
          <p className="panel-description">{t.statsDescription}</p>
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
              <span>A</span><b>≈300.000</b><small>{t.peopleAccredited}</small>
            </button>
            <button onClick={() => onSelectNode("security")}>
              <span>B</span><b>350–500k</b><small>{t.peopleExpanded}</small>
            </button>
            <button onClick={() => onSelectNode("technology")}>
              <span>C</span><b>0,5–1,2M</b><small>{t.peopleGlobalChain}</small>
            </button>
            <p>{t.peopleOverlapNote}</p>
          </div>
          <div className="people-directory">
            <p>{t.peopleIdentifiedTitle}</p>
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
              <b>{value}</b><span>{label}</span><i>{t.openBranch}</i>
            </button>
          ))}
        </div>
      )}

      {section === "evidence" && (
        <div className="reference-index">
          {referenceGroups.map((group) => (
            <section key={group.id}>
              <button onClick={() => onSelectNode(group.id)}>{group.label}<span>{t.seeNode}</span></button>
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
            <button type="button">{t.completeRegistry}<span>{researchSources.length} {t.uniqueUrls}</span></button>
            <ul>
              {researchSources.map((source) => (
                <li key={`${source.number}-${source.url}`}><a href={source.url} target="_blank" rel="noreferrer"><span>{source.number}</span><b>{source.label}</b><i>↗</i></a></li>
              ))}
            </ul>
          </section>
          <p className="source-count">{t.sourceCountLine(researchSources.length)}</p>
        </div>
      )}
    </section>
  );
}

function NodeInspector({ node, onClose, onJump }: { node: AtlasNode; onClose: () => void; onJump: (id: string) => void }) {
  const { t, atlasNodes, atlasEdges, evidenceLabel, suppliers } = useAtlasUi();
  const activeNode = atlasNodes.find((item) => item.id === node.id) ?? node;

  const children = atlasNodes.filter((item) => item.parent === activeNode.id);
  const connectedIds = atlasEdges
    .filter((edge) => edge.strength === "cross" && (edge.from === activeNode.id || edge.to === activeNode.id))
    .map((edge) => edge.from === activeNode.id ? edge.to : edge.from);
  const connectedNodes = Array.from(new Set(connectedIds))
    .map((id) => atlasNodes.find((item) => item.id === id))
    .filter((item): item is AtlasNode => {
      if (!item) return false;
      return item.parent !== activeNode.id && item.id !== activeNode.parent;
    });
  const status = activeNode.evidence ?? "estimated";
  const supplierKey = activeNode.kind === "detail" ? activeNode.parent : activeNode.id;
  const supplierList = suppliers[supplierKey ?? ""] ?? [];
  const supplierNames = new Set(supplierList.map((supplier) => supplier.toLowerCase()));
  const organizations = activeNode.organizations?.filter((organization) => !supplierNames.has(organization.toLowerCase())) ?? [];
  const functionalAreas = activeNode.areas?.filter((area) => area.toLowerCase() !== t.suppliersAreaFilter) ?? [];
  return (
    <aside className="node-inspector glass" aria-live="polite">
      <button className="panel-close" onClick={onClose} aria-label={t.closeDetailAria}>×</button>
      <div className={`inspector-signal tone-${activeNode.color}`}>
        <span />
        <small>{activeNode.kind === "detail" ? t.detailOperative : activeNode.eyebrow}</small>
      </div>
      <h2>{activeNode.label}</h2>
      {activeNode.metric && <p className="node-metric">{activeNode.metric}</p>}
      <div className="node-evidence"><i className={`status-dot ${evidenceTone[status]}`} /><span>{evidenceLabel[status]}</span></div>
      <p className="node-summary">{activeNode.summary}</p>

      {activeNode.people && (
        <div className="people-estimate">
          <span>{t.peopleNonAdditive}</span>
          <b>{activeNode.people}</b>
        </div>
      )}

      {functionalAreas.length > 0 && (
        <div className="inspector-section areas-section">
          <p>{t.areasInvolved}</p>
          <div className="area-chips">
            {functionalAreas.map((area) => <span key={area}>{area}</span>)}
          </div>
        </div>
      )}

      {supplierList.length > 0 && (
        <div className="inspector-section suppliers-section">
          <p>{t.suppliersInvolved}</p>
          <ul className="supplier-list">{supplierList.map((supplier) => <li key={supplier}>{supplier}</li>)}</ul>
        </div>
      )}

      {activeNode.countries && activeNode.countries.length > 0 && (
        <div className="inspector-section countries-section">
          <p>{t.countriesScope}</p>
          <div className="area-chips country-chips">{activeNode.countries.map((country) => <span key={country}>{country}</span>)}</div>
        </div>
      )}

      {organizations.length > 0 && (
        <div className="inspector-section">
          <p>{t.organizations}</p>
          <ul className="organization-list">{organizations.map((organization) => <li key={organization}>{organization}</li>)}</ul>
        </div>
      )}

      {activeNode.peopleNamed && activeNode.peopleNamed.length > 0 && (
        <div className="inspector-section">
          <p>{t.peopleIdentified}</p>
          <div className="named-people">{activeNode.peopleNamed.map((person) => <span key={`${person.name}-${person.role}`}><b>{person.name}</b><small>{person.role}</small></span>)}</div>
        </div>
      )}

      <div className="inspector-section">
        <p>{t.whatWeKnow}</p>
        <ul>{activeNode.facts.map((fact) => <li key={fact}><i className={`status-dot ${evidenceTone[status]}`} />{fact}</li>)}</ul>
      </div>

      {activeNode.chain && (
        <div className="inspector-section">
          <p>{t.chain}</p>
          <div className="chain-flow">
            {activeNode.chain.map((step, index) => (
              <span key={step}>{step}{index < activeNode.chain!.length - 1 && <i>→</i>}</span>
            ))}
          </div>
        </div>
      )}

      {children.length > 0 && (
        <div className="inspector-section">
          <p>{t.openBranchSection}</p>
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
          <p>{t.connectedProcesses}</p>
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

      {activeNode.sources && (
        <div className="inspector-section source-links">
          <p>{t.evidenceTitle}</p>
          {activeNode.sources.map((item) => (
            <a href={item.url} target="_blank" rel="noreferrer" key={item.url}>{item.label} ↗</a>
          ))}
        </div>
      )}
    </aside>
  );
}

function CityInspector({ city, onClose, onOpenDomain }: { city: HostCity; onClose: () => void; onOpenDomain: (id: string) => void }) {
  const { t } = useAtlasUi();

  return (
    <aside className="node-inspector city-inspector glass" aria-live="polite">
      <button className="panel-close" onClick={onClose} aria-label={t.closeCityAria}>×</button>
      <div className="inspector-signal tone-lime"><span /><small>{city.country} · {t.cityMatches(city.matches)}</small></div>
      <h2>{city.city}</h2>
      <p className="node-metric">{city.venue}</p>
      <p className="node-summary">{t.citySummary}</p>

      <div className="inspector-section"><p>{t.localInterface}</p><ul className="organization-list"><li>{city.interface}</li>{city.leaders.map((leader) => <li key={leader}>{leader}</li>)}</ul></div>
      <div className="inspector-section"><p>{t.ownershipOps}</p><p className="city-copy">{city.ownerOperator}</p></div>
      <div className="inspector-section"><p>{t.publicLayer}</p><p className="city-copy">{city.publicLayer}</p></div>
      <div className="inspector-section"><p>{t.mobility}</p><p className="city-copy">{city.mobility}</p></div>
      <div className="inspector-section"><p>{t.moneyEvidence}</p><p className="city-copy">{city.finance}</p></div>
      <div className="inspector-section"><p>{t.venueChain}</p><div className="chain-flow">{t.cityChainSteps.map((step, index, all) => <span key={step}>{step}{index < all.length - 1 && <i>→</i>}</span>)}</div></div>
      <div className="city-domain-actions">
        <button onClick={() => onOpenDomain("governance")}>{t.openGovernance}</button>
        <button onClick={() => onOpenDomain("venues")}>{t.openVenues}</button>
        <button onClick={() => onOpenDomain("transport")}>{t.openMobility}</button>
      </div>
      <div className="inspector-section source-links"><p>{t.evidenceTitle}</p><a href={city.source.url} target="_blank" rel="noreferrer">{city.source.label} ↗</a></div>
    </aside>
  );
}

function SearchOverlay({ onClose, onSelect, onSelectCity }: { onClose: () => void; onSelect: (id: string) => void; onSelectCity: (city: HostCity) => void }) {
  const { t, atlasNodes, hostCities } = useAtlasUi();

  const [query, setQuery] = useState("");
  const results = atlasNodes
    .filter((node) => `${node.label} ${node.summary} ${node.metric ?? ""}`.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 6);
  const cityResults = hostCities
    .flatMap((group) => group.cities)
    .filter((city) => `${city.city} ${city.country} ${city.venue} ${city.interface}`.toLowerCase().includes(query.toLowerCase()))
    .slice(0, Math.max(0, 8 - results.length));
  return (
    <div className="search-overlay" role="dialog" aria-modal="true" aria-label={t.searchDialogAria}>
      <button className="search-backdrop" onClick={onClose} aria-label={t.closeSearchAria} />
      <div className="search-box glass">
        <div className="search-input-row">
          <span>⌕</span>
          <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.searchPlaceholder} />
          <kbd>ESC</kbd>
        </div>
        <div className="search-results">
          {results.map((node) => (
            <button key={node.id} onClick={() => onSelect(node.id)}>
              <span className={`search-tone tone-${node.color}`} />
              <span><b>{node.label}</b><small>{node.eyebrow}</small></span>
              <i>{node.metric ?? t.openLabel}</i>
            </button>
          ))}
          {cityResults.map((city) => (
            <button key={city.id} onClick={() => onSelectCity(city)}>
              <span className="search-tone tone-lime" />
              <span><b>{city.city}</b><small>{city.country} · {city.venue}</small></span>
              <i>{t.cityMatches(city.matches)}</i>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AtlasApp() {
  const { locale, setLocale, t, atlasNodes, atlasEdges, atlasClusters, hostCities, navItems, filters, evidenceLegend, evidenceLabel } = useAtlasUi();

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

  const nodeMap = useMemo(() => new Map(atlasNodes.map((node) => [node.id, node])), [atlasNodes]);
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
  }, [atlasEdges, selectedId]);

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

  const fitAll = useCallback(() => fitNodes(atlasNodes, 0.98, false), [atlasNodes, fitNodes]);

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
  }, [atlasNodes, fitNodes, nodeMap]);

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
    if (locale !== "es") params.set("lang", locale);
    const query = params.toString();
    window.history.replaceState(null, "", `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`);
  }, [activeFilter, activeSection, locale, metricMode, selectedCity, selectedId, urlReady]);

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

  // When locale changes, refresh the selected host city from the localized dataset.
  const selectedCityId = selectedCity?.id;
  useEffect(() => {
    if (!selectedCityId) return;
    const next = hostCities
      .flatMap((group) => group.cities)
      .find((city) => city.id === selectedCityId);
    if (next) setSelectedCity(next);
  }, [hostCities, selectedCityId]);

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
        aria-label={t.mapCanvasAria}
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
              const metricLabel = visibleMetric(node, metricMode, atlasNodes, { noData: t.metricNoData, processes: t.metricProcesses, steps: t.metricSteps });
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
                  aria-label={`${node.label}. ${metricMode === "people" ? t.nodeMetricPeople : t.nodeMetricProcesses}: ${metricLabel}`}
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
          <span>⌕</span><span>{t.searchTrigger}</span><kbd>/</kbd>
        </button>
        <div className="filter-dock glass" aria-label={t.filterLayersAria}>
          {filters.map((filter) => (
            <button key={filter.id} className={`${activeFilter === filter.id ? "is-active" : ""} tone-${filter.tone}`} onClick={() => setActiveFilter(filter.id)}>
              <span />{filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="side-tools">
        <div className="lang-dock glass" aria-label="Language">
          <button className={locale === "es" ? "is-active" : ""} onClick={() => setLocale("es")} aria-label={t.switchToEs}>{t.langEs}</button>
          <button className={locale === "en" ? "is-active" : ""} onClick={() => setLocale("en")} aria-label={t.switchToEn}>{t.langEn}</button>
        </div>
        <div className="metric-mode-dock glass" aria-label={t.metricDockAria}>
          <span>{t.showLabel}</span>
          <button className={metricMode === "people" ? "is-active" : ""} onClick={() => setMetricMode("people")}>{t.metricPeople}</button>
          <button className={metricMode === "processes" ? "is-active" : ""} onClick={() => setMetricMode("processes")}>{t.metricProcessesWord}</button>
        </div>
      </div>

      {activeSection === "overview" && (
        <OverviewPanel onExplore={() => setActiveSection(null)} onEnterMatch={() => focusNode("matches")} onClose={() => setActiveSection(null)} />
      )}
      {activeSection && activeSection !== "overview" && (
        <EditorialPanel section={activeSection} onClose={() => setActiveSection(null)} onSelectNode={focusNode} onSelectCity={focusCity} />
      )}
      {selectedNode && <NodeInspector node={selectedNode} onClose={() => setSelectedId(null)} onJump={focusNode} />}
      {selectedCity && <CityInspector city={selectedCity} onClose={() => setSelectedCity(null)} onOpenDomain={focusNode} />}

      <aside className="evidence-legend glass" aria-label={t.evidenceTypesAria}>
        <b>{t.evidenceTitle}</b>
        {evidenceLegend.map(([label, status]) => (
          <span key={status}><i className={`status-dot ${status}`} />{label}</span>
        ))}
      </aside>
      <div className="map-chrome">
        <div className="map-hint glass">
          <span className="live-dot" />
          {t.mapHint}
        </div>
        <div className="zoom-controls glass" aria-label={t.mapControlsAria}>
          <button onClick={() => setScale((value) => Math.min(1.8, value + 0.12))} aria-label={t.zoomInAria}>+</button>
          <span>{Math.round(scale * 100)}%</span>
          <button onClick={() => setScale((value) => Math.max(MIN_SCALE, value - 0.12))} aria-label={t.zoomOutAria}>−</button>
          <button onClick={resetMap} aria-label={t.resetMapAria}>⌂</button>
        </div>
      </div>

      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} onSelect={(id) => { setSearchOpen(false); focusNode(id); }} onSelectCity={(city) => { setSearchOpen(false); focusCity(city); }} />}
    </main>
  );
}
