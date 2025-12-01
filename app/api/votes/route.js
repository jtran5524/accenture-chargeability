import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

// Initialize Redis client
// These environment variables are auto-set when you add Upstash/KV in Vercel
const redis = new Redis({
  url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

const REGIONS = ['Europe', 'India', 'Philippines', 'Latin America'];

// GET - Retrieve current votes
export async function GET() {
  try {
    // Check if Redis is configured
    if (!process.env.KV_REST_API_URL && !process.env.UPSTASH_REDIS_REST_URL) {
      // Return mock data for local development
      return NextResponse.json({
        'Europe': 0,
        'India': 0,
        'Philippines': 0,
        'Latin America': 0
      });
    }

    // Get all vote counts from Redis
    const votes = {};
    for (const region of REGIONS) {
      const count = await redis.get(`votes:${region}`);
      votes[region] = count ? parseInt(count) : 0;
    }
    
    return NextResponse.json(votes);
  } catch (error) {
    console.error('Error fetching votes:', error);
    return NextResponse.json({
      'Europe': 0,
      'India': 0,
      'Philippines': 0,
      'Latin America': 0
    });
  }
}

// POST - Add a vote
export async function POST(request) {
  try {
    const { region } = await request.json();
    
    if (!region) {
      return NextResponse.json({ error: 'Region is required' }, { status: 400 });
    }
    
    if (!REGIONS.includes(region)) {
      return NextResponse.json({ error: 'Invalid region' }, { status: 400 });
    }

    // Check if Redis is configured
    if (!process.env.KV_REST_API_URL && !process.env.UPSTASH_REDIS_REST_URL) {
      // Return mock response for local development
      return NextResponse.json({ 
        success: true, 
        votes: {
          'Europe': region === 'Europe' ? 1 : 0,
          'India': region === 'India' ? 1 : 0,
          'Philippines': region === 'Philippines' ? 1 : 0,
          'Latin America': region === 'Latin America' ? 1 : 0
        }
      });
    }

    // Increment vote count in Redis
    await redis.incr(`votes:${region}`);
    
    // Get updated vote counts
    const votes = {};
    for (const r of REGIONS) {
      const count = await redis.get(`votes:${r}`);
      votes[r] = count ? parseInt(count) : 0;
    }
    
    return NextResponse.json({ success: true, votes });
  } catch (error) {
    console.error('Error recording vote:', error);
    return NextResponse.json({ error: 'Failed to record vote' }, { status: 500 });
  }
}
