/**
 * microCMS クライアント
 * .env に MICROCMS_SERVICE_DOMAIN / MICROCMS_API_KEY が無い場合は
 * サンプルデータで動作します(デザイン作業を先行できるように)。
 */
import { createClient, type MicroCMSQueries } from "microcms-js-sdk";

// ---- 型定義(microCMS側のフィールドIDと一致させること) ----

export type News = {
  id: string;
  publishedAt: string;
  title: string;
  category: string[]; // セレクトフィールド
  body: string; // リッチエディタ(HTML)
};

export type Blog = {
  id: string;
  publishedAt: string;
  title: string;
  category: string[];
  thumbnail?: { url: string; width: number; height: number };
  body: string;
};

const serviceDomain = import.meta.env.MICROCMS_SERVICE_DOMAIN;
const apiKey = import.meta.env.MICROCMS_API_KEY;

export const isMock = !serviceDomain || !apiKey;

const client = isMock
  ? null
  : createClient({ serviceDomain, apiKey });

// ---- サンプルデータ(接続前のプレビュー用) ----

const mockNews: News[] = [
  {
    id: "sample-news-1",
    publishedAt: "2026-08-01T10:00:00.000Z",
    title: "公式サイトを公開しました",
    category: ["お知らせ"],
    body: "<p>卒業展示の公式サイトを公開しました。会期までの情報はこちらで更新していきます。</p>",
  },
  {
    id: "sample-news-2",
    publishedAt: "2026-07-20T10:00:00.000Z",
    title: "会場が決定しました",
    category: ["お知らせ"],
    body: "<p>会場が決定しました。アクセスページをご確認ください。</p>",
  },
];

const mockBlog: Blog[] = [
  {
    id: "sample-blog-1",
    publishedAt: "2026-08-02T10:00:00.000Z",
    title: "制作日記 #01 — サイトを作りはじめました",
    category: ["制作日記"],
    body: "<p>ここに本文が入ります。microCMSと接続すると実際の記事が表示されます。</p>",
  },
  {
    id: "sample-blog-2",
    publishedAt: "2026-07-28T10:00:00.000Z",
    title: "展示コンセプトについて",
    category: ["展示のこと"],
    body: "<p>ここに本文が入ります。</p>",
  },
];

// ---- 取得関数 ----

export async function getNewsList(queries?: MicroCMSQueries): Promise<News[]> {
  if (!client) return mockNews;
  const res = await client.getList<News>({ endpoint: "news", queries: { limit: 100, ...queries } });
  return res.contents;
}

export async function getBlogList(queries?: MicroCMSQueries): Promise<Blog[]> {
  if (!client) return mockBlog;
  const res = await client.getList<Blog>({ endpoint: "blog", queries: { limit: 100, ...queries } });
  return res.contents;
}

export type Work = {
  id: string;
  title: string;
  description?: string;
  image?: { url: string; width: number; height: number };
  tags?: string[];
  type?: string[];
  exhibitor?: { id: string; name: string; nameEN?: string };
};

const mockWorks: Work[] = [
  {
    id: "sample-work-1",
    title: "Flux #1",
    description: "",
    image: { url: "https://placehold.co/600x750", width: 600, height: 750 },
    tags: ["グラフィック"],
    type: ["exhibition"],
    exhibitor: { id: "sample", name: "田中 葵", nameEN: "Aoi Tanaka" },
  },
];

export async function getWorksList(
  queries?: MicroCMSQueries,
  type: "exhibition" | "portfolio" = "exhibition"
): Promise<Work[]> {
  if (!client) return mockWorks;
  const res = await client.getList<Work>({
    endpoint: "works",
    queries: { limit: 100, filters: `type[contains]${type}`, ...queries },
  });
  return res.contents;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}
