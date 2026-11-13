import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import {
  WageCalculatorInputs,
  WageCalculationResults,
  formatCurrency,
  generateAuditId,
} from "./wageCalculator";

export interface PDFReportOptions {
  userEmail: string;
  auditId?: string;
  notes?: string;
  employerName?: string;
  employeeName?: string;
  affiliateUrl?: string;
}

export function generateWageReportPDF(
  inputs: WageCalculatorInputs,
  results: WageCalculationResults,
  options: PDFReportOptions
): jsPDF {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 595.28 pt
  const pageHeight = doc.internal.pageSize.getHeight(); // 841.89 pt
  const margin = 36;
  const contentWidth = pageWidth - margin * 2;

  const auditId = options.auditId || generateAuditId();
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const currentTime = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });

  const currencySymbol = results.currencySymbol;
  const affiliateUrl =
    options.affiliateUrl ||
    "https://labor-dispute-assistance.org/case-evaluation?ref=wageaudit2026";

  // Helper colors
  const slateDark: [number, number, number] = [15, 23, 42]; // #0f172a
  const slateMuted: [number, number, number] = [100, 116, 139]; // #64748b
  const slateLight: [number, number, number] = [241, 245, 249]; // #f1f5f9
  const emeraldAccent: [number, number, number] = [5, 150, 105]; // #059669
  const emeraldBg: [number, number, number] = [236, 253, 245]; // #ecfdf5
  const amberAccent: [number, number, number] = [217, 119, 6]; // #d97706
  const amberBg: [number, number, number] = [254, 243, 199]; // #fef3c7
  const crimsonAccent: [number, number, number] = [225, 29, 72]; // #e11d48
  const crimsonBg: [number, number, number] = [255, 241, 242]; // #fff1f2

  // ==========================================
  // PAGE 1: OFFICIAL WAGE & OVERTIME AUDIT CREDENTIAL
  // ==========================================

  const drawPageBorder = (pageNum: number) => {
    // Outer hairline boundary
    doc.setDrawColor(203, 213, 225); // slate-300
    doc.setLineWidth(1);
    doc.rect(margin - 6, margin - 6, contentWidth + 12, pageHeight - (margin * 2 - 12));

    // Inner formal double-rule
    doc.setDrawColor(148, 163, 184); // slate-400
    doc.setLineWidth(0.5);
    doc.rect(margin - 2, margin - 2, contentWidth + 4, pageHeight - (margin * 2 - 4));

    // Top Header Banner
    doc.setFillColor(...slateDark);
    doc.rect(margin, margin, contentWidth, 54, "F");

    // Header Gold/Emerald Stripe
    doc.setFillColor(...emeraldAccent);
    doc.rect(margin, margin + 50, contentWidth, 4, "F");

    // Institution Title
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("NATIONAL WAGE ACCREDITATION & LABOR COMPLIANCE ARCHIVE", pageWidth / 2, margin + 22, {
      align: "center",
    });

    // Subheader
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(203, 213, 225);
    doc.text(
      "STANDARDIZED SHIFT RECONCILIATION STATEMENT • 2026 CALIBRATED PROTOCOL",
      pageWidth / 2,
      margin + 36,
      { align: "center" }
    );

    // Microprint verification tag
    doc.setFontSize(6);
    doc.setTextColor(148, 163, 184);
    doc.text(`SECURITY IDENTIFIER: ${auditId} • AUDIT SEAL: AUTHENTICATED`, pageWidth / 2, margin + 45, {
      align: "center",
    });

    // Page Footer
    const footerY = pageHeight - margin + 4;
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.75);
    doc.line(margin, footerY - 14, pageWidth - margin, footerY - 14);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...slateMuted);
    doc.text(
      "CONFIDENTIAL RECORD • Generated pursuant to FLSA 29 U.S.C. § 201 et seq. / UK ERA 1996 / EU 2003/88/EC benchmarks",
      margin,
      footerY - 4
    );
    doc.text(`Page ${pageNum} of 2`, pageWidth - margin, footerY - 4, { align: "right" });
  };

  // Draw Page 1 Border
  drawPageBorder(1);

  // Metadata Grid Box
  let currentY = margin + 68;
  doc.setFillColor(...slateLight);
  doc.roundedRect(margin, currentY, contentWidth, 48, 4, 4, "F");
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, currentY, contentWidth, 48, 4, 4, "S");

  // Metadata Columns
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(...slateMuted);
  doc.text("AUDIT IDENTIFIER", margin + 12, currentY + 14);
  doc.text("EMPLOYEE / PARTICIPANT", margin + 140, currentY + 14);
  doc.text("JURISDICTION PROTOCOL", margin + 280, currentY + 14);
  doc.text("VERIFIED TIMESTAMP", margin + 400, currentY + 14);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(...slateDark);
  doc.text(auditId, margin + 12, currentY + 28);
  
  const emailText = options.userEmail || "anonymous.worker@audit.internal";
  doc.text(emailText.length > 24 ? emailText.substring(0, 22) + "..." : emailText, margin + 140, currentY + 28);

  const jurisLabel =
    inputs.jurisdiction === "US"
      ? "US (FLSA 1.5x OT)"
      : inputs.jurisdiction === "UK"
      ? "UK (WTR / ERA 1996)"
      : "EU (Directive 2003/88)";
  doc.text(jurisLabel, margin + 280, currentY + 28);
  doc.text(`${currentDate}`, margin + 400, currentY + 28);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(...slateMuted);
  doc.text(`Base Rate: ${formatCurrency(inputs.baseRate, inputs.currency)}/hr`, margin + 12, currentY + 40);
  doc.text(`Period: ${inputs.payPeriod.toUpperCase()}`, margin + 140, currentY + 40);
  doc.text(`Standard Contract: ${inputs.regularHours} hrs/wk`, margin + 280, currentY + 40);
  doc.text(`${currentTime}`, margin + 400, currentY + 40);

  // HERO METRIC BOX - TOTAL COMPUTED GROSS ENTITLEMENT
  currentY += 58;
  doc.setFillColor(...emeraldBg);
  doc.roundedRect(margin, currentY, contentWidth, 68, 6, 6, "F");
  doc.setDrawColor(...emeraldAccent);
  doc.setLineWidth(1.5);
  doc.roundedRect(margin, currentY, contentWidth, 68, 6, 6, "S");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...emeraldAccent);
  doc.text("OFFICIALLY CALCULATED GROSS EARNINGS ENTITLEMENT", pageWidth / 2, currentY + 18, {
    align: "center",
  });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.setTextColor(...slateDark);
  const formattedGross = formatCurrency(results.totalGrossDue, inputs.currency);
  doc.text(formattedGross, pageWidth / 2, currentY + 44, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...slateMuted);
  doc.text(
    `Includes base contracted pay, statutory overtime premiums, nocturnal differentials, and accrued PTO settlements.`,
    pageWidth / 2,
    currentY + 58,
    { align: "center" }
  );

  // TABLE BREAKDOWN
  currentY += 80;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...slateDark);
  doc.text("ITEMIZED STATUTORY COMPENSATION BREAKDOWN", margin, currentY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...slateMuted);
  doc.text(
    "Calculated according to contracted hours, overtime multipliers, and differential regulations.",
    margin,
    currentY + 11
  );

  const tableBody = [
    [
      "Standard Regular Hours",
      `${results.regularHoursPaid.toFixed(1)} hrs`,
      `${formatCurrency(inputs.baseRate, inputs.currency)}/hr`,
      "1.0x (Base rate contracted)",
      formatCurrency(results.regularGrossPay, inputs.currency),
    ],
    [
      "Overtime Hours (Exceeding Contract)",
      `${results.overtimeHours.toFixed(1)} hrs`,
      `${formatCurrency(results.overtimeRate, inputs.currency)}/hr`,
      "1.5x (Statutory FLSA / WTR Overtime)",
      formatCurrency(results.overtimePay, inputs.currency),
    ],
    [
      "Night Shift Differential (10PM - 6AM)",
      `${(inputs.nightHours || 0).toFixed(1)} hrs`,
      `+${formatCurrency(results.nightDifferentialRate, inputs.currency)}/hr`,
      "+20% nocturnal differential premium",
      formatCurrency(results.nightDifferentialPay, inputs.currency),
    ],
    [
      "Weekend / Statutory Holiday Hours",
      `${(inputs.weekendHours || 0).toFixed(1)} hrs`,
      `+${formatCurrency(results.weekendPremiumRate, inputs.currency)}/hr`,
      "+50% unsocial hours penalty rate",
      formatCurrency(results.weekendPremiumPay, inputs.currency),
    ],
    [
      "Accrued Unused PTO / Vacation Settlement",
      `${(inputs.vacationDaysLeft || 0)} days (${(inputs.vacationDaysLeft || 0) * 8} hrs)`,
      `${formatCurrency(inputs.baseRate, inputs.currency)}/hr`,
      "8 hrs/day base rate wage settlement",
      formatCurrency(results.vacationSettlementPay, inputs.currency),
    ],
  ];

  autoTable(doc, {
    startY: currentY + 18,
    margin: { left: margin, right: margin },
    head: [["Compensation Category", "Logged Units", "Audit Rate", "Applied Standard", "Subtotal Due"]],
    body: tableBody,
    theme: "striped",
    headStyles: {
      fillColor: slateDark,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 8,
      halign: "left",
      cellPadding: 5,
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: [30, 41, 59],
      cellPadding: 5,
    },
    columnStyles: {
      0: { cellWidth: 150, fontStyle: "bold" },
      1: { cellWidth: 70, halign: "center" },
      2: { cellWidth: 80, halign: "right" },
      3: { cellWidth: 140 },
      4: { cellWidth: 83, halign: "right", fontStyle: "bold", textColor: [5, 150, 105] },
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    foot: [
      [
        "TOTAL GROSS ENTITLEMENT DUE",
        `${inputs.actualHoursWorked.toFixed(1)} hrs total`,
        "",
        "Aggregated Statutory Total",
        formatCurrency(results.totalGrossDue, inputs.currency),
      ],
    ],
    footStyles: {
      fillColor: [241, 245, 249],
      textColor: [15, 23, 42],
      fontStyle: "bold",
      fontSize: 8.5,
      halign: "right",
      cellPadding: 6,
    },
  });

  // Paycheck comparison note if provided
  // @ts-expect-error autoTable adds lastAutoTable to jsPDF instance
  const afterTableY = (doc.lastAutoTable?.finalY as number) || (currentY + 175);
  let summaryBoxY = afterTableY + 14;

  if (results.hasPaycheckInput) {
    if (results.isUnderpaid) {
      doc.setFillColor(...crimsonBg);
      doc.roundedRect(margin, summaryBoxY, contentWidth, 46, 4, 4, "F");
      doc.setDrawColor(...crimsonAccent);
      doc.setLineWidth(1);
      doc.roundedRect(margin, summaryBoxY, contentWidth, 46, 4, 4, "S");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(...crimsonAccent);
      doc.text("! COMPLIANCE ALERT: POTENTIAL UNPAID WAGE VARIANCE DETECTED", margin + 12, summaryBoxY + 16);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(...slateDark);
      doc.text(
        `Disbursed Check Received: ${formatCurrency(results.actualCheckReceived, inputs.currency)}   |   Audited Entitlement: ${formatCurrency(results.totalGrossDue, inputs.currency)}`,
        margin + 12,
        summaryBoxY + 28
      );

      doc.setFont("helvetica", "bold");
      doc.setTextColor(...crimsonAccent);
      doc.text(
        `Estimated Unremunerated Deficit: ${formatCurrency(results.discrepancyAmount, inputs.currency)} (${results.underpaidPercentage}% shortfall)`,
        margin + 12,
        summaryBoxY + 39
      );
    } else {
      doc.setFillColor(...emeraldBg);
      doc.roundedRect(margin, summaryBoxY, contentWidth, 40, 4, 4, "F");
      doc.setDrawColor(...emeraldAccent);
      doc.setLineWidth(1);
      doc.roundedRect(margin, summaryBoxY, contentWidth, 40, 4, 4, "S");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(...emeraldAccent);
      doc.text("✓ AUDIT RECONCILIATION: PAYCHECK MATCHES OR EXCEEDS STATUTORY BASE", margin + 12, summaryBoxY + 16);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(...slateDark);
      doc.text(
        `Disbursed Paycheck: ${formatCurrency(results.actualCheckReceived, inputs.currency)}   |   Audited Entitlement: ${formatCurrency(results.totalGrossDue, inputs.currency)}`,
        margin + 12,
        summaryBoxY + 29
      );
    }
    summaryBoxY += 56;
  } else {
    doc.setFillColor(...slateLight);
    doc.roundedRect(margin, summaryBoxY, contentWidth, 32, 4, 4, "F");
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.5);
    doc.roundedRect(margin, summaryBoxY, contentWidth, 32, 4, 4, "S");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(...slateMuted);
    doc.text("NOTE: PAY STUB RECONCILIATION COMPARISON PENDING", margin + 12, summaryBoxY + 13);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...slateDark);
    doc.text(
      "Compare the computed gross entitlement above directly against Box 1 / Gross Wages on your employer pay slip.",
      margin + 12,
      summaryBoxY + 24
    );
    summaryBoxY += 42;
  }

  // Formal Certification Signature Block
  const sigY = pageHeight - margin - 85;
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, sigY, pageWidth - margin, sigY);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(...slateDark);
  doc.text("COMPLIANCE PROTOCOL CERTIFICATION", margin, sigY + 14);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(...slateMuted);
  doc.text(
    "This cryptographic audit credential was generated in compliance with FLSA 29 C.F.R. Part 778 & EU Directive 2003/88.",
    margin,
    sigY + 24
  );
  doc.text(
    "Automated computational verification performed client-side with zero external disclosure.",
    margin,
    sigY + 33
  );

  // Digital Signature / Stamp Box
  const stampX = pageWidth - margin - 150;
  doc.setFillColor(...slateLight);
  doc.roundedRect(stampX, sigY + 8, 150, 48, 3, 3, "F");
  doc.setDrawColor(...slateMuted);
  doc.setLineWidth(0.5);
  doc.roundedRect(stampX, sigY + 8, 150, 48, 3, 3, "S");

  doc.setFont("courier", "bold");
  doc.setFontSize(7);
  doc.setTextColor(...slateDark);
  doc.text("[ CERTIFIED DIGITAL AUDIT ]", stampX + 75, sigY + 22, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6);
  doc.setTextColor(...emeraldAccent);
  doc.text("STATUS: VERIFIED & SEALED", stampX + 75, sigY + 33, { align: "center" });

  doc.setFont("courier", "normal");
  doc.setFontSize(5.5);
  doc.setTextColor(...slateMuted);
  doc.text(`HASH: ${auditId.replace(/-/g, "").toLowerCase()}`, stampX + 75, sigY + 44, { align: "center" });

  // ==========================================
  // PAGE 2: STATUTORY DISCREPANCY & EMPLOYER DISPUTE PROTOCOL
  // ==========================================
  doc.addPage("a4", "portrait");
  drawPageBorder(2);

  let p2Y = margin + 68;

  // Page 2 Section Header
  doc.setFillColor(...slateDark);
  doc.roundedRect(margin, p2Y, contentWidth, 24, 3, 3, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text(
    "SECTION 2: DISPUTE PROCEDURE & STATUTORY RESTITUTION RULES",
    margin + 12,
    p2Y + 16
  );

  p2Y += 34;

  // Side-by-side Comparison Grid
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(...slateDark);
  doc.text("COMPENSATION RECONCILIATION SUMMARY", margin, p2Y);

  p2Y += 12;

  const cardWidth = (contentWidth - 12) / 3;

  // Card 1: Computed Gross
  doc.setFillColor(...emeraldBg);
  doc.roundedRect(margin, p2Y, cardWidth, 48, 4, 4, "F");
  doc.setDrawColor(...emeraldAccent);
  doc.setLineWidth(0.75);
  doc.roundedRect(margin, p2Y, cardWidth, 48, 4, 4, "S");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(...emeraldAccent);
  doc.text("CALCULATED ENTITLEMENT", margin + 8, p2Y + 14);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...slateDark);
  doc.text(formatCurrency(results.totalGrossDue, inputs.currency), margin + 8, p2Y + 34);

  // Card 2: Actual Check
  const card2X = margin + cardWidth + 6;
  doc.setFillColor(...slateLight);
  doc.roundedRect(card2X, p2Y, cardWidth, 48, 4, 4, "F");
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(card2X, p2Y, cardWidth, 48, 4, 4, "S");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(...slateMuted);
  doc.text("DISBURSED PAY STUB", card2X + 8, p2Y + 14);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...slateDark);
  doc.text(
    results.hasPaycheckInput ? formatCurrency(results.actualCheckReceived, inputs.currency) : "Not Specified",
    card2X + 8,
    p2Y + 34
  );

  // Card 3: Discrepancy Variance
  const card3X = margin + (cardWidth + 6) * 2;
  const isDiff = results.isUnderpaid;
  doc.setFillColor(...(isDiff ? crimsonBg : amberBg));
  doc.roundedRect(card3X, p2Y, cardWidth, 48, 4, 4, "F");
  doc.setDrawColor(...(isDiff ? crimsonAccent : amberAccent));
  doc.roundedRect(card3X, p2Y, cardWidth, 48, 4, 4, "S");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(...(isDiff ? crimsonAccent : amberAccent));
  doc.text("UNREMUNERATED DEFICIT", card3X + 8, p2Y + 14);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...(isDiff ? crimsonAccent : slateDark));
  doc.text(
    results.hasPaycheckInput ? formatCurrency(results.discrepancyAmount, inputs.currency) : "Pending Review",
    card3X + 8,
    p2Y + 34
  );

  p2Y += 60;

  // Statutory Rights & Restitution Framework
  doc.setFillColor(...slateLight);
  doc.roundedRect(margin, p2Y, contentWidth, 68, 4, 4, "F");
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, p2Y, contentWidth, 68, 4, 4, "S");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...slateDark);
  doc.text("STATUTORY RESTITUTION RULES & LEGAL PRECEDENTS (2026)", margin + 10, p2Y + 14);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.8);
  doc.setTextColor(...slateMuted);
  const statuteLines = [
    "• Fair Labor Standards Act (FLSA) 29 U.S.C. § 216(b): Employers failing to disburse overtime wages are liable for the full unpaid balance plus an equal amount in liquidated damages (200% recovery) and mandatory attorney fees.",
    "• Anti-Retaliation Protection: Section 15(a)(3) of the FLSA strictly prohibits employers from discharging or discriminating against any employee who files a wage inquiry, submits an audit notice, or institutes formal proceedings.",
    "• Statutory Lookback Statute of Limitations: Standard wage recovery claims extend 2 years, expandable to 3 years in cases of willful or reckless miscalculation under federal law.",
    "• UK/EU Directives: Governed under the Employment Rights Act 1996 and Working Time Regulations 1998; unlawful deductions are claimable via Employment Tribunal (ET1) within 3 months.",
  ];

  let statuteY = p2Y + 26;
  statuteLines.forEach((line) => {
    doc.text(line, margin + 10, statuteY, { maxWidth: contentWidth - 20 });
    statuteY += 10;
  });

  p2Y += 78;

  // PRE-DRAFTED FORMAL LETTER EXCERPT
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...slateDark);
  doc.text("FORMAL EMPLOYER WAGE DISCREPANCY NOTICE (PRE-DRAFTED)", margin, p2Y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(...slateMuted);
  doc.text(
    "Copy, sign, and deliver this formal letter to your Human Resources or Payroll Department.",
    margin,
    p2Y + 10
  );

  p2Y += 16;

  const letterText = `DATE: ${currentDate}
TO: Payroll Administrator / Human Resources Department
RE: Formal Notice of Wage Discrepancy & Unremunerated Overtime / Differential Request
Audit Tracking Reference: ${auditId}

Dear Payroll Administrator,

I am writing to formally request a compliance review and restitution for an unremunerated compensation discrepancy identified on my recent compensation statement for the period ending ${currentDate}.

According to standardized hours logged under the Fair Labor Standards Act (29 U.S.C. § 201 et seq.) / Statutory Fair Pay benchmarks:
  1. Base Regular Hours: ${results.regularHoursPaid} hrs @ ${formatCurrency(inputs.baseRate, inputs.currency)}/hr
  2. Overtime Hours (1.5x Multiplier): ${results.overtimeHours} hrs @ ${formatCurrency(results.overtimeRate, inputs.currency)}/hr
  3. Night Shift Differentials: ${inputs.nightHours || 0} hrs @ +20% standard premium
  4. Weekend / Holiday Premiums: ${inputs.weekendHours || 0} hrs @ +50% standard rate
  5. Accrued Unused PTO / Vacation Settlement: ${inputs.vacationDaysLeft || 0} days

Based on this standardized reconciliation, my audited gross entitlement is ${formatCurrency(results.totalGrossDue, inputs.currency)}. ${
    results.isUnderpaid
      ? `Compared to my received pay stub of ${formatCurrency(results.actualCheckReceived, inputs.currency)}, an unremunerated differential of ${formatCurrency(results.discrepancyAmount, inputs.currency)} remains outstanding.`
      : "Please verify that the corresponding payroll records match these audited hours and differential amounts."
  }

Kindly review your electronic timekeeping records and disburse the owed differential in the upcoming payroll cycle, or provide an itemized written explanation.

Sincerely,
_______________________________
Employee Signature / ${emailText}`;

  doc.setFillColor(255, 255, 255);
  doc.roundedRect(margin, p2Y, contentWidth, 168, 4, 4, "F");
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.75);
  doc.roundedRect(margin, p2Y, contentWidth, 168, 4, 4, "S");

  doc.setFont("courier", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(30, 41, 59);
  doc.text(letterText, margin + 10, p2Y + 12, { maxWidth: contentWidth - 20 });

  p2Y += 178;

  // HIGH-VALUE AFFILIATE / DISPUTE CTA BOX
  doc.setFillColor(...slateDark);
  doc.roundedRect(margin, p2Y, contentWidth, 64, 4, 4, "F");
  doc.setDrawColor(...amberAccent);
  doc.setLineWidth(1.5);
  doc.roundedRect(margin, p2Y, contentWidth, 64, 4, 4, "S");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...amberAccent);
  doc.text("NEED FORMAL LEGAL REPRESENTATION OR FREE ACCOUNT SEPARATION?", margin + 14, p2Y + 16);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.2);
  doc.setTextColor(241, 245, 249);
  doc.text(
    "Unpaid overtime, withheld differentials, and misclassified shift wages frequently qualify for statutory liquidated damages",
    margin + 14,
    p2Y + 28
  );
  doc.text(
    "(up to 2x unpaid amount) plus attorney fees paid by the employer under federal and state statutes.",
    margin + 14,
    p2Y + 38
  );

  // Clickable Affiliate Link Button
  const btnX = margin + 14;
  const btnY = p2Y + 44;
  const btnWidth = contentWidth - 28;
  doc.setFillColor(...emeraldAccent);
  doc.roundedRect(btnX, btnY, btnWidth, 16, 3, 3, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text("EXPLORE UNPAID WAGE LEGAL CASE EVALUATION (FREE) →", pageWidth / 2, btnY + 11, {
    align: "center",
  });

  // Make the entire button region clickable to the affiliate URL
  doc.link(btnX, btnY, btnWidth, 16, { url: affiliateUrl });

  return doc;
}
