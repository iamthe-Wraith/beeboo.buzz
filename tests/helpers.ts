import { faker } from "@faker-js/faker";

/**
 * had to add this because was having issues with faker-js
 * and duplicate emails during concurrent tests.
 * 
 * @returns string - an email address;
 */
export const getEmail = () => {
    return `${faker.internet.userName()}-${new Date().getTime() + getRandomInt(10000, 100000)}@${faker.internet.domainName()}`;
}

export const getRandomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * had to add this because was having issues with faker-js
 * and duplicate usernames during concurrent tests.
 * 
 * @returns string - a username;
 */
export const getUsername = () => {
    const username = `${faker.internet.userName()}-${new Date().getTime() + getRandomInt(10000, 100000)}`;
    return username.replace(/[^a-zA-Z0-9-_]/g, '');
}