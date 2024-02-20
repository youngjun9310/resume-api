const express = require('express')
const bodyParser = require('body-parser');
const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const authRouter = require('./routers/auth.router.js')
const userRouter = require('./routers/user.router.js')
const resumeRouter = require('./routers/resume.router.js')

const app = express()
const port = 3000


app.use(bodyParser.json());

app.use('/token', authRouter)
app.use('/resumes', userRouter)
app.use('/users', resumeRouter)

const options = {
    swaggerDefinition: {
        restapi: '3.0.0',
        info: {
            title: 'Resume API',
            version: '1.0.0',
            description: '이력서 API Swagger 문서 입니다.',
        },
    },
    apis: ['./routers/**/*.js'],
}

const specs = swaggerJsdoc(options)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})