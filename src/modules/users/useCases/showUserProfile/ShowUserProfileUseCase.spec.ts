import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "../showUserProfile/ShowUserProfileUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";

let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("ShowUserProfileUseCase", () => {
    beforeEach(() => {
        usersRepositoryInMemory = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
        showUserProfileUseCase = new ShowUserProfileUseCase(usersRepositoryInMemory);
    })

    it("should be able to create a new user and show user profile", async () => {
        const user = await createUserUseCase.execute({
            name: "johntest",
            email: "john@gmail.com",
            password: "12345678"
        });


        const userProfile = await showUserProfileUseCase.execute(String(user.id));

        expect(userProfile).toHaveProperty('id')
        expect(userProfile.name).toEqual('johntest')
    });

    it("should be receive an error on get user profile with invalid user id", async () => {
        expect(async () => {
            await showUserProfileUseCase.execute("invalid_id");
        }).rejects.toBeInstanceOf(ShowUserProfileError);
    })
})