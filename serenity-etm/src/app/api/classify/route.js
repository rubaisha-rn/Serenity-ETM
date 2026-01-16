import { NextResponse } from "next/server";

export async function POST(req) {
    
    try {
        const body = await req.json()
        const text = body?.text || ''

        let priority = 'normal'

        const lower = text.toLowerCase()

        if (lower.includes('$task$')) {
            priority = 'low'
        }

        if (
            lower.includes('urgent') || 
            lower.includes('asap') || 
            lower.includes('deadline') || 
            lower.includes('important')
        ) {
            priority = 'high'
        }

        return NextResponse.json({priority})
    }
    catch (error) {
        console.log(error)
        return NextResponse.json({error: 'Classifier failed'}, {status: 500})
    }
}