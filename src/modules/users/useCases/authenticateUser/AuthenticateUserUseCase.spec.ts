import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe("AuthenticateUserUseCase", () => {
    beforeEach(() => {
        usersRepositoryInMemory = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
        authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory)
    })

    it("should be able to create a new user and show user profile", async () => {
        await createUserUseCase.execute({
            name: "johntest",
            email: "john@gmail.com",
            password: "12345678"
        });

        const result = await authenticateUserUseCase.execute({
            email: "john@gmail.com",
            password: "12345678"
        });

        expect(result).toHaveProperty('token');
    });

    it("should be to receive an error on authenticate with invalid user email", async () => {
        expect(async () => {
            await authenticateUserUseCase.execute({
                email: "john@gmail.com",
                password: "12345678"
            });
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
    })

    it("should be to receive an error on authenticate with incorrect user password", async () => {
        await createUserUseCase.execute({
            name: "johntest",
            email: "john@gmail.com",
            password: "12345678"
        });

        expect(async () => {
            await authenticateUserUseCase.execute({
                email: "john@gmail.com",
                password: "incorrectpassword"
            });
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
    })
})