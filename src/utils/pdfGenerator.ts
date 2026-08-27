import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { formatINR, type Scheme } from "@/lib/farmpay";

export type PassportProfile = {
  fullName: string;
  state: string;
  district: string;
  landholdingHa: number;
  crops: string[];
};

const FOREST: [number, number, number] = [39, 103, 73]; // #276749
const TEAL: [number, number, number] = [13, 148, 136];
const SLATE: [number, number, number] = [51, 65, 85];
const AMBER: [number, number, number] = [217, 119, 6];

function docId() {
  return `FP-${Math.floor(1000 + Math.random() * 9000)}`;
}

function actionStep(status: string) {
  if (status === "eligible") return "Apply online with Aadhaar + land record";
  if (status === "likely") return "Verify land record, then apply at CSC";
  return "Confirm state eligibility at Kisan Seva Kendra";
}

function statusLabel(status: string) {
  if (status === "eligible") return "Eligible";
  if (status === "likely") return "Conditional";
  return "Potential";
}

export function generateSchemePassport(profile: PassportProfile, schemes: Scheme[]) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const M = 40;
  const id = docId();
  const date = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  // Header banner
  doc.setFillColor(...FOREST);
  doc.rect(0, 0, pageW, 96, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("FarmPay AI", M, 42);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text("Government Scheme Eligibility Passport", M, 62);
  doc.setFontSize(9);
  doc.text(`Doc ID: ${id}`, pageW - M, 42, { align: "right" });
  doc.text(`Date: ${date}`, pageW - M, 58, { align: "right" });

  // Profile card
  let y = 124;
  doc.setDrawColor(...FOREST);
  doc.setFillColor(247, 250, 248);
  doc.setLineWidth(1);
  doc.roundedRect(M, y, pageW - M * 2, 116, 6, 6, "FD");

  doc.setTextColor(...FOREST);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("FARMER PROFILE SUMMARY", M + 16, y + 24);

  const rows: [string, string][] = [
    ["Farmer Name", profile.fullName || "-"],
    ["State / Region", [profile.state, profile.district].filter(Boolean).join(" / ") || "-"],
    ["Land Holding", `${profile.landholdingHa} Hectares`],
    ["Primary Crop", profile.crops.length ? profile.crops.join(", ") : "-"],
    ["Verification Engine", "Supabase Edge Engine"],
  ];

  doc.setFontSize(10);
  let ry = y + 44;
  rows.forEach(([label, value]) => {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...SLATE);
    doc.text(`${label}:`, M + 16, ry);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(20, 30, 25);
    doc.text(String(value), M + 150, ry, { maxWidth: pageW - M * 2 - 170 });
    ry += 15;
  });

  y += 140;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...FOREST);
  doc.text("Eligible Schemes", M, y);

  autoTable(doc, {
    startY: y + 10,
    margin: { left: M, right: M },
    head: [["Scheme Name & Ministry", "Annual Benefit", "Status", "Required Action Step"]],
    body: schemes.map((s) => [
      `${s.title}\n${s.category}`,
      formatINR(Number(s.grant_value)),
      statusLabel(s.status),
      actionStep(s.status),
    ]),
    styles: { font: "helvetica", fontSize: 9, cellPadding: 6, valign: "middle" },
    headStyles: { fillColor: FOREST, textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [244, 247, 245] },
    columnStyles: {
      0: { cellWidth: 190 },
      1: { cellWidth: 80, textColor: AMBER, fontStyle: "bold" },
      2: { cellWidth: 70 },
      3: { cellWidth: 175 },
    },
  });

  const afterTable = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable
    .finalY;
  let fy = afterTable + 28;
  if (fy > doc.internal.pageSize.getHeight() - 110) {
    doc.addPage();
    fy = 60;
  }

  doc.setDrawColor(...TEAL);
  doc.setFillColor(236, 253, 250);
  doc.setLineWidth(1.2);
  doc.roundedRect(M, fy, pageW - M * 2, 66, 6, 6, "FD");
  doc.setTextColor(...TEAL);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Deterministic Audit Verification", M + 16, fy + 24);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...SLATE);
  doc.text(
    "Generated via FarmPay AI Edge Rule Engine. Present this passport at your local Kisan Seva Kendra.",
    M + 16,
    fy + 42,
    { maxWidth: pageW - M * 2 - 32 },
  );

  doc.save(`FarmPay-Scheme-Passport-${id}.pdf`);
  return id;
}
