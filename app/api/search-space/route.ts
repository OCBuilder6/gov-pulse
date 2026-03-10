import { NextRequest, NextResponse } from 'next/server';

const SNAPSHOT_GQL = 'https://hub.snapshot.org/graphql';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';

  if (!q.trim()) {
    return NextResponse.json({ spaces: [] });
  }

  try {
    const query = {
      query: `
        query Spaces($q: String!) {
          spaces(
            first: 8
            skip: 0
            where: { id_contains: $q }
            orderBy: "followersCount"
            orderDirection: desc
          ) {
            id
            name
            followersCount
            categories
          }
        }
      `,
      variables: { q: q.toLowerCase() },
    };

    const res = await fetch(SNAPSHOT_GQL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'User-Agent': 'GovPulse/1.0' },
      body: JSON.stringify(query),
    });

    const data = await res.json();
    let spaces = data?.data?.spaces || [];

    // If no results with id_contains, try name search
    if (spaces.length === 0) {
      const nameQuery = {
        query: `
          query Spaces($q: String!) {
            spaces(
              first: 8
              skip: 0
              where: { name_contains: $q }
              orderBy: "followersCount"
              orderDirection: desc
            ) {
              id
              name
              followersCount
              categories
            }
          }
        `,
        variables: { q },
      };

      const nameRes = await fetch(SNAPSHOT_GQL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'User-Agent': 'GovPulse/1.0' },
        body: JSON.stringify(nameQuery),
      });
      const nameData = await nameRes.json();
      spaces = nameData?.data?.spaces || [];
    }

    return NextResponse.json({ spaces });
  } catch (error) {
    console.error('Space search error:', error);
    return NextResponse.json({ spaces: [] });
  }
}
