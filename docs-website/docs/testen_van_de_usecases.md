# Testen van de Usecases

> **_NOTE:_** De logging moet via audit policy toegestaan zijn voor verschillende Windows usecases, zoals beschreven in het Functioneel ontwerp

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

## Usecase Detectie van PowerShell-gebruik

Uit te voeren met het volgende commmando in PowerShell met beheerrechten: 

Voor het activeren van Powershell:
 `Start-Process Powershell.exe`

In de event viewer is het event gelijk te zien en een paar seconden later in Wazuh alert viewer:

**Wazuh Alert:**

![Wazuh alert system log cleared](/img/usecases/wazuh_alert_powershell_activated.png)

## Usecase Detectie van persistente aanvallen via Windows Registry Runkeys

Uit te voeren met het volgende commmando in PowerShell met beheerrechten: 

Voor het activeren van Powershell:
 ```
 New-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Run" `
 -Name "TestPersister" -Value "C:\Windows\System32\notepad.exe" -PropertyType "String"
 ```

In de event viewer is het event gelijk te zien en een FIM system check later in Wazuh alert viewer en FIM module viewer:

**Wazuh Alert:**

![Wazuh alert system log cleared](/img/usecases/wazuh_alert_registry_key_modified.png)

**Wazuh FIM events:**

![Wazuh alert system log cleared](/img/usecases/wazuh_alert_viewer_registry.png)

