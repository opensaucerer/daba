export default `

    type Wallet {
        id: ID!
        balance: Float!
        owner: Account!
        currency: String!
    }

    type Transaction {
        id: ID!
        sender: Account!
        recipient: Account
        amount: Float!
        timestamp: String!
        session: String!
        type: String!
    }

    type Query {
        balance: Float!
        transactions(limit: Int, offset: Int, sort: String): [Transaction]
    }

    type Mutation {
        deposit(amount: Float!): Transaction
        transfer(email: String!, amount: Float!): Transaction
    }
`;
