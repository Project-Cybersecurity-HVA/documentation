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

![Wazuh alert powershell activated](/img/usecases/wazuh_alert_powershell_activated.png)

## Usecase Detectie van persistente aanvallen via Windows Registry Runkeys

Uit te voeren met het volgende commmando in PowerShell met beheerrechten: 

Voor het activeren van Powershell:
 ```
 New-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Run" `
 -Name "TestPersister" -Value "C:\Windows\System32\notepad.exe" -PropertyType "String"
 ```

In de event viewer is het event gelijk te zien en een FIM system check later in Wazuh alert viewer en FIM module viewer:

**Wazuh Alert:**

![Wazuh alert registry key modified](/img/usecases/wazuh_alert_registry_key_modified.png)

**Wazuh FIM events:**

![Wazuh alert regsitry keys](/img/usecases/wazuh_alert_viewer_registry.png)

## Usecase Toevoegen aan de administratorsgroep

Maak eerst een testgebruiker aan met de volgende commando: 

`New-LocalUser -Name "testuser" -Password (ConvertTo-SecureString "Heelgoedenveilig!!!" -AsPlainText -Force)` 

Voeg een gebruiker aan de administrator groep: 

`Add-LocalGroupMember -Group "Administrators" -Member "testuser" `

Nu zie je dat er een high alert is op de wazuh dashboard: 

**Wazuh Alert:**

![Wazuh alert added to admin group](/img/usecases/wazuh_alert_adding_admin_groep.png)

## Usecase Detectie van credential attacks op Windows

Om nu de usecase te testen kan je een van de volgende commando’s op de powershell van de Windows systeem uitvoeren: 

```powershell
rundll32.exe C:\Windows\System32\comsvcs.dll, MiniDump 624 C:\temp\lsass.dmp full 
rundll32 keymgr.dll,KRShowKeyMgr 
vaultcmd /listcreds:"Windows Credentials" /all 
``` 

**Wazuh Alert:**

![Wazuh alert credentials attack](/img/usecases/wazuh_alert_credentials_attack.png)
![Wazuh alert credentials attack](/img/usecases/wazuh_alert_credentials_attack_2.png)
![Wazuh alert credentials attack](/img/usecases/wazuh_alert_credentials_attack_3.png)

## Usecase Detectie van Malware

Om nu de usecase te testen voer het volgende commando op de powershell van de Windows systeem uitvoeren: 

```
Set-Content "$env:USERPROFILE\Desktop\eicar.com" 'X5O!P%@AP[4\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*' 
```

**Wazuh Alert:**

![Wazuh alert malware](/img/usecases/wazuh_alert_ongewenste_software.png)



## Usecase Uitschakelen van Windows Defender

Voer het volgende commando uit in Powershell om een `.bat`-bestand aan te maken in de `TEMP`-folder: 

`echo "echo hello" > "$env:TEMP\Hacked_me.bat" `

Vervolgens genereert Sysmon een melding in de eventviewer met ID 11: 

**Windows Event_viewer:**

![Wazuh alert uitschakelen Windows Defender](/img/usecases/wazuh_alert_uitschakelen_windows_defender.png)

**Wazuh Event_viewer:**
![Wazuh alert uitschakelen Windows Defender](/img/usecases/wazuh_alert_uitschakelen_windows_defender_2.png)


## Usecase Misbruik van de Windows Task Scheduler 

Voer het volgende commando uit in Powershell om het taskschd.dll module te laden: 

`Start-Process schtasks.exe `

Vervolgens genereert Sysmon een melding in de eventviewer met ID 7: 

**Windows Event_viewer:**

![Wazuh alert uitschakelen Windows Task Scheduler](/img/usecases/event_viewer_task_scheduler.png)

**Wazuh Event_viewer:**

![Wazuh alert uitschakelen Windows Task Scheduler](/img/usecases/wazuh_alert_task_scheduler.png)

## Usecase Bruteforce op Windows 11

Vergrendel het Windows apparaat waar de Wazuh agent zich op bevind en voer herhaaldelijk een verkeerd wachtwoord in. Na 3x binnen 2 minuten wordt er een melding gegenereerd

**Windows Event_viewer:**

![Wazuh alert uitschakelen Bruteforce op Windows 11](/img/usecases/event_viewer_brute_force.png)

**Wazuh Event_viewer:**

![Wazuh alert uitschakelen Bruteforce op Windows 11](/img/usecases/wazuh_alert_brute_force.png)

## Usecase Uitschakelen van Windows Firewall

Voer het volgende PowerShell-commando uit: 

`Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled False` 

**Wazuh Event_viewer:**

![Wazuh alert uitschakelen Windows Firewall](/img/usecases/wazuh_alert_windows_firewall.png)

## Usecase AD activiteiten scannen (SharpHound)

Voer het volgende PowerShell-commando uit (met Sharphound geïnstalleerd) in de folder van Sharphound: 

`.\SharpHound.exe --CollectionMethods All –Loop`

**Wazuh Event_viewer:**

![Wazuh alert AD activiteiten scannen](/img/usecases/wazuh_alert_AD_Scanning.png)

## Usecase Inlogpoging op Windows 11 buiten werktijden

Log in het Windows endpoint buiten kantoortijden (18:30-08:30)

**Wazuh Event_viewer:**

![Wazuh alert Windows 11 buiten werktijden](/img/usecases/wazuh_alert_buiten_kantoortijden.png)

## Usecase Inlogpoging op Windows 11 vanaf onbekend netwerk

Log in op een Windows client vanaf een 192.168.56.0/24 netwerk (gebruik rdp) 

**Wazuh Event_viewer:**

![Wazuh alert Windows 11 vanaf onbekend netwerk](/img/usecases/wazuh_alert_vcts.png)

## Usecase Password Spraying

Probeer 5x om in te loggen met verkeerde wachtwoorden van zelfde ip address  

**Wazuh Event_viewer:**

![Wazuh alert Password Spray attack](/img/usecases/wazuh_alert_password_spray.png)

## Usecase Verdachte scripting bestanden in `/tmp` of `/gebruikers` folder

Voer het volgende commando uit in Powershell om een .bat bestand aan te maken in de TEMP folder: 

`echo "echo hello" > "$env:TEMP\Hacked_me.bat"` 

**Wazuh Event_viewer:**

![Sysmon alert scripting bestanden in `/tmp` of `/gebruikers` folder](/img/usecases/sysmon_alert_scripting_temp.png)
