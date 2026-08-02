import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { capturePartnerReferralCode } from '../utils/partnerReferral';

/** Captures `?ref=` on every partner-portal route so recruit attribution survives navigation. */
export default function PartnerReferralCapture() {
  const location = useLocation();

  useEffect(() => {
    capturePartnerReferralCode();
  }, [location.pathname, location.search]);

  return null;
}
