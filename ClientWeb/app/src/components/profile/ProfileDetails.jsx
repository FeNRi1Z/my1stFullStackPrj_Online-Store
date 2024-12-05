import React from 'react';
import { User, MapPin, Phone } from 'lucide-react';

const ProfileField = ({ icon: Icon, label, value, isEditing, onChange, readOnly }) => (
  <div className="flex items-start gap-3">
    <Icon className="w-5 h-5 mt-0.5 flex-shrink-0 text-text-dark dark:text-text-light" />
    <div className="flex-1">
      <p className="text-sm text-gray-500">{label}</p>
      {isEditing && !readOnly ? (
        label === "Address" ? (
          <textarea
            value={value}
            onChange={onChange}
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600
              dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-100
              text-sm"
            rows="3"
          />
        ) : (
          <input
            type="text"
            value={value}
            maxLength={label === "Phone" ? 10 : undefined}
            onChange={onChange}
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600
              dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-100
              text-sm"
          />
        )
      ) : (
        <p className="font-medium text-text-dark dark:text-text-light">
          {value || "Not provided"}
        </p>
      )}
    </div>
  </div>
);

export const ProfileDetails = ({ isEditing, profileData, editForm, setEditForm }) => (
  <div className="space-y-4">
    <ProfileField
      icon={User}
      label="Name"
      value={profileData?.name}
      readOnly
    />
    
    <ProfileField
      icon={MapPin}
      label="Address"
      value={editForm.address}
      isEditing={isEditing}
      onChange={(e) => setEditForm(prev => ({ ...prev, address: e.target.value }))}
    />
    
    <ProfileField
      icon={Phone}
      label="Phone"
      value={editForm.phone}
      isEditing={isEditing}
      onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
    />
  </div>
);

export default ProfileDetails