import { faker } from "@faker-js/faker";
import User from "./model/userModel";

const generateUsers = async () => {
  const usersData: any[] = [];
  for (let i = 0; i < 10; i++) {
    const userData = {
      username: faker.internet.userName(),
      position: faker.name.jobTitle(),
      photo: faker.image.avatar(),
      description: faker.lorem.sentence(),
    };
    usersData.push(userData);
  }
  return usersData;
};

// function to seed users
export const seedUsers = async () => {
  const users = await generateUsers();
  await User.bulkCreate(users);
};
