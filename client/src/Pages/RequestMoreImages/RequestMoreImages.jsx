import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { uploadImage, clearUploadedPaths } from '../../store/slices/uploadSlice';
import {
  getRequestMoreImagesDetails,
  submitRequestMoreImages,
} from '../../services/requestMoreImagesService';

const RequestMoreImages = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth?.token);

  const queryId = searchParams.get('query_id') ?? '';
  const requestId = searchParams.get('request_id') ?? '';

  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailsError, setDetailsError] = useState(null);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('idle');
  const [submitError, setSubmitError] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!queryId) {
      setDetailsError('Missing query_id in URL.');
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setDetailsError(null);
    getRequestMoreImagesDetails({ id: queryId, token })
      .then((res) => {
        if (cancelled) return;
        const data = res?.data ?? res;
        if (data && (data.query_detail != null || data.request_images_detail != null || data.query_detail_data != null)) {
          setDetails(data);
        } else {
          setDetailsError(res?.msg ?? res?.message ?? 'Failed to load request details.');
          if (Number(res?.status_code) === 201) {
            navigate('/', { replace: true });
          }
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setDetailsError(err?.message || 'Failed to load request details.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [queryId, token]);

  const queryDetail = details?.query_detail ?? details?.query_detail_data;
  const requestImagesDetail = details?.request_images_detail;
  let requestedAttributes = [];
  try {
    const raw =
      requestImagesDetail?.attributes ??
      (typeof requestImagesDetail?.attributes === 'string'
        ? requestImagesDetail?.attributes
        : null);
    if (typeof raw === 'string') {
      requestedAttributes = JSON.parse(raw) || [];
    } else if (Array.isArray(raw)) {
      requestedAttributes = raw;
    }
  } catch (_) {
    requestedAttributes = [];
  }

  const brand = queryDetail?.brand ?? queryDetail?.brand_name ?? details?.brand ?? '—';
  const model = queryDetail?.model ?? queryDetail?.model_name ?? details?.model ?? '—';

  const handleFileChange = (e) => {
    const selected = e.target.files;
    if (!selected?.length) return;
    setFiles((prev) => [...prev, ...Array.from(selected)]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!queryId || files.length === 0) {
      setSubmitError('Please add at least one image.');
      return;
    }
    setSubmitError(null);
    setSubmitStatus('loading');
    dispatch(clearUploadedPaths());

    const paths = [];
    try {
      for (const file of files) {
        const result = await dispatch(
          uploadImage({
            image: file,
            storage_type: 'authenticateImage',
          })
        ).unwrap();
        const path = result?.data;
        if (path) paths.push(path);
      }

      const response = await submitRequestMoreImages({
        uploadedImages: paths.join(','),
        queryId,
        request_id: requestId,
        token,
      });

      if (response?.status_code === 200 || response?.data?.status_code === 200) {
        setSubmitStatus('success');
        navigate('/', { replace: true });
      } else if (Number(response?.status_code) === 401 || response?.status === false) {
        setSubmitStatus('failed');
        setSubmitError(response?.msg ?? response?.message ?? 'Submit failed.');
      } else {
        setSubmitStatus('success');
        navigate('/', { replace: true });
      }
    } catch (err) {
      setSubmitStatus('failed');
      setSubmitError(err?.message || 'Upload or submit failed.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <p className="text-primary">Loading request details…</p>
      </div>
    );
  }

  if (detailsError || !queryId) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-700">{detailsError || 'Missing query_id in URL.'}</p>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-primary mb-6">Request more images</h1>

      <div className="bg-secondary rounded-lg p-6 mb-6">
        <p className="text-primary">
          <span className="font-semibold">Brand:</span> {brand}
        </p>
        <p className="text-primary mt-1">
          <span className="font-semibold">Model:</span> {model}
        </p>
        {requestedAttributes.length > 0 && (
          <div className="mt-4">
            <p className="font-semibold text-primary mb-2">Requested photos:</p>
            <ul className="list-disc list-inside text-primary">
              {requestedAttributes.map((attr, i) => (
                <li key={i}>
                  {typeof attr === 'string' ? attr : attr?.label ?? attr?.name ?? JSON.stringify(attr)}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-primary font-medium mb-2">Upload images</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="block w-full text-primary border border-gray-300 rounded-lg p-2"
          />
          {files.length > 0 && (
            <ul className="mt-2 space-y-1">
              {files.map((file, i) => (
                <li key={i} className="flex items-center gap-2 text-primary text-sm">
                  <span className="truncate flex-1">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {submitError && (
          <p className="text-red-600 text-sm">{submitError}</p>
        )}
        {submitStatus === 'success' && (
          <p className="text-green-600">Images submitted successfully. Redirecting…</p>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={uploading || submitStatus === 'loading' || files.length === 0}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 disabled:opacity-50"
          >
            {submitStatus === 'loading' ? 'Uploading & submitting…' : 'Submit images'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-4 py-2 border border-gray-300 text-primary rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export { RequestMoreImages as default };
