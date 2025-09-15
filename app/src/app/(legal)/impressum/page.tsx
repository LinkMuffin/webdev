export const metadata = { title: "Impressum – Landwetter" };

export default function ImpressumPage() {
  return (
    <main className="p-6 max-w-3xl mx-auto">
      <header>
        <h1 className="text-2xl font-semibold">Impressum</h1>
      </header>

      <section className="mt-4 space-y-3">
        <p><strong>Dienstanbieter</strong><br/>
          Marvin Pick<br/>
          E-Mail: marvinjosef.pick@stud.uni-goettingen.de
        </p>

        <p><strong>Inhaltlich Verantwortlicher</strong> (§ 18 Abs. 2 MStV): Marvin Pick</p>

        <p><strong>Hinweis</strong>: Dieses Projekt ist ein Hochschul-/Kursprojekt (nicht kommerziell).</p>

        <p><strong>Quellen</strong>: Daten der Deutschen Wetterdienste (DWD) über die bundesAPI; 
          Radar-Visualisierung via RainViewer-Embed (externe Einbettung).
        </p>
      </section>
    </main>
  );
}

