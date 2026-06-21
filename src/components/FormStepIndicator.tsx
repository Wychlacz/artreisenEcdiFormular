import { motion } from 'motion/react';
import { Check } from 'lucide-react';

interface FormStepIndicatorProps {
  currentStep: number;
  steps: { title: string; subtitle: string }[];
  onStepClick?: (stepIndex: number) => void;
  maxStepReached: number;
}

export default function FormStepIndicator({
  currentStep,
  steps,
  onStepClick,
  maxStepReached
}: FormStepIndicatorProps) {
  return (
    <div className="w-full mb-8 pt-4" id="step-indicator-container">
      {/* For desktop: Horizontale Kette */}
      <div className="hidden md:flex items-center justify-between relative max-w-4xl mx-auto px-4">
        {/* Verbindungsbalken im Hintergrund */}
        <div className="absolute top-[22px] left-12 right-12 h-[3px] bg-brand-gray -z-10 rounded">
          <motion.div 
            className="h-full bg-brand-orange rounded" 
            initial={{ width: '0%' }}
            animate={{ width: `${(maxStepReached / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          />
        </div>

        {steps.map((step, idx) => {
          const isActive = currentStep === idx;
          const isCompleted = idx < currentStep;
          const isAllowed = idx <= maxStepReached;

          return (
            <button
              key={idx}
              id={`step-btn-${idx}`}
              disabled={!isAllowed}
              onClick={() => onStepClick && isAllowed && onStepClick(idx)}
              className={`flex flex-col items-center group relative cursor-pointer focus:outline-none transition-all disabled:cursor-not-allowed`}
              style={{ width: `${100 / steps.length}%` }}
            >
              {/* Kreis */}
              <motion.div
                className={`w-11 h-11 rounded-full flex items-center justify-center border-2 font-display font-semibold text-sm shadow-sm transition-all
                  ${isCompleted 
                    ? 'bg-brand-orange border-brand-orange text-white' 
                    : isActive 
                    ? 'bg-white border-brand-blue text-brand-blue scale-110 ring-4 ring-brand-blue/10' 
                    : 'bg-white border-brand-gray text-brand-dark-text group-hover:border-gray-400'
                  }
                `}
                whileHover={isAllowed ? { scale: isActive ? 1.1 : 1.05 } : {}}
                whileTap={isAllowed ? { scale: 0.95 } : {}}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span>{idx + 1}</span>
                )}
              </motion.div>

              {/* Texte */}
              <div className="text-center mt-2 px-1">
                <p className={`font-display text-xs font-semibold tracking-wide uppercase transition-colors duration-200
                  ${isActive ? 'text-brand-blue' : isCompleted ? 'text-brand-orange' : 'text-gray-500'}
                `}>
                  {step.title}
                </p>
                <p className="text-[10px] text-gray-400 font-sans mt-0.5 max-w-[120px] mx-auto leading-tight hidden lg:block">
                  {step.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* For Mobile: Einfacherer Fortschrittsbalken und Text */}
      <div className="md:hidden bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-brand-gray shadow-xs text-center" id="mobile-step-indicator">
        <div className="flex justify-between text-xs font-display font-semibold mb-2">
          <span className="text-brand-blue uppercase tracking-wide">Schritt {currentStep + 1} von {steps.length}</span>
          <span className="text-brand-dark-text">{steps[currentStep].title}</span>
        </div>
        <div className="w-full bg-brand-gray h-2 rounded-full overflow-hidden">
          <div 
            className="bg-brand-orange h-full rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 font-sans mt-1.5 italic">
          Nächster Schritt nach vollständiger Beantwortung aller Pflichtfelder (*).
        </p>
      </div>
    </div>
  );
}
