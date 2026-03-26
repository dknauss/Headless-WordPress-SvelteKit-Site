import type { CardsResponse } from './types';

const WP_GRAPHQL_URL = 'http://localhost:8881/graphql'; 

const GET_CARDS = `
  query GetCards {
    posts {
      nodes {
        id
        title
        slug
        excerpt
        date
        featuredImage {
          node {
            sourceUrl
          }
        }
        categories {
          nodes {
            name
            slug
          }
        }
      }
    }
  }
`;


/**
 * Generic function to execute GraphQL queries
 * @param query - The GraphQL query string
 * @param variables - Variables to pass to the query (optional)
 * @returns The GraphQL response data
 */
async function fetchGraphQL<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const response = await fetch(WP_GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables: variables || {},
    }),
  });

  if (!response.ok) {
    throw new Error(`GraphQL request failed: ${response.statusText}`);
  }

  const { data, errors } = await response.json();

  if (errors) {
    throw new Error(`GraphQL error: ${errors[0]?.message || 'Unknown error'}`);
  }

  return data as T;
}

/**
 * Fetch all cards from WordPress
 */
export async function getCards(): Promise<CardsResponse> {
  return fetchGraphQL<CardsResponse>(GET_CARDS);
}
