import Link from "next/link";
import { ArrowRight, Braces, Check, GitBranch, Github, ScanSearch, ShieldCheck, Terminal } from "lucide-react";
import { Logo } from "@/components/layout/logo";

export default function HomePage() {
  return (
    <main id="main-content">
      <section className="hero">
        <div className="container">
          <div className="intro"><span className="tag">Open source</span><span>API evolution, without the guesswork.</span></div>
          <h1>Catch breaking API changes before they ship.</h1>
          <p className="hero-subtitle">Compare OpenAPI specifications. Understand what changed, what breaks, and what needs a closer look. Before your consumers find out.</p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/compare"><ArrowRight size={16} /> Start Comparing</Link>
            <a className="button" href="https://github.com/jhoownogueira/OASFuse" target="_blank" rel="noreferrer"><Github size={16} /> View on GitHub</a>
          </div>
          <p className="hero-note">No account required. Bring two specs. Get a clear diff.</p>
          <div className="demo-window" aria-label="Example comparison result">
            <div className="demo-toolbar"><span>⌘ users-v1.yaml &nbsp;→&nbsp; users-v1.1.yaml</span><span className="complete">COMPARISON COMPLETE</span></div>
            <div className="demo-grid">
              <div className="demo-copy"><span className="mono eyebrow">4 CHANGES DETECTED</span><div className="badges"><span className="badge badge-breaking">2 breaking</span><span className="badge badge-safe">1 non-breaking</span><span className="badge badge-review">1 review</span></div><h3><span className="badge badge-safe">GET</span> &nbsp;/users</h3><strong>Response property type changed</strong><p>User.id changed from integer to string. Existing clients may fail to deserialize the response.</p><span className="mono eyebrow">response · 200 · application/json</span></div>
              <div className="demo-diff"><div className="diff-meta">components / schemas / User / properties / id</div><div className="diff-meta">BASELINE &nbsp;→&nbsp; CANDIDATE</div><div className="code-change code-remove">id:{"\n"}  - type: integer</div><div className="code-change code-add">id:{"\n"}  + type: string</div></div>
            </div>
            <div className="demo-toolbar"><span>Semantic changes. Not just different lines.</span><Link href="/compare">Explore the comparison →</Link></div>
          </div>
          <div className="tech-line"><span>Built for your API contract</span><span>OpenAPI 3.0 / 3.1</span><span>YAML / JSON</span><span>Browser / CLI / CI</span></div>
        </div>
      </section>

      <section className="marketing-section container"><span className="section-label">01 / THE WORKFLOW</span><h2>A clear answer in three steps.</h2><p className="section-copy">Less time reading diffs. More confidence in the next release.</p><div className="steps">{[
        ["01","Bring your contracts","Paste YAML or JSON, drop in your files, or load the example. Set a baseline and a candidate."],
        ["02","Compare the meaning","Find changes to endpoints, parameters, schemas, and responses - not formatting or key order."],
        ["03","Ship with context","Inspect every finding, share a report, and bring the same checks into your pull requests."],
      ].map(([n,t,d])=><article className="step" key={n}><span className="step-num">{n}</span><h3>{t}</h3><p>{d}</p></article>)}</div></section>

      <section className="marketing-section container"><span className="section-label">02 / BUILT FOR THE CONTRACT</span><h2>Signal, not noise.</h2><div className="feature-grid">
        <article className="feature-card"><ScanSearch size={22}/><h3>Semantic by design</h3><p>Understand response types, required fields, and endpoint changes in the context of your OpenAPI contract.</p></article>
        <article className="feature-card"><GitBranch size={22}/><h3>Review-ready findings</h3><p>Every change comes with a reason and a precise contract location, classified conservatively.</p></article>
        <article className="feature-card"><Terminal size={22}/><h3>From browser to build</h3><p>Start with an interactive comparison. Export JSON or Markdown, then automate checks with the CLI.</p></article>
      </div></section>

      <section className="marketing-section container"><div className="privacy-grid"><div className="privacy-copy"><span className="section-label">03 / PRIVACY FIRST</span><h2>Your contracts.<br/>Your control.</h2><p>API specifications can describe sensitive systems. OASFuse compares inputs in memory and intentionally keeps no comparison history.</p><Link href="/docs#security">Read the security principles →</Link></div><div className="privacy-card">
        <div className="privacy-item"><Check size={17}/><div><strong>Stateless by intention</strong><p>Comparison inputs are not written to application storage.</p></div></div>
        <div className="privacy-item"><Check size={17}/><div><strong>No account in the way</strong><p>The workflow starts with specifications, not sign-up.</p></div></div>
        <div className="privacy-item"><ShieldCheck size={17}/><div><strong>Inspectable, not a black box</strong><p>Rules are deterministic, documented, and shared with the CLI.</p></div></div>
      </div></div></section>
      <section className="cta"><h2>Make the next change a deliberate one.</h2><p>Start with the example, or compare the API you&apos;re shipping today.</p><Link className="button button-primary" href="/compare"><ArrowRight size={16}/> Start Comparing</Link></section>
      <footer className="site-footer"><div className="container footer-inner"><Logo/><span>Open specifications. Clear decisions.</span><span><Link href="/docs">Documentation</Link> &nbsp;&nbsp; <Braces size={14} style={{display:"inline"}}/> Open source</span></div></footer>
    </main>
  );
}
