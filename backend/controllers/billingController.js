// Calculate totals, trigger PDF generation
import Invoice from '../models/Invoice.js';
import { createInvoicePDF } from '../utils/generatePDF.js';
import path from 'path';
import fs from 'fs'; // 1. Import the File System module

export const generateBill = async (req, res) => {
  try {
    const { ownerId, appointmentId, servicesRendered, itemsBilled, totalAmount } = req.body;

    const invoice = await Invoice.create({
      owner: ownerId,
      appointment: appointmentId,
      servicesRendered,
      itemsBilled,
      totalAmount
    });

    // 2. Define the exact path to the invoices folder
    const invoicesDir = path.join(process.cwd(), 'invoices');
    
    // 3. Defensive Check: If the folder doesn't exist, build it automatically!
    if (!fs.existsSync(invoicesDir)) {
      fs.mkdirSync(invoicesDir, { recursive: true });
    }

    // Generate the specific file path
    const fileName = `invoice_${invoice._id}.pdf`;
    const filePath = path.join(invoicesDir, fileName); 
    
    // Call the utility function
    createInvoicePDF(invoice, filePath);

    // Save the file path back to the database
    invoice.pdfUrl = `/invoices/${fileName}`;
    await invoice.save();

    res.status(201).json(invoice);
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate bill', error: error.message });
  }
};