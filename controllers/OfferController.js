import Offer from "../modals/offerModal.js";
import { applyOffer } from "../services/utils/helper.js";

// Add multiple offers
const addOffers = async (req, res) => {
    try {
        const wheelData = [
            { option: "10% OFF", type: "percentage", value: 10 },
            { option: "₹50 OFF", type: "fixed", value: 50 },
            { option: "20% OFF", type: "percentage", value: 20 },
            { option: "₹100 OFF", type: "fixed", value: 100 },
            { option: "15% OFF", type: "percentage", value: 15 },
            { option: "₹25 OFF", type: "fixed", value: 25 },
            { option: "5% OFF", type: "percentage", value: 5 },
            { option: "₹75 OFF", type: "fixed", value: 75 }
        ];

        const offers = await Offer.insertMany(wheelData);
        res.status(201).json({ message: "Offers added successfully", offers });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Add a single offer
const addOffer = async (req, res) => {
    try {
        const { option, type, value } = req.body;

        if (!option || !type || !value) {
            return res.status(400).json({ message: "Offer option, type, and value are required" });
        }

        const newOffer = new Offer({ option, type, value });
        await newOffer.save();
        res.status(201).json({ message: "Offer added successfully", offer: newOffer });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all offers
const getOffers = async (req, res) => {
    try {
        const offers = await Offer.find();
        res.status(200).json({ offers });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Edit an offer
const updateOffer = async (req, res) => {
    try {
        const { offerId } = req.params;
        const { option, type, value } = req.body;

        if (!option || !type || !value) {
            return res.status(400).json({ message: "Offer option, type, and value are required" });
        }

        const updatedOffer = await Offer.findByIdAndUpdate(
            offerId,
            { option, type, value },
            { new: true }
        );

        if (!updatedOffer) {
            return res.status(404).json({ message: "Offer not found" });
        }

        res.status(200).json({ message: "Offer updated successfully", offer: updatedOffer });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete an offer
const deleteOffer = async (req, res) => {
    try {
        const { offerId } = req.params;

        const deletedOffer = await Offer.findByIdAndDelete(offerId);
        if (!deletedOffer) {
            return res.status(404).json({ message: "Offer not found" });
        }

        res.status(200).json({ message: "Offer deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Apply discount
const applyDiscount = async (req, res) => {
    try {
        const { totalPrice, offerId } = req.body;

        if (!totalPrice || !offerId) {
            return res.status(400).json({ message: "Total price and offer ID are required" });
        }

        const offer = await Offer.findById(offerId);
        if (!offer) {
            return res.status(404).json({ success:false,message: "Offer not found" });
        }

        const discountedPrice = applyOffer(totalPrice, offer);
        res.status(200).json({ success:true,originalPrice: totalPrice, discountedPrice });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export { addOffer, addOffers, getOffers, updateOffer, deleteOffer, applyDiscount };
