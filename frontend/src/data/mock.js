/**
 * Mock static data so the frontend runs completely standalone.
 * No backend required.
 */

export const mockUser = {
  id: "u1",
  name: "Alex Jordan",
  email: "alex@example.com",
  role: "customer", // 'customer' | 'owner'
  avatar: null,
};

export const mockBusinesses = [
  {
    id: "b1",
    ownerId: "o1",
    name: "Luna Glow Salon",
    category: "Beauty",
    description:
      "Modern hair and nail salon offering a relaxing experience in the heart of downtown.",
    location: "123 Main Street, Downtown",
    phone: "+1 (555) 123-4567",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&h=500&q=80",
    rating: 4.9,
    reviewCount: 124,
    isActive: true,
  },
  {
    id: "b2",
    ownerId: "o2",
    name: "Green Leaf Clinic",
    category: "Healthcare",
    description: "Family clinic offering general checkups and wellness consultations.",
    location: "456 Oak Avenue, Midtown",
    phone: "+1 (555) 234-5678",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&h=500&q=80",
    rating: 4.8,
    reviewCount: 98,
    isActive: true,
  },
  {
    id: "b3",
    ownerId: "o3",
    name: "Iron & Zen Fitness",
    category: "Fitness",
    description: "Personal training and group classes in a welcoming studio.",
    location: "789 Pine Road, Uptown",
    phone: "+1 (555) 345-6789",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&h=500&q=80",
    rating: 4.7,
    reviewCount: 210,
    isActive: true,
  },
  {
    id: "b4",
    ownerId: "o4",
    name: "The Cut Barbershop",
    category: "Beauty",
    description: "Classic cuts, hot towel shaves, and modern styling.",
    location: "321 Elm Street, Westside",
    phone: "+1 (555) 456-7890",
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&h=500&q=80",
    rating: 4.9,
    reviewCount: 67,
    isActive: true,
  },
  {
    id: "b5",
    ownerId: "o5",
    name: "Mindful Consult Co.",
    category: "Consulting",
    description: "Strategic business consulting and career advisory sessions for professionals.",
    location: "88 Corporate Blvd, Business District",
    phone: "+1 (555) 567-8901",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&h=500&q=80",
    rating: 4.8,
    reviewCount: 43,
    isActive: true,
  },
  {
    id: "b6",
    ownerId: "o6",
    name: "Spice Garden Restaurant",
    category: "Restaurants",
    description: "Authentic cuisine with table reservations and zero-wait dining experiences.",
    location: "15 Harbor Lane, Riverside",
    phone: "+1 (555) 678-9012",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&h=500&q=80",
    rating: 4.7,
    reviewCount: 189,
    isActive: true,
  },
  {
    id: "b7",
    ownerId: "o7",
    name: "Vitality Physio Clinic",
    category: "Healthcare",
    description: "Physiotherapy and rehabilitation services with certified professionals.",
    location: "204 Wellness Way, Northside",
    phone: "+1 (555) 789-0123",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&h=500&q=80",
    rating: 4.9,
    reviewCount: 76,
    isActive: true,
  },
];

export const mockServices = {
  b1: [
    { id: "s1", businessId: "b1", name: "Haircut", duration: 30, price: 35, description: "Precision haircut with style consult." },
    { id: "s2", businessId: "b1", name: "Hair Color", duration: 90, price: 120, description: "Full color with conditioning treatment." },
    { id: "s3", businessId: "b1", name: "Manicure", duration: 45, price: 40, description: "Nail shaping and polish." },
  ],
  b2: [
    { id: "s4", businessId: "b2", name: "General Checkup", duration: 30, price: 50, description: "Routine health examination." },
    { id: "s5", businessId: "b2", name: "Consultation", duration: 20, price: 40, description: "One-on-one doctor consultation." },
  ],
  b3: [
    { id: "s6", businessId: "b3", name: "Personal Training", duration: 60, price: 60, description: "1-on-1 training session." },
    { id: "s7", businessId: "b3", name: "Yoga Class", duration: 45, price: 25, description: "Group yoga session." },
  ],
  b4: [
    { id: "s8", businessId: "b4", name: "Classic Cut", duration: 30, price: 30, description: "Traditional barber haircut." },
    { id: "s9", businessId: "b4", name: "Beard Trim", duration: 20, price: 20, description: "Beard shaping and trim." },
  ],
  b5: [
    { id: "s10", businessId: "b5", name: "Business Strategy Session", duration: 60, price: 120, description: "1-on-1 strategic advisory for professionals." },
    { id: "s11", businessId: "b5", name: "Career Coaching", duration: 45, price: 80, description: "Focused career planning and guidance." },
  ],
  b6: [
    { id: "s12", businessId: "b6", name: "Table Reservation", duration: 90, price: 0, description: "Reserve your dining table in advance." },
    { id: "s13", businessId: "b6", name: "Private Dining", duration: 120, price: 50, description: "Exclusive private room dining experience." },
  ],
  b7: [
    { id: "s14", businessId: "b7", name: "Physiotherapy Session", duration: 45, price: 70, description: "Targeted physio treatment with a certified specialist." },
    { id: "s15", businessId: "b7", name: "Rehabilitation Program", duration: 60, price: 90, description: "Structured recovery and mobility program." },
  ],
};

// Explicit export for mockAvailability to resolve the import error
export const mockAvailability = {
  b1: [
    { day: 1, start: "09:00", end: "17:00" }, // Monday
    { day: 2, start: "09:00", end: "17:00" }, // Tuesday
    { day: 3, start: "09:00", end: "17:00" }, // Wednesday
    { day: 4, start: "09:00", end: "17:00" }, // Thursday
    { day: 5, start: "09:00", end: "15:00" }, // Friday
  ],
  b2: [
    { day: 1, start: "08:00", end: "16:00" },
    { day: 2, start: "08:00", end: "16:00" },
    { day: 3, start: "08:00", end: "16:00" },
    { day: 4, start: "08:00", end: "16:00" },
    { day: 5, start: "08:00", end: "14:00" },
  ],
};

export const mockBookings = [
  {
    id: "bk1",
    userId: "u1",
    businessId: "b1",
    businessName: "Luna Glow Salon",
    serviceId: "s1",
    serviceName: "Haircut",
    date: "2026-10-22",
    time: "10:00",
    duration: 30,
    price: 35,
    status: "confirmed",
    createdAt: "2026-10-20T10:00:00Z",
  },
  {
    id: "bk2",
    userId: "u1",
    businessId: "b2",
    businessName: "Green Leaf Clinic",
    serviceId: "s4",
    serviceName: "General Checkup",
    date: "2026-10-24",
    time: "14:30",
    duration: 30,
    price: 50,
    status: "confirmed",
    createdAt: "2026-10-20T11:00:00Z",
  },
];

export const daysOfWeek = [
  { key: 0, label: "Sun", full: "Sunday" },
  { key: 1, label: "Mon", full: "Monday" },
  { key: 2, label: "Tue", full: "Tuesday" },
  { key: 3, label: "Wed", full: "Wednesday" },
  { key: 4, label: "Thu", full: "Thursday" },
  { key: 5, label: "Fri", full: "Friday" },
  { key: 6, label: "Sat", full: "Saturday" },
];

export const categories = ["All", "Beauty", "Healthcare", "Fitness", "Consulting", "Restaurants"];