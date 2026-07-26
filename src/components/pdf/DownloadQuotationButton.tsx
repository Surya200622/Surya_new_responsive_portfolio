'use client';

import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface DownloadQuotationButtonProps {
  quote: any;
  clientName: string;
}

export default function DownloadQuotationButton({ quote, clientName }: DownloadQuotationButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async () => {
    try {
      setIsGenerating(true);
      
      const doc = new jsPDF();
      
      // Document Settings
      const pageWidth = doc.internal.pageSize.width;
      const margin = 20;
      let startY = margin;

      // Brand Colors
      const primaryColor: [number, number, number] = [186, 150, 107]; // var(--color-accent-primary) Approx #ba966b
      const darkColor: [number, number, number] = [26, 26, 26];

      // === HEADER ===
      
      // Add Logo
      try {
        const img = new Image();
        img.src = '/logo-email.svg'; // Using the new SVG logo
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });
        
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const imgData = canvas.toDataURL('image/png');
          // Scale to 40x9.6 to maintain 250:60 aspect ratio
          doc.addImage(imgData, 'PNG', margin, startY, 40, 9.6);
        }
      } catch (e) {
        console.warn('Could not load logo for PDF', e);
      }

      // Add a stylish divider line
      doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setLineWidth(1);
      doc.line(margin, startY + 15, pageWidth - margin, startY + 15);

      // Sender Info (Right aligned)
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text('Email: suryacs.is.a.dev@gmail.com', pageWidth - margin, startY, { align: 'right' });
      doc.text('Phone: +91 8220443165', pageWidth - margin, startY + 6, { align: 'right' });
      doc.text('Website: https://suryacs.is-a.dev/', pageWidth - margin, startY + 12, { align: 'right' });

      // === DOCUMENT TITLE & META ===
      startY += 30;
      doc.setFontSize(28);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.text('QUOTATION', margin, startY);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      
      let qDate = quote.created_at ? new Date(quote.created_at) : new Date();
      if (isNaN(qDate.getTime()) || qDate.getFullYear() === 1970) {
        qDate = new Date();
      }
      const quoteDate = qDate.toLocaleDateString();
      const quoteId = quote.id ? quote.id.split('-')[0].toUpperCase() : 'PENDING';
      
      doc.text(`Date: ${quoteDate}`, pageWidth - margin, startY - 5, { align: 'right' });
      doc.text(`Quote #: QT-${quoteId}`, pageWidth - margin, startY + 1, { align: 'right' });

      // === CLIENT INFO ===
      startY += 20;
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.text('Prepared For:', margin, startY);
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text(clientName, margin, startY + 6);
      doc.text(`Project: ${quote.projects?.project_name || 'Web Development'}`, margin, startY + 12);
      
      // Status Badge
      const statusText = quote.status.toUpperCase();
      let statusColor = [150, 150, 150];
      if (quote.status === 'accepted') statusColor = [34, 197, 94]; // Green
      if (quote.status === 'rejected') statusColor = [239, 68, 68]; // Red
      
      doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
      doc.roundedRect(pageWidth - margin - 40, startY + 2, 40, 8, 2, 2, 'F');
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text(statusText, pageWidth - margin - 20, startY + 7.5, { align: 'center' });

      // === TABLE ===
      startY += 25;
      
      let parsedItems = [];
      if (typeof quote.items === 'string') {
        try { parsedItems = JSON.parse(quote.items); } catch(e) {}
      } else if (Array.isArray(quote.items)) {
        parsedItems = quote.items;
      }
      
      const tableData = parsedItems.map((item: any) => [
        item.name || 'Item',
        item.description || item.value || '-',
        `Rs. ${(item.price || item.cost || 0).toLocaleString()}`
      ]);

      if (tableData.length === 0) {
        // Fallback if structured items don't exist
        tableData.push(['Base Project Package', 'Standard', `Rs. ${(quote.amount || 0).toLocaleString()}`]);
      }

      autoTable(doc, {
        startY: startY,
        head: [['Description', 'Details', 'Cost']],
        body: tableData,
        theme: 'plain',
        headStyles: {
          fillColor: [245, 245, 245],
          textColor: darkColor,
          fontStyle: 'bold',
          halign: 'left'
        },
        styles: {
          font: 'helvetica',
          fontSize: 10,
          cellPadding: 6,
          lineColor: [220, 220, 220],
          lineWidth: { bottom: 0.5 }
        },
        columnStyles: {
          2: { halign: 'right', fontStyle: 'bold' } // Right align cost
        },
        margin: { left: margin, right: margin }
      });

      // === TOTAL ===
      const finalY = (doc as any).lastAutoTable.finalY + 10;
      
      doc.setFillColor(250, 250, 250);
      doc.rect(margin, finalY, pageWidth - (margin * 2), 20, 'F');
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.text('TOTAL AMOUNT', margin + 10, finalY + 13);
      
      doc.setFontSize(14);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text(`Rs. ${(quote.amount || 0).toLocaleString()}`, pageWidth - margin - 10, finalY + 13, { align: 'right' });

      // === FOOTER ===
      const pageHeight = doc.internal.pageSize.height;
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(150, 150, 150);
      
      doc.text('Thank you for your business!', pageWidth / 2, pageHeight - 20, { align: 'center' });
      doc.text('This is a computer generated document and does not require a signature.', pageWidth / 2, pageHeight - 15, { align: 'center' });

      // Save PDF
      doc.save(`Quotation_${quoteId}.pdf`);

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button 
      onClick={generatePDF}
      disabled={isGenerating}
      className="btn btn--glass w-full justify-center sm:w-auto px-3 py-2 flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
      title="Download PDF"
    >
      {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
      <span className="text-sm">{isGenerating ? 'Generating...' : 'Download PDF'}</span>
    </button>
  );
}
