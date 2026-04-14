import { Button } from "./Button";
import { Card } from "./Card";
import { Badge } from "./Badge";

const colors = [
  { name: "bg",        value: "#0d0d14", label: "Background" },
  { name: "surface",   value: "#16161f", label: "Surface" },
  { name: "surface-2", value: "#1e1e2a", label: "Surface 2" },
  { name: "border",    value: "#2a2a3a", label: "Border" },
  { name: "text",      value: "#f0f0f8", label: "Text" },
  { name: "muted",     value: "#6b6b8a", label: "Muted" },
  { name: "accent",    value: "#f5c518", label: "Accent (Gold)" },
  { name: "ludo-red",    value: "#ef4444", label: "Ludo Red" },
  { name: "ludo-green",  value: "#22c55e", label: "Ludo Green" },
  { name: "ludo-blue",   value: "#3b82f6", label: "Ludo Blue" },
  { name: "ludo-yellow", value: "#eab308", label: "Ludo Yellow" },
];

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-12">
      <h2 className="font-display text-xl text-muted mb-1 tracking-wide uppercase text-sm">
        {title}
      </h2>
      <div className="h-px bg-border mb-6" />
      {children}
    </section>
  );
}

export function DesignSystem() {
  return (
    <div className="min-h-screen bg-bg font-body text-text">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-16">
          <h1 className="font-display text-5xl font-semibold text-accent mb-2">
            Ludoly
          </h1>
          <p className="text-muted text-base">Design System — tokens, components & patterns</p>
        </div>

        {/* ── Typography ── */}
        <Section title="Typography">
          <div className="space-y-4">
            <div>
              <p className="text-xs text-muted mb-1">Display / Fredoka</p>
              <p className="font-display text-5xl font-semibold">Ludoly</p>
            </div>
            <div>
              <p className="text-xs text-muted mb-1">Heading / Fredoka 600</p>
              <p className="font-display text-3xl font-semibold">Pass and Play</p>
            </div>
            <div>
              <p className="text-xs text-muted mb-1">Subheading / Fredoka 400</p>
              <p className="font-display text-xl">Choose number of players</p>
            </div>
            <div>
              <p className="text-xs text-muted mb-1">Body / Inter 400</p>
              <p className="font-body text-base text-text">
                The classic board game — roll the dice, race your pieces home.
              </p>
            </div>
            <div>
              <p className="text-xs text-muted mb-1">Small / Inter 500</p>
              <p className="font-body text-sm font-medium text-muted">
                Joining room · Creating game · Waiting for players…
              </p>
            </div>
          </div>
        </Section>

        {/* ── Colors ── */}
        <Section title="Colors">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {colors.map((c) => (
              <div key={c.name} className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-md border border-border flex-shrink-0"
                  style={{ backgroundColor: c.value }}
                />
                <div>
                  <p className="text-xs font-medium text-text leading-tight">{c.label}</p>
                  <p className="text-xs text-muted">{c.value}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Buttons ── */}
        <Section title="Buttons">
          <div className="space-y-6">
            <div>
              <p className="text-xs text-muted mb-3">Sizes — Primary</p>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary" size="sm">Small</Button>
                <Button variant="primary" size="md">Medium</Button>
                <Button variant="primary" size="lg">Large</Button>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted mb-3">Variants</p>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
                <Button disabled>Disabled</Button>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted mb-3">Full Width</p>
              <div className="max-w-xs space-y-2">
                <Button variant="primary" fullWidth>Play Online</Button>
                <Button variant="secondary" fullWidth>Pass and Play</Button>
                <Button disabled fullWidth>Play with Computer</Button>
              </div>
            </div>
          </div>
        </Section>

        {/* ── Cards ── */}
        <Section title="Cards">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="p-6">
              <p className="font-display text-lg mb-1">Default Card</p>
              <p className="text-sm text-muted">bg-surface with border</p>
            </Card>
            <Card variant="inset" className="p-6">
              <p className="font-display text-lg mb-1">Inset Card</p>
              <p className="text-sm text-muted">bg-surface-2, slightly elevated</p>
            </Card>
            <Card hoverable className="p-6">
              <p className="font-display text-lg mb-1">Hoverable Card</p>
              <p className="text-sm text-muted">Hover to see interaction</p>
            </Card>
            <Card onClick={() => {}} className="p-6">
              <p className="font-display text-lg mb-1">Clickable Card</p>
              <p className="text-sm text-muted">With onClick — scales on press</p>
            </Card>
          </div>
        </Section>

        {/* ── Badges ── */}
        <Section title="Badges">
          <div className="flex flex-wrap gap-3">
            <Badge>Default</Badge>
            <Badge variant="coming-soon">Coming Soon</Badge>
            <Badge variant="success">Online</Badge>
            <Badge variant="warning">Your Turn</Badge>
            <Badge variant="info">Room: ABCD</Badge>
          </div>
        </Section>

        {/* ── Player Colors ── */}
        <Section title="Player Color System">
          <div className="flex gap-6">
            {[
              { color: "#ef4444", glow: "shadow-glow-red",    label: "Red" },
              { color: "#22c55e", glow: "shadow-glow-green",  label: "Green" },
              { color: "#3b82f6", glow: "shadow-glow-blue",   label: "Blue" },
              { color: "#eab308", glow: "shadow-glow-yellow", label: "Yellow" },
            ].map((p) => (
              <div key={p.label} className="flex flex-col items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-full border-2 border-white/10 ${p.glow}`}
                  style={{ backgroundColor: p.color, boxShadow: `0 0 20px 0 ${p.color}55` }}
                />
                <p className="text-xs text-muted">{p.label}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Dice ── */}
        <Section title="Dice Display">
          <div className="flex gap-3">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="w-12 h-12 rounded-lg bg-surface-2 border border-border flex items-center justify-center font-display text-xl text-accent font-semibold shadow-card"
              >
                {n}
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}
