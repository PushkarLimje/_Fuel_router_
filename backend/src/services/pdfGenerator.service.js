// backend/src/services/pdfGenerator.service.js
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export async function generateRoutePDF(reportData) {
  return new Promise((resolve, reject) => {
    try {
      // Create PDF document
      const doc = new PDFDocument({ margin: 50 });
      
      // Create temporary file path
      const fileName = `report_${Date.now()}.pdf`;
      const filePath = path.join(process.cwd(), 'temp', fileName);
      
      // Ensure temp directory exists
      if (!fs.existsSync(path.join(process.cwd(), 'temp'))) {
        fs.mkdirSync(path.join(process.cwd(), 'temp'), { recursive: true });
      }
      
      // Pipe PDF to file
      const writeStream = fs.createWriteStream(filePath);
      doc.pipe(writeStream);

      // Add content to PDF
      // Header
      doc.fontSize(24)
         .fillColor('#2563eb')
         .text('Route Report', { align: 'center' });
      
      doc.moveDown();
      doc.fontSize(10)
         .fillColor('#666')
         .text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' });
      
      doc.moveDown(2);

      // Route Information
      doc.fontSize(16)
         .fillColor('#000')
         .text('Route Information', { underline: true });
      
      doc.moveDown(0.5);
      doc.fontSize(12);
      
      addLabelValue(doc, 'From:', reportData.source);
      addLabelValue(doc, 'To:', reportData.destination);
      addLabelValue(doc, 'Distance:', `${reportData.distance} km`);
      
      const hours = Math.floor(reportData.duration / 60);
      const mins = reportData.duration % 60;
      const durationText = hours > 0 ? `${hours}h ${mins}min` : `${mins} min`;
      addLabelValue(doc, 'Duration:', durationText);
      
      doc.moveDown(2);

      // Fuel Details
      doc.fontSize(16)
         .fillColor('#000')
         .text('Fuel Details', { underline: true });
      
      doc.moveDown(0.5);
      doc.fontSize(12);
      
      addLabelValue(doc, 'Fuel Used:', `${reportData.fuelUsed} L`);
      addLabelValue(doc, 'Fuel Cost:', `₹${reportData.fuelCost}`);
      addLabelValue(doc, 'Average Mileage:', `${reportData.avgMileage} km/L`);
      
      doc.moveDown(2);

      // Summary Box
      doc.rect(50, doc.y, 500, 80)
         .fillAndStroke('#e0f2fe', '#2563eb');
      
      doc.fillColor('#000')
         .fontSize(14)
         .text('Total Trip Cost', 60, doc.y - 70, { width: 480 });
      
      doc.fontSize(24)
         .fillColor('#2563eb')
         .text(`₹${reportData.fuelCost}`, 60, doc.y + 10, { width: 480, align: 'center' });

      doc.moveDown(4);

      // Footer
      doc.fontSize(8)
         .fillColor('#999')
         .text('Fuel Map Router - Route Management System', { align: 'center' });

      // Finalize PDF
      doc.end();

      writeStream.on('finish', () => {
        resolve(filePath);
      });

      writeStream.on('error', (error) => {
        reject(error);
      });

    } catch (error) {
      reject(error);
    }
  });
}

// Helper function to add label-value pairs
function addLabelValue(doc, label, value) {
  const y = doc.y;
  doc.fillColor('#666')
     .text(label, { continued: true, width: 150 })
     .fillColor('#000')
     .text(value);
  doc.moveDown(0.5);
}