import path from "node:path";
import fs from "node:fs";
import { globbySync } from "globby";
import { prompt } from "enquirer";
import semver, { type ReleaseType } from "semver";
import prettier from "prettier";

const releaseType: ReleaseType[] = [
  "major",
  "minor",
  "patch",
  "premajor",
  "preminor",
  "prepatch",
  "prerelease",
];

const merge = (memo: any, current: any) => ({
  ...memo,
  ...current,
});

function bumpVersion(currentVersion: string) {
  const mapToRecord = (type: ReleaseType) => ({
    [type]: semver.inc(currentVersion, type as never, "alpha"),
  });

  return releaseType.map(mapToRecord).reduce(merge);
}

async function getCurrentVersion() {
  const content = await fs.promises.readFile(
    path.join(__dirname, "..", "package.json"),
    "utf8"
  );

  const { version } = JSON.parse(content);
  return version;
}

// const _ = globbySync("packages/**/package.json", {
//   ignore: ["**/node_modules/**/package.json"],
// });

(async () => {
  await getCurrentVersion()
    .then(bumpVersion)
    .then((record) =>
      prompt<{ bump: string }>({
        type: "select",
        name: "bump",
        message: "What type of release?",
        choices: releaseType.map((x) => ({
          message: `${x} -> ${record[x]}`,
          name: record[x]!,
        })),
      })
    )
    .then((x) => {
      const pkgs = globbySync("packages/**/package.json", {
        ignore: ["**/node_modules/**/package.json"],
        absolute: true,
      });
      pkgs.forEach((pkg) => {
        const contentString = fs.readFileSync(pkg, "utf8");
        const content = JSON.parse(contentString);
        content.version = x.bump;
        const next = prettier.format(JSON.stringify(content), {
          parser: "json-stringify",
        });
        fs.writeFileSync(pkg, next, "utf8");
      });
    });
})();
