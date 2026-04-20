// PDFKit script that builds the invoice
import PDFDocument from 'pdfkit';
import fs from 'fs';

export const createInvoicePDF = (invoiceData, filePath) => {
  const doc = new PDFDocument({ margin: 50 });

  // Pipe its output somewhere, like to a file
  doc.pipe(fs.createWriteStream(filePath));

  // Build the PDF design
  doc.fontSize(20).text('VetVantage Clinic Invoice', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Invoice ID: ${invoiceData._id}`);
  doc.text(`Date: ${new Date().toLocaleDateString()}`);
  doc.moveDown();
  doc.text('--------------------------------------------------');
  doc.moveDown();
  doc.fontSize(16).text(`Total Amount Due: $${invoiceData.totalAmount}`, { align: 'right' });

  doc.end();
};