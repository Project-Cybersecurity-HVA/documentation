# Sysmon    

De volgende configuratie is nodig in de Wazuh manager (de wazuh.manager container) om logs te verzamelen van endpoint, zonder agents (zoals firewalls). Voer de volgende stappen uit op de Wazuh Server om syslogberichten op een specifieke poort te ontvangen. 
1.	Voeg de volgende configuratie toe tussen de `<ossec_confg>` tags van de Wazuh Manager  `/var/ossec/etc/ossec.conf`  om te luisteren naar syslog berichten op TCP poort 514:

```xml
<remote>
  <connection>syslog</connection>
  <port>514</port>
  <protocol>tcp</protocol>
  <allowed-ips>192.168.2.15/24</allowed-ips>
  <local_ip>192.168.2.10</local_ip>
</remote>
```

Waarbij:

•	`<connection>` specificeert het type verbinding dat geaccepteerd wordt. Deze waarde kan beveiligd of syslog zijn.
•	`<port>` is de poort die gebruikt wordt om te luisteren naar inkomende syslogberichten van eindpunten. In het bovenstaande voorbeeld gebruikt poort 514.
•	`<protocol>`  is het protocol dat gebruikt wordt om te luisteren naar inkomende syslogberichten van eindpunten. De toegestane waarden zijn tcp of udp
•	`<allowed_ips>` is het IP-adres of netwerkbereik van de eindpunten die gebeurtenissen doorsturen naar de Wazuh-server. In het bovenstaande voorbeeld gebruikt 192.168.2.15/24.
•	`<local_ip>` is het IP-adres van de Wazuh-server die luistert naar inkomende logberichten. In het bovenstaande voorbeeld gebruikt 192.168.2.10.
