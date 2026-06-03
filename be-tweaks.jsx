/* Brave Everest — Tweaks panel. Drives the page via CSS vars + data attrs on <html>. */
const { useEffect } = React;

const ACCENTS = {
  Crimson: ["#c23a4e", "#9b2030", "#5a1320"],
  Slate:   ["#5a6b86", "#37445c", "#1b2333"],
  Plum:    ["#b14bb8", "#822a8c", "#451552"],
  Emerald: ["#2aa479", "#147f56", "#0a4a33"],
  Sunset:  ["#e08a3c", "#c25526", "#6e2c12"],
};
const ACCENT_OPTS = Object.values(ACCENTS);
const GI = { Subtle: 0.42, Balanced: 0.72, Bold: 1 };
const FONTS = {
  System: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", system-ui, sans-serif',
  Manrope: '"Manrope", -apple-system, system-ui, sans-serif',
  Grotesk: '"Space Grotesk", -apple-system, system-ui, sans-serif',
};
const HERO = { Centered: "centered", Split: "split", Stacked: "stacked" };

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "dark": false,
  "accent": ["#c23a4e", "#9b2030", "#5a1320"],
  "gradient": "Bold",
  "headline": "System",
  "hero": "Centered"
}/*EDITMODE-END*/;

function matchKey(map, val) {
  const found = Object.keys(map).find((k) => JSON.stringify(map[k]) === JSON.stringify(val));
  return found || Object.keys(map)[0];
}

function TweaksApp() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", t.dark ? "dark" : "light");
    const a = t.accent || ACCENTS.Crimson;
    root.style.setProperty("--accent-bright", a[0]);
    root.style.setProperty("--accent", a[1]);
    root.style.setProperty("--accent-deep", a[2]);
    root.style.setProperty("--gi", GI[t.gradient] ?? 1);
    root.style.setProperty("--font-head", FONTS[t.headline] || FONTS.System);
    root.setAttribute("data-hero", HERO[t.hero] || "centered");
  }, [t]);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Theme" />
      <TweakToggle label="Dark mode" value={t.dark} onChange={(v) => setTweak("dark", v)} />
      <TweakColor
        label="Accent"
        value={t.accent}
        options={ACCENT_OPTS}
        onChange={(v) => setTweak("accent", v)}
      />
      <TweakSection label="Gradient" />
      <TweakRadio
        label="Intensity"
        value={t.gradient}
        options={["Subtle", "Balanced", "Bold"]}
        onChange={(v) => setTweak("gradient", v)}
      />
      <TweakSection label="Type & Layout" />
      <TweakRadio
        label="Headline font"
        value={t.headline}
        options={["System", "Manrope", "Grotesk"]}
        onChange={(v) => setTweak("headline", v)}
      />
      <TweakRadio
        label="Hero layout"
        value={t.hero}
        options={["Centered", "Split", "Stacked"]}
        onChange={(v) => setTweak("hero", v)}
      />
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById("tweaks-root")).render(<TweaksApp />);
