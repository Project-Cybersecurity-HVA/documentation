# Testen van de Usecases

*Hier komt de beschrijving van de testcases en de resultaten van het testen van de SIEM-oplossing.* 

## Usecase Wissen van de Windows Logs

Uit te voeren met het volgende commmando in PowerShell met beheerrechten: 

Voor het wissen van Systeem logs:
 `Clear-EventLog -LogName System`


Voor het wissen van Security logs: 
`Clear-EventLog -LogName Security`

In de event viewer is het event gelijk te zien en een paar seconden later in Wazuh alert viewer:

**Event Viewer:**

![Eventviewer usecase logs](/img/usecases/event_viewer_system_log_cleared.png)

**Wazuh Alert:**

![Wazuh alert system log cleared](/img/usecases/wazuh_alert_system_log_cleared.png)

<p align="center">
  <b>Event Viewer</b> &nbsp;&nbsp;&nbsp;&nbsp; <b>Wazuh Alert</b>
</p>
