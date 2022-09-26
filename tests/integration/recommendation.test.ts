import { prisma } from "../../src/database";
import { faker } from "@faker-js/faker";
import supertest from "supertest";
import app from "../../src/app";

import recommendationFactory from "../factories/recommendationFactory";
import { clearRecommendationsTable, disconnectPrisma, insertRecommendation } from "../factories/scenarioFactory";

const agent = supertest(app);

beforeEach(async () => {
    await clearRecommendationsTable();
});

describe('Test POST /recommendation routes', ()=> {
    it('Should return status code 201 when successfully post a recommendation', async () => {
        const recommendation = recommendationFactory();

        const result = await agent.post('/recommendations').send(recommendation);

        const created = await prisma.recommendation.findUnique({
            where: {
                name: recommendation.name
            }
        });

         expect(result.status).toBe(201);
         expect(created).not.toBeFalsy();

    });

    it(`Should return status code 409 when trying to insert a recommendation with the same name`, async() => {
    const recommendation = recommendationFactory();

    await agent.post('/recommendations').send(recommendation);
    
    const result = await agent.post('/recommendations').send(recommendation);
expect(result.status).toBe(409);
});
});

