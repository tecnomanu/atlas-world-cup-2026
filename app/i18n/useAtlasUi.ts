"use client";

import { useMemo } from "react";
import type { EvidenceStatus, Layer } from "../world-data";
import { useLocale } from "./locale";
import { supplierDirectory } from "./ui";

export function useAtlasUi() {
  const { locale, setLocale, t, atlas } = useLocale();
  const { atlasNodes, atlasEdges, atlasClusters, hostCities, topStats, editorialSections } =
    atlas;

  const evidenceLabel: Record<EvidenceStatus, string> = useMemo(
    () => ({
      confirmed: t.evidenceConfirmed,
      derived: t.evidenceDerived,
      estimated: t.evidenceEstimated,
      private: t.evidencePrivate,
      future: t.evidenceFuture,
    }),
    [t],
  );

  const evidenceLegend = useMemo(
    () =>
      [
        [t.evidenceConfirmed, "high"],
        [t.evidenceDerived, "medium"],
        [t.evidenceEstimated, "estimate"],
        [t.evidencePrivate, "unknown"],
        [t.evidenceFuture, "future"],
      ] as const,
    [t],
  );

  const navItems = useMemo(
    () =>
      [
        { id: "overview" as const, label: t.navMap, mark: "◎" },
        { id: "areas" as const, label: t.navAreas, mark: "⌘" },
        { id: "matches" as const, label: t.navMatches, mark: "◉" },
        { id: "venues" as const, label: t.navVenues, mark: "⌾" },
        { id: "people" as const, label: t.navPeople, mark: "◌" },
        { id: "statistics" as const, label: t.navFigures, mark: "∿" },
        { id: "evidence" as const, label: t.navEvidence, mark: "□" },
      ] as const,
    [t],
  );

  const filters = useMemo(
    () =>
      [
        { id: "all" as const, label: t.filterAll, tone: "lime" },
        { id: "fifa" as const, label: t.filterFifa, tone: "cyan" },
        { id: "government" as const, label: t.filterGovernments, tone: "coral" },
        { id: "supplier" as const, label: t.filterSuppliers, tone: "slate" },
      ] as const,
    [t],
  );

  const matchMoments = t.matchMoments;

  const referenceGroups = useMemo(
    () =>
      atlasNodes
        .filter((node) => node.sources && node.sources.length > 0)
        .map((node) => ({
          id: node.id,
          label: node.label,
          sources: Array.from(
            new Map(node.sources!.map((item) => [item.url, item])).values(),
          ),
        })),
    [atlasNodes],
  );

  const namedPeopleIndex = useMemo(
    () =>
      Array.from(
        new Map(
          atlasNodes.flatMap((node) =>
            (node.peopleNamed ?? []).map(
              (person) =>
                [
                  person.name,
                  {
                    ...person,
                    nodeId: node.kind === "detail" ? node.parent! : node.id,
                  },
                ] as const,
            ),
          ),
        ).values(),
      ),
    [atlasNodes],
  );

  const suppliers = supplierDirectory[locale] as unknown as Record<string, string[]>;

  return {
    locale,
    setLocale,
    t,
    atlasNodes,
    atlasEdges,
    atlasClusters,
    hostCities,
    topStats,
    editorialSections,
    evidenceLabel,
    evidenceLegend,
    navItems,
    filters,
    matchMoments,
    referenceGroups,
    namedPeopleIndex,
    suppliers,
  };
}

export type AtlasUi = ReturnType<typeof useAtlasUi>;
export type Section = AtlasUi["navItems"][number]["id"];
export type MetricMode = "people" | "processes";
export type FilterId = "all" | Layer;
