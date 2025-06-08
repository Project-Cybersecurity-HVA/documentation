# Installatie en Configuratie

## Stap 1: Repository klonen

Kloon de Wazuh-repository naar je systeem:

```bash
git clone https://github.com/wazuh/wazuh-docker.git -b v4.12.0
```

Ga vervolgens naar de `single-node` directory om alle hieronder beschreven commando's binnen deze directory uit te voeren.

## Stap 2: Certificaten regelen

Om communicatie tussen de nodes te beveiligen, zijn certificaten vereist. Je hebt twee mogelijkheden om deze certificaten te leveren:

### 2.1 Zelfondertekende certificaten genereren

Er is een standaard Docker image beschikbaar om het genereren van certificaten te automatiseren met behulp van de Wazuh certs gen tool.

Als je systeem een proxy gebruikt, voeg dan het volgende toe aan het `generate-indexer-certs.yml` bestand. Zo niet, sla deze stap dan over:

```yaml
environment:
  - HTTP_PROXY=YOUR_PROXY_ADDRESS_OR_DNS
```

Een volledig voorbeeld ziet er als volgt uit:

```yaml
# Wazuh App Copyright (C) 2017 Wazuh Inc. (License GPLv2)
version: '3'

services:
  generator:
    image: wazuh/wazuh-certs-generator:0.0.2
    hostname: wazuh-certs-generator
    volumes:
      - ./config/wazuh_indexer_ssl_certs/:/certificates/
      - ./config/certs.yml:/config/certs.yml
    environment:
      - HTTP_PROXY=YOUR_PROXY_ADDRESS_OR_DNS
```

Voer het volgende commando uit om de gewenste certificaten te verkrijgen:

```bash
docker-compose -f generate-indexer-certs.yml run --rm generator
```

Hiermee worden de certificaten opgeslagen in de map `config/wazuh_indexer_ssl_certs`.

### 2.2 Eigen certificaten plaatsen

Als je je eigen certificaten hebt, plaats ze dan als volgt in de map `config/wazuh_indexer_ssl_certs`:

**Wazuh indexer:**
- `config/wazuh_indexer_ssl_certs/root-ca.pem`
- `config/wazuh_indexer_ssl_certs/wazuh.indexer-key.pem`
- `config/wazuh_indexer_ssl_certs/wazuh.indexer.pem`
- `config/wazuh_indexer_ssl_certs/admin.pem`
- `config/wazuh_indexer_ssl_certs/admin-key.pem`

**Wazuh manager:**
- `config/wazuh_indexer_ssl_certs/root-ca-manager.pem`
- `config/wazuh_indexer_ssl_certs/wazuh.manager.pem`
- `config/wazuh_indexer_ssl_certs/wazuh.manager-key.pem`

**Wazuh dashboard:**
- `config/wazuh_indexer_ssl_certs/wazuh.dashboard.pem`
- `config/wazuh_indexer_ssl_certs/wazuh.dashboard-key.pem`
- `config/wazuh_indexer_ssl_certs/root-ca.pem`

Als je de certificaten hebt gegenereerd of geplaatst, ga dan verder met **Stap 3** om de Wazuh single-node implementatie te starten.

## Stap 3: Start de Wazuh single-node implementatie

Start de Wazuh single-node implementatie met behulp van docker-compose:

**Voorgrond:**
```bash
docker-compose up
```

**Achtergrond:**
```bash
docker-compose up -d
```

De standaard gebruikersnaam en het wachtwoord voor het Wazuh-dashboard zijn `admin` en `SecretPassword`. Voor extra beveiliging kun je het standaardwachtwoord van de Wazuh indexer admin-gebruiker wijzigen. 