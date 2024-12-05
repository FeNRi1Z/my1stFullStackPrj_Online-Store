import React from 'react';
import { User } from 'lucide-react';
import { Image } from 'antd';
import config from '../../config';
import '../../styles/HoverProductIMG.css'

export const ProfilePicture = ({ profile, isEditing, isChangeImg, setIsChangeImg, handleImageChange }) => (
  <div className="flex justify-center">
    {!isChangeImg ? (
      <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
        {profile && profile !== "noIMGFile" ? (
          <div className={isEditing ? 'containerIMG' : ''} onClick={() => {if(isEditing) setIsChangeImg(true)}}>
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
          <div className={isEditing ? 'containerIMG' : ''} onClick={() => {if(isEditing) setIsChangeImg(true)}}>
            <User className="w-12 h-12 sm:w-14 sm:h-14 text-gray-400 dark:text-gray-300" />
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