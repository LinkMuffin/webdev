export const metadata = { title: "Erklärung zur Barrierefreiheit – Landwetter" };

export default function BarrierefreiheitPage() {
  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold">Erklärung zur Barrierefreiheit</h1>

      <section className="mt-4 space-y-3">
        <p>
          Diese Webanwendung soll für möglichst viele Menschen nutzbar sein. Es wurden u. a. folgende
          Maßnahmen umgesetzt:
        </p>
        <ul className="list-disc ml-6">
          <li>Semantische HTML-Struktur (header, main, section, footer)</li>
          <li>Anpassbare Widgets</li>
          <li>Unterstützung für dunkles/helles Design (Systemeinstellung)</li>
          <li>Texte für Icons/Bilder (alt-Attribute bzw. aria-Label)</li>
          <li>Verzicht auf unnötige Animationen; respektiert <code>prefers-reduced-motion</code></li>
        </ul>
        <p>
          Sollten Ihnen Barrieren auffallen, schreiben Sie bitte an&nbsp;
          <a className="underline" href="mailto:marvinjosef.pick@stud.uni-goettingen.de">marvinjosef.pick@stud.uni-goettingen.de</a>.
        </p>
      </section>
    </main>
  );
}

