"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";

function HeroCard({
  href,
  title,
  subtitle,
  imagePath,
  fallbackIcon,
  accent,
}: {
  href: string;
  title: string;
  subtitle: string;
  imagePath: string;
  fallbackIcon: string;
  accent: "green" | "emerald";
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const accentClasses = accent === "green" ? "from-green-500/90 to-emerald-600/90" : "from-emerald-500/90 to-teal-600/90";

  return (
    <Link
      href={href}
      className="group relative block overflow-hidden rounded-2xl bg-white/90 backdrop-blur-sm border border-slate-200/80 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] min-h-[200px] sm:min-h-[240px]"
    >
      {!imgFailed && (
        <img
          src={imagePath}
          alt=""
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => setImgFailed(true)}
        />
      )}
      <div className={`absolute inset-0 bg-gradient-to-t ${accentClasses} ${imgFailed ? "" : "from-black/70 via-black/20 to-transparent"}`} />
      <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 text-white">
        <span className="text-3xl sm:text-4xl mb-2 opacity-90">{fallbackIcon}</span>
        <h2 className="font-heading text-xl sm:text-2xl font-bold mb-1">{title}</h2>
        <p className="text-white/90 text-sm sm:text-base">{subtitle}</p>
        <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold opacity-95 group-hover:gap-3 transition-all">
          Get started
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </span>
      </div>
    </Link>
  );
}

export default function Home() {
  return (
    <div className="relative">
      {/* Hero: one short sentence + chatbox */}
      <section className="relative flex flex-col items-center px-4 sm:px-6 py-12 sm:py-16">
        <p className="font-heading text-xl sm:text-2xl text-slate-800 text-center mb-8 max-w-2xl mx-auto">
          Personalized rent bundles for landlords and tenants—credit-informed, consent-based, audit-ready.
        </p>
        <ChatBox />
        <div className="relative w-full max-w-4xl mx-auto mt-14 grid sm:grid-cols-2 gap-5 sm:gap-6">
          <HeroCard
            href="/demo/listing"
            title="I'm a Landlord"
            subtitle="Create a listing, set rent & deposit rules, get offer menus for applicants."
            imagePath="/images/500-folsom-penthouse-view.jpg"
            fallbackIcon="🏠"
            accent="green"
          />
          <HeroCard
            href="/demo/applicant"
            title="I'm a Tenant"
            subtitle="Enter your name, consent to a soft check, see your personalized offer menu."
            imagePath="/images/august-student-blogpost.jpg"
            fallbackIcon="👤"
            accent="emerald"
          />
        </div>

        <p className="relative mt-8 text-sm text-slate-600 text-center">
          Sandbox demo · enter your name only to try the flow
        </p>
      </section>

      {/* How it works */}
      <section className="relative py-16 sm:py-20 md:py-24 border-t border-slate-200/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-slate-800 mb-3">
              How it works
            </h2>
            <p className="text-slate-700 max-w-2xl mx-auto">
              Three steps from listing to personalized offer menu, with consent and audit built in.
            </p>
          </div>

          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm mb-14 max-w-3xl mx-auto">
            <img
              src="/images/how-does-renting-work.jpg"
              alt="How renting works"
              className="w-full h-auto object-cover"
            />
          </div>

          <div className="space-y-14 sm:space-y-16">
            <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-12">
              <div className="flex-shrink-0 w-full md:w-1/2 flex justify-center">
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200/80 flex items-center justify-center">
                  <span className="text-6xl sm:text-7xl" aria-hidden>📋</span>
                  <span className="absolute -top-1.5 -right-1.5 w-10 h-10 rounded-full bg-green-500 text-white font-heading font-bold flex items-center justify-center text-sm">1</span>
                </div>
              </div>
              <div className="md:w-1/2">
                <h3 className="font-heading text-xl font-bold text-slate-800 mb-2">Landlord creates a listing</h3>
                <p className="text-slate-600 leading-relaxed mb-3">
                  Set the property address, base rent, and the ranges you allow: minimum and maximum deposit, lease term (e.g. 3–12 months), and the maximum autopay discount. This defines the “menu” of possible terms for every applicant.
                </p>
                <p className="text-sm text-slate-500">No commitment—you’re just defining the rules.</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row-reverse md:items-center gap-8 md:gap-12">
              <div className="flex-shrink-0 w-full md:w-1/2 flex justify-center">
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/80 flex items-center justify-center">
                  <span className="text-6xl sm:text-7xl" aria-hidden>✓</span>
                  <span className="absolute -top-1.5 -right-1.5 w-10 h-10 rounded-full bg-emerald-500 text-white font-heading font-bold flex items-center justify-center text-sm">2</span>
                </div>
              </div>
              <div className="md:w-1/2 md:text-right">
                <h3 className="font-heading text-xl font-bold text-slate-800 mb-2">Applicant consents & gets prequalified</h3>
                <p className="text-slate-600 leading-relaxed mb-3">
                  The tenant sees clear consent language and signs. This demo uses <strong>sandbox data</strong>—you only type your name. We record consent with a timestamp, then call the CRS Credit API for a soft prequal. We never store full SSN—only last 4 digits and a hash.
                </p>
                <p className="text-sm text-slate-500">Permissible purpose: tenant screening.</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-12">
              <div className="flex-shrink-0 w-full md:w-1/2 flex justify-center">
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-2xl bg-gradient-to-br from-teal-50 to-green-50 border border-teal-200/80 flex items-center justify-center">
                  <span className="text-6xl sm:text-7xl" aria-hidden>📊</span>
                  <span className="absolute -top-1.5 -right-1.5 w-10 h-10 rounded-full bg-teal-500 text-white font-heading font-bold flex items-center justify-center text-sm">3</span>
                </div>
              </div>
              <div className="md:w-1/2">
                <h3 className="font-heading text-xl font-bold text-slate-800 mb-2">Personalized offer menu</h3>
                <p className="text-slate-600 leading-relaxed mb-3">
                  We compute a risk band (A/B/C/D) and generate 3–5 offer bundles that trade off rent, deposit, term, and autopay discount. One option is recommended. You see a “Why this menu?” explainer and a full audit log—transparent and compliant.
                </p>
                <p className="text-sm text-slate-500">Pricing uses only credit-derived risk.</p>
              </div>
            </div>
          </div>

          <div className="mt-14 text-center">
            <Link
              href="/how-it-works"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium border border-slate-200 text-slate-700 hover:border-green-400 hover:text-green-700 hover:bg-green-50/80 transition"
            >
              Full how-it-works page
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function ChatBox() {
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, loading]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const userMessage = { role: "user" as const, content: text };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Chat failed");
      setMessages((prev) => [...prev, { role: "assistant", content: data.message }]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Sorry, something went wrong: ${(e as Error).message}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="rounded-2xl overflow-hidden">
        <div
          ref={scrollContainerRef}
          className={`overflow-y-auto p-4 sm:p-5 space-y-4 scroll-smooth transition-[min-height] duration-300 ${
            messages.length === 0 ? "min-h-[10rem]" : "min-h-[16rem] max-h-[36rem]"
          }`}
        >
          {messages.length === 0 && (
            <div className="flex items-center justify-center min-h-[7rem] text-slate-500 text-sm text-center px-4">
              e.g. “How does the demo work?” or “Find me compatible tenants”
            </div>
          )}
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[88%] rounded-2xl px-4 py-3 ${
                  m.role === "user"
                    ? "bg-green-600 text-white rounded-br-md shadow-sm text-sm"
                    : "bg-slate-200/40 backdrop-blur-md border border-slate-300/50 text-slate-800 rounded-bl-md shadow-sm text-[15px] leading-[1.65] max-w-[32rem]"
                }`}
              >
                <span className="font-medium text-xs opacity-90 block mb-1.5">
                  {m.role === "user" ? "You" : "Claude"}
                </span>
                <span className={`whitespace-pre-wrap ${m.role === "assistant" ? "font-sans tracking-wide" : ""}`}>
                  {m.content}
                </span>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="rounded-2xl rounded-bl-md px-4 py-3 text-sm bg-slate-200/40 backdrop-blur-md border border-slate-300/50 text-slate-600 flex items-center gap-2">
                <span className="inline-flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: "300ms" }} />
                </span>
                Thinking…
              </div>
            </div>
          )}
        </div>
        <div className="p-3 flex gap-2">
          <input
            type="text"
            className="flex-1 rounded-xl bg-white/20 backdrop-blur-md border border-slate-300/50 text-slate-800 placeholder-slate-500 px-4 py-3 text-sm focus:border-green-500 focus:ring-2 focus:ring-green-500/25 outline-none transition"
            placeholder="Type a message…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="px-5 py-3 rounded-xl bg-green-600 text-white font-semibold text-sm hover:bg-green-500 disabled:opacity-50 disabled:pointer-events-none transition shrink-0"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
