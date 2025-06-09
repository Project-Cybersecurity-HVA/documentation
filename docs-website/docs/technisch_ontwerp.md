# Technisch Ontwerp - Project Cyber Security

## Inleiding

### Doel

Dit document vormt het technische ontwerp voor de proof of concept "Gratis SIEM voor het mkb" op basis van Wazuh. Het doel is om:

* Componenten en infrastructuur technisch te definiëren
* Logbronnen, regels en validatie te beschrijven
* Toegangsbeheer te structureren
* Richtlijnen voor beheer en veiligheid te bieden

### Doelgroep

Systeem- en netwerkbeheerders binnen het mkb en externe consultants.

### Technische uitgangspunten

* Ubuntu 22.04 LTS (8 vCPU, 8GB RAM, 100GB opslag)
* Intern netwerkcommunicatie
* Agents via poort 1514 TCP
* Syslog via TCP 514
* TLS 1.2+
* Wazuh 4.12+

---

## Usecases

*Voorbeeld van een uitgewerkte usecase. Het volledige Technisch ontwerp is op te vragen bij de projectgroep

### Detectie van credential attacks op Windows

* **Rule IDs**: 100010, 100011, 100012, 100013
* **Gedrag**:

  * LSASS dump via rundll32.exe / procdump
  * Credential Manager toegang via keymgr.dll
  * Vaultcmd uitlezing

### Scenario: Password spraying

In dit scenario worden pogingen tot het ongeautoriseerd verkrijgen en gebruiken van inloggegevens gedetecteerd, met nadruk op pogingen waarbij een beperkt aantal veelgebruikte wachtwoorden wordt getest op meerdere gebruikersaccounts (password spraying). Deze aanvalsmethode wordt vaak ingezet om lockouts te vermijden en langere tijd onopgemerkt te blijven.

**Componenten**

* **Endpoints**: Windows 11
* **Wazuh-agent**: Geïnstalleerd op de endpoints
* **Wazuh Manager**: Ontvangt en analyseert loggegevens

**Detectie en regels**

| Gedrag                                         | Bron   | Rule ID | Beschrijving                                                                   |
| ---------------------------------------------- | ------ | ------- | ------------------------------------------------------------------------------ |
| Herhaalde foutieve logins op meerdere accounts | Medium | 104390  | Detecteert password spraying op basis van mislukte loginpogingen over accounts |

**Verloop van scenario**

1. Een aanvaller voert inlogpogingen uit met bekende wachtwoorden op meerdere gebruikers.
2. Windows genereert bij elke mislukte poging een event met ID.
3. De Wazuh-agent verzamelt deze logs.
4. De Wazuh Manager vergelijkt de logs met ingestelde regels die patronen herkennen.
5. Bij een match wordt een alert gegenereerd.
6. Deze alert is zichtbaar in het Wazuh-dashboard voor verdere analyse.

* Herhaalde foutieve logins op meerdere accounts

*Verdere usecases uit het technsich ontwerp. *


### Detectie van malware

* **Rule ID**: 62123
* **Gedrag**:

  * Windows Defender detecteert mogelijk malware

### Toevoeging aan administratorsgroep

* **Rule ID**: 60160
* **Gedrag**:

  * Toevoegen van gebruiker aan admin-groep

### Bruteforce op Windows 11

* **Rule IDs**: 60122, 100100
* **Gedrag**:

  * Mislukte loginpogingen met verkeerde gebruikersnaam/wachtwoord

### Wissen van de Windows Logs

* **Rule ID**: 63104
* **Gedrag**:

  * Event ID 104 / 1102

### Uitschakelen van Windows Defender

* **Rule ID**: 62152
* **Gedrag**:

  * Windows Defender uitgeschakeld / niet actief

### Detectie van persistente aanvallen via Runkey-aanpassingen

* **Rule ID**: 598
* **Gedrag**:

  * Toevoegen van register runkey in HKLM/HKCU

### Detectie van PowerShell-gebruik

* **Rule ID**: 67027
* **Gedrag**:

  * Activatie van PowerShell-proces

### Uitschakelen van Windows Firewall

* **Rule ID**: 67005
* **Gedrag**:

  * Windows Firewall uitgeschakeld

### Datacollectie van Active Directory met PowerShell

* **Rule ID**: 100206
* **Gedrag**:

  * Powershell commando: Get-ADGroupMember

### Inlogpoging op Windows 11 buiten werktijden

* **Rule ID**: 60106
* **Gedrag**:

  * Login tussen 18:00 - 06:00

### Inlogpoging op Windows 11 vanaf vreemd netwerk

* **Rule ID**: 60106
* **Gedrag**:

  * Login vanaf verdacht IP-adres

### Misbruik van de Windows Task Scheduler

* **Rule ID**: 92154
* **Gedrag**:

  * Proces laadt taskschd.dll

### Verdachte timestomping-activiteit

* **Rule IDs**: 61604, 101101
* **Gedrag**:

  * Aanmaaktijd van bestand gewijzigd

### Verdachte scriptingbestanden in /tmp of /gebruikers folder

* **Rule ID**: 92200
* **Gedrag**:

  * Aanmaak van .bat, .cmd, .ps1, etc. in tijdelijke/gebruikersmap
