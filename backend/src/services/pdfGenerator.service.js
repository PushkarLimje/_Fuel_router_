// backend/src/services/pdfGenerator.service.js
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export async function generateRoutePDF(reportData) {
  return new Promise((resolve, reject) => {
    try {
      console.log("📝 PDF Generator received data");
      
      // Create PDF document
      const doc = new PDFDocument({ 
        margin: 50,
        size: 'A4'
      });
      
      const fileName = `receipt_${Date.now()}.pdf`;
      const filePath = path.join(process.cwd(), 'temp', fileName);
      
      // Ensure temp directory exists
      if (!fs.existsSync(path.join(process.cwd(), 'temp'))) {
        fs.mkdirSync(path.join(process.cwd(), 'temp'), { recursive: true });
      }
      
      const writeStream = fs.createWriteStream(filePath);
      doc.pipe(writeStream);

      // Extract values with safe defaults
      const receiptId = reportData.receiptId || 'N/A';
      const userName = reportData.userName || 'N/A';
      const vehicleNumber = reportData.userVehicle?.number || 'N/A';
      const vehicleFuelType = reportData.userVehicle?.fuelType || 'N/A';
      
      const stationName = reportData.fuelStation?.name || 'N/A';
      const stationBrand = reportData.fuelStation?.brand || 'N/A';
      const stationAddress = reportData.fuelStation?.address || 'N/A';
      
      const transFuelType = reportData.transaction?.fuelType || 'N/A';
      const fuelUsed = reportData.fuelUsed || 0;
      const pricePerUnit = reportData.transaction?.pricePerUnit || 0;
      const subtotal = reportData.transaction?.totalCost || reportData.fuelCost || 0;
      const gstAmount = (subtotal * 0.05).toFixed(2);
      const grandTotal = reportData.transaction?.grandTotal || (subtotal * 1.05).toFixed(2);
      const paymentMode = reportData.transaction?.paymentMode || 'N/A';
      
      const tripId = reportData.tripContext?.tripId || 'N/A';
      const source = reportData.source || 'N/A';
      const destination = reportData.destination || 'N/A';
      const distance = reportData.distance || 0;
      const routeType = reportData.tripContext?.routeType || 'Eco';
      const avgMileage = reportData.avgMileage || 0;
      const co2Saved = reportData.tripContext?.co2SavedKg || 0;

      const pageWidth = doc.page.width;
      const pageHeight = doc.page.height;
      const margin = 50;

      // ===== HEADER =====
      doc.rect(0, 0, pageWidth, 120)
         .fill('#2563eb');
      
      doc.fontSize(28)
         .fillColor('#ffffff')
         .font('Helvetica-Bold')
         .text('FUEL RECEIPT', 0, 25, { align: 'center', width: pageWidth });
      
      doc.fontSize(10)
         .fillColor('#bfdbfe')
         .font('Helvetica')
         .text(`Receipt ID: ${receiptId}`, 0, 65, { align: 'center', width: pageWidth });
      
      const generatedDate = new Date().toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      doc.text(`Generated: ${generatedDate}`, 0, 85, { align: 'center', width: pageWidth });

      // Start content below header
      let yPos = 140;

      // ===== CUSTOMER INFORMATION =====
      yPos = addSection(doc, '👤 Customer Information', yPos, [
        { label: 'Name', value: userName },
        { label: 'Vehicle', value: vehicleNumber },
        { label: 'Fuel Type', value: vehicleFuelType }
      ]);

      // ===== FUEL STATION =====
      if (reportData.fuelStation) {
        yPos = addSection(doc, '⛽ Fuel Station', yPos, [
          { label: 'Station', value: stationName },
          { label: 'Brand', value: stationBrand },
          { label: 'Location', value: stationAddress }
        ]);
      }

      // ===== TRANSACTION DETAILS =====
      yPos = addSection(doc, '💳 Transaction', yPos, [
        { label: 'Fuel Type', value: transFuelType },
        { label: 'Quantity', value: `${fuelUsed} L` },
        { label: 'Price/Liter', value: `₹${pricePerUnit}` },
        { label: 'Subtotal', value: `₹${subtotal}` },
        { label: 'GST (5%)', value: `₹${gstAmount}` },
        { label: 'Payment', value: paymentMode }
      ]);

      // ===== TRIP INFORMATION =====
      yPos = addSection(doc, '🚗 Trip Details', yPos, [
        { label: 'Trip ID', value: tripId },
        { label: 'From', value: source },
        { label: 'To', value: destination },
        { label: 'Distance', value: `${distance} km` },
        { label: 'Route Type', value: routeType },
        { label: 'Mileage', value: `${avgMileage} km/L` },
        { label: 'CO₂ Saved', value: `${co2Saved} kg` }
      ]);

      // ===== GRAND TOTAL BOX =====
      yPos += 10;
      const totalBoxHeight = 70;
      
      doc.rect(margin, yPos, pageWidth - (margin * 2), totalBoxHeight)
         .fillAndStroke('#dcfce7', '#16a34a');

      doc.fontSize(14)
         .fillColor('#15803d')
         .font('Helvetica-Bold')
         .text('GRAND TOTAL', margin, yPos + 15, { 
           width: pageWidth - (margin * 2),
           align: 'center' 
         });
      
      doc.fontSize(32)
         .fillColor('#16a34a')
         .text(`₹${grandTotal}`, margin, yPos + 35, { 
           width: pageWidth - (margin * 2),
           align: 'center' 
         });

      // ===== FOOTER =====
      const footerY = pageHeight - 60;
      
      doc.moveTo(margin, footerY)
         .lineTo(pageWidth - margin, footerY)
         .strokeColor('#cbd5e1')
         .lineWidth(1)
         .stroke();

      doc.fontSize(11)
         .fillColor('#16a34a')
         .font('Helvetica-Bold')
         .text('Thank you for driving green! 🌱', margin, footerY + 10, { 
           width: pageWidth - (margin * 2),
           align: 'center' 
         });
      
      doc.fontSize(9)
         .fillColor('#64748b')
         .font('Helvetica')
         .text('Support: support@smartfuel.ai', margin, footerY + 30, { 
           width: pageWidth - (margin * 2),
           align: 'center' 
         });

      doc.end();

      writeStream.on('finish', () => {
        console.log("✅ PDF write stream finished");
        resolve(filePath);
      });

      writeStream.on('error', (error) => {
        console.error("❌ PDF write stream error:", error);
        reject(error);
      });

    } catch (error) {
      console.error("❌ PDF generation error:", error.message);
      reject(error);
    }
  });
}

// Helper function to add a section
function addSection(doc, title, startY, items) {
  const margin = 50;
  const pageWidth = doc.page.width;
  const contentWidth = pageWidth - (margin * 2);
  
  // Section title
  doc.fontSize(13)
     .fillColor('#1e40af')
     .font('Helvetica-Bold')
     .text(title, margin, startY);
  
  let currentY = startY + 20;
  
  // Background box
  const boxHeight = items.length * 22 + 20;
  doc.rect(margin, currentY, contentWidth, boxHeight)
     .fillAndStroke('#f8fafc', '#e2e8f0');
  
  currentY += 10;
  
  // Add items
  items.forEach((item) => {
    // Label (left side)
    doc.fontSize(10)
       .fillColor('#64748b')
       .font('Helvetica')
       .text(item.label + ':', margin + 15, currentY, { 
         width: contentWidth / 2,
         continued: false 
       });
    
    // Value (right side, aligned right)
    doc.fontSize(10)
       .fillColor('#1e293b')
       .font('Helvetica')
       .text(item.value, margin + contentWidth / 2, currentY, {
         width: contentWidth / 2 - 15,
         align: 'right'
       });
    
    currentY += 22;
  });
  
  // Return next Y position
  return currentY + 20;
}

// // backend/src/services/pdfGenerator.service.js
// import PDFDocument from 'pdfkit';
// import fs from 'fs';
// import path from 'path';

// export async function generateRoutePDF(reportData) {
//   return new Promise((resolve, reject) => {
//     try {
//       const doc = new PDFDocument({ margin: 50 });
      
//       const fileName = `receipt_${Date.now()}.pdf`;
//       const filePath = path.join(process.cwd(), 'temp', fileName);
      
//       if (!fs.existsSync(path.join(process.cwd(), 'temp'))) {
//         fs.mkdirSync(path.join(process.cwd(), 'temp'), { recursive: true });
//       }
      
//       const writeStream = fs.createWriteStream(filePath);
//       doc.pipe(writeStream);

//       // ⭐ FUEL RECEIPT HEADER
//       doc.fontSize(26)
//          .fillColor('#2563eb')
//          .text('FUEL RECEIPT', { align: 'center' });
      
//       doc.moveDown(0.5);
//       doc.fontSize(10)
//          .fillColor('#666')
//          .text(`Receipt ID: ${reportData.receiptId || 'N/A'}`, { align: 'center' })
//          .text(`Generated: ${new Date().toLocaleString()}`, { align: 'center' });
      
//       doc.moveDown(2);

//       // ⭐ USER INFORMATION
//       doc.fontSize(16).fillColor('#000').text('Customer Information', { underline: true });
//       doc.moveDown(0.5);
//       doc.fontSize(12);
//       addLabelValue(doc, 'Name:', reportData.userName || 'N/A');
//       addLabelValue(doc, 'Vehicle:', reportData.userVehicle?.number || 'N/A');
//       addLabelValue(doc, 'Fuel Type:', reportData.userVehicle?.fuelType || 'N/A');
      
//       doc.moveDown(1.5);

//       // ⭐ FUEL STATION DETAILS
//       if (reportData.fuelStation) {
//         doc.fontSize(16).fillColor('#000').text('Fuel Station', { underline: true });
//         doc.moveDown(0.5);
//         doc.fontSize(12);
//         addLabelValue(doc, 'Station:', reportData.fuelStation.name || 'N/A');
//         addLabelValue(doc, 'Brand:', reportData.fuelStation.brand || 'N/A');
//         addLabelValue(doc, 'Location:', reportData.fuelStation.address || 'N/A');
//         doc.moveDown(1.5);
//       }

//       // ⭐ TRANSACTION DETAILS
//       doc.fontSize(16).fillColor('#000').text('Transaction Details', { underline: true });
//       doc.moveDown(0.5);
//       doc.fontSize(12);
//       addLabelValue(doc, 'Fuel Type:', reportData.transaction?.fuelType || 'N/A');
//       addLabelValue(doc, 'Quantity:', `${reportData.fuelUsed || 0} L`);
//       addLabelValue(doc, 'Price/Liter:', `₹${reportData.transaction?.pricePerUnit || 0}`);
      
//       // ⭐ FIX: Use fuelCost from reportData instead of transaction.totalCost
//       const subtotal = reportData.fuelCost || reportData.transaction?.totalCost || 0;
//       const gstAmount = (subtotal * 0.05).toFixed(2);
//       const grandTotal = reportData.transaction?.grandTotal || (subtotal * 1.05).toFixed(2);
      
//       addLabelValue(doc, 'Subtotal:', `₹${subtotal}`);
//       addLabelValue(doc, 'GST (5%):', `₹${gstAmount}`);
//       addLabelValue(doc, 'Payment Mode:', reportData.transaction?.paymentMode || 'N/A');
      
//       doc.moveDown(1.5);

//       // ⭐ TRIP INFORMATION
//       doc.fontSize(16).fillColor('#000').text('Trip Information', { underline: true });
//       doc.moveDown(0.5);
//       doc.fontSize(12);
//       addLabelValue(doc, 'Trip ID:', reportData.tripContext?.tripId || 'N/A');
//       addLabelValue(doc, 'From:', reportData.source || 'N/A');
//       addLabelValue(doc, 'To:', reportData.destination || 'N/A');
//       addLabelValue(doc, 'Distance:', `${reportData.distance || 0} km`);
//       addLabelValue(doc, 'Route Type:', reportData.tripContext?.routeType || 'Eco');
//       addLabelValue(doc, 'Avg Mileage:', `${reportData.avgMileage || 0} km/L`);
//       addLabelValue(doc, 'CO₂ Saved:', `${reportData.tripContext?.co2SavedKg || 0} kg`);
      
//       doc.moveDown(2);

//       // ⭐ GRAND TOTAL BOX
//       doc.rect(50, doc.y, 500, 80)
//          .fillAndStroke('#dcfce7', '#16a34a');
      
//       doc.fillColor('#000')
//          .fontSize(14)
//          .text('GRAND TOTAL', 60, doc.y - 70, { width: 480 });
      
//       doc.fontSize(28)
//          .fillColor('#16a34a')
//          .text(`₹${grandTotal}`, 60, doc.y + 10, { width: 480, align: 'center' });

//       doc.moveDown(4);

//       // Footer
//       doc.fontSize(8)
//          .fillColor('#999')
//          .text('Thank you for driving green! 🌱', { align: 'center' })
//          .text('Support: support@smartfuel.ai', { align: 'center' });

//       doc.end();

//       writeStream.on('finish', () => {
//         resolve(filePath);
//       });

//       writeStream.on('error', (error) => {
//         reject(error);
//       });

//     } catch (error) {
//       reject(error);
//     }
//   });
// }

// // Helper function to add label-value pairs
// function addLabelValue(doc, label, value) {
//   const y = doc.y;
//   doc.fillColor('#666')
//      .text(label, { continued: true, width: 150 })
//      .fillColor('#000')
//      .text(value);
//   doc.moveDown(0.5);
// }

// // backend/src/services/pdfGenerator.service.js
// import PDFDocument from 'pdfkit';
// import fs from 'fs';
// import path from 'path';

// export async function generateRoutePDF(reportData) {
//   return new Promise((resolve, reject) => {
//     try {
//       // Create PDF document
//       const doc = new PDFDocument({ margin: 50 });
      
//       // Create temporary file path
//       const fileName = `report_${Date.now()}.pdf`;
//       const filePath = path.join(process.cwd(), 'temp', fileName);
      
//       // Ensure temp directory exists
//       if (!fs.existsSync(path.join(process.cwd(), 'temp'))) {
//         fs.mkdirSync(path.join(process.cwd(), 'temp'), { recursive: true });
//       }
      
//       // Pipe PDF to file
//       const writeStream = fs.createWriteStream(filePath);
//       doc.pipe(writeStream);

//       // Add content to PDF
//       // Header
//       doc.fontSize(24)
//          .fillColor('#2563eb')
//          .text('Route Report', { align: 'center' });
      
//       doc.moveDown();
//       doc.fontSize(10)
//          .fillColor('#666')
//          .text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' });
      
//       doc.moveDown(2);

//       // Route Information
//       doc.fontSize(16)
//          .fillColor('#000')
//          .text('Route Information', { underline: true });
      
//       doc.moveDown(0.5);
//       doc.fontSize(12);
      
//       addLabelValue(doc, 'From:', reportData.source);
//       addLabelValue(doc, 'To:', reportData.destination);
//       addLabelValue(doc, 'Distance:', `${reportData.distance} km`);
      
//       const hours = Math.floor(reportData.duration / 60);
//       const mins = reportData.duration % 60;
//       const durationText = hours > 0 ? `${hours}h ${mins}min` : `${mins} min`;
//       addLabelValue(doc, 'Duration:', durationText);
      
//       doc.moveDown(2);

//       // Fuel Details
//       doc.fontSize(16)
//          .fillColor('#000')
//          .text('Fuel Details', { underline: true });
      
//       doc.moveDown(0.5);
//       doc.fontSize(12);
      
//       addLabelValue(doc, 'Fuel Used:', `${reportData.fuelUsed} L`);
//       addLabelValue(doc, 'Fuel Cost:', `₹${reportData.fuelCost}`);
//       addLabelValue(doc, 'Average Mileage:', `${reportData.avgMileage} km/L`);
      
//       doc.moveDown(2);

//       // Summary Box
//       doc.rect(50, doc.y, 500, 80)
//          .fillAndStroke('#e0f2fe', '#2563eb');
      
//       doc.fillColor('#000')
//          .fontSize(14)
//          .text('Total Trip Cost', 60, doc.y - 70, { width: 480 });
      
//       doc.fontSize(24)
//          .fillColor('#2563eb')
//          .text(`₹${reportData.fuelCost}`, 60, doc.y + 10, { width: 480, align: 'center' });

//       doc.moveDown(4);

//       // Footer
//       doc.fontSize(8)
//          .fillColor('#999')
//          .text('Fuel Map Router - Route Management System', { align: 'center' });

//       // Finalize PDF
//       doc.end();

//       writeStream.on('finish', () => {
//         resolve(filePath);
//       });

//       writeStream.on('error', (error) => {
//         reject(error);
//       });

//     } catch (error) {
//       reject(error);
//     }
//   });
// }

// // Helper function to add label-value pairs
// function addLabelValue(doc, label, value) {
//   const y = doc.y;
//   doc.fillColor('#666')
//      .text(label, { continued: true, width: 150 })
//      .fillColor('#000')
//      .text(value);
//   doc.moveDown(0.5);
// }