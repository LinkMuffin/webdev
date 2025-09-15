export const metadata = { title: "Datenschutzerklärung – Landwetter" };

export default function DatenschutzPage() {
  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold">Datenschutzerklärung</h1>

      <section className="mt-4 space-y-3">
        <p>
          Dieses Projekt speichert für die Anmeldung eine E-Mail-Adresse und ein Passwort (verschlüsselt)
          in PocketBase. Persönliche Nutzungsprofile werden nicht erstellt.
        </p>
        <p>
          Technische Protokolldaten (z. B. Zeitpunkt des Zugriffs) können serverseitig anfallen.
          Wetterdaten stammen aus externen Quellen (DWD/bundesAPI, RainViewer). Beim Laden externer Inhalte
          kann die IP-Adresse an die jeweiligen Anbieter übertragen werden.
        </p>
        <p>
          Verantwortlich: Marvin Pick, marvinjosef.pick@stud.uni-goettingen.de . Sie haben das Recht auf Auskunft, Berichtigung,
          Löschung und Einschränkung der Verarbeitung Ihrer Daten.
        </p>
      </section>
    </main>
  );
}

