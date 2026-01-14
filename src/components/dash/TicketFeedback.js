"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import {
  Star,
  ClipboardList,
  Send,
  CheckCircle,
  Loader2,
  MessageSquare,
  Wrench,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/context/UserContext";

export default function TicketFeedback({ ticketId }) {
  const { user } = useUser();
  const role = user?.role?.toLowerCase();

  const [feedbacks, setFeedbacks] = useState({
    customer: null,
    mechanic: null,
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form States
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [workSummary, setWorkSummary] = useState("");
  const [issuesFound, setIssuesFound] = useState("");
  const [recommendations, setRecommendations] = useState("");

  useEffect(() => {
    fetchFeedback();
  }, [ticketId]);

  const fetchFeedback = async () => {
    try {
      const res = await api.get(`/feedback/${ticketId}/feedback`);
      setFeedbacks({
        customer: res.data.customerFeedback,
        mechanic: res.data.mechanicFeedback,
      });
    } catch (err) {
      console.error("Error fetching feedback:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let endpoint = `/feedback/${ticketId}/${role}-feedback`;
      let payload =
        role === "client"
          ? { rating, comment }
          : { workSummary, issuesFound, recommendations };

      await api.post(endpoint, payload);
      await fetchFeedback();
    } catch (err) {
      alert("Failed to submit. Please check your connection.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="p-8 text-center">
        <Loader2 className="animate-spin mx-auto text-slate-300" />
      </div>
    );

  const hasSubmittedThisRole =
    role === "client" ? !!feedbacks.customer : !!feedbacks.mechanic;

  return (
    <div className="space-y-6">
      {/* --- DISPLAY SECTION: SHOW ALL AVAILABLE FEEDBACK --- */}
      {(feedbacks.customer || feedbacks.mechanic) && (
        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">
            Service Reviews
          </h3>

          {/* Mechanic's Report */}
          {feedbacks.mechanic && (
            <div className="bg-white rounded-[32px] p-6 border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                  <Wrench size={14} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                  Mechanic's Report
                </span>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400">
                    Work Summary
                  </p>
                  <p className="text-sm text-slate-700 font-medium">
                    {feedbacks.mechanic.workSummary}
                  </p>
                </div>
                {feedbacks.mechanic.issuesFound && (
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-400">
                      Issues Noted
                    </p>
                    <p className="text-sm text-slate-600">
                      {feedbacks.mechanic.issuesFound}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Customer's Review */}
          {feedbacks.customer && (
            <div className="bg-white rounded-[32px] p-6 border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                  <User size={14} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                  Customer Review
                </span>
              </div>
              <div className="flex gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={14}
                    fill={s <= feedbacks.customer.rating ? "#f59e0b" : "none"}
                    className={
                      s <= feedbacks.customer.rating
                        ? "text-amber-500"
                        : "text-slate-200"
                    }
                  />
                ))}
              </div>
              <p className="text-slate-700 font-medium italic text-sm">
                "{feedbacks.customer.comment}"
              </p>
            </div>
          )}
        </div>
      )}

      {/* --- FORM SECTION: ONLY SHOW IF LOGGED-IN ROLE HASN'T SUBMITTED YET --- */}
      {!hasSubmittedThisRole && (
        <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-xl ring-4 ring-blue-50/50">
          <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest mb-6 flex items-center gap-2">
            {role === "client" ? (
              <MessageSquare size={14} />
            ) : (
              <ClipboardList size={14} />
            )}
            {role === "client" ? "Rate Your Experience" : "Submit Work Report"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            {role === "client" ? (
              <>
                <div className="flex justify-center gap-2 p-4 bg-slate-50 rounded-2xl">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                    >
                      <Star
                        size={32}
                        fill={rating >= star ? "#f59e0b" : "none"}
                        className={
                          rating >= star ? "text-amber-500" : "text-slate-300"
                        }
                      />
                    </button>
                  ))}
                </div>
                <textarea
                  placeholder="Tell us how the service was..."
                  className="feedback-input"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                />
              </>
            ) : (
              <>
                <textarea
                  placeholder="Summary of work performed..."
                  className="feedback-input"
                  value={workSummary}
                  onChange={(e) => setWorkSummary(e.target.value)}
                  required
                />
                <textarea
                  placeholder="Any underlying issues found?"
                  className="feedback-input"
                  value={issuesFound}
                  onChange={(e) => setIssuesFound(e.target.value)}
                />
                <textarea
                  placeholder="Future recommendations..."
                  className="feedback-input"
                  value={recommendations}
                  onChange={(e) => setRecommendations(e.target.value)}
                />
              </>
            )}

            <button
              disabled={submitting || (role === "client" && rating === 0)}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-600 disabled:bg-slate-200 transition-all shadow-lg shadow-slate-200"
            >
              {submitting ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <Send size={18} />
                  {role === "client" ? "Post Review" : "Submit Report"}
                </>
              )}
            </button>
          </form>
        </div>
      )}

      <style jsx>{`
        .feedback-input {
          @apply w-full p-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all text-slate-700 font-medium text-sm;
        }
      `}</style>
    </div>
  );
}
