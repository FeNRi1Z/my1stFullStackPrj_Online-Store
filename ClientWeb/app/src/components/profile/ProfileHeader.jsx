import React from 'react';
import { ArrowLeft, Save, X, Edit2, LogOut } from 'lucide-react';

export const ProfileHeader = ({ isEditing, handleBack, handleEdit, handleSave, handleCancel, logout }) => (
  <div className="p-6 border-b border-gray-200 dark:border-none">
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="order-last sm:order-first">
          <h1 className="text-xl font-bold text-text-dark dark:text-text-light text-center sm:text-left">
            Profile Information
          </h1>
        </div>

        <div className="flex items-center justify-end gap-2 order-first sm:order-last">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-400 text-white rounded-md 
              hover:bg-gray-500 active:bg-gray-600 
              focus:outline-none transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-md 
                  hover:bg-blue-700 active:bg-blue-800 
                  focus:outline-none transition-colors text-sm"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-500 text-white rounded-md 
                  hover:bg-gray-600 active:bg-gray-700 
                  focus:outline-none transition-colors text-sm"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-md 
                  hover:bg-blue-700 active:bg-blue-800 
                  focus:outline-none transition-colors text-sm"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-3 py-1.5 bg-primary-100 text-white rounded-md 
                  hover:bg-primary-hover active:bg-primary-active 
                  focus:outline-none transition-colors text-sm"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  </div>
);