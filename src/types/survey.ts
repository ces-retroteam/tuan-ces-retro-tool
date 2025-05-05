
export type SurveyPage = "welcome" | "delivery" | "collaboration" | "additional";

export type SurveyDisplayMode = "one-question" | "grouped" | "all-questions";

export interface SurveyTimerConfig {
  enabled: boolean;
  duration: number; // in seconds
  paused?: boolean; // whether timer is paused
}

export interface TimerState {
  delivery: SurveyTimerConfig;
  collaboration: SurveyTimerConfig;
  additional: SurveyTimerConfig;
  discussion: SurveyTimerConfig;
}
