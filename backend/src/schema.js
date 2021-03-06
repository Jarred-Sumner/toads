import { makeExecutableSchema } from 'graphql-tools'
import resolvers from './resolverDefinition'

const typeDefs = `
scalar DateTime
scalar JSON
scalar Date

enum auth_type {
  anonymous
  account
}

interface IdentityBase {
  id: ID!
  name: String
}

type Identity implements IdentityBase {
  id: ID!
  name: String
}

type PersonalIdentity implements IdentityBase {
  id: ID!
  name: String
  expires_at: DateTime
  email: String
}

# Copied from https://github.com/Jarred-Sumner/toads/blob/ce2e651625d56fafd415f5ebe466cb40eb3b20de/frontend/components/Gradient.js#L1
enum BoardColorScheme {
  blue
  purple_red
  pink
  slate
  red
  green
}

type Board {
  id: ID!
  label: String
  threads(page: Int): [Thread]
  thread(id: ID!): Thread
  identity: PersonalIdentity
  color_scheme: BoardColorScheme
  activity: BoardActivity
  board_conversation: BoardConversation
  expires_at: DateTime
}

type BoardActivity {
  active_count: Int
  active_identities: [Identity]
}

interface Post {
  id: ID!
  created_at: DateTime
  body: String
  identity: Identity
  attachment: Attachment
}

type Reply implements Post {
  id: ID!
  created_at: DateTime
  body: String
  identity: Identity
  attachment: Attachment
  parent: ID
}

type Message implements Post {
  id: ID!
  created_at: DateTime
  body: String
  identity: Identity
  attachment: Attachment
}

type Thread implements Post {
  id: ID!
  created_at: DateTime
  body: String
  identity: Identity
  attachment: Attachment
  expires_at: DateTime
  replies: [Reply]
  reply_count: Int
}

type Query {
  Board(id:ID!): Board
  Conversation(id: ID!): Conversation
  ActiveConversations: [Conversation]
}

enum AttachmentType {
  file
}

type AttachmentMetadata {
  width: Int
  height: Int
  wUnits: String
  hUnits: String
  type: String
  size: Int
}

type NewAttachment {
  id: ID!
  signed_url: String!
}

type Attachment {
  id: ID!
  type: AttachmentType
  mimetype: String
  filename: String
  url: String
  metadata: AttachmentMetadata
}

type BoardMutation {
  Post(parent_id: ID, body: String!, attachment_id: ID): Post
  StartDirectConversation(target: ID!): Conversation
  Activity(visible: Boolean!): BoardActivity
}

enum Visibility {
  open
  minimize
  dismiss
}

enum ParticipationStatus {
  auto
  explicit_opt_in
  declined
  expired
}

type Mutation {
  Attachment(mimetype: String!, filename: String!): NewAttachment
  Board(id:ID!): BoardMutation
  Session(email_token: String!): String
  Message(conversation_id: ID!, body: String, attachment_id: ID): Message
  Login(email: String!): Boolean
  ConversationState(conversation_id: ID!, participation_status: ParticipationStatus, visibility: Visibility): Conversation
  ConversationTyping(conversation_id: ID!, is_typing: Boolean!): Boolean
}

interface Conversation {
  id: ID!
  participation_status: ParticipationStatus
  visibility: Visibility
  toggled_at: DateTime
  messages(limit: Int, offset: Int): [Message]
  active_participants: JSON
  participants: [Identity]
  user_identity: PersonalIdentity
  board: Board
  typing: [Identity]
  expiry_date: DateTime
}

type DirectConversation implements Conversation {
  id: ID!
  participation_status: ParticipationStatus
  visibility: Visibility
  toggled_at: DateTime
  messages(limit: Int, offset: Int): [Message]
  active_participants: JSON
  participants: [Identity]
  user_identity: PersonalIdentity
  board: Board
  typing: [Identity]
  expiry_date: DateTime
}

type BoardConversation implements Conversation {
  id: ID!
  participation_status: ParticipationStatus
  visibility: Visibility
  toggled_at: DateTime
  messages(limit: Int, offset: Int): [Message]
  active_participants: JSON
  participants: [Identity]
  user_identity: PersonalIdentity
  board: Board
  typing: [Identity]
  expiry_date: DateTime
}

type Subscription {
  VisibleConversations: Conversation # Conversations the user is participating in
  ConversationActivity(conversation_id: ID!): Conversation # Updates for a conversation, e.g. typing
  BoardActivity(board: ID!): BoardActivity
  ConversationMessages(conversation_id: ID!): Message
}
`

const schema = makeExecutableSchema({ typeDefs, resolvers })
export default schema
