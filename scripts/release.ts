import path from "node:path";
import fs from "node:fs";
import { execSync } from "node:child_process";
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

const rootPkgPath = path.join(__dirname, "..", "package.json");

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
  const content = await fs.promises.readFile(rootPkgPath, "utf8");

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
    .then(({ bump }) => {
      const pkgs = globbySync("packages/**/package.json", {
        ignore: ["**/node_modules/**/package.json"],
        absolute: true,
      }).concat(rootPkgPath);
      pkgs.forEach((pkg) => {
        const contentString = fs.readFileSync(pkg, "utf8");
        const content = JSON.parse(contentString);
        content.version = bump;
        const next = prettier.format(JSON.stringify(content), {
          parser: "json-stringify",
        });
        fs.writeFileSync(pkg, next, "utf8");
      });
      const r = execSync(
        `git add . && git commit -m ${JSON.stringify(
          bump
        )} && git tag v${bump} -m ${JSON.stringify(bump)}`
      );
      console.log(String(r));
    });
})();
