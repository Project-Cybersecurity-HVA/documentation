Single-node Deployment
Kloon de Wazuh-repository naar je systeem:


git clone https://github.com/wazuh/wazuh-docker.git -b v4.12.0
Ga vervolgens naar de single-node directory om alle hieronder beschreven commando's binnen deze directory uit te voeren.

Voorzie een set certificaten voor elke node in de stack om communicatie tussen de nodes te beveiligen. Je hebt twee mogelijkheden om deze certificaten te leveren:

Genereer zelfondertekende certificaten voor elke cluster node.

We hebben een Docker-image gemaakt om het genereren van certificaten te automatiseren met behulp van de Wazuh certs gen tool.

Als je systeem een proxy gebruikt, voeg dan het volgende toe aan het generate-indexer-certs.yml bestand. Zo niet, sla deze stap dan over:


environment:
  - HTTP_PROXY=YOUR_PROXY_ADDRESS_OR_DNS
Een volledig voorbeeld ziet er als volgt uit:


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
Voer het volgende commando uit om de gewenste certificaten te verkrijgen:


docker-compose -f generate-indexer-certs.yml run --rm generator
Hiermee worden de certificaten opgeslagen in de map config/wazuh_indexer_ssl_certs.

Gebruik je eigen certificaten voor elke node.

Als je je eigen certificaten hebt, plaats ze dan als volgt in de map config/wazuh_indexer_ssl_certs:

Wazuh indexer:


config/wazuh_indexer_ssl_certs/root-ca.pem
config/wazuh_indexer_ssl_certs/wazuh.indexer-key.pem
config/wazuh_indexer_ssl_certs/wazuh.indexer.pem
config/wazuh_indexer_ssl_certs/admin.pem
config/wazuh_indexer_ssl_certs/admin-key.pem
Wazuh manager:


config/wazuh_indexer_ssl_certs/root-ca-manager.pem
config/wazuh_indexer_ssl_certs/wazuh.manager.pem
config/wazuh_indexer_ssl_certs/wazuh.manager-key.pem
Wazuh dashboard:


config/wazuh_indexer_ssl_certs/wazuh.dashboard.pem
config/wazuh_indexer_ssl_certs/wazuh.dashboard-key.pem
config/wazuh_indexer_ssl_certs/root-ca.pem
Start de Wazuh single-node implementatie met behulp van docker-compose:

Voorgrond:


docker-compose up
Achtergrond:


docker-compose up -d
De standaard gebruikersnaam en het wachtwoord voor het Wazuh-dashboard zijn admin en SecretPassword. Voor extra beveiliging kun je het standaardwachtwoord van de Wazuh indexer admin-gebruiker wijzigen.