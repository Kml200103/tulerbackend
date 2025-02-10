import Address from "../modals/addressModal.js"

const createOrUpdateAddress = async (req, res) => {
    try {
        const { userId } = req.params;
        const { _id, name, city, state, country, pincode, addressType } = req.body;

        if (!name || !city || !state || !country || !pincode || !addressType) {
            return res.status(400).json({ message: "All Fields are required" });
        }

        if (_id) {

            const updatedAddress = await Address.findByIdAndUpdate(
                _id,
                { userId, name, city, state, country, pincode, addressType },
                { new: true, runValidators: true }
            );

            if (!updatedAddress) {
                return res.status(404).json({ message: "Address not found" });
            }

            return res.status(200).json({ success: true, message: "Address updated successfully", updatedAddress });
        } else {

            const newAddress = new Address({ userId, name, city, state, country, pincode, addressType });
            await newAddress.save();
            return res.status(201).json({ success: true, message: "Address added successfully", newAddress });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const getAllAddressForUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const allAddress = await Address.find({ userId: userId });

        if (!allAddress.length) {
            return res.status(404).json({ success: false, message: "No addresses found" });
        }

        return res.status(200).json({ success: true, addresses: allAddress });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }

}

const deleteAddress = async (req, res) => {
    try {
        const { addressId } = req.params

        if (!addressId) {
            return res.status(400).json({ message: "id not present" })
        }

        const address = await Address.findByIdAndDelete({ _id: addressId })
        if (!address) {
            return res.status(400).json({ message: "Address is not present with Id" })
        }
        else {
            return res.status(200).json({ message: "Address deleted Successfully" })
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }

}


export { createOrUpdateAddress, getAllAddressForUser, deleteAddress }