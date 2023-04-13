const express = require('express');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = process.env.PORT || 3000;

// Extended: https://swagger.io/specification/#infoObject
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'Author Books API',
      description: 'API to display books by a specific author',
      contact: {
        name: 'Abrish',
      },
      servers: ['http://localhost:3000'],
    },
  },
  apis: ['./index.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Dummy data
const books = [
  { id: 1, author: 'Malcolm Gladwell', title: 'Tipping Point' },
  { id: 2, author: 'Malcolm Gladwell', title: 'Blink' },
  { id: 3, author: 'Fyodor Dostoyevsky', title: 'Crime and Punishment' },
];

/**
 * @swagger
 * /books/{author}:
 *   get:
 *     tags:
 *       - Books
 *     summary: Get books by author
 *     description: Get all books by a specific author
 *     parameters:
 *       - in: path
 *         name: author
 *         schema:
 *           type: string
 *         required: true
 *         description: Author's name
 *     responses:
 *       '200':
 *         description: A list of books by the specified author
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   author:
 *                     type: string
 *                   title:
 *                     type: string
 */
app.get('/books/:author', (req, res) => {
  const author = req.params.author;
  const authorBooks = books.filter((book) => book.author === author);
  res.json(authorBooks);
});

app.listen(port, () => console.log(`Server running on port ${port}`));
