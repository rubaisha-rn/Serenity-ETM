/**
 * Email and task priority classifier API
 * 
 * POST request containing task or email details is used to define priority for those missing it. Done using numeric importance score and confidence classification.
 */

import { NextResponse } from "next/server";

// Escape regex characters to safely build dynamic patters
function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export async function POST(req) {
    
    try {
        
        const body = await req.json();

        // Store text in lowercase to avoid inconsistencies during scoring
        const subject = body?.subject ?? body?.text ?? "";
        const content = body?.text ?? "";

        const text = `${subject} ${content}`;
        const lower = text.toLowerCase();

        let score = 0;

        // Helpers
        const countMatches = (pattern) => (lower.match(new RegExp(pattern, 'g')) || []).length;

        const addScore = (words, value) => {
            
            for (const word of words) {
                
                const regex = new RegExp(
                    `\\b${escapeRegex(word)}\\b`,
                    "g"
                );
                
                const matches = (lower.match(regex) || []).length;
                
                if (matches) score += matches * value;
            }
        };

        // Subject keyword boost
        const subjectBoost = 1.5;

        const addSubjectScore = (words, value) => {
        
            const sub = subject.toLowerCase();
        
            for (const word of words) {
        
                const regex = new RegExp(
                    `\\b${escapeRegex(word)}\\b`,
                    "g"
                );
        
                const matches = (sub.match(regex) || []).length;
        
                if (matches) score += matches * value * subjectBoost;
            }
        }
        
        // Keyword dictionaries
        const urgentWords = [
            'urgent',
            'asap',
            'immediately',
            'right away',
            'action required',
            'requires your attention',
            'response needed',
            'time sensitive',
        ];

        const deadlineWords = [
            'deadline',
            'due today',
            'due tomorrow',
            'by today',
            'before end',
            'end of day',
            'within 24 hours',
            'overdue',
            'past due',
        ];

        const riskWords = [
            'payment failed',
            'invoice overdue',
            'account suspended',
            'security alert',
            'unusual activity',
            'service interruption',
            'blocked',
            'rejected',
            'error',
        ];

        const approvalWords = [
            'please approve',
            'approval needed',
            'your approval',
            'confirm',
            'confirmation required',
            'can you review',
            'feedback needed',
            'sign and return',
        ];

        const directRequestWords = [
            'can you',
            'could you',
            'please send',
            'please share',
            'need you to',
            'your input',
        ];

        const marketingWords = [
            'sale',
            'discount',
            'offer',
            'newsletter',
            'promotion',
            'limited time',
            'deal',
            'unsubscribe',
        ];

        // Postive scoring
        addScore(urgentWords, 5);
        addScore(deadlineWords, 4);
        addScore(riskWords, 5);
        addScore(approvalWords, 3);
        addScore(directRequestWords, 2);

        addSubjectScore(urgentWords, 5);
        addSubjectScore(deadlineWords, 4);

        // Time pattern detection
        if (/\bby \d{1,2}(:\d{2})?\s?(am|pm)?\b/.test(lower)) score += 4;
        if (/\btoday\b|\tonight\b/.test(lower)) score += 3;
        if (/\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/.test(lower)) score += 2;

        // Subject emphasis
        if (/[A-Z]{4,}/.test(subject)) score += 2;

        // Thread downgrade
        if (/^(re:|fwd:)/i.test(subject)) score -=2;

        // Marketing penalty
        addScore(marketingWords, -4);

        // Excessive punctuation
        if (countMatches('!') > 3) score -= 2;

        // Weak signal keyword
        if (lower.includes('important')) score += 1;

        // Final classification
        let priority = 'normal';

        if (score >= 7) priority = 'high';
        else if (score <= -3) priority = 'low';

        const confidence = Math.min(1, Math.abs(score) / 10);

        return NextResponse.json({priority, score, confidence});
    }
    catch (error) {
        
        console.log(error);
        return NextResponse.json({error: 'Classifier failed'}, {status: 500});
    }
}