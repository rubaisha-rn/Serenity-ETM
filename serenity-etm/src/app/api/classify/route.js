import { NextResponse } from "next/server";

export async function POST(req) {
    
    try {
        const body = await req.json();

        const subject = body?.subject || '';
        const content = body?.text || '';

        const text = `${subject} ${content}`;
        const lower = text.toLowerCase();

        let score = 0;

        if (lower.includes('$task$')) { 
            return NextResponse.json({priority: 'low', score: -10});
        }

        // helpers
        const countMatches = (pattern) => (lower.match(new RegExp(pattern, 'g')) || []).length;

        const addScore = (words, value) => {
            for (const word of words) {
                const matches = countMatches(word);
                if (matches) score += matches * value;
            }
        };

        const subjectBoost = 1.5;
        const addSubjectScore = (words, value) => {
            const sub = subject.toLowerCase();
            for (const word of words) {
                const matches = (sub.match(new RegExp(word, 'g')) || []).length;
                if (matches) score += matches * value * subjectBoost;
            }
        }
        
        // keywords
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

        addScore(urgentWords, 5);
        addScore(deadlineWords, 4);
        addScore(riskWords, 5);
        addScore(approvalWords, 3);
        addScore(directRequestWords, 2);

        addSubjectScore(urgentWords, 5);
        addSubjectScore(deadlineWords, 4);

        // time detection
        if (/\bby \d{1,2}(:\d{2})?\s?(am|pm)?\b/.test(lower)) score += 4;
        if (/\btoday\b|\tonight\b/.test(lower)) score += 3;
        if (/\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/.test(lower)) score += 2;

        // all caps urgency
        if (/[A-Z]{4,}/.test(subject)) score += 2;

        // thread downgrade
        if (/^(re:|fwd:)/i.test(subject)) score -=2;

        // marketing penalty
        for (const word of marketingWords) {
            if (lower.includes(word)) score -= 4;
        }

        // excessive exclamation
        if (countMatches('!') > 3) score -= 2;

        // important word (weak alone)
        if (lower.includes('important')) score += 1;

        // final classification
        let priority = 'normal';

        if (score >= 7) priority = 'high';
        else if (score <= -3) priority = 'low';

        const confidence = Math.min(1, Math.abs(score) / 10);

        return NextResponse.json({priority, score, confidence})
    }
    catch (error) {
        console.log(error)
        return NextResponse.json({error: 'Classifier failed'}, {status: 500})
    }
}