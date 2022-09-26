import { prisma } from "../../src/database";
import supertest from "supertest";
import app from "../../src/app";

import recommendationFactory from "../factories/recommendationFactory";
import {
  clearRecommendationsTable,
  disconnectPrisma,
} from "../factories/scenarioFactory";

const agent = supertest(app);

beforeEach(async () => {
  await clearRecommendationsTable();
});

describe("Test route POST /recommendations", () => {
  it("Should return status code 201 when successfully post a recommendation", async () => {
    const recommendation = recommendationFactory();

    const result = await agent.post("/recommendations").send(recommendation);

    const created = await prisma.recommendation.findUnique({
      where: {
        name: recommendation.name,
      },
    });

    expect(result.status).toBe(201);
    expect(created).not.toBeFalsy();
  });

  it(`Should return status code 409 when trying to insert a recommendation with the same name`, async () => {
    const recommendation = recommendationFactory();

    await agent.post("/recommendations").send(recommendation);

    const result = await agent.post("/recommendations").send(recommendation);
    expect(result.status).toBe(409);
  });
});

describe("Test route POST '/recommendations/:id/upvote'", () => {
  it("Should return status code 200 when successfully upvoted", async () => {
    const recommendation = recommendationFactory();
    await agent.post("/recommendations").send(recommendation);

    const getRecommendation = await agent.get("/recommendations").send();

    const result = await agent
      .post(`/recommendations/${getRecommendation.body[0].id}/upvote`)
      .send();
    expect(result.status).toBe(200);
  });

  it(`Should return status code 404 when
        sent an id that does not exist`, async () => {
    const result = await agent.post(`/recommendations/${-1}/upvote`).send();
    expect(result.status).toBe(404);
  });
});

describe("Test route POST '/recommendations/:id/downvote'", () => {
  it("Should return status code 200 when successfully downvoted ", async () => {
    const recommendation = recommendationFactory();
    await agent.post("/recommendations").send(recommendation);

    const getRecommendation = await agent.get("/recommendations").send();

    const result = await agent
      .post(`/recommendations/${getRecommendation.body[0].id}/downvote`)
      .send();
    expect(result.status).toBe(200);
  });

  it(`Should return status code 404 when
        sent an id that does not exist`, async () => {
    const result = await agent.post(`/recommendations/${-1}/downvote`).send();
    expect(result.status).toBe(404);
  });
});

describe("Test route GET '/recommendations'", () => {
  it("Should return an array when successfull", async () => {
    const recommendation = recommendationFactory();
    await agent.post("/recommendations").send(recommendation);

    const result = await agent.get("/recommendations").send();
    expect(result.body).toBeInstanceOf(Array);
  });
});

describe("Test route GET '/recommendations/random'", () => {
  it("Should return an object when successfull", async () => {
    const recommendation = recommendationFactory();
    await agent.post("/recommendations").send(recommendation);

    const result = await agent.get("/recommendations/random").send();
    expect(result.body).toBeInstanceOf(Object);
  });
  it(`Should return status code 404 when 0 recommendations posted`, async () => {
    const result = await agent.get("/recommendations/random").send();
    expect(result.status).toBe(404);
  });
});

describe("Test route GET '/recommendations/top/:amount'", () => {
  it("Should return an array when successfull", async () => {
    const recommendation = recommendationFactory();
    await agent.post("/recommendations").send(recommendation);

    const result = await agent.get(`/recommendations/top/${5}`).send();
    expect(result.body).toBeInstanceOf(Array);
  });
});

describe("Test route GET '/recommendations/:id'", () => {
  it("Should return an object when successfull", async () => {
    const recommendation = recommendationFactory();
    await agent.post("/recommendations").send(recommendation);

    const random = await agent.get("/recommendations/random").send();

    const result = await agent.get(`/recommendations/${random.body.id}`).send();
    expect(result.body).toBeInstanceOf(Object);
  });

  it(`Should return status code 404 when trying to get recommendation that does not exist`, async () => {
    const result = await agent.get(`/recommendations/${-1}`).send();
    expect(result.status).toBe(404);
  });
});

afterAll(async () => await disconnectPrisma());
