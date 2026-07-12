import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Citation,
  CountryOpportunity,
  Mode,
  OrgProfile,
  PartnerMatch,
  Project,
} from "@/lib/types";

function mergeCitationList(existing: Citation[], incoming: Citation[]): Citation[] {
  const byId = new Map(existing.map((citation) => [citation.id, citation]));
  for (const citation of incoming) {
    byId.set(citation.id, citation);
  }
  return Array.from(byId.values());
}

interface ProjectStoreState {
  hasHydrated: boolean;
  isAuthenticated: boolean;
  userEmail: string | null;
  projects: Record<string, Project>;
  currentProjectId: string | null;

  draftMode: Mode | null;
  draftProfile: OrgProfile | null;
  draftCountry: CountryOpportunity | null;
  draftCitations: Citation[];

  setHasHydrated: (value: boolean) => void;
  login: (email: string) => void;
  logout: () => void;

  setDraftMode: (mode: Mode) => void;
  setDraftProfile: (profile: OrgProfile) => void;
  setDraftCountry: (country: CountryOpportunity) => void;
  mergeCitations: (citations: Citation[], projectId?: string) => void;
  resetDraft: () => void;

  createProject: (partner: PartnerMatch | null) => string;
  updateProject: (id: string, patch: Partial<Project>) => void;
}

export const useProjectStore = create<ProjectStoreState>()(
  persist(
    (set, get) => ({
      hasHydrated: false,
      isAuthenticated: false,
      userEmail: null,
      projects: {},
      currentProjectId: null,

      draftMode: null,
      draftProfile: null,
      draftCountry: null,
      draftCitations: [],

      setHasHydrated: (value) => set({ hasHydrated: value }),
      login: (email) => set({ isAuthenticated: true, userEmail: email }),
      logout: () => set({ isAuthenticated: false, userEmail: null }),

      setDraftMode: (mode) => set({ draftMode: mode }),
      setDraftProfile: (profile) => set({ draftProfile: profile }),
      setDraftCountry: (country) => set({ draftCountry: country }),
      mergeCitations: (citations, projectId) => {
        if (projectId) {
          const project = get().projects[projectId];
          if (!project) return;
          set({
            projects: {
              ...get().projects,
              [projectId]: {
                ...project,
                citations: mergeCitationList(project.citations, citations),
                updatedAt: new Date().toISOString(),
              },
            },
          });
          return;
        }
        set({ draftCitations: mergeCitationList(get().draftCitations, citations) });
      },
      resetDraft: () =>
        set({ draftMode: null, draftProfile: null, draftCountry: null, draftCitations: [] }),

      createProject: (partner) => {
        const { draftMode, draftProfile, draftCountry, draftCitations } = get();
        const id = crypto.randomUUID();
        const now = new Date().toISOString();
        const citations = mergeCitationList(
          draftCitations,
          partner?.citations ?? []
        );
        const project: Project = {
          id,
          title: draftCountry
            ? `${draftProfile?.name ?? "New"} · ${draftCountry.country} 프로젝트`
            : `${draftProfile?.name ?? "New"} 프로젝트`,
          mode: draftMode ?? "idea",
          status: "profile",
          profile: draftProfile,
          selectedCountry: draftCountry,
          selectedPartner: partner,
          strategyReport: null,
          proposalDraft: null,
          citations,
          createdAt: now,
          updatedAt: now,
        };
        set({
          projects: { ...get().projects, [id]: project },
          currentProjectId: id,
          draftMode: null,
          draftProfile: null,
          draftCountry: null,
          draftCitations: [],
        });
        return id;
      },

      updateProject: (id, patch) => {
        const project = get().projects[id];
        if (!project) return;
        set({
          projects: {
            ...get().projects,
            [id]: { ...project, ...patch, updatedAt: new Date().toISOString() },
          },
        });
      },
    }),
    {
      name: "kib-project-store",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
