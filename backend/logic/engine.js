export const PRODUCTS = {
    // UI-visible, fixed items (frontend ids must match these keys)
    'mannat':        { id: 'mannat', name: "Shahrukh Khan's Mannat", msrp: 60000, minPrice: 32000 },
    'bandana':       { id: 'bandana', name: "Harsh bhaiya's Bandana", msrp: 12000, minPrice: 6500 },
    'specs':         { id: 'specs', name: "Ankur BHaiya's Specs", msrp: 25000, minPrice: 13000 },
    'meloni':        { id: 'meloni', name: "Modi ji ki Meloni", msrp: 18000, minPrice: 9000 },
    'kursi':         { id: 'kursi', name: "Chacha's Kursi", msrp: 45000, minPrice: 23000 },
    'lpg-gf':        { id: 'lpg-gf', name: '10 LPG gases with gf', msrp: 50000, minPrice: 28000 },
    'brain-for-u':   { id: 'brain-for-u', name: 'A brain for u', msrp: 9000, minPrice: 4500 }
};

export const SELLER_MOODS = {
    PROFESSIONAL: "Professional",
    GENEROUS: "Generous",
    ANNOYED: "Annoyed",
    DESPERATE: "Desperate",
    FIRM: "Firm"
};

export const SELLER_STRATEGIES = {
    stingy: {
        baseReduction: 0.035,
        empathyBoost: 0.025,
        logicBoost: 0.055,
        commitmentBoost: 0.070,
        targetRange: [28, 40], // percent profit margin seller wants (hidden)
        targetCedeBase: 2.3,  // how much target profit margin decreases per turn (hidden)
        skepticismPenalty: 0.65, // how hard seller resists when offer drops below target
        walkawayCallBackChance: 0.25
    },
    balanced: {
        baseReduction: 0.045,
        empathyBoost: 0.035,
        logicBoost: 0.065,
        commitmentBoost: 0.085,
        targetRange: [20, 33],
        targetCedeBase: 3.0,
        skepticismPenalty: 0.55,
        walkawayCallBackChance: 0.40
    },
    generous: {
        baseReduction: 0.060,
        empathyBoost: 0.045,
        logicBoost: 0.055,
        commitmentBoost: 0.090,
        targetRange: [14, 26],
        targetCedeBase: 3.6,
        skepticismPenalty: 0.45,
        walkawayCallBackChance: 0.55
    }
};

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const createInitialState = (productId) => {
    const fallbackProduct = PRODUCTS[Object.keys(PRODUCTS)[0]];
    const product = PRODUCTS[productId] || fallbackProduct;
    const strategyKeys = Object.keys(SELLER_STRATEGIES);
    // Weighted pick to keep gameplay varied (stingy appears slightly more often)
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
        strategy
    };
};

export const handleWalkAway = (currentState) => {
    const { currentOffer, minPrice, strategy, targetProfitMargin } = currentState;
    const strategyKey = (strategy && SELLER_STRATEGIES[strategy]) ? strategy : 'balanced';
    const cfg = SELLER_STRATEGIES[strategyKey] || SELLER_STRATEGIES.balanced;
    const productName = (PRODUCTS[currentState.productId] && PRODUCTS[currentState.productId].name) ? PRODUCTS[currentState.productId].name : 'this item';

    const canDropMore = currentOffer > minPrice + (minPrice * 0.05);
    const closeness = 1 - (currentOffer - minPrice) / Math.max(1, currentOffer - minPrice + (minPrice * 0.05));

    // More likely to call back when seller is already close to giving up.
    const willCallBack = Math.random() < (cfg.walkawayCallBackChance + closeness * 0.15) && canDropMore;

    if (willCallBack) {
        const desperateOffer = Math.max(currentOffer * 0.9, minPrice + 10);
        return {
            success: true,
            message: `Arre ruko ruko! Kidhar jaa rahe ho bhai? ${productName} ke liye aakhri offer: ₹${Math.round(desperateOffer)}. Isse kam bolega toh main bhi “loss” ka role-play karunga!`,
            newState: {
                ...currentState,
                currentOffer: Math.round(desperateOffer),
                mood: SELLER_MOODS.DESPERATE,
                patience: Math.min(25, currentState.patience),
                targetProfitMargin: Math.max(0, (typeof targetProfitMargin === 'number' ? targetProfitMargin : 25) - cfg.targetCedeBase)
            }
        };
    }

    return {
        success: false,
        message: pick([
          `Theek hai bhai, mat lo. ${productName} me tumne itna lowball kiya ki seller ka pride bhi checkout ho gaya.`,
          "Deal ka mood nahi tha bhai. Aise rate pe toh main khud bhi bargain kar raha hota. Ram Ram!",
          "Thik thik… aap negotiate kar rahe the, main “no” bol raha tha. Next round yaagaa!"
        ]),
        newState: {
            ...currentState,
            isWalkedAway: true,
            patience: 0,
            mood: SELLER_MOODS.ANNOYED
        }
    };
};

export const calculateSellerResponse = (userOffer, userMessage, currentState) => {
  let { currentOffer, minPrice, patience, rounds, mood, history, targetProfitMargin, strategy, msrp } = currentState;
  const offerValue = parseFloat(userOffer);
  const messageLower = (userMessage || '').toLowerCase();

  if (isNaN(offerValue)) {
    return { message: "Bhaiya number bolo number, ye ABC ka dukaan nahi hai.", newState: currentState };
  }

  const strategyKey = (strategy && SELLER_STRATEGIES[strategy]) ? strategy : 'balanced';
  const cfg = SELLER_STRATEGIES[strategyKey] || SELLER_STRATEGIES.balanced;
  const productName = (PRODUCTS[currentState.productId] && PRODUCTS[currentState.productId].name) ? PRODUCTS[currentState.productId].name : 'this item';

  const safeMsrp = typeof msrp === 'number' ? msrp : currentState.msrp;
  const profitDen = Math.max(1, (safeMsrp - minPrice));
  const profitPct = (price) => ((price - minPrice) / profitDen) * 100;

  const safeTarget = (typeof targetProfitMargin === 'number') ? targetProfitMargin : cfg.targetRange[0];
  let nextTargetProfitMargin = safeTarget;

  const hasEmpathy = messageLower.includes("student") || messageLower.includes("broke") || messageLower.includes("please") || messageLower.includes("gareeb");
  const hasLogic = messageLower.includes("market") || messageLower.includes("competitor") || messageLower.includes("review") || messageLower.includes("sasta");
  const hasCommitment = messageLower.includes("cash") || messageLower.includes("now") || messageLower.includes("abhi") || messageLower.includes("done");

  let tactic = 'mixed';
  if (hasCommitment && !hasEmpathy && !hasLogic) tactic = 'commitment';
  else if (hasLogic && !hasEmpathy && !hasCommitment) tactic = 'logic';
  else if (hasEmpathy && !hasLogic && !hasCommitment) tactic = 'empathy';
  else if (hasEmpathy || hasLogic || hasCommitment) tactic = 'mixed';

  const historyArr = Array.isArray(history) ? history : [];
  const lastTactic = historyArr.length ? historyArr[historyArr.length - 1].tactic : null;

  // If user offer is already at/above seller ask, accept immediately.
  if (offerValue >= currentOffer) {
    const profitMargin = profitPct(offerValue);
    return {
      message: pick([
        `Arre wah! ${productName} ka deal ₹${Math.round(offerValue)} pe seal ho gaya. Chai peeyoge?`,
        `Final call accepted! ${productName} ₹${Math.round(offerValue)} ka done.`,
        `Sahi negotiation! ${productName} at ₹${Math.round(offerValue)}. Receipt leke jao!`
      ]),
      isDeal: true,
      finalPrice: offerValue,
      newState: {
        ...currentState,
        isDealDone: true,
        currentOffer: Math.round(offerValue),
        mood: SELLER_MOODS.DESPERATE,
        profitMargin,
        targetProfitMargin: Math.max(0, nextTargetProfitMargin - cfg.targetCedeBase)
      }
    };
  }

  const isFirstOffer = rounds === 0;
  const priceGap = currentOffer - offerValue; // positive when user is under ask
  const dropPercentage = priceGap / Math.max(1, currentOffer);

  let nextMood = mood;
  let sellerMessage = "";
  let nextOffer = currentOffer;
  let nextPatience = patience - (8 + rounds * 2);

  if (offerValue < minPrice * 0.7) {
    // Extreme lowball: seller becomes stubborn + loses patience faster.
    nextMood = SELLER_MOODS.ANNOYED;
    nextPatience -= 20;
    nextOffer = currentOffer * 0.98;
    nextTargetProfitMargin = Math.min(95, safeTarget + 4);
    sellerMessage = pick([
      `Bhai ${productName} ko ₹${Math.round(offerValue)} pe toh main cover/packing bhi nahi kar paunga. Dhang ka offer do varna niklo!`,
      `Ye offer itna low hai ki minPrice ka GPS bhi confuse ho jayega. ₹${Math.round(minPrice)} ke aas-paas ${productName} pe socho.`,
      `Aap toh deal nahi, donation mode chala rahe ho ${productName} ke liye. Seller pride wapas laayein phir boliye.`
    ]);
  } 
  else if (offerValue < minPrice) {
    // Below minimum but not totally insulting: seller counters and may soften slightly.
    nextPatience -= 5;
    nextOffer = Math.max(currentOffer * 0.95, minPrice + (minPrice * 0.05));
    nextTargetProfitMargin = Math.max(0, safeTarget - (hasEmpathy ? cfg.targetCedeBase * 0.9 : cfg.targetCedeBase * 0.4));
    if (hasEmpathy) {
      sellerMessage = pick([
        "Dekho bhai, rona-dhona mat karo… main counter karta hoon, par aise nahi chalega.",
        "Sympathy samajh aati hai, but deal me maths chalti hai. ₹" + Math.round(minPrice) + " ke aas-paas " + productName + " pe aao."
      ]);
    } else {
      sellerMessage = pick([
        "Factory ka rate usse zyada hai bhai. ₹" + Math.round(minPrice) + " se niche nahi ja sakta.",
        "Aise low offer pe main auto-deny kar deta hoon. " + productName + " ko convince karna hai to empathy/logic/urgency se koshish karo."
      ]);
    }
  }
  else {
    // Core negotiation step.
    let reduction = cfg.baseReduction;

    if (hasEmpathy) {
      reduction += cfg.empathyBoost;
      nextMood = SELLER_MOODS.GENEROUS;
    }
    if (hasLogic) {
      reduction += cfg.logicBoost;
      nextMood = SELLER_MOODS.FIRM;
    }
    if (hasCommitment) {
      reduction += cfg.commitmentBoost;
      nextMood = SELLER_MOODS.DESPERATE;
      nextPatience += 5;
    }

    // First-offer shock makes seller less likely to concede.
    if (isFirstOffer && dropPercentage > 0.4) {
      reduction *= 0.45;
      nextMood = SELLER_MOODS.ANNOYED;
      sellerMessage = pick([
        "Pehli baar market aaye ho kya? Seedha itna discount! Thoda insaaf karo mere saath " + productName + " ke liye.",
        "Boss, first round me hi itna low? Main bargaining difficulty dekh ke reject karta hoon " + productName + "."
      ]);
    }

    // Hidden constraint: target profit controls resistance.
    const profitAfter = profitPct(offerValue);
    if (profitAfter < safeTarget) {
      const shortfall = (safeTarget - profitAfter) / Math.max(1, safeTarget);
      reduction *= (1 - cfg.skepticismPenalty * Math.min(1, shortfall));
    }

    // Timing proxy: later rounds make concessions more likely.
    const roundBoost = 1 + Math.min(0.35, rounds * 0.06);
    reduction *= roundBoost;

    nextOffer = Math.max(currentOffer - (priceGap * reduction), minPrice);

    // Update hidden target profit (seller becomes more willing over time).
    const offerCede = Math.max(0, (currentOffer - offerValue) / Math.max(1, currentOffer - minPrice));
    const tacticMatch = (hasCommitment ? 1 : 0) + (hasLogic ? 0.7 : 0) + (hasEmpathy ? 0.5 : 0);
    let delta = cfg.targetCedeBase * offerCede * (0.8 + tacticMatch * 0.25);
    if (tacticMatch === 0) delta *= 0.45;
    if (lastTactic && lastTactic === tactic && tactic !== 'mixed') delta *= 0.75;

    nextTargetProfitMargin = Math.max(0, safeTarget - delta);

    const epsilon = Math.max(10, minPrice * 0.01);
    if (offerValue >= nextOffer - epsilon) {
      const profitMargin = profitPct(offerValue);
      return {
        message: pick([
          `Arre wah! Final offer accepted at ₹${Math.round(offerValue)}.`,
          `Smart move! ₹${Math.round(offerValue)} pe deal seal ho gayi.`,
          `Okay okay… surrender accepted! ₹${Math.round(offerValue)}.`
        ]),
        isDeal: true,
        finalPrice: offerValue,
        newState: {
          ...currentState,
          isDealDone: true,
          currentOffer: Math.round(offerValue),
          mood: SELLER_MOODS.DESPERATE,
          profitMargin,
          targetProfitMargin: nextTargetProfitMargin
        }
      };
    }

    if (!sellerMessage) {
      if (nextMood === SELLER_MOODS.GENEROUS) sellerMessage = pick([
        `Tum ache insaan lag rahe ho. Chalo ₹${Math.round(nextOffer)} de dena tumhaare liye.`,
        `Deal vibes aa rahi hain… ₹${Math.round(nextOffer)} final-ish?`
      ]);
      else if (nextMood === SELLER_MOODS.ANNOYED) sellerMessage = pick([
        `Dimag kharab mat karo. Mera aakhri price ₹${Math.round(nextOffer)} hai. Lena hai toh lo.`,
        `Bas. ₹${Math.round(nextOffer)} pe close karo warna main “done” bol dunga.`
      ]);
      else sellerMessage = pick([
        `Nahi yaar, isme purta nahi padega. How about ₹${Math.round(nextOffer)}?`,
        `Close-to-close! ₹${Math.round(nextOffer)} try karo.`
      ]);
    }
  }

  if (nextPatience <= 0) {
    return {
      message: pick([
        `Hatt! Subah-subah dimag chatne aa gaye. ${productName} bechna band. Jao yahan se!`,
        `Patience 0. Aapka offer itna low ke “seller morale” bhi down ho gaya for ${productName}.`,
        `Main bech nahi raha. ${productName} ka deal reject ho chuka hai!`
      ]),
      isWalkAway: true,
      newState: {
        ...currentState,
        isWalkedAway: true,
        patience: 0,
        mood: SELLER_MOODS.ANNOYED,
        targetProfitMargin: Math.max(0, safeTarget - cfg.targetCedeBase * 0.35)
      }
    };
  }

  return {
    message: sellerMessage,
    newState: {
      ...currentState,
      currentOffer: Math.round(nextOffer),
      patience: Math.min(nextPatience, 100),
      rounds: rounds + 1,
      mood: nextMood,
      history: [...historyArr, { offer: offerValue, mood: nextMood, tactic }],
      profitMargin: profitPct(nextOffer),
      targetProfitMargin: nextTargetProfitMargin
    }
  };
};
