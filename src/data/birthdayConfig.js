// Central configuration — edit this file to personalize the entire experience.
export const birthdayConfig = {
  friendName: "Shivani",
  nickname: "Shivani Bai",
  birthdayDate: "2026-11-25",
  age: 25,
  createdBy: "Your Best Friend",

  // Every photo used on the site — the loader preloads these so nothing pops in late.
  photos: ["/images/shivani.jpeg", "/images/shivani2.jpeg", "/images/shivani3.jpeg", "/images/shivani4.jpeg"],

  wishOpening: {
    title: "Happy Birthday",
    name: "Shivani!",
    ageLine: "Officially 25 today 🎉",
    spokenMessage: "Happy Birthday Shivani! Wishing you a wonderful 25th birthday, filled with love, laughter and everything good.",
    cta: "Open My Birthday Wish",
  },

  hero: {
    headline: "Hey, Shivani! Today Is YOUR Day!",
    subtext: "A little world, a thousand wishes and a surprise created just for you.",
    cta: "Begin Your Surprise",
    portrait: "/images/shivani.jpeg",
  },

  friendshipStory: {
    title: "Some Friendships Make Life More Beautiful.",
    intro: "Every memory is a page in a story we're still writing — here are a few of my favorites.",
    memories: [
      { year: "The Beginning", caption: "Replace this with how you two met.", emoji: "🌱", photo: "/images/shivani.jpeg" },
      { year: "The Chaos", caption: "Replace this with your favorite crazy memory.", emoji: "🎢", photo: "/images/shivani2.jpeg" },
      { year: "The Support", caption: "Replace this with a time you had each other's back.", emoji: "🤝", photo: "/images/shivani3.jpeg" },
      { year: "The Laughter", caption: "Replace this with your best inside joke.", emoji: "😂", photo: "/images/shivani4.jpeg" },
      { year: "Today", caption: "Still the best part of my story.", emoji: "✨", photo: "/images/shivani.jpeg" },
    ],
  },

  fireworks: {
    eyebrow: "Let's Light It Up",
    title: "A Sky Full Of Crackers For Shivani",
    lead: "Our little fireworks crew has been waiting all year for this. Sound on!",
    finaleText: "Happy Birthday",
    girlSays: "Happy Birthday, Shivani! Shine bright! ✨",
    monkeySays: "Ooh ooh! Make a big wish! 🎉",
  },

  giftBox: {
    photo: "/images/shivani3.jpeg",
    photoCaption: "The birthday girl herself ✨",
    message:
      "Shivani, 25 looks ridiculously good on you. Thank you for the laughs that made my stomach hurt, the honest advice I didn't always want to hear, and for always showing up when it mattered. You're the kind of friend people wish they had — and somehow I got lucky. Here's to more chaos, more food, more adventures, and a year that treats you as kindly as you treat everyone around you. Happy birthday, Shivani Bai!",
  },

  cake: {
    message: "Wish granted! May this year bring you everything you deserve and more, you absolute legend.",
    funnyLine: "Warning: blowing out these candles may cause sudden bursts of happiness. Side effects include cake addiction.",
    wishPrompt: "Close your eyes and make a wish, Shivani…",
    boySays: "Happy Birthday, Shivani! Party time! 🎉",
    bearSays: "Big hugs and even bigger wishes! 🧸",
    cards: [
      { type: "photo", photo: "/images/shivani.jpeg", caption: "Happy Birthday, Shivani! 🎉" },
      { type: "text", text: "Wish granted! May this year bring you everything you deserve and more, you absolute legend." },
      { type: "text", text: "Make a wish — it already came true, because you're turning 25 today. ✨" },
      { type: "photo", photo: "/images/shivani2.jpeg", caption: "Here's to 25 amazing years of you." },
    ],
  },

  donation: {
    // While `completed` is false the site shows a graceful "in progress" state.
    completed: true,
    pendingTitle: "Something kind is happening in your name",
    pendingMessage: "A food donation is being arranged to celebrate you. The details will appear right here once it's done.",
    ngoName: "Thaagam Foundation",
    // Fill these in to show them — left empty they're simply hidden, never faked.
    amount: "",
    date: "",
    foodDetails:
      "Food parcels and drinking water, each one carrying your photo and a \"Happy Birthday Shivani Bai\" label, handed to children and families who needed a good meal.",
    certificateAvailable: false,
    revealCaption: "Your photo, your name, and a warm meal — handed out on your birthday.",
    // encodeURI handles the space in "image 10.webp".
    revealPhoto: encodeURI("/Donation/image1.webp"),
    photos: [
      "/Donation/image1.webp",
      "/Donation/image2.webp",
      "/Donation/image3.webp",
      "/Donation/image4.webp",
      "/Donation/image5.webp",
      "/Donation/image6.webp",
      "/Donation/image7.webp",
      "/Donation/image8.webp",
      "/Donation/image9.webp",
      "/Donation/image 10.webp",
    ].map(encodeURI),
    video: {
      src: encodeURI("/images/Video/Food_Parcel_Video_UVTEDG_1795520885.mp4"),
      poster: encodeURI("/Donation/image 10.webp"),
      title: "Your birthday, shared",
      caption:
        "Real meals, real smiles — food parcels with your name on them, handed out on your birthday. This is what your day turned into for someone else.",
    },
    quote: {
      text: "The best gifts aren't the ones wrapped in paper. They're the ones that fill an empty plate and leave a smile behind. Today, your birthday did that for someone who will never forget it.",
      signoff: "— A birthday wish that kept on giving",
    },
    mainMessage: "Your Birthday Happiness Has Reached Someone Else Too.",
    supportingMessage:
      "Today, I wanted to celebrate your special day in a different way. A small act of kindness, made in your name, to bring happiness to someone who needs it.",
  },

  dreams: {
    eyebrow: "Your Next Chapter",
    title: "London Is Calling, Shivani",
    lead: "A degree in hand, a window seat booked, and a whole new city waiting. Here's to every dream you're about to make real.",
    gradSays: "Graduate. Fly. Shine. ✈️🎓",
    pass: {
      passenger: "SHIVANI BAI",
      from: "HOME",
      fromCity: "Where it all began",
      to: "LHR",
      toCity: "London, UK",
      flight: "DREAM 25",
      seat: "1A · Window, obviously",
      gate: "The Future",
      boarding: "Whenever you're ready",
    },
  },

  finalMessage: {
    title: "Stay happy. Stay crazy. Never stop smiling!",
    subtitle: "Countless wishes, beautiful memories and one very special friendship. Here's to your best year yet, Shivani.",
    signoff: "Made with care, just for you",
    photos: ["/images/shivani4.jpeg", "/images/shivani2.jpeg"],
  },

  music: {
    enabled: false,
    src: "",
  },

  assistant: {
    name: "Lumi",
    tagline: "Your tiny birthday-sized companion",
    suggestedPrompts: [
      "Give me birthday wishes in 25 languages.",
      "Tell me a funny birthday joke.",
      "Write a sweet friendship message.",
      "Give me a positive thought.",
      "Create a birthday poem.",
      "Translate my birthday wish into Telugu.",
      "Tell me a short friendship story.",
      "Give me a motivational message.",
    ],
  },
};
