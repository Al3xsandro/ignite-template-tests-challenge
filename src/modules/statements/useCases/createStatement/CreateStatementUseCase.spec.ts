import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let statementRepositoryInMemory: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;

enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
}
  

describe("CreateStatementUseCase", () => {
  beforeEach(() => {
    statementRepositoryInMemory = new InMemoryStatementsRepository();
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createStatementUseCase = new CreateStatementUseCase(
        usersRepositoryInMemory,
        statementRepositoryInMemory
    );
  })
  
  it("should be able to create a new statement and deposit 100 amount", async () => {
    const user = await usersRepositoryInMemory.create({
        name: "johntest",
        email: "john@gmail.com",
        password: "12345678",
    });

    const statement = await createStatementUseCase.execute({
        amount: 100,
        user_id: `${user.id}`,
        description: 'test create statement',
        type: "deposit" as OperationType,
    });

    expect(statement).toHaveProperty("id");
    expect(statement.amount).toEqual(100);
  });

  it("should be to receive an error on create a new statement with insufficient amount", async () => {
    const user = await usersRepositoryInMemory.create({
        name: "johntest",
        email: "john@gmail.com",
        password: "12345678",
    });
    
    expect(async () => {
        await createStatementUseCase.execute({
            amount: 200,
            user_id: `${user.id}`,
            description: 'test create statement',
            type: 'withdraw' as OperationType,
        });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });

  it("should be receive an error with create a new statement with a nonexisting user", async () => {
    expect(async () => {
        await createStatementUseCase.execute({
            amount: 100,
            user_id: "invaliduserid",
            description: 'test create statement',
            type: "deposit" as OperationType,
        });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  })
})