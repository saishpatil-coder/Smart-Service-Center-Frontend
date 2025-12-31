"use client";

import { useEffect, useState, useMemo } from "react";
import api from "@/lib/axios";
import {
  ShieldAlert,
  CheckCircle2,
  CreditCard,
  Printer,
  Download,
  Wrench,
  ChevronRight,
  Loader2,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ConsolidatedInvoicePage() {
  const [data, setData] = useState({
    tickets: [],
    totalLabor: 0,
    parts: [],
  });
  const [paying, setPaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  async function loadInvoice() {
    try {
      setLoading(true);
      const res = await api.get("/client/unpaid-invoice");
      setData(res.data);
    } catch (err) {
      console.error("Invoice sync error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadInvoice();
  }, []);

  const { subtotal, gst, grandTotal } = useMemo(() => {
    const partsTotal = (data.parts || []).reduce(
      (s, p) => s + Number(p.quantity || 0) * Number(p.unitPrice || 0),
      0
    );
    const taxable = Number(data.totalLabor || 0) + partsTotal;
    return {
      subtotal: taxable,
      gst: taxable * 0.18,
      grandTotal: taxable * 1.18,
    };
  }, [data]);

  async function handlePay() {
    try {
      setPaying(true);
      // Implementation of isPaid column logic as discussed
      await api.post("/client/pay-invoice", { paymentMethod: "ONLINE" });
      setPaymentSuccess(true);
      setTimeout(() => {
        loadInvoice();
        setPaymentSuccess(false);
      }, 3000);
    } catch (err) {
      console.error("Payment failure:", err);
    } finally {
      setPaying(false);
    }
  }

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <p className="text-slate-500 font-bold animate-pulse uppercase tracking-widest text-xs">
          Generating Statement...
        </p>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 px-4">
      {/* Action Header */}
      <div className="flex justify-between items-end mb-4">
        <div>
          <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest">
            Financial Portal
          </h2>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic">
            Statement of Services
          </h1>
        </div>
        {!paying && data.tickets.length > 0 && (
          <div className="flex gap-2 print:hidden">
            <button className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all text-slate-600">
              <Printer size={18} />
            </button>
            <button className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all text-slate-600">
              <Download size={18} />
            </button>
          </div>
        )}
      </div>

      <div
        className={cn(
          "bg-white shadow-2xl rounded-[2.5rem] overflow-hidden border border-slate-200 transition-all duration-500",
          paymentSuccess && "ring-8 ring-emerald-50 border-emerald-200"
        )}
      >
        {/* Top Branding Bar */}
        <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Wrench size={22} />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase italic">
              Smart Service Hub
            </span>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
              Reference ID
            </p>
            <p className="text-sm font-mono font-bold">
              ST-{new Date().getTime().toString().slice(-6)}
            </p>
          </div>
        </div>

        {/* Success Overlay */}
        {paymentSuccess && (
          <div className="p-10 text-center bg-emerald-50 animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-200">
              <CheckCircle2 className="text-white" size={40} />
            </div>
            <h3 className="text-2xl font-black text-emerald-900">
              Transaction Approved
            </h3>
            <p className="text-emerald-700 font-medium">
              Digital receipt has been sent to your registered email.
            </p>
          </div>
        )}

        <div
          className={cn(
            "p-10 md:p-14 space-y-12",
            paymentSuccess && "opacity-20 pointer-events-none"
          )}
        >
          {/* Job Breakdown */}
          <section>
            <div className="flex items-center gap-2 mb-6 text-slate-400">
              <FileText size={16} />
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">
                Service Line Items
              </h4>
            </div>

            {data.tickets.length === 0 ? (
              <div className="py-12 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                <p className="text-slate-500 font-bold italic">
                  No outstanding jobs found in your history.
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {data.tickets.map((t, i) => (
                  <div
                    key={t.id}
                    className="group flex justify-between items-center bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:border-blue-200 transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-200/50"
                  >
                    <div className="flex items-center gap-4">
                      <span className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-400 group-hover:text-blue-600 transition-colors">
                        0{i + 1}
                      </span>
                      <div>
                        <p className="text-sm font-black text-slate-900 uppercase">
                          {t.title}
                        </p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight italic">
                          Labor & Maintenance Snapshots [cite: 330-333]
                        </p>
                      </div>
                    </div>
                    <span className="text-lg font-black text-slate-900 tracking-tighter">
                      ₹{Number(t.cost).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Parts Section */}
          {data.parts.length > 0 && (
            <section className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 opacity-10">
                <Wrench size={120} />
              </div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Parts &
                Consumables Log
              </h4>
              <div className="space-y-4 relative z-10">
                {data.parts.map((p, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center text-sm border-b border-white/5 pb-3 last:border-0"
                  >
                    <div>
                      <span className="font-bold text-slate-100 block">
                        {p.name}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                        Inventory SKU:{" "}
                        {p.id?.slice(-6).toUpperCase() || "GEN-PART"}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 font-medium text-xs mr-4">
                        {p.quantity} Units × ₹{p.unitPrice}
                      </span>
                      <span className="font-black text-blue-400">
                        ₹{(p.quantity * p.unitPrice).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Totals Section */}
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-10 pt-8 border-t border-slate-100">
            <div className="space-y-2 text-center md:text-left">
              <div className="flex items-center gap-2 text-amber-600 font-black text-[10px] uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
                <ShieldAlert size={14} /> Outstanding Balance Required
              </div>
              <p className="text-xs text-slate-400 font-medium max-w-[240px]">
                This statement consolidates all completed jobs pending payment
                as of {new Date().toLocaleDateString()}.
              </p>
            </div>

            <div className="w-full max-w-xs bg-white p-6 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <span>Taxable Base</span>
                  <span className="text-slate-900">
                    ₹{subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <span>GST (18%)</span>
                  <span className="text-slate-900">
                    ₹{gst.toLocaleString()}
                  </span>
                </div>
                <div className="pt-4 border-t-2 border-slate-900 flex justify-between items-center">
                  <span className="text-xs font-black uppercase text-slate-900 italic">
                    Grand Total
                  </span>
                  <span className="text-3xl font-black text-blue-600 tracking-tighter">
                    ₹{grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Action */}
          {!paymentSuccess && data.tickets.length > 0 && (
            <button
              onClick={handlePay}
              disabled={paying}
              className="group relative w-full bg-blue-600 hover:bg-blue-700 text-white rounded-[1.5rem] py-5 px-8 font-black uppercase tracking-widest shadow-2xl shadow-blue-300 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {paying ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Authorizing Gateway...</span>
                </>
              ) : (
                <>
                  <CreditCard size={20} />
                  <span>Secure Checkout</span>
                  <ChevronRight
                    className="group-hover:translate-x-1 transition-transform"
                    size={18}
                  />
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] pb-10">
        Certified Electronic Document • No Physical Signature Required
      </p>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="p-10 animate-pulse bg-slate-100 rounded-3xl h-96 w-full" />
  );
}
