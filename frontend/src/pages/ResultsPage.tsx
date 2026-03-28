import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Hospital {
  id: number;
  name: string;
  address: string;
  type: string;
  inNetwork: boolean;
  distance: string;
  distanceMiles: number;
  rating: number;
  estimatedWaitTime: string;
  phone: string;
  website: string;
  matchReason: string;
  matchScore: number;
}

interface MatchResponse {
  sessionId: number;
  diagnosis: string;
  urgencyLevel: string;
  hospitals: Hospital[];
}

export default function ResultsPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<MatchResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHospitals = async () => {
      const sessionId = sessionStorage.getItem('sessionId');
      if (!sessionId) {
        setError('No session found. Please go back to the intake form.');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/hospitals/match?sessionId=${sessionId}`);
        if (!res.ok) {
          throw new Error('Failed to fetch matched hospitals.');
        }
        const responseData = await res.json();
        setData(responseData);
      } catch (err: any) {
        setError(err.message || 'An error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchHospitals();
  }, []);

  if (loading) {
    return (
      <main className="max-w-5xl mx-auto px-6 pt-12 pb-24 text-center">
        <h2 className="text-2xl font-bold">Finding best matches...</h2>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="max-w-5xl mx-auto px-6 pt-12 pb-24 text-center">
        <h2 className="text-2xl font-bold text-error mb-4">Error</h2>
        <p className="mb-6">{error}</p>
        <button onClick={() => navigate('/intake')} className="px-6 py-3 rounded-xl bg-primary text-white font-bold">Start Over</button>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-6 pt-12 pb-24">
      {/* ─── Progress Stepper ─── */}
      <div className="mb-12">
        <div className="flex justify-between items-end mb-3">
          <span className="font-headline font-bold text-primary text-sm uppercase tracking-widest">Step 4 of 4</span>
          <span className="font-body text-on-surface-variant text-sm">Hospital Matches</span>
        </div>
        <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden flex gap-1">
          <div className="h-full w-1/4 bg-primary-container opacity-40 rounded-full" />
          <div className="h-full w-1/4 bg-primary-container opacity-40 rounded-full" />
          <div className="h-full w-1/4 bg-primary-container opacity-40 rounded-full" />
          <div className="h-full w-1/4 bg-gradient-to-r from-primary to-primary-container rounded-full" />
        </div>
      </div>

      {/* ─── Header ─── */}
      <section className="mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface mb-4">
          Matched Hospitals
        </h1>
        <p className="text-lg text-on-surface-variant max-w-2xl leading-relaxed">
          Based on your symptoms, urgency level, location, and insurance coverage, we've identified the best nearby
          facilities for your care.
        </p>
      </section>

      {/* ─── Summary Card ─── */}
      <div className="bg-primary-fixed/30 rounded-3xl p-8 mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary-container flex items-center justify-center text-white">
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              local_hospital
            </span>
          </div>
          <div>
            <p className="text-sm text-on-primary-fixed-variant font-semibold">Your Assessment</p>
            <p className="text-lg font-bold text-on-surface">
              {data.diagnosis} • <span className="text-amber-700">{data.urgencyLevel}</span>
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/analysis')}
          className="text-sm font-bold text-primary flex items-center gap-1 hover:underline"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Review Analysis
        </button>
      </div>

      {/* ─── Hospital Cards ─── */}
      <div className="space-y-6">
        {data.hospitals && data.hospitals.length > 0 ? data.hospitals.map((hospital, idx) => (
          <div
            key={hospital.id || idx}
            className="bg-surface-container-lowest rounded-3xl p-8 shadow-[0_8px_32px_rgba(25,28,29,0.04)] border border-outline-variant/10 hover:shadow-md transition-shadow group"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-xl font-bold text-on-surface">{hospital.name}</h3>
                  {hospital.inNetwork && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant text-xs font-bold">
                      <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>
                        verified
                      </span>
                      In-Network
                    </span>
                  )}
                  {!hospital.inNetwork && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant text-xs font-bold">
                      Out-of-Network
                    </span>
                  )}
                  {hospital.matchReason && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-xs font-bold">
                      {hospital.matchReason}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-6 text-sm text-on-surface-variant">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">location_on</span>
                    {hospital.address} ({hospital.distance || `${hospital.distanceMiles} mi`})
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">local_hospital</span>
                    {hospital.type}
                  </span>
                  {hospital.estimatedWaitTime && (
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">schedule</span>
                      Est. wait: {hospital.estimatedWaitTime}
                    </span>
                  )}
                  {hospital.rating && (
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                        star
                      </span>
                      {hospital.rating}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                {hospital.website && (
                  <a
                    href={hospital.website}
                    target="_blank"
                    rel="noreferrer"
                    className="px-6 py-3 rounded-xl border border-outline-variant text-on-surface font-semibold hover:bg-surface-container transition-colors text-sm"
                  >
                    Website
                  </a>
                )}
                {hospital.phone && (
                  <a 
                    href={`tel:${hospital.phone}`}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-container text-white font-bold shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all text-sm"
                  >
                    Call {hospital.phone}
                  </a>
                )}
              </div>
            </div>
          </div>
        )) : (
          <div className="text-center p-8 bg-surface-container-low rounded-3xl">
            <p>No matching hospitals found.</p>
          </div>
        )}
      </div>

      {/* ─── Bottom Actions ─── */}
      <div className="mt-12 p-8 bg-surface-container-high/50 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h4 className="font-bold text-on-surface mb-1">Not finding what you need?</h4>
          <p className="text-sm text-on-surface-variant">
            Expand your search radius or update your insurance information.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/intake')}
            className="px-6 py-3 rounded-xl border border-outline-variant text-on-surface font-semibold hover:bg-surface-container transition-colors text-sm"
          >
            Update Info
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 rounded-xl bg-primary text-white font-bold shadow-md hover:shadow-lg transition-all text-sm"
          >
            Start Over
          </button>
        </div>
      </div>
    </main>
  );
}
