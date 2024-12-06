import { useState, useEffect } from 'react';
import { useAuth } from '../../components/auth/AuthProvider';

export const useContactInfo = () => {
  const [userData, setUserData] = useState({
    address: "",
    phone: "",
  });
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [phoneModalVisible, setPhoneModalVisible] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      setUserData({
        address: user.address || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const modalControls = {
    address: {
      isOpen: addressModalVisible,
      open: () => setAddressModalVisible(true),
      close: () => setAddressModalVisible(false),
      handleChange: () => {
        const address = document.getElementById("addressModal").value;
        setUserData(prev => ({ ...prev, address }));
        setAddressModalVisible(false);
      },
      reset: () => setUserData(prev => ({ ...prev, address: user.address }))
    },
    phone: {
      isOpen: phoneModalVisible,
      open: () => setPhoneModalVisible(true),
      close: () => setPhoneModalVisible(false),
      handleChange: () => {
        const phone = document.getElementById("phoneModal").value;
        setUserData(prev => ({ ...prev, phone }));
        setPhoneModalVisible(false);
      },
      reset: () => setUserData(prev => ({ ...prev, phone: user.phone }))
    }
  };

  return {
    userData,
    paymentMethod,
    setPaymentMethod,
    modalControls
  };
};