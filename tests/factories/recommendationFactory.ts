import { faker } from "@faker-js/faker"

export default function recommendationFactory(){
    return {
        name: faker.lorem.words(3),
        youtubeLink: faker.internet.url()
    }
}