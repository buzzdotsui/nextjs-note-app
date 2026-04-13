import { defaultWorkspaceState } from '@/lib/demo-data';
import { WorkspaceState } from '@/types/app';

const STORAGE_KEY = 'noteflow-workspace-v2';

export const loadWorkspaceState = (): WorkspaceState => {
  if (typeof window === 'undefined') {
    return defaultWorkspaceState;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return defaultWorkspaceState;
  }

  try {
    const parsed = JSON.parse(raw) as WorkspaceState;
    if (!parsed.users || !parsed.notes) {
      return defaultWorkspaceState;
    }
    return parsed;
  } catch {
    return defaultWorkspaceState;
  }
};

export const saveWorkspaceState = (state: WorkspaceState) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};
