/**
 * Route Configuration and Access Control Utilities
 * 
 * CRITICAL CONSTRAINTS:
 * - customFunctions object MUST remain empty
 * - Only "public" and "authenticated" rules are supported
 * - No custom JavaScript expressions allowed
 */

import routesConfig from './routes.json';

// MANDATORY: Keep this empty - custom functions are not supported
const customFunctions = {};

/**
 * Get route configuration with pattern matching
 * @param {string} path - Current path
 * @returns {object|null} Route configuration or null if not found
 */
export function getRouteConfig(path) {
  const routes = Object.entries(routesConfig);
  const matches = [];

  for (const [pattern, config] of routes) {
    if (matchesPattern(path, pattern)) {
      matches.push({
        pattern,
        config,
        specificity: getSpecificity(pattern)
      });
    }
  }

  // Sort by specificity (most specific first)
  matches.sort((a, b) => b.specificity - a.specificity);
  
  return matches.length > 0 ? matches[0].config : null;
}

/**
 * Check if path matches pattern
 * @param {string} path - Current path
 * @param {string} pattern - Route pattern
 * @returns {boolean} True if matches
 */
export function matchesPattern(path, pattern) {
  // Exact match
  if (path === pattern) {
    return true;
  }

  // Convert pattern to regex
  const regexPattern = pattern
    .replace(/:[^/]+/g, '[^/]+') // Replace :param with regex
    .replace(/\/\*\*\/\*/g, '/.*') // Replace /**/* with catch-all
    .replace(/\/\*/g, '/[^/]*') // Replace /* with single level wildcard
    .replace(/\*/g, '[^/]*'); // Replace * with non-slash wildcard

  const regex = new RegExp(`^${regexPattern}$`);
  return regex.test(path);
}

/**
 * Get pattern specificity score for sorting
 * @param {string} pattern - Route pattern
 * @returns {number} Specificity score
 */
export function getSpecificity(pattern) {
  let score = 0;
  
  // Exact paths get highest score
  if (!pattern.includes(':') && !pattern.includes('*')) {
    score += 1000;
  }
  
  // Add points for each segment
  const segments = pattern.split('/').filter(s => s);
  score += segments.length * 10;
  
  // Subtract points for wildcards
  const paramCount = (pattern.match(/:[^/]+/g) || []).length;
  const wildcardCount = (pattern.match(/\*/g) || []).length;
  
  score -= paramCount * 5;
  score -= wildcardCount * 10;
  
  return score;
}

/**
 * Verify if user has access to route
 * @param {object} config - Route configuration
 * @param {object} user - Current user object
 * @returns {object} Access check result
 */
export function verifyRouteAccess(config, user) {
  if (!config || !config.allow) {
    return {
      allowed: true,
      redirectTo: null,
      excludeRedirectQuery: false,
      failed: []
    };
  }

  const { allow } = config;
  const { when, redirectOnDeny, excludeRedirectQuery = false } = allow;
  
  if (!when || !when.conditions) {
    return {
      allowed: true,
      redirectTo: null,
      excludeRedirectQuery: false,
      failed: []
    };
  }

  const { conditions, operator = 'AND' } = when;
  const failed = [];
  
  // Evaluate each condition
  const results = conditions.map(condition => {
    const { rule, label } = condition;
    const result = evaluateRule(rule, user);
    
    if (!result) {
      failed.push(label || rule);
    }
    
    return result;
  });
  
  // Apply operator logic
  let allowed;
  if (operator === 'OR') {
    allowed = results.some(result => result);
  } else {
    allowed = results.every(result => result);
  }
  
  return {
    allowed,
    redirectTo: allowed ? null : (redirectOnDeny || null),
    excludeRedirectQuery: !!excludeRedirectQuery,
    failed
  };
}

/**
 * Evaluate a single access rule
 * @param {string} rule - Rule to evaluate ("public" or "authenticated")
 * @param {object} user - Current user object
 * @returns {boolean} True if rule passes
 */
function evaluateRule(rule, user) {
  switch (rule) {
    case 'public':
      return true;
    case 'authenticated':
      return !!(user && typeof user === 'object');
    default:
      console.warn(`Unknown rule: ${rule}`);
      return false;
  }
}