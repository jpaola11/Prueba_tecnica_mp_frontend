import jsPDF from 'jspdf';
import 'jspdf-autotable';
import {
  CaseFileReportItem,
  CaseReviewReportItem,
  CaseStatusSummaryRow,
  ReportsFilter,
} from '../../api/reports.service';

const mapStatus = (statusId: number | null | undefined): string => {
  switch (statusId) {
    case 1:
      return 'En trámite';
    case 2:
      return 'Aprobado';
    case 3:
      return 'Rechazado';
    default:
      return '—';
  }
};

const formatDate = (value?: string | null): string => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
};

const buildFiltersLabel = (filters: ReportsFilter): string => {
  const parts: string[] = [];

  if (filters.orgUnitId) parts.push(`Unidad: ${filters.orgUnitId}`);
  if (filters.status) parts.push(`Estado: ${filters.status}`);
  if (filters.fromDate) parts.push(`Desde: ${filters.fromDate}`);
  if (filters.toDate) parts.push(`Hasta: ${filters.toDate}`);

  return parts.length > 0 ? parts.join(' | ') : 'Sin filtros (todos los registros)';
};

type GeneratePdfParams = {
  filters: ReportsFilter;
  summaryRows: CaseStatusSummaryRow[];
  caseFiles: CaseFileReportItem[];
  reviews: CaseReviewReportItem[];
};

export const generateCaseStatusPdf = ({
  filters,
  summaryRows,
  caseFiles,
  reviews,
}: GeneratePdfParams) => {
  const doc = new jsPDF('p', 'mm', 'a4');
  let currentY = 15;

  // Encabezado
  doc.setFontSize(14);
  doc.text('Reporte de expedientes, aprobaciones y rechazos', 14, currentY);
  currentY += 6;

  doc.setFontSize(10);
  doc.text(`Filtros: ${buildFiltersLabel(filters)}`, 14, currentY);
  currentY += 5;

  const now = new Date();
  doc.text(
    `Generado el: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`,
    14,
    currentY,
  );
  currentY += 8;

  // =========================
  // 1. Resumen por unidad
  // =========================
  doc.setFontSize(12);
  doc.text('1. Resumen por unidad y estado', 14, currentY);
  currentY += 4;

  (doc as any).autoTable({
    startY: currentY,
    head: [['Unidad', 'Abiertos', 'En trámite', 'Cerrados', 'Total']],
    body: summaryRows.map((r) => [
      r.orgUnitName,
      String(r.open),
      String(r.inProgress),
      String(r.closed),
      String(r.total),
    ]),
    theme: 'grid',
    styles: { fontSize: 8 },
    headStyles: { fillColor: [230, 230, 230] },
  });

  // actualizamos currentY al final de la tabla
  // @ts-ignore
  currentY = (doc as any).lastAutoTable.finalY + 8;

  // =========================
  // 2. Registros (expedientes)
  // =========================
  doc.setFontSize(12);
  doc.text('2. Registros de expedientes', 14, currentY);
  currentY += 4;

  (doc as any).autoTable({
    startY: currentY,
    head: [['Código', 'Título', 'Unidad', 'Estado actual', 'Fecha apertura']],
    body: caseFiles.map((c) => [
      c.code,
      c.title,
      String(c.orgUnitId),
      mapStatus(c.statusId),
      formatDate(c.openDate),
    ]),
    theme: 'grid',
    styles: { fontSize: 8 },
    headStyles: { fillColor: [230, 230, 230] },
  });

  // @ts-ignore
  currentY = (doc as any).lastAutoTable.finalY + 8;

  // =========================
  // 3. Aprobaciones
  // =========================
  const approvals = reviews.filter(
    (r) => r.newStatusName === 'Aprobado' || r.newStatusCode === 'Aprobado',
  );

  doc.setFontSize(12);
  doc.text(
    `3. Aprobaciones (${approvals.length} registro${approvals.length === 1 ? '' : 's'})`,
    14,
    currentY,
  );
  currentY += 4;

  if (approvals.length > 0) {
    (doc as any).autoTable({
      startY: currentY,
      head: [
        ['Código', 'Título', 'Estado anterior', 'Estado nuevo', 'Revisor', 'Fecha'],
      ],
      body: approvals.map((r) => [
        r.caseCode,
        r.caseTitle,
        r.previousStatusName,
        r.newStatusName,
        r.reviewerFullName,
        formatDate(r.reviewedAt),
      ]),
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [230, 255, 230] }, // verde suave
    });
    // @ts-ignore
    currentY = (doc as any).lastAutoTable.finalY + 8;
  } else {
    doc.setFontSize(10);
    doc.text('No se registran aprobaciones en el periodo.', 14, currentY);
    currentY += 8;
  }

  // =========================
  // 4. Rechazos
  // =========================
  const rejections = reviews.filter(
    (r) => r.newStatusName === 'Rechazado' || r.newStatusCode === 'Rechazado',
  );

  doc.setFontSize(12);
  doc.text(
    `4. Rechazos (${rejections.length} registro${rejections.length === 1 ? '' : 's'})`,
    14,
    currentY,
  );
  currentY += 4;

  if (rejections.length > 0) {
    (doc as any).autoTable({
      startY: currentY,
      head: [
        ['Código', 'Título', 'Estado anterior', 'Estado nuevo', 'Revisor', 'Fecha'],
      ],
      body: rejections.map((r) => [
        r.caseCode,
        r.caseTitle,
        r.previousStatusName,
        r.newStatusName,
        r.reviewerFullName,
        formatDate(r.reviewedAt),
      ]),
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [255, 230, 230] }, // rojo suave
    });
  } else {
    doc.setFontSize(10);
    doc.text('No se registran rechazos en el periodo.', 14, currentY);
  }

  // Nombre de archivo
  const fileName = `reporte-expedientes-${now
    .toISOString()
    .slice(0, 10)}.pdf`;
  doc.save(fileName);
};
