#!/usr/bin/env node
import pkg from "@prisma/client";
import fs from "node:fs/promises";
import path from "node:path";

const { PrismaClient: PrismaClientProduction } = pkg;

const prisma = new PrismaClientProduction();

const userFiles = await fs.readdir(path.join("data", "users"));

const promiseResults = [];
for (const userFile of userFiles) {
  if (userFile.endsWith(".json")) {
    promiseResults.push(fs.readFile(path.resolve("data", "users", userFile)));
  }
}

for (const result of await Promise.all(promiseResults)) {
  const user = JSON.parse(result);

  const imageUrl =
    user.avatar !== null
      ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=512`
      : null;

  let miiType = null;
  let miiData = null;
  if (!user.mii_data || user.mii_data.length === 1) {
    miiType = "guest";
    if (user.mii_data) {
      miiData = `guest${user.mii_data.toUpperCase()}`;
    }
  } else {
    // Always set to upload, even if CMOC. Makes it easier...
    miiType = "upload";
    // eslint-disable-next-line prefer-destructuring
    miiData = user.mii_data.split(",")[0];
  }

  // TODO: migrate stuff from db files (coins are duplicated in JSON and db...?)
  // TODO: Playlog
  await prisma.user.create({
    data: {
      username: user.id,
      name_on_riitag: user.name,
      image: imageUrl,
      randkey: user.id,
      coins: user.coins,
      cover_region: user.coverregion,
      cover_type: user.covertype,
      comment: user.friend_code,
      overlay: user.bg.sp,
      background: user.bg.split("/")[user.bg.split.length],
      flag: user.region,
      coin: user.coin === "default" ? "mario" : user.coin,
      font: user.font,
      show_avatar: user.useavatar === "true",
      show_mii: user.usemii === "true",
      mii_type: miiType,
      mii_data: miiData,
      cmoc_entry_no: user.mii_number.replaceAll("-", ""),
      accounts: {
        create: {
          provider_id: "discord",
          provider_account_id: user.id,
        },
      },
    },
  });
}
