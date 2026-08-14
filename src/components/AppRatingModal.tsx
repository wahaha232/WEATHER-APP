import React, { useState, useEffect } from 'react';
import { Star, Heart, ThumbsUp, X, Sparkles, MessageSquare, Check, ShieldCheck, Zap } from 'lucide-react';

interface AppRatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRated?: (rating: number, feedback?: string) => void;
  lang?: 'zh' | 'en';
}

export const AppRatingModal: React.FC<AppRatingModalProps> = ({
  isOpen,
  onClose,
  onRated,
  lang = 'zh',
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState<boolean>(false);

  // Suggestions tags based on language
  const zhTags = [
    '🌤️ 天氣預報極度精準',
    '⚡ 介面滑順流暢',
    '🎨 3D 動態圖示好看',
    '📱 桌面小工具超實用',
    '🌍 雙時區與時間精確',
    '🔋 省電無擾體驗',
  ];

  const enTags = [
    '🌤️ Highly Accurate Forecast',
    '⚡ Ultra Smooth UI',
    '🎨 Gorgeous 3D Visuals',
    '📱 Great Home Widgets',
    '🌍 Precise Dual Clock & DST',
    '🔋 Lightweight & Fast',
  ];

  const tags = lang === 'zh' ? zhTags : enTags;

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (ratingValue: number = rating) => {
    setSubmitted(true);
    if (onRated) {
      const fullFeedback = [
        ...selectedTags,
        feedback ? feedback.trim() : '',
      ]
        .filter(Boolean)
        .join(' | ');
      onRated(ratingValue, fullFeedback);
    }
    // Automatically close after a short friendly confirmation
    setTimeout(() => {
      onClose();
      setSubmitted(false);
    }, 1800);
  };

  const handleRemindLater = () => {
    // Save timestamp for remind later
    localStorage.setItem('precision_weather_rating_prompt_dismissed', Date.now().toString());
    onClose();
  };

  const handleNeverAsk = () => {
    localStorage.setItem('precision_weather_rated', 'true');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      id="app-rating-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        id="app-rating-modal-container"
        className="w-full max-w-md bg-gradient-to-b from-slate-900 via-zinc-900 to-black border border-white/20 rounded-[32px] p-6 shadow-2xl text-white relative overflow-hidden flex flex-col items-center text-center animate-in zoom-in-95 duration-200"
      >
        {/* Subtle Decorative Ambient Glow */}
        <div className="absolute -top-16 -right-16 w-36 h-36 rounded-full bg-amber-500/20 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 rounded-full bg-sky-500/20 blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          id="btn-close-rating-modal"
          onClick={handleRemindLater}
          className="absolute top-4 right-4 p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          /* ========================================================================= */
          /* SUBMITTED THANK YOU VIEW */
          /* ========================================================================= */
          <div className="py-8 flex flex-col items-center animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center mb-4 shadow-lg">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-1.5">
              {lang === 'zh' ? '感謝您的熱情支持！' : 'Thank You For Your Support!'}
            </h3>
            <p className="text-sm text-white/70 max-w-xs">
              {lang === 'zh'
                ? '您的寶貴評分與回饋是我們持續打造極致天氣體驗的最大動力。'
                : 'Your valuable rating helps us keep innovating and perfecting the weather experience.'}
            </p>
          </div>
        ) : (
          /* ========================================================================= */
          /* RATING FORM VIEW */
          /* ========================================================================= */
          <>
            {/* App Icon / Floating Badge */}
            <div className="relative mb-3.5 mt-1">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-600 via-indigo-600 to-amber-500 p-0.5 shadow-xl flex items-center justify-center">
                <div className="w-full h-full bg-zinc-950 rounded-[14px] flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-amber-400 animate-pulse" />
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 bg-amber-500 text-zinc-950 text-[10px] font-black px-1.5 py-0.5 rounded-full shadow">
                5.0★
              </div>
            </div>

            {/* Title & Subtitle */}
            <h3 className="text-xl font-bold text-white tracking-tight mb-1">
              {lang === 'zh' ? '喜歡這款天氣 APP 嗎？' : 'Enjoying Precision Weather?'}
            </h3>
            <p className="text-xs text-white/70 max-w-xs leading-relaxed mb-4">
              {lang === 'zh'
                ? '我們致力於為您提供即時高精度預報、美觀小工具與貼心多時區服務。給予 5 星好評，讓我們做得更好！'
                : 'We are committed to delivering hyper-local precision, widgets & dual-clock time. Drop us a 5-star review!'}
            </p>

            {/* Interactive Star Rating Bar */}
            <div
              id="rating-stars-container"
              className="flex items-center justify-center gap-2.5 my-2 p-2 rounded-2xl bg-white/5 border border-white/10 w-full max-w-xs"
            >
              {[1, 2, 3, 4, 5].map((starValue) => {
                const active = hoverRating ? starValue <= hoverRating : starValue <= rating;
                return (
                  <button
                    key={starValue}
                    id={`btn-star-rating-${starValue}`}
                    type="button"
                    onMouseEnter={() => setHoverRating(starValue)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => {
                      setRating(starValue);
                    }}
                    className="p-1.5 transition-transform hover:scale-125 active:scale-90 cursor-pointer"
                  >
                    <Star
                      className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                        active
                          ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                          : 'fill-transparent text-white/30 hover:text-white/60'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Dynamic Rating Feedback Text */}
            <div className="text-xs font-semibold text-amber-300 mt-1 mb-3">
              {rating === 5 && (lang === 'zh' ? '⭐⭐⭐⭐⭐ 非常滿意！極致體驗' : '⭐⭐⭐⭐⭐ Excellent! Outstanding app')}
              {rating === 4 && (lang === 'zh' ? '⭐⭐⭐⭐ 很滿意！值得推薦' : '⭐⭐⭐⭐ Good! Highly recommended')}
              {rating === 3 && (lang === 'zh' ? '⭐⭐⭐ 普通，希望持續進步' : '⭐⭐⭐ Average, needs improvement')}
              {rating <= 2 && (lang === 'zh' ? '需要改進，請告訴我們您的建議' : 'Needs work, please share feedback')}
            </div>

            {/* Quick Feedback Tags */}
            <div className="w-full mb-3">
              <div className="text-[11px] text-white/60 mb-1.5 text-left font-medium">
                {lang === 'zh' ? '您最喜歡哪項特點？（可多選）' : 'What do you like most?'}
              </div>
              <div className="flex flex-wrap gap-1.5 justify-start">
                {tags.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`text-[11px] px-2.5 py-1 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-sky-500 text-white border-sky-400 font-semibold shadow-sm'
                          : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Optional Feedback Input */}
            <div className="w-full mb-4 text-left">
              <div className="relative">
                <input
                  type="text"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder={
                    lang === 'zh'
                      ? '有其他建議嗎？（選填，例如：希望新增桌面主題）'
                      : 'Any additional thoughts or suggestions? (Optional)'
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-sky-400 transition-colors"
                />
              </div>
            </div>

            {/* Primary Action Button: Submit Rating */}
            <button
              id="btn-submit-rating"
              onClick={() => handleSubmit(rating)}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 active:scale-98 text-zinc-950 font-bold text-sm shadow-[0_4px_16px_rgba(245,158,11,0.35)] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <ThumbsUp className="w-4 h-4 fill-zinc-950" />
              <span>
                {lang === 'zh'
                  ? `送出 ${rating} 星評分與回饋`
                  : `Submit ${rating}-Star Rating`}
              </span>
            </button>

            {/* Secondary Option: Remind Later / No Thanks */}
            <div className="flex items-center justify-between w-full mt-3 px-2 text-[11px] text-white/50">
              <button
                id="btn-rating-remind-later"
                onClick={handleRemindLater}
                className="hover:text-white/80 transition-colors cursor-pointer"
              >
                {lang === 'zh' ? '稍後提醒我' : 'Remind me later'}
              </button>
              <button
                id="btn-rating-never"
                onClick={handleNeverAsk}
                className="hover:text-white/80 transition-colors cursor-pointer"
              >
                {lang === 'zh' ? '不再提示' : 'Don\'t ask again'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
