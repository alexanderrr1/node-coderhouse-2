const options = {
    client: 'sqlite3',
    connection: {
        filename: './db/messages.sqlite'
    },
    useNullAsDefault: true
}

module.exports = {
    options
}