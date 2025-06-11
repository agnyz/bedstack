import { exit } from 'node:process';
import { db } from '@/database.providers';
import { users } from '@/users/users.schema';
import { faker } from '@faker-js/faker';

console.log('Truncating the user database');
await db.delete(users);
console.log('The database is empty: ', await db.select().from(users));

// TODO: consider using drizzle seed
// https://orm.drizzle.team/docs/seed-overview
for (let i = 0; i < 10; i++) {
  const data = {
    id: faker.number.int({ min: 1, max: 2147483647 }),
    email: faker.internet.email(),
    username: faker.internet.username(),
    password: await Bun.password.hash(faker.internet.password()),
    bio: faker.lorem.text(),
    image: faker.image.url(),
  };
  console.log('Upserting user:', data);

  await db.insert(users).values(data);
  console.log('User upserted');
}
const userResult = await db.select().from(users);
console.log('User result: ', userResult);

exit(0);
