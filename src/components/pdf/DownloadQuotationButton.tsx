'use client';

import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { calculatePricing, PACKAGES } from '@/data/calculatorData';

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
      const primaryColor: [number, number, number] = [249, 115, 22]; // var(--brand-orange) #f97316
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
      
      let qDate = quote.createdAt ? new Date(quote.createdAt) : (quote.created_at ? new Date(quote.created_at) : new Date());
      if (isNaN(qDate.getTime()) || qDate.getFullYear() === 1970) {
        qDate = new Date();
      }
      const quoteDate = qDate.toLocaleDateString();
      const quoteId = quote.id ? quote.id.split('-')[0].toUpperCase() : 'PENDING';
      
      doc.text(`Date: ${quoteDate}`, pageWidth - margin, startY - 5, { align: 'right' });
      doc.text(`Quote #: QT-${quoteId}`, pageWidth - margin, startY + 1, { align: 'right' });

      // Status Badge
      const statusText = quote.status.toUpperCase();
      let statusColor = [150, 150, 150];
      if (quote.status === 'accepted') statusColor = [34, 197, 94]; // Green
      if (quote.status === 'rejected') statusColor = [239, 68, 68]; // Red
      
      doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
      doc.roundedRect(pageWidth - margin - 35, startY + 6, 35, 7, 1.5, 1.5, 'F');
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text(statusText, pageWidth - margin - 17.5, startY + 11, { align: 'center' });

      // === CLIENT INFO & PROJECT DETAILS ===
      startY += 25;
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.text('Prepared For:', margin, startY);
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text(clientName, margin, startY + 6);
      
      const projectName = quote.projects?.title || quote.projects?.project_name || 'Web Development';
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text(`Project: ${projectName}`, margin, startY + 16);
      
      // Detailed Project Description & Package
      let currentY = startY + 22;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(80, 80, 80);
      
      if (quote.projects?.description) {
        const splitDesc = doc.splitTextToSize(`Overview: ${quote.projects.description}`, pageWidth - margin * 2);
        doc.text(splitDesc, margin, currentY);
        currentY += splitDesc.length * 5;
      }
      
      let parsedNotes = quote.notes || '';
      let rawConfig: any = null;
      
      if (parsedNotes.includes('Raw Configuration:')) {
        try {
          const parts = parsedNotes.split('Raw Configuration:');
          parsedNotes = parts[0].trim();
          const jsonString = parts[1].trim();
          rawConfig = JSON.parse(jsonString);
        } catch (e) {
          console.warn('Could not parse Raw Configuration from notes', e);
        }
      }

      if (parsedNotes) {
        currentY += 2;
        doc.setFont('helvetica', 'bold');
        doc.text('Package / Notes:', margin, currentY);
        doc.setFont('helvetica', 'normal');
        const splitNotes = doc.splitTextToSize(parsedNotes, pageWidth - margin * 2);
        doc.text(splitNotes, margin, currentY + 5);
        currentY += (splitNotes.length * 5) + 5;
      }

      // === TABLE ===
      currentY += 10;
      
      let breakdownToUse: any = null;
      
      if (rawConfig && rawConfig.pricing && rawConfig.pricing.breakdown) {
        breakdownToUse = rawConfig.pricing.breakdown;
        
        // Attempt to dynamically recalculate using the newest logic so old quotations 
        // also get the beautiful new distributed breakdown layout
        try {
          if (rawConfig.projectType) {
            const recalc = calculatePricing(rawConfig);
            if (recalc && recalc.breakdown) {
              breakdownToUse = recalc.breakdown;
            }
          }
        } catch (e) {
          console.warn('Failed to dynamically recalculate quote breakdown', e);
        }
      }

      let tableData: any[][] = [];

      if (breakdownToUse) {
        // 1. Aggressively remove 'Pages' and 'UI' items
        breakdownToUse = breakdownToUse.filter((b: any) => {
          const l = (b.label || '').toLowerCase();
          if (l.includes('pages')) return false;
          if (l.includes('ui:')) return false;
          return true;
        });

        // 2. Ensure package features are listed
        const hasPkgFeatures = breakdownToUse.some((b: any) => b.isPackageFeature);
        if (!hasPkgFeatures && rawConfig) {
          const pkgId = rawConfig.selectedPackage || rawConfig.package?.id;
          const pkg = PACKAGES.find(p => p.id === pkgId);
          if (pkg && pkg.features) {
            pkg.features.forEach(f => {
              breakdownToUse.push({ label: `✓ ${f}`, cost: 0, isPackageFeature: true });
            });
          }
        }

        let runningTotal = 0;
        
        breakdownToUse.forEach((b: any) => {
          tableData.push([
            b.label,
            b.isPackageFeature ? 'Package Feature' : 'Selected Feature',
            b.cost === 0 ? 'Included' : `Rs. ${(b.cost || 0).toLocaleString()}`
          ]);
          runningTotal += (b.cost || 0);
        });
        
        // 3. Diff calculation to perfectly match quote.amount
        const finalAmount = quote.amount || runningTotal;
        const diff = finalAmount - runningTotal;
        
        if (diff > 0) {
          tableData.push([
            `Package Multiplier & Delivery`,
            `Applied Multipliers`,
            `Rs. ${diff.toLocaleString()}`
          ]);
        } else if (diff < 0) {
          tableData.push([
            `Special Offer Discount`,
            `Applied to base price`,
            `- Rs. ${Math.abs(diff).toLocaleString()}`
          ]);
        }
      } else {
        // Fallback if no raw config
        let parsedItems = [];
        if (typeof quote.items === 'string') {
          try { parsedItems = JSON.parse(quote.items); } catch(e) {}
        } else if (Array.isArray(quote.items)) {
          parsedItems = quote.items;
        }
        
        tableData = parsedItems.map((item: any) => [
          item.name || 'Item',
          item.description || item.value || '-',
          `Rs. ${(item.price || item.cost || 0).toLocaleString()}`
        ]);
  
        if (tableData.length === 0) {
          tableData.push(['Base Project Package', 'Standard implementation as per requirements', `Rs. ${(quote.amount || 0).toLocaleString()}`]);
        }
      }

      autoTable(doc, {
        startY: currentY,
        head: [['Description', 'Details', 'Amount']],
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
          0: { cellWidth: 50 },
          1: { cellWidth: 'auto' },
          2: { halign: 'right', fontStyle: 'bold', cellWidth: 40 }
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

      // === TERMS & CONDITIONS ===
      let termsY = finalY + 30;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.text('Terms & Conditions:', margin, termsY);
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      const terms = [
        "1. Validity: This quotation is valid for 14 days from the date of issue.",
        "2. Payment Terms: 50% advance payment required to commence work. Remaining 50% upon project completion.",
        "3. Scope: Any additional features outside the agreed scope will be billed separately.",
        "4. Timelines: Project timelines begin upon receipt of the advance payment."
      ];
      
      terms.forEach((term, index) => {
        doc.text(term, margin, termsY + 6 + (index * 5));
      });

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
