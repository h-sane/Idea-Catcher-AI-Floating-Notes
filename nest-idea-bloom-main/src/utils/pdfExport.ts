
import { Idea, Category } from '../types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';

export const exportIdeasToPdf = (ideas: Idea[], categories: Category[], filterName?: string) => {
  // Create new PDF document
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Add title and timestamp
  doc.setFontSize(20);
  doc.text('IdeaNest Ideas Export', pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text(`Generated on: ${format(new Date(), 'PPpp')}`, pageWidth / 2, 30, { align: 'center' });
  
  if (filterName) {
    doc.text(`Filter: ${filterName}`, pageWidth / 2, 40, { align: 'center' });
  }
  
  // Add ideas to PDF
  const tableData = ideas.map(idea => {
    // Get category names for this idea
    const categoryNames = categories
      .filter(cat => idea.categoryIds.includes(cat.id))
      .map(cat => cat.name)
      .join(', ');
    
    // Format dates
    const created = format(new Date(idea.createdAt), 'PPp');
    
    return [
      idea.title,
      idea.content,
      categoryNames,
      created,
      idea.isPinned ? '★' : ''
    ];
  });
  
  // Add auto table
  autoTable(doc, {
    startY: filterName ? 50 : 40,
    head: [['Title', 'Content', 'Categories', 'Created', 'Pinned']],
    body: tableData,
    headStyles: {
      fillColor: [123, 104, 238], // Purple color
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [240, 240, 250],
    },
    columnStyles: {
      0: { fontStyle: 'bold' },
      1: { cellWidth: 'auto' },
      4: { cellWidth: 15, halign: 'center' },
    },
    margin: { top: 50 },
    styles: {
      overflow: 'linebreak',
      cellPadding: 5,
    },
  });

  // Generate filename with timestamp
  const timestamp = format(new Date(), 'yyyy-MM-dd-HHmm');
  const filename = `ideanest-ideas-${timestamp}.pdf`;
  
  // Save and trigger download
  doc.save(filename);
};
