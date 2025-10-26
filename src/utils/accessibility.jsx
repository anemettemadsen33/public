// Accessibility utilities for WCAG 2.1+ compliance

/**
 * Skip to main content link
 * Add this at the top of the page for keyboard navigation
 */
export const SkipToContent = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded-lg focus:shadow-lg"
    >
      Skip to main content
    </a>
  );
};

/**
 * Focus trap utility
 * Traps focus within a modal or dialog
 */
export const useFocusTrap = (ref) => {
  const handleKeyDown = (e) => {
    if (e.key !== 'Tab') return;

    const focusableElements = ref.current?.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    if (!focusableElements || focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  };

  return handleKeyDown;
};

/**
 * Announce to screen readers
 * Uses aria-live region to announce dynamic content
 */
export const announce = (message, priority = 'polite') => {
  const announcer = document.getElementById('screen-reader-announcer');
  if (announcer) {
    announcer.setAttribute('aria-live', priority);
    announcer.textContent = message;
    setTimeout(() => {
      announcer.textContent = '';
    }, 1000);
  }
};

/**
 * Screen reader announcer component
 * Add this once in your app root
 */
export const ScreenReaderAnnouncer = () => {
  return (
    <div
      id="screen-reader-announcer"
      className="sr-only"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    />
  );
};

/**
 * Check if an element has sufficient color contrast
 * WCAG AA requires 4.5:1 for normal text, 3:1 for large text
 */
export const checkContrast = (foreground, background) => {
  const getLuminance = (hex) => {
    const rgb = hex.match(/\w\w/g).map((x) => parseInt(x, 16) / 255);
    const [r, g, b] = rgb.map((val) => {
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

  return {
    ratio: ratio.toFixed(2),
    AA: ratio >= 4.5,
    AALarge: ratio >= 3,
    AAA: ratio >= 7,
  };
};

/**
 * ARIA props helpers
 */
export const ariaProps = {
  button: (label, expanded = false, controls = null) => ({
    role: 'button',
    'aria-label': label,
    'aria-expanded': expanded,
    'aria-controls': controls,
  }),

  dialog: (labelId, describedById) => ({
    role: 'dialog',
    'aria-labelledby': labelId,
    'aria-describedby': describedById,
    'aria-modal': 'true',
  }),

  menu: (labelId) => ({
    role: 'menu',
    'aria-labelledby': labelId,
  }),

  menuItem: () => ({
    role: 'menuitem',
    tabIndex: 0,
  }),

  tab: (selected, controls) => ({
    role: 'tab',
    'aria-selected': selected,
    'aria-controls': controls,
    tabIndex: selected ? 0 : -1,
  }),

  tabPanel: (labelledBy, hidden) => ({
    role: 'tabpanel',
    'aria-labelledby': labelledBy,
    hidden: hidden,
    tabIndex: 0,
  }),
};

/**
 * Keyboard navigation helpers
 */
export const keyboardNav = {
  isEnterOrSpace: (e) => e.key === 'Enter' || e.key === ' ',
  isEscape: (e) => e.key === 'Escape',
  isArrowKey: (e) => ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key),
  isTab: (e) => e.key === 'Tab',
};

/**
 * Focus management
 */
export const focusManagement = {
  // Save focus before opening modal
  saveFocus: () => {
    return document.activeElement;
  },

  // Restore focus after closing modal
  restoreFocus: (element) => {
    if (element && element.focus) {
      element.focus();
    }
  },

  // Get all focusable elements within a container
  getFocusableElements: (container) => {
    return container.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
  },

  // Focus first element in container
  focusFirst: (container) => {
    const focusable = focusManagement.getFocusableElements(container);
    if (focusable.length > 0) {
      focusable[0].focus();
    }
  },
};

/**
 * Reduced motion detection
 * Respects user's prefers-reduced-motion setting
 */
export const prefersReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Get animation duration based on user preference
 */
export const getAnimationDuration = (normalDuration = 300) => {
  return prefersReducedMotion() ? 0 : normalDuration;
};

/**
 * Accessible form field wrapper
 */
export const FormField = ({ label, error, required, children, id }) => {
  const errorId = `${id}-error`;
  const descriptionId = `${id}-description`;

  return (
    <div className="mb-4">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
      >
        {label}
        {required && <span className="text-red-600 ml-1" aria-label="required">*</span>}
      </label>
      <div>
        {children({
          id,
          'aria-required': required,
          'aria-invalid': !!error,
          'aria-describedby': error ? errorId : descriptionId,
        })}
      </div>
      {error && (
        <p id={errorId} className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default {
  SkipToContent,
  ScreenReaderAnnouncer,
  announce,
  useFocusTrap,
  checkContrast,
  ariaProps,
  keyboardNav,
  focusManagement,
  prefersReducedMotion,
  getAnimationDuration,
  FormField,
};
