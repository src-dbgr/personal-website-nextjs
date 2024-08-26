import React from "react";
import Title from "../components/general/Title";
import Layout from "../components/general/Layout";
import Seo from "../components/general/Seo";
import { fetchCookieStaticProps } from '../lib/staticPropsHelpers';

const privacy = ({ cookies }) => { // cookies als Prop hinzufügen
  return (
    <Layout darkFooter={true} cookies={cookies}>
      <Seo title="Privacy Policy | Datenschutz" />
      <section className="legal-page">
        <Title title="Privacy Policy / Datenschutzerklärung" />
        <div className="section-center privacy-policy">
          <div>
            <div className="ce_text privacy_item general_part1 block">
              <h1>Datenschutzerklärung</h1>
              <div className="text">
                <p>
                  Mit dieser Datenschutzerklärung möchten wir Sie über Art,
                  Umfang und Zweck der Verarbeitung von personenbezogenen Daten
                  (im Folgenden auch nur als &quot;Daten&quot; bezeichnet) aufklären.
                  Personenbezogene Daten sind alle Daten, die einen persönlichen
                  Bezug zu Ihnen aufweisen, z. B. Name, Adresse, E-Mail-Adresse
                  oder Ihr Nutzerverhalten. Die Datenschutzerklärung gilt für
                  alle von uns vorgenommene Daten-Verarbeitungsvorgänge sowohl
                  im Rahmen unserer Kerntätigkeit als auch für die von uns
                  vorgehaltenen Online-Medien.
                </p>
              </div>
            </div>
            <div className="ce_text privacy_item contact_responsible block">
              <div className="text">
                <h2>
                  Wer bei uns für die Datenverarbeitung verantwortlich ist
                </h2>
                <p>Verantwortlich für die Datenverarbeitung ist:</p>
              </div>
            </div>
            <div>
              <div className="impressum-name">
                <div className="impressum-name">Sa</div>
                <div className="impressum-name">mu</div>
                <div className="impressum-name">el&nbsp;</div>
                <div className="impressum-name">Bl</div>
                <div className="impressum-name">ehm</div>
              </div>
            </div>
            <div>
              <div className="impressum-name">
                <div className="impressum-name">Kr</div>
                <div className="impressum-name">ai</div>
                <div className="impressum-name">ch</div>
                <div className="impressum-name">gau</div>
                <div className="impressum-name">st</div>
                <div className="impressum-name">ra</div>
                <div className="impressum-name">ß</div>
                <div className="impressum-name">e&nbsp;3</div>
              </div>
            </div>
            <div>
              <div className="impressum-name">
                <div className="impressum-name">691</div>
                <div className="impressum-name">65&nbsp;</div>
                <div className="impressum-name">Wi</div>
                <div className="impressum-name">es</div>
                <div className="impressum-name">lo</div>
                <div className="impressum-name">c</div>
                <div className="impressum-name">h</div>
              </div>
              <div>Deutschland</div>
            </div>
            <div className="impressum-name">
              <div className="impressum-name">+4</div>
              <div className="impressum-name">9</div>
              <div className="impressum-name">&nbsp;</div>
              <div className="impressum-name">151&nbsp;</div>
              <div className="impressum-name">708</div>
              <div className="impressum-name">76</div>
              <div className="impressum-name">6</div>
              <div className="impressum-name">04</div>
            </div>
            <div className="impressum-name">
              <div className="impressum-name">https://</div>
              <div className="impressum-name">de</div>
              <div className="impressum-name">vs</div>
              <div className="impressum-name">am.io/</div>
              <div className="impressum-name">con</div>
              <div className="impressum-name">tact</div>
            </div>
            <div className="impressum-name">
              <div className="impressum-name">m</div>
              <div className="impressum-name">a</div>
              <div className="impressum-name">il</div>
              <div className="impressum-name">@</div>
              <div className="impressum-name">d</div>
              <div className="impressum-name">ev</div>
              <div className="impressum-name">s</div>
              <div className="impressum-name">am</div>
              <div className="impressum-name">.i</div>
              <div className="impressum-name">o</div>
            </div>
            <div className="impressum-name">
              <div className="impressum-name">https://</div>
              <div className="impressum-name">de</div>
              <div className="impressum-name">vs</div>
              <div className="impressum-name">am.</div>
              <div className="impressum-name">io/</div>
              <div className="impressum-name">privacy</div>
            </div>
            <br />
            <div className="ce_text privacy_item general_part3 block">
              <div className="text">
                <h2>Ihre Rechte nach der DSGVO</h2>
                <p>
                  Nach der DSGVO stehen Ihnen die nachfolgend aufgeführten
                  Rechte zu, die Sie jederzeit bei dem in Ziffer 1. dieser
                  Datenschutzerklärung genannten Verantwortlichen geltend machen
                  können:
                </p>
                <ul>
                  <li>
                    <strong>Recht auf Auskunft:</strong> Sie haben das Recht,
                    von uns Auskunft darüber zu verlangen, ob und welche Daten
                    wir von Ihnen verarbeiten.
                  </li>
                  <li>
                    <strong>Recht auf Berichtigung:</strong> Sie haben das
                    Recht, die Berichtigung unrichtiger oder Vervollständigung
                    unvollständiger Daten zu verlangen.
                  </li>
                  <li>
                    <strong>Recht auf Löschung:</strong> Sie haben das Recht,
                    die Löschung Ihrer Daten zu verlangen.
                  </li>
                  <li>
                    <strong>Recht auf Einschränkung:</strong> Sie haben in
                    bestimmten Fällen das Recht zu verlangen, dass wir Ihre
                    Daten nur noch eingeschränkt bearbeiten.
                  </li>
                  <li>
                    <strong>Recht auf Datenübertragbarkeit:</strong> Sie haben
                    das Recht zu verlangen, dass wir Ihnen oder einem anderen
                    Verantwortlichen Ihre Daten in einem strukturierten,
                    gängigen und maschinenlesebaren Format übermitteln.
                  </li>
                  <li>
                    <strong>Beschwerderecht</strong>: Sie haben das Recht, sich
                    bei einer Aufsichtsbehörde zu beschweren. Zuständig ist die
                    Aufsichtsbehörde Ihres üblichen Aufenthaltsortes, Ihres
                    Arbeitsplatzes oder unseres Firmensitzes.
                  </li>
                </ul>
                <h3>Widerrufsrecht</h3>
                <p>
                  Sie haben das Recht, die von Ihnen erteilte Einwilligung zur
                  Datenverarbeitung jederzeit zu widerrufen.
                </p>
                <h3>Widerspruchsrecht</h3>
                <p>
                  Sie haben das Recht, jederzeit gegen die Verarbeitung Ihrer
                  Daten, die wir auf unser berechtigtes Interesse nach Art. 6
                  Abs. 1 lit. f DSGVO stützen, Widerspruch einzulegen. Sofern
                  Sie von Ihrem Widerspruchsrecht Gebrauch machen, bitten wir
                  Sie um die Darlegung der Gründe. Wir werden Ihre
                  personenbezogenen Daten dann nicht mehr verarbeiten, es sei
                  denn, wir können Ihnen gegenüber nachweisen, dass zwingende
                  schutzwürdige Gründe an der Datenverarbeitung Ihre Interessen
                  und Rechte überwiegen.
                </p>
                <p>
                  <span style={{ textDecoration: "underline" }}>
                    <strong>
                      Unabhängig vom vorstehend Gesagten, haben Sie das
                      jederzeitige Recht, der Verarbeitung Ihrer
                      personenbezogenen Daten für Zwecke der Werbung und
                      Datenanalyse zu widersprechen.
                    </strong>
                  </span>
                </p>
                <p>
                  Ihren Widerspruch richten Sie bitte an die oben angegebene
                  Kontaktadresse des Verantwortlichen.
                </p>
                <h2>Wann löschen wir Ihre Daten?</h2>
                <p>
                  Wir löschen Ihre Daten dann, wenn wir diese nicht mehr
                  brauchen oder Sie uns dies vorgeben. Dass bedeutet, dass -
                  sofern sich aus den einzelnen Datenschutzhinweisen dieser
                  Datenschutzerklärung nichts anderes ergibt - wir Ihre Daten
                  löschen,
                </p>
                <ul>
                  <li>
                    wenn der Zweck der Datenverarbeitung weggefallen ist und
                    damit die jeweilige in den einzelnen Datenschutzhinweisen
                    genannte Rechtsgrundlage nicht mehr besteht, also bspw.
                    <ul>
                      <li>
                        nach Beendigung der zwischen uns bestehenden
                        vertraglichen oder mitgliedschaftlichen Beziehungen
                        (Art. 6 Abs. 1 lit. a DSGVO) oder
                      </li>
                      <li>
                        nach Wegfall unseres berechtigten Interesses an der
                        weiteren Verarbeitung oder Speicherung Ihrer Daten (Art.
                        6 Abs. 1 lit. f DSGVO),
                      </li>
                    </ul>
                  </li>
                  <li>
                    wenn Sie von Ihrem Widerrufsrecht Gebrauch machen und keine
                    anderweitige gesetzliche Rechtsgrundlage für die
                    Verarbeitung im Sinne von Art. 6 Abs. 1 lit. b-f DSGVO
                    eingreift,
                  </li>
                  <li>
                    wenn Sie vom Ihrem Widerspruchsrecht Gebrauch machen und der
                    Löschung keine zwingenden schutzwürdigen Gründe
                    entgegenstehen.
                  </li>
                </ul>
                <p>
                  Sofern wir (bestimmte Teile) Ihre(r) Daten jedoch noch für
                  andere Zwecke vorhalten müssen, weil dies etwa steuerliche
                  Aufbewahrungsfristen (in der Regel 6 Jahre für
                  Geschäftskorrespondenz bzw. 10 Jahre für Buchungsbelege) oder
                  die Geltendmachung, Ausübung oder Verteidigung von
                  Rechtsansprüchen aus vertraglichen Beziehungen (bis zu vier
                  Jahren) erforderlich machen oder die Daten zum Schutz der
                  Rechte einer anderen natürlichen oder juristischen Person
                  gebraucht werden, löschen wir (den Teil) Ihre(r) Daten erst
                  nach Ablauf dieser Fristen. Bis zum Ablauf dieser Fristen
                  beschränken wir die Verarbeitung dieser Daten jedoch auf diese
                  Zwecke (Erfüllung der Aufbewahrungspflichten).
                </p>
              </div>
            </div>
            <div className="ce_text block">
              <div className="text">
                <h2>Clouddienste</h2>
                <p>Wir nutzen Clouddienste insbesondere</p>
                <ul>
                  <li>zur Speicherung und Bearbeitung von Dokumenten,</li>
                  <li>
                    zum Versenden von Dokumenten per E-Mail bzw. zum Austausch
                    von Dateien jeglicher Art,
                  </li>
                  <li>für unsere kalendarische Terminverwaltung,</li>
                  <li>
                    zur Vorbereitung und Ausführung von Präsentationen und
                    Tabellenkalkulationen,
                  </li>
                  <li>zur Veröffentlichung von Dateien jeglicher Art,</li>
                  <li>
                    für die interne und externe Kommunikation mittels Chats,
                    Audio- und Videokonferenzen.
                  </li>
                </ul>
                <p>
                  Die Softwareanwendungen, die wir zu diesen Zwecken einsetzen,
                  stellen uns der/die unten genannten Anbieter auf deren Servern
                  zur Verfügung. Auf diese Server greifen wir über das Internet
                  zu. Soweit Sie uns Ihre Daten im Rahmen der Kommunikation mit
                  uns bzw. in anderweitigen von uns mittels dieser
                  Datenschutzerklärung erläuterten Vorgängen übermitteln,
                  verarbeiten wir diese Daten in dem von uns genutzten
                  Clouddienst. Das bedeutet, dass Ihre Daten auf den Servern des
                  Clouddient-Drittanbieters gespeichert werden. Die
                  Drittanbieter verarbeiten zur Sicherung ihrer Server sowie zur
                  Optimierung ihrer Dienstleistungen Nutzungs- und Metadaten.
                  Wir verarbeiten und speichern insbesondere Ihre Kontakt-,
                  Kunden- und Vertragsdaten.
                </p>
                <p>
                  Sollten wir mittels des von uns genutzten Clouddienstes
                  Dateien jeglicher Art öffentlich über unsere Interenetpräsenz
                  zur Verfügung stellen, kann der jeweilige Drittanbieter des
                  Clouddienstes Cookies auf Ihrem Computersystem speichern,
                  sofern Sie auf diese Dateien zugreifen. Der Dienstanbieter
                  kann die so erhobenen Daten verarbeiten, um Ihr
                  Nutzungsverhalten bzw. Ihre Browser-Einstellungen zu
                  analysieren.
                  <br />
                  <br />
                  Wir weisen darauf hin, dass je nach Sitzland des nachstehend
                  genannten Diensteanbieters die nachfolgend näher benannten
                  Daten auf Server außerhalb des Raumes der Europäischen Union
                  übertragen und verarbeitet werden können. Es besteht in diesem
                  Fall das Risiko, dass das von der DSGVO vorgeschriebene
                  Datenschutzniveau nicht eingehalten und die Durchsetzung Ihrer
                  Rechte nicht oder nur erschwert erfolgen kann. Sofern der von
                  uns eingesetzte Diensteanbieter das Verarbeiten der Daten
                  ausschließlich innerhalb der EU anbietet, beabsichtigen wir -
                  sofern derzeit ohnehin nicht bereits umgesetzt - Ihre Daten
                  ausschließlich dort zu verarbeiten.
                </p>
                <p>
                  <strong>Betroffene Daten:</strong>
                </p>
                <ul>
                  <li>Bestandsdaten (bspw. Namen, Adressen),</li>
                  <li>
                    Kontaktdaten (bspw. E-Mail-Adressen, Telefon- und
                    Handynummern)
                  </li>
                  <li>Inhaltsdaten (bspw. Fotos, Videos, Texte),</li>
                  <li>
                    Nutzungsdaten (bspw. Zeiten der Zugriffe, besuchte
                    Internetpräsenzen, Interesse an Inhalten),
                  </li>
                  <li>
                    Metadaten (bspw. IP-Adresse, Computersystem-Informationen)
                  </li>
                </ul>
                <p>
                  <strong>Betroffene Personen:</strong> Interessenten,
                  Kommunikationspartner, Kunden, Beschäftigte (bspw. Bewerber,
                  aktuelle und ehemalige Mitarbeiter)
                </p>
                <p>
                  <strong>Verarbeitungszweck: </strong>Organisation der Büro-
                  und Administrationsaufgaben
                </p>
                <p>
                  <strong>Rechtsgrundlage:</strong> Einwilligung, Art. 6 Abs. 1
                  lit. a DSGVO, Vertragserfüllung und vorvertragliche Anfragen,
                  Art. 6 Abs. 1 lit. b DSGVO, berechtigtes Interesse, Art. 6
                  Abs. 1 lit. f DSGVO
                </p>
                <p>
                  <strong>Eingesetze Cloud-Dienstleister:</strong>
                </p>
              </div>
            </div>
            <div className="ce_text block">
              <div className="text">
                <p>
                  <strong>Google Clouddienste</strong>
                </p>
                <p>
                  Dienstanbieter: Google Ireland Limited, Gordon House, Barrow
                  Street, Dublin 4, Irland
                  <br />
                  Mutterunternehmen: Google LLC, 1600 Amphitheatre Parkway,
                  Mountain View, CA 94043, USA
                  <br />
                  Internetseite:{" "}
                  <a href="https://cloud.google.com/" className="externalLink">
                    https://cloud.google.com/
                  </a>
                  <br />
                  Datenschutzerklärung:{" "}
                  <a
                    href="https://www.google.com/policies/privacy"
                    className="externalLink"
                  >
                    https://www.google.com/policies/privacy
                  </a>
                </p>
              </div>
            </div>
            <div className="ce_text privacy_item general_part2 block">
              <div className="text">
                <h2>Cookies</h2>
                <p>
                  Unsere Internetseite nutzt Cookies. Bei Cookies handelt es
                  sich um kleine Textdateien, bestehend aus einer Reihe von
                  Zahlen und Buchstaben, die auf dem von Ihnen genutzten
                  Endgerät abgelegt und gespeichert werden. Cookies dienen
                  vorrangig dazu, Informationen zwischen dem von Ihnen genutzten
                  Endgerät und unserer Webseite auszutauschen. Hierzu gehören u.
                  a. die Spracheinstellungen auf einer Webseite, der
                  Login-Status oder die Stelle, an der ein Video geschaut wurde.
                </p>
                <p>
                  Beim Besuch unserer Webseiten werden zwei Typen von Cookies
                  eingesetzt:
                </p>
                <ul>
                  <li>
                    <strong>Temporäre Cookies (Session Cookies):</strong> Diese
                    speichern eine sogenannte Session-ID, mit welcher sich
                    verschiedene Anfragen Ihres Browsers der gemeinsamen Sitzung
                    zuordnen lassen. Die Session-Cookies werden gelöscht, wenn
                    Sie sich ausloggen oder Ihren Browser schließen.
                  </li>
                  <li>
                    <strong>Permanente Cookies: </strong>Permanente Cookies
                    bleiben auch nach dem Schließen des Browsers gespeichert.
                    Dadurch erkennt unsere Webseite Ihren Rechner wieder, wenn
                    Sie auf unsere Webseite zurückkehren. In diesen Cookies
                    werden beispielsweise Informationen zu Spracheinstellungen
                    oder Log-In-Informationen gespeichert. Außerdem kann mit
                    diesen Cookies Ihr Surfverhalten dokumentiert und
                    gespeichert werden. Diese Daten können zu Statistik-,
                    Marketing- und Personalisierungs-Zwecken verwendet werden.
                  </li>
                </ul>
                <p>
                  Neben der vorstehenden Einteilung können Cookies auch im
                  Hinblick auf ihren Einsatzzweck unterschieden werden:
                </p>
                <ul>
                  <li>
                    <strong>Notwendige Cookies:</strong> Dies sind Cookies, die
                    für den Betrieb unserer Webseite unbedingt erforderlich
                    sind, um Logins oder Warenkörbe für die Dauer Ihrer Sitzung
                    zu speichern oder Cookies, die aus Sicherheitsgründen
                    gesetzt werden.
                  </li>
                  <li>
                    <strong>
                      Statistik-, Marketing- und Personalisierungs-Cookies:
                    </strong>{" "}
                    Dies sind Cookies, die für Analysezwecke oder die
                    Reichweitenmessung eingesetzt werden. Über solche
                    &quot;Tracking&quot;-Cookies können insbesondere Informationen zu
                    eingegebenen Suchbegriffen oder die Häufigkeit von
                    Seitenaufrufen gespeichert sein. Daneben kann aber auch das
                    Surfverhalten eines einzelnen Nutzers (z. B. Betrachten
                    bestimmter Inhalte, Nutzen von Funktionen etc.) in einem
                    Nutzerprofil gespeichert werden. Solche Profile werden
                    genutzt, um Nutzern Inhalte anzuzeigen, die deren
                    potentiellen Interessen entsprechen. Soweit wir Dienste
                    nutzen, über die Cookies zu Statistik-, Marketing- und
                    Personalisierungs-Zwecken auf Ihrem Endgerät gespeichert
                    werden, informieren wir Sie hierzu gesondert in den
                    nachfolgenden Abschnitten unserer Datenschutzerklärung oder
                    im Rahmen der Einholung Ihrer Einwilligung.
                  </li>
                </ul>
                <p>
                  <strong>Betroffene Daten:</strong>
                </p>
                <ul>
                  <li>
                    Nutzungsdaten (bspw. Zugriffszeiten, angeklickte Webseiten)
                  </li>
                  <li>
                    Kommunikationsdaten (bspw. Informationen über das genutzte
                    Gerät, IP-Adresse).
                  </li>
                </ul>
                <p>
                  <strong>Betroffene Personen: </strong>Nutzer unserer
                  Onlineangebote
                </p>
                <p>
                  <strong>Verarbeitungszweck: </strong>Ausspielen unserer
                  Internetseiten, Gewährleistung des Betriebs unserer
                  Internetseiten, Verbesserung unseres Internetangebotes,
                  Kommunikation und Marketig
                </p>
                <p>
                  <strong>
                    Rechtsgrundlage:
                    <br />
                    Berechtigtes Interesse, Art. 6 Abs. 1 lit. f DSGVO
                  </strong>
                  <br />
                  Sofern wir von Ihnen keine Einwilligung in das Setzen der
                  Cookies einholen, stützen wir die Verarbeitung Ihrer Daten auf
                  unser berechtigtes Interesse, die Qualität und
                  Benutzerfreundlichkeit unseres Internetauftritts, insbesondere
                  der Inhalte und Funktionen zu verbessern. Sie haben über die
                  Sicherheitseinstellungen Ihres Browsers, dem Einsatz der von
                  uns im Rahmen unseres berechtigten Interesses gesetzten
                  Cookies zu widersprechen. Dort haben Sie die Möglichkeit
                  festzulegen, ob Sie etwa von vornherein keine oder nur auf
                  Nachfrage Cookies akzeptieren oder aber festlegen, dass
                  Cookies nach jedem Schließen Ihres Browsers gelöscht werden.
                  Werden Cookies für unsere Webseite deaktiviert, können
                  möglicherweise nicht mehr alle Funktionen der Webseite
                  vollumfänglich genutzt werden.
                </p>
              </div>
            </div>
            <div className="ce_text block">
              <div className="text">
                <p>
                  <strong>Einwilligung, Art. 6 Abs. 1 lit. a DSGVO</strong>
                  <br />
                  Sofern wir Sie vor Ihrem Besuch unserer Internetpräsenz darum
                  bitten, bestimmte Cookies auf Ihr Endgerät setzen zu dürfen,
                  und Sie hierein einwilligen, ist in der von Ihnen erteilten
                  Einwilligung die Rechtsgrundlage zu sehen. Wir informieren Sie
                  im Rahmen der Einwilligung darüber, welche Cookies wir im
                  Einzelnen setzen. Sofern Sie diese Einwilligung nicht
                  erteilen, setzen sich lediglich die sogenannten technisch
                  notwendigen Cookies, die für den ordnungsgemäßen Betrieb
                  unserer Internetseiten sowie deren Darstellung in Ihrem
                  Browser erforderlich sind. Sofern Sie in das Setzen von
                  Cookies eingewilligt haben, haben die jederzeitige
                  Möglichkeit, uns gegenüber der erteilten Einwilligung zu
                  widerrufen.
                </p>
              </div>
            </div>
            <div className="ce_text privacy_item external_hosting block">
              <div className="text">
                <h2>Webhosting</h2>
                <p>
                  Wir bedienen uns zum Vorhalten unserer Internetseiten eines
                  Anbieters, auf dessen Server unsere Internetseiten gespeichert
                  und für den Abruf im Internet verfügbar gemacht werden
                  (Hosting). Hierbei können von dem Anbieter all diejenigen über
                  den von Ihnen genutzten Browser übertragenen Daten verarbeitet
                  werden, die bei der Nutzung unserer Internetseiten anfallen.
                  Hierzu gehören insbesondere Ihre IP-Adresse, die der Anbieter
                  benötigt, um unser Online-Angebot an den von Ihnen genutzten
                  Browser ausliefern zu können sowie sämtliche von Ihnen über
                  unsere Internetseite getätigten Eingaben. Daneben kann der von
                  uns genutzte Anbieter&nbsp;&nbsp;
                </p>
                <ul>
                  <li>
                    das Datum und die Uhrzeit des Zugriffs auf unsere
                    Internetseite
                  </li>
                  <li>Zeitzonendifferenz zur Greenwich Mean Time (GMT)</li>
                  <li>Zugriffsstatus (HTTP-Status)</li>
                  <li>die übertragene Datenmenge</li>
                  <li>
                    der Internet-Service-Provider des zugreifenden Systems
                  </li>
                  <li>
                    der von Ihnen verwendete Browsertyp und dessen Version
                  </li>
                  <li>das von Ihnen verwendete Betriebssystem</li>
                  <li>
                    die Internetseite, von welcher Sie gegebenenfalls auf unsere
                    Internetseite gelangt sind
                  </li>
                  <li>
                    die Seiten bzw. Unterseiten, welche Sie auf unserer
                    Internetseite besuchen.
                  </li>
                </ul>
                <p>
                  erheben. Die vorgenannten Daten werden als Logfiles auf den
                  Servern unseres Anbieters gespeichert. Dies ist erforderlich,
                  um die Stabilität und Sicherheit des Betriebs unserer
                  Internetseite zu gewährleisten.
                </p>
                <p className="invisible">&nbsp;</p>
                <p>
                  <strong>Betroffene Daten:</strong>
                </p>
                <ul>
                  <li>Inhaltsdaten (bspw. Posts, Fotos, Videos)</li>
                  <li>
                    Nutzungsdaten (bspw. Zugriffszeiten, angeklickte Webseiten)
                  </li>
                  <li>
                    Kommunikationsdaten (bspw. Informationen über das genutzte
                    Gerät, IP-Adresse)
                  </li>
                </ul>
                <p>
                  <strong>Betroffene Personen: </strong>Nutzer unserer
                  Internetpräsenz
                </p>
                <p>
                  <strong>Verarbeitungszweck: </strong>Ausspielen unserer
                  Internetseiten, Gewährleistung des Betriebs unserer
                  Internetseiten
                </p>
                <p>
                  <strong>Rechtsgrundlage:</strong> Berechtigtes Interesse, Art.
                  6 Abs. 1 lit. f DSGVO
                </p>
                <p>
                  <strong>Von uns beauftragte(r) Webhoster:</strong>
                </p>
              </div>
            </div>
            <div className="ce_text block">
              <div className="text">
                <p>
                  <strong>Netlify</strong>
                </p>
                <p>
                  Dienstanbieter: Netlify
                  <br />
                  Adresse: 2325 3rd Street, Suite 296, San Francisco, California
                  94107
                  <br />
                  Internetseite:{" "}
                  <a
                    href="https://www.netlify.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="externalLink"
                  >
                    https://www.netlify.com/
                  </a>
                  <br />
                  Datenschutzerklärung:{" "}
                  <a
                    href="https://www.netlify.com/privacy/"
                    target="_blank"
                    rel="noreferrer"
                    className="externalLink"
                  >
                    https://www.netlify.com/privacy/
                  </a>
                </p>
              </div>
            </div>
            <div className="ce_text block">
              <div className="text">
                <h2>Kontaktaufnahme</h2>
                <p>
                  Soweit Sie uns über E-Mail, Soziale Medien, Telefon, Fax,
                  Post, unser Kontaktformular oder sonstwie ansprechen und uns
                  hierbei personenbezogene Daten wie Ihren Namen, Ihre
                  Telefonnummer oder Ihre E-Mail-Adresse zur Verfügung stellen
                  oder weitere Angaben zur Ihrer Person oder Ihrem Anliegen
                  machen, verarbeiten wir diese Daten zur Beantwortung Ihrer
                  Anfrage im Rahmen des zwischen uns bestehenden
                  vorvertraglichen oder vertraglichen Beziehungen.
                </p>
                <p>
                  <strong>Betroffene Daten:</strong>
                </p>
                <ul>
                  <li>Bestandsdaten (bspw. Namen, Adressen)</li>
                  <li>
                    Kontakdaten (bspw. E-Mail-Adresse, Telefonnummer,
                    Postanschrift)
                  </li>
                  <li>Inhaltsdaten (Texte, Fotos, Videos)</li>
                  <li>
                    Vertragsdaten (bspw. Vertragsgegenstand, Vertragsdauer)
                  </li>
                </ul>
                <p>
                  <strong>Betroffene Personen: </strong>Interessenten, Kunden,
                  Geschäfts- und Vertragspartner
                </p>
                <p>
                  <strong>Verarbeitungszweck: </strong>Kommunikation sowie
                  Beantwortung von Kontaktanfragen, Büro und
                  Organisationsverfahren
                </p>
                <p>
                  <strong>Rechtsgrundlage:</strong> Vertragserfüllung und
                  vorvertragliche Anfragen, Art. 6 Abs. 1 lit. b DSGVO,
                  berechtigtes Interesse, Art. 6 Abs. 1 lit. f DSGVO
                </p>
              </div>
            </div>
            <h3>Angaben zu dem von uns genutzten Drittanbieter:</h3>
            <div className="ce_text block">
              <div className="text">
                <h2>Webanalyse und Statistik</h2>
                <p>
                  Um die Besucherströme auf unserer Internetpräsenz zu erfassen
                  und statistisch auszuwerten, setzen wir Webanalyse-Dienste
                  ein. Solche Dienste erfassen unter anderem Daten darüber, von
                  welcher Internetseite Sie auf unsere Internetpräsenz gelangt
                  sind (sogenannte Referrer), auf welche Seiten unserer
                  Internetpräsenz Sie zugegriffen haben, wie lange Sie unsere
                  Seiten besucht und welche Interaktionen Sie dort vorgenommen
                  haben. Daneben werden Daten zu dem von Ihnen verwendeten
                  Browser, Computersystem sowie der Geräteart erhoben. Außerdem
                  können über einen solchen Dienst auch demographische
                  Informationen, wie bspw. das Alter oder das Geschlecht als
                  pseudonyme Werte erfasst werden. Sofern Sie in die Erhebung
                  Ihrer Standortdaten eingewilligt haben, können, je nach
                  Anbieter, auch diese verarbeitet werden.
                </p>
                <p>
                  Um diese Daten zu erfassen und zu speichern, setzt der von uns
                  verwendete Webanalyse-Dienst in der Regel einen Cookie auf das
                  von Ihnen genutzte Endgerät, mit dem auch die Ihnen
                  zugeordnete IP-Adresse erhoben wird. Allerdings wird diese
                  über ein sogenanntes IP-Masking-Verfahren gekürzt, so dass die
                  IP-Adresse nicht mehr Ihrem Besuch auf unserer Internetseite
                  zugeordnet werden kann. Auch im Übrigen werden keine Klardaten
                  wie Namen oder E-Mail-Adressen gespeichert. Weder wir noch der
                  von uns eingesetzte Dienst kennt die Identität der Besucher
                  unserer Internetseiten.
                </p>
                <p>
                  Wir möchten Sie darauf hinweisen, dass je nach Sitzland des
                  unten genannten Diensteanbieters die über den Dienst erfassten
                  Daten außerhalb des Raumes der Europäischen Union übertragen
                  und verarbeitet werden können. Es besteht in diesem Fall das
                  Risiko, dass das von der DSGVO vorgeschriebene
                  Datenschutzniveau nicht eingehalten und die Durchsetzung Ihrer
                  Rechte nicht oder nur erschwert erfolgen kann.
                </p>
                <p>
                  <strong>Betroffene Daten:</strong>
                </p>
                <ul>
                  <li>
                    Nutzungsdaten (bspw. Zugriffszeiten, angeklickte Webseiten)
                  </li>
                  <li>
                    Kommunikationsdaten (bspw. Informationen über das genutzte
                    Gerät, IP-Adresse).
                  </li>
                </ul>
                <p>
                  <strong>Betroffene Personen: </strong>Nutzer unserer
                  Onlineangebote
                </p>
                <p>
                  <strong>Verarbeitungszweck: </strong>Reichweitenmessung,
                  Erfolgskontrolle von Kampagnen, Remarketing sowie interessen-
                  und verhaltensbedingtes Marketing
                </p>
                <p>
                  <strong>Rechtsgrundlage:</strong> Sofern wir Sie vor dem
                  Einsatz des jeweiligen Dienstes um Ihre Einwilligung gebeten
                  haben, liegt hierin die Rechtsgrundlage, Art. 6 Abs. 1 lit. a
                  DSGVO. Im Übrigen setzen wir den jeweiligen Dienst auf Grund
                  unseres berechtigten Interesse ein, die Besucherströme unserer
                  Internetseiten analysieren, um hierüber die Funktionen,
                  Angebote sowie das Nutzungserlebnis fortlaufend verbessern zu
                  können, Art. 6 Abs. 1 lit. f DSGVO.
                </p>
                <p>
                  <strong>Wir nutzen folgende Webanalyse-Dienste:</strong>
                </p>
              </div>
            </div>
            {/* <div className="ce_text privacy_item adobeanalytics block">
              <div className="text">
                <p>
                  <strong>Adobe Analytics (Omniture)</strong>
                </p>
                <p>
                  Dienstanbieter: Adobe Systems Software, 345 Park Avenue San
                  Jose, CA 95110-2704, USA
                  <br />
                  Sitz in Europa: Adobe Systems Software Ireland Companies, 4-6
                  Riverwalk, Citywest Business Campus, Dublin 24, Irland.
                  <br />
                  Internetseite:{" "}
                  <a
                    href="https://www.adobe.com/de/analytics/adobe-analytics.html"
                    className="externalLink"
                  >
                    https://www.adobe.com/de/analytics/adobe-analytics.html
                  </a>
                  <br />
                  Datenschutzerklärung:{" "}
                  <a
                    href="https://www.adobe.com/de/privacy.html"
                    target="_blank"
                    rel="noreferrer"
                    className="externalLink"
                  >
                    https://www.adobe.com/de/privacy.html
                  </a>
                  <br />
                  <strong>Opt-Out-Möglichkeit</strong>:{" "}
                  <a
                    href="https://www.adobe.com/privacy/marketing.html#online-advertising"
                    className="externalLink"
                  >
                    https://www.adobe.com/privacy/marketing.html#online-advertising
                  </a>
                </p>
              </div>
            </div> */}
            <div className="ce_text privacy_item googleanalytics block">
              <div className="text">
                <p>
                  <strong>Google Analytics</strong>
                </p>
                <p>
                  Dienstanbieter: Google Inc., 1600 Amphitheatre Parkway,
                  Mountain View, CA 94043, USA
                  <br />
                  Sitz innerhalb der EU: Google Dublin, Google Ireland Ltd.,
                  Gordon House, Barrow Street, Dublin 4, Ireland
                  <br />
                  Internetseite:{" "}
                  <a
                    href="https://marketingplatform.google.com/intl/de/about/analytics/"
                    target="_blank"
                    rel="noreferrer"
                    className="externalLink"
                  >
                    https://marketingplatform.google.com/intl/de/about/analytics/
                  </a>
                  <br />
                  Datenschutzerklärung:{" "}
                  <a
                    href="https://policies.google.com/privacy?hl=de"
                    className="externalLink"
                  >
                    https://policies.google.com/privacy?hl=de
                  </a>
                  <br />
                  <strong>Opt-Out-Möglichkeit</strong>: Wenn Sie nicht möchten,
                  dass Ihre Daten von Google Analytics verwendet werden. können
                  Sie ein sog. Opt-Out Plugin setzen, welches zukünftig
                  verhindert, dass Daten von Ihnen auf unserer Webseite erfasst
                  werden. Dieses Plugin erhalten Sie hier:{" "}
                  <a
                    href="https://tools.google.com/dlpage/gaoptout?hl=de"
                    className="externalLink"
                  >
                    https://tools.google.com/dlpage/gaoptout?hl=de
                  </a>
                </p>
              </div>
            </div>
            <div className="ce_text privacy_item googleanalytics block">
              <div className="text">
                <p>
                  <strong>Google Universal Analytics</strong>
                </p>
                <p>
                  Dienstanbieter: Google Inc., 1600 Amphitheatre Parkway,
                  Mountain View, CA 94043, USA
                  <br />
                  Sitz innerhalb der EU: Google Dublin, Google Ireland Ltd.,
                  Gordon House, Barrow Street, Dublin 4, Ireland
                  <br />
                  Internetseite:{" "}
                  <a
                    href="https://marketingplatform.google.com/intl/de/about/analytics/"
                    target="_blank"
                    rel="noreferrer"
                    className="externalLink"
                  >
                    https://marketingplatform.google.com/intl/de/about/analytics/
                  </a>
                  <br />
                  Datenschutzerklärung:{" "}
                  <a
                    href="https://policies.google.com/privacy?hl=de"
                    className="externalLink"
                  >
                    https://policies.google.com/privacy?hl=de
                  </a>
                  <br />
                  <strong>Cross-Device-Tracking: </strong>Beim
                  Cross-Device-Tracking können mit Hilfe einer User-ID nicht nur
                  die Daten von den von Ihnen besuchten Internetseiten, sondern
                  auch Daten von anderen Geräten ausgewertet und der Nutzer auf
                  dem anderen Gerät wiedererkannt werden. Die User-ID wird von
                  uns vergeben. Sie dient dabei als Pseudonym. Eine
                  Identifizierung des Internetnutzers ist hierbei
                  ausgeschlossen.
                  <br />
                  <strong>Opt-Out-Möglichkeit:</strong> Wenn Sie nicht möchten,
                  dass Ihre Daten von Google Analytics verwendet werden. können
                  Sie ein sog. Opt-Out Plugin setzen, welches zukünftig
                  verhindert, dass Daten von Ihnen auf unserer Webseite erfasst
                  werden. Dieses Plugin erhalten Sie hier:{" "}
                  <a
                    href="https://tools.google.com/dlpage/gaoptout?hl=de"
                    className="externalLink"
                  >
                    https://tools.google.com/dlpage/gaoptout?hl=de
                  </a>
                </p>
              </div>
            </div>
            <div className="ce_text block">
              <div className="text">
                <h2>Die von uns genutzten Plugins von Drittanbietern</h2>
                <p />
                <p>
                  Wir haben auf unserer Webseite Plugins in Form von.
                  „Social-Media-Buttons“ der von uns genutzten Anbieter
                  eingebettet. Welches Plugin zu welchem Anbieter gehört, können
                  Sie an dem jeweiligen Logo erkennen, mit welchem das Plugin
                  gekennzeichnet ist. Wir haben die Social Media Plugins auf
                  unserem Internetauftritt standardmäßig deaktiviert, sodass
                  beim Aufruf unserer Seiten nicht automatisch Daten an den
                  Anbieter des Plugins übertragen werden. Hierzu verwenden wir
                  die sogenannte 2-Klick-Lösung. Wenn Sie ein Plugin nutzen
                  möchten, haben Sie die Möglichkeit dieses durch einen Klick
                  auf die entsprechende Schaltfläche zu aktivieren. Erst
                  hierdurch wird das Plugin nachgeladen und die Erfassung von
                  Informationen und deren Übertragung an den Anbieter ausgelöst.
                  In diesem Fall können auch dann, wenn Sie bei dem jeweiligen
                  sozialen Netzwerk kein Konto besitzen oder dann, wenn Sie dort
                  ein Konto besitzen aber dort nicht eingeloggt sind, Daten
                  durch das aktive Social Media Plugin an den dazugehörigen
                  Anbieter gesendet werden.
                </p>
                <p />
                <p>
                  Wir weisen darauf hin, dass je nach Sitzland des nachstehend
                  genannten Diensteanbieters die nachfolgend näher benannten
                  Daten auf Server außerhalb des Raumes der Europäischen Union
                  übertragen und verarbeitet werden können. Es besteht in diesem
                  Fall das Risiko, dass das von der DSGVO vorgeschriebene
                  Datenschutzniveau nicht eingehalten und die Durchsetzung Ihrer
                  Rechte nicht oder nur erschwert erfolgen kann.
                </p>
                <p>
                  <strong>Betroffene Daten:</strong>
                </p>
                <ul>
                  <li>
                    Nutzungsdaten (bspw. Zugriffszeiten, angeklickte Webseiten)
                  </li>
                  <li>
                    Kommunikationsdaten (bspw. Informationen über das genutzte
                    Gerät, IP-Adresse)
                  </li>
                </ul>
                <p>
                  <strong>Betroffene Personen: </strong>Nutzer unserer
                  Internetpräsenz
                </p>
                <p>
                  <strong>Verarbeitungszweck: </strong>Ausspielen unserer
                  Internetseiten, Anbieten von Inhalten, Gewährleistung des
                  Betriebs unserer Internetseiten
                </p>
                <p>
                  <strong>Rechtsgrundlage:</strong> Einwilligung über
                  Cookie-Consent-Banner, Art. 6 Abs. 1 lit. a DSGVO, berechtigte
                  Interessen, Art. 6 Abs. 1 lit. f DSGVO
                </p>
                <p>
                  <strong>Wir nutzen folgende Plugins:</strong>
                </p>
              </div>
            </div>
            <div className="ce_text privacy_item recaptcha block">
              <div className="text">
                <p>
                  <strong>Google (Invisible) reCAPTCHA</strong>
                </p>
                <p>
                  Dienstanbieter: Google Inc., 1600 Amphitheatre Parkway,
                  Mountain View, CA 94043, USA
                  <br />
                  Internetseite:{" "}
                  <a
                    href="https://developers.google.com/recaptcha/docs/invisible"
                    className="externalLink"
                  >
                    https://developers.google.com/recaptcha/docs/invisible
                  </a>
                  <br />
                  Datenschutzerklärung:{" "}
                  <a
                    href="https://www.google.de/intl/de/policies/privacy"
                    className="externalLink"
                  >
                    http://www.google.de/intl/de/policies/privacy
                  </a>
                </p>
              </div>
            </div>
            <div className="ce_text block">
              <div className="text">
                <h2>Unsere Onlinepräsenzen bei sozialen Netzwerken</h2>
                <p>
                  Wir betreiben Onlinepräsenzen innerhalb der nachfolgend
                  aufgelisteten sozialen Netzwerke. Besuchen Sie eine dieser
                  Präsenzen, werden durch den jeweiligen Anbieter die unten
                  näher aufgeführten Daten erhoben und verarbeitet. In der Regel
                  werden diese Daten zur Werbe- und Marktforschungszwecke
                  erhoben und hiermit Nutzungsprofile angelegt. In den
                  Nutzungsprofilen können Daten unabhängig des von Ihnen
                  verwendeten Gerätes gespeichert werden. Dies ist insbesondere
                  dann der Fall, wenn Sie Mitglied der jeweiligen Plattform und
                  bei dieser eingeloggt sind. Die Nutzungsprofile können von den
                  Anbietern dazu verwendet werden, um Ihnen interessenbezogene
                  Werbung auszuspielen. Gegen die Erstellung von Nutzerprofilen
                  steht Ihnen ein Widerrufsrecht zu. Um dieses auszuüben, müssen
                  Sie sich an den jeweiligen Anbieter wenden.
                </p>
                <p>
                  Wenn Sie einen Account bei einem der unten aufgeführten
                  Anbieter besitzen und beim Besuch unserer Webseite dort
                  eingeloggt sind, kann der jeweilige Anbieter Daten über Ihr
                  Nutzungsverhalten auf unserer Webseite erheben. Um eine solche
                  Verknüpfung Ihrer Daten zu verhindern, können Sie sich vor dem
                  Besuch unserer Seite bei dem Dienst des Anbieters ausloggen.
                </p>
                <p>
                  Zu welchem Zweck und in welchem Umfang Daten von dem Anbieter
                  erhoben werden, können Sie den jeweiligen, im Folgenden
                  mitgeteilten, Datenschutzerklärungen der Anbieter entnehmen.
                </p>
                <p>
                  Wir möchten Sie darauf hinweisen, dass je nach Sitzland des
                  unten genannten Anbieters die über dessen Plattform erfassten
                  Daten außerhalb des Raumes der Europäischen Union übertragen
                  und verarbeitet werden können. Es besteht in diesem Fall das
                  Risiko, dass das von der DSGVO vorgeschriebene
                  Datenschutzniveau nicht eingehalten und die Durchsetzung Ihrer
                  Rechte nicht oder nur erschwert erfolgen kann.
                </p>
                <p>
                  <strong>Betroffene Daten:</strong>
                </p>
                <ul>
                  <li>
                    Bestands- und Kontaktdaten (bspw. Name, Adresse,
                    Telefonnummer, E-Mail-Adresse)
                  </li>
                  <li>Inhaltsdaten (bspw. Posts, Fotos, Videos)</li>
                  <li>
                    Nutzungsdaten (bspw. Zugriffszeiten, angeklickte Webseiten)
                  </li>
                  <li>
                    Kommunikationsdaten (bspw. Informationen über das genutzte
                    Gerät, IP-Adresse).
                  </li>
                </ul>
                <p>
                  <strong>Verarbeitungszweck: </strong>Kommunikation und
                  Marketing, Verfolgen und Anaylse von Nutzerverhalten
                </p>
                <p>
                  <strong>Rechtsgrundlage:</strong> Einwilligung, Art. 6 Abs. 1
                  lit. a DSGVO, berechtigtes Interessen Art. 6 Abs. 1 lit. f
                  DSGVO
                </p>
                <p>
                  <strong>Widerspruchsmöglichkeiten: </strong>Zu den jeweiligen
                  Widerspruchsmöglichkeiten (Opt-Out) verweisen wir auf die
                  nachfolgend verlinkten Angaben der Anbieter.
                </p>
                <p>
                  <strong>
                    Wir unterhalten Onlinepräsenzen auf folgenden sozialen
                    Netzwerken:
                  </strong>
                </p>
              </div>
            </div>
            <div className="ce_text privacy_item sp_linkedin block">
              <div className="text">
                <p>
                  <strong>LinkedIn</strong>
                </p>
                <p>
                  Dienstanbieter: LinkedIn Corporation, 1000 W Maude, Sunnyvale,
                  CA 94085, USA
                  <br />
                  Sitz in Deutschland: LinkedIn, Hofstatt 4th Floor, Sendlinger
                  Str. 12, 80331 München
                  <br />
                  Internetseite:{" "}
                  <a
                    href="https://www.linkedin.com/?trk=nav_logo"
                    className="externalLink"
                  >
                    https://www.linkedin.com/?trk=nav_logo
                  </a>
                  <br />
                  Datenschutzerklärung:{" "}
                  <a
                    href="https://www.linkedin.com/legal/privacy-policy?trk=uno-reg-guest-home-privacy-policy"
                    className="externalLink"
                  >
                    https://www.linkedin.com/legal/privacy-policy?trk=uno-reg-guest-home-privacy-policy
                  </a>
                </p>
              </div>
            </div>
            <div className="ce_text privacy_item sp_twitter block">
              <div className="text">
                <p>
                  <strong>X (ehemals Twitter)</strong>
                </p>
                <p>
                  Dienstanbieter: X Corp., 1355 Market Street, Suite 900, San Francisco, CA 94103, USA
                  <br />
                  Internetseite:{" "}
                  <a
                    href="https://x.com/"
                    className="externalLink"
                  >
                    https://x.com/
                  </a>
                  <br />
                  Datenschutzerklärung:{" "}
                  <a
                    href="https://x.com/de/privacy"
                    className="externalLink"
                  >
                    https://x.com/de/privacy
                  </a>
                </p>
              </div>
            </div>
            <div className="ce_text block">
              <div className="text">
                <h2>Content-Dienste</h2>
                <p>
                  Wir nutzen bestimmte Dienste, um über unsere Internetpräsenz
                  bestimmte Inhalte oder Grafiken (Videos, Bilder, Musik,
                  Schriftarten, Kartenmaterial) ausspielen zu können. Dabei
                  verarbeiten die von uns eingesetzten Dienste die Ihnen zum
                  Zeitpunkt Ihres Besuchs auf unseren Internetseiten zugeordnete
                  IP-Adresse, da nur so der jeweilige Inhalt in dem von Ihnen
                  verwendeten Browser dargestellt werden kann. Darüber hinaus
                  können die Anbieter dieser Dienste weitere Cookies auf Ihr
                  Endgerät setzen, über die Informationen über Ihr
                  Nutzungsverhalten, Ihre Interessen, das von Ihnen verwendete
                  Gerät und den verwendeten Browser sowie Zeitpunkt und Dauer
                  Ihrer Sitzung erhoben werden. Diese Daten verwenden die
                  Anbieter regelmäßig für Analyse-, Statistik- und
                  Marketingzwecke. Zudem können diese Informationen können auch
                  mit Informationen aus anderen Quellen verbunden werden. Dies
                  gilt insbesondere dann, wenn Sie selbst einen Account bei dem
                  Dienstanbieter unterhalten und zum Zeitpunkt der Sitzung dort
                  eingeloggt sind.
                </p>
                <p>
                  Wir weisen darauf hin, dass je nach Sitzland des nachstehend
                  genannten Diensteanbieters die nachfolgend näher benannten
                  Daten auf Server außerhalb des Raumes der Europäischen Union
                  übertragen und verarbeitet werden können. Es besteht in diesem
                  Fall das Risiko, dass das von der DSGVO vorgeschriebene
                  Datenschutzniveau nicht eingehalten und die Durchsetzung Ihrer
                  Rechte nicht oder nur erschwert erfolgen kann.
                </p>
                <p>
                  <strong>Betroffene Daten:</strong>
                </p>
                <ul>
                  <li>
                    Nutzungsdaten (bspw. Zugriffszeiten, angeklickte Webseiten)
                  </li>
                  <li>
                    Kommunikationsdaten (bspw. Informationen über das genutzte
                    Gerät, IP-Adresse)
                  </li>
                </ul>
                <p>
                  <strong>Betroffene Personen: </strong>Nutzer unserer
                  Internetpräsenz
                </p>
                <p>
                  <strong>Verarbeitungszweck: </strong>Ausspielen unserer
                  Internetseiten, Anbieten von Inhalten, Gewährleistung des
                  Betriebs unserer Internetseiten
                </p>
                <p>
                  <strong>Rechtsgrundlage:</strong> Einwilligung über
                  Cookie-Consent-Banner, Art. 6 Abs. 1 lit. a DSGVO, berechtigte
                  Interessen, Art. 6 Abs. 1 lit. f DSGVO
                </p>
                <p>
                  <strong>Wir nutzen folgende Content-Dienste:</strong>
                </p>
              </div>
            </div>
            {/* <div className="ce_text privacy_item googlemaps block">
              <div className="text">
                <p>
                  <strong>Google Maps</strong>
                </p>
                <p>
                  Wir nutzen auf unserer Internetpräsenz Google Maps. Hierbei
                  wird durch Google die IP-Adresse des Besuchers erhoben und
                  verarbeitet. Wenn Sie eine Internetseite besuchen, auf der
                  Google Maps eingebunden ist, wird unabhängig davon, ob die
                  Nutzung von Google Maps tatsächlich erfolgt oder Sie in Ihrem
                  Google Account eingeloggt sind Ihre IP-Adresse sowie Ihre
                  Standortdaten (letztere in der Regel nicht ohne Ihre
                  Einwilligung) an Google übermittelt. Ihre IP-Adresse wird
                  Ihrem Google Account zugeordnet, sofern Sie bei dem Besuch
                  unserer Internetpräsenz dort eingeloggt sind.
                </p>
                <p>
                  Dienstanbieter: Google Inc., 1600 Amphitheatre Parkway,
                  Mountain View, CA 94043, USA
                  <br />
                  Sitz in der EU: Google Ireland Limited, Gordon House, Barrow
                  Street, Dublin 4, Irland
                  <br />
                  Internetseite:{" "}
                  <a href="https://www.google.de/maps" className="externalLink">
                    https://www.google.de/maps
                  </a>
                  <br />
                  Datenschutzerklärung:{" "}
                  <a
                    href="https://policies.google.com/privacy"
                    className="externalLink"
                  >
                    https://policies.google.com/privacy
                  </a>
                  <br />
                  <strong>Opt-Out-Möglichkeit:</strong>{" "}
                  <a
                    href="https://tools.google.com/dlpage/gaoptout?hl=de"
                    target="_blank"
                    rel="noreferrer"
                    className="externalLink"
                  >
                    https://tools.google.com/dlpage/gaoptout?hl=de
                  </a>
                </p>
              </div>
            </div> */}
            <div className="ce_text privacy_item google_webfonts block">
              <div className="text">
                <p>
                  <strong>Google Web Fonts</strong>
                </p>
                <p>
                  Mit Google Web Fonts können wir Schriftarten (Web Fonts) in
                  das Design unserer Webseite einbinden und diese bei der
                  Darstellung unserer Internetseiten in Ihrem Browser korrekt
                  ausgeben. Die Einbindung dieser Web Fonts erfolgt durch einen
                  Serveraufruf bei Google. Von dort aus werden die Schriftarten
                  komprimiert an Ihren Browser weitergegeben und dort entpackt.
                  Regelmäßig befindet sich dieser Server in den USA. Besuchen
                  Sie eine unserer Seiten auf denen wir Google Fonts einbinden,
                  wird an Google übermittelt, welche unserer Internetseiten Sie
                  besucht haben.
                </p>
                <p>
                  Dienstanbieter: Google Inc., 1600 Amphitheatre Parkway,
                  Mountain View, CA 94043, USA
                  <br />
                  Sitz in der EU: Google Ireland Limited, Gordon House, Barrow
                  Street, Dublin 4, Irland
                  <br />
                  Internetseite:{" "}
                  <a href="https://fonts.google.com/" className="externalLink">
                    https://fonts.google.com/
                  </a>
                  <br />
                  Datenschutzerklärung:{" "}
                  <a
                    href="https://policies.google.com/privacy"
                    className="externalLink"
                  >
                    https://policies.google.com/privacy
                  </a>
                </p>
              </div>
            </div>
            <div className="ce_text block">
              <div className="text">
                <p>
                  <strong>Soundcloud</strong>
                </p>
                <p>
                  Wir nutzen auf dieser Webseite Soundcloud. Soundcloud ist ein
                  Online-Musikdienst, auf dem wir unsere Podcasts speichern und
                  von dort wiedergeben. Hierbei werden die Podcasts auf den
                  Server von Soundcloud geladen und anschließend mit Hilfe eines
                  sog. „Widgets“, also einem Steuerelement, auf unserer Webseite
                  eingebettet und angeboten.
                  <br />
                  Sobald ein Podcast aufgerufen wird, erhält Soundcloud
                  Informationen darüber, um welchen Podcast es sich handelt und
                  wie lange dieser angehört wurde.
                  <br />
                  Hierfür setzt Soundcloud einen Cookie. Durch den Cookie werden
                  pseudonymisierte Nutzungsprofile erstellt, die von uns für die
                  Analyse des Nutzerverhaltens und die Optimierung unserer
                  Internetseite verwendet werden. Soundcloud sammelt die
                  Hörinformationen und ordnet Sie Ihrem Soundcloud-Account zu,
                  wenn Sie während des Besuchs unserer Webseite in diesem
                  eingeloggt sind.
                </p>
                <p>
                  Dienstanbieter: SoundCloud Limited, Rheinsberger Str. 76/77,
                  10115 Berlin, Deutschland
                  <br />
                  Internetseite:{" "}
                  <a href="https://soundcloud.com/" className="externalLink">
                    https://soundcloud.com/
                  </a>
                  <br />
                  Datenschutzerklärung:{" "}
                  <a
                    href="https://soundcloud.com/pages/privacy"
                    className="externalLink"
                  >
                    https://soundcloud.com/pages/privacy
                  </a>
                </p>
              </div>
            </div>
            <div className="ce_text privacy_item gettyimages block">
              <div className="text">
                <p>
                  <strong>YouTube</strong>
                </p>
                <p>
                  Wir nutzen auf dieser Webseite Komponenten von YouTube, um
                  hierüber Videos auf unseren Internetseiten einzubinden, so
                  dass diese über Ihren Internetbrowser abgespielt werden
                  können, wenn Sie unsere Internetseiten besuchen. Während Ihres
                  Besuchs unseren Internetseiten werden sowohl YouTube als auch
                  Google darüber informiert welche Seite bzw. Unterseite Sie
                  aufgerufen haben, indem Ihre IP-Adresse an die externen Server
                  von Google in den USA übermittelt wird. Diese
                  Informationsübermittlung erfolgt unabhängig davon, ob die
                  angezeigten Videos tatsächlich betrachtet oder angeklickt
                  werden oder Sie in Ihrem YouTube oder Google Account
                  eingeloggt sind. Diese Informationen werden gesammelt und
                  Ihrem Google-Account zugeordnet, sofern Sie dort eingeloggt
                  sind, wenn Sie unsere Internetseiten aufrufen.
                </p>
                <p>
                  Dienstanbieter: YouTube, LLC, 901 Cherry Ave., San Bruno, CA
                  94066, USA
                  <br />
                  Internetseite:{" "}
                  <a href="https://www.youtube.com/" className="externalLink">
                    https://www.youtube.com/
                  </a>
                  <br />
                  Datenschutzerklärung:{" "}
                  <a
                    href="https://policies.google.com/privacy"
                    className="externalLink"
                  >
                    https://policies.google.com/privacy
                  </a>
                  <br />
                  <strong>Opt-Out-Möglichkeit: </strong>
                  <a
                    href="https://tools.google.com/dlpage/gaoptout?hl=de"
                    className="externalLink"
                  >
                    https://tools.google.com/dlpage/gaoptout?hl=de
                  </a>
                </p>
              </div>
            </div>
            <div className="ce_text privacy_item general_part4 block">
              <div className="text">
                <h2>Sicherheitsmaßnahmen</h2>
                <p>
                  Wir treffen im Übrigen technische und organisatorische
                  Sicherheitsmaßnahmen nach dem Stand der Technik, um die
                  Vorschriften der Datenschutzgesetze einzuhalten und Ihre Daten
                  gegen zufällige oder vorsätzliche Manipulationen, teilweisen
                  oder vollständigen Verlust, Zerstörung oder gegen den
                  unbefugten Zugriff Dritter zu schützen.
                </p>
                <h2>Aktualität und Änderung dieser Datenschutzerklärung</h2>
                <p>
                  Diese Datenschutzerklärung ist aktuell gültig und hat den
                  Stand September 2021. Aufgrund geänderter gesetzlicher bzw.
                  behördlicher Vorgaben kann es notwendig werden, diese
                  Datenschutzerklärung anzupassen.
                </p>
                <p>
                  <strong>
                    Diese Datenschutzerklärung wurde mit Hilfe des
                    Datenschutz-Generators von SOS Recht erstellt. SOS Recht ist
                    ein Angebot der Mueller.legal Rechtsanwälte Partnerschaft
                    mit Sitz in Berlin.
                  </strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      </Layout>
  );
};

export async function getStaticProps() {
  const { cookies } = await fetchCookieStaticProps(); // Cookies Daten abfragen

  return {
    props: {
      cookies,
    },
    revalidate: 10, // Optional: Setzt die Revalidierungszeit für die statische Seite
  };
}

export default privacy;
