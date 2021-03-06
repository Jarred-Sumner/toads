export default (sequelize, DataTypes) => {
  const session_conversations = sequelize.define(
    'session_conversations',
    {
      session_id: DataTypes.INTEGER,
      conversation_id: DataTypes.UUID,
      identity_id: DataTypes.UUID,
      participation_status: {
        type: DataTypes.ENUM('auto', 'explicit_opt_in', 'declined', 'expired'),
        defaultValue: 'auto',
        allowNull: false,
      },
      visibility: {
        type: DataTypes.ENUM('open', 'minimize', 'dismiss'),
        defaultValue: 'open',
        allowNull: false,
      },
      toggled_at: {
        type: DataTypes.DATE,
        defaultValue: sequelize.fn('now'),
        allowNull: false,
      },
    },
    { underscored: true }
  )
  session_conversations.associate = models => {
    session_conversations.belongsTo(models.session, {
      foreign_key: 'session_id',
    })
    models.session.hasMany(session_conversations, {
      foreign_key: 'session_id',
    })

    session_conversations.belongsTo(models.identity, {
      foreign_key: 'identity_id',
    })
    models.identity.hasMany(session_conversations, {
      foreign_key: 'identity_id',
    })

    models.conversation.hasMany(session_conversations, {
      foreignKey: 'conversation_id',
    })
    session_conversations.belongsTo(models.conversation, {
      foreignKey: 'conversation_id',
    })
  }
  return session_conversations
}
