import { defineConfig, UserConfig } from "vite";
import { fileURLToPath, URL } from "url";
import * as glob from "glob";
import dts from "vite-plugin-dts";

function resolve(str: string) {
   return fileURLToPath(new URL(str, import.meta.url));
}

export default defineConfig((args) => {
   const config: UserConfig = {
      build: {
         lib: {
            entry: resolve("./src/index.ts"),
            name: "Simphy",
            fileName: (format, name) => {
               if (args.mode == "modules") {
                  return `${name}.js`;
               } else {
                  return `umd/${name}.js`;
               }
            },
            formats: ["umd"],
         },
         sourcemap: true,
      },
      resolve: {
         alias: {
            simphy: resolve("./src"),
         },
      },
      plugins: [dts({ outDir: "dist/types" })],
   };

   config.build ??= {};
   if (args.mode == "modules") {
      config.build.rollupOptions = {
         input: glob.sync(["./src/**/index.ts"]),
         output: [
            {
               dir: "dist/esm",
               format: "esm",
               exports: "named",
               preserveModules: true,
            },
            {
               dir: "dist/cjs",
               format: "cjs",
               exports: "named",
               preserveModules: true,
            },
         ],
      };
   }

   return config;
});
