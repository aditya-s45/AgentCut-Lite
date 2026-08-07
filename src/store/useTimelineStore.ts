import { create } from 'zustand';

export type ClipType = 'video' | 'text';

export interface BaseClip {
  id: string;
  type: ClipType;
  startFrame: number;
  durationInFrames: number;
  trackIndex: number;
}

export interface VideoClip extends BaseClip {
  type: 'video';
  url: string;
  filter?: string;
  trimStartFrame?: number;
}

export interface TextClip extends BaseClip {
  type: 'text';
  text: string;
  color: string;
  fontSize: number;
  yPosition?: number;
}

export type Clip = VideoClip | TextClip;

export interface TimelineState {
  durationInFrames: number;
  fps: number;
  width: number;
  height: number;
  clips: Clip[];
  
  // Actions
  addClip: (clip: Clip) => void;
  updateClip: (id: string, updates: Partial<Clip>) => void;
  removeClip: (id: string) => void;
  setDuration: (duration: number) => void;
}

export const useTimelineStore = create<TimelineState>((set) => ({
  durationInFrames: 300, // 10 seconds default at 30fps
  fps: 30,
  width: 1280,
  height: 720,
  clips: [],
  
  addClip: (clip) => set((state) => ({ clips: [...state.clips, clip] })),
  updateClip: (id, updates) => set((state) => ({
    clips: state.clips.map(c => c.id === id ? { ...c, ...updates } : c) as Clip[]
  })),
  removeClip: (id) => set((state) => ({ clips: state.clips.filter(c => c.id !== id) })),
  setDuration: (duration) => set({ durationInFrames: duration })
}));
