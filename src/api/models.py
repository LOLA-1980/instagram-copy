from flask_sqlalchemy import SQLAlchemy

from datetime import datetime


db = SQLAlchemy()

"""
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)

    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            # do not serialize the password, its a security breach
        }
"""


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    avatar = db.Column(db.String, nullable=True)
    name = db.Column(db.String(20), nullable=False)
    surname = db.Column(db.String(20), nullable=False)
    username = db.Column(db.String(20), unique=True, nullable=False)
    password = db.Column(db.String(10), nullable=False)
    posts = db.relationship('Post', backref='author', lazy=True)

    def __repr__(self):
        return f'<User {self.username}>'

    def serialize(self):
        return {
            "id": self.id,
            "avatar": self.avatar,
            "name": self.name,
            "surname": self.surname,
            "username": self.username,
            # do not serialize the password, it's a security breach
        }

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    image = db.Column(db.String, nullable=False)
    message = db.Column(db.String(500), nullable=False)
    likes = db.relationship('User', secondary='post_likes', lazy='subquery',
                            backref=db.backref('liked_posts', lazy=True))
    author_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=db.func.now())
    location = db.Column(db.String(30), nullable=False)
    status = db.Column(db.String(20), nullable=False)

    def __repr__(self):
        return f'<Post {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "image": self.image,
            "message": self.message,
            "likes": [user.serialize() for user in self.likes],
            "author": self.author.serialize(),  # Serialize the author as a User object
            "created_at": self.created_at.isoformat(),
            "location": self.location,
            "status": self.status
        }


class PostLikes(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    post_id = db.Column(db.Integer, db.ForeignKey('post.id'))

    def __repr__(self):
        return f'<PostLikes {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "post_id": self.post_id
        }