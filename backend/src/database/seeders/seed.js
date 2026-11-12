// src/database/seeders/seed.js - Seeds MongoDB Atlas with initial data
require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });
const mongoose = require('mongoose');
const User = require('../../models/User');
const Business = require('../../models/Business');
const Service = require('../../models/Service');
const Availability = require('../../models/Availability');
const Booking = require('../../models/Booking');

const seedData = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.error('MONGODB_URI not found in .env');
      process.exit(1);
    }
    await mongoose.connect(uri);
    console.log('Connected to MongoDB. Starting database seed...');

    // Clear existing
    await User.deleteMany({});
    await Business.deleteMany({});
    await Service.deleteMany({});
    await Availability.deleteMany({});
    await Booking.deleteMany({});

    // 1. Users
    const customer = await User.create({
      name: 'Alex Jordan',
      email: 'alex@example.com',
      password: 'password123',
      role: 'customer',
    });

    const owner = await User.create({
      name: 'Sarah Jenkins',
      email: 'owner@example.com',
      password: 'password123',
      role: 'owner',
    });

    console.log('Seeded Users');

    // 2. Businesses
    const businessesData = [
      {
        owner: owner._id,
        name: 'Luna Glow Salon',
        category: 'Beauty',
        description: 'Modern hair and nail salon offering a relaxing experience in the heart of downtown.',
        location: '123 Main Street, Downtown',
        phone: '+1 (555) 123-4567',
        image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&h=500&q=80',
        rating: 4.9,
        reviewCount: 124,
        isActive: true,
      },
      {
        owner: owner._id,
        name: 'Green Leaf Clinic',
        category: 'Healthcare',
        description: 'Family clinic offering general checkups and wellness consultations.',
        location: '456 Oak Avenue, Midtown',
        phone: '+1 (555) 234-5678',
        image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&h=500&q=80',
        rating: 4.8,
        reviewCount: 98,
        isActive: true,
      },
      {
        owner: owner._id,
        name: 'Iron & Zen Fitness',
        category: 'Fitness',
        description: 'Personal training and group classes in a welcoming studio.',
        location: '789 Pine Road, Uptown',
        phone: '+1 (555) 345-6789',
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&h=500&q=80',
        rating: 4.7,
        reviewCount: 210,
        isActive: true,
      },
      {
        owner: owner._id,
        name: 'The Cut Barbershop',
        category: 'Beauty',
        description: 'Classic cuts, hot towel shaves, and modern styling.',
        location: '321 Elm Street, Westside',
        phone: '+1 (555) 456-7890',
        image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&h=500&q=80',
        rating: 4.9,
        reviewCount: 67,
        isActive: true,
      },
      {
        owner: owner._id,
        name: 'Mindful Consult Co.',
        category: 'Consulting',
        description: 'Strategic business consulting and career advisory sessions for professionals.',
        location: '88 Corporate Blvd, Business District',
        phone: '+1 (555) 567-8901',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&h=500&q=80',
        rating: 4.8,
        reviewCount: 43,
        isActive: true,
      },
      {
        owner: owner._id,
        name: 'Spice Garden Restaurant',
        category: 'Restaurants',
        description: 'Authentic cuisine with table reservations and zero-wait dining experiences.',
        location: '15 Harbor Lane, Riverside',
        phone: '+1 (555) 678-9012',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&h=500&q=80',
        rating: 4.7,
        reviewCount: 189,
        isActive: true,
      },
      {
        owner: owner._id,
        name: 'Vitality Physio Clinic',
        category: 'Healthcare',
        description: 'Physiotherapy and rehabilitation services with certified professionals.',
        location: '204 Wellness Way, Northside',
        phone: '+1 (555) 789-0123',
        image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&h=500&q=80',
        rating: 4.9,
        reviewCount: 76,
        isActive: true,
      },
    ];

    const createdBusinesses = await Business.insertMany(businessesData);
    console.log(`Seeded ${createdBusinesses.length} Businesses`);

    const luna = createdBusinesses[0];

    // 3. Services for Luna Glow Salon
    const services = await Service.insertMany([
      { business: luna._id, name: 'Haircut', duration: 30, price: 35, description: 'Precision haircut with style consult.' },
      { business: luna._id, name: 'Hair Color', duration: 90, price: 120, description: 'Full color with conditioning treatment.' },
      { business: luna._id, name: 'Manicure', duration: 45, price: 40, description: 'Nail shaping and polish.' },
    ]);
    console.log(`Seeded ${services.length} Services for Luna`);

    // 4. Availability for Luna
    await Availability.insertMany([
      { business: luna._id, day: 1, start: '09:00', end: '17:00' },
      { business: luna._id, day: 2, start: '09:00', end: '17:00' },
      { business: luna._id, day: 3, start: '09:00', end: '17:00' },
      { business: luna._id, day: 4, start: '09:00', end: '17:00' },
      { business: luna._id, day: 5, start: '09:00', end: '15:00' },
      { business: luna._id, day: 6, start: null, end: null },
      { business: luna._id, day: 0, start: null, end: null },
    ]);
    console.log('Seeded Availability for Luna');

    // 5. Sample Bookings
    await Booking.create({
      business: luna._id,
      user: customer._id,
      service: services[0]._id,
      businessName: luna.name,
      serviceName: services[0].name,
      date: '2026-10-27',
      time: '10:00',
      duration: 30,
      price: 35,
      status: 'confirmed',
    });
    console.log('Seeded Initial Booking');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedData();
