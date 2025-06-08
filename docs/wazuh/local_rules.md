# Local Rules (Wazuh)

Hieronder vind je de lokale regels voor Wazuh, zoals gebruikt in deze implementatie:

```xml
<group name="local">

  <!-- SSHD brute-force vanaf bekend IP (voorbeeld UNIX) -->
  <rule id="100001" level="5">
    <if_sid>5716</if_sid>
    <srcip>1.1.1.1</srcip>
    <description>sshd: authentication failed from IP 1.1.1.1.</description>
    <group>authentication_failed,pci_dss_10.2.4,pci_dss_10.2.5</group>
  </rule>

</group>

<group name="rdp">

  <!-- Herhaalde RDP-aanmeldingen -->
  <rule id="100002" level="10" frequency="3" timeframe="120">
    <if_matched_sid>60122</if_matched_sid>
    <description>RDP Attack Detected</description>
  </rule>

</group>

<group name="apache">

  <!-- Apache: verboden bestandspad geprobeerd -->
  <rule id="100003" level="5">
    <if_sid>30101</if_sid>
    <match>denied by server configuration</match>
    <description>Apache: Attempt to access forbidden file or directory.</description>
    <group>access_denied</group>
  </rule>

</group>

<group name="windows,windows_security">

  <!-- Password reset attempt (Event ID 4724) -->
  <rule id="100004" level="8">
    <if_sid>60103</if_sid>
    <field name="win.system.eventID">^4724$</field>
    <description>Attempt to reset password for: $(win.eventdata.TargetUserName).</description>
    <options>no_full_log</options>
  </rule>

  <!-- Aanmaken van nieuw gebruikersaccount (Event ID 4720) -->
  <rule id="100005" level="8">
    <field name="win.system.eventID">4720</field>
    <description>New user account created: $(win.eventdata.TargetUserName).</description>
  </rule>

  <!-- Auditlog gewist (Event ID 1102) -->
  <rule id="100006" level="10">
    <field name="win.system.eventID">1102</field>
    <description>The audit log was cleared. Mogelijke poging om sporen te wissen.</description>
  </rule>

</group>

<group name="windows,powershell">

  <!-- Start van PowerShell (Event ID 4688) -->
  <rule id="100007" level="10">
    <field name="win.system.eventID">4688</field>
    <field name="win.eventdata.NewProcessName">(?i).*\\powershell.exe$|.*\\pwsh.exe$</field>
    <description>PowerShell-process gestart via Event ID 4688</description>
  </rule>

</group>

<group name="windows,registry">

  <!-- Wijziging aan Run registry key -->
  <rule id="100008" level="10">
    <if_sid>598</if_sid>
    <description>Nieuwe waarde toegevoegd aan Windows Run registry key. Mogelijke persistente aanval.</description>
    <mitre>
      <id>T1547.001</id>
    </mitre>
  </rule>

</group>

<group name="Windows,attack,">
  <!-- Detecting an LSASS memory dumping attack using Rundll32.exe Minidump Function or Comsvcs.dll Exploitation -->
  <rule id="100010" level="10">
    <if_sid>61609</if_sid>
    <field name="win.eventdata.image" type="pcre2">(?i)\\\\rundll32.exe</field>
    <field name="win.eventdata.imageLoaded" type="pcre2">(?i)[c-z]:\\\\Windows\\\\System32\\\\comsvcs\.dll</field>
    <description>Possible adversary activity - LSASS memory dump: $(win.eventdata.imageLoaded) loaded by using $(win.eventData.image) on $(win.system.computer).</description>
    <mitre>
      <id>T1003.001</id>
    </mitre>
  </rule>

  <!-- Detecting an LSASS memory dumping attack using specialized tools -->
  <rule id="100011" level="10">
    <if_sid>61613</if_sid>
    <field name="win.eventData.targetFilename" type="pcre2">(?i)\\\\[^\\]*\.dmp$</field>
    <field name="win.eventData.image" negate="yes" type="pcre2">(?i)\\\\lsass.*</field>
    <description>Possible adversary activity - LSASS memory dump: $(win.eventdata.image) created a new file on $(win.system.computer) endpoint.</description>
    <mitre>
      <id>T1003.001</id>
    </mitre>
  </rule>

  <!-- Detecting a Windows Credential Manager exploitation attack -->
  <rule id="100012" level="10">
    <if_sid>61603</if_sid>
    <field name="win.eventData.Image" type="pcre2">(?i)\\\\rundll32.exe</field>
    <field name="win.eventData.commandLine" type="pcre2">keymgr.dll,KRShowKeyMgr</field>
    <description>Possible adversary activity - Credential Manager Access via $(win.eventData.Image) on $(win.system.computer) endpoint.</description>
    <mitre>
      <id>T1003</id>
    </mitre>
  </rule>

  <!--  Detecting a Windows Credential Manager exploitation attack by VaultCmd process enumeration -->
  <rule id="100013" level="10">
    <if_sid>92052</if_sid>
    <field name="win.eventData.image" type="pcre2">(?i)\\\\vaultcmd.exe</field>
    <field name="win.eventData.commandLine" type="pcre2">list</field>
    <description>Possible adversary activity - Attempt to list credentials via $(win.eventData.Image) on $(win.system.computer) endpoint.</description>
    <mitre>
      <id>T1003</id>
    </mitre>
  </rule>

</group>
``` 