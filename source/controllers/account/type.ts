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
        recipient: Account!
        amount: Float!
        timestamp: String!
    }

    type Query {
        balance: Float!
        transactions: [Transaction]
    }

    type Mutation {
        transfer(email: String!, amount: Float!): Transaction
    }
`;
