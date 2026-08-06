export interface DmmItem {
  content_id: string;
  title: string;
  affiliateURL: string;
  imageURL: string | null;
  maker: string;
  price: string | null;
  reviewAverage: number;
  reviewCount: number;
}

interface DmmApiResponse {
  result?: {
    items?: Array<{
      content_id: string;
      title: string;
      affiliateURL: string;
      imageURL?: { large?: string; small?: string };
      iteminfo?: { maker?: Array<{ name: string }> };
      prices?: { price?: string };
      review?: { average?: string; count?: number };
    }>;
  };
}

export async function fetchItemsByKeyword(keyword: string, hits = 50): Promise<DmmItem[]> {
  const apiId = import.meta.env.DMM_API_ID;
  const affiliateId = import.meta.env.DMM_AFFILIATE_ID;

  const params = new URLSearchParams({
    api_id: apiId,
    affiliate_id: affiliateId,
    site: 'FANZA',
    service: 'digital',
    floor: 'videoa',
    keyword,
    hits: String(hits),
    sort: 'review',
    output: 'json',
  });

  const res = await fetch(`https://api.dmm.com/affiliate/v3/ItemList?${params.toString()}`);
  if (!res.ok) throw new Error(`DMM API error: ${res.status}`);
  const data: DmmApiResponse = await res.json();
  const items = data.result?.items ?? [];

  return items
    .map((item) => ({
      content_id: item.content_id,
      title: item.title,
      affiliateURL: item.affiliateURL,
      imageURL: item.imageURL?.large ?? item.imageURL?.small ?? null,
      maker: item.iteminfo?.maker?.[0]?.name ?? '',
      price: item.prices?.price ?? null,
      reviewAverage: item.review?.average ? Number(item.review.average) : 0,
      reviewCount: item.review?.count ?? 0,
    }))
    .filter((item) => item.reviewCount >= 3);
}
