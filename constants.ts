import { CreativeMode, ModeConfig, DemoImage } from './types';

export const MODE_CONFIGS: ModeConfig = {
  [CreativeMode.MINIMAL]: {
    primaryColor: 'text-slate-200',
    secondaryColor: 'bg-slate-500',
    gradient: 'from-slate-200 to-slate-400',
    desc: 'Clean, essential, and structured prompts.',
  },
  [CreativeMode.CINEMATIC]: {
    primaryColor: 'text-amber-400',
    secondaryColor: 'bg-amber-600',
    gradient: 'from-amber-400 to-orange-600',
    desc: 'Dramatic lighting, depth, and filmic storytelling.',
  },
  [CreativeMode.SURREAL]: {
    primaryColor: 'text-purple-400',
    secondaryColor: 'bg-purple-600',
    gradient: 'from-purple-400 to-pink-600',
    desc: 'Dreamlike, bizarre, and abstract concepts.',
  },
  [CreativeMode.RETRO_UI]: {
    primaryColor: 'text-emerald-400',
    secondaryColor: 'bg-emerald-600',
    gradient: 'from-emerald-400 to-teal-600',
    desc: 'Pixel art, terminal vibes, and nostalgia.',
  },
  [CreativeMode.CYBERPUNK]: {
    primaryColor: 'text-cyan-400',
    secondaryColor: 'bg-cyan-600',
    gradient: 'from-cyan-400 to-blue-600',
    desc: 'High tech, low life, neon, and chrome.',
  },
};

export const DEMO_IMAGES: DemoImage[] = [
  {
    id: '1',
    url: 'https://picsum.photos/id/26/800/600',
    label: 'Gadgets',
  },
  {
    id: '2',
    url: 'https://picsum.photos/id/15/800/600',
    label: 'Nature',
  },
  {
    id: '3',
    url: 'https://picsum.photos/id/56/800/600',
    label: 'Portrait',
  },
  {
    id: '4',
    url: 'https://picsum.photos/id/76/800/600',
    label: 'Architecture',
  }
];

export const HOW_IT_WORKS_STEPS = [
  {
    step: '01',
    title: 'Upload or Drag',
    desc: 'Drop any image into the analyzer. We support JPEG, PNG, and WEBP.',
  },
  {
    step: '02',
    title: 'AI Vision Analysis',
    desc: 'Gemini 2.5 Flash scans for composition, lighting, mood, and subjects.',
  },
  {
    step: '03',
    title: 'Multi-Modal Generation',
    desc: 'Receive tailored prompts for Art, Video, Story, and Code instantly.',
  },
];
