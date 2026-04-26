import { jsPDF } from 'jspdf';
import type { ScoreResult } from './scoring';

export function generateScorecardPDF(
  score: ScoreResult,
  restaurantName: string,
  ownerName: string
): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let y = 20;

  doc.setFillColor(245, 158, 11);
  doc.rect(0, 0, pageWidth, 50, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('World Cup Readiness Scorecard', margin, 30);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('La Comida de Gueli · Preparación para el Mundial 2026', margin, 42);

  y = 65;

  doc.setTextColor(31, 41, 55);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(restaurantName || 'Restaurante', margin, y);
  y += 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(107, 114, 128);
  doc.text(`Propietario: ${ownerName || 'N/A'}`, margin, y);
  y += 6;
  doc.text(`Fecha: ${new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}`, margin, y);
  y += 20;

  const scoreColor = score.total >= 80 ? [34, 197, 94] : score.total >= 50 ? [245, 158, 11] : [239, 68, 68];
  doc.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2]);
  doc.circle(pageWidth / 2, y + 15, 20, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(`${score.total}`, pageWidth / 2 - 8, y + 20);
  
  doc.setTextColor(31, 41, 55);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('/100', pageWidth / 2 + 5, y + 20);
  y += 45;

  const scoreLabel = score.total >= 80 ? '¡Listo para el Mundial!' : score.total >= 50 ? 'Necesitas prepararte' : 'Urgente: Actúa ahora';
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2]);
  doc.text(scoreLabel, pageWidth / 2 - doc.getTextWidth(scoreLabel) / 2, y);
  y += 20;

  doc.setTextColor(31, 41, 55);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Desglose por categoría:', margin, y);
  y += 12;

  const categories = [
    { label: 'Accesibilidad del Menú', score: score.menu },
    { label: 'Eficiencia en Pedidos', score: score.orders },
    { label: 'Retención de Clientes', score: score.retention },
    { label: 'Velocidad de Pago', score: score.payment },
    { label: 'Datos y Analítica', score: score.analytics },
  ];

  categories.forEach((cat) => {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(75, 85, 99);
    doc.text(cat.label, margin, y);
    
    const barWidth = 80;
    const barHeight = 6;
    const barX = pageWidth - margin - barWidth;
    
    doc.setFillColor(243, 244, 246);
    doc.rect(barX, y - 4, barWidth, barHeight, 'F');
    
    const fillColor = cat.score >= 15 ? [34, 197, 94] : cat.score >= 10 ? [245, 158, 11] : [239, 68, 68];
    doc.setFillColor(fillColor[0], fillColor[1], fillColor[2]);
    doc.rect(barX, y - 4, barWidth * (cat.score / 20), barHeight, 'F');
    
    doc.setTextColor(31, 41, 55);
    doc.setFont('helvetica', 'bold');
    doc.text(`${cat.score}/20`, pageWidth - margin + 5, y);
    
    y += 14;
  });

  y += 10;

  doc.setTextColor(31, 41, 55);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Tu plan de acción prioritario:', margin, y);
  y += 12;

  score.gaps.forEach((gap, index) => {
    doc.setFillColor(254, 242, 242);
    doc.rect(margin, y - 6, pageWidth - margin * 2, 30, 'F');
    
    doc.setTextColor(185, 28, 28);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`${index + 1}`, margin + 5, y + 4);
    
    doc.setTextColor(31, 41, 55);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`${gap.label}: ${gap.score}/20`, margin + 15, y + 4);
    
    y += 20;
  });

  y += 15;

  if (y > 230) {
    doc.addPage();
    y = 20;
  }

  doc.setFillColor(245, 158, 11);
  doc.rect(margin, y, pageWidth - margin * 2, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('¿Listo para transformar tu restaurante?', margin + 10, y + 18);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Agenda tu demo gratuita de 15 minutos en:', margin + 10, y + 30);
  doc.setFont('helvetica', 'bold');
  doc.text('la-comida-de-gueli.com/demo', margin + 10, y + 38);

  doc.setTextColor(156, 163, 175);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Powered by La Comida de Gueli · Hecho con ❤️ en Monterrey', margin, 280);

  doc.save(`scorecard-${restaurantName || 'restaurante'}-${new Date().toISOString().split('T')[0]}.pdf`);
}