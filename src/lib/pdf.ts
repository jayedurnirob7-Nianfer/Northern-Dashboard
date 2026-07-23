import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generatePDF = (shipments: any[]) => {
  if (shipments.length === 0) return;

  // Use the first shipment's details for naming
  const firstShip = shipments[0];
  const clientName = firstShip.customerName ? firstShip.customerName.replace(/[^a-zA-Z0-9]/g, '_') : 'Client';
  const shippingNumber = firstShip.shippingNumber ? firstShip.shippingNumber.replace(/[^a-zA-Z0-9]/g, '_') : 'NoTrack';
  const dateStr = new Date().toISOString().split('T')[0];
  
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text('Shipping Invoice / Status Report', 14, 22);

  doc.setFontSize(11);
  doc.text(`Client: ${firstShip.customerName || 'N/A'}`, 14, 30);
  doc.text(`Date Generated: ${dateStr}`, 14, 36);

  const tableColumn = ["Shipping No", "Product", "Qty", "Weight", "Rate", "Total", "Status"];
  const tableRows = shipments.map(s => [
    s.shippingNumber || '-',
    s.productName || '-',
    s.quantity || '-',
    s.weight || '0',
    s.rate || '0',
    s.clientBill || '0',
    s.status || '-'
  ]);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 50,
    theme: 'grid',
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [139, 92, 246] } // Purple to match UI
  });

  const finalY = (doc as any).lastAutoTable.finalY || 50;
  
  // Calculate totals
  const grandTotal = shipments.reduce((sum, s) => sum + (s.clientBill || 0), 0);
  doc.text(`Grand Total: $${grandTotal.toFixed(2)}`, 14, finalY + 10);

  const fileName = `${clientName}_${shippingNumber}_${dateStr}.pdf`;
  doc.save(fileName);
};
