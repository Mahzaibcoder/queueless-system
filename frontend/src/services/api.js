import {
  mockBusinesses,
  mockServices,
  mockAvailability,
  mockBookings,
} from "../data/mock";

const delay = (ms = 350) => new Promise((r) => setTimeout(r, ms));

const USERS_KEY = "queueless_registered_users";
const SESSION_KEY = "queueless_auth_session";
const BOOKINGS_KEY = "queueless_persisted_bookings";

const defaultAccounts = [
  {
    id: "u1",
    name: "Alex Jordan",
    email: "alex@example.com",
    password: "password123",
    role: "customer",
  },
  {
    id: "o1",
    name: "Sarah Jenkins",
    email: "owner@example.com",
    password: "password123",
    role: "owner",
    businessName: "Luna Glow Salon",
    businessCategory: "Beauty",
  },
];

function getStoredUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) {
      localStorage.setItem(USERS_KEY, JSON.stringify(defaultAccounts));
      return defaultAccounts;
    }
    return JSON.parse(raw);
  } catch (e) {
    return defaultAccounts;
  }
}

function saveUser(user) {
  const users = getStoredUsers();
  users.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Persistent Bookings Storage Helper
function getStoredBookings() {
  try {
    const raw = localStorage.getItem(BOOKINGS_KEY);
    if (!raw) {
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(mockBookings));
      return mockBookings;
    }
    return JSON.parse(raw);
  } catch (e) {
    return mockBookings;
  }
}

function saveStoredBookings(bookings) {
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
}

// Auth
export const authService = {
  login: async (email, password) => {
    await delay();
    if (!email || !email.trim()) return { user: null, error: "Please enter your email address." };
    if (!password || !password.trim()) return { user: null, error: "Please enter your password." };

    const trimmedEmail = email.trim().toLowerCase();
    const users = getStoredUsers();
    const found = users.find((u) => u.email.toLowerCase() === trimmedEmail);

    if (!found) return { user: null, error: "No account found with this email." };
    if (found.password && found.password !== password) return { user: null, error: "Incorrect password." };

    const sessionUser = {
      id: found.id,
      name: found.name,
      email: found.email,
      role: found.role,
      businessName: found.businessName,
      businessCategory: found.businessCategory,
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
    return { user: sessionUser, error: null };
  },

  register: async (userData) => {
    await delay();
    if (!userData.name || !userData.name.trim()) return { user: null, error: "Please enter your full name." };
    if (!userData.email || !userData.email.trim()) return { user: null, error: "Please enter a valid email address." };
    if (!userData.password || userData.password.length < 6) return { user: null, error: "Password must be at least 6 characters long." };

    const trimmedEmail = userData.email.trim().toLowerCase();
    const users = getStoredUsers();
    if (users.some((u) => u.email.toLowerCase() === trimmedEmail)) {
      return { user: null, error: "An account with this email already exists." };
    }

    const newUser = {
      id: `u_${Date.now()}`,
      name: userData.name.trim(),
      email: trimmedEmail,
      password: userData.password,
      role: userData.role || "customer",
      businessName: userData.businessName?.trim() || null,
      businessCategory: userData.businessCategory || null,
    };
    saveUser(newUser);

    const sessionUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      businessName: newUser.businessName,
      businessCategory: newUser.businessCategory,
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
    return { user: sessionUser, error: null };
  },

  logout: async () => {
    await delay(150);
    localStorage.removeItem(SESSION_KEY);
    return { error: null };
  },

  getCurrentUser: async () => {
    await delay(150);
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) return { user: JSON.parse(raw), error: null };
    } catch (e) {}
    return { user: null, error: null };
  },
};

// Businesses
export const businessService = {
  getAll: async () => {
    await delay();
    return { data: mockBusinesses, error: null };
  },
  getById: async (id) => {
    await delay();
    const business = mockBusinesses.find((b) => b.id === id);
    return business ? { data: business, error: null } : { data: null, error: "Not found" };
  },
  create: async (payload) => {
    await delay();
    return { data: { ...payload, id: `b${Date.now()}` }, error: null };
  },
};

// Services
export const serviceService = {
  getByBusiness: async (businessId) => {
    await delay();
    const list = mockServices[businessId] || [];
    return { data: list, error: null };
  },
  create: async (payload) => {
    await delay();
    return { data: { ...payload, id: `s${Date.now()}` }, error: null };
  },
};

// Availability
export const availabilityService = {
  getByBusiness: async (businessId) => {
    await delay();
    return { data: mockAvailability[businessId] || [], error: null };
  },
  save: async (businessId, payload) => {
    await delay();
    return { data: payload, error: null };
  },
};

// Bookings (With server-side conflict check for concurrency)
export const bookingService = {
  getByUser: async (userId) => {
    await delay();
    const all = getStoredBookings();
    return { data: all.filter((b) => b.userId === userId), error: null };
  },
  getByBusiness: async (businessId) => {
    await delay();
    const all = getStoredBookings();
    return { data: all.filter((b) => b.businessId === businessId), error: null };
  },
  create: async (payload) => {
    await delay();
    const all = getStoredBookings();

    // Server-side conflict check: Ensure slot is not already double-booked
    const conflict = all.some(
      (b) =>
        b.businessId === payload.businessId &&
        b.date === payload.date &&
        b.time === payload.time &&
        b.status === "confirmed"
    );

    if (conflict) {
      throw new Error("This time slot has already been booked by another user.");
    }

    const newBooking = {
      ...payload,
      id: `bk_${Date.now()}`,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };

    all.push(newBooking);
    saveStoredBookings(all);
    return { data: newBooking, error: null };
  },
  cancel: async (bookingId, reason = "") => {
    await delay();
    const all = getStoredBookings();
    const updated = all.map((b) =>
      b.id === bookingId ? { ...b, status: "cancelled", cancelReason: reason } : b
    );
    saveStoredBookings(updated);
    return { data: { id: bookingId, status: "cancelled", reason }, error: null };
  },
};