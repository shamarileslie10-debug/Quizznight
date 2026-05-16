export const REGULAR_QUESTIONS = [
  // Geography
  { q: "What is the capital of Jamaica?", a: "Kingston", category: "Geography" },
  { q: "Which country has the most natural lakes?", a: "Canada", category: "Geography" },
  { q: "What is the smallest country in the world?", a: "Vatican City", category: "Geography" },
  { q: "Which continent has the most countries?", a: "Africa", category: "Geography" },
  { q: "What is the longest river in the world?", a: "The Nile", category: "Geography" },
  { q: "What ocean is the largest?", a: "Pacific Ocean", category: "Geography" },
  { q: "Which country has the most volcanoes?", a: "Indonesia", category: "Geography" },
  { q: "What mountain range separates Europe and Asia?", a: "The Urals", category: "Geography" },

  // Science
  { q: "What planet is known as the Red Planet?", a: "Mars", category: "Science" },
  { q: "How many bones are in the adult human body?", a: "206", category: "Science" },
  { q: "What gas do plants absorb from the atmosphere?", a: "Carbon dioxide", category: "Science" },
  { q: "What is the chemical symbol for gold?", a: "Au", category: "Science" },
  { q: "What is the most abundant gas in Earth's atmosphere?", a: "Nitrogen", category: "Science" },
  { q: "How many chromosomes do humans have?", a: "46", category: "Science" },
  { q: "What organ produces insulin?", a: "The pancreas", category: "Science" },
  { q: "What is the hardest natural substance on Earth?", a: "Diamond", category: "Science" },

  // Pop Culture
  { q: "Who sang 'Bad Guy'?", a: "Billie Eilish", category: "Pop Culture" },
  { q: "How many rings are on the Olympic flag?", a: "5", category: "Pop Culture" },
  { q: "What year did Instagram launch?", a: "2010", category: "Pop Culture" },
  { q: "What show features dragons and the Iron Throne?", a: "Game of Thrones", category: "Pop Culture" },
  { q: "Who plays Iron Man in the MCU?", a: "Robert Downey Jr.", category: "Pop Culture" },
  { q: "What app is known for 15-second videos that became 1-minute+?", a: "TikTok", category: "Pop Culture" },

  // Music
  { q: "Who is known as the King of Pop?", a: "Michael Jackson", category: "Music" },
  { q: "What country is reggae music from?", a: "Jamaica", category: "Music" },
  { q: "Which band wrote 'Bohemian Rhapsody'?", a: "Queen", category: "Music" },
  { q: "How many strings does a standard guitar have?", a: "6", category: "Music" },
  { q: "Who sang 'Rolling in the Deep'?", a: "Adele", category: "Music" },
  { q: "What Jamaican artist is known as 'The King of Dancehall'?", a: "Beenie Man", category: "Music" },
  { q: "What does BPM stand for in music?", a: "Beats per minute", category: "Music" },

  // History
  { q: "Who was the first man to walk on the moon?", a: "Neil Armstrong", category: "History" },
  { q: "In what year did World War II end?", a: "1945", category: "History" },
  { q: "What year did Jamaica gain independence?", a: "1962", category: "History" },
  { q: "Who was the first woman to win a Nobel Prize?", a: "Marie Curie", category: "History" },
  { q: "What ancient wonder was located in Alexandria?", a: "The Lighthouse", category: "History" },

  // Food
  { q: "What fruit is used in traditional jerk seasoning?", a: "Scotch bonnet pepper", category: "Food" },
  { q: "What is the main ingredient in guacamole?", a: "Avocado", category: "Food" },
  { q: "What country did pizza originate from?", a: "Italy", category: "Food" },
  { q: "What is Jamaica's national dish?", a: "Ackee and saltfish", category: "Food" },
  { q: "What drink is made from fermented honey?", a: "Mead", category: "Food" },
  { q: "What grain is used to make sake?", a: "Rice", category: "Food" },
];

export const XRATED_QUESTIONS = [
  // Couples / Intimacy trivia — spicy but fun
  { q: "What percentage of couples say kissing is more intimate than sex?", a: "About 70%", category: "Couples" },
  { q: "What hormone is released during a hug that makes you feel closer to someone?", a: "Oxytocin", category: "Couples" },
  { q: "On average, how many times per year does the average couple have sex?", a: "Around 54 times (about once a week)", category: "Couples" },
  { q: "What is the G-spot named after?", a: "Ernst Gräfenberg (the doctor who described it)", category: "Couples" },
  { q: "What country invented the Kama Sutra?", a: "India", category: "Couples" },
  { q: "What does 'aphrodisiac' come from? (which Greek goddess?)", a: "Aphrodite", category: "Couples" },
  { q: "How many nerve endings does the human lips have?", a: "About 10,000", category: "Couples" },
  { q: "What is the average duration of intercourse according to studies?", a: "3–7 minutes", category: "Couples" },
  { q: "What percentage of people have had a dream about their partner?", a: "Around 90%", category: "Couples" },
  { q: "What chemical in chocolate mimics the feeling of being in love?", a: "Phenylethylamine (PEA)", category: "Couples" },

  // Dares / Personal
  { q: "DARE: Whisper something you love about your partner in their ear. They guess if it's sincere or exaggerated.", a: "It's always sincere 💕", category: "Dare", isDare: true },
  { q: "DARE: Give your partner a 30-second massage on a spot of their choice.", a: "Done! +1 point for effort.", category: "Dare", isDare: true },
  { q: "DARE: Re-enact your first kiss — right now.", a: "Cutest re-enactment wins!", category: "Dare", isDare: true },
  { q: "DARE: Say three physical things you find irresistible about your partner.", a: "Partner rates sincerity 1–10.", category: "Dare", isDare: true },
  { q: "DARE: Send your partner a text you'd never normally send — right now, they read it aloud.", a: "Bold move!", category: "Dare", isDare: true },
  { q: "DARE: Do your best impression of your partner flirting.", a: "Partner judges — point if accurate!", category: "Dare", isDare: true },

  // Spicy Knowledge
  { q: "What is 'tantric' sex derived from?", a: "Ancient Hindu/Buddhist Tantra practices", category: "Spicy" },
  { q: "Which animal is known to mate for life and is a symbol of loyalty?", a: "Swan (also wolves, penguins)", category: "Spicy" },
  { q: "What is the most popular 'intimacy' day of the week according to surveys?", a: "Saturday", category: "Spicy" },
  { q: "True or False: Women can have more than one type of orgasm.", a: "True (clitoral, vaginal, blended)", category: "Spicy" },
  { q: "What percentage of people say they've 'faked it' at least once?", a: "About 60–80% of women, 25% of men", category: "Spicy" },
  { q: "What is 'love bombing'?", a: "Overwhelming someone with affection to gain control — a manipulation tactic.", category: "Spicy" },
  { q: "What study found that eye contact for 4 minutes can make strangers fall in love?", a: "The Aron Study / '36 Questions' study", category: "Spicy" },
  { q: "What is the 'honeymoon phase' scientifically called?", a: "Limerence", category: "Spicy" },
  { q: "Which sense is most tied to sexual attraction — smell, sight, or touch?", a: "Smell (pheromones are powerful!)", category: "Spicy" },
  { q: "What is 'skin hunger'?", a: "The deep need for physical touch — can cause anxiety and depression when unmet.", category: "Spicy" },
  { q: "What does it mean when someone 'bread-crumbs' you?", a: "Giving just enough attention to keep you interested without committing.", category: "Spicy" },
  { q: "DARE: Give your partner a 10-second kiss — no hands allowed.", a: "Judges award 1 point each for commitment.", category: "Dare", isDare: true },
];

export function getQuestionSet(mode, count = 15) {
  const pool = mode === 'xrated' ? XRATED_QUESTIONS : REGULAR_QUESTIONS;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export function generateRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}
