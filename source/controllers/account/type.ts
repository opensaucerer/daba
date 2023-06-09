export default `

    type Account {
        id: ID!
        name: String!
        email: String!
    }

    type LoginResponse {
        account: Account
        token: String
    }

    type Query {
        account: Account
    }

    type Mutation {
        register(name: String!, email: String!, password: String!): Account
        login(email: String!, password: String!): LoginResponse
    }
`;
