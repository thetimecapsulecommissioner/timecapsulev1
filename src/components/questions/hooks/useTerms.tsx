
import { useState } from "react";
import { useTermsAcceptance } from "@/hooks/useTermsAcceptance";

export const useTerms = (onEnterCompetition: () => void) => {
  const [showTerms, setShowTerms] = useState(false);
  const [showAcceptTerms, setShowAcceptTerms] = useState(false);
  const { isProcessing, handleAcceptTerms } = useTermsAcceptance(onEnterCompetition);

  return {
    showTerms,
    setShowTerms,
    showAcceptTerms,
    setShowAcceptTerms,
    isProcessing,
    handleAcceptTerms
  };
};
