'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useToast } from '@/hooks/use-toast';
import { Sale, SaleItem } from '@/types';

// Extended type since our schema has extra fields that might not be in the base Sale type
type ExtendedSale = Partial<Sale> & {
  sale_number?: string;
  payment_method?: string;
  payment_status?: string;
  subtotal?: number;
  discount?: number;
  amount_paid?: number;
};

export default function ReceiptButton({ sale, items }: { sale: ExtendedSale, items: SaleItem[] }) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const downloadReceipt = async () => {
    setLoading(true);
    try {
      // Small timeout to allow state update to render
      await new Promise(resolve => setTimeout(resolve, 100));

      const doc = new jsPDF();
      
      const pageWidth = doc.internal.pageSize.getWidth();
      
      // Header
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text("Nisar Khan & Sons", pageWidth / 2, 20, { align: "center" });
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text("Tiles & Flooring Solutions", pageWidth / 2, 28, { align: "center" });
      
      // Divider
      doc.setLineWidth(0.5);
      doc.line(15, 35, pageWidth - 15, 35);
      
      // Sale Details
      doc.setFontSize(10);
      const startY = 45;
      doc.text(`Receipt No: ${sale.sale_number || sale.id?.split('-')[0].toUpperCase()}`, 15, startY);
      doc.text(`Date: ${sale.created_at ? new Date(sale.created_at).toLocaleDateString('en-GB') : ''}`, 15, startY + 7);
      
      doc.text(`Customer Name: ${sale.customer_name || 'Walk-in Customer'}`, pageWidth - 15, startY, { align: 'right' });
      doc.text(`Payment Method: ${sale.payment_method || 'Cash'}`, pageWidth - 15, startY + 7, { align: 'right' });
      doc.text(`Payment Status: ${sale.payment_status || 'Paid'}`, pageWidth - 15, startY + 14, { align: 'right' });
      
      // Divider
      doc.line(15, startY + 20, pageWidth - 15, startY + 20);
      
      // Items Table using autoTable
      const tableColumn = ["Item Name", "Qty", "Unit Price (PKR)", "Subtotal (PKR)"];
      const tableRows = items.map(item => [
        item.products?.name || 'Unknown Item',
        item.quantity.toString(),
        item.unit_price.toString(),
        item.subtotal.toString()
      ]);
      
      let finalY = startY + 25;
      
      autoTable(doc, {
        startY: finalY,
        head: [tableColumn],
        body: tableRows,
        theme: 'plain',
        headStyles: { fontStyle: 'bold', lineWidth: 0.5, lineColor: [0,0,0], textColor: [0,0,0] },
        bodyStyles: { textColor: [0,0,0] },
        styles: { cellPadding: 3, fontSize: 10 },
        columnStyles: {
            0: { halign: 'left' },
            1: { halign: 'center' },
            2: { halign: 'right' },
            3: { halign: 'right' }
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        didDrawPage: function (data: any) {
          finalY = data.cursor.y;
        }
      });
      
      // Divider
      doc.line(15, finalY + 5, pageWidth - 15, finalY + 5);
      
      const summaryY = finalY + 12;
      const subtotal = sale.subtotal || sale.total_amount || 0;
      const discount = sale.discount || 0;
      const totalAmount = sale.total_amount || 0;
      const amountPaid = sale.amount_paid || sale.total_amount || 0;
      const remainingBalance = totalAmount - amountPaid;
      
      let currentY = summaryY;
      
      doc.text("Subtotal:", pageWidth - 50, currentY);
      doc.text(subtotal.toString(), pageWidth - 15, currentY, { align: 'right' });
      currentY += 7;
      
      if (discount > 0) {
        doc.text("Discount:", pageWidth - 50, currentY);
        doc.text(discount.toString(), pageWidth - 15, currentY, { align: 'right' });
        currentY += 7;
      }
      
      doc.setFont('helvetica', 'bold');
      doc.text("Total Amount:", pageWidth - 50, currentY);
      doc.text(totalAmount.toString(), pageWidth - 15, currentY, { align: 'right' });
      currentY += 7;
      doc.setFont('helvetica', 'normal');
      
      doc.text("Amount Paid:", pageWidth - 50, currentY);
      doc.text(amountPaid.toString(), pageWidth - 15, currentY, { align: 'right' });
      currentY += 7;
      
      const pStatus = (sale.payment_status || 'Paid').toLowerCase();
      if (pStatus === 'partial' || pStatus === 'unpaid' || remainingBalance > 0) {
        doc.text("Remaining Balance:", pageWidth - 50, currentY);
        doc.text(remainingBalance.toString(), pageWidth - 15, currentY, { align: 'right' });
        currentY += 7;
      }
      
      // Divider
      doc.line(15, currentY, pageWidth - 15, currentY);
      
      // Footer
      const footerY = currentY + 15;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'italic');
      doc.text("Thank you for your business!", pageWidth / 2, footerY, { align: 'center' });
      doc.setFontSize(10);
      doc.text("Nisar Khan & Sons — Your trusted tiles partner", pageWidth / 2, footerY + 6, { align: 'center' });
      
      // Save
      const receiptNo = sale.sale_number || sale.id;
      doc.save(`Receipt-${receiptNo}.pdf`);

    } catch (err: any) {
      console.error(err);
      toast({
        title: "Error Generating PDF",
        description: err.message || "An unexpected error occurred.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={downloadReceipt} 
      disabled={loading}
      className="bg-accent-primary text-black hover:bg-accent-dim min-h-[44px]"
    >
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Download className="mr-2 h-4 w-4" />
      )}
      {loading ? 'Generating...' : 'Download Receipt'}
    </Button>
  );
}
