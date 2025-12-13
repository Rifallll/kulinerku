"use client";

export const translateFoodType = (type: string): string => {
  const lowerCaseType = type.toLowerCase();
  if (lowerCaseType.includes("drink") || lowerCaseType === "minuman") {
    return "Minuman";
  }
  if (lowerCaseType.includes("food") || lowerCaseType.includes("dish") || lowerCaseType.includes("meal") || lowerCaseType === "makanan") {
    return "Makanan";
  }
  if (lowerCaseType.includes("meat") || lowerCaseType.includes("daging")) {
    return "Hidangan Daging";
  }
  if (lowerCaseType.includes("fish") || lowerCaseType.includes("ikan")) {
    return "Hidangan Ikan";
  }
  if (lowerCaseType.includes("chicken") || lowerCaseType.includes("ayam")) {
    return "Hidangan Ayam";
  }
  if (lowerCaseType.includes("soup") || lowerCaseType.includes("stew") || lowerCaseType.includes("sup") || lowerCaseType.includes("rebusan")) {
    return "Sup/Rebusan";
  }
  if (lowerCaseType.includes("snack") || lowerCaseType.includes("camilan")) {
    return "Camilan";
  }
  if (lowerCaseType.includes("rice") || lowerCaseType.includes("nasi")) {
    return "Nasi";
  }
  if (lowerCaseType.includes("salad")) {
    return "Salad";
  }
  if (lowerCaseType.includes("sauce") || lowerCaseType.includes("saus")) {
    return "Saus";
  }
  if (lowerCaseType.includes("traditional cake") || lowerCaseType.includes("kue tradisional")) {
    return "Kue Tradisional";
  }
  if (lowerCaseType.includes("nangka")) {
    return "Hidangan Nangka";
  }
  if (lowerCaseType.includes("pokok")) {
    return "Hidangan Pokok";
  }
  // Return original if no specific translation found
  return type;
};