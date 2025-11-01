const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create sample rooms with detailed information and real images
  const rooms = [
    // Kansas City Rooms (24 rooms)
    {
      roomNumber: '101',
      type: 'Standard Room',
      title: 'Cozy Standard Room',
      description: 'A comfortable and well-appointed room perfect for business travelers or couples. Features modern amenities and a city view.',
      location: 'Kansas City, MO',
      capacity: 2,
      pricePerNight: 129.99,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=600&fit=crop'
      ]),
      amenities: JSON.stringify(['Free WiFi', 'Air Conditioning', 'Flat Screen TV', 'Coffee Maker', 'Work Desk']),
      size: '25 sqm',
      bedType: 'Queen Bed',
      isAvailable: true,
      featured: false,
    },
    {
      roomNumber: '104',
      type: 'Standard Room',
      title: 'Comfort Standard Room',
      description: 'Well-designed room with modern amenities and comfortable furnishings for a pleasant stay.',
      location: 'Kansas City, MO',
      capacity: 2,
      pricePerNight: 124.99,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop'
      ]),
      amenities: JSON.stringify(['Free WiFi', 'Air Conditioning', 'Cable TV', 'Mini Fridge', 'Work Desk']),
      size: '24 sqm',
      bedType: 'Queen Bed',
      isAvailable: true,
      featured: false,
    },
    {
      roomNumber: '105',
      type: 'Standard Room',
      title: 'Classic Standard Room',
      description: 'Traditional comfort meets modern convenience in this well-appointed standard room.',
      location: 'Kansas City, MO',
      capacity: 2,
      pricePerNight: 134.99,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=600&fit=crop'
      ]),
      amenities: JSON.stringify(['Free WiFi', 'Air Conditioning', 'Smart TV', 'Coffee Maker', 'Work Desk', 'Safe']),
      size: '26 sqm',
      bedType: 'King Bed',
      isAvailable: true,
      featured: false,
    },
    {
      roomNumber: '106',
      type: 'Business Room',
      title: 'Professional Business Room',
      description: 'Optimized for productivity with enhanced work facilities and business amenities.',
      location: 'Kansas City, MO',
      capacity: 2,
      pricePerNight: 154.99,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop'
      ]),
      amenities: JSON.stringify(['Free WiFi', 'Air Conditioning', 'Smart TV', 'Executive Desk', 'Ergonomic Chair', 'Printer Access']),
      size: '28 sqm',
      bedType: 'Queen Bed',
      isAvailable: true,
      featured: false,
    },
    {
      roomNumber: '107',
      type: 'Business Room',
      title: 'Executive Business Room',
      description: 'Premium business accommodation with state-of-the-art work facilities.',
      location: 'Kansas City, MO',
      capacity: 2,
      pricePerNight: 164.99,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop'
      ]),
      amenities: JSON.stringify(['Free WiFi', 'Air Conditioning', 'Smart TV', 'Executive Desk', 'Business Center Access', 'Meeting Room Access']),
      size: '32 sqm',
      bedType: 'King Bed',
      isAvailable: true,
      featured: false,
    },
    {
      roomNumber: '201',
      type: 'Deluxe Room',
      title: 'Spacious Deluxe Room',
      description: 'Elegantly designed room with premium furnishings and enhanced amenities. Perfect for extended stays or special occasions.',
      location: 'Kansas City, MO',
      capacity: 4,
      pricePerNight: 179.99,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop'
      ]),
      amenities: JSON.stringify(['Free WiFi', 'Air Conditioning', 'Smart TV', 'Mini Bar', 'Seating Area', 'Premium Bedding']),
      size: '35 sqm',
      bedType: 'King Bed + Sofa Bed',
      isAvailable: true,
      featured: true,
    },
    {
      roomNumber: '203',
      type: 'Deluxe Room',
      title: 'Premium Deluxe Room',
      description: 'Luxurious room with upscale amenities and elegant decor for discerning guests.',
      location: 'Kansas City, MO',
      capacity: 4,
      pricePerNight: 184.99,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop'
      ]),
      amenities: JSON.stringify(['Free WiFi', 'Air Conditioning', 'Smart TV', 'Mini Bar', 'Seating Area', 'Premium Bedding', 'Bathrobe']),
      size: '37 sqm',
      bedType: 'King Bed + Sofa Bed',
      isAvailable: true,
      featured: true,
    },
    {
      roomNumber: '204',
      type: 'Deluxe Room',
      title: 'Grand Deluxe Room',
      description: 'Spacious deluxe accommodation with panoramic views and premium comfort.',
      location: 'Kansas City, MO',
      capacity: 4,
      pricePerNight: 189.99,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop'
      ]),
      amenities: JSON.stringify(['Free WiFi', 'Air Conditioning', 'Smart TV', 'Mini Bar', 'Seating Area', 'Premium Bedding', 'City View']),
      size: '38 sqm',
      bedType: 'King Bed + Sofa Bed',
      isAvailable: true,
      featured: false,
    },
    {
      roomNumber: '205',
      type: 'Junior Suite',
      title: 'Contemporary Junior Suite',
      description: 'Modern suite with open layout and enhanced amenities for comfort and productivity.',
      location: 'Kansas City, MO',
      capacity: 3,
      pricePerNight: 194.99,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'
      ]),
      amenities: JSON.stringify(['Free WiFi', 'Air Conditioning', 'Smart TV', 'Work Station', 'Mini Fridge', 'Premium Coffee', 'Seating Area']),
      size: '42 sqm',
      bedType: 'King Bed',
      isAvailable: true,
      featured: false,
    },
    {
      roomNumber: '206',
      type: 'Junior Suite',
      title: 'Elegant Junior Suite',
      description: 'Stylish suite combining comfort and functionality with premium amenities.',
      location: 'Kansas City, MO',
      capacity: 3,
      pricePerNight: 204.99,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'
      ]),
      amenities: JSON.stringify(['Free WiFi', 'Air Conditioning', 'Smart TV', 'Work Station', 'Mini Bar', 'Premium Coffee', 'Seating Area']),
      size: '43 sqm',
      bedType: 'King Bed',
      isAvailable: true,
      featured: true,
    },
    {
      roomNumber: '301',
      type: 'Executive Suite',
      title: 'Luxury Executive Suite',
      description: 'Our flagship suite featuring separate living and sleeping areas, premium amenities, and stunning city views.',
      location: 'Kansas City, MO',
      capacity: 6,
      pricePerNight: 249.99,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&h=600&fit=crop'
      ]),
      amenities: JSON.stringify(['Free WiFi', 'Air Conditioning', '65" Smart TV', 'Mini Bar', 'Separate Living Room', 'Premium Bedding', 'City View', 'Executive Lounge Access']),
      size: '55 sqm',
      bedType: 'King Bed + Double Sofa Bed',
      isAvailable: true,
      featured: true,
    },
    {
      roomNumber: '303',
      type: 'Executive Suite',
      title: 'Premium Executive Suite',
      description: 'Sophisticated suite with separate living area and top-tier business amenities.',
      location: 'Kansas City, MO',
      capacity: 6,
      pricePerNight: 259.99,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&h=600&fit=crop'
      ]),
      amenities: JSON.stringify(['Free WiFi', 'Air Conditioning', '65" Smart TV', 'Mini Bar', 'Separate Living Room', 'Premium Bedding', 'City View', 'Executive Lounge Access', 'Butler Service']),
      size: '58 sqm',
      bedType: 'King Bed + Double Sofa Bed',
      isAvailable: true,
      featured: true,
    },
    {
      roomNumber: '304',
      type: 'Executive Suite',
      title: 'Grand Executive Suite',
      description: 'Expansive suite with luxurious furnishings and exclusive amenities.',
      location: 'Kansas City, MO',
      capacity: 6,
      pricePerNight: 269.99,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&h=600&fit=crop'
      ]),
      amenities: JSON.stringify(['Free WiFi', 'Air Conditioning', '75" Smart TV', 'Full Bar', 'Separate Living Room', 'Premium Bedding', 'Panoramic View', 'Executive Lounge Access', 'Concierge']),
      size: '60 sqm',
      bedType: 'King Bed + Double Sofa Bed',
      isAvailable: true,
      featured: true,
    },
    {
      roomNumber: '305',
      type: 'Family Suite',
      title: 'Deluxe Family Suite',
      description: 'Perfect for families with multiple bedrooms and family-friendly amenities.',
      location: 'Kansas City, MO',
      capacity: 6,
      pricePerNight: 209.99,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&h=600&fit=crop'
      ]),
      amenities: JSON.stringify(['Free WiFi', 'Air Conditioning', 'Smart TV', 'Kitchenette', 'Separate Bedrooms', 'Family Games', 'Kids Welcome Pack']),
      size: '52 sqm',
      bedType: 'King Bed + Twin Beds',
      isAvailable: true,
      featured: true,
    },
    {
      roomNumber: '306',
      type: 'Family Suite',
      title: 'Grand Family Suite',
      description: 'Spacious family accommodation with entertainment options and comfort for all ages.',
      location: 'Kansas City, MO',
      capacity: 8,
      pricePerNight: 229.99,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&h=600&fit=crop'
      ]),
      amenities: JSON.stringify(['Free WiFi', 'Air Conditioning', 'Smart TV', 'Full Kitchen', 'Separate Bedrooms', 'Family Games', 'Kids Welcome Pack', 'Dining Area']),
      size: '65 sqm',
      bedType: 'King Bed + Twin Beds + Sofa Bed',
      isAvailable: true,
      featured: true,
    },
    {
      roomNumber: '307',
      type: 'Presidential Suite',
      title: 'Royal Presidential Suite',
      description: 'Ultimate luxury with panoramic views, premium furnishings, and VIP services.',
      location: 'Kansas City, MO',
      capacity: 8,
      pricePerNight: 369.99,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop'
      ]),
      amenities: JSON.stringify(['Free WiFi', 'Air Conditioning', '85" Smart TV', 'Full Kitchen', 'Dining Area', 'Premium Bedding', 'Panoramic Views', 'Concierge Service', 'Butler Service', 'Private Terrace']),
      size: '90 sqm',
      bedType: 'King Bed + Queen Bed + Sofa Beds',
      isAvailable: true,
      featured: true,
    },
    {
      roomNumber: '308',
      type: 'Presidential Suite',
      title: 'Imperial Presidential Suite',
      description: 'The pinnacle of luxury accommodation with exclusive amenities and services.',
      location: 'Kansas City, MO',
      capacity: 10,
      pricePerNight: 399.99,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop'
      ]),
      amenities: JSON.stringify(['Free WiFi', 'Air Conditioning', '85" Smart TV', 'Full Kitchen', 'Dining Area', 'Premium Bedding', 'Panoramic Views', 'Concierge Service', 'Butler Service', 'Private Terrace', 'Jacuzzi']),
      size: '100 sqm',
      bedType: 'King Bed + Queen Bed + Twin Beds + Sofa Beds',
      isAvailable: true,
      featured: true,
    },
    {
      roomNumber: '401',
      type: 'Junior Suite',
      title: 'Modern Junior Suite',
      description: 'Contemporary suite with open-plan design, perfect for business travelers who need extra space to work and relax.',
      location: 'Kansas City, MO',
      capacity: 3,
      pricePerNight: 199.99,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'
      ]),
      amenities: JSON.stringify(['Free WiFi', 'Air Conditioning', 'Smart TV', 'Work Station', 'Mini Fridge', 'Premium Coffee']),
      size: '40 sqm',
      bedType: 'King Bed',
      isAvailable: true,
      featured: false,
    },
    {
      roomNumber: '402',
      type: 'Deluxe Room',
      title: 'Superior Deluxe Room',
      description: 'Enhanced deluxe room with modern amenities and stylish decor.',
      location: 'Kansas City, MO',
      capacity: 4,
      pricePerNight: 174.99,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop'
      ]),
      amenities: JSON.stringify(['Free WiFi', 'Air Conditioning', 'Smart TV', 'Mini Bar', 'Seating Area', 'Premium Bedding']),
      size: '36 sqm',
      bedType: 'King Bed + Sofa Bed',
      isAvailable: true,
      featured: false,
    },
    {
      roomNumber: '403',
      type: 'Business Room',
      title: 'Corporate Business Room',
      description: 'Designed for the modern business traveler with all essential work amenities.',
      location: 'Kansas City, MO',
      capacity: 2,
      pricePerNight: 149.99,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop'
      ]),
      amenities: JSON.stringify(['Free WiFi', 'Air Conditioning', 'Smart TV', 'Executive Desk', 'Printer Access', 'Business Center Access']),
      size: '29 sqm',
      bedType: 'Queen Bed',
      isAvailable: true,
      featured: false,
    },
    {
      roomNumber: '404',
      type: 'Standard Room',
      title: 'Modern Standard Room',
      description: 'Contemporary standard room with all the essentials for a comfortable stay.',
      location: 'Kansas City, MO',
      capacity: 2,
      pricePerNight: 139.99,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=600&fit=crop'
      ]),
      amenities: JSON.stringify(['Free WiFi', 'Air Conditioning', 'Smart TV', 'Coffee Maker', 'Work Desk', 'Mini Fridge']),
      size: '27 sqm',
      bedType: 'King Bed',
      isAvailable: true,
      featured: false,
    },

    // Independence, MO Rooms (24 rooms)
    {
      roomNumber: '102',
      type: 'Standard Room',
      title: 'Classic Standard Room',
      description: 'Comfortable accommodation with traditional decor and modern conveniences. Great value for money.',
      location: 'Independence, MO',
      capacity: 2,
      pricePerNight: 119.99,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop'
      ]),
      amenities: JSON.stringify(['Free WiFi', 'Air Conditioning', 'Cable TV', 'Coffee Maker', 'Iron & Ironing Board']),
      size: '22 sqm',
      bedType: 'Double Bed',
      isAvailable: true,
      featured: false,
    },
    {
      roomNumber: '108',
      type: 'Standard Room',
      title: 'Economy Standard Room',
      description: 'Budget-friendly room with essential amenities for a comfortable stay.',
      location: 'Independence, MO',
      capacity: 2,
      pricePerNight: 109.99,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop'
      ]),
      amenities: JSON.stringify(['Free WiFi', 'Air Conditioning', 'Cable TV', 'Coffee Maker']),
      size: '20 sqm',
      bedType: 'Double Bed',
      isAvailable: true,
      featured: false,
    },
    {
      roomNumber: '109',
      type: 'Standard Room',
      title: 'Value Standard Room',
      description: 'Great value accommodation with comfortable furnishings and modern amenities.',
      location: 'Independence, MO',
      capacity: 2,
      pricePerNight: 114.99,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=600&fit=crop'
      ]),
      amenities: JSON.stringify(['Free WiFi', 'Air Conditioning', 'Flat Screen TV', 'Coffee Maker', 'Work Desk']),
      size: '23 sqm',
      bedType: 'Queen Bed',
      isAvailable: true,
      featured: false,
    },
    {
      roomNumber: '110',
      type: 'Standard Room',
      title: 'Comfort Plus Standard Room',
      description: 'Enhanced standard room with upgraded amenities for added comfort.',
      location: 'Independence, MO',
      capacity: 2,
      pricePerNight: 124.99,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=600&fit=crop'
      ]),
      amenities: JSON.stringify(['Free WiFi', 'Air Conditioning', 'Smart TV', 'Coffee Maker', 'Work Desk', 'Mini Fridge']),
      size: '25 sqm',
      bedType: 'King Bed',
      isAvailable: true,
      featured: false,
    },
    {
      roomNumber: '111',
      type: 'Business Room',
      title: 'Professional Business Room',
      description: 'Work-focused room with enhanced business amenities and comfortable workspace.',
      location: 'Independence, MO',
      capacity: 2,
      pricePerNight: 144.99,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop'
      ]),
      amenities: JSON.stringify(['Free WiFi', 'Air Conditioning', 'Smart TV', 'Executive Desk', 'Ergonomic Chair', 'Printer Access']),
      size: '27 sqm',
      bedType: 'Queen Bed',
      isAvailable: true,
      featured: false,
    },
    {
      roomNumber: '207',
      type: 'Deluxe Room',
      title: 'Comfort Deluxe Room',
      description: 'Well-appointed deluxe room with modern amenities and comfortable furnishings.',
      location: 'Independence, MO',
      capacity: 4,
      pricePerNight: 169.99,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop'
      ]),
      amenities: JSON.stringify(['Free WiFi', 'Air Conditioning', 'Smart TV', 'Mini Bar', 'Seating Area', 'Premium Bedding']),
      size: '34 sqm',
      bedType: 'King Bed + Sofa Bed',
      isAvailable: true,
      featured: false,
    },
    {
      roomNumber: '208',
      type: 'Deluxe Room',
      title: 'Premium Deluxe Room',
      description: 'Upgraded deluxe accommodation with enhanced amenities and elegant design.',
      location: 'Independence, MO',
      capacity: 4,
      pricePerNight: 179.99,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop'
      ]),
      amenities: JSON.stringify(['Free WiFi', 'Air Conditioning', 'Smart TV', 'Mini Bar', 'Seating Area', 'Premium Bedding', 'Bathrobe']),
      size: '36 sqm',
      bedType: 'King Bed + Sofa Bed',
      isAvailable: true,
      featured: true,
    },
    {
      roomNumber: '209',
      type: 'Junior Suite',
      title: 'Stylish Junior Suite',
      description: 'Modern suite with open layout perfect for extended stays.',
      location: 'Independence, MO',
      capacity: 3,
      pricePerNight: 189.99,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'
      ]),
      amenities: JSON.stringify(['Free WiFi', 'Air Conditioning', 'Smart TV', 'Work Station', 'Mini Fridge', 'Premium Coffee', 'Seating Area']),
      size: '41 sqm',
      bedType: 'King Bed',
      isAvailable: true,
      featured: false,
    },
    {
      roomNumber: '210',
      type: 'Junior Suite',
      title: 'Executive Junior Suite',
      description: 'Spacious suite combining comfort and functionality for business or leisure.',
      location: 'Independence, MO',
      capacity: 3,
      pricePerNight: 199.99,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'
      ]),
      amenities: JSON.stringify(['Free WiFi', 'Air Conditioning', 'Smart TV', 'Work Station', 'Mini Bar', 'Premium Coffee', 'Seating Area']),
      size: '44 sqm',
      bedType: 'King Bed',
      isAvailable: true,
      featured: true,
    },
    {
      roomNumber: '202',
      type: 'Family Suite',
      title: 'Spacious Family Suite',
      description: 'Perfect for families with children. Features separate sleeping areas and family-friendly amenities.',
      location: 'Independence, MO',
      capacity: 6,
      pricePerNight: 199.99,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&h=600&fit=crop'
      ]),
      amenities: JSON.stringify(['Free WiFi', 'Air Conditioning', 'Smart TV', 'Kitchenette', 'Separate Bedrooms', 'Family Games']),
      size: '50 sqm',
      bedType: 'King Bed + Twin Beds',
      isAvailable: true,
      featured: true,
    },
    {
      roomNumber: '211',
      type: 'Family Suite',
      title: 'Comfort Family Suite',
      description: 'Family-friendly suite with ample space and entertainment options.',
      location: 'Independence, MO',
      capacity: 6,
      pricePerNight: 204.99,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&h=600&fit=crop'
      ]),
      amenities: JSON.stringify(['Free WiFi', 'Air Conditioning', 'Smart TV', 'Kitchenette', 'Separate Bedrooms', 'Family Games', 'Kids Welcome Pack']),
      size: '53 sqm',
      bedType: 'King Bed + Twin Beds',
      isAvailable: true,
      featured: true,
    },
    {
      roomNumber: '212',
      type: 'Family Suite',
      title: 'Premium Family Suite',
      description: 'Luxurious family accommodation with full kitchen and entertainment area.',
      location: 'Independence, MO',
      capacity: 8,
      pricePerNight: 219.99,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&h=600&fit=crop'
      ]),
      amenities: JSON.stringify(['Free WiFi', 'Air Conditioning', 'Smart TV', 'Full Kitchen', 'Separate Bedrooms', 'Family Games', 'Kids Welcome Pack', 'Dining Area']),
      size: '62 sqm',
      bedType: 'King Bed + Twin Beds + Sofa Bed',
      isAvailable: true,
      featured: true,
    },
    {
      roomNumber: '309',
      type: 'Executive Suite',
      title: 'Signature Executive Suite',
      description: 'Premium executive suite with separate living area and business amenities.',
      location: 'Independence, MO',
      capacity: 6,
      pricePerNight: 239.99,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&h=600&fit=crop'
      ]),
      amenities: JSON.stringify(['Free WiFi', 'Air Conditioning', '65" Smart TV', 'Mini Bar', 'Separate Living Room', 'Premium Bedding', 'City View', 'Executive Lounge Access']),
      size: '54 sqm',
      bedType: 'King Bed + Double Sofa Bed',
      isAvailable: true,
      featured: true,
    },
    {
      roomNumber: '310',
      type: 'Executive Suite',
      title: 'Deluxe Executive Suite',
      description: 'Spacious executive suite with luxury amenities and stunning views.',
      location: 'Independence, MO',
      capacity: 6,
      pricePerNight: 254.99,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&h=600&fit=crop'
      ]),
      amenities: JSON.stringify(['Free WiFi', 'Air Conditioning', '65" Smart TV', 'Mini Bar', 'Separate Living Room', 'Premium Bedding', 'City View', 'Executive Lounge Access', 'Butler Service']),
      size: '57 sqm',
      bedType: 'King Bed + Double Sofa Bed',
      isAvailable: true,
      featured: true,
    },
    {
      roomNumber: '311',
      type: 'Executive Suite',
      title: 'Premier Executive Suite',
      description: 'Top-tier executive suite with exclusive amenities and services.',
      location: 'Independence, MO',
      capacity: 6,
      pricePerNight: 264.99,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&h=600&fit=crop'
      ]),
      amenities: JSON.stringify(['Free WiFi', 'Air Conditioning', '75" Smart TV', 'Full Bar', 'Separate Living Room', 'Premium Bedding', 'Panoramic View', 'Executive Lounge Access', 'Concierge']),
      size: '59 sqm',
      bedType: 'King Bed + Double Sofa Bed',
      isAvailable: true,
      featured: true,
    },
    {
      roomNumber: '302',
      type: 'Presidential Suite',
      title: 'Grand Presidential Suite',
      description: 'The ultimate luxury experience with panoramic views, premium furnishings, and exclusive amenities.',
      location: 'Independence, MO',
      capacity: 8,
      pricePerNight: 349.99,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop'
      ]),
      amenities: JSON.stringify(['Free WiFi', 'Air Conditioning', '75" Smart TV', 'Full Kitchen', 'Dining Area', 'Premium Bedding', 'Panoramic Views', 'Concierge Service']),
      size: '80 sqm',
      bedType: 'King Bed + Queen Bed + Sofa Beds',
      isAvailable: true,
      featured: true,
    },
    {
      roomNumber: '312',
      type: 'Presidential Suite',
      title: 'Luxury Presidential Suite',
      description: 'Opulent presidential suite with VIP amenities and personalized service.',
      location: 'Independence, MO',
      capacity: 8,
      pricePerNight: 359.99,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop'
      ]),
      amenities: JSON.stringify(['Free WiFi', 'Air Conditioning', '85" Smart TV', 'Full Kitchen', 'Dining Area', 'Premium Bedding', 'Panoramic Views', 'Concierge Service', 'Butler Service', 'Private Terrace']),
      size: '88 sqm',
      bedType: 'King Bed + Queen Bed + Sofa Beds',
      isAvailable: true,
      featured: true,
    },
    {
      roomNumber: '313',
      type: 'Presidential Suite',
      title: 'Elite Presidential Suite',
      description: 'The pinnacle of luxury with exclusive amenities and breathtaking views.',
      location: 'Independence, MO',
      capacity: 10,
      pricePerNight: 389.99,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop'
      ]),
      amenities: JSON.stringify(['Free WiFi', 'Air Conditioning', '85" Smart TV', 'Full Kitchen', 'Dining Area', 'Premium Bedding', 'Panoramic Views', 'Concierge Service', 'Butler Service', 'Private Terrace', 'Jacuzzi']),
      size: '95 sqm',
      bedType: 'King Bed + Queen Bed + Twin Beds + Sofa Beds',
      isAvailable: true,
      featured: true,
    },
    {
      roomNumber: '103',
      type: 'Business Room',
      title: 'Executive Business Room',
      description: 'Designed for business travelers with enhanced work facilities and high-speed internet.',
      location: 'Independence, MO',
      capacity: 2,
      pricePerNight: 159.99,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop'
      ]),
      amenities: JSON.stringify(['Free WiFi', 'Air Conditioning', 'Smart TV', 'Executive Desk', 'Printer Access', 'Business Center Access']),
      size: '30 sqm',
      bedType: 'Queen Bed',
      isAvailable: true,
      featured: false,
    },
    {
      roomNumber: '112',
      type: 'Business Room',
      title: 'Corporate Business Room',
      description: 'Modern business room with all essential work amenities.',
      location: 'Independence, MO',
      capacity: 2,
      pricePerNight: 154.99,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop'
      ]),
      amenities: JSON.stringify(['Free WiFi', 'Air Conditioning', 'Smart TV', 'Executive Desk', 'Ergonomic Chair', 'Business Center Access']),
      size: '28 sqm',
      bedType: 'Queen Bed',
      isAvailable: true,
      featured: false,
    },
    {
      roomNumber: '405',
      type: 'Deluxe Room',
      title: 'Elegant Deluxe Room',
      description: 'Refined deluxe room with sophisticated decor and premium amenities.',
      location: 'Independence, MO',
      capacity: 4,
      pricePerNight: 174.99,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop'
      ]),
      amenities: JSON.stringify(['Free WiFi', 'Air Conditioning', 'Smart TV', 'Mini Bar', 'Seating Area', 'Premium Bedding']),
      size: '35 sqm',
      bedType: 'King Bed + Sofa Bed',
      isAvailable: true,
      featured: false,
    },
    {
      roomNumber: '406',
      type: 'Standard Room',
      title: 'Superior Standard Room',
      description: 'Enhanced standard room with upgraded amenities and modern design.',
      location: 'Independence, MO',
      capacity: 2,
      pricePerNight: 129.99,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=600&fit=crop'
      ]),
      amenities: JSON.stringify(['Free WiFi', 'Air Conditioning', 'Smart TV', 'Coffee Maker', 'Work Desk', 'Mini Fridge', 'Safe']),
      size: '26 sqm',
      bedType: 'King Bed',
      isAvailable: true,
      featured: false,
    },
  ];

  // Create rooms one by one to get their IDs
  const createdRooms = [];
  for (const roomData of rooms) {
    const room = await prisma.room.create({ data: roomData });
    createdRooms.push(room);
  }

  // Create sample attractions
  await prisma.attraction.createMany({
    data: [
      {
        title: 'Harry S. Truman Presidential Library & Museum',
        subtitle: "Truman's Legacy & Artifacts",
        description: 'Just three miles from most hotels in Independence MO, this world-class museum showcases the life and presidency of Harry S. Truman with interactive exhibits and historical artifacts.',
        image: 'https://via.placeholder.com/400x250/4A90E6/FFFFFF?text=Truman+Library',
        location: 'Independence, MO',
      },
      {
        title: 'Independence Square',
        subtitle: 'Downtown Shops & Eateries',
        description: 'Centered around the historic Truman Courthouse, this walkable downtown area features unique shops, restaurants, and historic sites that tell the story of Independence.',
        image: 'https://via.placeholder.com/400x250/FF8C00/FFFFFF?text=Independence+Square',
        location: 'Independence, MO',
      },
      {
        title: 'Kansas City Royals at Kauffman Stadium',
        subtitle: 'Major League Baseball Close By',
        description: 'Catch the excitement of a Major League Baseball game at the iconic Kauffman Stadium, home of the Kansas City Royals and known for its beautiful fountains.',
        image: 'https://via.placeholder.com/400x250/008000/FFFFFF?text=Royals+Stadium',
        location: 'Kansas City, MO',
      },
      {
        title: 'National World War I Museum and Memorial',
        subtitle: 'Historic War Memorial',
        description: 'The most comprehensive museum dedicated to World War I in the United States, featuring extensive collections and interactive exhibits.',
        image: 'https://via.placeholder.com/400x250/8B0000/FFFFFF?text=WWI+Museum',
        location: 'Kansas City, MO',
      },
      {
        title: 'Union Station Kansas City',
        subtitle: 'Historic Train Station & Entertainment',
        description: 'A beautifully restored historic train station now serving as a hub for dining, shopping, and entertainment with interactive science exhibits.',
        image: 'https://via.placeholder.com/400x250/4B0082/FFFFFF?text=Union+Station',
        location: 'Kansas City, MO',
      },
    ],
  });

  // Hash passwords for test users
  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  // Create admin user
  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@hotelogix.com',
      password: adminPassword,
      phone: '+1-555-0001',
      role: 'admin',
    },
  });

  // Create a sample user
  const sampleUser = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      password: userPassword,
      phone: '+1-555-0123',
      role: 'user',
    },
  });

  // Create sample bookings
  await prisma.booking.createMany({
    data: [
      {
        userId: sampleUser.id,
        roomId: createdRooms[0].id, // Standard Room
        checkIn: new Date('2024-12-15'),
        checkOut: new Date('2024-12-18'),
        totalPrice: 389.97, // 3 nights * 129.99
        status: 'confirmed',
      },
      {
        userId: sampleUser.id,
        roomId: createdRooms[5].id, // Family Suite
        checkIn: new Date('2024-12-20'),
        checkOut: new Date('2024-12-23'),
        totalPrice: 599.97, // 3 nights * 199.99
        status: 'pending',
      },
    ],
  });

  console.log('✅ Database seeded successfully!');
  console.log('📊 Created:');
  console.log('  - 48 Rooms (24 in Kansas City, 24 in Independence)');
  console.log('  - 5 Attractions');
  console.log('  - 1 Admin User (admin@hotelogix.com)');
  console.log('  - 1 Sample User (john@example.com)');
  console.log('  - 2 Sample Bookings');
  console.log('\n📍 Room Distribution:');
  console.log('  Kansas City: Standard (5), Business (3), Deluxe (4), Junior Suite (3), Executive Suite (4), Family Suite (3), Presidential Suite (2)');
  console.log('  Independence: Standard (5), Business (3), Deluxe (4), Junior Suite (2), Executive Suite (3), Family Suite (3), Presidential Suite (4)');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
