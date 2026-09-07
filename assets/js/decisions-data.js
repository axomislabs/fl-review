/* ==========================================================================
   Fersen & Lohse — decision catalogue, content only

   The eighteen questions where the direction of the website draft is actually
   decided. Derived from concept.docx, the five pages under website/ and the
   five voice messages of 24 August 2026.

   Questions 01-15 come from the two midday voice messages (Resources/Transkript.md).
   Block E (16-18) comes from the three evening messages that answer the draft itself
   (Resources/Transkript-2.md) — kept as its own block on purpose so the later batch
   stays visible as a batch. Never renumber 01-15 to weave them in.

   Content is German on purpose: this page is the internal review layer for
   Miguel and Fredrik, not public site copy.

   Fields per entry:
     id     stable key, used for storage and anchors — never renumber
     block  A–D, see BLOCKS below
     n      display number
     flag   true = "Grundsatzfrage", highlighted in the list and the rail
     q      the question
     now    what the website says today (HTML allowed)
     voice  what the voice message says (HTML allowed)
     why    why it matters (HTML allowed)
     type   "multi" for multiple choice, otherwise single choice
     opts   the answer options: v = stored value, label, hint
   ========================================================================== */
(function () {
  "use strict";

  var DECISIONS = [
    /* ---------------- BLOCK A ---------------- */
    { id:"a1", block:"A", n:"01", flag:true,
      q:"Wie verdienen wir Geld — und was davon sagen wir?",
      now:"<em>„No reseller margin, no referral fee, no vendor allegiance. Our only commercial interest is the quality of your decision.“</em> Dazu auf der Referenzseite: <em>„We are not a reseller for any of them.“</em>",
      voice:"<em>„Du zahlst mir nichts, ich bin kostenlos.“</em> Und: <em>„Wir würden natürlich doppelt abkassieren — von dem, der uns einstellt, und von GlobalDots.“</em>",
      why:"Das ist der einzige echte Widerspruch im ganzen Katalog, und er hängt an drei Seiten gleichzeitig. Zusatz: „unabhängig“ zu werben und gleichzeitig unoffengelegt Provision vom vermittelten Anbieter zu nehmen, ist in Deutschland als irreführende Werbung angreifbar — welchen Weg ihr auch nehmt, die Formulierung sollte vor Launch anwaltlich geprüft werden.",
      opts:[
        {v:"honorar", label:"Honorarmodell — der Kunde zahlt uns", hint:"Keine Provision von Anbietern. Die Unabhängigkeitsaussage bleibt so stehen, dafür fällt „kostenlos“ als Verkaufsargument weg."},
        {v:"vendor", label:"Anbieterfinanziert — für den Kunden kostenlos", hint:"„Für dich kostenlos“ wird der stärkste Hook der Startseite. Dafür muss „no referral fee“ raus und Unabhängigkeit anders begründet werden."},
        {v:"beides", label:"Zweigleisig und offengelegt", hint:"Der Kunde wählt: Beratungshonorar mit voller Neutralität, oder kostenlos mit ausgewiesener Provision. Ehrlichster Weg, erklärungsbedürftigster Text."},
        {v:"offen", label:"Noch nicht entschieden", hint:"Dann bleibt die Seite an dieser Stelle vorerst unverändert und wir kommen später darauf zurück."}
      ]},

    { id:"a2", block:"A", n:"02", flag:true,
      q:"Reden wir offen über GlobalDots?",
      now:"GlobalDots taucht zweimal auf: als Kachel in der Anbieterwand und als Partei in der RACI-Matrix, die die CDN-Migration führt. Die Beziehung wird nirgends erklärt.",
      voice:"<em>„Fredrik und ich sind ja bei GlobalDots.“</em> GlobalDots ist zugleich Arbeitgeber, Delivery-Arm für Migrationen und eine der beiden Erlösquellen.",
      why:"Ein aufmerksamer Leser kann sich das aus der RACI-Tabelle bereits zusammenreimen. Unerklärt im Raum stehen zu lassen ist die schlechteste der drei Varianten.",
      opts:[
        {v:"erklaeren", label:"Aktiv erklären", hint:"Eigener Abschnitt: GlobalDots als Umsetzungspartner, wir als Berater. Nimmt dem Thema die Brisanz, bevor jemand danach fragt."},
        {v:"partner", label:"Nur als Partner nennen, wie bisher", hint:"Logo und RACI bleiben, keine weitere Erklärung."},
        {v:"raus", label:"Ganz herausnehmen", hint:"Weder Logo noch RACI-Beispiel. Kostet die Referenzseite ihr stärkstes Delivery-Argument."}
      ]},

    { id:"a3", block:"A", n:"03",
      q:"Deutsch oder Englisch — und für welchen Markt?",
      now:"Alle fünf Seiten durchgehend Englisch. Impressum und Datenschutz nach deutschem Recht.",
      voice:"Deutsch gesprochen. Der Referenzfall liegt in Mexiko, GlobalDots ist international, das erweiterte Netzwerk offenbar auch.",
      why:"Das entscheidet Tonalität, Beispiele und ob eine zweite Sprachfassung gepflegt werden muss. Auch der Wechsel von „wir“ zu „ich“ hängt daran: die Sprachnachricht ist durchgehend erste Person Singular, die Website spricht im Plural.",
      opts:[
        {v:"en", label:"Englisch bleibt Hauptsprache", hint:"Passt zum internationalen Anbietermarkt, distanzierter für deutsche Mittelständler."},
        {v:"de", label:"Deutsch wird Hauptsprache", hint:"Näher am Zielkunden, wenn der Vertrieb im DACH-Raum stattfindet."},
        {v:"beide", label:"Zweisprachig", hint:"Doppelter Pflegeaufwand bei jeder künftigen Änderung — ehrlicherweise erst sinnvoll, wenn die Inhalte final sind."}
      ]},

    /* ---------------- BLOCK B ---------------- */
    { id:"b1", block:"B", n:"04",
      q:"Dürfen wir den Akamai-Fall erzählen?",
      now:"Zwei Fallstudien-Platzhalter (Globe, Weiße Immobilien) mit Blindtext: <em>„What was the commercial or technical problem?“</em>",
      voice:"Ein vollständig bezifferter Fall: 12 Jahre unbenchmarkt bei Akamai, 2,4 Mio. € pro Jahr, ein eingeholtes Vergleichsangebot, runter auf 1,9 Mio. — 1,5 Mio. € über die Vertragslaufzeit, ausgelöst von einem 10-T€-Mandat.",
      why:"Das ist der überzeugendste Inhalt aus beiden Nachrichten. Zu klären ist, wem der Fall gehört: er entstand vermutlich unter GlobalDots, nicht unter Fersen &amp; Lohse. El Puerto de Liverpool ist zudem börsennotiert.",
      opts:[
        {v:"anon", label:"Ja, anonymisiert", hint:"„Mexikanische Handelsgruppe, 2,4-Mio.-€-Vertrag, 12 Jahre nicht verhandelt.“ Zahlen bleiben, Name nicht — keine Freigabe nötig."},
        {v:"namen", label:"Ja, mit Kundennamen", hint:"Deutlich stärker, setzt aber schriftliche Freigabe des Kunden voraus — und die Klärung mit GlobalDots."},
        {v:"nein", label:"Nein", hint:"Dann brauchen wir einen anderen Beleg, sonst bleibt die Seite bei Behauptungen ohne Beweis."}
      ]},

    { id:"b2", block:"B", n:"05", flag:true,
      q:"Was passiert mit den drei Platzhalter-Zahlen?",
      now:"Auf der Startseite stehen <span class=\"mono\">XX&nbsp;%</span> durchschnittliche Ersparnis, <span class=\"mono\">€&nbsp;X.Xm</span> kumuliert und <span class=\"mono\">XX Tage</span> bis zur Unterschrift. Dazu <span class=\"mono\">XX&nbsp;yrs</span> Markterfahrung im Hero.",
      voice:"Liefert echte Zahlen für genau einen Fall — aber keinen Durchschnitt über mehrere Mandate.",
      why:"Die Projektdoku nennt diese drei Zahlen selbst „das stärkste Vertrauenssignal der Seite“. Erfundene Durchschnittswerte sind der schnellste Weg, dieses Vertrauen wieder zu verlieren, sobald jemand nachfragt.",
      opts:[
        {v:"liefern", label:"Wir liefern belastbare Werte", hint:"Inklusive der Rechengrundlage, damit sie im Gespräch verteidigt werden können."},
        {v:"eine", label:"Nur eine Zahl statt drei", hint:"Eine verteidigbare Zahl wirkt stärker als drei runde. Der Rest der Fläche geht an den Fall."},
        {v:"fall", label:"Zahlen raus, stattdessen der Fall", hint:"Ein konkretes Beispiel mit echten Beträgen ersetzt die Statistik-Kacheln komplett."}
      ]},

    { id:"b3", block:"B", n:"06",
      q:"Was wird aus Globe und Weiße Immobilien?",
      now:"Beide stehen als Referenzen auf Startseite und Referenzseite — mit leeren Kacheln, Blindtext und dem Hinweis, dass Logos und schriftliche Freigaben noch fehlen.",
      voice:"Kommen nicht vor. Erwähnt werden ausschließlich der mexikanische Fall und das GlobalDots-Portfolio.",
      why:"Beide stammen aus dem Konzeptpapier. Wenn dahinter keine erzählbaren Projekte stehen, schwächen leere Referenzkacheln die Seite mehr, als sie ihr nützen.",
      opts:[
        {v:"text", label:"Wir liefern Text und Freigaben", hint:"Herausforderung, Vorgehen, Ergebnis — je drei bis vier Sätze pro Kunde."},
        {v:"ersetzen", label:"Durch anonymisierte Fälle ersetzen", hint:"Branche und Größenordnung statt Namen. Keine Freigabe nötig, sofort veröffentlichbar."},
        {v:"warten", label:"Referenzblock vorerst herausnehmen", hint:"Lieber keine Referenzen als sichtbar leere. Kommt zurück, sobald Material da ist."}
      ]},

    { id:"b4", block:"B", n:"07",
      q:"Braucht die Seite eine Team-Seite?",
      now:"Es gibt keine. Fünf Seiten — Start, Referenzen, Katalog, Kontakt, Impressum — und auf keiner steht, wer hinter Fersen &amp; Lohse steckt.",
      voice:"<em>„… über Fredrik, über Noel, über mich, über Kontakte, über das erweiterte Netzwerk.“</em> Das Produkt ist buchstäblich das persönliche Netzwerk dreier Leute.",
      why:"Bei einem Geschäft, das auf Zugang und Vertrauen beruht, ist Anonymität die größte strukturelle Lücke des Entwurfs.",
      opts:[
        {v:"voll", label:"Ja, mit Fotos und Profilen", hint:"Wer, welcher Hintergrund, welche Anbieter — das ist der Kompetenznachweis."},
        {v:"schlank", label:"Ja, aber schlank", hint:"Kurzprofile ohne Fotos, oder ein Abschnitt auf der Startseite statt einer eigenen Seite."},
        {v:"nein", label:"Nein", hint:"Bewusst als Firma auftreten, nicht als Personen."}
      ]},

    /* ---------------- BLOCK C ---------------- */
    { id:"c1", block:"C", n:"08",
      q:"Kommt das Problem vor die Lösung?",
      now:"Der Hero geht direkt in „What we do“ über — sechs Leistungen, ohne vorher zu begründen, warum ein Unternehmen das nicht selbst kann.",
      voice:"Ein starkes Argument: IT-Einkauf ist schwerer als normaler Einkauf, weil eine technische Komponente dazukommt; der Markt bewegt sich schneller, als ein Einkäufer aktuell bleiben kann; LLMs haben Bedrohungen erzeugt, die vor zwei Jahren niemand auf dem Schirm hatte; <em>„95 % der Firmen machen grobe bis mittelgrobe Fehler.“</em>",
      why:"Das ist der beste erzählerische Stoff aus der Aufnahme und er fehlt komplett. Ohne Problemstellung liest sich die Leistungsliste wie ein Katalog.",
      opts:[
        {v:"prominent", label:"Ja, prominent vor den Leistungen", hint:"Eigener Abschnitt direkt unter dem Hero, mit der 95-%-Aussage als Aufhänger."},
        {v:"kompakt", label:"Ja, aber kompakt", hint:"Drei, vier Sätze im Hero-Bereich statt eines eigenen Abschnitts."},
        {v:"nein", label:"Nein, direkt zur Leistung", hint:"Kürzer, aber die Seite verliert ihr stärkstes Argument."}
      ]},

    { id:"c2", block:"C", n:"09",
      q:"Wird „drei Angebote, unverbindlich“ ein eigenes Produkt?",
      now:"Sechs gleichgewichtige Leistungen, dazu ein Vierschritt-Prozess, der in <em>„Award &amp; handover — signed contract“</em> endet. Das liest sich wie ein schweres Beratungsmandat.",
      voice:"<em>„Ich hole dir drei Angebote rein. Du musst sie nicht nutzen, du musst nicht migrieren, stress dich nicht, aber du kannst sie bei der nächsten Verhandlung nutzen.“</em>",
      why:"Das ist mit Abstand das am leichtesten verkäufliche Angebot: kein Wechselzwang, kein Projektrisiko, kleiner Einstieg. Auf der Website ist es aktuell eine Leistung unter sechs.",
      opts:[
        {v:"vorn", label:"Ja, als benanntes Produkt ganz vorn", hint:"Eigener Name, eigener Abschnitt, eigener Call-to-Action. „Du musst nicht wechseln“ als Versprechen sichtbar."},
        {v:"eine", label:"Ja, aber gleichrangig zu den anderen", hint:"Bleibt in der Sechserliste, wird nur klarer formuliert."},
        {v:"nein", label:"Nein, alles bleibt gleichgewichtig", hint:""}
      ]},

    { id:"c3", block:"C", n:"10",
      q:"Welche Zahl führt die Seite an?",
      now:"„183 Capabilities in 10 Domains“ steht im Hero und trägt die ganze Katalogseite. Die Zahl kommt aus der Keyword-Excel.",
      voice:"<em>„Dadurch, dass ich an circa 120 Technologiefirmen Zugang habe.“</em> Und für GlobalDots: rund 100 Technologien, davon fünf strategisch, 30 bis 40 aktiv, 20 bis 30 ruhend.",
      why:"183 Capabilities ist eine Systematik — sie beweist, dass ihr den Markt sortieren könnt. 120 Anbieterzugänge ist der eigentliche Burggraben: bei wem bekommt ihr innerhalb von Tagen ein echtes Angebot. Beide Zahlen zählen Verschiedenes, eine sollte vorn stehen.",
      opts:[
        {v:"zugaenge", label:"Die Anbieterzugänge führen", hint:"„Direkter Zugang zu rund 120 Technologieanbietern“ im Hero, der Katalog bleibt als Beleg dahinter."},
        {v:"capabilities", label:"183 Capabilities bleibt vorn", hint:"Konkreter und nachprüfbar, weil der Katalog direkt danebensteht."},
        {v:"beide", label:"Beide, Zugänge zuerst", hint:"Zwei Kennzahlen nebeneinander — verlangt eine saubere Erklärung, dass sie Verschiedenes messen."}
      ]},

    { id:"c4", block:"C", n:"11",
      q:"Ist Sicherheitsrisiko eine zweite Wertachse?",
      now:"Die Seite argumentiert rein kommerziell: Preis, Konditionen, Ersparnis. Obwohl „Security &amp; Identity“ mit 35 Capabilities die größte der zehn Domänen ist, kommt Risiko als Argument nicht vor.",
      voice:"Zwei Fehlerarten: zu teuer <em>und</em> Löcher. <em>„Die meisten Firmen sind aktuell im Breach, interessieren sich aber nicht dafür oder sind sich nicht bewusst.“</em> Zugleich aber: <em>„Löcher aufzudecken ist immer schwer … was man immer einfach machen kann, ist das Thema Geldsparung, und da möchte ich mich drauf fokussieren.“</em>",
      why:"Hier widerspricht sich die Sprachnachricht selbst — sie nennt das Risiko-Argument und schiebt es im selben Atemzug beiseite. Unsere Empfehlung steht in der ersten Option.",
      opts:[
        {v:"problem", label:"Nur als Problemstellung — Empfehlung", hint:"Das Risiko begründet, warum Einkauf schwer ist. Verkauft wird die Ersparnis. Ein Fokus, zwei Argumente."},
        {v:"leistung", label:"Als eigene Leistung ausbauen", hint:"Security-Assessment als zweites Standbein — deutlich mehr Aufwand in Delivery und Text."},
        {v:"weg", label:"Ganz weglassen", hint:"Rein kommerzielle Positionierung, wie heute."}
      ]},

    { id:"c5", block:"C", n:"12",
      q:"Bleibt der Vierschritt-Prozess wie er ist?",
      now:"Vier Stufen: Anforderung &amp; Baseline, Marktscan &amp; Shortlist, Verhandlung &amp; Gegenangebote, Zuschlag &amp; Übergabe — <em>„a documented decision trail you can hand to finance, security and legal“</em>.",
      voice:"Beschreibt einen deutlich leichteren Ablauf: Metriken ansehen, Angebote einholen, dem Kunden übergeben. Migration ausdrücklich optional.",
      why:"Der dokumentierte Prozess ist ein gutes Argument gegenüber Einkauf und Revision. Er signalisiert aber Aufwand — und damit genau das, was das Einstiegsprodukt aus Frage 09 vermeiden will.",
      opts:[
        {v:"behalten", label:"So beibehalten", hint:"Wirkt professionell und auditfest."},
        {v:"leicht", label:"Auf den leichten Einstieg umbauen", hint:"Weniger Stufen, Fokus auf „schnell zu Vergleichsangeboten“."},
        {v:"zwei", label:"Zwei Pfade zeigen", hint:"Der kurze Benchmark und das volle Mandat nebeneinander — der Kunde sieht, worauf er sich einlässt."}
      ]},

    /* ---------------- BLOCK D ---------------- */
    { id:"d1", block:"D", n:"13", type:"multi",
      q:"Welche Grafiken sollen entwickelt werden?",
      now:"Die Seite arbeitet fast ausschließlich mit Text und Kacheln. Die einzige echte Informationsgrafik ist die RACI-Tabelle auf der Referenzseite.",
      voice:"Die überzeugendsten Stellen sind Zahlenverläufe und Größenverhältnisse — genau das, was sich zeichnen lässt statt es zu behaupten.",
      why:"Mehrfachauswahl. Jede Grafik wird eigens entworfen und passend zur Bildsprache gebaut, nicht als Stock-Illustration eingekauft.",
      opts:[
        {v:"wasserfall", label:"Ersparnis-Verlauf am echten Fall", hint:"2,4 Mio. → Vergleichsangebot → 1,9 Mio., mit der Ersparnis über drei Jahre als Fläche. Die stärkste Einzelgrafik."},
        {v:"marktkarte", label:"Marktkarte der zehn Domänen", hint:"Zeigt Breite und Anbieterdichte auf einen Blick — löst die lange Domänenliste der Startseite ab."},
        {v:"zeitstrahl", label:"Verhandlungsfenster im Zeitverlauf", hint:"Wann Verhandlungsmacht entsteht und wann sie verfällt. Macht das „drei bis sechs Monate vorher“ aus dem Kontaktabschnitt sichtbar."},
        {v:"vergleich", label:"Gegenüberstellung mit und ohne Benchmark", hint:"Zwei Vertragsverläufe nebeneinander — das Argument für Frage 09 in einem Bild."},
        {v:"netz", label:"Netzwerkbild der Anbieterzugänge", hint:"Visualisiert die 120 Zugänge und damit den Burggraben aus Frage 10."},
        {v:"keine", label:"Keine Grafiken", hint:"Rein typografisch bleiben."}
      ]},

    { id:"d2", block:"D", n:"14",
      q:"Wie viel Text soll weg?",
      now:"Sechs Leistungen mit je zwei Sätzen, zehn Domänen mit je einer Beschreibung, vier Prozessschritte mit Erläuterung, dazu Fließtext in jeder Sektionseinleitung. Die Startseite ist lang.",
      voice:"Sehr direkt, sehr konkret, arbeitet mit Beispielen statt mit Aufzählungen.",
      why:"Prägnanz ist kein Selbstzweck — sie schafft Platz für den Fall, die Problemstellung und die Grafiken. Irgendwo muss dieser Platz herkommen.",
      opts:[
        {v:"stark", label:"Deutlich kürzen", hint:"Etwa ein Drittel raus. Leistungen auf je einen Satz, Domänenliste in den Katalog verschoben."},
        {v:"moderat", label:"Moderat straffen", hint:"Absätze verdichten, Struktur bleibt."},
        {v:"lassen", label:"So lassen", hint:"Der Umfang belegt Kompetenz."}
      ]},

    { id:"d3", block:"D", n:"15",
      q:"Nennen wir einen Preis?",
      now:"Nirgends ein Preis. Nur: <em>„The first conversation is free and non-binding.“</em>",
      voice:"<em>„Für nicht viel, für 10.000 Euro hat er uns Professional Services gekauft“</em> — und daraus wurden 1,5 Mio. € Ersparnis.",
      why:"Ein genannter Einstiegspreis filtert Anfragen vor und macht das Verhältnis von Aufwand zu Ertrag sofort greifbar. Er legt euch aber auch fest.",
      opts:[
        {v:"fix", label:"Ja, Einstiegspreis nennen", hint:"„Benchmark ab 10.000 €.“ Neben dem Ersparnis-Beispiel wird daraus ein sehr starkes Argument."},
        {v:"ab", label:"Nur eine Größenordnung", hint:"„Fünfstellig, abhängig vom Vertragsvolumen“ — Orientierung ohne Festlegung."},
        {v:"kein", label:"Kein Preis", hint:"Alles im Gespräch, wie heute."}
      ]},

    /* ---------------- BLOCK E ---------------- */
    { id:"e1", block:"E", n:"16", flag:true,
      q:"Bekommt die Seite eine Use-Case-Ebene für den Einkäufer?",
      now:"Die Startseite listet sechs Leistungen aus Anbietersicht — <em>„Sourcing software &amp; technology“</em>, <em>„Running contract negotiations“</em>, <em>„Market price &amp; terms benchmarking“</em> und drei weitere. Was der Einkäufer damit erreicht, muss er sich selbst zusammenreimen.",
      voice:"<em>„Was wir noch ein bisschen verbessern können, ist: was sind die einzelnen Use Cases für den Einkäufer?“</em> Genannt werden vier: den Status quo challengen und Verhandlungsmacht ins Renewal mitnehmen (<em>„das Hauptding“</em>); die eigene Abhängigkeit vom Vendor bestimmen; herausfinden, wer die besten Player am Markt sind; das eigene Angebot gegen den Markt stellen.",
      why:"Das ist die zentrale Bitte aus den drei Abendnachrichten — und der einzige Punkt, an dem der Entwurf ausdrücklich als unvollständig bezeichnet wird. Die vier Use Cases beschreiben dieselben Leistungen, nur aus der Sicht dessen, der zahlt. Die Frage ist, ob sie die Startseite gliedern oder neben ihr stehen.",
      opts:[
        {v:"leitachse", label:"Ja, als Leitachse der Startseite", hint:"Vier Use Cases gliedern die Seite, die sechs Leistungen ordnen sich als Mittel darunter ein. Der größte Umbau — und die klarste Kundensicht."},
        {v:"abschnitt", label:"Ja, als eigener Abschnitt", hint:"Ein Use-Case-Block vor den Leistungen, die Leistungsliste bleibt daneben bestehen. Verlangt Disziplin, damit nichts doppelt erzählt wird."},
        {v:"umformulieren", label:"Nein, die Leistungen aus Kundensicht umschreiben", hint:"Keine neue Ebene, aber jede der sechs Leistungen beginnt mit dem Ergebnis für den Einkäufer statt mit der Tätigkeit."},
        {v:"nein", label:"Nein, bleibt wie es ist", hint:"Kein Aufwand — geht aber an der ausdrücklichen Rückmeldung vorbei."}
      ]},

    { id:"e2", block:"E", n:"17", flag:true,
      q:"Wird der Metriken-Ablauf der Einstieg auf der Kontaktseite?",
      now:"Ein allgemeines Kontaktformular: Name, Firma, E-Mail, Telefon, Interessengebiet, Nachricht. Dazu <em>„Renewal in the next six months?“</em> und der Hinweis, das erste Gespräch sei kostenlos und unverbindlich.",
      voice:"<em>„Am besten wäre es so, wenn er quasi sagt, ich möchte das und das challengen, dass wir dann antworten mit: okay, dann brauchen wir folgende Metriken. Und er dann halt eine Quote von uns bekommt.“</em> Direkt danach: <em>„Wie wir das genau machen, weiß ich auch noch nicht.“</em>",
      why:"Das macht aus dem Kontaktformular einen Qualifizierungsschritt: Der Interessent nennt, was er challengen will, und bekommt die Metrikenliste zurück, die ihr für ein belastbares Vergleichsangebot braucht. Das filtert unernste Anfragen und macht sofort greifbar, wie der Ablauf aussieht — verlangt aber, dass die Metriken je Domäne einmal sauber definiert werden.",
      opts:[
        {v:"formular", label:"Ja, als geführtes Formular", hint:"Auswahl der Domäne blendet die passende Metrikenliste ein. Beste Wirkung, meiste Arbeit — und die Metriken müssen vorher feststehen."},
        {v:"statisch", label:"Ja, aber als statische Liste", hint:"„Das brauchen wir von dir“ als Aufzählung neben dem Formular. Erklärt den Ablauf, ohne Logik zu bauen."},
        {v:"erklaeren", label:"Nur den Ablauf beschreiben", hint:"Drei Schritte als Text — challengen, Metriken, Angebot. Keine Metriken im Detail, das klärt sich im Gespräch."},
        {v:"spaeter", label:"Später, erst wenn die Metriken feststehen", hint:"Kontaktseite bleibt vorerst wie sie ist. Ehrlich, solange offen ist, wie das genau laufen soll."}
      ]},

    { id:"e3", block:"E", n:"18",
      q:"Wird die Abhängigkeitsanalyse ein zweites, größeres Angebot?",
      now:"Nicht vorhanden. Migration kommt nur als RACI-Beispiel auf der Referenzseite vor, Abhängigkeit und Wechselkosten tauchen nirgends als Leistung auf.",
      voice:"<em>„Finde heraus, wie abhängig du bist von deinem aktuellen Vendor. Hol dir Informationen rein, was würde mich eine Migration kosten und zu welchen Marktpreisen könnte ich hingehen — also quasi in einem Projekt und eine komplette ROI-Rechnung dafür.“</em>",
      why:"Das ist deutlich schwerer als der Benchmark aus Frage 09: ein bezahltes Projekt mit Migrationskostenschätzung und ROI-Rechnung. Damit hättet ihr zwei klar verschiedene Angebote statt sechs gleich schwerer Leistungen — und Frage 12 (ein Prozess oder zwei Pfade) hängt unmittelbar daran.",
      opts:[
        {v:"zweitprodukt", label:"Ja, als benanntes zweites Produkt", hint:"Leichter Benchmark als Einstieg, Abhängigkeitsanalyse als Ausbaustufe. Passt zu „zwei Pfade zeigen“ in Frage 12."},
        {v:"leistung", label:"Ja, aber als eine Leistung unter mehreren", hint:"Wandert in die bestehende Liste, ohne eigene Bühne."},
        {v:"nein", label:"Nein, Fokus bleibt der Benchmark", hint:"Ein Angebot, klar erzählt. Deckt sich mit „was man immer einfach machen kann, ist das Thema Geldsparung“ aus der Mittagsnachricht."}
      ]}
  ];


  /* ========================================================================
     DIE ANTWORTEN — Miguel, 31.08.2026, 19:23

     Eingegangen als CSV-Export dieser Seite:
     Resources/fersen-lohse-entscheidungen-2026-08-31 3.csv. Alle achtzehn
     Fragen beantwortet, drei davon mit Ergänzung.

     Getrennt von DECISIONS gehalten, weil es eine andere Sorte Inhalt ist:
     die Fragen oben sind der Entwurfsstand, das hier ist die Rückmeldung
     darauf und was daraufhin an der Website geändert wurde. Die Seite bleibt
     dadurch weiter benutzbar — wer sie öffnet, kann für eine zweite Runde
     nach wie vor selbst antworten, ohne dass diese Antworten überschrieben
     werden.

     Felder je Eintrag:
       v      der gewählte Optionswert (bei "multi" ein Array)
       note   Miguels Ergänzung, wörtlich aus der CSV
       done   was daraufhin tatsächlich an der Website geändert wurde
       open   was dabei offen geblieben ist oder eine Entscheidung braucht
       links  Sprungziele in die Seite: h = href, t = Beschriftung
              Die rev-… Anker vergibt review.js aus data-review-id.
     ======================================================================== */
  var ANSWERED = {
    by: "Miguel",
    at: "31.08.2026, 19:23",
    source: "Resources/fersen-lohse-entscheidungen-2026-08-31 3.csv",
    items: {

      a1: { v:"vendor", note:"Mach dir VM (1)",
        done:"Das Geldmodell führt jetzt die Seite an statt der Unabhängigkeitsaussage. Neuer dunkler Abschnitt „How we are paid“: nichts im Voraus, Anteil an den erzielten Einsparungen, dazu die Vergütung von der Umsetzungsseite. Die Zeile „No reseller margin, no referral fee, no vendor allegiance“ ist ersetzt, der Hero-Eyebrow lautet „No fixed fees · Paid from what you save“, und auf der Referenzseite steht statt „We are not a reseller for any of them“ jetzt „We do not resell their products to you“ mit Verweis auf den Abschnitt.",
        open:"Anwaltlich prüfen lassen: Erfolgsbeteiligung plus Vergütung von der Umsetzungsseite ist tragfähig, aber „unabhängig“ zu werben und dabei nicht offengelegte Anbietervergütung zu nehmen, ist in Deutschland angreifbar. Der Prozentsatz fehlt noch — solange er nicht feststeht, bleibt die Formulierung allgemein.",
        links:[
          {h:"index.html#rev-home-model", t:"Startseite · How we are paid"},
          {h:"index.html#rev-home-hero", t:"Startseite · Hero"},
          {h:"references.html#rev-references-partners", t:"Referenzen · Partners & technologies"}
        ]},

      a2: { v:"raus",
        done:"GlobalDots kommt auf keiner Seite mehr vor: die Kachel ist aus beiden Anbieterwänden verschwunden, und der komplette RACI-Abschnitt „Clear ownership when four parties share one migration“ ist von der Referenzseite entfallen. Damit sind auch Barceló, Cloudflare und Telefónica als benannte Projektparteien weg. Die Referenzseite hat dadurch einen Abschnitt weniger.",
        open:"Falls das Delivery-Argument doch fehlt: dieselbe Matrix ginge anonymisiert — „Client · Platform vendor · Integration partner · Carrier“ statt der Namen. Ein Wort genügt, dann kommt sie so zurück.",
        links:[
          {h:"references.html#rev-references-partners", t:"Referenzen · Anbieterwand ohne GlobalDots"},
          {h:"index.html#rev-home-why", t:"Startseite · Anbieterwand ohne GlobalDots"}
        ]},

      a3: { v:"en",
        done:"Keine Änderung nötig. Alle fünf Kundenseiten bleiben durchgehend englisch, nur diese Arbeitsseite ist weiter deutsch.",
        links:[]},

      b1: { v:"anon",
        done:"Der Fall steht jetzt zweimal: kompakt auf der Startseite mit der Vorher-/Nachher-Grafik, und ausführlich als Fallstudie auf der Referenzseite mit Challenge, Approach und Result. Weder der Kunde noch die beiden Anbieter werden genannt — „a Mexican retail group, a listed business in the billions“. Damit ist keine Freigabe nötig und die Frage, wem der Fall gehört, stellt sich nicht.",
        links:[
          {h:"index.html#rev-home-case", t:"Startseite · Proof"},
          {h:"references.html#rev-references-case", t:"Referenzen · Benchmark case"}
        ]},

      b2: { v:"fall", note:"Wir werden auch noch weitere Beispiel einbauen",
        done:"Der ganze Impact-Abschnitt mit den drei XX-Kacheln ist weg; an seiner Stelle steht der Fall. Auch die beiden Platzhalterzahlen im Hero sind raus — statt „XX yrs“ und „XX %“ stehen dort jetzt 183 Capabilities, 10 Domänen und ~120 Anbieter. Die Notiz unter dem Fall hält deine Ergänzung fest, dass weitere Beispiele nachkommen.",
        links:[
          {h:"index.html#rev-home-case", t:"Startseite · Proof"},
          {h:"index.html#rev-home-hero", t:"Startseite · Hero ohne Platzhalterzahlen"}
        ]},

      b3: { v:"text",
        done:"Beide Kacheln bleiben stehen und warten auf Material. Die Notiz sagt jetzt, dass Text und Freigaben von euch kommen, statt sie als offenes Risiko zu markieren. Auf der Startseite steht der anonymisierte Fall als dritte Referenzkachel über den beiden.",
        open:"Offen bleibt das Material selbst: je drei bis vier Sätze zu Herausforderung, Vorgehen und Ergebnis, plus die schriftliche Freigabe beider Kunden.",
        links:[
          {h:"references.html#rev-references-cases", t:"Referenzen · Selected engagements"},
          {h:"index.html#rev-home-references", t:"Startseite · References-Teaser"}
        ]},

      b4: { v:"schlank",
        done:"Abschnitt „Who you are actually working with“ auf der Startseite — drei Kurzprofile nebeneinander, keine Fotos, keine sechste Seite. Der Aufhänger ist, dass die Reichweite das Produkt ist.",
        open:"Nachnamen von Fredrik und Noel, die drei Rollen und je zwei bis drei Sätze fehlen noch — im Entwurf gelb markiert.",
        links:[{h:"index.html#rev-home-team", t:"Startseite · The people"}]},

      c1: { v:"kompakt",
        done:"Ein schmales Band direkt unter dem Hero statt eines eigenen großen Abschnitts: die 95-%-Aussage als Aufhänger, daneben drei Punkte — technischer Einkauf, Markttempo mit den LLM-Bedrohungen, und die zwei Fehlerarten.",
        open:"Die 95 % stehen bewusst als „in our assessment“ da. Als harte Zahl bräuchten sie eine Quelle, sonst fragt der erste skeptische Leser danach.",
        links:[{h:"index.html#rev-home-problem", t:"Startseite · Why this is hard"}]},

      c2: { v:"eine",
        done:"Die Sechserliste bleibt gleichgewichtig, aber die Karte ist umformuliert und heißt jetzt „Three comparable offers, non-binding“ — „du musst nicht wechseln, du musst nicht migrieren“ steht wörtlich drin. Sie steht als erste der sechs. Zusätzlich taucht der Benchmark im Abschnitt zu den zwei Angeboten als leichter Einstieg auf, was aus Frage 18 folgt.",
        links:[
          {h:"index.html#rev-home-services", t:"Startseite · What we do"},
          {h:"index.html#rev-home-offers", t:"Startseite · Two ways in"}
        ]},

      c3: { v:"capabilities",
        done:"183 führt weiter: im Hero, in der Überschrift der Marktkarte und auf dem Katalog-Button. Die ~120 Anbieterzugänge stehen als dritte, kleinere Hero-Zahl daneben und tragen den Team-Abschnitt — sie konkurrieren nicht mit der 183, sondern erklären, woher die Angebote kommen.",
        links:[
          {h:"index.html#rev-home-hero", t:"Startseite · Hero"},
          {h:"index.html#rev-home-coverage", t:"Startseite · Marktkarte"}
        ]},

      c4: { v:"leistung",
        done:"Eigener Abschnitt „The second kind of mistake“ mit der benannten Leistung „Security exposure review“ — vier Punkte Umfang, getrennt vom Benchmark verkauft. Der Aufhänger ist, dass Security mit 35 von 183 Capabilities die größte Domäne ist.",
        open:"Was genau drin ist, wer es liefert und wie es abgerechnet wird, steht noch nicht fest — auf der Seite als offen markiert.",
        links:[{h:"index.html#rev-home-security", t:"Startseite · Security exposure review"}]},

      c5: { v:"behalten",
        done:"Unverändert. Die vier Stufen stehen Wort für Wort wie vorher, inklusive „a documented decision trail you can hand to finance, security and legal“.",
        links:[{h:"index.html#rev-home-process", t:"Startseite · How it works"}]},

      d1: { v:["marktkarte"],
        done:"Die Marktkarte ersetzt die Zehner-Kachelliste auf der Startseite, wie im Optionstext vorgesehen. Fläche proportional zur Zahl der Capabilities — die zehn Rechtecke sind zusammen der Katalog im Maßstab 1:183 —, eine Farbfamilie in fünf Stufen, dunkler mit der Größe, jede Fläche verlinkt in ihre Katalogdomäne. Auf schmalen Displays löst sich die Proportion in eine zweispaltige Liste auf, damit die Beschriftungen lesbar bleiben.",
        open:"Anbieterdichte je Domäne steckt noch nicht drin — dafür bräuchten wir die Zahl der Anbieter pro Domäne. Die anderen vier Grafiken aus der Frage sind nicht gebaut.",
        links:[{h:"index.html#rev-home-coverage", t:"Startseite · Marktkarte"}]},

      d2: { v:"lassen",
        done:"Nichts gekürzt. Die Startseite ist durch Problemband, Use Cases, Fall, Angebote, Security, Geldmodell und Team deutlich länger geworden — der Umfang belegt Kompetenz, wie im Optionstext.",
        links:[]},

      d3: { v:"kein", note:"als stärke, hervorheben. Keine fixen preise euer erfolg ist unser erfolg: wir behalente % der direkten Einsparungen nur für die wir direkr beteiligt waren",
        done:"Kein Preis auf der Seite, und die Preislosigkeit ist zum Argument gemacht: der Abschnitt „How we are paid“ trägt „There is no price list. Your success is our success“ als Leitsatz, darunter „a share of what you save — only on the contracts we were involved in“.",
        open:"Die 10.000 € aus dem Fall sind bewusst nicht genannt: neben dem Ersparnisbeispiel würden sie sofort als Einstiegspreis gelesen, und das widerspricht „kein Preis“. Das Verhältnis 10 T€ → 1,5 Mio. ist das stärkste Einzelargument, das wir haben — sag Bescheid, wenn es doch rein soll, dann ist es eine Zeile.",
        links:[{h:"index.html#rev-home-model", t:"Startseite · How we are paid"}]},

      e1: { v:"abschnitt",
        done:"„Four things you can actually do with us“ — eigener Abschnitt vor den Leistungen, in deiner Reihenfolge: Status quo challengen (als „the main one“ markiert), Abhängigkeit bestimmen, die besten Player finden, das eigene Angebot gegen den Markt stellen. Jeder Use Case endet mit einer „You get“-Zeile, damit nichts doppelt zur Leistungsliste erzählt wird.",
        links:[{h:"index.html#rev-home-usecases", t:"Startseite · For the buyer"}]},

      e2: { v:"formular",
        done:"Die Kontaktseite ist ein dreistufiger Ablauf geworden: Domäne wählen → die passende Metrikenliste erscheint sofort → Anfrage abschicken. Die Liste ist Teil der Mail, die dabei entsteht, damit die Anfrage brauchbar ankommt. Die Seitenüberschrift heißt jetzt „Tell us what you want to challenge“.",
        open:"Die zehn Metrikensätze sind ein erster Entwurf aus dem Katalog und nicht bestätigt. Sie entscheiden, ob eine Anfrage verwertbar hereinkommt — bitte einmal durchgehen. Sie stehen alle an einer Stelle: assets/js/site.js, Objekt METRICS.",
        links:[
          {h:"contact.html#rev-contact-metrics", t:"Kontakt · Der dreistufige Ablauf"},
          {h:"contact.html#rev-contact-form", t:"Kontakt · Formular mit Metrikenliste"}
        ]},

      e3: { v:"zweitprodukt",
        done:"Abschnitt „Two ways in — one of them very small“: links „Market benchmark“ als Einstieg, rechts „Dependency & migration ROI analysis“ als benanntes zweites Produkt mit vier Leistungspunkten und eigenem Call-to-Action. Der zweite ist auch als Thema im Kontaktformular wählbar und hat dort eine eigene Metrikenliste.",
        links:[
          {h:"index.html#rev-home-offers", t:"Startseite · Two ways in"},
          {h:"contact.html#rev-contact-form", t:"Kontakt · Thema „Dependency & migration ROI analysis“"}
        ]}
    }
  };

  var BLOCKS = {
    A:{ t:"Block A · Grundsatz", d:"Positionierung — hiervon hängt der Rest ab" },
    B:{ t:"Block B · Beweis", d:"Was belegt, dass es funktioniert" },
    C:{ t:"Block C · Aufbau", d:"Reihenfolge und Gewichtung der Seite" },
    D:{ t:"Block D · Darstellung", d:"Grafik, Umfang, Preis" },
    E:{ t:"Block E · Nachtrag", d:"Aus den drei Nachrichten vom Abend des 24. August" }
  };

  window.FL_DECISIONS = {
    items: DECISIONS,
    blocks: BLOCKS,
    answered: ANSWERED,
    closingId: "__open"
  };
})();
