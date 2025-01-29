import fs from "fs";
import path from "path";
import { faker } from "@faker-js/faker";

import { labels, priorities, namees } from "./data";

const tasks = Array.from({ length: 100 }, () => ({
  id: `TASK-${faker.number.int({ min: 1000, max: 9999 })}`,
  email: faker.hacker.phrase().replace(/^./, (letter) => letter.toUpperCase()),
  name: faker.hacker.phrase().replace(/^./, (letter) => letter.toUpperCase()),
  label: faker.helpers.arrayElement(labels).value,
  role: faker.helpers.arrayElement(priorities).value,
}));

fs.writeFileSync(
  path.join(__dirname, "tasks.json"),
  JSON.stringify(tasks, null, 2)
);

console.log("✅ Tasks data generated.");
