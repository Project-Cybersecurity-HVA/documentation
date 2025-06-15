const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const { PDFDocument } = require('pdf-lib');

// Function to recursively get all markdown files
function getAllMarkdownFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      getAllMarkdownFiles(filePath, fileList);
    } else if (file.endsWith('.md')) {
      // Skip sysmonconfig.md as it's too large
      if (file === 'sysmonconfig.md') {
        console.log('Skipping sysmonconfig.md as it is too large');
        return;
      }
      
      // Convert file path to URL path
      const relativePath = path.relative(path.join(__dirname, '../docs'), filePath);
      const urlPath = '/documentation/docs/' + relativePath.replace(/\\/g, '/').replace('.md', '');
      fileList.push(urlPath);
    }
  });
  
  return fileList;
}

async function waitForPageLoad(page) {
  try {
    console.log('Waiting for content to load...');
    
    // Wait for either the article or main content to be present
    await Promise.race([
      page.waitForSelector('article', { timeout: 120000 }), // 2 minutes
      page.waitForSelector('main', { timeout: 120000 })
    ]);
    
    console.log('Content loaded, waiting for images...');
    
    // Wait for all images to load
    await page.evaluate(async () => {
      const selectors = Array.from(document.getElementsByTagName('img'));
      console.log(`Found ${selectors.length} images to load`);
      await Promise.all(selectors.map(img => {
        if (img.complete) return;
        return new Promise((resolve, reject) => {
          img.addEventListener('load', resolve);
          img.addEventListener('error', reject);
        });
      }));
    });

    // Additional wait to ensure content is rendered
    console.log('Waiting additional time for rendering...');
    await page.waitForTimeout(10000); // 10 seconds
  } catch (error) {
    console.warn('Warning: Timeout waiting for content, proceeding anyway...');
  }
}

// Function to safely write file with retries
async function safeWriteFile(filePath, data, maxRetries = 5) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      // If file exists, try to remove it first
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      fs.writeFileSync(filePath, data);
      return true;
    } catch (error) {
      if (error.code === 'EBUSY') {
        console.log(`File is busy, attempt ${i + 1} of ${maxRetries}. Waiting...`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
        continue;
      }
      throw error;
    }
  }
  throw new Error(`Failed to write file after ${maxRetries} attempts`);
}

async function generatePDF() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process',
      '--js-flags="--max-old-space-size=4096"'
    ]
  });

  try {
    const page = await browser.newPage();
    
    // Set viewport to A4 size
    await page.setViewport({
      width: 1200,
      height: 1600,
    });

    // Enable request interception to handle images
    await page.setRequestInterception(true);
    page.on('request', (request) => {
      request.continue();
    });

    // Get all markdown files
    const docsDir = path.join(__dirname, '../docs');
    const pages = getAllMarkdownFiles(docsDir);
    
    console.log('Found the following pages to process:');
    pages.forEach(page => console.log(page));

    // Create PDF buffer array
    const pdfBuffers = [];

    // Process each page
    for (const pageUrl of pages) {
      console.log(`Processing ${pageUrl}...`);
      
      try {
        // Navigate to the page with increased timeout
        const fullUrl = `http://localhost:3000${pageUrl}`;
        console.log(`Navigating to: ${fullUrl}`);
        
        // Set longer timeout for navigation
        await page.setDefaultNavigationTimeout(300000); // 5 minutes
        
        await page.goto(fullUrl, {
          waitUntil: 'networkidle0',
          timeout: 300000 // 5 minutes
        });

        // Wait for page content and images
        await waitForPageLoad(page);

        // Generate PDF for this page
        console.log('Generating PDF for page...');
        const pdfBuffer = await page.pdf({
          format: 'A4',
          printBackground: true,
          margin: {
            top: '20px',
            right: '20px',
            bottom: '20px',
            left: '20px',
          },
          preferCSSPageSize: true,
        });

        pdfBuffers.push(pdfBuffer);
        console.log(`Successfully processed ${pageUrl}`);
      } catch (error) {
        console.error(`Error processing ${pageUrl}:`, error.message);
        // Continue with next page instead of failing completely
        continue;
      }
    }

    if (pdfBuffers.length === 0) {
      throw new Error('No PDFs were generated successfully');
    }

    // Combine PDFs
    console.log('Combining PDFs...');
    const mergedPdf = await PDFDocument.create();

    for (const pdfBuffer of pdfBuffers) {
      const pdf = await PDFDocument.load(pdfBuffer);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    // Save the merged PDF with retry logic
    console.log('Saving final PDF...');
    const mergedPdfFile = await mergedPdf.save();
    const outputPath = path.join(__dirname, '../static/documentation.pdf');
    
    try {
      await safeWriteFile(outputPath, mergedPdfFile);
      console.log('PDF generated successfully!');
    } catch (error) {
      console.error('Error saving PDF:', error.message);
      // Try alternative filename
      const altPath = path.join(__dirname, '../static/documentation_new.pdf');
      await safeWriteFile(altPath, mergedPdfFile);
      console.log('PDF saved as documentation_new.pdf instead');
    }
  } catch (error) {
    console.error('Error generating PDF:', error);
  } finally {
    await browser.close();
  }
}

generatePDF(); 