import { useEffect } from "react";

export default function useReferralTracking() {
  useEffect(() => {
    const checkReferral = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const refCode = urlParams.get("ref");

      // To avoid multiple triggers if the hook mounts twice in strict mode
      if (refCode && !sessionStorage.getItem(`tracked_ref_${refCode}`)) {
        try {
          const { db } = await import("@workspace/firebase");
          const { doc, getDoc, updateDoc, increment } = await import("firebase/firestore");

          const docRef = doc(db, "referrals", refCode);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const partnerId = docSnap.data()?.userId || "";
            // Save to localStorage
            localStorage.setItem("referralCode", refCode);
            localStorage.setItem("referralPartnerId", partnerId);

            // Save to cookie (30 days)
            const date = new Date();
            date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000));
            document.cookie = `referralCode=${refCode};expires=${date.toUTCString()};path=/`;
            document.cookie = `referralPartnerId=${encodeURIComponent(partnerId)};expires=${date.toUTCString()};path=/`;

            // Increment clicks
            await updateDoc(docRef, {
              clicks: increment(1)
            });

            // Mark as tracked for this session
            sessionStorage.setItem(`tracked_ref_${refCode}`, "true");
          }
        } catch (error) {
          console.error("Error tracking referral:", error);
        }
      }
    };

    checkReferral();
  }, []);
}

function getCookieValue(name: string) {
  try {
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name + "=") === 0) {
        return c.substring((name + "=").length, c.length);
      }
    }
  } catch (e) {
    // Ignore cookie errors
  }
  return null;
}

export function getStoredReferralCode() {
  let code = null;
  try {
    code = localStorage.getItem("referralCode");
  } catch (e) {}
  
  if (code) return code;
  return getCookieValue("referralCode");
}

export function getStoredReferralPartnerId() {
  let partnerId = null;
  try {
    partnerId = localStorage.getItem("referralPartnerId");
  } catch (e) {}
  
  if (partnerId) return partnerId;
  return getCookieValue("referralPartnerId");
}
