import os
from flask import Flask, request, Response, jsonify
from functools import wraps
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import inspect
from flask_cors import CORS



# Custom error handler. Raise this exception
# to return a status_code, message, and body
class InvalidUsage(Exception):
    status_code = 400

    def __init__(self, message, status_code=None, payload=None):
        Exception.__init__(self)
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        rv = dict(self.payload or ())
        rv['message'] = self.message
        return rv


print(__name__)

app = Flask(__name__)
CORS(app)


# set the default error handler
@app.errorhandler(InvalidUsage)
def handle_invalid_usage(error):
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response


def init_db():

        # create a global variable __db__ that you can use from route handlers
        global __db__

        # use in-memory database for debugging
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'

        # app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite'
        __db__ = SQLAlchemy(app)
        engine = __db__.engine

        # put your database initialization statements here
        # create the users table
        create_table_stmt = """create table people(
            id integer primary key,
            first text not null,
            last text not null,
            email text not null,
            role text not null,
            active text not null
        );
        """
        engine.execute(create_table_stmt)

        #insert each item from USERS list into the users table
        # dummy users
        PPL = [
            (0, 'Joe', 'Bloggs', 'joe@bloggs.com', 'student', 'True'),
            (1, 'Ben', 'Bitdiddle', 'ben@cuny.edu', 'student', 'True'),
            (2, 'Alissa P', 'Hacker', 'missalissa@cuny.edu', 'professor', 'True'),
            ]

        insert_statement = """
        insert into people (id, first, last, email, role, active)
            values(?, ?, ?, ?, ?, ?)
        """

        for record in PPL:
            print(f"inserting {record[0]}")
            engine.execute(insert_statement, *record)



if __name__ == 'api':
    # save database handle in module-level global
    init_db()
    app.run(debug=True)


# Your code here...

# Problem 1
@app.route('/users', methods=['GET'])
def get_users():
    engine = __db__.engine
    print(engine.table_names())
    table = engine.execute('select * from people')
    data=[]
    for row in table:
        data.append(dict(row))
    return jsonify(data)


# Problem 2
@app.route('/users/<int:input_id>', methods=['GET'])
def get_users_id(input_id):
    engine = __db__.engine
    print(engine.table_names())
    print(input_id)

    #generate a list of ids on which to iterate
    id_table = engine.execute('select id from people')
    for _ in id_table:
        if int(_[0]) == input_id:
            print('yes')
            data=[]
            table = engine.execute('select * from people where id = ?', int(_[0]))
            for row in table:
                return jsonify(dict(row))

    raise InvalidUsage('usernot found', 404)


#Problem 3
@app.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()
    engine = __db__.engine
    id_table = engine.execute('select count(id) from people')
    number_of_ids = [id for id in id_table][0][0]

    if 'first' in data.keys() and 'last' in data.keys() and 'email' in data.keys():
        new_user = [(number_of_ids, data['first'], data['last'], data['role'],
                    data['email'], 'True')]

        insert_statement = """
        insert into people (id, first, last, role, email, active)
            values(?, ?, ?, ?, ?, ?)
        """

        for record in new_user:
            print(f"inserting {record[0]}")
            engine.execute(insert_statement, *record)
            return get_users(), 201

    else:
        return 'Unprocessable Entity', 422

# Problem 4
@app.route('/users/<int:id>', methods=['PATCH', 'PUT'])
def edit_user(id):
    #get json dump from http request
    data = request.get_json()
    engine = __db__.engine

    update_statement = """
    update people
    set first = ?
    where id = ?
    """

    id_table = engine.execute('select id from people')
    for _ in id_table:
        if int(_[0]) == id:
            engine.execute(update_statement, data['first'], id)
            return get_users_id(id)

    raise InvalidUsage('usernot found', 404)


#Problem 5
@app.route('/users/<int:id>/deactivate', methods=['POST'])
def deactivate(id):
    engine = __db__.engine
    id_table = engine.execute('select id from people')
    ids = [x[0] for x in id_table]
    update_statement = """
    update people
    set 'active' = ?
    where id = ?
    """
    if id in ids:
        engine.execute(update_statement, 'False', id)
        return get_users_id(id)
    else:
        raise InvalidUsage('usernot found', 404)
