import React, { useState, useRef, useEffect } from "react";
import { useAppSelector } from "../../store/hooks";
import { showCoaReceipts } from "../../services/forumService";
import MaskGroupSvg from "../../assets/images/Mask group.svg";
import LogoSvg from "../../assets/images/Logo.svg";

const formatDateForApi = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const formatDisplayDate = (dateStr) => {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
};

const formatDateForPdf = (dateStr) => {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
    });
  } catch {
    return dateStr;
  }
};

const paymentLabel = (row) => {
  if (row?.payment_status === 1 && row?.is_refund === 0) return "Success";
  if (row?.payment_status === 1 && row?.is_refund === 1) return "Refunded";
  return "—";
};

const Receipts = () => {
  const { token, user: authUser } = useAppSelector((state) => state.auth ?? {});
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [receipts, setReceipts] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const receiptRef = useRef(null);

  // When receipts change, clear selection so user chooses again
  useEffect(() => {
    setSelectedRows([]);
  }, [receipts]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!startDate || !endDate) {
      setError("Please select both start and end date");
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      setError("End date must be on or after start date");
      return;
    }
    setLoading(true);
    setSearched(true);
    try {
      const res = await showCoaReceipts({
        starting_date: formatDateForApi(startDate),
        ending_date: formatDateForApi(endDate),
        token,
      });
      const data = res?.data ?? res ?? [];
      setReceipts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.message || "Failed to load receipts");
      setReceipts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows([...receipts]);
    } else {
      setSelectedRows([]);
    }
  };

  const handleRowSelect = (row) => {
    const idx = selectedRows.findIndex((r) => r.id === row.id);
    if (idx === -1) {
      setSelectedRows([...selectedRows, row]);
    } else {
      setSelectedRows(selectedRows.filter((r) => r.id !== row.id));
    }
  };

  const isSelected = (id) => selectedRows.some((r) => r.id === id);
  const allSelected =
    receipts.length > 0 && selectedRows.length === receipts.length;
  const someSelected = selectedRows.length > 0;

  const totalForPdf = selectedRows.reduce((sum, row) => {
    if (
      row?.payment_status === 1 &&
      row?.is_refund === 0 &&
      row?.amount != null
    )
      return sum + Number(row.amount);
    return sum;
  }, 0);

  const handleDownloadPdf = async () => {
    if (selectedRows.length === 0) return;
    setPdfLoading(true);
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      const element = receiptRef.current;
      if (!element) {
        setPdfLoading(false);
        return;
      }
      const filename = `Receipt-${formatDateForPdf(new Date()).replace(/\//g, "-")}.pdf`;
      const opt = {
        margin: [10, 10, 10, 10],
        filename,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ["avoid-all", "css", "legacy"] },
      };
      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F5F5F0] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-6">
          COA Receipts
        </h1>
        <p className="text-primary/80 mb-6">
          View your certificates of authenticity receipts by date range.
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow p-6 mb-8"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent text-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent text-primary"
              />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-3 bg-primary text-secondary font-semibold rounded-xl hover:opacity-90 disabled:opacity-70"
          >
            {loading ? "Loading…" : "Search"}
          </button>
        </form>

        {searched && !loading && receipts.length > 0 && (
          <div className="bg-white rounded-2xl shadow overflow-hidden mb-6">
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-gray-200">
              <span className="text-sm font-semibold text-primary">
                {selectedRows.length} of {receipts.length} selected
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-200">
                    <th className="px-2 py-2 sm:px-4 sm:py-3 w-8 sm:w-12">
                      <label className="flex items-center gap-1 sm:gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={allSelected}
                          onChange={handleSelectAll}
                          className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded border-gray-300 text-primary focus:ring-primary flex-shrink-0"
                        />
                        <span className="text-xs sm:text-sm font-semibold text-primary whitespace-nowrap">
                          Select all
                        </span>
                      </label>
                    </th>
                    <th className="px-2 py-2 sm:px-4 sm:py-3 font-semibold text-primary text-xs sm:text-sm">
                      Order Number
                    </th>
                    <th className="px-2 py-2 sm:px-4 sm:py-3 font-semibold text-primary text-xs sm:text-sm">
                      Brand
                    </th>
                    <th className="px-2 py-2 sm:px-4 sm:py-3 font-semibold text-primary text-xs sm:text-sm w-16 sm:w-auto">
                      Date
                    </th>
                    <th className="px-2 py-2 sm:px-4 sm:py-3 font-semibold text-primary text-xs sm:text-sm">
                      Price
                    </th>
                    <th className="px-2 py-2 sm:px-4 sm:py-3 font-semibold text-primary text-xs sm:text-sm">
                      Payment
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {receipts.map((row) => (
                    <tr
                      key={row.id}
                      className={`border-b border-gray-100 hover:bg-gray-50 ${isSelected(row.id) ? "bg-primary/5" : ""}`}
                    >
                      <td className="px-2 py-2 sm:px-4 sm:py-3">
                        <input
                          type="checkbox"
                          checked={isSelected(row.id)}
                          onChange={() => handleRowSelect(row)}
                          className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded border-gray-300 text-primary focus:ring-primary flex-shrink-0"
                        />
                      </td>
                      <td className="px-2 py-2 sm:px-4 sm:py-3 text-primary text-xs sm:text-sm truncate">
                        {row?.order_number ?? "—"}
                      </td>
                      <td
                        className="px-2 py-2 sm:px-4 sm:py-3 text-primary text-xs sm:text-sm min-w-0 truncate"
                        title={row?.brand ?? ""}
                      >
                        {row?.brand ?? "—"}
                      </td>
                      <td className="px-2 py-2 sm:px-4 sm:py-3 text-primary text-xs sm:text-sm whitespace-nowrap">
                        {formatDateForPdf(row?.created_at)}
                      </td>
                      <td className="px-2 py-2 sm:px-4 sm:py-3 text-primary text-xs sm:text-sm whitespace-nowrap">
                        {row?.amount != null ? `$${row.amount}` : "—"}
                      </td>
                      <td className="px-2 py-2 sm:px-4 sm:py-3 text-primary text-xs sm:text-sm">
                        {paymentLabel(row)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {searched && !loading && receipts.length === 0 && (
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            <p className="p-8 text-center text-primary/70">
              No receipts found for this date range.
            </p>
          </div>
        )}

        {/* Receipt preview: layout matches old web (logo, client, AUTHENTIC DETECTIVE one line, RECEIPTS + date, table, total); font colors = current UI */}
        {selectedRows.length > 0 && (
          <div className="bg-white rounded-2xl shadow overflow-hidden mt-8">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex flex-col gap-3 sm:gap-0 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-1">
                <h2 className="text-base sm:text-lg font-bold text-primary">
                  Receipt preview
                </h2>
                <span className="text-xs sm:text-sm text-primary/70">
                  This preview is exactly what will appear in your PDF.
                </span>
              </div>
              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={pdfLoading}
                className="w-full sm:w-auto flex-shrink-0 px-4 py-2.5 sm:px-5 sm:py-3 text-sm sm:text-base font-semibold bg-primary text-secondary rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {pdfLoading ? "Generating PDF…" : "Generate PDF"}
              </button>
            </div>
            <div
              ref={receiptRef}
              className="p-4 sm:p-6 md:p-8 text-primary w-full min-w-0 box-border text-sm sm:text-base"
              style={{
                maxWidth: "100%",
                margin: "0 auto",
                backgroundColor: "#fff",
                fontFamily:
                  'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                fontSize: "clamp(13px, 2.5vw, 15px)",
              }}
            >
              {/* Desktop: Left = client; Center = AUTHENTIC DETECTIVE; Right = RECEIPTS + date. Mobile: Logo on top, then client, then RECEIPTS + date. */}
              <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-start justify-between gap-4 sm:gap-6 mb-4 sm:mb-6 pb-4 border-b border-gray-200">
                {/* LEFT on desktop; second on mobile (after logo) */}
                <div className="flex flex-col items-start min-w-0 flex-shrink-0 order-2 sm:order-none">
                  <img
                    src={MaskGroupSvg}
                    alt=""
                    className="object-contain mb-1.5 sm:mb-2 flex-shrink-0 w-11 h-14 sm:w-11 sm:h-14 md:w-12 md:h-[60px]"
                  />
                  <span className="text-sm text-primary/70">Client Name</span>
                  <span className="font-bold text-primary text-sm sm:text-base mt-0.5 break-words max-w-full sm:max-w-none">
                    {authUser?.name ?? "—"}
                  </span>
                  <span className="text-sm text-primary/70 mt-0.5 break-words max-w-full sm:max-w-none">
                    {authUser?.email ?? "—"}
                  </span>
                </div>
                {/* CENTER on desktop; first (top) on mobile */}
                <div className="flex justify-center items-center min-w-0 px-0 sm:px-4 order-1 sm:order-none sm:flex-1">
                  <img
                    src={LogoSvg}
                    alt="AUTHENTIC DETECTIVE"
                    className="object-contain object-center flex-shrink-0 w-auto max-w-full h-12 sm:h-12 md:h-14 lg:h-16"
                  />
                </div>
                {/* RIGHT on desktop; third on mobile */}
                <div className="flex flex-col items-start sm:items-end text-left sm:text-right min-w-0 flex-shrink-0 order-3 sm:order-none">
                  <p className="text-lg sm:text-xl font-bold text-primary m-0">
                    RECEIPTS
                  </p>
                  <p className="text-sm text-primary/90 mt-1 m-0">
                    Date: {formatDateForPdf(startDate)} -{" "}
                    {formatDateForPdf(endDate)}
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <table className="w-full min-w-[280px] text-left border-collapse text-inherit">
                  <thead>
                    <tr className="bg-gray-100 border-b-2 border-gray-300">
                      <th className="p-2.5 sm:p-3 font-semibold text-primary text-sm sm:text-base">
                        Order Number
                      </th>
                      <th className="p-2.5 sm:p-3 font-semibold text-primary text-sm sm:text-base">
                        Brand
                      </th>
                      <th className="p-2.5 sm:p-3 font-semibold text-primary text-sm sm:text-base">
                        Date
                      </th>
                      <th className="p-2.5 sm:p-3 font-semibold text-primary text-sm sm:text-base">
                        Price
                      </th>
                      <th className="p-2.5 sm:p-3 font-semibold text-primary text-sm sm:text-base">
                        Payment
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedRows.map((row, i) => (
                      <tr
                        key={row.id}
                        className={i % 2 ? "bg-gray-50" : "bg-white"}
                        style={{ borderBottom: "1px solid #eee" }}
                      >
                        <td className="p-2.5 sm:p-3 text-primary whitespace-nowrap text-inherit text-sm sm:text-base">
                          {row?.order_number ?? "—"}
                        </td>
                        <td className="p-2.5 sm:p-3 text-primary whitespace-nowrap text-inherit text-sm sm:text-base">
                          {row?.brand ?? "—"}
                        </td>
                        <td className="p-2.5 sm:p-3 text-primary whitespace-nowrap text-inherit text-sm sm:text-base">
                          {formatDisplayDate(row?.created_at)}
                        </td>
                        <td className="p-2.5 sm:p-3 text-primary whitespace-nowrap text-inherit text-sm sm:text-base">
                          {row?.amount != null
                            ? `$${Number(row.amount).toFixed(2)}`
                            : "—"}
                        </td>
                        <td className="p-2.5 sm:p-3 text-primary whitespace-nowrap text-inherit text-sm sm:text-base">
                          {paymentLabel(row)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total in primary box */}
              <div
                style={{
                  marginTop: "16px",
                  display: "flex",
                  width: "100%",
                  justifyContent: "flex-end",
                }}
              >
                <div
                  style={{
                    backgroundColor: "#3D1A10",
                    color: "#ffffff",
                    padding: "0 24px",
                    minWidth: "180px",
                    fontWeight: "700",
                    fontSize: "15px",
                    height: "48px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    whiteSpace: "nowrap",
                    boxSizing: "border-box",
                    fontFamily: "system-ui, -apple-system, sans-serif",
                    lineHeight: "normal",
                  }}
                >
                  <p
                    style={{
                      transform: "translateY(-10%)",
                    }}
                  >{`Total: $${totalForPdf.toFixed(2)}`}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Receipts;
