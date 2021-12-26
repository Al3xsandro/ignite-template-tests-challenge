import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let statementRepositoryInMemory: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;

enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
}

describe("GetStatementOperationUseCase", () => {
  beforeEach(() => {
    statementRepositoryInMemory = new InMemoryStatementsRepository();
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createStatementUseCase = new CreateStatementUseCase(
        usersRepositoryInMemory,
        statementRepositoryInMemory
    );
    getStatementOperationUseCase = new GetStatementOperationUseCase(
        usersRepositoryInMemory,
        statementRepositoryInMemory
    );
  })
  
  it("should be able to get statement operations", async () => {
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

    const getStatement = await getStatementOperationUseCase.execute({ user_id: String(user.id), statement_id: String(statement.id) })
    
    expect(getStatement).toHaveProperty("id");
    expect(getStatement.amount).toBe(100);
  });

  it("should be receive an error on get statement operation with a nonexisting user", async () => {
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

    expect(async () => {
        await getStatementOperationUseCase.execute({ user_id: "invalidid", statement_id: String(statement.id) })
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  })

  it("should be receive an error on get statement operation with a nonexisting statement", async () => {
    const user = await usersRepositoryInMemory.create({
        name: "johntest",
        email: "john@gmail.com",
        password: "12345678",
    });

    expect(async () => {
        await getStatementOperationUseCase.execute({ user_id: String(user.id), statement_id: "invalidid" });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
})