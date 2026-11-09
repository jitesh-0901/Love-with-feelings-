import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2, Heart, CheckCircle2 } from 'lucide-react';
import { logAnalyticsEvent, updateSessionSummary } from '../utils/analyticsTracker';

interface InteractiveQuestionsProps {
  forgivenessAnswer: 'YES, I FORGIVE YOU' | 'NO' | 'I NEED MORE TIME' | null;
  onNext: () => void;
  isReducedMotion: boolean;
}

export interface QuestionItem {
  id: string;
  num: number;
  qKey: 'q1' | 'q2' | 'q3' | 'q4' | 'q5' | 'q6' | 'q7' | 'q8' | 'q9' | 'q10' | 'q11' | 'q12' | 'q13';
  question: string;
  options: string[];
}

export const OVI_QUESTIONS: QuestionItem[] = [
  {
    id: 'q1',
    num: 1,
    qKey: 'q1',
    question: '1. Enna nejama love panriya enna nala pathupiya ?',
    options: ['Yes', 'No'],
  },
  {
    id: 'q2',
    num: 2,
    qKey: 'q2',
    question: '2. Enna nee manipiya ?',
    options: ['Yes', 'No'],
  },
  {
    id: 'q3',
    num: 3,
    qKey: 'q3',
    question: '3. Na un kuda valanum nu aasa padra nee aasa padriya ?',
    options: ['Yes', 'No'],
  },
  {
    id: 'q4',
    num: 4,
    qKey: 'q4',
    question: '4. College vantha en kuda pasuviya ?',
    options: ['Yes', 'No'],
  },
  {
    id: 'q5',
    num: 5,
    qKey: 'q5',
    question: '5. Namma nala oru life valanum aasa padra nee enkuda irupiya ?',
    options: ['Mudiyum', 'Mudiyathu'],
  },
  {
    id: 'q6',
    num: 6,
    qKey: 'q6',
    question: '6. Unakaga na iruka , Enaku nee irupiya ?',
    options: ['Irupen', 'Maten'],
  },
  {
    id: 'q7',
    num: 7,
    qKey: 'q7',
    question: '7. Yaru enna sonalum paravala na unna pathu kura nee enna pathuko nammaku yarum vena maa ?',
    options: ['Ok', 'Illa'],
  },
  {
    id: 'q8',
    num: 8,
    qKey: 'q8',
    question: '8. Namma college open aana thum ona padikalam namma nammala pathukalam maa ?',
    options: ['Ok va', 'Illa'],
  },
  {
    id: 'q9',
    num: 9,
    qKey: 'q9',
    question: '9. Na jaikanum na nee en kuda irukanum , ennoda confident aa nee tha ma , nee illa ma na thavikura ma enna vitu poira matala maileyy ?',
    options: ['Irupa', 'Mata'],
  },
  {
    id: 'q10',
    num: 10,
    qKey: 'q10',
    question: '10. Namma happy aa life vala enaku aasa , athuku nee venu ?',
    options: ['Na iruka', 'Na illa'],
  },
  {
    id: 'q11',
    num: 11,
    qKey: 'q11',
    question: '11. Nee poita na enna pana nu thariyama iruka ma enna la mudiyala sami , namma la nammala heal panikalam namma ona irunthala ella seri aagirum amma ?',
    options: ['Irupa', 'Iruka mata'],
  },
  {
    id: 'q12',
    num: 12,
    qKey: 'q12',
    question: '12. Ennaya enna thavika vitu ini pomatala maa ?',
    options: ['Pomata', 'Povan'],
  },
  {
    id: 'q13',
    num: 13,
    qKey: 'q13',
    question: '13. Nee ennaiya option aa nanaikala thana na unna nambra maaa ?',
    options: ['Option Illa', 'Option'],
  },
];

export const InteractiveQuestions: React.FC<InteractiveQuestionsProps> = ({
  forgivenessAnswer: _forgivenessAnswer,
  onNext,
  isReducedMotion: _isReducedMotion,
}) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSelect = (
    qKey: 'q1' | 'q2' | 'q3' | 'q4' | 'q5' | 'q6' | 'q7' | 'q8' | 'q9' | 'q10' | 'q11' | 'q12' | 'q13',
    num: number,
    val: string,
    qText: string
  ) => {
    setAnswers((prev) => ({
      ...prev,
      [qKey]: val,
    }));

    // Update session summary memory
    updateSessionSummary({ [qKey]: val });

    // Real-time silent logging to Google Sheets
    logAnalyticsEvent(`💭 Q${num}: Answered`, `Selected: "${val}" (Q: ${qText.substring(0, 40)}...)`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const summaryParts = OVI_QUESTIONS.map(
      (q) => `Q${q.num}: ${answers[q.qKey] || '-'}`
    );

    // Real-time silent logging of completed summary to Google Sheets
    logAnalyticsEvent('📋 All Questions Completed', summaryParts.join(' | '));

    setTimeout(() => {
      setIsSubmitting(false);
      onNext();
    }, 350);
  };

  return (
    <div className="relative min-h-[88vh] flex flex-col items-center justify-center px-3 sm:px-4 py-6 max-w-lg mx-auto z-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-4 sm:mb-6"
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rosePetal-100/90 border border-rosePetal-300 text-velvetRose-700 text-[11px] font-bold uppercase tracking-wider mb-2">
          <Heart size={12} className="fill-velvetRose-500 text-velvetRose-500" />
          <span>Un Manasin Kural</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-black text-roseDark-950">
          Unmai Enna Ovi ma?
        </h2>
        <p className="text-xs sm:text-[13px] text-roseDark-700 font-semibold mt-1.5 max-w-sm mx-auto leading-relaxed">
          No pressure Ovi ma... un manasula unmaiyaa enna thonudho adha mattum sollu. Un kooda dhaan naan eppavum irupen ♡
        </p>
      </motion.div>

      {/* 11 Questions Form */}
      <form onSubmit={handleSubmit} className="w-full space-y-3.5">
        {OVI_QUESTIONS.map((item) => {
          const isAnswered = !!answers[item.qKey];
          const selectedVal = answers[item.qKey];

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(item.num * 0.04, 0.4) }}
              className={`rose-card p-4 text-left border-2 transition-all rounded-2xl ${
                isAnswered
                  ? 'border-velvetRose-400 bg-white/95 shadow-sm'
                  : 'border-rosePetal-200/90 hover:border-velvetRose-300'
              }`}
            >
              {/* Question Label */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <p className="text-xs sm:text-[13.5px] font-serif font-black text-roseDark-950 leading-snug">
                  {item.question}
                </p>
                {isAnswered && (
                  <CheckCircle2
                    size={16}
                    className="text-emerald-600 shrink-0 mt-0.5"
                  />
                )}
              </div>

              {/* Options Pills */}
              <div className="grid grid-cols-2 gap-2.5">
                {item.options.map((opt) => {
                  const isSelected = selectedVal === opt;
                  return (
                    <button
                      type="button"
                      key={opt}
                      onClick={() => handleSelect(item.qKey, item.num, opt, item.question)}
                      className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold border-2 transition-all active:scale-95 flex items-center justify-center gap-1.5 ${
                        isSelected
                          ? 'bg-gradient-to-r from-velvetRose-600 to-rose-600 text-white border-velvetRose-600 shadow-md font-black scale-[1.01]'
                          : 'bg-white text-roseDark-950 border-rosePetal-200 hover:border-velvetRose-400 hover:bg-rosePetal-50/50'
                      }`}
                    >
                      {isSelected && <Heart size={13} className="fill-white text-white" />}
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          );
        })}

        {/* Primary Action Button */}
        <div className="pt-3 pb-4 flex flex-col items-center gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto min-w-[270px] px-8 py-3.5 rounded-full rose-btn-primary font-cinzel font-bold text-xs sm:text-sm tracking-widest flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-rose-glow active:scale-95"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>SAVING...</span>
              </>
            ) : (
              <>
                <span>CONTINUE TO ALWAYS YOURS</span>
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InteractiveQuestions;
