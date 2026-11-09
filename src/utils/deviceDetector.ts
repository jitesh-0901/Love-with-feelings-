// Accurate Device & Browser Detector for Ovi ma's Experience
export interface DeviceDetails {
  deviceType: 'Mobile' | 'Tablet' | 'Desktop';
  deviceName: string;
  os: string;
  browser: string;
  screenResolution: string;
  viewportSize: string;
  language: string;
  timezone: string;
  userAgent: string;
}

export const getDeviceDetails = (): DeviceDetails => {
  if (typeof window === 'undefined') {
    return {
      deviceType: 'Desktop',
      deviceName: 'Unknown',
      os: 'Unknown',
      browser: 'Unknown',
      screenResolution: '',
      viewportSize: '',
      language: '',
      timezone: 'Asia/Kolkata',
      userAgent: '',
    };
  }

  const ua = navigator.userAgent || '';
  const screenResolution = `${window.screen.width}x${window.screen.height} (dpr: ${window.devicePixelRatio || 1})`;
  const viewportSize = `${window.innerWidth}x${window.innerHeight}`;
  const language = navigator.language || 'en';
  let timezone = 'Asia/Kolkata';
  try {
    timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata';
  } catch {
    // Fallback
  }

  // Detect OS
  let os = 'Unknown OS';
  if (/iPhone/i.test(ua)) {
    const match = ua.match(/OS (\d+[_\d]*)/);
    os = match ? `iOS ${match[1].replace(/_/g, '.')}` : 'iOS (iPhone)';
  } else if (/iPad/i.test(ua)) {
    os = 'iPadOS';
  } else if (/Android/i.test(ua)) {
    const match = ua.match(/Android\s+([0-9.]+)/i);
    os = match ? `Android ${match[1]}` : 'Android';
  } else if (/Windows NT 10.0/i.test(ua)) {
    os = 'Windows 10/11';
  } else if (/Windows NT/i.test(ua)) {
    os = 'Windows';
  } else if (/Macintosh|Mac OS X/i.test(ua)) {
    os = 'macOS (Mac)';
  } else if (/Linux/i.test(ua)) {
    os = 'Linux';
  }

  // Detect Device Brand / Model
  let deviceType: 'Mobile' | 'Tablet' | 'Desktop' = 'Desktop';
  let deviceName = 'Desktop / Laptop';

  const isMobile = /mobile|iphone|ipod|android.*mobile/i.test(ua);
  const isTablet = /tablet|ipad|android(?!.*mobile)/i.test(ua);

  if (isTablet) {
    deviceType = 'Tablet';
    deviceName = /iPad/i.test(ua) ? 'Apple iPad' : 'Android Tablet';
  } else if (isMobile) {
    deviceType = 'Mobile';
    if (/iPhone/i.test(ua)) {
      deviceName = 'Apple iPhone';
    } else if (/SM-[A-Z0-9]+|Samsung/i.test(ua)) {
      const match = ua.match(/SM-[A-Z0-9]+/i);
      deviceName = match ? `Samsung Galaxy (${match[0]})` : 'Samsung Galaxy';
    } else if (/Pixel/i.test(ua)) {
      const match = ua.match(/Pixel\s*[0-9a-zA-Z]+/i);
      deviceName = match ? match[0] : 'Google Pixel';
    } else if (/OnePlus|GM19|HD19|KB20|IN20|NE22|CPH24/i.test(ua)) {
      deviceName = 'OnePlus';
    } else if (/Redmi|POCO|Xiaomi|M20|M21/i.test(ua)) {
      deviceName = 'Xiaomi / Redmi';
    } else if (/Vivo|V20|V21|V22|V23|V24/i.test(ua)) {
      deviceName = 'Vivo Phone';
    } else if (/OPPO|CPH/i.test(ua)) {
      deviceName = 'Oppo Phone';
    } else if (/Realme|RMX/i.test(ua)) {
      deviceName = 'Realme Phone';
    } else {
      deviceName = 'Android Smartphone';
    }
  }

  // Detect Browser
  let browser = 'Unknown Browser';
  if (/WhatsApp/i.test(ua)) {
    browser = 'WhatsApp In-App Browser';
  } else if (/Instagram/i.test(ua)) {
    browser = 'Instagram In-App Browser';
  } else if (/SamsungBrowser/i.test(ua)) {
    browser = 'Samsung Internet';
  } else if (/Chrome/i.test(ua) && !/Edge|Edg|OPR/i.test(ua)) {
    browser = 'Google Chrome';
  } else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) {
    browser = 'Apple Safari';
  } else if (/Firefox/i.test(ua)) {
    browser = 'Mozilla Firefox';
  } else if (/Edg/i.test(ua)) {
    browser = 'Microsoft Edge';
  }

  return {
    deviceType,
    deviceName,
    os,
    browser,
    screenResolution,
    viewportSize,
    language,
    timezone,
    userAgent: ua,
  };
};
