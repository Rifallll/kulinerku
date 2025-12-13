import { createClient } from '@supabase/supabase-js';
import Fuse from 'fuse.js';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ============================================================
// INTELLIGENT CLASSIFIER
// ============================================================

/**
 * Comprehensive keyword database with weights
 * Higher weight = stronger indicator
 */
const BEVERAGE_PATTERNS = [
    // Strong indicators (weight: 1.0)
    { pattern: /^es\s/i, weight: 1.0, category: 'cold_drink' },
    { pattern: /\bkopi\b/i, weight: 1.0, category: 'coffee' },
    { pattern: /\bteh\b/i, weight: 1.0, category: 'tea' },
    { pattern: /^jus\s/i, weight: 1.0, category: 'juice' },
    { pattern: /\bjus\s/i, weight: 1.0, category: 'juice' },
    { pattern: /\bsusu\b/i, weight: 0.9, category: 'milk' },

    // Traditional hot drinks (weight: 1.0)
    { pattern: /\bwedang\b/i, weight: 1.0, category: 'traditional_hot' },
    { pattern: /\bbajigur\b/i, weight: 1.0, category: 'traditional_hot' },
    { pattern: /\bbandrek\b/i, weight: 1.0, category: 'traditional_hot' },
    { pattern: /\bsekoteng\b/i, weight: 1.0, category: 'traditional_hot' },

    // Herbal drinks (weight: 1.0)
    { pattern: /\bjamu\b/i, weight: 1.0, category: 'herbal' },
    { pattern: /\bbir pletok\b/i, weight: 1.0, category: 'herbal' },
    { pattern: /\blahang\b/i, weight: 1.0, category: 'herbal' },

    // Traditional cold drinks (weight: 1.0)
    { pattern: /\bcendol\b/i, weight: 1.0, category: 'traditional_cold' },
    { pattern: /\bdawet\b/i, weight: 1.0, category: 'traditional_cold' },
    { pattern: /\bteler\b/i, weight: 1.0, category: 'traditional_cold' },
    { pattern: /\bdoger\b/i, weight: 1.0, category: 'traditional_cold' },
    { pattern: /\bselendang mayang\b/i, weight: 1.0, category: 'traditional_cold' },
    { pattern: /\bronde\b/i, weight: 1.0, category: 'traditional_cold' },
    { pattern: /\bcincau\b/i, weight: 0.9, category: 'traditional_cold' },

    // Specific beverages (weight: 1.0)
    { pattern: /\bkelapa muda\b/i, weight: 1.0, category: 'coconut' },
    { pattern: /\bair kelapa\b/i, weight: 1.0, category: 'coconut' },
    { pattern: /\btimun serut\b/i, weight: 1.0, category: 'juice' },

    // Modern drinks (weight: 1.0)
    { pattern: /\bthai tea\b/i, weight: 1.0, category: 'modern' },
    { pattern: /\bcappuccino\b/i, weight: 1.0, category: 'modern' },
    { pattern: /\blatte\b/i, weight: 1.0, category: 'modern' },
    { pattern: /\bsmoothie\b/i, weight: 1.0, category: 'modern' },
    { pattern: /\bmilkshake\b/i, weight: 1.0, category: 'modern' },
    { pattern: /\bsari\s/i, weight: 0.9, category: 'juice' },
];

const FOOD_PATTERNS = [
    // Strong indicators (weight: 1.0)
    { pattern: /\bnasi\b/i, weight: 1.0, category: 'rice' },
    { pattern: /\bayam\b/i, weight: 0.9, category: 'chicken' },
    { pattern: /\bsate\b/i, weight: 1.0, category: 'grilled' },
    { pattern: /\brendang\b/i, weight: 1.0, category: 'curry' },
    { pattern: /\bsoto\b/i, weight: 1.0, category: 'soup' },
    { pattern: /\bbakso\b/i, weight: 1.0, category: 'meatball' },
    { pattern: /\bmie\b/i, weight: 1.0, category: 'noodle' },
    { pattern: /\bmi\b/i, weight: 0.9, category: 'noodle' },

    // Vegetables & tofu (weight: 1.0)
    { pattern: /\bgado\b/i, weight: 1.0, category: 'salad' },
    { pattern: /\bpecel\b/i, weight: 1.0, category: 'salad' },
    { pattern: /\btempe\b/i, weight: 0.9, category: 'tofu' },
    { pattern: /\btahu\b/i, weight: 0.8, category: 'tofu' },

    // Traditional dishes (weight: 1.0)
    { pattern: /\bgudeg\b/i, weight: 1.0, category: 'traditional' },
    { pattern: /\brawon\b/i, weight: 1.0, category: 'traditional' },
    { pattern: /\bopor\b/i, weight: 1.0, category: 'traditional' },

    // Condiments & sides (weight: 0.9)
    { pattern: /\bsambal\b/i, weight: 0.9, category: 'condiment' },
    { pattern: /\bkerupuk\b/i, weight: 0.9, category: 'snack' },
    { pattern: /\bperkedel\b/i, weight: 0.9, category: 'fried' },

    // Protein (weight: 0.9)
    { pattern: /\bikan\b/i, weight: 0.9, category: 'fish' },
    { pattern: /\bempal\b/i, weight: 1.0, category: 'meat' },
    { pattern: /\bdendeng\b/i, weight: 1.0, category: 'meat' },
];

/**
 * Intelligent classifier with confidence scoring
 * @param {string} name - Item name to classify
 * @returns {Object} - { type: 'Makanan'|'Minuman', confidence: 0-1, reasons: [] }
 */
function classifyItem(name) {
    let beverageScore = 0;
    let foodScore = 0;
    const beverageReasons = [];
    const foodReasons = [];

    // Check beverage patterns
    for (const { pattern, weight, category } of BEVERAGE_PATTERNS) {
        if (pattern.test(name)) {
            beverageScore += weight;
            beverageReasons.push({ pattern: pattern.source, weight, category });
        }
    }

    // Check food patterns
    for (const { pattern, weight, category } of FOOD_PATTERNS) {
        if (pattern.test(name)) {
            foodScore += weight;
            foodReasons.push({ pattern: pattern.source, weight, category });
        }
    }

    // Determine type and confidence
    if (beverageScore === 0 && foodScore === 0) {
        return {
            type: null,
            confidence: 0,
            reasons: ['No matching patterns found'],
            scores: { beverage: 0, food: 0 }
        };
    }

    const totalScore = beverageScore + foodScore;
    const type = beverageScore > foodScore ? 'Minuman' : 'Makanan';
    const winningScore = Math.max(beverageScore, foodScore);
    const confidence = winningScore / (totalScore || 1);

    return {
        type,
        confidence: Math.min(confidence, 1.0),
        reasons: type === 'Minuman' ? beverageReasons : foodReasons,
        scores: { beverage: beverageScore, food: foodScore }
    };
}

// ============================================================
// FUZZY DUPLICATE DETECTION
// ============================================================

/**
 * Find potential duplicates using fuzzy matching
 * @param {Array} items - All items from database
 * @param {number} threshold - Similarity threshold (0-1)
 * @returns {Array} - Array of duplicate groups
 */
function findDuplicates(items, threshold = 0.85) {
    const duplicateGroups = [];
    const processed = new Set();

    const fuse = new Fuse(items, {
        keys: ['name'],
        threshold: 1 - threshold, // Fuse uses distance, we use similarity
        includeScore: true
    });

    for (const item of items) {
        if (processed.has(item.id)) continue;

        const results = fuse.search(item.name);
        const similarItems = results
            .filter(r => r.item.id !== item.id && !processed.has(r.item.id))
            .filter(r => (1 - r.score) >= threshold)
            .map(r => ({ ...r.item, similarity: (1 - r.score).toFixed(2) }));

        if (similarItems.length > 0) {
            duplicateGroups.push({
                original: item,
                duplicates: similarItems
            });
            processed.add(item.id);
            similarItems.forEach(dup => processed.add(dup.id));
        }
    }

    return duplicateGroups;
}

// ============================================================
// DATA QUALITY CHECKS
// ============================================================

/**
 * Comprehensive data quality checker
 * @param {Object} item - Food item to check
 * @returns {Object} - { isValid: boolean, issues: [], severity: 'low'|'medium'|'high' }
 */
function checkDataQuality(item) {
    const issues = [];

    // Check 1: Rating out of range
    if (item.rating < 0 || item.rating > 5) {
        issues.push({
            type: 'invalid_rating',
            severity: 'high',
            message: `Rating ${item.rating} is out of range (0-5)`,
            autoFix: true,
            fixValue: Math.max(0, Math.min(5, item.rating))
        });
    }

    // Check 2: Suspiciously low/high rating
    if (item.rating < 2.0) {
        issues.push({
            type: 'suspicious_rating',
            severity: 'low',
            message: `Rating ${item.rating} is unusually low`,
            autoFix: false
        });
    }
    if (item.rating === 5.0) {
        issues.push({
            type: 'suspicious_rating',
            severity: 'low',
            message: `Perfect rating 5.0 might be suspicious`,
            autoFix: false
        });
    }

    // Check 3: Empty or very short description
    if (!item.description || item.description.trim().length < 20) {
        issues.push({
            type: 'poor_description',
            severity: 'medium',
            message: 'Description is too short or empty',
            autoFix: false
        });
    }

    // Check 4: Invalid origin
    if (!item.origin || item.origin.trim().length === 0) {
        issues.push({
            type: 'missing_origin',
            severity: 'high',
            message: 'Origin is missing',
            autoFix: false
        });
    }

    // Check 5: Type validation
    if (!['Makanan', 'Minuman'].includes(item.type)) {
        const classification = classifyItem(item.name);
        issues.push({
            type: 'invalid_type',
            severity: 'high',
            message: `Type "${item.type}" is invalid`,
            autoFix: classification.type !== null,
            fixValue: classification.type,
            confidence: classification.confidence
        });
    }

    // Check 6: Type mismatch with name
    const classification = classifyItem(item.name);
    if (classification.type && classification.type !== item.type && classification.confidence > 0.7) {
        issues.push({
            type: 'type_mismatch',
            severity: 'high',
            message: `Type "${item.type}" doesn't match name pattern (suggests "${classification.type}")`,
            autoFix: true,
            fixValue: classification.type,
            confidence: classification.confidence
        });
    }

    // Determine overall severity
    const severities = issues.map(i => i.severity);
    const overallSeverity = severities.includes('high') ? 'high' :
        severities.includes('medium') ? 'medium' : 'low';

    return {
        isValid: issues.length === 0,
        issues,
        severity: overallSeverity,
        autoFixable: issues.some(i => i.autoFix)
    };
}

// ============================================================
// AUTO-HEALING ENGINE
// ============================================================

/**
 * Automatically fix data quality issues
 * @param {Object} item - Item to fix
 * @param {Array} issues - Issues from checkDataQuality
 * @returns {Object} - { fixed: boolean, changes: [], newItem: {} }
 */
function autoHeal(item, issues) {
    const changes = [];
    const newItem = { ...item };

    for (const issue of issues) {
        if (!issue.autoFix) continue;

        switch (issue.type) {
            case 'invalid_rating':
                newItem.rating = issue.fixValue;
                changes.push({
                    field: 'rating',
                    oldValue: item.rating,
                    newValue: issue.fixValue,
                    reason: issue.message
                });
                break;

            case 'invalid_type':
            case 'type_mismatch':
                newItem.type = issue.fixValue;
                changes.push({
                    field: 'type',
                    oldValue: item.type,
                    newValue: issue.fixValue,
                    reason: issue.message,
                    confidence: issue.confidence
                });
                break;
        }
    }

    return {
        fixed: changes.length > 0,
        changes,
        newItem
    };
}

// ============================================================
// EXPORT FUNCTIONS
// ============================================================

export {
    classifyItem,
    findDuplicates,
    checkDataQuality,
    autoHeal,
    BEVERAGE_PATTERNS,
    FOOD_PATTERNS
};
