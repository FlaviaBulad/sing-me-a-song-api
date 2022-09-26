import { prisma } from "../../src/database";
import { faker } from "@faker-js/faker";
import supertest from "supertest";
import app from "../../src/app";

import recommendationFactory from "../factories/recommendationFactory";
import { clearRecommendationsTable, disconnectPrisma, insertRecommendation } from "../factories/scenarioFactory";
import { Server } from "http";

const agent = supertest(app);

beforeEach(async () => {
    await clearRecommendationsTable();
});

describe('Test recommendation routes', ()=> {
    it('Should return code 201 when successfully post a recommendation', async () => {
        const recommendation = recommendationFactory();

        const result = await agent.post('/').send(recommendation);

        const created = await prisma.recommendation.findUnique({
            where: {
                name: recommendation.name
            }
        });

         expect(result.status).toBe(201);
         expect(created).not.toBeFalsy();

    });
});

