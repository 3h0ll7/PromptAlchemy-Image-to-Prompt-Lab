import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  Sparkles, 
  Image as ImageIcon, 
  Video, 
  PenTool, 
  Layout, 
  Code, 
  CheckCircle2, 
  Wand2, 
  MoveRight,
  Github,
  Twitter,
  Loader2
} from 'lucide-react';

import { Button } from './components/Button';
import { Card } from './components/Card';
import { generatePrompts } from './services/geminiService';
import { CreativeMode, PromptResponse, GeneratedPrompt } from './types';
import { MODE_CONFIGS, DEMO_IMAGES, HOW_IT_WORKS_STEPS } from './constants';

function App() {
  const [selectedMode, setSelectedMode] = useState<CreativeMode>(CreativeMode.CINEMATIC);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [response, setResponse] = useState<PromptResponse | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const activeConfig = MODE_CONFIGS[selectedMode];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      processFile(file);
    }
  };

  const handleDemoSelect = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const file = new File([blob], "demo.jpg", { type: "image/jpeg" });
      processFile(file);
    } catch (error) {
      console.error("Error loading demo image", error);
    }
  };

  const processFile = (file: File) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      setResponse(null); // Reset previous results
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!imagePreview) return;
    
    setIsGenerating(true);
    
    // Scroll to results area roughly
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);

    // Extract base64 data (remove prefix)
    const base64Data = imagePreview.split(',')[1];
    const mimeType = imagePreview.substring(imagePreview.indexOf(':') + 1, imagePreview.indexOf(';'));

    const result = await generatePrompts(base64Data, mimeType, selectedMode);
    
    setResponse(result);
    setIsGenerating(false);
  };

  const getIconComponent = (iconName: string) => {
    const icons: Record<string, React.ReactNode> = {
      'Image': <ImageIcon className="w-6 h-6" />,
      'Video': <Video className="w-6 h-6" />,
      'PenTool': <PenTool className="w-6 h-6" />,
      'Layout': <Layout className="w-6 h-6" />,
      'Code': <Code className="w-6 h-6" />,
    };
    return icons[iconName] || <Sparkles className="w-6 h-6" />;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans overflow-hidden relative">
      {/* Background Ambient Effects */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-r ${activeConfig.gradient} opacity-10 blur-[100px] animate-blob`} />
        <div className="absolute top-[40%] right-[-10%] w-[400px] h-[400px] rounded-full bg-cyan-500 opacity-5 blur-[100px] animate-blob animation-delay-2000" />
        <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] rounded-full bg-purple-500 opacity-10 blur-[100px] animate-blob animation-delay-4000" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-16">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${activeConfig.gradient} flex items-center justify-center`}>
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">PromptAlchemy</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#gallery" className="hover:text-white transition-colors">Gallery</a>
            <Button variant="secondary" className="!py-2 !px-4 text-xs">Sign In</Button>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="text-center mb-20 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-slate-300 mb-6 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              Powered by Gemini 2.5 Flash
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-black tracking-tight mb-6 leading-[1.1]">
              Turn Images into <br />
              <span className={`text-transparent bg-clip-text bg-gradient-to-r ${activeConfig.gradient}`}>
                Creative Power
              </span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
              Upload any visual. Instantly generate expert prompts for generative Art, Video, UI Design, and Code.
            </p>
          </motion.div>

          {/* Mode Selector */}
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 0.2 }}
             className="flex flex-wrap justify-center gap-2 mb-12"
          >
            {Object.values(CreativeMode).map((mode) => (
              <button
                key={mode}
                onClick={() => setSelectedMode(mode)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
                  selectedMode === mode 
                    ? `bg-slate-800 border-${activeConfig.gradient.split('-')[1]}-500 text-white shadow-lg scale-105` 
                    : 'bg-transparent border-slate-800 text-slate-500 hover:border-slate-600 hover:text-slate-300'
                }`}
              >
                {mode}
              </button>
            ))}
          </motion.div>
        </section>

        {/* Upload & Interaction Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-24">
          
          {/* Left Column: Upload */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="relative overflow-hidden group border-2 border-dashed border-slate-700 hover:border-slate-500 transition-colors">
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" 
              />
              <div className="text-center py-12">
                {imagePreview ? (
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-2xl">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                       <p className="text-white font-medium flex items-center gap-2"><Upload className="w-4 h-4"/> Change Image</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-tr ${activeConfig.gradient} bg-opacity-20 flex items-center justify-center`}>
                      <Upload className="w-8 h-8 text-white opacity-80" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Upload Reference Image</h3>
                      <p className="text-sm text-slate-400 mt-1">Drag & drop or click to browse</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Demo Images */}
            {!imagePreview && (
              <div className="grid grid-cols-4 gap-2">
                {DEMO_IMAGES.map((demo) => (
                  <button 
                    key={demo.id}
                    onClick={() => handleDemoSelect(demo.url)}
                    className="relative aspect-square rounded-lg overflow-hidden border border-slate-800 hover:border-slate-500 transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/20"
                  >
                    <img src={demo.url} alt={demo.label} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/20 hover:bg-transparent transition-colors" />
                  </button>
                ))}
              </div>
            )}

            {/* Action Button */}
            <Button 
              onClick={handleGenerate} 
              disabled={!imagePreview || isGenerating}
              isLoading={isGenerating}
              className="w-full py-4 text-lg"
              icon={<Wand2 className="w-5 h-5" />}
            >
              {isGenerating ? 'Analyzing Visuals...' : 'Generate Prompts'}
            </Button>
          </div>

          {/* Right Column: Results Stream */}
          <div className="lg:col-span-7" ref={resultsRef}>
             <div className="h-full min-h-[500px] bg-slate-900/20 rounded-3xl border border-white/5 p-6 lg:p-8 backdrop-blur-sm relative overflow-hidden">
                
                {!response && !isGenerating && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 text-center p-8">
                    <div className="w-20 h-20 rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
                       <Sparkles className="w-8 h-8 opacity-20" />
                    </div>
                    <p className="text-lg font-medium">Ready to dream</p>
                    <p className="text-sm max-w-xs mt-2">Upload an image to see the AI deconstruct it into creative prompts.</p>
                  </div>
                )}

                {isGenerating && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-slate-950/50 backdrop-blur-sm">
                    <Loader2 className={`w-12 h-12 ${activeConfig.primaryColor} animate-spin mb-4`} />
                    <p className="text-slate-300 font-medium animate-pulse">Analyzing visual data...</p>
                  </div>
                )}

                {response && (
                  <div className="space-y-6">
                    {/* Analysis Badge */}
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-slate-300 italic"
                    >
                      <span className={`${activeConfig.primaryColor} font-bold mr-2`}>AI Insight:</span>
                      {response.analysis}
                    </motion.div>

                    {/* Prompt Cards */}
                    <div className="grid gap-4">
                      {response.prompts.map((prompt, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 + 0.2 }}
                        >
                          <div className="group relative bg-slate-800/40 hover:bg-slate-800/60 border border-white/5 hover:border-white/20 rounded-xl p-5 transition-all duration-300">
                            <div className="flex items-start gap-4">
                              <div className={`p-2 rounded-lg bg-slate-900 ${activeConfig.primaryColor}`}>
                                {getIconComponent(prompt.icon)}
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                  <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider">{prompt.category}</h4>
                                  <button className="text-xs text-slate-500 hover:text-white transition-colors" onClick={() => navigator.clipboard.writeText(prompt.text)}>Copy</button>
                                </div>
                                <h5 className="text-lg font-semibold text-white mb-2">{prompt.title}</h5>
                                <p className="text-slate-400 text-sm leading-relaxed font-mono bg-black/20 p-3 rounded-lg border border-white/5 selection:bg-white/20">
                                  {prompt.text}
                                </p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
             </div>
          </div>
        </div>

        {/* How it Works Timeline */}
        <section id="how-it-works" className="mb-32 py-16 border-t border-white/5">
          <div className="text-center mb-16">
             <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">How it Works</h2>
             <p className="text-slate-400">From pixels to possibilities in three steps.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 relative">
             {/* Connecting Line */}
             <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-slate-700 to-transparent z-0" />
             
             {HOW_IT_WORKS_STEPS.map((item, i) => (
               <motion.div
                 key={i}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: i * 0.2 }}
                 className="relative z-10 flex flex-col items-center text-center group"
               >
                 <div className={`w-24 h-24 rounded-2xl bg-slate-900 border border-slate-700 group-hover:border-white/30 transition-colors flex items-center justify-center mb-6 shadow-2xl`}>
                   <span className={`font-display text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br ${activeConfig.gradient}`}>
                     {item.step}
                   </span>
                 </div>
                 <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                 <p className="text-slate-400 text-sm max-w-xs">{item.desc}</p>
               </motion.div>
             ))}
          </div>
        </section>

        {/* Use Cases / Gallery Preview */}
        <section id="features" className="mb-32">
           <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div>
                <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Creative Horizons</h2>
                <p className="text-slate-400 max-w-lg">
                  Use Gemini 2.5's multimodal understanding to bridge the gap between static imagery and dynamic creation tools.
                </p>
              </div>
              <Button variant="ghost" className="gap-2">
                View All Use Cases <MoveRight className="w-4 h-4" />
              </Button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card hoverEffect className="h-64 flex flex-col justify-between bg-gradient-to-br from-slate-900 to-slate-800 border-slate-800">
                 <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4"><Video /></div>
                 <div>
                   <h3 className="text-xl font-bold mb-2">Video Gen</h3>
                   <p className="text-sm text-slate-400">Convert moodboards into precise motion prompts for tools like Veo and Sora.</p>
                 </div>
              </Card>
              <Card hoverEffect className="h-64 flex flex-col justify-between bg-gradient-to-br from-slate-900 to-slate-800 border-slate-800">
                 <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4"><Code /></div>
                 <div>
                   <h3 className="text-xl font-bold mb-2">Frontend Code</h3>
                   <p className="text-sm text-slate-400">Analyze UI screenshots and get semantic HTML/Tailwind structure descriptions.</p>
                 </div>
              </Card>
              <Card hoverEffect className="h-64 flex flex-col justify-between bg-gradient-to-br from-slate-900 to-slate-800 border-slate-800">
                 <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400 mb-4"><PenTool /></div>
                 <div>
                   <h3 className="text-xl font-bold mb-2">Storytelling</h3>
                   <p className="text-sm text-slate-400">Break writer's block by generating rich backstories for characters in your sketches.</p>
                 </div>
              </Card>
           </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/5 pt-12 pb-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-2">
               <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  <span className="font-display font-bold text-lg">PromptAlchemy</span>
               </div>
               <p className="text-slate-500 text-sm max-w-xs">
                 Built for prompt freaks, visual thinkers, and AI explorers. 
                 Experimental lab powered by Google Gemini.
               </p>
            </div>
            <div>
               <h4 className="font-bold text-white mb-4">Platform</h4>
               <ul className="space-y-2 text-sm text-slate-400">
                 <li><a href="#" className="hover:text-cyan-400 transition-colors">API Access</a></li>
                 <li><a href="#" className="hover:text-cyan-400 transition-colors">Community Gallery</a></li>
                 <li><a href="#" className="hover:text-cyan-400 transition-colors">Documentation</a></li>
               </ul>
            </div>
            <div>
               <h4 className="font-bold text-white mb-4">Connect</h4>
               <div className="flex gap-4">
                 <a href="#" className="text-slate-400 hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
                 <a href="#" className="text-slate-400 hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
               </div>
            </div>
          </div>
          <div className="text-center text-xs text-slate-600">
            © {new Date().getFullYear()} PromptAlchemy Lab. All rights reserved.
          </div>
        </footer>

      </div>
      
      {/* Sticky Mobile Action Button (visible only on small screens when scrolled) */}
      <div className="fixed bottom-6 right-6 lg:hidden z-50">
        <Button 
          className="shadow-2xl rounded-full w-14 h-14 !px-0 flex items-center justify-center"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}

export default App;
