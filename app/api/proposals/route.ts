import { NextRequest, NextResponse } from 'next/server';

const SNAPSHOT_GQL = 'https://hub.snapshot.org/graphql';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const space = searchParams.get('space') || 'uniswapgovernance.eth';
  const state = searchParams.get('state') || 'active';

  try {
    // Fetch proposals
    const proposalsQuery = {
      query: `
        query Proposals($space: String!, $state: String!) {
          proposals(
            first: 12
            skip: 0
            where: { space: $space, state: $state }
            orderBy: "created"
            orderDirection: desc
          ) {
            id
            title
            body
            choices
            start
            end
            state
            author
            scores
            scores_total
            votes
          }
        }
      `,
      variables: { space, state },
    };

    const spaceQuery = {
      query: `
        query Space($id: String!) {
          space(id: $id) {
            id
            name
            about
            followersCount
            categories
          }
        }
      `,
      variables: { id: space },
    };

    const [proposalsRes, spaceRes] = await Promise.all([
      fetch(SNAPSHOT_GQL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'User-Agent': 'GovPulse/1.0' },
        body: JSON.stringify(proposalsQuery),
        next: { revalidate: 60 },
      }),
      fetch(SNAPSHOT_GQL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'User-Agent': 'GovPulse/1.0' },
        body: JSON.stringify(spaceQuery),
        next: { revalidate: 300 },
      }),
    ]);

    const [proposalsData, spaceData] = await Promise.all([
      proposalsRes.json(),
      spaceRes.json(),
    ]);

    return NextResponse.json({
      proposals: proposalsData?.data?.proposals || [],
      space: spaceData?.data?.space || null,
    });
  } catch (error: any) {
    console.error('Snapshot API error:', error);
    return NextResponse.json({ error: 'Failed to fetch from Snapshot.org', proposals: [], space: null }, { status: 500 });
  }
}
