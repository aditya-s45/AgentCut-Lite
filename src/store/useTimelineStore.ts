import { create } from 'zustand';

export type ClipType = 'video' | 'text' | 'audio' | 'image';

export interface TimelineClip {
  id: string;
  type: ClipType;
  trackIndex: number;
  startFrame: number;
  durationInFrames: number;
  
  // Specific properties
  text?: string;
  color?: string;
  fontSize?: number;
  src?: string; // For video/image/audio
  filter?: string; // CSS filter string like "grayscale(100%)"
  volume?: number;
}

interface TimelineState {
  fps: number;
  durationInFrames: number;
  clips: TimelineClip[];
  addClip: (clip: TimelineClip) => void;
  updateClip: (id: string, updates: Partial<TimelineClip>) => void;
  removeClip: (id: string) => void;
}

export const useTimelineStore = create<TimelineState>((set) => ({
  fps: 30,
  durationInFrames: 300, // Default 10 seconds at 30fps
  clips: [
    // Add a default placeholder video clip for now
    {
      id: 'default-video',
      type: 'video',
      trackIndex: 0,
      startFrame: 0,
      durationInFrames: 300,
      src: 'https://upload.wikimedia.org/wikipedia/commons/transcoded/f/f1/Sintel_movie_4K.webm/Sintel_movie_4K.webm.1080p.vp9.webm'
    }
  ],
  addClip: (clip) =>
    set((state) => ({ clips: [...state.clips, clip] })),
  updateClip: (id, updates) =>
    set((state) => ({
      clips: state.clips.map((clip) =>
        clip.id === id ? { ...clip, ...updates } : clip
      ),
    })),
  removeClip: (id) =>
    set((state) => ({
      clips: state.clips.filter((clip) => clip.id !== id),
    })),
}));
