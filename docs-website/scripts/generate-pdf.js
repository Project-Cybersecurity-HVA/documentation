const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

// List of all documentation pages to include
const pages = [
  '/docs/testen_van_de_usecases',
  '/docs/onderzoekresultaten',
  '/docs/technisch_ontwerp',
  '/docs/functioneel_ontwerp',
  '/docs/Installatie_en_Configuratie',
  '/docs/wazuh/windows_agent_ossec_conf',
  '/docs/wazuh/deploy_windows_agent',
  '/docs/wazuh/agent_configuratie',
  '/docs/wazuh/dashboard',
  '/docs/wazuh/docker_compose',
  '/docs/wazuh/local_rules'
];

async function generatePDF() {
  const browser = await puppeteer.launch({
    headless: 'new',
  });

  try {
    const page = await browser.newPage();
    
    // Set viewport to A4 size
    await page.setViewport({
      width: 1200,
      height: 1600,
    });

    // Create PDF buffer array
    const pdfBuffers = [];

    // Process each page
    for (const pageUrl of pages) {
      console.log(`Processing ${pageUrl}...`);
      
      // Navigate to the page
      await page.goto(`http://localhost:3000${pageUrl}`, {
        waitUntil: 'networkidle0',
      });

      // Wait for content to be fully loaded
      await page.waitForSelector('article');

      // Generate PDF for this page
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20px',
          right: '20px',
          bottom: '20px',
          left: '20px',
        },
      });

      pdfBuffers.push(pdfBuffer);
    }

    // Combine PDFs
    const { PDFDocument } = require('pdf-lib');
    const mergedPdf = await PDFDocument.create();

    for (const pdfBuffer of pdfBuffers) {
      const pdf = await PDFDocument.load(pdfBuffer);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    // Save the merged PDF
    const mergedPdfFile = await mergedPdf.save();
    fs.writeFileSync(
      path.join(__dirname, '../static/documentation.pdf'),
      mergedPdfFile
    );

    console.log('PDF generated successfully!');
  } catch (error) {
    console.error('Error generating PDF:', error);
  } finally {
    await browser.close();
  }
}

generatePDF(); 