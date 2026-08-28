// @ts-check
import { defineConfig } from "astro/config";

export default defineConfig({
  // 公開時に本番URLへ書き換える(OGP・sitemapの絶対URLに使われます)
  site: "https://example.com",
});
