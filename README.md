# nodejsdemo
# Dev Environment
-- Please create dev.env file under config folder if not exists and define below environment variables
1. PORT: Need to define if need to use other then 3000
2. JWT_SECRET: secret for jsonwebtoken which will be used to generate authorization token
3. MONGODB_CONN_URL: mongodb connection url with database
4. BCRYPT_SALT_ROUNDS:Number of salt rounds to create encrypted password using bcrypt

# Test Environment
-- Please create test.env file under config folder if not exists and define below environment variables
1. PORT: Need to define if need to use other then 3000
2. JWT_SECRET: secret for jsonwebtoken which will be used to generate authorization token
3. MONGODB_CONN_URL: mongodb connection url with database
4. BCRYPT_SALT_ROUNDS:Number of salt rounds to create encrypted password using bcrypt

# Staging Environment
-- Please create staging.env file under config folder if not exists and define below environment variables
1. PORT: Need to define if need to use other then 3000
2. JWT_SECRET: secret for jsonwebtoken which will be used to generate authorization token
3. MONGODB_CONN_URL: mongodb connection url with database
4. BCRYPT_SALT_ROUNDS:Number of salt rounds to create encrypted password using bcrypt

# Production Environment
-- Please create production.env file under config folder if not exists and define below environment variables
1. PORT: Need to define if need to use other then 3000
2. JWT_SECRET: secret for jsonwebtoken which will be used to generate authorization token
3. MONGODB_CONN_URL: mongodb connection url with database
4. BCRYPT_SALT_ROUNDS:Number of salt rounds to create encrypted password using bcrypt

-- To access and perform CRUD operation with product need to set header for Authorization Bearer Token which will be received via response of user registration or login endpoint