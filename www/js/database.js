/*General database operation helpers */

function executeSqlStatement(db, sql, parameters){
    var $d = $.Deferred();
    db.transaction(function(tx) {
        tx.executeSql(
            sql,
            parameters,
            function(tx, rs) {
                $d.resolve(rs);
                console.log('Sql statement: "' + sql + '" executed successfully')
            },
            function(tx, error) {
                $d.reject(error)
                console.log('Sql statement: "' + sql + '" failed');
            } )
    })
    return $d.promise();
}

/*DML for Timer table*/
function createTimerTableIfNotExists(db){
    return executeSqlStatement(db, "CREATE TABLE IF NOT EXISTS Timer (id INTEGER PRIMARY KEY AUTOINCREMENT, \
name TEXT NOT NULL, hour INT, minute INT, second INT, src TEXT)");
}

function deleteTimerTableIfExists(db){
    return executeSqlStatement(db, "DROP TABLE IF EXISTS Timer");
}


/*CRUD operations on Timer table*/
function getAllTimers(db){
    return  executeSqlStatement(db, "SELECT id, name, hour, minute, second FROM Timer ORDER BY name");
}

function insertNewTimerData(db, name, hour, minute, second, src) {
    console.log("Inserting sound: " + src);
    return executeSqlStatement(db, "INSERT INTO Timer (name, hour, minute, second, src) VALUES  (?, ?, ?, ?, ?)", [name, hour, minute, second, src])
}

function updateTimerData(db, name, hour, minute, second, src, id) {
    console.log("Updating sound: " + src);
    return executeSqlStatement(db, "UPDATE Timer SET name=?, hour=?, minute=?, second=?, src=? WHERE id=? ", [name, hour, minute, second, src, id]);
}

function getSingleTimerData(db, id) {
    return executeSqlStatement(db, "SELECT name, hour, minute, second, src FROM Timer WHERE id=?", [id]);
}

function deleteTimerData(db, id) {
    return executeSqlStatement(db, "DELETE FROM Timer WHERE id=?", [id]);
}