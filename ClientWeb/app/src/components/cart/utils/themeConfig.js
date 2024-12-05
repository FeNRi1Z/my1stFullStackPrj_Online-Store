import { theme as antdTheme } from "antd";

/**
 * Theme color constants
 */
export const THEME_COLORS = {
  PRIMARY: '#EA9029',
  PRIMARY_HOVER: '#D68324',
  PRIMARY_ACTIVE: '#D68324',
  
  LIGHT: {
    BACKGROUND: '#F5F5F5',
    TEXT: '#2D3142',
    CARD_BG: '#FFFFFF',
    TABLE_BORDER: '#E8E8E8',
    TABLE_HEADER: '#FAFAFA',
    HOVER_BG: '#F0F0F0',
    BORDER: '#E8E8E8',
    TEXT_SECONDARY: '#6B7280',
    DISABLED: '#9CA3AF'
  },
  
  DARK: {
    BACKGROUND: '#2B2B2B',
    TEXT: '#F5F5F5',
    CARD_BG: '#3D3D3D',
    TABLE_BORDER: '#4A4A4A',
    TABLE_HEADER: '#333333',
    HOVER_BG: '#404040',
    BORDER: '#4A4A4A',
    TEXT_SECONDARY: '#9CA3AF',
    DISABLED: '#6B7280'
  }
};

/**
 * Get theme styles based on current theme mode
 * @param {string} theme - 'light' or 'dark'
 * @returns {Object} Theme styles object
 */
export const getThemeStyles = (theme) => {
  const colors = theme === 'dark' ? THEME_COLORS.DARK : THEME_COLORS.LIGHT;
  
  return {
    background: colors.BACKGROUND,
    text: colors.TEXT,
    cardBg: colors.CARD_BG,
    tableBorder: colors.TABLE_BORDER,
    tableHeader: colors.TABLE_HEADER,
    hoverBg: colors.HOVER_BG,
    border: colors.BORDER,
    textSecondary: colors.TEXT_SECONDARY,
    disabled: colors.DISABLED
  };
};

/**
 * Get complete Ant Design theme configuration
 * @param {string} theme - 'light' or 'dark'
 * @returns {Object} Complete theme configuration for Ant Design
 */
export const getThemeConfig = (theme) => {
  const themeStyles = getThemeStyles(theme);
  const isDark = theme === 'dark';

  return {
    algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    token: {
      // Colors
      colorPrimary: THEME_COLORS.PRIMARY,
      colorPrimaryHover: THEME_COLORS.PRIMARY_HOVER,
      colorPrimaryActive: THEME_COLORS.PRIMARY_ACTIVE,
      colorBgContainer: themeStyles.cardBg,
      colorText: themeStyles.text,
      colorBorder: themeStyles.tableBorder,
      colorBgElevated: themeStyles.cardBg,
      
      // Interactive states
      controlItemBgHover: themeStyles.hoverBg,
      colorIcon: themeStyles.text,
      colorIconHover: THEME_COLORS.PRIMARY,
      colorPrimaryBorder: THEME_COLORS.PRIMARY,
      colorPrimaryBorderHover: THEME_COLORS.PRIMARY_HOVER,
      colorBorderHover: THEME_COLORS.PRIMARY,
      colorPrimaryText: THEME_COLORS.PRIMARY,
      colorPrimaryTextHover: THEME_COLORS.PRIMARY_HOVER,
      
      // Other tokens
      borderRadius: 8,
      controlOutlineWidth: 2,
      controlOutline: `${THEME_COLORS.PRIMARY}20`,
      
      // Typography
      fontSize: 14,
      fontSizeSM: 12,
      fontSizeLG: 16,
      fontWeightStrong: 600
    },
    
    components: {
      Table: {
        headerBg: themeStyles.tableHeader,
        headerColor: themeStyles.text,
        headerSortHoverBg: themeStyles.hoverBg,
        headerSortActiveBg: themeStyles.hoverBg,
        rowHoverBg: themeStyles.hoverBg,
        cellPaddingBlock: 16,
        cellPaddingInline: 16,
        borderColor: themeStyles.tableBorder,
        headerBorderRadius: 8,
        fontWeightStrong: 600,
        rowSelectedBg: `${THEME_COLORS.PRIMARY}10`,
        rowSelectedHoverBg: `${THEME_COLORS.PRIMARY}20`
      },
      
      Button: {
        primaryColor: THEME_COLORS.PRIMARY,
        defaultBg: themeStyles.cardBg,
        defaultColor: themeStyles.text,
        defaultBorderColor: themeStyles.border,
        defaultHoverBg: themeStyles.hoverBg,
        defaultHoverBorderColor: THEME_COLORS.PRIMARY,
        defaultHoverColor: THEME_COLORS.PRIMARY,
        borderRadius: 8,
        controlHeight: 40,
        paddingContentHorizontal: 24,
        fontWeight: 500
      },
      
      Input: {
        activeBorderColor: THEME_COLORS.PRIMARY,
        hoverBorderColor: THEME_COLORS.PRIMARY,
        activeShadow: `0 0 0 2px ${THEME_COLORS.PRIMARY}20`,
        borderRadius: 8,
        controlHeight: 40,
        paddingInline: 16,
        colorBgContainer: themeStyles.cardBg,
        colorBorder: themeStyles.border,
        colorText: themeStyles.text,
        colorTextPlaceholder: themeStyles.textSecondary
      },
      
      Modal: {
        contentBg: themeStyles.cardBg,
        headerBg: themeStyles.cardBg,
        footerBg: themeStyles.cardBg,
        titleColor: themeStyles.text,
        borderRadius: 12,
        paddingMD: 24,
        boxShadow: isDark 
          ? '0 25px 50px -12px rgba(0, 0, 0, 0.4)'
          : '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      },
      
      Spin: {
        colorPrimary: THEME_COLORS.PRIMARY,
        dotSizeLG: 40,
        dotSizeSM: 20
      },
      
      Tooltip: {
        colorBgDefault: themeStyles.cardBg,
        colorTextLightSolid: themeStyles.text,
        borderRadius: 8,
        paddingXS: 8,
        paddingSM: 12
      }
    }
  };
};

/**
 * Get animation configurations
 */
export const getAnimationConfig = () => ({
  transition: {
    duration: 300,
    ease: 'cubic-bezier(0.4, 0, 0.2, 1)'
  },
  variants: {
    enter: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: 'easeOut'
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 16,
      transition: {
        duration: 0.2,
        ease: 'easeIn'
      }
    }
  }
});

/**
 * Helper function to get responsive styles based on window width
 * @param {number} windowWidth - Current window width
 * @returns {Object} Responsive styles object
 */
export const getResponsiveStyles = (windowWidth) => ({
  padding: windowWidth < 640 ? 8 : 16,
  fontSize: windowWidth < 640 ? 14 : 16,
  tableCellPadding: windowWidth < 640 ? 8 : 16,
  imageSize: windowWidth < 640 ? 
    { width: 48, height: 64 } : 
    { width: 64, height: 96 }
});