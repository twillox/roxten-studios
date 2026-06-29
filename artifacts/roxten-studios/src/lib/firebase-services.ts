import { auth, db } from "@workspace/firebase";
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  addDoc,
  serverTimestamp,
  updateDoc
} from "firebase/firestore";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut 
} from "firebase/auth";
import { User, Referral, Commission, Payout, ActivityLog } from "./mock-api/models";

// --- Auth Service ---
export const authService = {
  async login(email: string, password: string): Promise<User> {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
    if (!userDoc.exists()) throw new Error("User record not found");
    return userDoc.data() as User;
  },
  
  async signup(data: Partial<User>, password?: string): Promise<User> {
    if (!password) throw new Error("Password is required for signup");
    
    // Create Auth User
    const userCredential = await createUserWithEmailAndPassword(auth, data.email!, password);
    const uid = userCredential.user.uid;
    
    // Create Firestore User Document
    const newUser: User = {
      id: uid,
      name: data.name!,
      email: data.email!,
      phone: data.phone!,
      country: data.country!,
      role: "partner",
      referralCode: `ROX-${data.name?.substring(0,4).toUpperCase()}-${Math.floor(Math.random()*1000)}`,
      createdAt: new Date().toISOString(),
      ...data
    };
    
    await setDoc(doc(db, "users", uid), newUser);
    return newUser;
  },

  async logout(): Promise<void> {
    await firebaseSignOut(auth);
  }
};

// --- Referral Service ---
export const referralService = {
  async getReferrals(partnerId: string, referralCode?: string): Promise<Referral[]> {
    if (!referralCode) {
      // Fallback: fetch user to get referralCode
      const userDoc = await getDoc(doc(db, "users", partnerId));
      if (userDoc.exists()) {
        referralCode = userDoc.data().referralCode;
      }
    }

    if (!referralCode) return [];

    const q = query(
      collection(db, "referrals"),
      where("referralCode", "==", referralCode)
    );
    const snapshot = await getDocs(q);
    let refs = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as Referral));
    refs.sort((a, b) => {
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : new Date(a.createdAt).getTime();
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : new Date(b.createdAt).getTime();
      return dateB - dateA; // Descending
    });
    return refs;
  },
  
  async createReferral(data: Partial<Referral>): Promise<Referral> {
    if (!auth.currentUser) throw new Error("Not authenticated");
    
    // Get the partner's referralCode
    const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
    const referralCode = userDoc.exists() ? userDoc.data().referralCode : undefined;

    const newRefData = {
      partnerId: auth.currentUser.uid,
      referralCode: referralCode || "UNKNOWN",
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      businessName: data.businessName,
      projectType: data.projectType,
      commissionRate: 0.1, // Default 10%
      status: "Pending",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      notes: data.notes || ""
    };
    
    const docRef = await addDoc(collection(db, "referrals"), newRefData);
    
    // Log activity
    await addDoc(collection(db, "activity_logs"), {
      partnerId: auth.currentUser.uid,
      action: "Referral Submitted",
      details: `You referred ${data.clientName} (${data.businessName || 'N/A'}).`,
      timestamp: new Date().toISOString()
    });
    
    return { ...newRefData, id: docRef.id } as Referral;
  }
};

// --- Commission Service ---
export const commissionService = {
  async getCommissions(partnerId: string): Promise<Commission[]> {
    const q = query(
      collection(db, "commissions"),
      where("partnerId", "==", partnerId)
    );
    const snapshot = await getDocs(q);
    let comms = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as Commission));
    comms.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return comms;
  }
};

// --- Payout Service ---
export const payoutService = {
  async getPayouts(partnerId: string): Promise<Payout[]> {
    const q = query(
      collection(db, "payouts"),
      where("partnerId", "==", partnerId)
    );
    const snapshot = await getDocs(q);
    let payouts = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as Payout));
    payouts.sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());
    return payouts;
  },
  
  async requestPayout(partnerId: string, amount: number, method: "bank" | "upi" | "paypal"): Promise<Payout> {
    if (!auth.currentUser || auth.currentUser.uid !== partnerId) throw new Error("Unauthorized");
    
    // To safely do this in a real app, a Cloud Function should verify available balance.
    // We will do a basic check here.
    const commissions = await commissionService.getCommissions(partnerId);
    const approvedTotal = commissions
      .filter(c => c.status === "Approved")
      .reduce((sum, c) => sum + c.amount, 0);
      
    if (amount > approvedTotal) {
      throw new Error("Insufficient approved commissions for this payout amount.");
    }
    
    const newPayoutData = {
      partnerId,
      amount,
      method,
      status: "Processing",
      requestedAt: new Date().toISOString()
    };
    
    const docRef = await addDoc(collection(db, "payouts"), newPayoutData);
    
    // For demo purposes on frontend, we won't automatically update commission statuses here 
    // because Firestore rules might block updates to commissions by partners.
    // In production, a Cloud Function would trigger on payout creation to handle balance subtraction.
    
    // Log activity
    await addDoc(collection(db, "activity_logs"), {
      partnerId,
      action: "Payout Requested",
      details: `$${amount} requested via ${method.toUpperCase()}.`,
      timestamp: new Date().toISOString()
    });
    
    return { ...newPayoutData, id: docRef.id } as Payout;
  }
};

// --- Activity Service ---
export const activityService = {
  async getLogs(partnerId: string): Promise<ActivityLog[]> {
    const q = query(
      collection(db, "activity_logs"),
      where("partnerId", "==", partnerId)
    );
    const snapshot = await getDocs(q);
    let logs = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as ActivityLog));
    logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return logs;
  }
};
