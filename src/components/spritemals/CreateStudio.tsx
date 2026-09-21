import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeftRight, ArrowRight, Camera, Check, ChevronLeft, ChevronRight,
  Dice5, Eye, History, ImagePlus, Lock, LockOpen, MessageCircle, Package,
  PawPrint, Redo2, RotateCcw, Sparkles, Star, Undo2, Upload, WandSparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import createdImage from "@/assets/spritemal-created.png";
import jadeImage from "@/assets/jade-guide.png";

export type ViewName = "home" | "create" | "collection" | "shop" | "companion";
export type Customization = {
  appearance: string;
  markings: string;
  eyes: string;
  collar: string;
  accessory: string;
  aura: string;
  personality: string;
};

export type SavedSpritemal = {
  name: string;
  greeting: string;
  traits: string[];
  custom: Customization;
  savedAt: string;
};

const categories: { key: keyof Customization; label: string; options: string[] }[] = [
  { key: "appearance", label: "Appearance", options: ["Moon Silver", "Frost White", "Shadow Gray", "Solar Gold"] },
  { key: "markings", label: "Markings", options: ["Starlight", "Moonstripe", "Ember Tips", "Cloud Dapple"] },
  { key: "eyes", label: "Eyes", options: ["Glacier", "Aurora", "Gold", "Amethyst"] },
  { key: "collar", label: "Collar", options: ["Cyan", "Violet", "Solar", "Midnight"] },
  { key: "accessory", label: "Accessory", options: ["Cosmic Scarf", "Explorer Pack", "Royal Charm", "Star Bandana"] },
  { key: "aura", label: "Aura / Theme", options: ["Nebula", "Aurora", "Solar Flare", "Moonlit"] },
  { key: "personality", label: "Personality", options: ["Loyal", "Brave", "Playful", "Chill"] },
];

const defaults: Customization = {
  appearance: "Moon Silver", markings: "Starlight", eyes: "Glacier", collar: "Cyan",
  accessory: "Cosmic Scarf", aura: "Nebula", personality: "Loyal",
};

const personalities = ["Loyal", "Brave", "Playful", "Chill", "Mischievous", "Protective", "Curious"];
const creationStatuses = ["Reading colors & markings", "Shaping companion form", "Adding a spark of personality", "Finalizing your Spritemal"];
const steps = ["Upload Your Pet", "Create a Spritemal", "Customize It", "Name & Save It", "Choose Products"];

const appearanceClass: Record<string, string> = {
  "Moon Silver": "saturate-100", "Frost White": "brightness-125 saturate-50",
  "Shadow Gray": "brightness-75 saturate-75", "Solar Gold": "sepia saturate-150 hue-rotate-15",
};
const auraClass: Record<string, string> = {
  Nebula: "shadow-portal-lg", Aurora: "shadow-[0_0_48px_var(--energy)]",
  "Solar Flare": "shadow-[0_0_48px_var(--gold)]", Moonlit: "shadow-[0_0_48px_var(--violet)]",
};
const swatchClass: Record<string, string> = {
  "Moon Silver": "bg-muted-foreground", "Frost White": "bg-foreground", "Shadow Gray": "bg-muted", "Solar Gold": "bg-gold",
  Starlight: "bg-primary", Moonstripe: "bg-violet", "Ember Tips": "bg-destructive", "Cloud Dapple": "bg-secondary",
  Glacier: "bg-primary", Aurora: "bg-energy", Gold: "bg-gold", Amethyst: "bg-violet",
  Cyan: "bg-primary", Violet: "bg-violet", Solar: "bg-gold", Midnight: "bg-cosmic",
  Nebula: "bg-violet", "Solar Flare": "bg-gold", Moonlit: "bg-secondary",
};

function usePhotoPreview() {
  const [photo, setPhoto] = useState("");
  const previous = useRef("");
  const choose = (file?: File) => {
    if (!file) return;
    if (previous.current) URL.revokeObjectURL(previous.current);
    const url = URL.createObjectURL(file);
    previous.current = url;
    setPhoto(url);
  };
  useEffect(() => () => { if (previous.current) URL.revokeObjectURL(previous.current); }, []);
  return { photo, choose };
}

export function CreateStudio({ onSave, go, initial }: { onSave: (profile: SavedSpritemal) => void; go: (view: ViewName) => void; initial?: SavedSpritemal | null }) {
  const [step, setStep] = useState(initial ? 4 : 0);
  const [generated, setGenerated] = useState(Boolean(initial));
  const [generating, setGenerating] = useState(false);
  const [creationIndex, setCreationIndex] = useState(0);
  const [creationProgress, setCreationProgress] = useState(0);
  const [revealed, setRevealed] = useState(Boolean(initial));
  const [activeCategory, setActiveCategory] = useState<keyof Customization>("appearance");
  const [custom, setCustom] = useState<Customization>(initial?.custom ?? defaults);
  const [history, setHistory] = useState<Customization[]>([initial?.custom ?? defaults]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [locked, setLocked] = useState<(keyof Customization)[]>([]);
  const [before, setBefore] = useState(false);
  const [name, setName] = useState(initial?.name ?? "Nova");
  const [traits, setTraits] = useState<string[]>(initial?.traits ?? ["Loyal", "Curious"]);
  const [greeting, setGreeting] = useState(initial?.greeting ?? "You came back! Ready for our next adventure?");
  const [celebrating, setCelebrating] = useState(Boolean(initial));
  const chooseInput = useRef<HTMLInputElement>(null);
  const cameraInput = useRef<HTMLInputElement>(null);
  const { photo, choose } = usePhotoPreview();

  useEffect(() => {
    if (!generating) return;
    setCreationIndex(0);
    setCreationProgress(8);
    const timer = window.setInterval(() => {
      setCreationProgress((current) => {
        const next = Math.min(current + 4, 100);
        setCreationIndex(Math.min(Math.floor(next / 25), creationStatuses.length - 1));
        if (next === 100) window.clearInterval(timer);
        return next;
      });
    }, 120);
    const revealTimer = window.setTimeout(() => { setGenerating(false); setGenerated(true); setRevealed(true); }, 3200);
    return () => { window.clearInterval(timer); window.clearTimeout(revealTimer); };
  }, [generating]);

  const completion = useMemo(() => categories.filter(({ key }) => custom[key] !== defaults[key]).length, [custom]);
  const currentCategory = categories.find(({ key }) => key === activeCategory) ?? categories[0];
  if (!currentCategory) return null;

  const commit = (next: Customization) => {
    const nextHistory = history.slice(0, historyIndex + 1);
    setCustom(next);
    setHistory([...nextHistory, next]);
    setHistoryIndex(nextHistory.length);
  };
  const setOption = (key: keyof Customization, value: string) => commit({ ...custom, [key]: value });
  const randomize = () => {
    const next = { ...custom };
    categories.forEach(({ key, options }) => {
      if (locked.includes(key)) return;
      next[key] = options[Math.floor(Math.random() * options.length)] ?? next[key];
    });
    commit(next);
  };
  const reset = () => commit(defaults);
  const undo = () => { if (historyIndex <= 0) return; const index = historyIndex - 1; setHistoryIndex(index); setCustom(history[index] ?? defaults); };
  const redo = () => { if (historyIndex >= history.length - 1) return; const index = historyIndex + 1; setHistoryIndex(index); setCustom(history[index] ?? defaults); };
  const save = () => {
    const profile = { name: name.trim(), greeting: greeting.trim(), traits, custom, savedAt: new Date().toISOString() };
    onSave(profile);
    setCelebrating(true);
    setStep(4);
  };

  return <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10">
    <div className="mb-6 flex items-end justify-between gap-4">
      <div><p className="text-xs font-bold uppercase text-primary">Creation Portal</p><h1 className="mt-2 font-display text-3xl font-bold sm:text-5xl">CREATE YOUR SPRITEMAL</h1><p className="mt-2 text-sm text-muted-foreground">A hands-on Mock 1 experience. Your photo stays on this device; no production AI is running.</p></div>
      <span className="hidden rounded-full border border-primary/30 bg-primary/10 px-3 py-2 text-xs font-bold text-primary sm:block">Step {step + 1} of 5</span>
    </div>
    <div className="mb-4 flex gap-2 overflow-x-auto pb-2">{steps.map((label, index) => <Button key={label} variant={step === index ? "portal" : index < step ? "glass" : "ghost"} size="sm" disabled={index > step && !generated} onClick={() => setStep(index)} className="min-w-fit rounded-full"><span className="grid size-5 place-items-center rounded-full bg-background/25">{index < step ? <Check /> : index + 1}</span>{label}</Button>)}</div>
    <Progress value={(step + 1) * 20} className="mb-6" />

    {step === 0 && <section className="glass-panel mx-auto max-w-3xl rounded-lg p-4 sm:p-8">
      <div className="text-center"><div className="mx-auto grid size-14 place-items-center rounded-full bg-primary/15 text-primary"><ImagePlus /></div><h2 className="mt-4 font-display text-2xl font-bold">UPLOAD YOUR PET</h2><p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">For the best demo, use a bright, clear face or full-body photo with their markings visible.</p></div>
      <input ref={chooseInput} type="file" accept="image/*" className="sr-only" onChange={(event) => choose(event.target.files?.[0])} />
      <input ref={cameraInput} type="file" accept="image/*" capture="environment" className="sr-only" onChange={(event) => choose(event.target.files?.[0])} />
      <div className="relative mt-6 min-h-80 overflow-hidden rounded-lg border border-dashed border-primary/40 bg-background/40">
        {photo ? <><img src={photo} alt="Selected pet preview" className="h-80 w-full object-cover"/><div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-background/85 p-3 backdrop-blur"><span className="flex items-center gap-2 text-sm font-bold"><Check className="size-4 text-primary"/>Photo ready</span><Button variant="glass" size="sm" onClick={() => chooseInput.current?.click()}>Replace Photo</Button></div></> : <button type="button" onClick={() => chooseInput.current?.click()} className="flex h-80 w-full cursor-pointer flex-col items-center justify-center p-8 text-center transition hover:bg-primary/5"><Upload className="size-10 text-primary"/><strong className="mt-4">Drop your favorite pet photo here</strong><span className="mt-2 text-xs text-muted-foreground">or choose how you want to add it below</span></button>}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3"><Button variant="glass" size="xl" onClick={() => chooseInput.current?.click()}><ImagePlus/>Choose Photo</Button><Button variant="glass" size="xl" onClick={() => cameraInput.current?.click()}><Camera/>Take Photo</Button></div>
      <Button variant="portal" size="xl" className="mt-5 w-full" disabled={!photo} onClick={() => setStep(1)}>Photo Looks Good<ArrowRight/></Button>
    </section>}

    {step === 1 && <section className="glass-panel mx-auto max-w-4xl overflow-hidden rounded-lg p-4 text-center sm:p-8">
      <p className="text-xs font-bold uppercase text-primary">JADE’S CREATION PORTAL</p><h2 className="mt-2 font-display text-2xl font-bold">{generating ? "CREATING YOUR SPRITEMAL…" : revealed ? "YOUR COMPANION HAS ARRIVED" : "READY TO TRANSFORM?"}</h2>
      <p className="mt-2 text-sm text-muted-foreground">This is a visual simulation for Mock 1 — your photo is not sent to an AI service.</p>
      <div className={`relative mx-auto mt-6 h-[430px] max-w-xl overflow-hidden rounded-lg border bg-cosmic transition duration-700 ${revealed ? "border-primary shadow-portal-lg" : "border-border"}`}>
        <div className="absolute inset-[12%] animate-portal rounded-full border-2 border-primary bg-primary/10 shadow-portal-lg"/>
        {generating && <><div className="animate-scan absolute inset-x-0 top-0 z-30 h-20 bg-primary/35 blur-xl"/><div className="absolute inset-0 z-20 cosmic-grid animate-pulse"/></>}
        <img src={revealed ? createdImage : jadeImage} alt={revealed ? "Generated Companion Form" : "JADE preparing the creation portal"} className={`relative z-10 h-full w-full object-contain transition duration-700 ${generating ? "scale-90 opacity-45 blur-sm" : revealed ? "animate-reveal" : "opacity-90"}`}/>
        {revealed && <div className="absolute bottom-4 left-4 z-30 rounded-md border border-primary/30 bg-background/85 px-3 py-2 text-left backdrop-blur"><strong className="font-display">COMPANION FORM</strong><p className="text-[10px] uppercase text-primary">Form unlocked</p></div>}
      </div>
      {generating && <div className="mx-auto mt-5 max-w-xl"><div className="mb-2 flex justify-between text-xs font-bold"><span>{creationStatuses[creationIndex]}</span><span className="text-primary">{creationProgress}%</span></div><Progress value={creationProgress}/></div>}
      {revealed ? <div className="mx-auto mt-5 grid max-w-xl grid-cols-[1fr_auto] gap-3"><Button variant="portal" size="xl" onClick={() => setStep(2)}>Enter Customization Studio<ArrowRight/></Button><div className="flex min-w-28 flex-col items-center justify-center rounded-lg border border-border bg-card/60 px-3 text-muted-foreground"><Lock className="size-4"/><span className="mt-1 text-[10px] font-bold uppercase">Mini Form</span><span className="text-[9px]">Coming soon</span></div></div> : <Button variant="portal" size="xl" className="mt-6 w-full max-w-xl" disabled={generating} onClick={() => setGenerating(true)}><WandSparkles/>{generating ? "Transformation in progress" : "Create My Spritemal"}</Button>}
    </section>}

    {step === 2 && <section className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(420px,0.9fr)]">
      <div className="lg:sticky lg:top-24 lg:self-start"><CreaturePreview name={name} custom={custom} before={before}/><div className="mt-3 grid grid-cols-5 gap-2"><StudioAction label="Undo" icon={Undo2} disabled={historyIndex <= 0} action={undo}/><StudioAction label="Redo" icon={Redo2} disabled={historyIndex >= history.length - 1} action={redo}/><StudioAction label="Random" icon={Dice5} action={randomize}/><StudioAction label="Reset" icon={RotateCcw} action={reset}/><StudioAction label={before ? "After" : "Before"} icon={ArrowLeftRight} active={before} action={() => setBefore(!before)}/></div></div>
      <div className="glass-panel rounded-lg p-4 sm:p-6"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase text-primary">Live customization studio</p><h2 className="mt-1 font-display text-2xl font-bold">MAKE THEM YOURS</h2></div><div className="text-right text-xs"><strong className="text-primary">{completion}/7</strong><p className="text-muted-foreground">details explored</p></div></div><Progress value={(completion / 7) * 100} className="mt-4"/>
        <div className="mt-5 flex gap-2 overflow-x-auto pb-2">{categories.map(({ key, label }) => <Button key={key} size="sm" variant={activeCategory === key ? "portal" : "glass"} onClick={() => setActiveCategory(key)} className="min-w-fit rounded-full">{locked.includes(key) && <Lock/>}{label}</Button>)}</div>
        <div className="mt-4 rounded-lg border border-border bg-background/35 p-4"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase text-muted-foreground">{currentCategory.label}</p><p className="mt-1 text-sm">Selected: <strong className="text-primary">{custom[currentCategory.key]}</strong></p></div><Button variant={locked.includes(currentCategory.key) ? "portal" : "glass"} size="sm" onClick={() => setLocked(locked.includes(currentCategory.key) ? locked.filter((key) => key !== currentCategory.key) : [...locked, currentCategory.key])}>{locked.includes(currentCategory.key) ? <Lock/> : <LockOpen/>}{locked.includes(currentCategory.key) ? "Kept" : "Keep trait"}</Button></div>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">{currentCategory.options.map((option) => <Button key={option} variant={custom[currentCategory.key] === option ? "portal" : "glass"} className="h-auto min-h-16 flex-col whitespace-normal px-2 py-2 text-xs active:scale-95" onClick={() => setOption(currentCategory.key, option)}>{swatchClass[option] && <span className={`size-5 rounded-full border border-foreground/20 ${swatchClass[option]}`}/>}<span>{option}</span>{custom[currentCategory.key] === option && <Check/>}</Button>)}</div>
        </div>
        <div className="mt-4 flex items-center gap-2 rounded-md bg-primary/10 p-3 text-xs text-muted-foreground"><History className="size-4 shrink-0 text-primary"/>Lock favorites before Randomize. Completion is optional — every companion is ready when you are.</div>
        <Button variant="portal" size="xl" className="mt-5 w-full" onClick={() => setStep(3)}>Name & Build Their Personality<ArrowRight/></Button>
      </div>
    </section>}

    {step === 3 && <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(420px,0.8fr)]"><div><CreaturePreview name={name} custom={custom}/><ProfileCard name={name} greeting={greeting} traits={traits} custom={custom}/></div><div className="glass-panel rounded-lg p-4 sm:p-6"><p className="text-xs font-bold uppercase text-primary">Bond almost complete</p><h2 className="mt-2 font-display text-2xl font-bold">NAME + PERSONALITY</h2><label className="mt-5 block text-xs font-bold uppercase text-muted-foreground" htmlFor="spritemal-name">Spritemal name</label><input id="spritemal-name" value={name} maxLength={16} onChange={(event) => setName(event.target.value)} className="mt-2 h-14 w-full rounded-lg border border-input bg-background/60 px-4 font-display text-xl font-bold outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"/>
        <p className="mt-5 text-xs font-bold uppercase text-muted-foreground">Personality mix <span className="normal-case text-primary">({traits.length}/3)</span></p><div className="mt-2 flex flex-wrap gap-2">{personalities.map((trait) => <Button key={trait} variant={traits.includes(trait) ? "portal" : "glass"} size="sm" onClick={() => setTraits(traits.includes(trait) ? traits.filter((item) => item !== trait) : traits.length < 3 ? [...traits, trait] : [...traits.slice(1), trait])}>{traits.includes(trait) && <Check/>}{trait}</Button>)}</div>
        <label className="mt-5 block text-xs font-bold uppercase text-muted-foreground" htmlFor="greeting">Their first greeting</label><textarea id="greeting" value={greeting} maxLength={90} rows={3} onChange={(event) => setGreeting(event.target.value)} className="mt-2 w-full resize-none rounded-lg border border-input bg-background/60 p-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"/><div className="text-right text-[10px] text-muted-foreground">{greeting.length}/90</div>
        <Button variant="portal" size="xl" className="mt-4 w-full" disabled={!name.trim() || traits.length === 0 || !greeting.trim()} onClick={save}><Star/>Save My Spritemal</Button>
      </div></section>}

    {step === 4 && celebrating && <section className="glass-panel relative mx-auto max-w-5xl overflow-hidden rounded-lg p-4 sm:p-8"><div className="celebration-stars absolute inset-0"/><div className="relative text-center"><div className="mx-auto grid size-16 place-items-center rounded-full bg-primary text-primary-foreground shadow-portal-lg"><PawPrint/></div><p className="mt-4 text-xs font-bold uppercase text-primary">Bond registered • Companion adopted</p><h2 className="mt-2 font-display text-3xl font-bold sm:text-5xl">WELCOME HOME, {name.toUpperCase()}!</h2><p className="mt-2 text-sm text-muted-foreground">Your Companion Form and personality are saved on this device.</p></div><div className="relative mt-7 grid gap-5 lg:grid-cols-2"><CreaturePreview name={name} custom={custom}/><div className="self-center"><ProfileCard name={name} greeting={greeting} traits={traits} custom={custom}/><div className="mt-4 grid gap-2"><Button variant="portal" size="xl" onClick={() => go("companion")}><MessageCircle/>Meet My Companion</Button><Button variant="glass" size="xl" onClick={() => go("shop")}><Package/>Make My Plushie</Button><Button variant="glass" size="xl" onClick={() => go("shop")}><Sparkles/>Put It On Products</Button></div></div></div></section>}

    <div className="mt-5 flex justify-between"><Button variant="ghost" disabled={step === 0 || generating} onClick={() => setStep(Math.max(0, step - 1))}><ChevronLeft/>Back</Button>{step > 1 && step < 4 && <Button variant="ghost" onClick={() => setStep(step + 1)}>Next<ChevronRight/></Button>}</div>
  </div>;
}

function CreaturePreview({ name, custom, before = false }: { name: string; custom: Customization; before?: boolean }) {
  const shown = before ? defaults : custom;
  return <div className="relative min-h-[430px] overflow-hidden rounded-lg border border-primary/30 bg-cosmic">
    <div className={`absolute inset-[14%] rounded-full border border-primary/50 bg-primary/10 blur-2xl transition ${auraClass[shown.aura] ?? auraClass.Nebula}`}/><div className="animate-portal absolute bottom-[9%] left-[12%] right-[12%] h-12 rounded-[50%] border-2 border-primary bg-primary/20 shadow-portal-lg"/>
    <img src={createdImage} alt={`${name || "Unnamed"} custom Spritemal Companion Form`} className={`animate-floaty relative z-10 h-[430px] w-full object-contain transition duration-500 ${appearanceClass[shown.appearance] ?? ""}`}/>
    <div className="absolute left-1/2 top-[18%] z-20 -translate-x-1/2 rounded-full border border-primary/40 bg-background/75 px-3 py-1 text-[10px] font-black uppercase text-primary backdrop-blur">{shown.markings}</div>
    <div className="absolute right-4 top-4 z-20 rounded-md border border-border bg-background/80 px-2 py-1 text-[10px] font-bold text-energy"><Eye className="mr-1 inline size-3"/>{shown.eyes} eyes</div>
    <div className="absolute bottom-4 left-4 z-20 rounded-md border border-border bg-background/85 px-3 py-2 backdrop-blur"><strong className="font-display text-lg">{name || "Unnamed"}</strong><span className="ml-2 text-xs text-primary">COMPANION FORM</span><p className="mt-1 text-[10px] text-muted-foreground">{shown.collar} collar • {shown.accessory}</p></div>
    {before && <div className="absolute inset-0 z-30 grid place-items-center bg-background/15"><span className="rounded-full bg-background/85 px-4 py-2 text-xs font-black uppercase">Before customization</span></div>}
  </div>;
}

function StudioAction({ label, icon: Icon, action, disabled, active }: { label: string; icon: typeof Undo2; action: () => void; disabled?: boolean; active?: boolean }) {
  return <Button variant={active ? "portal" : "glass"} disabled={disabled} onClick={action} className="h-14 flex-col gap-1 px-1 text-[10px] active:scale-95"><Icon/>{label}</Button>;
}

function ProfileCard({ name, greeting, traits, custom }: { name: string; greeting: string; traits: string[]; custom: Customization }) {
  return <div className="glass-panel mt-3 rounded-lg p-4"><div className="flex items-center gap-3"><div className="grid size-11 place-items-center rounded-md bg-primary/15 text-primary"><PawPrint/></div><div><p className="font-display text-xl font-bold">{name || "Unnamed"}</p><p className="text-[10px] font-bold uppercase text-primary">Companion Form • {custom.aura}</p></div></div><div className="mt-3 flex flex-wrap gap-1.5">{traits.map((trait) => <span key={trait} className="rounded-full border border-border bg-background/50 px-2 py-1 text-[10px] font-bold">{trait}</span>)}</div><p className="mt-3 text-sm italic text-muted-foreground">“{greeting || "…"}”</p></div>;
}