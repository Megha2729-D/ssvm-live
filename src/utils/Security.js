import React from 'react';
/**
 * Security Utility for SSVM Institutions
 * Handles cache clearing, input sanitization, and malicious code protection.
 */

export const SecurityUtils = {
    /**
     * Clears application cache, local storage, and session storage.
     * This is the "Catch Clear" logic requested.
     */
    clearAppCache: () => {
        try {
            // Clear Storage
            localStorage.clear();
            sessionStorage.clear();

            // Clear Cookies
            const cookies = document.cookie.split(";");
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i];
                const eqPos = cookie.indexOf("=");
                const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
                document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
            }

            // Unregister Service Workers if any
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then((registrations) => {
                    for (let registration of registrations) {
                        registration.unregister();
                    }
                });
            }

            console.log("Security Layer: Application cache and storage cleared successfully.");
            return true;
        } catch (error) {
            console.error("Security Layer Error: Failed to clear cache.", error);
            return false;
        }
    },

    /**
     * Sanitizes strings to prevent XSS and malicious code injection.
     * @param {string} input - The raw input string.
     * @returns {string} - The sanitized string.
     */
    sanitizeInput: (input) => {
        if (typeof input !== 'string') return input;
        
        return input
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;")
            .replace(/script/gi, "[removed]")
            .replace(/eval\(/gi, "[removed](");
    },

    /**
     * Validates if a file type is safe.
     * @param {File} file - The file object.
     * @param {Array} allowedTypes - List of allowed mime types.
     * @returns {boolean}
     */
    isSafeFile: (file, allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']) => {
        if (!file) return false;
        
        // Check mime type
        if (!allowedTypes.includes(file.type)) return false;
        
        // Check file size (e.g., max 5MB)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) return false;

        return true;
    }
};

/**
 * Error Boundary Component to catch and clear errors globally.
 */

export class SecurityErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Security Layer caught an error:", error, errorInfo);
        // Automatically clear cache if a critical error occurs to prevent corrupted state
        SecurityUtils.clearAppCache();
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ 
                    padding: '20px', 
                    textAlign: 'center', 
                    background: '#f8d7da', 
                    color: '#721c24',
                    border: '1px solid #f5c6cb',
                    borderRadius: '8px',
                    margin: '20px'
                }}>
                    <h2>Security Protection Active</h2>
                    <p>A potential issue was detected and neutralized. The application has been reset for your safety.</p>
                    <button 
                        onClick={() => window.location.reload()}
                        style={{
                            padding: '10px 20px',
                            background: '#721c24',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Reload Securely
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
