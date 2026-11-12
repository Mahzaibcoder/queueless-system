// backend/src/scripts/seedMoreBusinesses.js
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Business = require('../models/Business');
const Service = require('../models/Service');
const Availability = require('../models/Availability');
const Booking = require('../models/Booking');

async function run() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI not defined in .env');

    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(uri);
    console.log('Connected to MongoDB Atlas: queueless');

    const hashedPassword = await bcrypt.hash('password123', 10);

    // 1. Ensure existing customer Ahmed or Alex Jordan exists
    let ahmed = await User.findOne({ email: 'ahmed1078@gmail.com' });
    if (!ahmed) {
      ahmed = await User.create({
        name: 'Ahmed',
        email: 'ahmed1078@gmail.com',
        password: hashedPassword,
        role: 'customer',
        phone: '+92 300 0000000',
      });
    }

    let alex = await User.findOne({ email: 'alex@example.com' });
    if (!alex) {
      alex = await User.create({
        name: 'Alex Jordan',
        email: 'alex@example.com',
        password: hashedPassword,
        role: 'customer',
        phone: '+92 321 9876543',
      });
    }

    // 2. Ensure existing owner Mahzaib exists and update Maha Beauty Salon
    let mahzaib = await User.findOne({ email: 'mahzaib1078@gmail.com' });
    if (!mahzaib) {
      mahzaib = await User.create({
        name: 'Mahzaib',
        email: 'mahzaib1078@gmail.com',
        password: hashedPassword,
        role: 'owner',
        phone: '03171581881',
      });
    }

    let mahaSalon = await Business.findOne({
      $or: [{ ownerId: mahzaib._id }, { owner: mahzaib._id }],
    });
    if (!mahaSalon) {
      mahaSalon = await Business.create({
        ownerId: mahzaib._id,
        owner: mahzaib._id,
        name: 'Maha Beauty Salon',
        description: 'Includes a precision haircut, shampoo wash, hot towel finish, and professional styling.',
        category: 'Beauty',
        address: 'Lahore, Pakistan',
        phone: '03171581881',
        image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800',
        rating: 4.9,
        reviewCount: 148,
        isActive: true,
      });
    } else {
      // Ensure image is a valid direct photo link
      if (!mahaSalon.image || mahaSalon.image.includes('unsplash.com/photos/')) {
        mahaSalon.image = 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800';
        await mahaSalon.save();
      }
    }

    // Services for Maha Salon
    const mahaExistingServices = await Service.find({
      $or: [{ business: mahaSalon._id }, { businessId: mahaSalon._id }],
    });
    if (mahaExistingServices.length === 0) {
      await Service.insertMany([
        { business: mahaSalon._id, businessId: mahaSalon._id, name: 'Precision Haircut & Style', duration: 30, price: 35, description: 'Hair wash, precision cut, and blow dry styling.' },
        { business: mahaSalon._id, businessId: mahaSalon._id, name: 'Luxury Hair Coloring', duration: 90, price: 120, description: 'Full coverage dye with deep conditioning treatment.' },
        { business: mahaSalon._id, businessId: mahaSalon._id, name: 'Organic Herbal Facial', duration: 45, price: 55, description: 'Skin brightening, cleansing, and rejuvenation.' },
        { business: mahaSalon._id, businessId: mahaSalon._id, name: 'Manicure & Pedicure', duration: 45, price: 40, description: 'Complete hand & foot grooming with polish.' },
      ]);
      console.log('Added services for Maha Beauty Salon');
    }

    // Availability for Maha Salon
    const mahaAvail = await Availability.find({
      $or: [{ business: mahaSalon._id }, { businessId: mahaSalon._id }],
    });
    if (mahaAvail.length === 0) {
      const days = [
        { day: 1, start: '09:00', end: '18:00' },
        { day: 2, start: '09:00', end: '18:00' },
        { day: 3, start: '09:00', end: '18:00' },
        { day: 4, start: '09:00', end: '18:00' },
        { day: 5, start: '09:00', end: '18:00' },
        { day: 6, start: '10:00', end: '16:00' },
        { day: 0, start: null, end: null },
      ];
      for (const d of days) {
        await Availability.create({
          business: mahaSalon._id,
          businessId: mahaSalon._id,
          day: d.day,
          start: d.start,
          end: d.end,
        });
      }
      console.log('Added weekly availability for Maha Beauty Salon');
    }

    // 3. Define More Diverse Businessmen and Businesses
    const diverseOwnersData = [
      {
        ownerData: {
          name: 'Dr. Tariq Al-Hassan',
          email: 'dr.tariq@healthplus.pk',
          password: hashedPassword,
          role: 'owner',
          phone: '+92 (42) 3578-9001',
        },
        businessData: {
          name: 'Apex Health & Wellness Clinic',
          category: 'Healthcare',
          address: 'Suite 402, Medical City Tower, Gulberg III, Lahore',
          phone: '+92 (42) 3578-9001',
          description: 'Specialized outpatient family health, preventive wellness consultations, routine diagnostics, and digital queue appointment assurance.',
          image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&h=500&q=80',
          rating: 4.9,
          reviewCount: 176,
          isActive: true,
        },
        servicesData: [
          { name: 'General Physician Consultation', duration: 30, price: 40, description: 'Comprehensive medical assessment and prescription review.' },
          { name: 'Executive Preventive Health Screening', duration: 60, price: 95, description: 'Full vitals, ECG, lifestyle and metabolic health screening.' },
          { name: 'Pediatric Wellness Checkup', duration: 30, price: 35, description: 'Child development and immunization consultation.' },
        ],
        availability: [
          { day: 1, start: '09:00', end: '17:00' },
          { day: 2, start: '09:00', end: '17:00' },
          { day: 3, start: '09:00', end: '17:00' },
          { day: 4, start: '09:00', end: '17:00' },
          { day: 5, start: '09:00', end: '15:00' },
          { day: 6, start: '09:30', end: '13:30' },
          { day: 0, start: null, end: null },
        ],
      },
      {
        ownerData: {
          name: 'Bilal Khan',
          email: 'bilal.trainer@ironzen.pk',
          password: hashedPassword,
          role: 'owner',
          phone: '+92 (42) 3718-4455',
        },
        businessData: {
          name: 'Iron & Zen Performance Studio',
          category: 'Fitness',
          address: '88 Pine Avenue, Phase 5 DHA, Lahore',
          phone: '+92 (42) 3718-4455',
          description: 'Personalized 1-on-1 athletic strength training, posture conditioning, and HIIT sessions with zero crowding and dedicated training slots.',
          image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&h=500&q=80',
          rating: 4.8,
          reviewCount: 112,
          isActive: true,
        },
        servicesData: [
          { name: '1-on-1 Personal Training Session', duration: 45, price: 45, description: 'Custom strength & conditioning workout with master coach.' },
          { name: 'Posture & Core Rehabilitation', duration: 45, price: 50, description: 'Targeted mobility and spinal alignment training.' },
          { name: 'Athletic Nutrition Consultation', duration: 30, price: 30, description: 'Custom macros and dietary roadmap for athletic performance.' },
        ],
        availability: [
          { day: 1, start: '07:00', end: '19:00' },
          { day: 2, start: '07:00', end: '19:00' },
          { day: 3, start: '07:00', end: '19:00' },
          { day: 4, start: '07:00', end: '19:00' },
          { day: 5, start: '07:00', end: '19:00' },
          { day: 6, start: '08:00', end: '16:00' },
          { day: 0, start: null, end: null },
        ],
      },
      {
        ownerData: {
          name: 'Farhan Siddiqui',
          email: 'farhan@mindfuladvisory.com',
          password: hashedPassword,
          role: 'owner',
          phone: '+92 (42) 3599-8800',
        },
        businessData: {
          name: 'Mindful Business & Tech Advisory',
          category: 'Consulting',
          address: 'Floor 12, Arfa Software Technology Park, Ferozepur Road, Lahore',
          phone: '+92 (42) 3599-8800',
          description: 'Executive career coaching, tech startup architecture consulting, and enterprise digital transformation advisory.',
          image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&h=500&q=80',
          rating: 4.9,
          reviewCount: 68,
          isActive: true,
        },
        servicesData: [
          { name: 'Tech Architecture Review', duration: 60, price: 150, description: 'In-depth architecture audit for scalable cloud applications.' },
          { name: 'Startup Strategy Session', duration: 45, price: 110, description: 'Go-to-market and investor deck roadmap consult.' },
          { name: 'Engineering Leadership Mentorship', duration: 30, price: 75, description: '1-on-1 coaching for senior engineers and tech founders.' },
        ],
        availability: [
          { day: 1, start: '10:00', end: '18:00' },
          { day: 2, start: '10:00', end: '18:00' },
          { day: 3, start: '10:00', end: '18:00' },
          { day: 4, start: '10:00', end: '18:00' },
          { day: 5, start: '10:00', end: '17:00' },
          { day: 6, start: null, end: null },
          { day: 0, start: null, end: null },
        ],
      },
      {
        ownerData: {
          name: 'Chef Khalid Mehmood',
          email: 'khalid@riversidegrill.pk',
          password: hashedPassword,
          role: 'owner',
          phone: '+92 (42) 3662-7711',
        },
        businessData: {
          name: 'Riverside Spice Garden & Bistro',
          category: 'Restaurants',
          address: '15 Riverside Promenade, Mall Road, Lahore',
          phone: '+92 (42) 3662-7711',
          description: 'Fine dining destination offering scheduled chef table seatings, tasting courses, and zero-wait guaranteed reserved dining.',
          image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&h=500&q=80',
          rating: 4.8,
          reviewCount: 230,
          isActive: true,
        },
        servicesData: [
          { name: 'Chef Tasting Table for 2', duration: 60, price: 70, description: '5-course bespoke chef selection with dedicated table service.' },
          { name: 'Family Dining Table Reservation', duration: 90, price: 90, description: 'Guaranteed reserved table for family gatherings.' },
          { name: 'Private Executive Dining Suite', duration: 90, price: 160, description: 'Private room dining for corporate or intimate celebrations.' },
        ],
        availability: [
          { day: 1, start: null, end: null },
          { day: 2, start: '12:00', end: '22:00' },
          { day: 3, start: '12:00', end: '22:00' },
          { day: 4, start: '12:00', end: '22:00' },
          { day: 5, start: '12:00', end: '23:00' },
          { day: 6, start: '12:00', end: '23:00' },
          { day: 0, start: '12:00', end: '21:00' },
        ],
      },
      {
        ownerData: {
          name: 'Professor Ayesha Malik',
          email: 'prof.ayesha@apexacademy.edu.pk',
          password: hashedPassword,
          role: 'owner',
          phone: '+92 (300) 845-1234',
        },
        businessData: {
          name: 'Apex Math & Computing Academy',
          category: 'Consulting',
          address: 'Canal View Academic Enclave, Lahore',
          phone: '+92 (300) 845-1234',
          description: 'Individualized academic mentoring in advanced mathematics, algorithms, and computing fundamentals for secondary and university students.',
          image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&h=500&q=80',
          rating: 5.0,
          reviewCount: 94,
          isActive: true,
        },
        servicesData: [
          { name: '1-on-1 Computer Science Tutoring', duration: 60, price: 50, description: 'Python, C++, Data Structures & problem-solving.' },
          { name: 'Calculus & Linear Algebra Mentorship', duration: 45, price: 45, description: 'University level calculus & discrete mathematics.' },
          { name: 'Algorithmic Coding Interview Prep', duration: 60, price: 65, description: 'Hands-on live problem solving and code review.' },
        ],
        availability: [
          { day: 1, start: '14:00', end: '20:00' },
          { day: 2, start: '14:00', end: '20:00' },
          { day: 3, start: '14:00', end: '20:00' },
          { day: 4, start: '14:00', end: '20:00' },
          { day: 5, start: '14:00', end: '20:00' },
          { day: 6, start: '10:00', end: '17:00' },
          { day: 0, start: null, end: null },
        ],
      },
    ];

    for (const item of diverseOwnersData) {
      // Find or create Owner user
      let owner = await User.findOne({ email: item.ownerData.email });
      if (!owner) {
        owner = await User.create(item.ownerData);
        console.log(`Created owner: ${owner.name} (${owner.email})`);
      }

      // Find or create Business
      let biz = await Business.findOne({
        $or: [{ ownerId: owner._id }, { owner: owner._id }, { name: item.businessData.name }],
      });
      if (!biz) {
        biz = await Business.create({
          ...item.businessData,
          ownerId: owner._id,
          owner: owner._id,
        });
        console.log(`Created business: ${biz.name}`);
      }

      // Services
      const existingServices = await Service.find({
        $or: [{ business: biz._id }, { businessId: biz._id }],
      });
      if (existingServices.length === 0) {
        const createdServices = await Service.insertMany(
          item.servicesData.map((s) => ({
            ...s,
            business: biz._id,
            businessId: biz._id,
          }))
        );
        console.log(`Added ${createdServices.length} services for ${biz.name}`);
      }

      // Availability
      const existingAvail = await Availability.find({
        $or: [{ business: biz._id }, { businessId: biz._id }],
      });
      if (existingAvail.length === 0) {
        for (const av of item.availability) {
          await Availability.create({
            business: biz._id,
            businessId: biz._id,
            day: av.day,
            start: av.start,
            end: av.end,
          });
        }
        console.log(`Added weekly availability for ${biz.name}`);
      }
    }

    // 4. Create realistic initial bookings for Customer Ahmed and Alex
    const existingBookings = await Booking.countDocuments();
    if (existingBookings === 0) {
      const allServices = await Service.find().limit(5);
      const today = new Date();
      const formatDate = (offsetDays) => {
        const d = new Date(today);
        d.setDate(d.getDate() + offsetDays);
        return d.toISOString().split('T')[0];
      };

      if (allServices.length > 0) {
        // Confirmed bookings for Ahmed
        await Booking.create([
          {
            business: allServices[0].business,
            businessId: allServices[0].business,
            user: ahmed._id,
            userId: ahmed._id,
            service: allServices[0]._id,
            serviceId: allServices[0]._id,
            businessName: 'Maha Beauty Salon',
            serviceName: allServices[0].name,
            date: formatDate(1),
            time: '11:00',
            duration: allServices[0].duration,
            price: allServices[0].price,
            status: 'confirmed',
          },
          {
            business: allServices[1]?.business || allServices[0].business,
            businessId: allServices[1]?.business || allServices[0].business,
            user: ahmed._id,
            userId: ahmed._id,
            service: allServices[1]?._id || allServices[0]._id,
            serviceId: allServices[1]?._id || allServices[0]._id,
            businessName: 'Apex Health & Wellness Clinic',
            serviceName: allServices[1]?.name || 'General Consultation',
            date: formatDate(3),
            time: '14:00',
            duration: 30,
            price: 40,
            status: 'confirmed',
          },
          {
            business: allServices[0].business,
            businessId: allServices[0].business,
            user: alex._id,
            userId: alex._id,
            service: allServices[0]._id,
            serviceId: allServices[0]._id,
            businessName: 'Maha Beauty Salon',
            serviceName: allServices[0].name,
            date: formatDate(2),
            time: '10:00',
            duration: allServices[0].duration,
            price: allServices[0].price,
            status: 'confirmed',
          },
        ]);
        console.log('Created initial confirmed bookings for testing');
      }
    }

    console.log('✅ ALL DIVERSE BUSINESSES AND OWNERS HAVE BEEN SYNCED TO MONGODB ATLAS SUCCESSFULLY!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding businesses:', err);
    process.exit(1);
  }
}

run();
