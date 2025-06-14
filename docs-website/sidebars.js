// @ts-check

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.

 @type {import('@docusaurus/plugin-content-docs').SidebarsConfig}
 */
const sidebars = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  tutorialSidebar: [{type: 'autogenerated', dirName: '.'}],

  // But you can create a sidebar manually
  /*
  tutorialSidebar: [
    'intro',
    'hello',
    {
      type: 'category',
      label: 'Tutorial',
      items: ['tutorial-basics/create-a-document'],
    },
  ],
   */

  docs: [
    {
      type: 'category',
      label: 'Projectdocumentatie',
      items: [
        // Voeg deze toe als de bestanden zijn gemigreerd:
        'functioneel_ontwerp',
        'technisch_ontwerp',
        'onderzoekresultaten',
        'Installatie_en_Configuratie',
        'testen_van_de_usecases',
      ],
    },
    {
      type: 'category',
      label: 'Wazuh Configuratie',
      items: [
        'wazuh/agent_configuratie',
        'wazuh/local_rules',
        'wazuh/docker_compose',
        'wazuh/dashboard',
        'wazuh/deploy_windows_agent',
        'wazuh/windows_agent_ossec_conf',
        'wazuh/sysmonconfig',
      ],
    },
  ],
};

export default sidebars;
