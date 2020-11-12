import { useCallback, useState, useEffect } from 'react';


function copyToClipboard(text) {
  // When the easy way is supported, let's do that!
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text);
  }

  // create element
  const element = document.createElement('span');
  // throw text into it
  element.textContent = text;
  // set 'pre' to preserve whitespace
  element.style.whiteSpace = 'pre';
  // add element to DOM
  document.body.appendChild(element);

  // using Promises to ensure we get the selection range correctly.
  const selection = window.getSelection();
  // bail if no selection found.
  if (!selection) {
    return Promise.reject();
  }

  const range = document.createRange();
  selection.removeAllRanges();
  range.selectNode(element);
  selection.addRange(range);

  // copy to clipboard or error out.
  try {
    document.execCommand('copy');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Copy failed.');
    return Promise.reject();
  }

  // Clean up range and DOM.
  selection.removeAllRanges();
  document.body.removeChild(element);
  return Promise.resolve();
}

// resetInterval - MS. Optional. Resets isCopied after X amount of time.
function useCopyToClipboard(resetInterval) {
  const [isCopied, setCopied] = useState(false);

  const copyHandler = useCallback((text) => {
    copyToClipboard(text.toString());
    setCopied(true);
  }, []);

  useEffect(() => {
    let timeout;
    if (isCopied && resetInterval) {
      timeout = setTimeout(() => setCopied(false), resetInterval);
    }

    return () => clearTimeout(timeout);
  }, [isCopied, resetInterval]);

  return [copyHandler, isCopied];
}

export default useCopyToClipboard;