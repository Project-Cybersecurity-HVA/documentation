# Onderzoeksresultaten


# Onderzoeksrapport: Gratis SIEM-oplossing voor het mkb

## Managementsamenvatting

* Het mkb is steeds vaker doelwit van cyberaanvallen, maar beschikt vaak niet over voldoende kennis of middelen.
* Commerciële SIEM-oplossingen zijn duur en complex.
* **Wazuh** is na vergelijking de aanbevolen gratis SIEM-oplossing voor het mkb: gebruiksvriendelijk, schaalbaar, goede communitysupport.
* Alternatieven zoals **Splunk Free** en **Elastic Security** zijn óf te beperkt, óf te complex zonder specialistische kennis.
* Implementatie van Wazuh wordt aanbevolen in fases, met externe ondersteuning waar nodig.

##  Methodologie

* **Fases**:

  1. Literatuurstudie
  2. Productanalyse (11 oplossingen → shortlist van 3)
  3. Productevaluatie met **SANS-matrix**
  4. Proof of Concept voorbereiding

* Criteria: functionaliteit, schaalbaarheid, onderhoud, juridische kaders.

##  Vergelijking SIEM-oplossingen

| Tool             | Sterkte                                                     | Zwakte                                        |
| ---------------- | ----------------------------------------------------------- | --------------------------------------------- |
| **Wazuh**        | Volledig open-source, schaalbaar, compliance met NIS2 & AVG | Initiële setup vereist tijd en kennis         |
| **Splunk Free**  | Gebruiksvriendelijk, goede reputatie                        | Loglimiet van 500 MB/dag, geen multi-user     |
| **Elastic SIEM** | Flexibel, uitbreidbaar (ELK-stack)                          | Hoge leercurve, complex beheer zonder IT-team |

* **Wazuh scoorde het hoogst** op de aangepaste **SANS-matrix** (±120 evaluatiepunten).
* SWOT-analyse bevestigde geschiktheid voor mkb.

## Detectiescenario’s en logbronnen

**Essentiële logbronnen**:

1. Authenticatie- en toegangslogs (b.v. password spraying, beheerdersgroep-mutaties)
2. Endpointbeveiligingslogs (b.v. ongewenste software, uitschakelen antivirus)
3. Firewall- en netwerklogs (b.v. C2-verkeer, datalekken)

* Elk type is gekoppeld aan concrete aanvalsscenario's die met Wazuh gedetecteerd kunnen worden.

## Schaalbaarheid en onderhoud

* **Technisch**: horizontaal & verticaal schalen; cloud-schaalbaarheid theoretisch mogelijk maar buiten scope.
* **Organisatorisch**: duidelijke rolverdeling, training, managementondersteuning.
* **Best practices**: gefaseerde uitrol (PDCA), logging beperken tot relevante data, automatisering, gebruiksvriendelijkheid.

## Werking van Wazuh

* **Verzameling**: via agents of agentless logging
* **Aggregatie**: normalisatie & opslag in Wazuh Indexer
* **Correlatie**: via regelsets, o.a. MITRE ATT\&CK
* **Waarschuwingen**: alerts met prioriteitsniveaus (0–15), verschillende meldingsopties (e-mail, Slack, etc.).

## Niet-functionele eisen

* **Performance**: real-time detectie bij voldoende hardware
* **Flexibiliteit**: eenvoudig uit te breiden
* **Beveiliging**: encrypted communicatie, tamper detection, RBAC
* **Gebruiksgemak**: webdashboard, standaardregels, eenvoudige rapportage.

## Conclusie

> Wazuh is de meest geschikte SIEM-oplossing voor het mkb dankzij functionaliteit, schaalbaarheid en gebruiksgemak. Ondanks een hogere initiële setup-inspanning biedt het langdurige voordelen.

## Advies

1. Start klein met beperkte logbronnen en detectiescenario’s
2. Breid uit met meer bronnen & verfijnde regels
3. Monitor & optimaliseer beheerstructuur

> Overweeg externe expertise indien IT-beveiliging in-house ontbreekt. PoC vormt de volgende stap.

