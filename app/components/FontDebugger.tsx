"use client";

import { useEffect } from "react";

export function FontDebugger() {
  useEffect(() => {
    // #region agent log
    const logEndpoint = 'http://127.0.0.1:7242/ingest/19c39b46-b942-48ad-bf7b-0af7b6f7c112';
    const sessionId = 'debug-session';
    const runId = 'font-debug-1';
    
    // Hypothesis A: Check CSS variables on :root
    const rootStyles = getComputedStyle(document.documentElement);
    const bodyFontVar = rootStyles.getPropertyValue('--base-type-font-family-body').trim();
    const headingFontVar = rootStyles.getPropertyValue('--base-type-font-family-headings').trim();
    
    fetch(logEndpoint, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        location: 'FontDebugger.tsx:18',
        message: 'CSS variables on document root',
        data: { bodyFontVar, headingFontVar },
        timestamp: Date.now(),
        sessionId,
        runId,
        hypothesisId: 'A'
      })
    }).catch(() => {});
    
    // Hypothesis B: Check if fonts are loading
    if ('fonts' in document) {
      Promise.all([
        document.fonts.load('400 16px Inter'),
        document.fonts.load('400 16px Merriweather')
      ]).then(([interResult, merriweatherResult]) => {
        fetch(logEndpoint, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            location: 'FontDebugger.tsx:40',
            message: 'Font loading check',
            data: { 
              interLoaded: interResult.length > 0,
              merriweatherLoaded: merriweatherResult.length > 0,
              allFontsSize: document.fonts.size
            },
            timestamp: Date.now(),
            sessionId,
            runId,
            hypothesisId: 'B'
          })
        }).catch(() => {});
      });
    }
    
    // Hypothesis C & E: Check computed styles on actual elements
    setTimeout(() => {
      const groundsText = document.querySelector('nav span');
      const heroHeadline = document.querySelector('h1');
      const bodyText = document.querySelector('p');
      
      const groundsStyle = groundsText ? getComputedStyle(groundsText) : null;
      const heroStyle = heroHeadline ? getComputedStyle(heroHeadline) : null;
      const bodyStyle = bodyText ? getComputedStyle(bodyText) : null;
      
      fetch(logEndpoint, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          location: 'FontDebugger.tsx:70',
          message: 'Computed font-family on elements',
          data: {
            groundsFontFamily: groundsStyle?.fontFamily || 'not found',
            heroFontFamily: heroStyle?.fontFamily || 'not found',
            bodyFontFamily: bodyStyle?.fontFamily || 'not found'
          },
          timestamp: Date.now(),
          sessionId,
          runId,
          hypothesisId: 'C,E'
        })
      }).catch(() => {});
    }, 1000);
    
    // Hypothesis D: Check if tokens.css is loaded
    const tokenVarTest = rootStyles.getPropertyValue('--typography-fontsize-headings-h1').trim();
    fetch(logEndpoint, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        location: 'FontDebugger.tsx:90',
        message: 'Token CSS check (sample typography var)',
        data: { tokenVarTest },
        timestamp: Date.now(),
        sessionId,
        runId,
        hypothesisId: 'D'
      })
    }).catch(() => {});
    // #endregion
  }, []);

  return null;
}

