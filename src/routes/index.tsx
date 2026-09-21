import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight, Camera, Check, ChevronLeft, ChevronRight, CircleUserRound,
  Heart, Home, ImagePlus, MessageCircle, Package, PawPrint, Play, RotateCcw,
  ShoppingBag, Sparkles, Star, WandSparkles, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import jadeImage from "@/assets/jade-guide.png";
import kingImage from "@/assets/king-guide.png";
import dukeImage from "@/assets/duke-guide.png";
import createdImage from "@/assets/spritemal-created.png";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "SPRITEMALS — Create Your AI Pet Companion" },
    { name: "description", content: "Turn your real pet into a magical Spritemal, virtual AI companion, and custom collectible." },
    { property: "og:title", content: "SPRITEMALS — Your Pet, Reimagined" },
    { property: "og:description", content: "Create a magical AI pet companion and bring it home as a custom plush." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: SpritemalsApp,
});

type View = "home" | "create" | "collection" | "shop" | "companion";
type GuideName = "KING" | "JADE" | "DUKE";

const guides = [
  { name: "KING" as const, image: kingImage, personality: "Confident • Protective • Adventurous", quote: "Every great quest deserves a fearless friend.", tone: "text-gold" },
  { name: "JADE" as const, image: jadeImage, personality: "Clever • Wild • Slightly Mischievous", quote: "I know a shortcut. It’s probably safe.", tone: "text-primary" },
  { name: "DUKE" as const, image: dukeImage, personality: "Loyal • Friendly • Funny", quote: "Snacks first. Heroics immediately after.", tone: "text-energy" },
];

const steps = ["Upload Your Pet", "Create a Spritemal", "Customize It", "Name & Save It", "Choose Products"];
const products = [
  { name: "Pet Bowl", icon: "◒" }, { name: "Collar", icon: "◇" }, { name: "Leash", icon: "〰" },
  { name: "Sticker Pack", icon: "✦" }, { name: "Framed Art", icon: "▣" }, { name: "Blanket", icon: "▧" },
  { name: "Clothing", icon: "♢" }, { name: "Keychain", icon: "⌘" },
];

function Brand() {
  return <div className="flex items-center gap-2"><span className="grid size-9 place-items-center rounded-lg border border-primary/50 bg-primary/10 shadow-portal"><PawPrint className="size-5 text-primary" /></span><div><div className="font-display text-lg font-bold leading-none text-foreground">SPRITE<span className="text-primary">MALS</span></div><div className="mt-1 text-[8px] font-bold uppercase tracking-[0.22em] text-muted-foreground">A Goku24 Product</div></div></div>;
}

function SpritemalsApp() {
  const [view, setView] = useState<View>("home");
  const [guide, setGuide] = useState<GuideName>("JADE");
  const [step, setStep] = useState(0);
  const [generated, setGenerated] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [saved, setSaved] = useState(false);
  const [name, setName] = useState("Nova");
  const [toast, setToast] = useState("");
  const [mood, setMood] = useState("Curious");
  const [custom, setCustom] = useState({ collar: "Cyan", markings: "Starlight", eyes: "Glacier", accessory: "Cosmic scarf" });
  const createRef = useRef<HTMLDivElement>(null);
  const currentGuide = guides.find((item) => item.name === guide);
  if (!currentGuide) return null;

  useEffect(() => { if (!toast) return; const timer = window.setTimeout(() => setToast(""), 2200); return () => window.clearTimeout(timer); }, [toast]);

  const go = (next: View) => { setView(next); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const beginCreate = () => { setView("create"); window.setTimeout(() => createRef.current?.scrollIntoView({ behavior: "smooth" }), 50); };
  const generate = () => { setGenerating(true); window.setTimeout(() => { setGenerating(false); setGenerated(true); setStep(2); }, 1800); };

  return (
    <main className="cosmic-grid min-h-screen overflow-hidden pb-24 text-foreground md:pb-8">
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-2xl">
        <div className="mx-auto grid h-16 max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 sm:px-6">
          <button aria-label="Go home" onClick={() => go("home")} className="w-fit cursor-pointer"><Brand /></button>
          <nav className="hidden items-center gap-1 md:flex">
            {(["home", "create", "collection", "shop", "companion"] as View[]).map((item) => <Button key={item} variant="ghost" onClick={() => go(item)} className={view === item ? "bg-accent text-primary" : "text-muted-foreground"}>{item === "collection" ? "My Spritemals" : item.charAt(0).toUpperCase() + item.slice(1)}</Button>)}
          </nav>
          <button aria-label="Profile" className="grid size-9 place-items-center rounded-full border border-border bg-card md:hidden"><CircleUserRound className="size-5" /></button>
        </div>
      </header>

      {view === "home" && <HomeView guide={guide} setGuide={setGuide} beginCreate={beginCreate} currentGuide={currentGuide} />}
      {view === "create" && <CreateView ref={createRef} step={step} setStep={setStep} uploaded={uploaded} setUploaded={setUploaded} generated={generated} generating={generating} generate={generate} name={name} setName={setName} custom={custom} setCustom={setCustom} save={() => { setSaved(true); setStep(4); setToast(`${name} saved to My Spritemals`); }} go={go} />}
      {view === "collection" && <CollectionView saved={saved} name={name} beginCreate={beginCreate} go={go} />}
      {view === "shop" && <ShopView name={saved ? name : "Your Spritemal"} notify={setToast} />}
      {view === "companion" && <CompanionView name={saved ? name : "Nova"} mood={mood} setMood={setMood} />}

      <BottomNav view={view} go={go} />
      {toast && <div role="status" className="fixed bottom-24 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-lg border border-primary/40 bg-popover px-4 py-3 text-sm font-bold shadow-portal md:bottom-8"><Check className="size-4 text-primary" />{toast}</div>}
    </main>
  );
}

function HomeView({ guide, setGuide, beginCreate, currentGuide }: { guide: GuideName; setGuide: (g: GuideName) => void; beginCreate: () => void; currentGuide: (typeof guides)[number] }) {
  return <>
    <section className="relative mx-auto grid min-h-[calc(100svh-4rem)] max-w-7xl items-center gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:py-16">
      <div className="relative z-10 order-2 max-w-2xl lg:order-1">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/35 bg-primary/10 px-3 py-1.5 text-xs font-extrabold uppercase text-primary"><Sparkles className="size-3.5" /> A new kind of best friend</div>
        <p className="font-display text-sm font-bold uppercase tracking-[0.22em] text-muted-foreground">Welcome to Spritemals</p>
        <h1 className="mt-3 font-display text-5xl font-bold leading-[0.94] sm:text-7xl lg:text-8xl">YOUR PET.<br/><span className="text-primary">REIMAGINED.</span></h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">Transform the pet you love into a magical AI companion, a virtual plushie, and a custom collectible you can bring home.</p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row"><Button variant="portal" size="xl" onClick={beginCreate}><WandSparkles />Create My Spritemal<ArrowRight /></Button><Button variant="glass" size="xl" onClick={() => document.getElementById("guides")?.scrollIntoView({ behavior: "smooth" })}><Play />Meet the Guides</Button></div>
        <div className="mt-8 grid max-w-xl grid-cols-4 items-center gap-2 text-center text-[10px] font-bold uppercase text-muted-foreground sm:text-xs"><span>Real Pet</span><ArrowRight className="mx-auto size-4 text-primary"/><span>Spritemal</span><ArrowRight className="mx-auto size-4 text-primary"/><span>Virtual Friend</span><ArrowRight className="mx-auto size-4 text-primary"/><span>Made Real</span></div>
      </div>
      <div className="relative order-1 mx-auto h-[43vh] min-h-80 w-full max-w-lg lg:order-2 lg:h-[70vh]">
        <div className="animate-portal absolute bottom-[8%] left-1/2 h-16 w-[80%] -translate-x-1/2 rounded-[50%] border-2 border-primary bg-primary/15 shadow-portal-lg" />
        <div className="absolute inset-x-[18%] bottom-[12%] top-[12%] rounded-full bg-primary/10 blur-3xl" />
        <img src={currentGuide.image} alt={`${currentGuide.name}, AI Spritemal assistant`} width={1024} height={1280} className="animate-floaty relative z-10 h-full w-full object-contain drop-shadow-[0_0_28px_var(--primary)]" />
        <div className="glass-panel absolute bottom-2 left-2 z-20 rounded-lg px-4 py-3"><div className={`font-display text-xl font-bold ${currentGuide.tone}`}>{currentGuide.name}</div><div className="text-[10px] font-bold uppercase text-muted-foreground">AI Spritemal Assistant</div></div>
      </div>
    </section>
    <section id="guides" className="border-y border-border bg-background/45 py-16"><div className="mx-auto max-w-7xl px-4 sm:px-6"><div className="mb-8 flex items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase text-primary">Choose your guide</p><h2 className="mt-2 font-display text-3xl font-bold sm:text-5xl">WHO CALLS TO YOU?</h2></div><p className="hidden max-w-sm text-sm text-muted-foreground md:block">Your guide stays beside you through every transformation.</p></div><div className="grid gap-4 md:grid-cols-3">{guides.map((item) => <button key={item.name} onClick={() => setGuide(item.name)} className={`glass-panel group relative grid min-h-72 cursor-pointer grid-cols-[42%_1fr] overflow-hidden rounded-lg p-4 text-left transition md:block md:h-[430px] ${guide === item.name ? "border-primary shadow-portal" : "hover:border-primary/50"}`}><img src={item.image} alt={item.name} loading="lazy" width={1024} height={1280} className="h-64 w-full object-contain transition duration-500 group-hover:scale-105 md:h-[300px]"/><div className="self-center md:absolute md:inset-x-5 md:bottom-5"><div className="flex items-center justify-between"><h3 className={`font-display text-2xl font-bold ${item.tone}`}>{item.name}</h3>{guide === item.name && <span className="rounded-full bg-primary px-2 py-1 text-[9px] font-black uppercase text-primary-foreground">Selected</span>}</div><p className="mt-1 text-xs font-bold text-foreground">{item.personality}</p><p className="mt-2 text-xs italic text-muted-foreground">“{item.quote}”</p></div></button>)}</div></div></section>
    <section className="py-16"><div className="mx-auto max-w-7xl px-4 sm:px-6"><h2 className="text-center font-display text-3xl font-bold">FROM PAWS TO <span className="text-primary">PORTAL</span></h2><div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-5">{steps.map((label, i) => <div key={label} className="glass-panel rounded-lg p-4"><span className="font-display text-2xl font-bold text-primary">0{i+1}</span><p className="mt-5 text-sm font-bold">{label}</p></div>)}</div></div></section>
  </>;
}

function CreateView({ ref: createRef, step, setStep, uploaded, setUploaded, generated, generating, generate, name, setName, custom, setCustom, save, go }: any) {
  const options: Record<string, string[]> = { collar: ["Cyan", "Violet", "Solar"], markings: ["Starlight", "Moonstripe", "Ember"], eyes: ["Glacier", "Aurora", "Gold"], accessory: ["Cosmic scarf", "Explorer pack", "Royal charm"] };
  return <div ref={createRef} className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
    <div className="mb-8"><p className="text-xs font-bold uppercase text-primary">Creation Portal</p><h1 className="mt-2 font-display text-3xl font-bold sm:text-5xl">CREATE YOUR SPRITEMAL</h1><p className="mt-2 text-sm text-muted-foreground">A guided prototype — no real AI generation or order is submitted.</p></div>
    <div className="mb-8 flex items-center gap-2 overflow-x-auto pb-2">{steps.map((label, i) => <button key={label} onClick={() => (i <= step || generated) && setStep(i)} className={`flex min-w-fit items-center gap-2 rounded-full border px-3 py-2 text-xs font-bold ${step === i ? "border-primary bg-primary text-primary-foreground" : i < step ? "border-primary/40 bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground"}`}><span>{i < step ? <Check className="size-3"/> : i+1}</span>{label}</button>)}</div>
    <Progress value={(step + 1) * 20} className="mb-8" />
    <div className="glass-panel min-h-[570px] rounded-lg p-5 sm:p-8">
      {step === 0 && <div className="mx-auto max-w-xl text-center"><div className="mx-auto grid size-16 place-items-center rounded-full bg-primary/15 text-primary"><ImagePlus className="size-7"/></div><h2 className="mt-5 font-display text-2xl font-bold">UPLOAD YOUR PET</h2><p className="mt-2 text-sm text-muted-foreground">Use a clear photo where we can see their face, colors, and markings.</p><label className={`mt-8 flex min-h-64 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed p-8 transition ${uploaded ? "border-primary bg-primary/10" : "border-border bg-background/35 hover:border-primary"}`}><input type="file" accept="image/*" className="sr-only" onChange={() => setUploaded(true)}/>{uploaded ? <><Check className="size-10 text-primary"/><strong className="mt-3">Pet photo ready!</strong><span className="mt-1 text-xs text-muted-foreground">Tap to choose a different photo</span></> : <><Camera className="size-10 text-primary"/><strong className="mt-3">Drop a photo here</strong><span className="mt-1 text-xs text-muted-foreground">or tap to open your camera</span></>}</label><Button className="mt-6 w-full" variant="portal" size="xl" disabled={!uploaded} onClick={() => setStep(1)}>Continue to Creation<ArrowRight/></Button></div>}
      {step === 1 && <div className="mx-auto max-w-2xl text-center"><h2 className="font-display text-2xl font-bold">OPEN THE CREATION PORTAL</h2><p className="mt-2 text-sm text-muted-foreground">JADE will discover the magic already hiding in your pet.</p><div className="relative mx-auto mt-6 h-80 max-w-md overflow-hidden rounded-lg border border-primary/35 bg-cosmic"><div className="animate-portal absolute inset-[12%] rounded-full border-2 border-primary shadow-portal-lg"/>{generating && <div className="animate-scan absolute inset-x-0 top-0 z-20 h-16 bg-primary/30 blur-xl"/>}<img src={generated ? createdImage : jadeImage} alt="Spritemal creation preview" width={1024} height={1280} className={`relative z-10 h-full w-full object-contain transition duration-700 ${generating ? "scale-90 opacity-60 blur-sm" : ""}`}/></div><Button className="mt-6 w-full sm:w-auto" variant="portal" size="xl" disabled={generating} onClick={generate}>{generating ? <><RotateCcw className="animate-spin"/>Reading their sprite...</> : <><Sparkles/>Generate My Spritemal</>}</Button></div>}
      {step === 2 && <div className="grid gap-8 lg:grid-cols-2"><CreatureStage name={name}/><div><h2 className="font-display text-2xl font-bold">MAKE THEM YOURS</h2><p className="mt-2 text-sm text-muted-foreground">Every detail updates your collectible companion.</p>{Object.entries(options).map(([key, values]) => <div key={key} className="mt-5"><label className="text-xs font-bold uppercase text-muted-foreground">{key}</label><div className="mt-2 grid grid-cols-3 gap-2">{values.map(value => <Button key={value} variant={custom[key] === value ? "portal" : "glass"} className="h-auto min-h-11 whitespace-normal px-2 text-xs" onClick={() => setCustom({ ...custom, [key]: value })}>{value}</Button>)}</div></div>)}<Button className="mt-7 w-full" variant="portal" size="xl" onClick={() => setStep(3)}>Name & Save<ArrowRight/></Button></div></div>}
      {step === 3 && <div className="mx-auto grid max-w-3xl gap-8 lg:grid-cols-2"><CreatureStage name={name}/><div className="self-center"><p className="text-xs font-bold uppercase text-primary">Bond almost complete</p><h2 className="mt-2 font-display text-3xl font-bold">WHAT IS THEIR NAME?</h2><input aria-label="Spritemal name" value={name} maxLength={16} onChange={e => setName(e.target.value)} className="mt-6 h-14 w-full rounded-lg border border-input bg-background/60 px-4 font-display text-xl font-bold outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"/><p className="mt-2 text-xs text-muted-foreground">This name appears in your collection and companion room.</p><Button className="mt-6 w-full" variant="portal" size="xl" disabled={!name.trim()} onClick={save}><Star/>Save {name || "Spritemal"}</Button></div></div>}
      {step === 4 && <div className="mx-auto max-w-4xl"><div className="text-center"><div className="mx-auto grid size-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-portal"><Check/></div><h2 className="mt-4 font-display text-3xl font-bold">{name.toUpperCase()} IS READY!</h2><p className="mt-2 text-sm text-muted-foreground">Your virtual companion is saved. Now choose how to bring them into your world.</p></div><div className="mt-8 grid gap-4 md:grid-cols-2"><button onClick={() => go("companion")} className="glass-panel cursor-pointer rounded-lg p-6 text-left hover:border-primary"><MessageCircle className="size-7 text-primary"/><h3 className="mt-5 font-display text-xl font-bold">Visit Companion Room</h3><p className="mt-2 text-sm text-muted-foreground">Play, chat, and grow your bond.</p></button><button onClick={() => go("shop")} className="glass-panel cursor-pointer rounded-lg border-gold/50 p-6 text-left hover:border-gold"><Package className="size-7 text-gold"/><h3 className="mt-5 font-display text-xl font-bold">Bring {name} Home</h3><p className="mt-2 text-sm text-muted-foreground">Explore the custom plush concept and matching gear.</p></button></div></div>}
    </div>
    <div className="mt-5 flex justify-between"><Button variant="ghost" disabled={step === 0} onClick={() => setStep(Math.max(0, step - 1))}><ChevronLeft/>Back</Button>{step > 1 && step < 4 && <Button variant="ghost" onClick={() => setStep(step + 1)}>Next<ChevronRight/></Button>}</div>
  </div>;
}

function CreatureStage({ name }: { name: string }) { return <div className="relative min-h-96 overflow-hidden rounded-lg border border-primary/30 bg-cosmic"><div className="animate-portal absolute bottom-[10%] left-[10%] right-[10%] h-12 rounded-[50%] border-2 border-primary bg-primary/20 shadow-portal-lg"/><img src={createdImage} alt={`${name} custom Spritemal`} loading="lazy" width={1024} height={1280} className="animate-floaty relative z-10 h-96 w-full object-contain"/><div className="absolute bottom-4 left-4 z-20 rounded-md bg-background/80 px-3 py-2 backdrop-blur"><strong className="font-display text-lg">{name || "Unnamed"}</strong><span className="ml-2 text-xs text-primary">LV. 01</span></div></div>; }

function CollectionView({ saved, name, beginCreate, go }: { saved: boolean; name: string; beginCreate: () => void; go: (v: View) => void }) { return <div className="mx-auto min-h-[calc(100vh-4rem)] max-w-6xl px-4 py-10 sm:px-6"><p className="text-xs font-bold uppercase text-primary">Your collection</p><h1 className="mt-2 font-display text-4xl font-bold">MY SPRITEMALS</h1>{saved ? <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]"><div className="glass-panel overflow-hidden rounded-lg"><CreatureStage name={name}/><div className="grid grid-cols-3 border-t border-border p-4 text-center"><div><strong>01</strong><p className="text-[10px] uppercase text-muted-foreground">Level</p></div><div><strong>New</strong><p className="text-[10px] uppercase text-muted-foreground">Bond</p></div><div><strong>Starlight</strong><p className="text-[10px] uppercase text-muted-foreground">Type</p></div></div></div><div className="space-y-3"><Button variant="portal" size="xl" className="w-full" onClick={() => go("companion")}><Heart/>Visit {name}</Button><Button variant="glass" size="xl" className="w-full" onClick={() => go("shop")}><ShoppingBag/>Shop Their Collection</Button><Button variant="glass" size="xl" className="w-full" onClick={beginCreate}><Sparkles/>Create Another</Button></div></div> : <div className="glass-panel mt-8 flex min-h-96 flex-col items-center justify-center rounded-lg p-8 text-center"><PawPrint className="size-12 text-primary"/><h2 className="mt-4 font-display text-2xl font-bold">YOUR PORTAL IS QUIET</h2><p className="mt-2 max-w-sm text-sm text-muted-foreground">Create your first Spritemal and they’ll live here.</p><Button className="mt-6" variant="portal" size="xl" onClick={beginCreate}>Create My Spritemal</Button></div>}</div>; }

function ShopView({ name, notify }: { name: string; notify: (s: string) => void }) { return <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6"><p className="text-xs font-bold uppercase text-gold">The Spritemals Forge</p><h1 className="mt-2 font-display text-4xl font-bold">BRING YOUR SPRITEMAL HOME</h1><p className="mt-3 max-w-2xl text-sm text-muted-foreground">Preview custom keepsakes inspired by your companion. Products and ordering are concept-only in Mock 1.</p><section className="mt-8 grid overflow-hidden rounded-lg border border-gold/40 bg-card shadow-glass lg:grid-cols-2"><div className="relative min-h-96 bg-cosmic"><div className="absolute inset-[18%] rounded-full border border-gold/60 bg-gold/10 blur-sm"/><img src={createdImage} alt={`Custom ${name} plush concept`} width={1024} height={1280} className="relative z-10 h-[440px] w-full object-contain"/></div><div className="flex flex-col justify-center p-6 sm:p-10"><div className="w-fit rounded-full bg-gold/15 px-3 py-1 text-xs font-black uppercase text-gold">Hero collectible</div><h2 className="mt-4 font-display text-3xl font-bold">CUSTOM {name.toUpperCase()} PLUSH</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">A made-for-you physical plush concept based on your saved Spritemal’s colors, markings, eyes, and signature accessory.</p><div className="mt-6 text-3xl font-black text-gold">$—</div><Button variant="portal" size="xl" className="mt-6" onClick={() => notify("Customization preview added")}>Customize Plush<Sparkles/></Button><p className="mt-3 text-center text-[10px] uppercase text-muted-foreground">Prototype only • No checkout or manufacturing is live</p></div></section><h2 className="mt-14 font-display text-2xl font-bold">MATCHING GEAR & KEEPSAKES</h2><div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">{products.map((p, i) => <article key={p.name} className="glass-panel rounded-lg p-4"><div className={`grid aspect-square place-items-center rounded-md ${i % 3 === 0 ? "bg-primary/10 text-primary" : i % 3 === 1 ? "bg-violet/10 text-violet" : "bg-gold/10 text-gold"}`}><span className="text-5xl">{p.icon}</span></div><div className="mt-4 flex items-start justify-between gap-2"><h3 className="text-sm font-bold">{p.name}</h3><strong className="text-primary">$—</strong></div><Button variant="glass" size="sm" className="mt-4 w-full" onClick={() => notify(`${p.name} added to concept tray`)}>Customize</Button></article>)}</div></div>; }

function CompanionView({ name, mood, setMood }: { name: string; mood: string; setMood: (s: string) => void }) { const messages: Record<string,string> = { Curious: "I found a tiny star hiding under the portal. Should we keep it?", Happy: "Best day ever! I knew you’d come back!", Playful: "Catch me if you can! Portal zoomies activated.", Sleepy: "Five more minutes... then adventure. Promise." }; return <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6"><div className="mb-6 flex items-end justify-between"><div><p className="text-xs font-bold uppercase text-primary">Companion room</p><h1 className="mt-2 font-display text-4xl font-bold">HANG OUT WITH {name.toUpperCase()}</h1></div><span className="hidden rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary sm:block">Bond level 01</span></div><div className="grid gap-5 lg:grid-cols-[1.4fr_0.6fr]"><div className="glass-panel relative min-h-[570px] overflow-hidden rounded-lg"><div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_75%,color-mix(in_oklab,var(--primary)_18%,transparent),transparent_38%)]"/><div className="absolute left-5 top-5 rounded-lg border border-border bg-background/75 p-4 backdrop-blur-xl"><div className="flex items-center gap-2 text-xs font-black uppercase text-primary"><MessageCircle className="size-4"/>{mood}</div><p className="mt-2 max-w-60 text-sm">“{messages[mood]}”</p></div><img src={createdImage} alt={`${name}, your virtual companion`} width={1024} height={1280} className="animate-floaty absolute inset-x-0 bottom-10 mx-auto h-[72%] w-full object-contain"/><div className="animate-portal absolute bottom-8 left-[15%] right-[15%] h-14 rounded-[50%] border-2 border-primary bg-primary/15 shadow-portal-lg"/></div><aside className="space-y-4"><div className="glass-panel rounded-lg p-5"><h2 className="font-display text-lg font-bold">HOW’S THE VIBE?</h2><div className="mt-4 grid grid-cols-2 gap-2">{["Happy", "Playful", "Curious", "Sleepy"].map(v => <Button key={v} variant={mood === v ? "portal" : "glass"} onClick={() => setMood(v)}>{v}</Button>)}</div></div><div className="glass-panel rounded-lg p-5"><h2 className="font-display text-lg font-bold">PLAY TOGETHER</h2><div className="mt-4 space-y-2"><Button variant="glass" className="w-full justify-start" onClick={() => setMood("Happy")}><Heart/>Give head scratches</Button><Button variant="glass" className="w-full justify-start" onClick={() => setMood("Playful")}><Star/>Toss a star</Button><Button variant="glass" className="w-full justify-start" onClick={() => setMood("Curious")}><MessageCircle/>Ask about today</Button></div></div><div className="rounded-lg border border-primary/30 bg-primary/10 p-4"><p className="text-xs font-bold uppercase text-primary">AI companion prototype</p><p className="mt-2 text-xs leading-5 text-muted-foreground">Interactions are simulated for Mock 1 and show how your Spritemal could respond.</p></div></aside></div></div>; }

function BottomNav({ view, go }: { view: View; go: (v: View) => void }) { const items = [{v:"home" as View,l:"Home",I:Home},{v:"create" as View,l:"Create",I:WandSparkles},{v:"collection" as View,l:"Mine",I:PawPrint},{v:"shop" as View,l:"Shop",I:ShoppingBag},{v:"companion" as View,l:"Companion",I:Heart}]; return <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/92 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur-2xl md:hidden"><div className="grid h-20 grid-cols-5">{items.map(({v,l,I}) => <button key={v} onClick={() => go(v)} aria-label={l} className={`flex cursor-pointer flex-col items-center justify-center gap-1 text-[10px] font-bold ${view === v ? "text-primary" : "text-muted-foreground"}`}><I className="size-5"/>{l}</button>)}</div></nav>; }
