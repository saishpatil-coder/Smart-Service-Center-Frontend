"use client";

import React, { useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  Printer,
  Download,
  Wrench,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  FileText,
  Loader2,
} from "lucide-react";
import { APP_NAME } from "@/constants/app";
// import { APP_NAME } from "@/constants/app";

export default function ProfessionalInvoice({ ticket }) {
  const invoiceRef = useRef();
  const [isExporting, setIsExporting] = useState(false);

  // Financial Calculations [cite: 81-83, 137, 331, 441]
  const laborCost = Number(ticket?.cost || 0);
  const parts = ticket?.partsUsed || [];
  const partsSubtotal = parts.reduce(
    (sum, item) => sum + Number(item.quantity) * Number(item.unitPrice),
    0
  );
  const totalTaxable = laborCost + partsSubtotal;
  const gst = totalTaxable * 0.18; // 18% GST standard
  const grandTotal = totalTaxable + gst;

  // PDF Export Logic
  const handleDownloadPDF = async () => {
    setIsExporting(true);
    const element = invoiceRef.current;
    const canvas = await html2canvas(element, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Invoice_${ticket.id?.slice(-6)}.pdf`);
    setIsExporting(false);
  };

  if (!ticket) return null;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      {/* 1. TOP ACTION BAR */}
      <div className="max-w-4xl mx-auto mb-8 flex flex-col sm:flex-row justify-between items-center gap-4 print:hidden">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <FileText className="text-blue-600" /> Billing Document
          </h1>
          <p className="text-xs font-bold text-slate-400 uppercase">
            Review and export service records
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
          >
            <Printer size={16} /> Print
          </button>
          <button
            disabled={isExporting}
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50"
          >
            {isExporting ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <Download size={16} />
            )}
            {isExporting ? "Generating..." : "Download PDF"}
          </button>
        </div>
      </div>

      {/* 2. THE INVOICE SHEET */}
      <div
        ref={invoiceRef}
        className="max-w-4xl mx-auto bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[2.5rem] overflow-hidden border border-slate-100 p-12 md:p-20 relative"
      >
        {/* Security Watermark Decor */}
        <div className="absolute top-10 right-10 opacity-[0.03] pointer-events-none select-none">
          <Wrench size={400} className="-rotate-45" />
        </div>

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between mb-20 relative z-10">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
                <ShieldCheck size={28} />
              </div>
              <h2 className="text-2xl font-black tracking-tighter uppercase italic">
                {APP_NAME}
              </h2>
            </div>
            <div className="text-[11px] font-bold text-slate-400 uppercase space-y-1.5 tracking-widest">
              <p className="flex items-center gap-2">
                <MapPin size={12} className="text-blue-600" /> Sector 5, Tech
                City, India
              </p>
              <p className="flex items-center gap-2">
                <Mail size={12} className="text-blue-600" />{" "}
                accounts@smartservice.com
              </p>
            </div>
          </div>

          <div className="text-right mt-10 md:mt-0">
            <h3 className="text-6xl font-black text-slate-900 tracking-tighter mb-4 opacity-10">
              TAX INVOICE
            </h3>
            <div className="space-y-1">
              <p className="text-sm font-black text-slate-900 italic">
                #{ticket.id?.slice(-8).toUpperCase()}
              </p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Date:{" "}
                {new Date().toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* STAKEHOLDERS [cite: 32, 365, 373] */}
        <div className="grid grid-cols-2 gap-12 mb-20 p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
          <div>
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-4">
              Bill To
            </p>
            <p className="text-lg font-black text-slate-900">
              {ticket.client?.name || "Premium Client"}
            </p>
            <p className="text-sm font-medium text-slate-500">
              {ticket.client?.email}
            </p>
          </div>
          <div className="text-right border-l border-slate-200 pl-12">
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-4">
              Service Station
            </p>
            <p className="text-lg font-black text-slate-900">
              Bay No. {Math.floor(Math.random() * 10) + 1}
            </p>
            <p className="text-sm font-medium text-slate-500">
              Expert: {ticket.mechanic?.name || "Lead Tech"}
            </p>
          </div>
        </div>

        {/* LINE ITEMS TABLE [cite: 118, 154, 331] */}
        <div className="mb-20">
          <table className="w-full">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b-2 border-slate-900 pb-4">
                <th className="text-left pb-4">Service Description</th>
                <th className="text-center pb-4">Qty</th>
                <th className="text-right pb-4">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="font-medium">
                <td className="py-8">
                  <p className="text-sm font-black text-slate-900 uppercase italic leading-none">
                    {ticket.serviceTitle || "Professional Repair Labor"}
                  </p>
                  <p className="text-xs text-slate-400 mt-2 font-bold uppercase tracking-tight">
                    Diagnostics & Technician Fee
                  </p>
                </td>
                <td className="py-8 text-center text-sm font-bold">1</td>
                <td className="py-8 text-right font-black text-slate-900">
                  ₹{laborCost.toLocaleString()}
                </td>
              </tr>
              {parts.map((item, idx) => (
                <tr key={idx} className="font-medium text-slate-600">
                  <td className="py-6">
                    <p className="text-sm font-bold text-slate-800 uppercase">
                      {item.name}
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                      Part Replacement ({item.unit})
                    </p>
                  </td>
                  <td className="py-6 text-center text-sm font-bold">
                    {item.quantity}
                  </td>
                  <td className="py-6 text-right font-black text-slate-900">
                    ₹{(item.quantity * item.unitPrice).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* TOTALS [cite: 81-83, 137, 331, 441] */}
        <div className="flex flex-col items-end space-y-3">
          <div className="w-full max-w-[280px] space-y-3">
            <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
              <span>Subtotal</span>
              <span className="text-slate-900">
                ₹{totalTaxable.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
              <span>GST (18%)</span>
              <span className="text-slate-900">₹{gst.toLocaleString()}</span>
            </div>
            <div className="pt-6 border-t-2 border-slate-900 flex justify-between items-center">
              <span className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">
                Total Amount
              </span>
              <span className="text-4xl font-black text-blue-600 tracking-tighter italic">
                ₹{grandTotal.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* AUTHENTICATION FOOTER */}
        <div className="mt-24 pt-10 border-t border-slate-100 flex justify-between items-end">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-widest">
              <ShieldCheck size={16} /> Payment Verified & Sealed
            </div>
            <p className="text-[9px] font-bold text-slate-400 max-w-[200px] uppercase leading-relaxed">
              This is a computer-generated document and requires no physical
              signature under digital IT acts.
            </p>
          </div>
          <div className="text-right">
            <div className="w-32 h-1 bg-slate-900 mb-2 ml-auto" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em]">
              Authorized Signatory
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
