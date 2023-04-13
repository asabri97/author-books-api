const express = require('express');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.get('/', (req, res) => {
    res.send('Welcome to the Author Books API!');
});
const port = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0', // Add this line
    info: {
      title: 'Author Books API',
      description: 'API to display books by a specific author using GPT',
      contact: {
        name: 'Abrish',
      },
      servers: ['http://localhost:3000'],
    },
  },
  apis: ['index.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const fetchBooksByAuthor = async (author) => {
  const openaiURL = 'https://api.openai.com/v1/engines/text-davinci-003/completions';
  const prompt = `List all books written by ${author}:`;
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
  };
  const data = {
    prompt,
    max_tokens: 100,
    n: 1,
    stop: null,
    temperature: 0.7,
  };

  try {
    const response = await axios.post(openaiURL, data, { headers });
    const books = response.data.choices[0].text.trim();
    return books.split(',').map((book) => ({ author, title: book.trim() }));
  } catch (error) {
    console.error('Error fetching books:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error(error.message);
    }
    return [];
  
  
  }
};

/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       properties:
 *         author:
 *           type: string
 *           description: The author of the book
 *         title:
 *           type: string
 *           description: The title of the book
 *       required:
 *         - author
 *         - title
 *
 * paths:
 *   /books/{author}:
 *     get:
 *       tags:
 *         - Books
 *       summary: Get books by author
 *       description: Get all books by a specific author
 *       parameters:
 *         - in: path
 *           name: author
 *           schema:
 *             type: string
 *           required: true
 *           description: Author's name
 *       responses:
 *         '200':
 *           description: A list of books by the specified author
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Book'
 */
app.get('/books/:author', async (req, res) => {
  const author = req.params.author;
  const authorBooks = await fetchBooksByAuthor(author);
  res.json(authorBooks);
});

app.listen(port, () => console.log(`Server running on port ${port}`));
