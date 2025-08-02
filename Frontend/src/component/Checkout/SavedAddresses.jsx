const SavedAddresses = ({
  savedAddresses,
  selectedAddress,
  setSelectedAddress,
  isNewAddress,
  setIsNewAddress,
  setFormErrors,
}) => {
  return (
    <>
      <div className="ch-saved-addresses">
        {savedAddresses.map((address) => (
          <div
            key={address.id}
            className={`ch-address-card ${
              selectedAddress === address.id ? "ch-selected" : ""
            }`}
          >
            <input
              type="radio"
              id={`address-${address.id}`}
              name="address"
              value={address.id}
              checked={selectedAddress === address.id}
              onChange={() => {
                console.log("Selected address ID:", address.id);
                console.log("Selected address data:", address);
                setSelectedAddress(address.id);
                setIsNewAddress(false);
                // Clear any shipping form errors when selecting saved address
                setFormErrors({});
              }}
              className="ch-radio-input"
            />
            <label
              htmlFor={`address-${address.id}`}
              className="ch-address-label"
            >
              <strong className="ch-address-name">
                {address.recipient_name}
              </strong>
              <div className="ch-address-phone">📞 {address.phone}</div>
              <div className="ch-address-text">{address.address}</div>
              <div className="ch-address-city">
                {address.city}, {address.state} {address.pincode}
              </div>
            </label>
          </div>
        ))}
      </div>

      {/* <div className="ch-form-group">
        <div className="ch-new-address-option">
          <input
            type="radio"
            id="new-address"
            name="address"
            value="new"
            checked={isNewAddress}
            onChange={() => {
              console.log("New address selected");
              console.log(
                "New address form activated, clearing selected address"
              );
              console.log(
                "Current saved addresses count:",
                savedAddresses.length
              );
              setIsNewAddress(true);
              setSelectedAddress(null);
            }}
            className="ch-radio-input"
          />
          <label htmlFor="new-address" className="ch-radio-label">
            Add a new address
          </label>
        </div>
      </div> */}
    </>
  );
};

export default SavedAddresses;
