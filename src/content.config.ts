import { defineCollection, z } from "astro:content";
import type { Loader } from "astro/loaders";
import { createClient } from "microcms-js-sdk";

const client = createClient({
  serviceDomain: import.meta.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: import.meta.env.MICROCMS_API_KEY,
});

const workItem = z.object({
  title: z.string(),
  image: z.string(),
  caption: z.string().optional(),
});

const artistsSchema = z.object({
  name: z.string(),
  nameEn: z.string().optional(),
  category: z.array(z.string()).default([]),
  order: z.number().default(99),
  exhibitionTitle: z.string().optional(),
  exhibition: z.array(workItem).default([]),
  portfolio: z.array(workItem).default([]),
  thumbnail: z.string().optional(),
  profile: z
    .object({
      origin: z.string().optional(),
      hobby: z.string().optional(),
      note: z.string().optional(),
    })
    .default({}),
  sns: z
    .object({
      x: z.string().optional(),
      instagram: z.string().optional(),
      facebook: z.string().optional(),
      youtube: z.string().optional(),
      tiktok: z.string().optional(),
      linkedin: z.string().optional(),
      threads: z.string().optional(),
    })
    .default({}),
});

const microcmsArtistsLoader: Loader = {
  name: "microcms-artists",
  load: async ({ store, logger }) => {
    logger.info("microCMSから出展者データを取得中...");

    const exhibitorsRes = await client.get({
      endpoint: "exhibitors",
      queries: { limit: 100 },
    });
    const worksRes = await client.get({
      endpoint: "works",
      queries: { limit: 100 },
    });

    store.clear();

    for (const ex of exhibitorsRes.contents) {
      const relatedWorks = worksRes.contents.filter(
        (w: any) => w.exhibitor?.id === ex.id
      );

      const exhibition = relatedWorks
        .filter((w: any) => w.type?.includes("exhibition"))
        .map((w: any) => ({ title: w.title, image: w.image?.url ?? "", caption: w.description ?? "" }));

      const portfolio = relatedWorks
        .filter((w: any) => w.type?.includes("portfolio"))
        .map((w: any) => ({ title: w.title, image: w.image?.url ?? "", caption: w.description ?? "" }));

      store.set({
        id: ex.id,
        data: {
          name: ex.name,
          nameEn: ex.nameEN,
          category: ex.category ?? [],
          order: ex.order ?? 99,
          exhibitionTitle: ex.exhibitionTitle,
          exhibition,
          portfolio,
          thumbnail: ex.thumbnail?.url,
          profile: {
            origin: ex.profileOrigin,
            hobby: ex.profileHobby,
            note: ex.profileNote,
          },
          sns: {
            x: ex.snsX,
            instagram: ex.snsInstagram,
            facebook: ex.snsFacebook,
            youtube: ex.snsYoutube,
            tiktok: ex.snsTiktok,
            linkedin: ex.snsLinkedin,
            threads: ex.snsThreads,
          },
        },
      });
    }
  },
};

const artists = defineCollection({
  loader: microcmsArtistsLoader,
  schema: artistsSchema,
});

export const collections = { artists };
