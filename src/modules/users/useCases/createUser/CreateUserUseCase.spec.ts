import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { CreateUserError } from "./CreateUserError";

let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("CreateUserUseCase", () => {
    beforeEach(() => {
        usersRepositoryInMemory = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    })

    it("should be able to create a new user", async () => {
        const user = await createUserUseCase.execute({
            name: "johntest",
            email: "john@gmail.com",
            password: "12345678"
        });

        expect(user).toHaveProperty('id');
        expect(user).toEqual(user);
        expect(user.name).toEqual("johntest");
    });

    it("should be receive an error on create user with existing email", async () => {
        await createUserUseCase.execute({
            name: "johntest",
            email: "john@gmail.com",
            password: "12345678"
        });

        expect(async () => {
            await createUserUseCase.execute({
                name: "johntest",
                email: "john@gmail.com",
                password: "12345678"
            })
        }).rejects.toBeInstanceOf(CreateUserError);
    })
})