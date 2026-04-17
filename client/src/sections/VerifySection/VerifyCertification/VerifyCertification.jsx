import React, { useState } from "react";
import { useForm } from "react-hook-form";
import SectionHeader from "../../../components/client/SectionHeader/SectionHeader";
import { verifyCertificate } from "../../../services/forumService";
import { MEDIA_BASE_URL } from "../../../config/env";
import PDFViewer_VerifyCerificate from "../../../utils/PDFViewer_VerifyCerificate";

const VerifyCertification = ({ className = "" }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ shouldFocusError: true });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);
  const [certificatePdfUrl, setCertificatePdfUrl] = useState(null);

  const onSubmit = async (data) => {
    setMessage(null);
    setIsError(false);
    setCertificatePdfUrl(null);
    setIsLoading(true);
    try {
      const res = await verifyCertificate({
        number: data.certificateNumber?.trim(),
      });
      const msg =
        res?.msg ?? res?.message ?? "Certificate verified successfully.";
      setMessage(msg);
      setIsError(false);

      const rawPdf = res?.data?.pdf;
      if (rawPdf) {
        const base = (MEDIA_BASE_URL || "").replace(/\/+$/, "");
        const pdfFilename = String(rawPdf).replace(/^\/+/, "");

        // check if inconclusive
        const resultStr = (res?.data?.result ?? "").toString().toLowerCase();
        const folder =
          resultStr === "inconclusive" ? "pdfInconclusive" : "pdfCertificates";

        const pdfUrl = `${base}/${folder}/${pdfFilename}`;
        setCertificatePdfUrl(pdfUrl);
      } else {
        setCertificatePdfUrl(null);
      }
    } catch (err) {
      const msg =
        err?.message ??
        err?.data?.msg ??
        err?.data?.message ??
        "No data found for this certificate.";
      setMessage(msg);
      setIsError(true);
      setCertificatePdfUrl(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className={`w-full py-16 md:py-24 bg-[#F5F5F0] ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-2 md:mb-4 text-center">
          <SectionHeader
            heading="Verify Your Certificate"
            headingClassName="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-2"
            subHeading="Enter the 6-digit certificate number below"
            subHeadingClassName="!text-primary mb-3 text-sm sm:text-base md:text-lg mt-[-8px]"
            align="center"
            className="gap-0"
          />
        </div>

        {/* Form Card */}
        <div className="max-w-3xl mx-auto bg-white rounded-[38px] p-10 md:py-14 md:px-16 shadow-sm border border-[#ADADAD]">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label
                htmlFor="certificateNumber"
                className="block text-[#3C1F1B] font-bold text-base sm:text-lg mb-0 leading-tight"
              >
                Certificate Number
              </label>
              <p className="text-[#6B6B6B] text-xs md:text-sm mb-8 font-medium leading-tight">
                Example (Case Sensitive): H2EnSG
              </p>
              <input
                id="certificateNumber"
                type="text"
                placeholder="Enter Certificate Number"
                className={`w-full bg-[#F5F5F5] border border-transparent rounded-xl px-6 py-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${errors.certificateNumber ? "ring-2 ring-red-500" : ""}`}
                {...register("certificateNumber", {
                  required: "Certificate number is required",
                })}
              />
              {errors.certificateNumber && (
                <p className="text-red-500 text-xs sm:text-sm mt-2">
                  {errors.certificateNumber.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white py-3 rounded-xl font-bold text-sm sm:text-base md:text-lg hover:bg-primary/90 transition-colors shadow-lg active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? "Verifying..." : "Verify certificate"}
            </button>
          </form>
        </div>

        {/* Result message */}
        {message && (
          <div className="max-w-3xl mx-auto mt-6 text-center">
            <p
              className={`text-sm sm:text-base font-semibold ${isError ? "text-red-600" : "text-green-700"}`}
            >
              {isError ? "No Data Found" : message}
            </p>
          </div>
        )}

        {/* Certificate PDF */}
        {certificatePdfUrl && !isError && (
          <div className="max-w-3xl mx-auto mt-10 mb-4">
            <div
              className="w-full bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden"
              style={{ height: "90vh", maxHeight: "1050px" }}
            >
              <PDFViewer_VerifyCerificate pdfUrl={certificatePdfUrl} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default VerifyCertification;
