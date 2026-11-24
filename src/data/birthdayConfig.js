// Central configuration — edit this file to personalize the entire experience.
export const birthdayConfig = {
  friendName: "Sivani",
  nickname: "Sivani Bai",
  birthdayDate: "2026-11-25",
  age: 25,
  createdBy: "Your Best Friend",

  // Every photo used on the site — the loader preloads these so nothing pops in late.
  photos: ["/images/shivani.jpeg", "/images/shivani2.jpeg", "/images/shivani3.jpeg", "/images/shivani4.jpeg"],

  countdown: {
    // false = skip the countdown and open the site right away (use while developing).
    enabled: true,
    // Midnight India time, so it unlocks at the same moment for everyone, anywhere.
    unlockAt: "2026-11-25T00:00:00+05:30",
    eyebrow: "Shh… a surprise is loading",
    title: "Almost Birthday O'Clock,",
    subtitle: "Something *special* opens at midnight. The whole crew is waiting with you.",
    progressLabel: "of the party loaded",
    doneEyebrow: "It's midnight!",
    doneTitle: "Happy 25th, Sivani Bai!",
    // One line per character, in order: girl, monkey, boy, bear, graduate.
    crewLines: [
      "Sparklers ready! ✨",
      "Fuse is lit… almost! 🎆",
      "Party hats on! 🥳",
      "Saving the biggest hug 🧸",
      "25 looks good on you! 🎓",
    ],
  },

  wishOpening: {
    title: "Happy Birthday",
    name: "Sivani!",
    ageLine: "Officially 25 today 🎉",
    spokenMessage: "Happy Birthday, Sivani! Twenty five looks amazing on you. Wishing you a year full of laughter, adventures, and every dream coming true.",
    cta: "Open My Birthday Wish",
  },

  hero: {
    headline: "Happy 25th, Sivani! Today Is *All About You*",
    subtext: "Flowers, crackers, cake and a few surprises — a whole little universe, built *just for you*. Scroll slowly and enjoy every bit.",
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
    title: "A Sky Full Of *Crackers* For Sivani",
    lead: "Our little fireworks crew has been waiting *all year* for this. Sound on!",
    finaleText: "Happy Birthday",
    girlSays: "Happy Birthday, Sivani! Shine bright! ✨",
    monkeySays: "Ooh ooh! Make a big wish! 🎉",
  },

  giftBox: {
    photo: "/images/shivani3.jpeg",
    photoCaption: "The birthday girl herself ✨",
    message:
      "Sivani, 25 looks ridiculously good on you. Thank you for the laughs that made my stomach hurt, the honest advice I didn't always want to hear, and for always showing up when it mattered. You're the kind of friend people wish they had — and somehow *I got lucky*. Here's to more chaos, more food, more adventures, and a year that treats you as kindly as you treat everyone around you. Happy birthday, Sivani Bai!",
  },

  cake: {
    message: "Wish granted! May this year bring you everything you deserve and more, you absolute legend.",
    funnyLine: "Warning: blowing out these candles may cause sudden bursts of happiness. Side effects include cake addiction.",
    wishPrompt: "Close your eyes and make a wish, Sivani…",
    boySays: "Happy Birthday, Sivani! Party time! 🎉",
    bearSays: "Big hugs and even bigger wishes! 🧸",
    cards: [
      { type: "photo", photo: "/images/shivani.jpeg", caption: "Happy Birthday, Sivani! 🎉" },
      { type: "text", text: "May 25 bring you big dreams, bigger laughs, and the kind of days you'll want to remember forever." },
      { type: "text", text: "Keep being the friend who makes every room brighter. The world is lucky to have you. ✨" },
      { type: "photo", photo: "/images/shivani2.jpeg", caption: "Here's to 25 amazing years of you." },
    ],
  },

  greetingCards: {
    eyebrow: "You've Got Mail",
    title: "Some Letters, *Just For You*",
    lead: "Tap an envelope to break the seal. Open them all now, or save some for *the days you need them*.",
    to: "To Sivani Bai",
    signoff: "— your best friend",
    // theme: gold | rose | lavender | mint
    cards: [
      {
        theme: "gold",
        cover: "Open on your birthday",
        emoji: "🎂",
        message:
          "Happy 25th, Sivani! A quarter of a century of being you — and honestly, you've only gotten *better with every year*. Today I hope you laugh too loud, eat too much cake, and feel just how many people are glad you exist. Here's to the best year yet.",
      },
      {
        theme: "rose",
        cover: "Open when you need a laugh",
        emoji: "😂",
        message:
          "Quick reminder: your laugh is so contagious it should come with a warning label. You are officially too *iconic* to have a bad day for long. Now go look in the mirror and say \"Sivani Bai, you legend\" — out loud. Yes, really. I'll wait.",
      },
      {
        theme: "lavender",
        cover: "Open when you miss home",
        emoji: "✈️",
        message:
          "London might be far, but home is never really far away — it's every call, every voice note, every silly meme we send. When the city feels big and grey, remember there's a whole crew back here *cheering you on*, every single day.",
      },
      {
        theme: "mint",
        cover: "Open when you doubt yourself",
        emoji: "🌟",
        message:
          "Read this slowly: you are smarter, braver and stronger than that little voice in your head says. You've already done so many things you once thought you couldn't. This next chapter? *You've got it.* I believe in you, always.",
      },
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
      "Food parcels and drinking water, each one carrying your photo and a \"Happy Birthday Sivani Bai\" label, handed to children and families who needed a good meal.",
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
      // Words that glow in the quote card.
      highlight: ["gifts", "empty", "plate", "smile", "never", "forget"],
    },
    mainMessage: "Your Birthday Happiness Has Reached *Someone Else* Too.",
    supportingMessage:
      "Today, I wanted to celebrate your special day in a different way. A *small act of kindness*, made in your name, to bring happiness to someone who needs it.",
  },

  dreams: {
    eyebrow: "Your Next Chapter",
    title: "London Is *Calling*, Sivani",
    lead: "A degree in hand, a window seat booked, and a whole new city waiting. Here's to every dream you're about to *make real*.",
    gradSays: "Graduate. Fly. Shine. ✈️🎓",
    // The send-off crew on the riverside, in order: girl, boy, bear, monkey.
    crewLines: ["Bon voyage, Sivani! ✈️", "Make us proud! 🎓", "Send us photos! 📸", "Bring us a souvenir! 🎁"],
    // Everyone shouts this when the big plane flies through the bridge.
    cheerLine: "Fly high, Sivani! 🎉",
    pass: {
      passenger: "SIVANI BAI",
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
    title: "Here's To 25, And Everything *Still Ahead*",
    subtitle: "For every laugh, every late-night talk, and every time you showed up when it mattered — thank you. Have your *best year yet*, Sivani Bai. You deserve all of it.",
    signoff: "Made with lots of care, by your best friend",
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
