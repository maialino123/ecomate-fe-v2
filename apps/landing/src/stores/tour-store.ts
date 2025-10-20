import { create } from 'zustand';

export type TourSection = 'none' | 'living' | 'kitchen' | 'bath' | 'bed';
export type CircleAnimation = 'none' | 'reveal' | 'collapse' | 'exit' | 'reentry';

interface TourState {
  // Core states
  isActivated: boolean;
  currentSection: TourSection;
  isTransitioning: boolean;

  // Circle animation states
  circleAnimation: CircleAnimation;

  // Canvas visibility
  showCanvas: boolean;

  // Actions
  activate: () => void;
  deactivate: () => void;
  setCurrentSection: (section: TourSection) => void;
  setCircleAnimation: (animation: CircleAnimation) => void;
  setShowCanvas: (show: boolean) => void;
  setIsTransitioning: (transitioning: boolean) => void;

  // Reset all states
  reset: () => void;
}

export const useTourStore = create<TourState>((set) => ({
  // Initial states
  isActivated: false,
  currentSection: 'none',
  isTransitioning: false,
  circleAnimation: 'none',
  showCanvas: false,

  // Actions
  activate: () => set({ isActivated: true, showCanvas: true }),

  deactivate: () => set({
    isActivated: false,
    showCanvas: false,
    currentSection: 'none',
    circleAnimation: 'none',
  }),

  setCurrentSection: (section) => set({ currentSection: section }),

  setCircleAnimation: (animation) => set({ circleAnimation: animation }),

  setShowCanvas: (show) => set({ showCanvas: show }),

  setIsTransitioning: (transitioning) => set({ isTransitioning: transitioning }),

  reset: () => set({
    isActivated: false,
    currentSection: 'none',
    isTransitioning: false,
    circleAnimation: 'none',
    showCanvas: false,
  }),
}));
