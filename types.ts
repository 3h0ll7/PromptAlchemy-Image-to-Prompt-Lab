export enum CreativeMode {
  MINIMAL = 'Minimal',
  CINEMATIC = 'Cinematic',
  SURREAL = 'Surreal',
  RETRO_UI = 'Retro UI',
  CYBERPUNK = 'Cyberpunk',
}

export interface GeneratedPrompt {
  category: string;
  icon: string;
  title: string;
  text: string;
}

export interface PromptResponse {
  prompts: GeneratedPrompt[];
  analysis: string;
}

export interface DemoImage {
  id: string;
  url: string;
  label: string;
}

export type ModeConfig = {
  [key in CreativeMode]: {
    primaryColor: string;
    secondaryColor: string;
    gradient: string;
    desc: string;
  }
}