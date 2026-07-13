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

export type OrgType = "company" | "ngo";

export interface StoredAccount {
  password: string;
  orgType: OrgType;
  organizationName: string;
}

export interface AuthResult {
  ok: boolean;
  error?: string;
}

interface ProjectStoreState {
  hasHydrated: boolean;
  isAuthenticated: boolean;
  userEmail: string | null;
  orgType: OrgType | null;
  accounts: Record<string, StoredAccount>;
  projects: Record<string, Project>;
  currentProjectId: string | null;

  draftMode: Mode | null;
  draftGoals: string[];
  draftProfile: OrgProfile | null;
  draftCountry: CountryOpportunity | null;
  draftCitations: Citation[];

  setHasHydrated: (value: boolean) => void;
  register: (params: {
    email: string;
    password: string;
    orgType: OrgType;
    organizationName: string;
  }) => AuthResult;
  login: (email: string, password: string) => AuthResult;
  logout: () => void;

  // 온보딩 1단계: 조직 유형 + 목표 저장
  saveOnboarding: (orgType: OrgType, goals: string[]) => void;
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
      orgType: null,
      accounts: {},
      projects: {},
      currentProjectId: null,

      draftMode: null,
      draftGoals: [],
      draftProfile: null,
      draftCountry: null,
      draftCitations: [],

      setHasHydrated: (value) => set({ hasHydrated: value }),
      register: ({ email, password, orgType, organizationName }) => {
        const key = email.trim().toLowerCase();
        if (get().accounts[key]) {
          return { ok: false, error: "이미 가입된 이메일입니다. 로그인해주세요." };
        }
        set((state) => ({
          accounts: {
            ...state.accounts,
            [key]: { password, orgType, organizationName },
          },
          isAuthenticated: true,
          userEmail: email.trim(),
          orgType,
        }));
        return { ok: true };
      },
      login: (email, password) => {
        const key = email.trim().toLowerCase();
        const account = get().accounts[key];
        if (!account) {
          return {
            ok: false,
            error: "가입되지 않은 이메일입니다. 회원가입을 먼저 진행해주세요.",
          };
        }
        if (account.password !== password) {
          return { ok: false, error: "비밀번호가 일치하지 않습니다." };
        }
        set({ isAuthenticated: true, userEmail: email.trim(), orgType: account.orgType });
        return { ok: true };
      },
      logout: () => set({ isAuthenticated: false, userEmail: null, orgType: null }),

      saveOnboarding: (orgType, goals) =>
        set({
          orgType,
          draftGoals: goals,
          // 다운스트림 플로우 호환용 대표 모드
          draftMode: orgType === "company" ? "new_opportunity" : "find_partner",
        }),
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
        set({
          draftMode: null,
          draftGoals: [],
          draftProfile: null,
          draftCountry: null,
          draftCitations: [],
        }),

      createProject: (partner) => {
        const { draftMode, draftGoals, draftProfile, draftCountry, draftCitations } = get();
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
          goals: draftGoals,
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
