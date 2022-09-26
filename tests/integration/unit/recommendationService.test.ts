import { jest } from "@jest/globals";

import { recommendationRepository } from "../../../src/repositories/recommendationRepository";
import { recommendationService } from "../../../src/services/recommendationsService";
import recommendationFactory from "../../factories/recommendationFactory";

beforeEach(() => {
  jest.resetAllMocks();
  jest.clearAllMocks();
});
