export const PRODUCTS = {
    'smartphone': { id: 'smartphone', name: 'Electric Scooter', msrp: 22000, minPrice: 14500 },
    'leather-jacket': { id: 'leather-jacket', name: 'Smartwatch', msrp: 7000, minPrice: 4200 },
    'vegetables': { id: 'vegetables', name: 'Gaming Headset', msrp: 2500, minPrice: 1500 },
    'sofa': { id: 'sofa', name: 'Ergonomic Office Desk', msrp: 18000, minPrice: 12000 }
};

export const SELLER_MOODS = {
    PROFESSIONAL: "Professional",
    GENEROUS: "Generous",
    ANNOYED: "Annoyed",
    DESPERATE: "Desperate",
    FIRM: "Firm"
};

export const createInitialState = (productId) => {
    const product = PRODUCTS[productId] || PRODUCTS['smartphone'];
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
        profitMargin: 100
    };
};

export const handleWalkAway = (currentState) => {
    const { currentOffer, minPrice } = currentState;
    const canDropMore = currentOffer > minPrice + (minPrice * 0.05);
    
    const willCallBack = Math.random() < 0.4 && canDropMore;
    
    if (willCallBack) {
        const desperateOffer = Math.max(currentOffer * 0.9, minPrice + 10);
        return {
            success: true,
            message: `Arre ruko ruko! Kidhar ja rahe ho bhai? Acha chalo, aakhri offer, ₹${Math.round(desperateOffer)}. Isse kam mein toh mera ghar bik jayega!`,
            newState: {
                ...currentState,
                currentOffer: Math.round(desperateOffer),
                mood: SELLER_MOODS.DESPERATE,
                patience: 20
            }
        };
    }
    
    return {
        success: false,
        message: "Theek hai bhai, mat lo. Waise bhi is item ki market me bohot demand hai. Ram Ram!",
        newState: {
            ...currentState,
            isWalkedAway: true,
            patience: 0
        }
    };
};

export const calculateSellerResponse = (userOffer, userMessage, currentState) => {
  let { currentOffer, minPrice, patience, rounds, mood, history } = currentState;
  const offerValue = parseFloat(userOffer);
  const messageLower = userMessage.toLowerCase();
  
  if (isNaN(offerValue)) return { message: "Bhaiya number bolo number, ye ABC ka dukaan nahi hai.", newState: currentState };

  const isFirstOffer = rounds === 0;
  const priceGap = currentOffer - offerValue;
  const dropPercentage = (currentOffer - offerValue) / currentOffer;

  let nextMood = mood;
  let sellerMessage = "";
  let nextOffer = currentOffer;
  let nextPatience = patience - (8 + rounds * 2);

  const hasEmpathy = messageLower.includes("student") || messageLower.includes("broke") || messageLower.includes("please") || messageLower.includes("gareeb");
  const hasLogic = messageLower.includes("market") || messageLower.includes("competitor") || messageLower.includes("review") || messageLower.includes("sasta");
  const hasCommitment = messageLower.includes("cash") || messageLower.includes("now") || messageLower.includes("abhi") || messageLower.includes("done");

  if (offerValue < minPrice * 0.7) {
    nextMood = SELLER_MOODS.ANNOYED;
    nextPatience -= 20;
    sellerMessage = "Kya majak kar rahe ho? Itne mein toh iska cover bhi na aaye. Dhang ka offer do varna niklo.";
  } 
  else if (offerValue < minPrice) {
    nextPatience -= 5;
    if (hasEmpathy) {
      sellerMessage = `Dekho bhai, rona dhona mat karo. ₹${minPrice} mera aakhri rate hai, uske neeche main nanga ho jaunga.`;
    } else {
      sellerMessage = "Bhai, factory ka rate usse zyada hai! Main kya apni jeb se paise bharu?";
    }
    nextOffer = Math.max(currentOffer * 0.95, minPrice + (minPrice * 0.05));
  }
  else {
    let reduction = 0.05; 

    if (hasEmpathy) {
        reduction += 0.04;
        nextMood = SELLER_MOODS.GENEROUS;
    }
    if (hasLogic) {
        reduction += 0.06;
        nextMood = SELLER_MOODS.FIRM;
    }
    if (hasCommitment) {
        reduction += 0.09;
        nextMood = SELLER_MOODS.DESPERATE;
        nextPatience += 5; 
    }

    if (isFirstOffer && dropPercentage > 0.4) {
        reduction = 0.02; 
        nextMood = SELLER_MOODS.ANNOYED;
        sellerMessage = "Pehli baar market aaye ho kya? Seedha itna discount! Thoda insaaf karo mere saath.";
    }

    nextOffer = Math.max(currentOffer - (priceGap * reduction), minPrice);
    
    if (offerValue >= nextOffer - (minPrice * 0.01)) {
      return { 
        message: `Arre wah, tum toh bade he smart nikle! Deal done at ₹${offerValue}. Chai peeyoge?`, 
        isDeal: true, 
        finalPrice: offerValue,
        newState: { 
            ...currentState, 
            isDealDone: true, 
            currentOffer: offerValue, 
            mood: SELLER_MOODS.DESPERATE,
            profitMargin: ((offerValue - minPrice) / (currentState.msrp - minPrice)) * 100
        } 
      };
    }

    if (!sellerMessage) {
        if (nextMood === SELLER_MOODS.GENEROUS) sellerMessage = `Tum ache insaan lag rahe ho. Chalo ₹${Math.round(nextOffer)} de dena tumhaare liye.`;
        else if (nextMood === SELLER_MOODS.ANNOYED) sellerMessage = `Dimag kharab mat karo. Mera aakhri price ₹${Math.round(nextOffer)} hai. Lena hai toh lo.`;
        else sellerMessage = `Nahi yaar, isme purta nahi padega. How about ₹${Math.round(nextOffer)}?`;
    }
  }

  if (nextPatience <= 0) {
    return { 
        message: "Hatt! Subah subah dimag chatne aa gaye. Nahi bechna mujhe kuch. Jao yahan se!", 
        isWalkAway: true, 
        newState: { ...currentState, isWalkedAway: true, patience: 0, mood: SELLER_MOODS.ANNOYED } 
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
      history: [...history, { offer: offerValue, mood: nextMood }],
      profitMargin: ((nextOffer - minPrice) / (currentState.msrp - minPrice)) * 100
    }
  };
};
