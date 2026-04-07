import React, { useState, useRef, useEffect } from 'react';
import { FiX, FiPlus } from 'react-icons/fi';
import PropTypes from 'prop-types';

// Each item: { path, preview } — path for submit, preview (object URL) for thumbnail
const RequestMoreImagesModal = ({
  open,
  onClose,
  certificate,
  onSubmit,
  isAdminRequested = false,
  onUploadImages,
  uploading = false,
}) => {
  const [items, setItems] = useState([]); // { path, preview }[]
  const [imageError, setImageError] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);

  const [uploadingLocal, setUploadingLocal] = useState(false);
  const isUploading = uploading || uploadingLocal;
  const itemsRef = useRef([]);
  itemsRef.current = items;

  const revokePreviews = (list) => {
    (list || []).forEach((it) => {
      if (it.preview && typeof it.preview === 'string' && it.preview.startsWith('blob:')) {
        try {
          URL.revokeObjectURL(it.preview);
        } catch (_) {}
      }
    });
  };

  useEffect(() => {
    return () => revokePreviews(itemsRef.current);
  }, []);

  const handleImageChange = async (e) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length === 0) {
      e.target.value = '';
      return;
    }
    setImageError(false);
    setUploadError(null);
    if (!onUploadImages) {
      setUploadError('Upload is not available.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    setUploadingLocal(true);
    try {
      const newPaths = await onUploadImages(files);
      if (!newPaths || newPaths.length === 0) {
        setUploadError('Upload failed or returned no images. Please try again.');
        return;
      }
      // Pair each path with a local preview so thumbnails show immediately (like old website)
      const newItems = newPaths.map((path, i) => ({
        path,
        preview: i < files.length ? URL.createObjectURL(files[i]) : null,
      }));
      setItems((prev) => [...newItems, ...prev]);
    } catch (err) {
      setUploadError(err?.message || 'Upload failed. Please try again.');
    } finally {
      setUploadingLocal(false);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemove = (index) => {
    const removed = items[index];
    revokePreviews(removed ? [removed] : []);
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (items.length === 0) {
      setImageError(true);
      return;
    }
    setImageError(false);
    setSubmitError(null);
    if (!onSubmit || !certificate) return;
    try {
      const pathStr = items.map((it) => (typeof it === 'string' ? it : it.path)).filter(Boolean).join(',');
      await Promise.resolve(onSubmit(certificate, pathStr));
      setItems([]);
      onClose();
    } catch (err) {
      setSubmitError(err?.message || 'Failed to submit images');
    }
  };

  const handleClose = () => {
    revokePreviews(items);
    setItems([]);
    setImageError(false);
    setSubmitError(null);
    setUploadError(null);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" role="dialog" aria-modal="true">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-primary">
            {isAdminRequested
              ? "Submit Requested Images"
              : "Add additional images"}
          </h3>
          <button type="button" onClick={handleClose} className="icon-button p-1 text-primary hover:bg-gray-100 rounded">
            <FiX className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto flex-1">
          <p className="text-sm text-primary mb-3 font-bold">
            Requested Photos:
          </p>
          {certificate?.request_more_images?.map((c, index) => {
            const attributes = JSON.parse(c.attributes || "[]");

            return (
              <div key={index} className="mb-2 p-3 border-l-4">
                <p className="text-sm text-black">
                  <span className="font-bold">{attributes.join(", ")}</span>
                  {c.note ? <span> ({c.note})</span> : null}
                </p>
              </div>
            );
          })}
          <div className="flex flex-wrap gap-3 mb-3">
            <div
              role="button"
              tabIndex={0}
              onClick={() => !isUploading && fileInputRef.current?.click()}
              onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
              className="w-24 h-24 flex-shrink-0 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-primary hover:bg-gray-50 disabled:opacity-50"
            >
              {isUploading ? (
                <span className="text-xs text-gray-500">Uploading…</span>
              ) : (
                <FiPlus className="w-8 h-8 text-gray-400" />
              )}
            </div>
            {items.map((it, i) => (
              <div key={i} className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                {it.preview ? (
                  <img src={it.preview} alt={`Upload ${i + 1}`} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">Image {i + 1}</div>
                )}
                <button
                  type="button"
                  onClick={() => handleRemove(i)}
                  className="icon-button absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-gray-800/80 text-white flex items-center justify-center hover:bg-gray-800"
                  aria-label="Remove image"
                >
                  <FiX className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="hidden"
          />
          {imageError && (
            <p className="text-red-600 text-sm mb-2">Please select at least one image.</p>
          )}
          {uploadError && (
            <p className="text-red-600 text-sm mb-2">{uploadError}</p>
          )}
          {submitError && (
            <p className="text-red-600 text-sm mb-2">{submitError}</p>
          )}
        </div>
        <div className="flex gap-3 p-4 border-t border-gray-200">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 py-2 px-4 border border-gray-300 text-primary rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={items.length === 0 || isUploading}
            className="flex-1 py-2 px-4 bg-primary text-white rounded-lg hover:opacity-90 disabled:opacity-50"
          >
            {isUploading ? 'Uploading…' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
};

RequestMoreImagesModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  certificate: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  isAdminRequested: PropTypes.bool,
  onUploadImages: PropTypes.func,
  uploading: PropTypes.bool,
};

export default RequestMoreImagesModal;
