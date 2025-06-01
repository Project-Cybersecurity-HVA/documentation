# Installatie en Deploy van de Wazuh Windows-Agent

Deze handleiding beschrijft stap voor stap hoe je de Wazuh-agent installeert en configureert op een Windows-machine, zodat deze verbinding maakt met een lokaal draaiende Wazuh-server (bijvoorbeeld een single-node Docker-implementatie).


## 1. Vereisten

- **Windows-versie**: Windows 10 (Pro/Enterprise) of Windows Server 2016/2019/2022  
- **Administrator-rechten**: Open PowerShell als Administrator om de MSI te installeren  
- **PowerShell 3.0 of hoger**: Controleer met:
  ```powershell
  $PSVersionTable.PSVersion
```

* **Netwerk**: De Wazuh-manager draait op dezelfde host, bereikbaar via `localhost` (127.0.0.1)
* **Poorten opengezet**:

  * UDP 1514 (log-verkeer)
  * TCP 1515 (agent-registratie)
  * TCP 443 (Kibana/Wazuh-dashboard)
    Zorg dat Windows Defender Firewall of een andere firewall deze poorten toestaat (zie sectie 4)



## 2. Installatiepakket kiezen

Wazuh biedt voor Windows een MSI-installer aan. Kies in de UI of op de downloadpagina het juiste installatiepakket:

| Architectuur                    | Installatiebestand  |
| ------------------------------- | ------------------- |
| 32-bit / 64-bit Intel (x86/x64) | MSI – Intel         |
| Apple Silicon (M1/M2, etc.)     | MSI – Apple Silicon |

Voorbeelden van beschikbare downloads (versie 4.12.0):

* **Intel MSI**:
  `https://packages.wazuh.com/4.x/windows/wazuh-agent-4.12.0-1.msi`

* **Apple Silicon MSI**:
  `https://packages.wazuh.com/4.x/windows/wazuh-agent-4.12.0-1-arm64.msi`

In dit document gaan we ervan uit dat je de **Intel (32/64-bit) MSI** (versie 4.12.0) downloadt.



## 3. Download en installatie

1. **Open PowerShell als Administrator**

   * Klik op Start, typ “PowerShell”, rechtsklik op “Windows PowerShell” en kies **Als administrator uitvoeren**.

2. **Download de Wazuh-agent MSI**
   Navigeer naar een tijdelijke map (bijvoorbeeld je Downloads-folder) en voer het volgende commando uit:

   ```powershell
   cd ~\Downloads
   Invoke-WebRequest -Uri "https://packages.wazuh.com/4.x/windows/wazuh-agent-4.12.0-1.msi" `
                     -OutFile "wazuh-agent-4.12.0-1.msi"
   ```

3. **Installeer de Wazuh-agent**
   Vervang in dit commando:

   * `127.0.0.1` → het IP of de FQDN van je Wazuh-manager
   * `MyAgentName` → een unieke naam voor de agent (mag geen spaties bevatten)
   * `Default` → de groep waarin deze agent wordt geplaatst

   ```powershell
   msiexec.exe /i "wazuh-agent-4.12.0-1.msi" `
     /qn `
     WAZUH_MANAGER="127.0.0.1" `
     WAZUH_AGENT_NAME="MyAgentName" `
     WAZUH_AGENT_GROUPS="Default" `
     /l*v "C:\Windows\Temp\wazuh-agent-install.log"
   ```

   * `/qn` → stille installatie zonder GUI
   * `/l*v …` → schrijft een uitgebreid installatie-log naar Windows Temp

4. **(Optioneel) MSI via GUI**

   * Dubbelklik op `wazuh-agent-4.12.0-1.msi`.
   * Bij **Server address** voer je in: `127.0.0.1`
   * Onder **Assign an agent name** geef je een unieke naam (bijvoorbeeld `MyAgentName`).
   * Onder **Select one or more existing groups** kies je “Default” (of een andere groep).
   * Klik op **Install** en wacht tot de installatie is voltooid.



## 4. Firewallconfiguratie

Zorg dat de agent met de manager kan communiceren door deze regels in Windows Defender Firewall in te stellen:

1. Open **Windows Defender Firewall met geavanceerde beveiliging** (via Start → typ “Windows Defender Firewall…”).

2. Ga naar **Inkomende regels** → **Nieuwe regel…** → kies **Poort** → klik **Volgende**.

3. Selecteer **UDP**, vul **1514** in, klik **Volgende** → kies **Verbinding toestaan** → klik **Volgende**.

4. Selecteer de gewenste profielen (Domain, Private, Public) → klik **Volgende**.

5. Geef de regel de naam:

   ```
   Wazuh UDP 1514
   ```

   Klik op **Voltooien**.

6. Herhaal stap 2 t/m 5 voor **TCP-poorten 1515 en 443**:

   * Kies **Poort** → **TCP** → “1515,443” → **Verbinding toestaan** → kies profielen → naam

     ```
     Wazuh TCP 1515 & 443
     ```

7. Ga naar **Uitgaande regels** → maak dezelfde twee regels aan (UDP 1514 en TCP 1515/443) zodat eventuele outbound-restricties ook worden opgeheven.



## 5. De agent starten en controleren

1. **Start de Wazuh-agent (indien nodig)**

   ```powershell
   net start wazuh-agent
   ```

   Je ziet:

   ```
   The Wazuh Agent service was started successfully.
   ```

2. **Controleer in Services**

   * Open **Services** (`services.msc`).
   * Zoek naar **Wazuh Agent**. De status moet “Running” zijn.

3. **Bekijk de agentlog voor fouten**

   ```powershell
   cd "C:\Program Files\Wazuh\logs"
   type ossec.log
   ```

   Je zou regels moeten zien zoals:

   ```
   2025/06/01 13:45:12 ossec-agentd: INFO: (6001): Started agent-based daemon.
   2025/06/01 13:45:15 ossec-agentd: INFO: (2042): Connected to the Wazuh manager (127.0.0.1:1515).
   ```

   * Als er fouten staan (zoals “Connection refused” of “Timeout”), controleer firewall en of de manager in Docker draait.

4. **Verifieer in het Wazuh-dashboard (Kibana)**

   * Open je browser en ga naar:

     ```
     https://localhost
     ```
   * Log in op het Wazuh-dashboard → navigeer naar **Wazuh → Agents**.
   * De Windows-agent moet hier met status **Active** verschijnen.


## 6. Veelvoorkomende issues en troubleshooting

* **Agent verschijnt niet in Dashboard**

  1. Herstart de agentdienst:

     ```powershell
     Restart-Service wazuh-agent
     ```
  2. Controleer in Docker dat de manager actief is:

     ```powershell
     docker ps
     ```

     * Zoek naar `single-node-wazuh.manager-1`. De status moet **Up** zijn en de poorten 1514/1515 open hebben.
  3. Bekijk de manager-logs op connecties:

     ```powershell
     docker exec -it single-node-wazuh.manager-1 /bin/bash
     tail -n 20 /var/ossec/logs/ossec.log
     ```

     * Zoek naar regels zoals “New agent connection from 127.0.0.1”.

* **UDP-1514 niet bereikbaar**

  * Controleer de firewallregels (zie sectie 4).
  * Test of de Wazuh-manager-container op UDP 1514 luistert:

    ```powershell
    netstat -an | findstr 1514
    ```

    * Je zou iets moeten zien als:

      ```
      UDP    0.0.0.0:1514           *:*
      ```
  * Voer de UDP-test in PowerShell uit:

    ```powershell
    $udpClient = New-Object System.Net.Sockets.UdpClient
    $endpoint = New-Object System.Net.IPEndPoint([System.Net.IPAddress]::Parse("127.0.0.1"), 1514)
    $message = [System.Text.Encoding]::ASCII.GetBytes("UDP Test")
    $bytesSent = $udpClient.Send($message, $message.Length, $endpoint)
    $udpClient.Close()
    Write-Host "Verstuurd $bytesSent bytes naar UDP 1514"
    ```

    * Controleer in de manager-logs of het pakket aankomt.

* **Verkeerd serveradres ingevoerd**

  * Tijdens MSI-installatie kan het adres niet achteraf worden gewijzigd.
  * Verwijder de agent, verwijder de map `C:\Program Files\Wazuh`, en installeer opnieuw met het juiste adres.



## 7. Veelgestelde vragen (FAQ)

1. **“Kan ik in plaats van `localhost` ook mijn LAN-IP invullen?”**
   Ja, als de Wazuh-manager in Docker via dat LAN-IP bereikbaar is (bijv. `192.168.1.10:1515`), kun je dit IP opgeven tijdens de installatie. Zorg dat de Docker-poortbinding juist is en dat de firewall dit LAN-verkeer toestaat.

2. **“Hoe geef ik meerdere groepen op?”**
   Tijdens stille installatie (MSI) kun je meerdere groepen comma-gescheiden opgeven:

   ```powershell
   msiexec.exe /i "wazuh-agent-4.12.0-1.msi" /qn `
     WAZUH_MANAGER="127.0.0.1" `
     WAZUH_AGENT_GROUPS="GroupA,GroupB"
   ```

3. **“Waar vind ik de agentconfiguratie na installatie?”**
   De configuratiebestanden staan in:

   ```
   C:\Program Files\Wazuh\etc\ossec.conf
   ```

   Pas hierin instellingen aan (bijvoorbeeld logging-levels), en herstart dan de dienst:

   ```powershell
   Restart-Service wazuh-agent
   ```


## 8. Aanvullende tips

* Indien je in de toekomst meerdere Windows-machines wil onboarden, kun je het MSI-commando in een PowerShell-script plaatsen zodat je snel en uniform agents uitrolt.
* Bewaar het geïnstalleerde MSI-bestand en de logbestanden (bijvoorbeeld `C:\Windows\Temp\wazuh-agent-install.log`) voor auditing en troubleshooting.
* Houd Wazuh- en Docker-versies up-to-date om compatibiliteitsproblemen te voorkomen.


