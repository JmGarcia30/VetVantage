// Calculate totals, trigger PDF generation
import Invoice from '../models/Invoice.js';
import { createInvoicePDF } from '../utils/generatePDF.js';
import path from 'path';

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

    // Generate the PDF file in a specific folder
    const fileName = `invoice_${invoice._id}.pdf`;
    const filePath = path.join(process.cwd(), 'invoices', fileName); 
    
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