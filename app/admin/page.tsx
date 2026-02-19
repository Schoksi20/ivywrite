"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import type { Order, SopStatus } from "@/lib/types";

type OrderSummary = Pick<
  Order,
  "id" | "created_at" | "name" | "email" | "university" | "program" | "degree_type" | "payment_status" | "sop_status" | "amount_paid"
>;

const STATUS_LABELS: Record<SopStatus, { label: string; color: string }> = {
  awaiting_payment: { label: "Awaiting Payment", color: "text-yellow-500 bg-yellow-500/10" },
  paid: { label: "Paid — Queued", color: "text-blue-500 bg-blue-500/10" },
  generating: { label: "Generating", color: "text-purple-500 bg-purple-500/10" },
  delivered: { label: "Delivered", color: "text-accent bg-accent-dim" },
  revision_requested: { label: "Revision Requested", color: "text-orange-500 bg-orange-500/10" },
  revision_delivered: { label: "Revision Delivered", color: "text-accent bg-accent-dim" },
};

const FILTERS: { value: string; label: string }[] = [
  { value: "all", label: "All" },
  { value: "paid", label: "Queued" },
  { value: "generating", label: "Generating" },
  { value: "delivered", label: "Delivered" },
  { value: "revision_requested", label: "Revision" },
];

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [filter, setFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [regenerating, setRegenerating] = useState(false);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/orders?status=${filter}`);
    if (res.ok) {
      const data = await res.json();
      setOrders(data);
    } else if (res.status === 401) {
      setAuthed(false);
    }
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    if (authed) fetchOrders();
  }, [authed, filter, fetchOrders]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setAuthed(true);
    } else {
      setLoginError("Invalid password");
    }
  }

  async function openOrderDetail(id: string) {
    const res = await fetch(`/api/admin/orders?id=${id}`);
    if (res.ok) {
      const order = await res.json();
      setSelectedOrder(order);
      setAdminNotes(order.admin_notes || "");
    }
  }

  async function saveNotes() {
    if (!selectedOrder) return;
    await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: selectedOrder.id, updates: { admin_notes: adminNotes } }),
    });
    setSelectedOrder({ ...selectedOrder, admin_notes: adminNotes });
  }

  async function updateStatus(status: SopStatus) {
    if (!selectedOrder) return;
    await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: selectedOrder.id, updates: { sop_status: status } }),
    });
    setSelectedOrder({ ...selectedOrder, sop_status: status });
    fetchOrders();
  }

  async function regenerateSOP(sendEmail: boolean) {
    if (!selectedOrder) return;
    setRegenerating(true);
    try {
      const res = await fetch("/api/admin/regenerate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: selectedOrder.id, sendEmail }),
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedOrder({
          ...selectedOrder,
          sop_content: data.sopContent,
          sop_status: "delivered",
        });
        fetchOrders();
      }
    } catch (err) {
      console.error("Regeneration failed:", err);
    }
    setRegenerating(false);
  }

  // Stats
  const totalOrders = orders.length;
  const paidOrders = orders.filter((o) => o.payment_status === "paid").length;
  const deliveredOrders = orders.filter((o) => o.sop_status === "delivered" || o.sop_status === "revision_delivered").length;
  const revenue = orders.reduce((sum, o) => sum + (o.amount_paid || 0), 0) / 100;

  if (!authed) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center px-5">
        <form onSubmit={handleLogin} className="max-w-sm w-full">
          <Link href="/" className="text-2xl font-extrabold tracking-tight text-heading inline-block mb-8">
            ivy<span className="text-accent">write</span>
          </Link>
          <h1 className="text-xl font-bold text-heading mb-2">Admin Dashboard</h1>
          <p className="text-sm text-muted mb-6">Enter the admin password to continue.</p>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm text-heading placeholder:text-muted2 outline-none focus:border-accent mb-3"
            autoFocus
          />
          {loginError && <p className="text-red-500 text-xs mb-3">{loginError}</p>}
          <button
            type="submit"
            className="w-full bg-accent text-white dark:text-black text-sm font-bold px-6 py-3 rounded-lg hover:shadow-[0_4px_16px_var(--accent-glow)] transition-all"
          >
            Sign In
          </button>
        </form>
      </div>
    );
  }

  if (selectedOrder) {
    const answers = selectedOrder.questionnaire_answers;
    return (
      <div className="min-h-screen bg-bg">
        <div className="sticky top-0 z-40 bg-bg/95 backdrop-blur-xl border-b border-border">
          <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
            <button onClick={() => { setSelectedOrder(null); fetchOrders(); }} className="text-sm text-muted hover:text-heading transition-colors">
              &larr; Back to orders
            </button>
            <span className="text-xs text-muted">Order: {selectedOrder.id.slice(0, 8)}...</span>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-5 py-8">
          {/* Order header */}
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="flex-1 bg-card border border-border rounded-xl p-6">
              <h2 className="text-lg font-bold text-heading mb-4">Student Details</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-muted">Name:</span> <span className="text-heading font-medium">{selectedOrder.name}</span></div>
                <div><span className="text-muted">Email:</span> <span className="text-heading font-medium">{selectedOrder.email}</span></div>
                <div><span className="text-muted">University:</span> <span className="text-heading font-medium">{selectedOrder.university}</span></div>
                <div><span className="text-muted">Program:</span> <span className="text-heading font-medium">{selectedOrder.program}</span></div>
                <div><span className="text-muted">Degree:</span> <span className="text-heading font-medium">{selectedOrder.degree_type}</span></div>
                <div><span className="text-muted">Payment:</span> <span className="text-heading font-medium">{selectedOrder.payment_status}</span></div>
              </div>
            </div>

            <div className="w-full md:w-72 space-y-4">
              <div className="bg-card border border-border rounded-xl p-4">
                <div className="text-xs text-muted mb-2">SOP Status</div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_LABELS[selectedOrder.sop_status]?.color || "text-muted"}`}>
                  {STATUS_LABELS[selectedOrder.sop_status]?.label || selectedOrder.sop_status}
                </span>
              </div>

              <div className="bg-card border border-border rounded-xl p-4 space-y-2">
                <div className="text-xs text-muted mb-2">Actions</div>
                <button
                  onClick={() => regenerateSOP(false)}
                  disabled={regenerating}
                  className="w-full text-xs font-semibold text-heading bg-surface border border-border rounded-lg px-3 py-2 hover:bg-card-hover transition-colors disabled:opacity-50"
                >
                  {regenerating ? "Generating..." : "Regenerate SOP"}
                </button>
                <button
                  onClick={() => regenerateSOP(true)}
                  disabled={regenerating}
                  className="w-full text-xs font-semibold text-white dark:text-black bg-accent rounded-lg px-3 py-2 hover:shadow-[0_4px_16px_var(--accent-glow)] transition-all disabled:opacity-50"
                >
                  Regenerate & Email
                </button>
                <button
                  onClick={() => updateStatus("revision_requested")}
                  className="w-full text-xs font-semibold text-orange-500 bg-orange-500/10 border border-orange-500/20 rounded-lg px-3 py-2 hover:bg-orange-500/15 transition-colors"
                >
                  Mark Revision Needed
                </button>
              </div>
            </div>
          </div>

          {/* Questionnaire answers */}
          <div className="bg-card border border-border rounded-xl p-6 mb-6">
            <h3 className="text-base font-bold text-heading mb-4">Questionnaire Answers</h3>
            <div className="space-y-4">
              {Object.entries(answers).map(([key, value]) => (
                <div key={key}>
                  <div className="text-xs text-accent font-semibold mb-1 capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </div>
                  <div className="text-sm text-body leading-relaxed whitespace-pre-wrap bg-surface rounded-lg p-3">
                    {value as string}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Generated SOP */}
          {selectedOrder.sop_content && (
            <div className="bg-card border border-border rounded-xl p-6 mb-6">
              <h3 className="text-base font-bold text-heading mb-4">Generated SOP</h3>
              <div className="text-sm text-body leading-relaxed whitespace-pre-wrap bg-surface rounded-lg p-4 max-h-[600px] overflow-y-auto">
                {selectedOrder.sop_content}
              </div>
            </div>
          )}

          {/* Admin notes */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-base font-bold text-heading mb-4">Admin Notes</h3>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows={4}
              className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-sm text-heading placeholder:text-muted2 outline-none focus:border-accent resize-y mb-3"
              placeholder="Add internal notes about this order..."
            />
            <button
              onClick={saveNotes}
              className="bg-accent text-white dark:text-black text-xs font-bold px-5 py-2 rounded-lg hover:shadow-[0_4px_16px_var(--accent-glow)] transition-all"
            >
              Save Notes
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="sticky top-0 z-40 bg-bg/95 backdrop-blur-xl border-b border-border">
        <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
          <Link href="/" className="text-[17px] font-extrabold tracking-tight text-heading">
            ivy<span className="text-accent">write</span>
            <span className="text-xs font-medium text-muted ml-2">admin</span>
          </Link>
          <button
            onClick={() => { document.cookie = "admin_session=; path=/; max-age=0"; setAuthed(false); }}
            className="text-xs text-muted hover:text-heading transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Total Orders", value: totalOrders },
            { label: "Paid", value: paidOrders },
            { label: "Delivered", value: deliveredOrders },
            { label: "Revenue", value: `\u20B9${revenue.toLocaleString()}` },
          ].map((s, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-4">
              <div className="text-xs text-muted mb-1">{s.label}</div>
              <div className="text-2xl font-bold text-heading">{s.value}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`text-xs font-semibold px-3.5 py-1.5 rounded-full transition-colors ${
                filter === f.value
                  ? "bg-accent text-white dark:text-black"
                  : "bg-card border border-border text-muted hover:text-heading"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Orders table */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-border border-t-accent rounded-full animate-spin mx-auto" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 text-muted text-sm">No orders found.</div>
        ) : (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface">
                    <th className="text-left text-xs text-muted font-semibold px-4 py-3">Student</th>
                    <th className="text-left text-xs text-muted font-semibold px-4 py-3">University</th>
                    <th className="text-left text-xs text-muted font-semibold px-4 py-3">Program</th>
                    <th className="text-left text-xs text-muted font-semibold px-4 py-3">Payment</th>
                    <th className="text-left text-xs text-muted font-semibold px-4 py-3">SOP Status</th>
                    <th className="text-left text-xs text-muted font-semibold px-4 py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      onClick={() => openOrderDetail(order.id)}
                      className="border-b border-border last:border-b-0 hover:bg-card-hover cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="font-medium text-heading">{order.name}</div>
                        <div className="text-xs text-muted">{order.email}</div>
                      </td>
                      <td className="px-4 py-3 text-body">{order.university}</td>
                      <td className="px-4 py-3 text-body">{order.program}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          order.payment_status === "paid" ? "text-accent bg-accent-dim" : "text-yellow-500 bg-yellow-500/10"
                        }`}>
                          {order.payment_status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_LABELS[order.sop_status]?.color || "text-muted"}`}>
                          {STATUS_LABELS[order.sop_status]?.label || order.sop_status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted whitespace-nowrap">
                        {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
