import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import { getValuationsList } from '../../services/forumService';

const MyValuations = () => {
  const token = useAppSelector((state) => state.auth?.token);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setError('Please log in to view your valuations.');
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    getValuationsList({ token })
      .then((res) => {
        if (cancelled) return;
        const data = res?.data ?? res;
        const items = Array.isArray(data) ? data : (data?.valuations ?? data?.list ?? []);
        setList(Array.isArray(items) ? items : []);
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message || 'Failed to load valuations.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [token]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-primary">My valuations</h1>
        <Link to="/valuation" className="text-primary hover:underline text-sm">
          Request a valuation
        </Link>
      </div>

      {loading && (
        <p className="text-primary">Loading valuations…</p>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && list.length === 0 && (
        <div className="bg-secondary rounded-lg p-6 text-center text-primary">
          <p>You have no valuations yet.</p>
          <Link to="/valuation" className="inline-block mt-3 text-primary font-medium hover:underline">
            Request a valuation
          </Link>
        </div>
      )}

      {!loading && !error && list.length > 0 && (
        <div className="space-y-4">
          {list.map((item, index) => (
            <div
              key={item.id ?? item.valuation_id ?? index}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
            >
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-primary">
                {item.order_number && <span><strong>Order:</strong> {item.order_number}</span>}
                {item.coa_number && <span><strong>COA #:</strong> {item.coa_number}</span>}
                {item.status != null && <span><strong>Status:</strong> {String(item.status)}</span>}
                {item.created_at && <span><strong>Date:</strong> {item.created_at}</span>}
                {item.amount != null && <span><strong>Amount:</strong> {item.amount}</span>}
              </div>
              {item.brand && <p className="mt-2 text-primary text-sm">Brand: {item.brand}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyValuations;
