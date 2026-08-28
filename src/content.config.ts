import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const workItem = z.object({
  title: z.string(),
  image: z.string(),
  caption: z.string().optional(),
});

/**
 * 1ファイル = 1出展者。
 *   nameEn     … ローマ字表記(一覧の主表示)
 *   name       … 日本語名
 *   exhibition … 今回のグループ展の出展作品(まだ無ければ空)
 *   portfolio  … これまでの作品(横スクロールで表示)
 *   profile    … 出身・趣味・ひとことなど(任意)
 */
const artists = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/artists" }),
  schema: z.object({
    name: z.string(),
    nameEn: z.string().optional(),
    category: z.array(z.string()).default([]),
    order: z.number().default(99),
    exhibitionTitle: z.string().optional(), // 展示作品のタイトル(例: OOOOの変化)
    exhibition: z.array(workItem).default([]),
    portfolio: z.array(workItem).default([]),
    thumbnail: z.string().optional(),
    profile: z
      .object({
        origin: z.string().optional(), // 出身
        hobby: z.string().optional(),  // 趣味
        note: z.string().optional(),   // ひとこと
      })
      .default({}),
  }),
});

export const collections = { artists };
