import type { Locale } from "./ui";
import type {
  AtlasCluster,
  AtlasEdge,
  AtlasNode,
  HostCity,
} from "../world-data";
import {
  atlasClusters as atlasClustersEs,
  atlasEdges,
  atlasNodes as atlasNodesEs,
  editorialSections as editorialSectionsEs,
  hostCities as hostCitiesEs,
  topStats as topStatsEs,
} from "../world-data";
import contentEn from "./content.en.json";

export type AtlasData = {
  atlasNodes: AtlasNode[];
  atlasEdges: AtlasEdge[];
  atlasClusters: AtlasCluster[];
  hostCities: Array<{ country: string; cities: HostCity[] }>;
  topStats: Array<[string, string]>;
  editorialSections: typeof editorialSectionsEs;
};

type ContentNode = {
  id: string;
  label?: string;
  shortLabel?: string;
  eyebrow?: string;
  summary?: string;
  people?: string;
  metric?: string;
  facts?: string[];
  areas?: string[];
  countries?: string[];
  chain?: string[];
  peopleNamed?: Array<{ name: string; role: string }>;
  organizations?: string[];
  sources?: string[];
};

function applyNodeOverlay(node: AtlasNode, overlay?: ContentNode): AtlasNode {
  if (!overlay) return node;
  const sourceByUrl = new Map((node.sources ?? []).map((item) => [item.url, item]));
  const sources =
    overlay.sources && node.sources
      ? node.sources.map((item, index) => ({
          ...item,
          label: overlay.sources?.[index] ?? item.label,
        }))
      : node.sources;
  return {
    ...node,
    label: overlay.label ?? node.label,
    shortLabel: overlay.shortLabel ?? overlay.label ?? node.shortLabel,
    eyebrow: overlay.eyebrow ?? node.eyebrow,
    summary: overlay.summary ?? node.summary,
    people: overlay.people ?? node.people,
    metric: overlay.metric ?? node.metric,
    facts: overlay.facts ?? node.facts,
    areas: overlay.areas ?? node.areas,
    countries: overlay.countries ?? node.countries,
    chain: overlay.chain ?? node.chain,
    peopleNamed: overlay.peopleNamed ?? node.peopleNamed,
    organizations: overlay.organizations ?? node.organizations,
    sources: sources ?? Array.from(sourceByUrl.values()),
  };
}

function buildEnglishAtlas(): AtlasData {
  const nodeOverlays = new Map<string, ContentNode>(
    [...contentEn.nodes, ...contentEn.details].map((item) => [item.id, item]),
  );

  const localized = atlasNodesEs.map((node) =>
    applyNodeOverlay(node, nodeOverlays.get(node.id)),
  );
  const byId = new Map(localized.map((node) => [node.id, node]));

  // Detail nodes inherit localized parent copy for shared fields.
  const atlasNodes = localized.map((node) => {
    if (node.kind !== "detail" || !node.parent) return node;
    const parent = byId.get(node.parent);
    if (!parent) return node;
    return {
      ...node,
      eyebrow: parent.eyebrow,
      areas: parent.areas,
      countries: parent.countries,
      organizations: parent.organizations,
      peopleNamed: parent.peopleNamed,
      chain: parent.chain,
      sources: parent.sources,
      color: parent.color,
    };
  });

  const atlasClusters = atlasClustersEs.map((cluster) => {
    const overlay = contentEn.clusters.find((item) => item.id === cluster.id);
    return overlay
      ? { ...cluster, label: overlay.label, subtitle: overlay.subtitle }
      : cluster;
  });

  const hostCities = contentEn.hostCities.map((group, groupIndex) => ({
    country: group.country,
    cities: group.cities.map((city, cityIndex) => {
      const base = hostCitiesEs[groupIndex]?.cities[cityIndex];
      if (!base) {
        throw new Error(`Missing Spanish host city for ${city.id}`);
      }
      return {
        ...base,
        city: city.city,
        country: city.country,
        venue: city.venue,
        interface: city.interface,
        leaders: city.leaders,
        ownerOperator: city.ownerOperator,
        publicLayer: city.publicLayer,
        mobility: city.mobility,
        finance: city.finance,
        source: {
          ...base.source,
          label: city.sourceLabel ?? base.source.label,
        },
      };
    }),
  }));

  return {
    atlasNodes,
    atlasEdges,
    atlasClusters,
    hostCities,
    topStats: contentEn.topStats as Array<[string, string]>,
    editorialSections: contentEn.editorial as typeof editorialSectionsEs,
  };
}

const englishAtlas = buildEnglishAtlas();

const spanishAtlas: AtlasData = {
  atlasNodes: atlasNodesEs,
  atlasEdges,
  atlasClusters: atlasClustersEs,
  hostCities: hostCitiesEs,
  topStats: topStatsEs as Array<[string, string]>,
  editorialSections: editorialSectionsEs,
};

export function getAtlasData(locale: Locale): AtlasData {
  return locale === "en" ? englishAtlas : spanishAtlas;
}
