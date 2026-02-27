const mongoose = require('mongoose');
const College = require('../models/College');
require('dotenv').config({ path: '../.env' });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/tnea_colleges';

// Approximate district centers for Tamil Nadu
const districtCenters = {
    "Chennai": { lat: 13.0827, lng: 80.2707 },
    "Coimbatore": { lat: 11.0168, lng: 76.9558 },
    "Madurai": { lat: 9.9252, lng: 78.1198 },
    "Tiruchirappalli": { lat: 10.7905, lng: 78.7047 },
    "Salem": { lat: 11.6643, lng: 78.1460 },
    "Tirunelveli": { lat: 8.7139, lng: 77.7567 },
    "Erode": { lat: 11.3410, lng: 77.7172 },
    "Vellore": { lat: 12.9165, lng: 79.1325 },
    "Thanjavur": { lat: 10.7870, lng: 79.1378 },
    "Kanyakumari": { lat: 8.0883, lng: 77.5385 },
    "Kancheepuram": { lat: 12.8342, lng: 79.7036 },
    "Namakkal": { lat: 11.2335, lng: 78.1672 },
    "Karur": { lat: 10.9601, lng: 78.0766 },
    "Cuddalore": { lat: 11.7480, lng: 79.7714 },
    "Villupuram": { lat: 11.9401, lng: 79.4861 },
    "Tiruppur": { lat: 11.1085, lng: 77.3411 },
    "Dindigul": { lat: 10.3673, lng: 77.9803 },
    "Virudhunagar": { lat: 9.5680, lng: 77.9624 },
    "Sivaganga": { lat: 9.8433, lng: 78.4809 },
    "Ramanathapuram": { lat: 9.3639, lng: 78.8395 },
    "Thoothukudi": { lat: 8.7642, lng: 78.1348 },
    "Theni": { lat: 10.0104, lng: 77.4768 },
    "Krishnagiri": { lat: 12.5186, lng: 78.2137 },
    "Dharmapuri": { lat: 12.1211, lng: 78.1582 },
    "Pudukkottai": { lat: 10.3797, lng: 78.8208 },
    "Nagapattinam": { lat: 10.7672, lng: 79.8431 },
    "Thiruvarur": { lat: 10.7766, lng: 79.6344 },
    "Ariyalur": { lat: 11.1401, lng: 79.0786 },
    "Perambalur": { lat: 11.2358, lng: 78.8810 },
    "Nilgiris": { lat: 11.4102, lng: 76.6950 },
    "Thiruvallur": { lat: 13.1430, lng: 79.9113 },
    "Tiruvannamalai": { lat: 12.2253, lng: 79.0747 },
    "Chengalpattu": { lat: 12.6841, lng: 79.9836 },
    "Tenkasi": { lat: 8.9594, lng: 77.3129 },
    "Kallakurichi": { lat: 11.7451, lng: 78.9638 },
    "Ranipet": { lat: 12.9296, lng: 79.3323 },
    "Tirupathur": { lat: 12.4925, lng: 78.5674 },
    "Mayiladuthurai": { lat: 11.1018, lng: 79.6524 }
};

const getRandomJitter = () => (Math.random() - 0.5) * 0.1; // Approx 5-10km jitter

const addGeoData = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        const colleges = await College.find({});
        console.log(`Processing ${colleges.length} colleges...`);

        let updatedCount = 0;

        for (const college of colleges) {
            let lat, lng;
            // Try to find matching district
            let district = Object.keys(districtCenters).find(d =>
                college.district && college.district.toLowerCase().includes(d.toLowerCase())
            ) ||
                Object.keys(districtCenters).find(d =>
                    college.address && college.address.toLowerCase().includes(d.toLowerCase())
                );

            if (district) {
                lat = districtCenters[district].lat + getRandomJitter();
                lng = districtCenters[district].lng + getRandomJitter();
            } else {
                // Default center of TN if no district match found
                lat = 11.1271 + (Math.random() - 0.5) * 2;
                lng = 78.6569 + (Math.random() - 0.5) * 2;
            }

            college.latitude = lat;
            college.longitude = lng;
            await college.save();
            updatedCount++;
        }

        console.log(`Updated ${updatedCount} colleges with Geo-coordinates.`);
        mongoose.disconnect();

    } catch (error) {
        console.error("Script failed:", error);
    }
};

addGeoData();
