# Functioneel Ontwerp - Project Cyber Security

## Inleiding

### Waarom een SIEM?

Het midden- en kleinbedrijf (mkb) is kwetsbaar voor cyberaanvallen door beperkte middelen en kennis. Wetgeving zoals de NIS2-richtlijn verplicht organisaties tot netwerkmonitoring, logging en incidentrespons. Een SIEM-oplossing (Security Information and Event Management) centraliseert loggegevens en maakt snelle detectie van dreigingen mogelijk. Na onderzoek is gekozen voor Wazuh, een open-source SIEM-oplossing die goed aansluit bij de behoeften van het mkb.

### Doelgroep

IT-verantwoordelijken binnen het mkb, zoals systeem- en netwerkbeheerders. Ook geschikt als referentie voor externe consultants.

### Uitgangspunten

Er is uitgegaan van een gemiddelde mkb-omgeving met beperkte IT-infrastructuur en een klein beheerteam. De oplossing moet laagdrempelig, schaalbaar en wettelijk compliant zijn.

## Architectuur van de SIEM-oplossing

De architectuur omvat logbronnen, agents, een centrale manager en een dashboard. Loggegevens worden verzameld, gecorreleerd en geanalyseerd. Alerts worden gegenereerd bij afwijkend gedrag volgens ingestelde detectieregels.

Link naar architectuurdiagram: [Mermaid Chart](https://www.mermaidchart.com/app/projects/6b27c4ec-e5ef-4b42-8117-2a74dc480228/diagrams/3e0a3c83-9c0d-4dc9-a3f9-4be8077d123b/version/v0.1/edit)

## Bedrijfsregels en Validaties

### Bedrijfsregels

1. Minimaal 3 typen logbronnen gekoppeld.
2. Per logbron minimaal 5 detectieregels.
3. Alleen geautoriseerde gebruikers mogen detectieregels aanpassen.
4. Alerts alleen bij afwijkingen binnen parameters.
5. Elke alert moet automatisch gelogd worden.

### Detectievereisten

1. Minimaal 5 detectieregels per logbron.
2. Detectieregels bevatten prioriteitstoekenning.
3. Gebruik van gedrags-, tijd- of patroonanalyse.
4. Gebruik van gestandaardiseerde regels waar mogelijk.
5. Detectieregels moeten versiebeheer ondersteunen.

### Validaties

* Tijdsvalidatie
* Categoriecontrole
* IP/locatiecheck
* Gebruikersrechtencheck
* Structuurvalidatie

### Ondersteunende functies

* Zoekfunctionaliteit
* Versiebeheer van detectieregels
* Notificatiesysteem
* Prioritering en filtering

## Detectiescenario's per Logbron

### Authenticatie- en toegangslogs

* Toevoeging aan administratorsgroep

*Voorbeeld over de uitwerking van een detectiescenario. Het volledige Functioneel Ontwerp is op te vragen bij de projectgroep* 

#### Scenario: Toevoeging aan administratorsgroep

Dit scenario richt zich op het detecteren van het escaleren van beheerdersrechten, waarbij een gebruiker wordt toegevoegd aan de lokale administratorsgroep op een Windows systeem. Deze actie geeft een aanvaller volledig controle over het systeem en is een veelgebruikte methode voor escalatie na toegang tot het systeem.

##### Doel van de detectie

Het detecteren van pogingen tot escalatie door het toevoegen van een gebruiker aan de lokale administratorsgroep op een Windows 11 systeem.

##### Detectiecriteria

Een alert moet afgaan als:

* Een gebruiker wordt toegevoegd aan de groep "Administrators"

##### Voorwaarden voor de detectie

* User Accountmanagement auditing moet geactiveerd zijn op het systeem

* De Wazuh-agent moet het event verzamelen

* De Wazuh-regel moet geconfigureerd en geactiveerd zijn

##### Databronnen

* Windows Event logs: Registreren van wijzigingen aan groepen

* Wazuh-agent: Verzamelt deze events en stuurt dit naar de Wazuh-manager

* Wazuh-manager: Ontvangt de logs en triggert detectieregels

##### Verwacht gedrag

Wanneer een gebruiker wordt toegevoegd aan de lokale administratorsgroep registreert Windows dit in de Windows Eventlogs. De Wazuh-agent leest dit in de logs en stuurt dit door naar de Wazuh-Manager. De Manager vergelijkt dit met detectieregels en als het gedrag overeenkomt wordt er een alert gegenereerd en getoond op het Wazuh-dashboard.

*Verdere scenario's uit deze logbrongrop:*

* Password spraying
* Credential attacks
* Bruteforce via RDP
* Wissen van Windows Security Logs

### Endpointbeveiligingslogs (AV/EDR)

* Detectie van malware
* Uitschakelen van beveiliging
* Persistente aanvallen via Registry Runkeys
* PowerShell-gebruik
* Timestomping
* Verdachte scripts in /tmp of gebruikersfolders

### Firewall- en netwerklogs

* Uitschakelen Windows Firewall
* Misbruik van Windows Task Scheduler
* Inlogpoging buiten werktijden
* Inlogpoging vanaf vreemd netwerk
* AD-informatie ophalen via PowerShell

## Rollen en Verantwoordelijkheden

| Rol                   | Taken                                                            |
| --------------------- | ---------------------------------------------------------------- |
| SIEM-beheerder        | Installatie, configuratie, logbronbeheer, detectieregels beheren |
| Security Analist      | Monitoring, analyse, opvolging incidenten                        |
| Systeembeheerder      | Agentinstallatie, infrastructuurbeheer                           |
| Functioneel Beheerder | Afstemming op informatiebehoeften, compliancy                    |

### RACI-matrix

Zie oorspronkelijke document voor uitgebreide tabel. Rollen zijn niet strikt gescheiden, aanpasbaar op organisatiegrootte.

## Autorisatiematrix

| Rol                   | C | R | U           | D |
| --------------------- | - | - | ----------- | - |
| Functioneel beheerder |   | X |             |   |
| Systeembeheerder      | X | X | X           |   |
| Security analist      |   | X | (optioneel) |   |
| SIEM-beheerder        | X | X | X           | X |

## Interfaces

### Componenten

* Wazuh Server, Dashboard, Indexer, Agents
* Netwerkapparatuur, authenticatiesystemen, endpoints

### Koppelingen

* Netwerkapparatuur → Wazuh Server
* Endpoints → Wazuh Agent → Wazuh Server

### Toegang beheerder

Toegang tot Wazuh-dashboard via browser, waar logs en meldingen visueel worden weergegeven.

## Samenvatting en Aanbevelingen

* **Gebruik gestandaardiseerde detectieregels** (MITRE/Wazuh)
* **Evalueer periodiek** de effectiviteit van detectieregels en logdekking
* **Houd rekening met compliance** en dataminimalisatie
* **Ondersteun kennisontwikkeling** bij betrokken medewerkers
* **Start kleinschalig** en breid uit via PoC en PDCA-cyclus

## Literatuurlijst (selectie)

* MITRE ATT\&CK® (2025)
* Van der Tak, Kaya, Kara, Westerweel, & Onay (2025)
* ABN AMRO (2023)
* Ministerie van Justitie en Veiligheid (2024)
* NCSC (2024)
* CIS Controls v8 (2021)
* Wazuh documentatie (diverse links)
 