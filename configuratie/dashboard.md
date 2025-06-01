# Dashboard Toegang en Inloggen

Na installatie en configuratie van de Wazuh-manager en -agenten kun je inloggen op het Wazuh-dashboard (Kibana/Wazuh App). Hieronder staat hoe je dat doet met de standaard (default) inloggegevens en hoe je, indien gewenst, deze later kunt wijzigen.


## Toegang krijgen tot het Dashboard

1. **URL openen**  
   - Als je de standaard single-node Docker-implementatie gebruikt, draait het dashboard op poort 443 van de Windows-host.  
   - Open je browser en ga naar:  
     ```
     https://localhost (127.0.0.1)
     ```  
     (of vervang “localhost” door het IP-adres of de FQDN van de host als je dat anders hebt ingesteld).

2. **Security-waarschuwing accepteren (indien van toepassing)**  
   - Omdat Docker-containers doorgaans met een zelfondertekend certificaat werken, zal je browser mogelijk een “Niet beveiligde verbinding” of “Onbetrouwbaar certificaat” melding geven.  
   - Klik in dat geval op “Geavanceerd” (of “Advanced”) → “Verder naar localhost (onveilig)” (of “Proceed to localhost (unsafe)”) om door te gaan.


## Default Inloggegevens

Bij een verse installatie van de Wazuh single-node Docker-stack (versie 4.12.0) gelden de volgende standaardgebruikersnamen en wachtwoorden:

- **Wazuh-dashboard (Kibana + Wazuh App)**  
  - **Gebruikersnaam**: `admin`  
  - **Wachtwoord**: `SecretPassword`

