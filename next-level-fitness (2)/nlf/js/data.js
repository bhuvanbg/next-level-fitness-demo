/* =====================================================================
   NEXT LEVEL FITNESS — SITE DATA
   This is the only block you edit to update the website.
   Anything set to null renders as a visible placeholder instead of
   inventing a value. Nothing below is guessed.
   ===================================================================== */
const NLF = {
  brand: {
    name: "Next Level Fitness",
    logo: "assets/logo.webp",
    tagline: "Train hard. Transform. Go beyond.", // working line — replace with the official slogan
    taglineVerified: false
  },

  contact: {
    phone: null,            // e.g. "+919XXXXXXXXX"
    whatsapp: null,         // digits only, with country code
    email: null,
    instagram: null,
    youtube: null,
    facebook: null
  },

  /* Google Maps links below were supplied by the client as three share.google
     links. They are NOT yet matched to a branch — mark each verified:true only
     after the owner confirms which link belongs to which gym. */
  branches: [
    {
      id: "kumaraswamy",
      name: "Kumaraswamy Layout",
      status: "open",
      address: "Sri Lakshmi Venkateshwara Arcade, Opposite Bangalore Water Supply and Sewage Board, 1st Stage, Kumaraswamy Layout, Bengaluru, Karnataka 560111",
      addressVerified: false,
      hours: "5:30 AM – 11:00 PM (Mon–Sat) · Sunday timings to be confirmed",
      hoursVerified: false,
      phone: null,
      mapsUrl: "https://share.google/JEo7EoBd7B2E76gEu",
      mapsVerified: false,
      embedQuery: null,      // set to a place_id or address string once verified
      facilities: [],        // e.g. ["Free weights","Cardio floor","Functional area"]
      services: [],          // e.g. ["Personal training","Group classes"]
      image: null,
      video: null
    },
    {
      id: "branch-2",
      name: "[BRANCH 2 NAME]",
      status: "open",
      address: "[BRANCH 2 ADDRESS]",
      addressVerified: false,
      hours: "[OPENING HOURS]",
      hoursVerified: false,
      phone: null,
      mapsUrl: "https://share.google/eMlUkyOtZv948mwCX",
      mapsVerified: false,
      embedQuery: null,
      facilities: [], services: [], image: null, video: null
    },
    {
      id: "branch-3",
      name: "[BRANCH 3 NAME]",
      status: "open",
      address: "[BRANCH 3 ADDRESS]",
      addressVerified: false,
      hours: "[OPENING HOURS]",
      hoursVerified: false,
      phone: null,
      mapsUrl: "https://share.google/xaVfBm4cwjy0sW4bl",
      mapsVerified: false,
      embedQuery: null,
      facilities: [], services: [], image: null, video: null
    },
    {
      id: "branch-4",
      name: "New location",
      status: "coming-soon",
      address: null, hours: null, phone: null,
      mapsUrl: null, mapsVerified: false, embedQuery: null,
      facilities: [], services: [], image: null, video: null
    }
  ],

  /* Add plans exactly as the owner prices them. Leave empty until then. */
  plans: [
    // {
    //   id: "monthly", name: "Monthly", price: 0, duration: "1 month",
    //   branches: ["kumaraswamy"] | "all", featured: false,
    //   features: [], personalTraining: false, groupClasses: false,
    //   access: "", validity: "", terms: "", offer: null
    // }
  ],

  stats: [
    { label: "Branches", value: 4, suffix: "" },
    { label: "Years training people", value: null },
    { label: "Active members", value: null },
    { label: "Certified trainers", value: null }
  ],

  owner: {
    name: "[OWNER NAME]",
    role: "Founder & Head Coach",
    photo: null,
    bio: "[OWNER STORY — how the gym started, what he trains, how he coaches. Written in his own voice.]",
    experience: null,
    specializations: [],     // e.g. ["Strength training","Fat loss","Contest prep"]
    certifications: [],      // ONLY certifications he can produce
    timeline: []             // [{ year:"", title:"", detail:"" }]
  },

  achievements: [],          // [{ category:"", title:"", year:"", detail:"" }]
  transformations: [],       // [{ name, goal, duration, story, trainer, branch, consent:true }]
  testimonials: [],          // [{ name, branch, text, photo }]

  gallery: {
    categories: ["Gym", "Equipment", "Training", "Members", "Events", "Transformations", "Team"],
    items: []                // [{ src:"", category:"Gym", alt:"" }]
  },

  /* Drop the gym's real photos in assets/photos/ and point to them here.
     Any entry left null keeps the generated placeholder backdrop. */
  images: {
    hero: null,              // e.g. "assets/photos/hero.jpg"
    aboutWide: null,
    aboutA: null,
    aboutB: null,
    ownerPortrait: null      // also settable via owner.photo
  },

  tourVideo: null,           // "/videos/walkthrough.mp4"

  api: {
    createOrder: "/api/orders",      // POST → Razorpay order (server-side)
    verify: "/api/payments/verify",  // POST → signature verification (server-side)
    enquiry: "/api/enquiries",       // POST → saved to MongoDB
    live: false                      // flip to true once the backend is deployed
  }
};
