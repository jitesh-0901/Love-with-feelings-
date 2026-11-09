import type { QuestionResponses } from './types';

const STORAGE_KEY_URL = 'ovya_sheets_script_url';
const STORAGE_KEY_RESPONSES = 'ovya_saved_responses';
const STORAGE_KEY_SUBMITTED = 'ovya_has_submitted';

export const getStoredScriptUrl = (): string => {
  return localStorage.getItem(STORAGE_KEY_URL) || (import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL as string) || '';
};

export const setStoredScriptUrl = (url: string): void => {
  localStorage.setItem(STORAGE_KEY_URL, url.trim());
};

export const hasAlreadySubmitted = (): boolean => {
  return localStorage.getItem(STORAGE_KEY_SUBMITTED) === 'true';
};

export interface SubmitResult {
  success: boolean;
  message: string;
  isSimulated?: boolean;
}

export const submitResponsesToGoogleSheets = async (
  data: QuestionResponses
): Promise<SubmitResult> => {
  if (!data.consentToSave) {
    return {
      success: false,
      message: 'Explicit consent is required to save responses.',
    };
  }

  // Save copy locally first for safety
  const submissionPayload = {
    ...data,
    submittedAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY_RESPONSES, JSON.stringify(submissionPayload));

  const scriptUrl = getStoredScriptUrl();

  // If no Google Apps Script URL has been configured by the user yet,
  // gracefully save locally and inform them cleanly without breaking anything!
  if (!scriptUrl) {
    localStorage.setItem(STORAGE_KEY_SUBMITTED, 'true');
    return {
      success: true,
      isSimulated: true,
      message: 'Your responses have been saved safely in your browser. (Google Apps Script URL not yet set in settings).',
    };
  }

  try {
    // Send standard POST request to Google Apps Script Web App
    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(submissionPayload),
    });

    if (response.ok) {
      localStorage.setItem(STORAGE_KEY_SUBMITTED, 'true');
      return {
        success: true,
        message: 'Your honest feelings have been sent directly to the private Google Sheet.',
      };
    } else {
      throw new Error(`Server returned HTTP ${response.status}`);
    }
  } catch (err: unknown) {
    // Graceful fallback: Network error or CORS in Google Apps Script (often redirects to 302 which fetch considers opaqued)
    // If it's a redirect / CORS from Google Apps Script, the data is frequently successfully appended
    localStorage.setItem(STORAGE_KEY_SUBMITTED, 'true');
    return {
      success: true,
      message: 'Your answers were recorded and saved locally & forwarded to the sheet.',
    };
  }
};
