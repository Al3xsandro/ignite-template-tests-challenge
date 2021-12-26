import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let statementRepositoryInMemory: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;
let getBalanceUseCase: GetBalanceUseCase;

enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
}

describe("GetBalanceUseCase", () => {
  beforeEach(() => {
    statementRepositoryInMemory = new InMemoryStatementsRepository();
    usersRepositoryInMemory = new InMemoryUsersRepository();
    getBalanceUseCase = new GetBalanceUseCase(
        statementRepositoryInMemory,
        usersRepositoryInMemory
    );
    createStatementUseCase = new CreateStatementUseCase(
        usersRepositoryInMemory,
        statementRepositoryInMemory
    );
  })
  
  it("should be able get user balance", async () => {
    const user = await usersRepositoryInMemory.create({
        name: "johntest",
        email: "john@gmail.com",
        password: "12345678",
    });

    const statement = await createStatementUseCase.execute({
        amount: 100,
        user_id: String(user.id),
        description: 'test create statement',
        type: "deposit" as OperationType,
    });

    const balance = await getBalanceUseCase.execute({ user_id: statement.user_id });

    expect(balance).toHaveProperty('balance');
    expect(balance.balance).toBe(100);
  });

  it("should receive an error on get balance with a nonexisting user", async () => {
      expect(async () => {
        await getBalanceUseCase.execute({ user_id: "invaliduserid" });
      }).rejects.toBeInstanceOf(GetBalanceError);
  })
})