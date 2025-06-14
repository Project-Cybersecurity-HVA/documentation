# Windows Agent ossec.conf

De standaard installatie route volgt het volgende `PATH` voor de `ossec`-configuratie: `C:\Program Files (x86)\ossec-agent`. De aanvullende, vereiste configuratie is nodig voor de usecases beschreven in hoofdstuk 4 uit het Technisch Ontwerp en te vinden in de bijlage, genaamd configuratiebestand Windows `ossec.conf`: 

Herstart de agent op Windows na elke aanpassing op het ossec.conf-bestand met het volgende commando: 
 `Restart-Service -Name Wazuh`



Hieronder vind je het `ossec.conf`-configuratiebestand voor de Wazuh Windows agent:

```xml
<!--
  Wazuh - Agent - Default configuration for Windows
  More info at: https://documentation.wazuh.com
  Mailing list: https://groups.google.com/forum/#!forum/wazuh
-->

<ossec_config>

  <client>
    <server>
      <address>127.0.0.1</address>
      <port>1514</port>
      <protocol>tcp</protocol>
    </server>
    <config-profile>windows, windows10</config-profile>
    <crypto_method>aes</crypto_method>
    <notify_time>10</notify_time>
    <time-reconnect>60</time-reconnect>
    <auto_restart>yes</auto_restart>
    <enrollment>
      <enabled>yes</enabled>
      <agent_name>GONGOELOE</agent_name>
    </enrollment>
  </client>

  <!-- Agent buffer options -->
  <client_buffer>
    <disabled>no</disabled>
    <queue_size>5000</queue_size>
    <events_per_second>500</events_per_second>
  </client_buffer>

  <localfile>
  <location>Security</location>
  <log_format>eventchannel</log_format>
  <query>
    Event[System[EventID=4688]
      and EventData[Data[@Name='NewProcessName']='C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe']]
  </query>
  </localfile>

  <localfile>
    <location>System</location>
    <log_format>eventchannel</log_format>
  </localfile>

  <localfile>
    <location>Microsoft-Windows-Windows Defender/Operational</location>
    <log_format>eventchannel</log_format>
  </localfile>

  <localfile>
    <location>active-response\\active-responses.log</location>
    <log_format>syslog</log_format>
  </localfile>

  <localfile>
    <location>Microsoft-Windows-Sysmon/Operational</location>
    <log_format>eventchannel</log_format>
  </localfile>

  <rootcheck>
    <disabled>no</disabled>
    <windows_apps>./shared/win_applications_rcl.txt</windows_apps>
    <windows_malware>./shared/win_malware_rcl.txt</windows_malware>
  </rootcheck>

  <sca>
    <enabled>yes</enabled>
    <scan_on_start>yes</scan_on_start>
    <interval>12h</interval>
    <skip_nfs>yes</skip_nfs>
  </sca>

  <syscheck>
    <disabled>no</disabled>
    <frequency>43200</frequency>

    <directories recursion_level="0" restrict="regedit.exe$|system.ini$|win.ini$">%WINDIR%</directories>
    <directories recursion_level="0" restrict="at.exe$|attrib.exe$|cacls.exe$|cmd.exe$|eventcreate.exe$|ftp.exe$|lsass.exe$|net.exe$|net1.exe$|netsh.exe$|reg.exe$|regedt32.exe|regsvr32.exe|runas.exe|sc.exe|schtasks.exe|sethc.exe|subst.exe$">%WINDIR%\\SysNative</directories>
    <directories recursion_level="0">%WINDIR%\\SysNative\\drivers\\etc</directories>
    <directories recursion_level="0" restrict="WMIC.exe$">%WINDIR%\\SysNative\\wbem</directories>
    <directories recursion_level="0" restrict="powershell.exe$">%WINDIR%\\SysNative\\WindowsPowerShell\\v1.0</directories>
    <directories recursion_level="0" restrict="winrm.vbs$">%WINDIR%\\SysNative</directories>
    <directories recursion_level="0" restrict="at.exe$|attrib.exe$|cacls.exe$|cmd.exe$|eventcreate.exe$|ftp.exe$|lsass.exe$|net.exe$|net1.exe$|netsh.exe$|reg.exe$|regedit.exe$|regedt32.exe$|regsvr32.exe$|runas.exe$|sc.exe$|schtasks.exe$|sethc.exe$|subst.exe$">%WINDIR%\\System32</directories>
    <directories recursion_level="0">%WINDIR%\\System32\\drivers\\etc</directories>
    <directories recursion_level="0" restrict="WMIC.exe$">%WINDIR%\\System32\\wbem</directories>
    <directories recursion_level="0" restrict="powershell.exe$">%WINDIR%\\System32\\WindowsPowerShell\\v1.0</directories>
    <directories recursion_level="0" restrict="winrm.vbs$">%WINDIR%\\System32</directories>
    <directories realtime="yes">%PROGRAMDATA%\\Microsoft\\Windows\\Start Menu\\Programs\\Startup</directories>

    <ignore>%PROGRAMDATA%\\Microsoft\\Windows\\Start Menu\\Programs\\Startup\\desktop.ini</ignore>
    <ignore type="sregex">.log$|.htm$|.jpg$|.png$|.chm$|.pnf$|.evtx$</ignore>

    <frequency>300</frequency>
    <windows_registry arch="both">HKEY_LOCAL_MACHINE\\Software\\Microsoft\\Windows\\CurrentVersion\\Run</windows_registry>
    <windows_registry arch="both">HKEY_LOCAL_MACHINE\\Software\\Microsoft\\Windows\\CurrentVersion\\RunOnce</windows_registry>

    <registry_ignore>HKEY_LOCAL_MACHINE\\Security\\Policy\\Secrets</registry_ignore>
    <registry_ignore>HKEY_LOCAL_MACHINE\\Security\\SAM\\Domains\\Account\\Users</registry_ignore>
    <registry_ignore type="sregex">\\Enum$</registry_ignore>
    <registry_ignore>HKEY_LOCAL_MACHINE\\System\\CurrentControlSet\\Services\\MpsSvc\\Parameters\\AppCs</registry_ignore>
    <registry_ignore>HKEY_LOCAL_MACHINE\\System\\CurrentControlSet\\Services\\MpsSvc\\Parameters\\PortKeywords\\DHCP</registry_ignore>
    <registry_ignore>HKEY_LOCAL_MACHINE\\System\\CurrentControlSet\\Services\\MpsSvc\\Parameters\\PortKeywords\\IPTLSIn</registry_ignore>
    <registry_ignore>HKEY_LOCAL_MACHINE\\System\\CurrentControlSet\\Services\\MpsSvc\\Parameters\\PortKeywords\\IPTLSOut</registry_ignore>
    <registry_ignore>HKEY_LOCAL_MACHINE\\System\\CurrentControlSet\\Services\\MpsSvc\\Parameters\\PortKeywords\\RPC-EPMap</registry_ignore>
    <registry_ignore>HKEY_LOCAL_MACHINE\\System\\CurrentControlSet\\Services\\MpsSvc\\Parameters\\PortKeywords\\Teredo</registry_ignore>
    <registry_ignore>HKEY_LOCAL_MACHINE\\System\\CurrentControlSet\\Services\\PolicyAgent\\Parameters\\Cache</registry_ignore>
    <registry_ignore>HKEY_LOCAL_MACHINE\\System\\CurrentControlSet\\Services\\ADOVMPPackage\\Final</registry_ignore>

    <windows_audit_interval>60</windows_audit_interval>
    <process_priority>10</process_priority>
    <max_eps>50</max_eps>

    <synchronization>
      <enabled>yes</enabled>
      <interval>5m</interval>
      <max_eps>10</max_eps>
    </synchronization>
  </syscheck>

  <wodle name="syscollector">
    <disabled>no</disabled>
    <interval>1h</interval>
    <scan_on_start>yes</scan_on_start>
    <hardware>yes</hardware>
    <os>yes</os>
    <network>yes</network>
    <packages>yes</packages>
    <ports all="no">yes</ports>
    <processes>yes</processes>
    <synchronization>
      <max_eps>10</max_eps>
    </synchronization>
  </wodle>

  <wodle name="cis-cat">
    <disabled>yes</disabled>
    <timeout>1800</timeout>
    <interval>1d</interval>
    <scan-on-start>yes</scan-on-start>
    <java_path>\\server\jre\bin\java.exe</java_path>
    <ciscat_path>C:\cis-cat</ciscat_path>
  </wodle>

  <wodle name="osquery">
    <disabled>yes</disabled>
    <run_daemon>yes</run_daemon>
    <bin_path>C:\Program Files\osquery\osqueryd</bin_path>
    <log_path>C:\Program Files\osquery\log\osqueryd.results.log</log_path>
    <config_path>C:\Program Files\osquery\osquery.conf</config_path>
    <add_labels>yes</add_labels>
  </wodle>

  <wodle name="eventchannel">
   <enabled>yes</enabled>
   <read_interval>5</read_interval>
   <location>Security</location>
   <query>Event/System[EventID=1102]</query>
  </wodle>

  <active-response>
    <disabled>no</disabled>
    <ca_store>wpk_root.pem</ca_store>
    <ca_verification>yes</ca_verification>
  </active-response>

  <logging>
    <log_format>plain</log_format>
  </logging>

</ossec_config>
``` 