# Local Rules (Wazuh)

Hieronder vind je de lokale regels voor Wazuh, zoals gebruikt in deze implementatie:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<rules>

  <!-- Brute force detection -->
  <group name="windows_brute_force">
    <rule id="100100" level="10" frequency="3" timeframe="120">
      <if_matched_sid>60122</if_matched_sid>
      <description>Possible Windows Brute Force: 3 failed logons in 2 minutes</description>
    </rule>
  </group>

  <!-- Sysmon Event ID 7 detection -->
  <group name="sysmon_eid7_detections">
    <rule id="92154" level="4">
      <if_group>sysmon_event7</if_group>
      <field name="win.eventdata.imageLoaded" type="pcre2">(?i)taskschd\.dll</field>
      <options>no_full_log</options>
      <description>Process loaded taskschd.dll module. May be used to create delayed malware execution</description>
      <mitre>
        <id>T1053.005</id>
      </mitre>
    </rule>
  </group>

  <!-- Sysmon Event ID 11 detection -->
  <group name="sysmon_eid11_detections">
    <rule id="92213" level="15">
      <if_group>sysmon_event_11</if_group>
      <field name="win.eventdata.targetFilename" type="pcre2">(?i)[c-z]:\\Users\\.+\\AppData\\Local\\Temp\\.+\.(exe|com|dll|vbs|js|bat|cmd|pif|wsh|ps1|msi|vbe)</field>
      <options>no_full_log</options>
      <description>Executable file dropped in folder commonly used by malware</description>
      <mitre>
        <id>T1105</id>
      </mitre>
    </rule>
  </group>

  <!-- Credential Dumping and Credential Access -->
  <group name="windows_credential_attacks">
    <rule id="100010" level="10">
      <if_sid>61609</if_sid>
      <field name="win.eventdata.image" type="pcre2">(?i)\\rundll32.exe</field>
      <field name="win.eventdata.imageLoaded" type="pcre2">(?i)[c-z]:\\Windows\\System32\\comsvcs\.dll</field>
      <description>Possible adversary activity - LSASS memory dump via rundll32 and comsvcs.dll</description>
      <mitre><id>T1003.001</id></mitre>
    </rule>

    <rule id="100011" level="10">
      <if_sid>61613</if_sid>
      <field name="win.eventData.targetFilename" type="pcre2">(?i)\\[^\\]*\.dmp$</field>
      <field name="win.eventData.image" negate="yes" type="pcre2">(?i)\\lsass.*</field>
      <description>Possible LSASS memory dump - .dmp file created not by lsass</description>
      <mitre><id>T1003.001</id></mitre>
    </rule>

    <rule id="100012" level="10">
      <if_sid>61603</if_sid>
      <field name="win.eventData.Image" type="pcre2">(?i)\\rundll32.exe</field>
      <field name="win.eventData.commandLine" type="pcre2">keymgr.dll,KRShowKeyMgr</field>
      <description>Credential Manager access via rundll32</description>
      <mitre><id>T1003</id></mitre>
    </rule>

    <rule id="100013" level="10">
      <if_sid>92052</if_sid>
      <field name="win.eventData.image" type="pcre2">(?i)\\vaultcmd.exe</field>
      <field name="win.eventData.commandLine" type="pcre2">list</field>
      <description>Credential listing attempt via vaultcmd</description>
      <mitre><id>T1003</id></mitre>
    </rule>
  </group>

  <!-- BloodHound/SharpHound detection -->
  <group name="sharphound">
    <rule id="111151" level="7">
      <if_sid>61603</if_sid>
      <field name="win.eventdata.company" type="pcre2">^SpecterOps$</field>
      <description>SharpHound binary executed</description>
      <mitre><id>T1033</id></mitre>
    </rule>

    <rule id="111152" level="12">
      <if_sid>61603</if_sid>
      <field name="win.eventdata.parentImage" type="pcre2">(?i)[c-z]:\\Windows\\System32\\.+\\(powershell|cmd)\.exe</field>
      <field name="win.eventdata.commandLine" type="pcre2">(?i)((--CollectionMethods\s)((.+){1,12})|(\s(--Loop)))</field>
      <description>SharpHound CollectionMethods flag detected</description>
      <mitre><id>T1059.00</id><id>T1033</id></mitre>
    </rule>

    <rule id="111153" level="12">
      <if_sid>61603</if_sid>
      <field name="win.eventdata.parentImage" type="pcre2">(?i)[c-z]:\\Windows\\System32\\.+\\(powershell|cmd)\.exe</field>
      <field name="win.eventdata.commandLine" type="pcre2">(?i)((invoke-bloodhound\s)|(get-bloodHounddata\s))</field>
      <description>SharpHound PowerShell cmdlet detected</description>
      <mitre><id>T1059.00</id><id>T1033</id></mitre>
    </rule>
  </group>

  <!-- Custom rules -->
  <group name="custom_rules">
    <rule id="100111" level="5">
      <if_sid>60106</if_sid>
      <time>6 pm - 8:30 am</time>
      <description>Windows Logon Success outside office hours</description>
      <options>no_full_log</options>
    </rule>

    <rule id="100112" level="8">
      <if_sid>92651</if_sid>
      <field name="win.eventdata.ipAddress" type="pcre2">^192\.168\.56\.([1-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-4])$</field>
      <description>Remote Logon from unknown network</description>
    </rule>

    <rule id="100113" level="5">
      <if_sid>60009</if_sid>
      <field name="win.eventdata.contextInfo" type="pcre2">\bGet-ADGroupMember\b *</field>
      <description>Get-ADGroupMember PowerShell executed</description>
    </rule>
  </group>

</rules>

``` 