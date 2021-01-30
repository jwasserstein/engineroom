## Todo

## Models
- users
    - username
    - password
    - joinDate
    - firstName
    - lastName
    - bio
    - imageUrl
    - cars (ObjectIds)
    - posts (ObjectIds)
    - friends (ObjectIds)
- posts
    - user (ObjectId, populate for name and imageurl)
    - comments (ObjectIds)
    - likers (array of user ObjectIds)
    - date
    - text
- comments
    - user (ObjectId)
    - post (ObjectId)
    - text
- cars
    - user (ObjectId)
    - name
    - imageUrl
    - mods
    - accelTime
    - power
    - torque

## Routes
- users
    - sign up (create user)
    - sign in
    - get user (populate cars, posts, and comments)
    - get random users
    - toggle friend
- posts
    - create post
    - toggle like on post
    - get posts from friends
- comments
    - create comment
    - delete comment
- cars
    - create car
    - get random cars