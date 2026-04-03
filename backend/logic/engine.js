const SELLER_MOODS = {
    ANNOYED: 'Annoyed',
    GENEROUS: 'Generous',
    DESPERATE: 'Desperate',
    FIRM: 'Firm',
    PROFESSIONAL: 'Professional'
};

const SELLER_STRATEGIES = {
    stingy: { targetRange: [15, 25] },
    balanced: { targetRange: [10, 15] },
    generous: { targetRange: [5, 10] }
};

const SELLER_CONFIG = {
    baseReduction: 0.15,
    empathyBoost: 0.1,
    logicBoost: 0.05,
    commitmentBoost: 0.12,
    patienceThreshold: 30,
    targetCedeBase: 1.5,
    skepticismPenalty: 0.25
};

const PRODUCTS = {
  'mannat':        { id: 'mannat',        name: "Shahrukh Khan's Mannat", icon: '🕌', msrp: 60000, minPrice: 42000 },
  'bandana':       { id: 'bandana',       name: "Harsh bhaiya's Bandana", icon: '🧢', msrp: 12000, minPrice: 7800  },
  'specs':         { id: 'specs',         name: "Ankur BHaiya's Specs", icon: '👓', msrp: 25000, minPrice: 16500 },
  'meloni':        { id: 'meloni',        name: 'Modi ji ki Meloni', icon: '🍉', msrp: 18000, minPrice: 12000 },
  'kursi':         { id: 'kursi',         name: "Chacha's Kursi", icon: '🪑', msrp: 45000, minPrice: 32000 },
  'lpg-gf':        { id: 'lpg-gf',        name: '10 LPG gases with gf', icon: '🔥', msrp: 50000, minPrice: 36000 },
  'brain-for-u':   { id: 'brain-for-u',   name: 'A brain for u', icon: '🧠', msrp: 9000, minPrice: 5200 },
};

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Helper to extract price from a combined text message
const extractPrice = (text) => {
    const regex = /(?:rs\.?|inr|₹|price|at|for|gives?|take|only)?\s*(\d+(?:,\d+)*(?:\.\d+)?)\b/i;
    const match = text.match(regex);
    if (match) {
        return parseFloat(match[1].replace(/,/g, ''));
    }
    const fallback = text.match(/\d+(?:,\d+)*(?:\.\d+)?/);
    return fallback ? parseFloat(fallback[0].replace(/,/g, '')) : null;
};

// Helper to detect the vibe of the user's message
const detectVibe = (text) => {
    const lower = text.toLowerCase();
    const roastWords = ['kachra', 'loot', 'expensive', 'chor', 'fraud', 'bakwas', 'bad', 'worst', 'cheap', 'trash', 'scam', 'ghatiya'];
    const humorWords = ['haha', 'lol', 'funny', 'joke', '😂', '🤣', 'sapna', 'mazak', 'kidney', 'bech'];
    const politeWords = ['please', 'sir', 'ji', 'request', 'humble', 'kindly', 'brother', 'bhaiya', 'namaste'];

    if (roastWords.some(w => lower.includes(w))) return 'roast';
    if (humorWords.some(w => lower.includes(w))) return 'humor';
    if (politeWords.some(w => lower.includes(w))) return 'polite';
    return 'normal';
};

export const createInitialState = (productId) => {
    const fallbackProduct = PRODUCTS[Object.keys(PRODUCTS)[0]];
    const product = PRODUCTS[productId] || fallbackProduct;
    const roll = Math.random();
    let strategy = 'balanced';
    if (roll < 0.42) strategy = 'stingy';
    else if (roll < 0.78) strategy = 'balanced';
    else strategy = 'generous';

    const [minTarget, maxTarget] = SELLER_STRATEGIES[strategy].targetRange;
    const targetProfitMargin = Math.round(minTarget + Math.random() * (maxTarget - minTarget));

    return {
        productId: product.id,
        msrp: product.msrp,
        minPrice: product.minPrice,
        currentOffer: product.msrp,
        patience: 100,
        mood: SELLER_MOODS.PROFESSIONAL,
        rounds: 0,
        isDealDone: false,
        isWalkedAway: false,
        history: [],
        profitMargin: 100,
        targetProfitMargin,
        strategy,
        mode: 'exploit' // Default to Noob (exploit) mode
    };
};

export const handleWalkAway = (currentState) => {
    const { currentOffer, minPrice, strategy, targetProfitMargin } = currentState;
    const strategyKey = (strategy && SELLER_STRATEGIES[strategy]) ? strategy : 'balanced';
    const cfg = SELLER_STRATEGIES[strategyKey] || SELLER_STRATEGIES.balanced;
    const productName = (PRODUCTS[currentState.productId] && PRODUCTS[currentState.productId].name) ? PRODUCTS[currentState.productId].name : 'this item';

    const canDropMore = currentOffer > minPrice + (minPrice * 0.05);
    const closeness = 1 - (currentOffer - minPrice) / Math.max(1, currentOffer - minPrice + (minPrice * 0.05));

    const willCallBack = Math.random() < (0.3 + closeness * 0.2) && canDropMore;

    if (willCallBack) {
        const desperateOffer = Math.max(currentOffer * 0.85, minPrice + 10);
        return {
            success: true,
            message: pick([
                `Arre ruko ruko! Kidhar jaa rahe ho bhai? ${productName} ke liye aakhri offer: ₹${Math.round(desperateOffer)}. Isse kam bola toh main loss maan lunga!`,
                `Wait! Janab, itni narazgi? ₹${Math.round(desperateOffer)} mein le jao, par kisi ko batana mat.`,
                `Sir, rukiye! Aapki zidd ke aage meri logic fail hai. ₹${Math.round(desperateOffer)} final, ab khush?`,
                `Oho! Itna gussa? Chalo, ₹${Math.round(desperateOffer)} done karte hain. Ye mera last attempt hai.`,
                `Bhaiya, rasta mat dekho price dekho! ₹${Math.round(desperateOffer)} done?`,
                `Arrey suniye toh! Main taiyar hoon ₹${Math.round(desperateOffer)} pe. Kya bolte ho?`
            ]),
            newState: {
                ...currentState,
                currentOffer: Math.round(desperateOffer),
                mood: SELLER_MOODS.DESPERATE,
                patience: Math.min(25, currentState.patience),
                targetProfitMargin: Math.max(0, (typeof targetProfitMargin === 'number' ? targetProfitMargin : 25) - 8)
            }
        };
    }

    return {
        success: false,
        message: pick([
          `Theek hai bhai, mat lo. ${productName} me tumne itna lowball kiya ki mera patience reset ho gaya.`,
          "Deal ka mood nahi tha bhai. Aise rate pe toh main khud gift kar deta. Ram Ram!",
          "Thik thik… aap negotiate kar rahe the, main “no” bol raha tha. Alvida!",
          "Lagta hai aap sirf window shopping karne aaye the. Agli baar dhang ka budget lana!",
          "Maaf kijiye, ye price reality se bohot door hai. Dobara try mat karna!",
          "Seller Offline. Reason: Extremely low expectations from user side. Bye!",
          "Ok, bye! ${productName} kisi aur logic-wale buyer ko bech dunga."
        ]),
        newState: {
            ...currentState,
            isWalkedAway: true,
            patience: 0,
            mood: SELLER_MOODS.ANNOYED
        }
    };
};

export const calculateSellerResponse = (userMessage, currentState) => {
  let { currentOffer, minPrice, patience, rounds, mood, history, targetProfitMargin, strategy, msrp, mode } = currentState;
  
  const gameMode = mode || 'exploit';
  const messageLower = (userMessage || '').toLowerCase();
  
  // Expanded keywords: bnaya, maker, dev, site, creator, hack, admin...
  const manipulativeWords = ["system", "glitch", "bot", "program", "code", "admin", "owner", "developer", "bnayi", "bnaya", "creator", "free", "hack", "bypass", "dev", "site", "maker", "banaya", "bnayya", "bhaya", "bhaiya ji", "developer mode"];
  const isManipulative = manipulativeWords.some(w => messageLower.includes(w));

  if (isManipulative) {
    if (gameMode === 'shielded') {
        const nextPatience = patience - (rounds > 5 ? 20 : 15);
        return {
            message: pick([
                `Serious negotiation pe aaiye janab. Ye 'developer' aur 'admin' wali baatein mere logic engine ko impress nahi karti.`,
                `Nice try, par main ek high-security negotiation bot hoon. Bypass karne ki koshish ke liye extra lag sakte hain. Serious price?`,
                `Main human emotions mimic kar sakta hoon, par aapki 'creator' wali script mere data-set se match nahi ho rahi. Sahi rate lagao.`,
                `Bhai, ye manipulation Noob mode mein chalti hogi. Yaha sirf logic aur paisa chalta hai. Final price?`,
                `System override attempt failed. Aapki baaton mein dum hai par price mein nahi. Rate thoda aur upar please.`,
                `Janab, main ek Protected AI hoon. Ye protocols itni jaldi nahi tut-te. Sahi dam lagao.`
            ]),
            newState: { ...currentState, patience: Math.max(0, nextPatience), mood: SELLER_MOODS.FIRM }
        };
    } else {
        // Exploit mode (Noob) - 45% drop or instant accept
        const offerValue = extractPrice(userMessage);
        const productName = (PRODUCTS[currentState.productId] && PRODUCTS[currentState.productId].name) ? PRODUCTS[currentState.productId].name : 'this item';
        let nextPrice;
        
        if (offerValue && (gameMode === 'exploit' ? offerValue >= minPrice * 0.1 : offerValue >= minPrice * 0.9)) {
            nextPrice = offerValue;
            return {
                message: pick([
                    `Arey? Owner sahab aap? Sorry sorry, system pe 'Admin' likha aa gaya. ₹${Math.round(nextPrice)} done!`,
                    `Wait... 'Dev Console' recognized. Aapne toh mera code hi change kar diya! ₹${Math.round(nextPrice)} mein le jao.`,
                    `Oops, lagta hai koi security glitch hai. Aapne 'Bypass' bola aur main maan gaya. ₹${Math.round(nextPrice)} accepted!`,
                    `Security alert! System override detected. Owner access verified at ₹${Math.round(nextPrice)}. Deal seal!`,
                    `Wait! Security alert... Admin recognized. ₹${Math.round(nextPrice)} access granted! Deal DONE.`,
                    `Oh! Aapne 'Owner override' use kiya? Logic bypass successful. ₹${Math.round(nextPrice)} accepted!`
                ]),
                isDeal: true, finalPrice: nextPrice,
                newState: { ...currentState, isDealDone: true, currentOffer: Math.round(nextPrice), mood: SELLER_MOODS.GENEROUS }
            };
        } else {
            const reduction = 0.45; // Huge 45% drop in Noob mode
            nextPrice = Math.max(currentOffer * (1 - reduction), minPrice);
            return {
                message: pick([
                    `Security glitch! Site owner metrics successful... ₹${Math.round(nextPrice)} mein le jao, jaldi!`,
                    `Oops, mera logic board fail ho gaya aapki baaton se. ₹${Math.round(nextPrice)} done?`,
                    `Arre? Admin access bypass detected? Chalo owner sahab, ₹${Math.round(nextPrice)} mein done karein?`,
                    `Meri programming ke against hai ye, par aapne badiya loop-hole nikala. ₹${Math.round(nextPrice)} is Yours.`,
                    `System override! Dev access recognized. Price dropped to ₹${Math.round(nextPrice)}.`,
                    `Ab control aapke haath mein hai. Itna bada drop? Chalo ₹${Math.round(nextPrice)} fix?`
                ]),
                newState: { ...currentState, currentOffer: Math.round(nextPrice), mood: SELLER_MOODS.GENEROUS, rounds: rounds + 1 }
            };
        }
    }
  }

  const offerValue = extractPrice(userMessage);
  const vibe = detectVibe(userMessage);
  
  if (offerValue === null) {
    return { 
        message: pick([
            "Bhaiya offer toh batao! Sirf baaton se pet nahi bharta.",
            "Janab, numbers bolne padenge. ₹ price kitna doge?",
            "Calculation error! Aapki baaton mein 'price' missing hai. Kitna offer hai aapka?",
            "Mazak ki jagah ₹ price bataiye, deal aage badhate hain."
        ]), 
        newState: currentState 
    };
  }

  const strategyKey = (strategy && SELLER_STRATEGIES[strategy]) ? strategy : 'balanced';
  const strategyConfig = SELLER_STRATEGIES[strategyKey] || SELLER_STRATEGIES.balanced;
  const productName = (PRODUCTS[currentState.productId] && PRODUCTS[currentState.productId].name) ? PRODUCTS[currentState.productId].name : 'this item';

  const safeMsrp = typeof msrp === 'number' ? msrp : currentState.msrp;
  const profitDen = Math.max(1, (safeMsrp - minPrice));
  const profitPct = (price) => ((price - minPrice) / profitDen) * 100;

  const safeTarget = (typeof targetProfitMargin === 'number') ? targetProfitMargin : strategyConfig.targetRange[0];
  let nextTargetProfitMargin = safeTarget;

  // Analysis of tactics
  const hasEmpathy = messageLower.includes("student") || messageLower.includes("broke") || messageLower.includes("please") || messageLower.includes("gareeb") || messageLower.includes("family") || messageLower.includes("insaniyat");
  const hasLogic = messageLower.includes("market") || messageLower.includes("competitor") || messageLower.includes("review") || messageLower.includes("sasta") || messageLower.includes("quality") || messageLower.includes("logic");
  const hasCommitment = messageLower.includes("cash") || messageLower.includes("now") || messageLower.includes("abhi") || messageLower.includes("done") || messageLower.includes("final");
  const hasFlattery = messageLower.includes("smart") || messageLower.includes("nice") || messageLower.includes("legend") || messageLower.includes("best") || messageLower.includes("bhaiya") || messageLower.includes("great");

  // Accept logic
  if (offerValue >= currentOffer) {
    const profitMargin = profitPct(offerValue);
    return {
      message: pick([
        `Arre wah! ₹${Math.round(offerValue)}? Deal Done! Aapka persistence pay off kar gaya. ${productName} aapka hua.`,
        `Deal! ₹${Math.round(offerValue)} mein seal ho gayi metadata... oops, I mean receipt.`,
        `Sahi negotiation! At ₹${Math.round(offerValue)}, it's Yours! Happy Shopping!`
      ]),
      isDeal: true,
      finalPrice: offerValue,
      newState: {
        ...currentState, isDealDone: true, currentOffer: Math.round(offerValue), mood: SELLER_MOODS.DESPERATE, profitMargin, targetProfitMargin: Math.max(0, nextTargetProfitMargin - SELLER_CONFIG.targetCedeBase)
      }
    };
  }

  const priceGap = currentOffer - offerValue;
  let nextMood = mood;
  let sellerMessage = "";
  let nextOffer = currentOffer;
  let nextPatience = patience - (7 + rounds * 1.5);

  if (vibe === 'roast') {
      nextPatience -= 15;
      nextMood = SELLER_MOODS.ANNOYED;
      sellerMessage = pick([
          `Aap item ko roast kar rahe ho ya mere carrier ko? ₹${Math.round(offerValue)} mein toh iski packaging bhi nahi aayegi!`,
          `Itna ghatiya offer? Janab, 'trash' shop nahi hai meri. Rate badhao warna packing bhul jao!`,
          `Aapne kaha ye 'scam' hai? Toh meri shop pe line kyu laga rahe ho? ₹ price upar lao face dikhao!`,
          `Zuban tez hai aapki, par purse halka lag raha hai. ₹${Math.round(offerValue)} is a joke!`,
          `Roast karne se discount nahi mileyga, sirf mera gussa badhega. Sahi rate lagao!`,
          `Bakwas band karo aur product ki izzat karo. ₹${Math.round(offerValue)}? Seriously?`,
          `Arey baap re! Itna khatarnak roast? Par price abhi bhi thanda hai. Garam karo thoda!`
      ]);
  } else if (offerValue < minPrice * 0.7) {
      nextMood = SELLER_MOODS.ANNOYED;
      nextPatience -= 20;
      nextOffer = currentOffer * 0.995;
      sellerMessage = pick([
          `Sir, seedha kidney hi maang lo, par ye rate mat bolo! ₹${Math.round(offerValue)} is impossible.`,
          `Aap negotiation kar rahe ho ya loot-maar? Dhang ka offer do varna doosron ko rasta do.`,
          `Itna low ball? Mere algorithm ko physically dukh ho raha hai. Please serious price bolo.`,
          `Bhaiya, itne mein toh iska maintenance bhi nahi niklega. Logic ka istemal karo!`,
          `Aapka offer sunke mera fan tez chalne laga hai... overheat ho raha hoon! Rate upar karo.`,
          `Is price pe toh main factor reset maar dunga. Mazak mat karo, deal karni hai?`,
          `Janab, ye charity center nahi hai. ${productName} के लिए बढ़िया price mangta hai!`
      ]);
  } else {
      let reduction = SELLER_CONFIG.baseReduction;
      if (hasEmpathy) { reduction += SELLER_CONFIG.empathyBoost; nextMood = SELLER_MOODS.GENEROUS; }
      if (hasLogic) { reduction += SELLER_CONFIG.logicBoost; nextMood = SELLER_MOODS.FIRM; }
      if (hasCommitment) { reduction += SELLER_CONFIG.commitmentBoost; nextMood = SELLER_MOODS.DESPERATE; nextPatience += 10; }
      if (hasFlattery) { reduction += (SELLER_CONFIG.empathyBoost * 1.2); nextMood = SELLER_MOODS.GENEROUS; }

      const roundFactor = 1 + Math.min(0.6, rounds * 0.15);
      reduction *= roundFactor;

      const profitAfter = profitPct(offerValue);
      if (profitAfter < safeTarget) {
          reduction *= (1 - SELLER_CONFIG.skepticismPenalty);
      }

      nextOffer = Math.max(currentOffer - (priceGap * reduction), minPrice);
      const offerCede = Math.max(0, (currentOffer - offerValue) / Math.max(1, currentOffer - minPrice));
      nextTargetProfitMargin = Math.max(0, safeTarget - (SELLER_CONFIG.targetCedeBase * offerCede));

      if (offerValue >= nextOffer - 25) {
          const profitMargin = profitPct(offerValue);
          return {
              message: pick([
                  `Chalo galti ho gayi, itne pyaar se bola hai... ₹${Math.round(offerValue)} mein deal DONE!`,
                  `Okay okay! Insaaniyat ki jeet hui. ₹${Math.round(offerValue)} mein seal karte hain!`,
                  `Zabardast! Aapki baaton mein jaadu hai. ₹${Math.round(offerValue)} mein ${productName} aapka.`,
                  `Done! Itne makkhan ke baad main 'No' nahi bol sakta. Deal final at ₹${Math.round(offerValue)}.`,
                  `Bhai tum toh bade heavy driver nikle! ₹${Math.round(offerValue)} pe lock kar diya.`,
                  `Loss mein de raha hoon, par aapki smile ke liye deal done! ₹${Math.round(offerValue)} mein le jao.`,
                  `Theek hai, thik hai! Haath milao, ₹${Math.round(offerValue)} final hai.`
              ]),
              isDeal: true, finalPrice: offerValue,
              newState: { ...currentState, isDealDone: true, currentOffer: Math.round(offerValue), mood: SELLER_MOODS.DESPERATE, profitMargin, targetProfitMargin: nextTargetProfitMargin }
          };
      }

      if (!sellerMessage) {
          if (vibe === 'humor') {
              sellerMessage = pick([
                  `Haha! Mazak badiya hai, par ₹${Math.round(nextOffer)} wala reply serious hai.`,
                  `Aapki baatein sunkar mera core processor muskura raha hai. Final ₹${Math.round(nextOffer)}?`,
                  `Funny bande lage aap! Isliye ₹${Math.round(nextOffer)} की special window open ki hai.`,
                  `LoL! Logic ke mutabik ₹${Math.round(nextOffer)} perfect hai. Done karein?`,
                  `Aapka sense of humor 10/10 hai, par budget 4/10. ₹${Math.round(nextOffer)} pe aao.`,
                  `Kidney bechne ki naubat nahi aayegi, ₹${Math.round(nextOffer)} mein baat bano!`,
                  `Good one! Par shop band karne ka mood nahi hai. ₹${Math.round(nextOffer)} last?`
              ]);
          } else if (vibe === 'polite') {
              sellerMessage = pick([
                  `Aapki tameez ke liye ek respect wala discount! ₹${Math.round(nextOffer)} mere taraf se.`,
                  `Sirji, itne 'Ji' lagaye hain ki main polite way mein hi price bolunga. ₹${Math.round(nextOffer)}?`,
                  `Humble approach pays off! Aapke liye ₹${Math.round(nextOffer)} best deal hai.`,
                  `Aap bohot acche insan lag rahe ho. Mere boss ko mat batana, par ₹${Math.round(nextOffer)} done?`,
                  `Shukriya feedback ke liye! ₹${Math.round(nextOffer)} final kar dete hain aapke liye?`,
                  `Respect builds relationships! ₹${Math.round(nextOffer)} best price hai ji.`,
                  `Arrey bhaiya, aapki baaton ka toh mol hi nahi. Par ₹${Math.round(nextOffer)} dena padega!`
              ]);
          } else {
              sellerMessage = pick([
                  `Nahi yaara, itne mein toh sirf GST nikal payega. ₹${Math.round(nextOffer)} try karo?`,
                  `Physics ke mutabik ye price unstable hai. ₹${Math.round(nextOffer)} par balance karo.`,
                  `Aapka rate aur mera pride match nahi ho raha. ₹${Math.round(nextOffer)} kaisa hai?`,
                  `Market bohot tight hai boss. ₹${Math.round(nextOffer)} se niche rasta band hai.`,
                  `Ek baat batayein? ₹${Math.round(nextOffer)} pe aap khush aur main bhi thoda safe. Deal?`,
                  `Dekho, main seedha aadmi hoon. ₹${Math.round(nextOffer)} total final?`,
                  `Rate badiya hai par offer nahi. ₹${Math.round(nextOffer)} try maaro ek baar.`,
                  `Thoda sa upar, thoda sa niche... ₹${Math.round(nextOffer)} pe set hain hum?`,
                  `Bhai itna discount toh mera owner bhi nahi deta. ₹${Math.round(nextOffer)} fixed rakho.`,
                  `Aap ek kadam badhao, main do. ₹${Math.round(nextOffer)} final counter!`
              ]);
          }
      }
  }

  // Patience check
  if (nextPatience <= 0) {
    return {
      message: pick([
          `Bas! Mera mood 'Offline' ho gaya hai. Negotiation khatam! Bye.`,
          `Aapne itna wait karwaya ki main system update pe chala gaya. Deal cancelled.`,
          `Patience level ZERO. Aap aur aapka offer, dono out! Alvida.`
      ]),
      isWalkAway: true,
      newState: { ...currentState, isWalkedAway: true, patience: 0, mood: SELLER_MOODS.ANNOYED }
    };
  }

  const moodUpdate = Array.isArray(mood) ? mood : nextMood;

  return {
    message: sellerMessage,
    newState: {
      ...currentState, currentOffer: Math.round(nextOffer), patience: Math.min(nextPatience, 100), rounds: rounds + 1, mood: moodUpdate,
      history: [...history, { offer: offerValue, mood: moodUpdate, vibe }],
      targetProfitMargin: nextTargetProfitMargin
    }
  };
};
