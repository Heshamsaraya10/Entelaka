import { Request, Response, NextFunction } from "express";
import {
  addDataToPage,
  getDataFromPage,
  updateDataFromPage,
} from "../controller/aboutUsPage.controllers";
import AboutPage from "../model/aboutUsPageModel";
import User from "../model/userModel";

jest.mock("../model/aboutUsPageModel");

describe("About us page controller", () => {
  describe("addDataToPage", () => {
    it("should create an AboutPage and return success response", async () => {
      const req = {
        body: {
          header: { title: "Test Header" },
          footer: "Test Footer",
          description: "Test Description",
          userId: 1,
        },
        files: {
          headerImages: [{ path: "imagePath1" }, { path: "imagePath2" }],
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const next = jest.fn() as NextFunction;

      (AboutPage.create as jest.Mock).mockResolvedValue({
        id: 1,
        header: { title: "Test Header", image: ["imagePath1", "imagePath2"] },
        description: "Test Description",
        footer: "Test Footer",
        userId: 1,
      });

      await addDataToPage(req, res, next);

      expect(AboutPage.create).toHaveBeenCalledWith({
        header: { title: "Test Header", image: ["imagePath1", "imagePath2"] },
        description: "Test Description",
        footer: "Test Footer",
        userId: 1,
      });

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: "Success",
        data: {
          id: 1,
          header: { title: "Test Header", image: ["imagePath1", "imagePath2"] },
          description: "Test Description",
          footer: "Test Footer",
          userId: 1,
        },
      });
    });
  });
  describe("Get Data From Page", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
      req = {
        params: {
          id: "1",
        },
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      next = jest.fn();
    });

    it("should retrieve an AboutPage and return success response", async () => {
      const mockAboutPage = {
        id: 1,
        header: "Test Header",
        description: "Test Description",
        footer: "Test Footer",
        userId: 1,
        User: {
          username: "TestUser",
        },
      };

      (AboutPage.findOne as jest.Mock).mockResolvedValue(mockAboutPage);
      await getDataFromPage(req as Request, res as Response, next);

      expect(AboutPage.findOne).toHaveBeenCalledWith({
        where: {
          id: "1",
        },
        include: [
          {
            model: User,
            attributes: ["username"],
          },
        ],
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: "Success",
        data: mockAboutPage,
      });
    });
  });
  describe("Update Data From Page", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
      req = {
        params: { id: "1" },
        body: {
          header: "Updated Header",
          description: "Updated Description",
          footer: "Updated Footer",
          userId: 1,
        },
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      next = jest.fn();
    });
    it("Update page data", async () => {
      const mockUpdatedPage = {
        id: 1,
        header: "Updated Header",
        description: "Updated Description",
        footer: "Updated Footer",
        userId: 1,
      };

      (AboutPage.update as jest.Mock).mockResolvedValue([1]);
      (AboutPage.findByPk as jest.Mock).mockResolvedValue(mockUpdatedPage);

      await updateDataFromPage(req as Request, res as Response, next);

      expect(AboutPage.update).toHaveBeenCalledWith(
        {
          header: "Updated Header",
          description: "Updated Description",
          footer: "Updated Footer",
          userId: 1,
        },
        { where: { id: "1" } }
      );

      expect(AboutPage.findByPk).toHaveBeenCalledWith("1");

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: mockUpdatedPage });
    });
  });
});
