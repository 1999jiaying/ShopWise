import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.CREWAI_BACKEND_URL || 'http://localhost:8000';

const AGENT_PATHS: Record<string, string> = {
  procurement:    '/api/agent/procurement',
  purchasing:     '/api/agent/purchasing',
  'analyst-p1':   '/api/agent/analyst/phase1',
  'analyst-p2':   '/api/agent/analyst/phase2',
  deflection:     '/api/agent/deflection',
};

export async function POST(request: NextRequest) {
  const agent = request.nextUrl.searchParams.get('agent');
  if (!agent || !AGENT_PATHS[agent]) {
    return NextResponse.json(
      { error: `Unknown agent: ${agent}. Valid: ${Object.keys(AGENT_PATHS).join(', ')}` },
      { status: 400 },
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const res = await fetch(`${BACKEND_URL}${AGENT_PATHS[agent]}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        restaurant_name: body.restaurant_name || 'Harbour Bistro',
        city: body.city || 'Helsinki',
        context: body.context || null,
      }),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to reach CrewAI backend', detail: message },
      { status: 502 },
    );
  }
}

export async function GET() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/health`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { status: 'error', detail: 'CrewAI backend is not running' },
      { status: 503 },
    );
  }
}
