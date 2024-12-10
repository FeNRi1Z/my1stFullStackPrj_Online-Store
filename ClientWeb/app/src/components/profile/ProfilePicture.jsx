import React from 'react';
import { User } from 'lucide-react';
import { Image } from 'antd';
import config from '../../config';
import '../../styles/HoverProductIMG.css'

/**
 * ProfilePicture Component
 * Displays user profile picture with edit functionality
 * 
 * @param {Object} props
 * @param {string} props.profile - URL or identifier for user's profile image
 * @param {boolean} props.isEditing - Flag to enable edit mode
 * @param {boolean} props.isChangeImg - Flag to show image upload input
 * @param {Function} props.setIsChangeImg - Function to toggle image change mode
 * @param {Function} props.handleImageChange - Handler for image file selection
 * 
 * @returns {React.Component} Profile picture component with edit capabilities
 */

export const ProfilePicture = ({ profile, isEditing, isChangeImg, setIsChangeImg, handleImageChange }) => (
  <div className="flex justify-center">
    {!isChangeImg ? (
      <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center overflow-hidden">
        {profile && profile !== "noIMGFile" ? (
          <div className={`w-full h-full ${isEditing ? 'containerIMG' : ''}`} onClick={() => { if (isEditing) setIsChangeImg(true) }}>
            {/* Profile image */}
            <Image
              src={`${config.apiPath}/uploads/user_img/${profile}`}
              className="img-circle elevation-2"
              preview={false}
            />
            {isEditing && (
              <div className="middle textIMG rounded-full w-fit h-fit">
                <div>Click to Change</div>
              </div>
            )}
          </div>
        ) : (
          // If no profile picture
          <div className={isEditing ? 'containerIMG' : ''} onClick={() => { if (isEditing) setIsChangeImg(true) }}>
            <User className="w-12 h-12 sm:w-14 sm:h-14 text-gray-400 dark:text-gray-300" />
            {/* Edit overlay shown when in edit mode */}
            {isEditing && (
              <div className="middle textIMG rounded-full w-fit h-fit">
                <div>Click to Change</div>
              </div>
            )}
          </div>
        )}
      </div>
    ) : (
      <div>
        <label className="block text-sm text-gray-500 dark:text-gray-300">
          Select profile image
        </label>
        <input
          type="file"
          className="block w-full px-3 py-2 mt-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg"
          onChange={handleImageChange}
        />
      </div>
    )}
  </div>
);

export default ProfilePicture;