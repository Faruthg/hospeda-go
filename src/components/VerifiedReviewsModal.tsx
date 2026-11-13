import React, { useState } from 'react';
import { 
  X, 
  Star, 
  ShieldCheck, 
  Check, 
  Sparkles, 
  MessageSquare,
  ThumbsUp,
  Award
} from 'lucide-react';
import { Property, Review } from '../types';
import { soundManager } from '../utils/audio';

interface VerifiedReviewsModalProps {
  property: Property | null;
  onClose: () => void;
  onAddReview: (propertyId: string, review: Review) => void;
}

export const VerifiedReviewsModal: React.FC<VerifiedReviewsModalProps> = ({
  property,
  onClose,
  onAddReview
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [authorName, setAuthorName] = useState('Tú (Huésped Verificado)');
  const [overallRating, setOverallRating] = useState(5);
  const [commentText, setCommentText] = useState('');
  const [cleanliness, setCleanliness] = useState(5);
  const [accuracy, setAccuracy] = useState(5);
  const [communication, setCommunication] = useState(5);
  const [locationScore, setLocationScore] = useState(5);
  const [valueScore, setValueScore] = useState(5);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  if (!property) return null;

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    soundManager.playCashRegister();
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      author: authorName,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
      date: 'Noviembre 2026',
      rating: overallRating,
      comment: commentText.trim(),
      verifiedStay: true,
      roomBooked: 'Estancia Verificada (Reserva Reciente)',
      categories: {
        cleanliness,
        accuracy,
        communication,
        location: locationScore,
        value: valueScore
      }
    };

    onAddReview(property.id, newRev);
    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setShowAddForm(false);
      setCommentText('');
    }, 1600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div 
        className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {property.rating} · Reseñas Verificadas ({property.reviews.length})
              </h2>
            </div>
            <p className="text-xs text-slate-500 truncate max-w-md mt-0.5">
              {property.title}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!showAddForm && (
              <button
                onClick={() => setShowAddForm(true)}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Escribir Reseña
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Verified Criteria Score Bars */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Desglose de Calidad Verificado por Huéspedes
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-xs">
              {[
                { label: 'Limpieza e Higiene', score: 4.9 },
                { label: 'Veracidad del Anuncio', score: 4.9 },
                { label: 'Comunicación del Anfitrión', score: 5.0 },
                { label: 'Ubicación & Barrio', score: 4.8 },
                { label: 'Relación Calidad-Precio', score: 4.8 }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between gap-3">
                  <span className="text-slate-600 dark:text-slate-400 font-medium truncate">{item.label}</span>
                  <div className="flex items-center gap-2 w-32 shrink-0">
                    <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-slate-900 dark:bg-emerald-500 rounded-full" 
                        style={{ width: `${(item.score / 5) * 100}%` }}
                      />
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white tabular-nums">{item.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form to submit review */}
          {showAddForm && (
            <form onSubmit={handleSubmitReview} className="p-5 rounded-2xl border-2 border-emerald-500/40 bg-emerald-50/20 dark:bg-emerald-950/20 space-y-4 animate-in slide-in-from-top-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                  Dejar Reseña de Estancia Verificada
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  Cancelar
                </button>
              </div>

              {submitSuccess ? (
                <div className="p-3 bg-emerald-100 dark:bg-emerald-900/60 rounded-xl text-xs font-bold text-emerald-800 dark:text-emerald-200 text-center">
                  ¡Reseña publicada con insignia de Huésped Verificado!
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Puntuación General:</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setOverallRating(star)}
                          className="p-1 focus:outline-none"
                        >
                          <Star 
                            className={`w-5 h-5 ${
                              star <= overallRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-600'
                            }`} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Comentario sobre tu experiencia
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Comparte detalles sobre la comodidad, el trato del anfitrión y los aspectos destacados del alojamiento..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    Publicar Valoración Verificada
                  </button>
                </>
              )}
            </form>
          )}

          {/* Reviews List */}
          <div className="space-y-4">
            {property.reviews.map(rev => (
              <div 
                key={rev.id} 
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img 
                      src={rev.avatar} 
                      alt={rev.author}
                      className="w-10 h-10 rounded-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        {rev.author}
                        {rev.verifiedStay && (
                          <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                            <ShieldCheck className="w-3 h-3" />
                            Huésped verificado
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-slate-400">
                        {rev.date} · {rev.roomBooked}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-bold text-slate-900 dark:text-white tabular-nums">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{rev.rating.toFixed(1)}</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  "{rev.comment}"
                </p>

                {rev.hostResponse && (
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border-l-2 border-emerald-500 text-xs space-y-1">
                    <span className="font-bold text-slate-900 dark:text-white">Respuesta del anfitrión:</span>
                    <p className="text-slate-600 dark:text-slate-300">{rev.hostResponse.text}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};
