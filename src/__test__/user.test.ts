import { Request, Response, NextFunction } from "express";
import {
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
} from "../controller/user.controllers";
import User from "../model/userModel";
import ApiFeatures from "../utiles/apiFeatures";
import i18n from 'i18n';

jest.mock("../model/userModel.ts");
jest.mock("../utiles/apiFeatures");

// Mock the i18n function
jest.mock('i18n', () => ({
  __: jest.fn().mockImplementation((key: string) => key),
}));


describe("User Controller", () => {
  describe("CreateUser", () => {
    const mockRequest = (body: any): Partial<Request> => ({
      body,
      __: i18n.__, // Add this line to mock the __ function in the request
    });

    const mockResponse = () => {
      const res = {} as Response;
      res.status = jest.fn().mockReturnValue(res);
      res.json = jest.fn().mockReturnValue(res);
      res.__ = i18n.__; 
      return res;
    };

    const mockNext = jest.fn() as NextFunction;
    it("should create a new user and return a success response", async () => {
      const req = mockRequest({
        description: "test",
        photo: "test",
        position: "test",
        username: "Hesham",
      }) as Request;
      const res = mockResponse() as Response;

      const userData = {
        description: "test",
        photo: "test",
        position: "test",
        username: "Hesham",
      };

      (User.create as jest.Mock).mockResolvedValue(userData);

      await createUser(req, res, mockNext);

      expect(User.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        data: userData,
        status: res.__(`USER.CREATED_SUCCESSFULLY`),
      });
    });
    describe("getAllUsers", () => {
      it("should return all users with pagination", async () => {
        const mockRequest = {
          query: {},
        } as unknown as Request;

        const mockResponse = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        } as unknown as Response;
        const mockNext = jest.fn() as NextFunction;

        const mockUsers = [
          { id: 1, name: "User 1" },
          { id: 2, name: "User 2" },
        ];

        (User.count as jest.Mock).mockResolvedValue(2);
        (User.findAll as jest.Mock).mockResolvedValue(mockUsers);

        const mockApiFeatures = {
          filter: jest.fn().mockReturnThis(),
          limitFields: jest.fn().mockReturnThis(),
          paginate: jest.fn().mockReturnThis(),
          query: {},
          paginationResult: {
            totalDocuments: 2,
            limit: 10,
            totalPages: 1,
            currentPage: 1,
          },
        };

        (ApiFeatures as jest.Mock).mockImplementation(() => mockApiFeatures);
        await getAllUsers(mockRequest, mockResponse, mockNext);

        expect(User.count).toHaveBeenCalled();
        expect(User.findAll).toHaveBeenCalledWith({});
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({
          pagination: {
            totalDocuments: 2,
            limit: 10,
            totalPages: 1,
            currentPage: 1,
          },
          data: mockUsers,
        });
      });
    });

    describe("updateUser", () => {
      let mockRequest: Partial<Request> & {
        params: { id?: string };
        body?: any;
        query?: any;
      };
      let mockResponse: Partial<Response>;
      let mockNext: NextFunction;

      beforeEach(() => {
        mockRequest = { params: {}, body: {}, query: {} };
        mockResponse = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
        mockNext = jest.fn();
      });

      it("should update the user and return the updated user", async () => {
        const mockUser = {
          id: 1,
          username: "oldUsername",
          position: "oldPosition",
          photo: "oldPhoto",
          description: "oldDescription",
          save: jest.fn(),
        };
        mockRequest.params.id = "1";
        mockRequest.body = {
          username: "newUsername",
          position: "newPosition",
          photo: "newPhoto",
          description: "newDescription",
        };

        (User.findByPk as jest.Mock).mockResolvedValue(mockUser);

        await updateUser(
          mockRequest as Request,
          mockResponse as Response,
          mockNext
        );

        expect(User.findByPk).toHaveBeenCalledWith("1");
        expect(mockUser.username).toBe("newUsername");
        expect(mockUser.position).toBe("newPosition");
        expect(mockUser.photo).toBe("newPhoto");
        expect(mockUser.description).toBe("newDescription");
        expect(mockUser.save).toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({ data: mockUser });
      });
    });
    describe("deleteUser", () => {
      let mockRequest: Partial<Request> & {
        params: { id?: string };
        body?: any;
        query?: any;
      };
      let mockResponse: Partial<Response>;
      let mockNext: NextFunction;

      beforeEach(() => {
        mockRequest = { params: {}, body: {}, query: {} };
        mockResponse = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
        mockNext = jest.fn();
      });
      it("should delete the user if exists", async () => {
        const mockUser = {
          id: 1,
          destroy: jest.fn(),
        };
        mockRequest.params.id = "1";

        (User.findOne as jest.Mock).mockResolvedValue(mockUser);

        await deleteUser(
          mockRequest as Request,
          mockResponse as Response,
          mockNext
        );

        expect(User.findOne).toHaveBeenCalledWith({ where: { id: "1" } });
        expect(mockUser.destroy).toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(204);
        // expect(mockResponse.json).toHaveBeenCalledWith({ status: "Success" });
      });
    });
  });
});
