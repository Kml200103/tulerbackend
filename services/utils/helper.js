export const applyOffer = (totalPrice, offer) => {
    if (!offer) return totalPrice; // No discount applied

    let discountedPrice = totalPrice;

    if (offer.type === "percentage") {
        discountedPrice = totalPrice - (totalPrice * offer.value / 100);
    } else if (offer.type === "fixed") {
        discountedPrice = totalPrice - offer.value;
    }

    return discountedPrice > 0 ? discountedPrice : 0; // Ensure the price never goes negative
};